import json
import logging
import re
import threading
from dataclasses import dataclass, field
from django.conf import settings
from scanner.constants import ThreatType
from scanner.services.prompts import AI_SYSTEM_PROMPT, build_user_prompt

logger = logging.getLogger("phishguard")

URL_STRIPPER = re.compile(r"https?://[^\s]+|www\.[^\s]+", re.IGNORECASE)
EMAIL_STRIPPER = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+", re.IGNORECASE)

CERTAINTY_REPLACEMENTS = {
    re.compile(r"\bdefinitely\b", re.IGNORECASE): "likely",
    re.compile(r"\b100%\b"): "highly",
    re.compile(r"\bguaranteed safe\b", re.IGNORECASE): "appearing safe",
    re.compile(r"\bcertified\b", re.IGNORECASE): "indicated",
}


@dataclass
class AIResult:
    status: str  # "ok" | "failed" | "skipped"
    threat_type: str = ThreatType.UNKNOWN
    ai_score: int | None = None
    confidence: float | None = None
    explanation: str = ""
    key_signals: list[str] = field(default_factory=list)
    model_name: str = ""

    @classmethod
    def skipped(cls) -> "AIResult":
        return cls(status="skipped")

    @classmethod
    def failed(cls, model_name: str = "") -> "AIResult":
        return cls(status="failed", model_name=model_name)


def sanitize_explanation(text: str) -> str:
    """Removes live URLs, emails, and certainty claims from explanation."""
    if not text:
        return ""

    # Remove URLs and emails
    clean = URL_STRIPPER.sub("[link]", text)
    clean = EMAIL_STRIPPER.sub("[email]", clean)

    # Replace certainty words
    for pattern, replacement in CERTAINTY_REPLACEMENTS.items():
        clean = pattern.sub(replacement, clean)

    clean = re.sub(r"\s+", " ", clean).strip()
    return clean[:700]


def parse_and_validate_ai_response(raw_text: str, model_name: str) -> AIResult:
    """Safely extracts JSON from model output and validates structure and bounds."""
    if not raw_text or not raw_text.strip():
        return AIResult.failed(model_name)

    cleaned = raw_text.strip()
    # Strip markdown code blocks
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Attempt to find JSON object substring
        json_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group(0))
            except Exception:
                return AIResult.failed(model_name)
        else:
            return AIResult.failed(model_name)

    if not isinstance(data, dict):
        return AIResult.failed(model_name)

    # 1. Threat Type validation
    raw_threat = str(data.get("threat_type", "")).lower().strip()
    threat_type = raw_threat if raw_threat in ThreatType.values else ThreatType.UNKNOWN

    # 2. Risk score validation (0 - 100)
    try:
        raw_score = data.get("risk_score")
        if raw_score is None:
            return AIResult.failed(model_name)
        ai_score = max(0, min(100, int(round(float(raw_score)))))
    except (ValueError, TypeError):
        return AIResult.failed(model_name)

    # 3. Confidence validation (0.0 - 1.0)
    try:
        raw_conf = data.get("confidence", 0.5)
        conf_float = float(raw_conf)
        if conf_float > 1.0:
            conf_float = conf_float / 100.0  # normalize 0-100 to 0.0-1.0
        confidence = max(0.0, min(1.0, round(conf_float, 2)))
    except (ValueError, TypeError):
        confidence = 0.5

    # 4. Key signals validation
    raw_signals = data.get("key_signals", [])
    key_signals = []
    if isinstance(raw_signals, list):
        for sig in raw_signals[:5]:
            if isinstance(sig, str) and sig.strip():
                clean_sig = sanitize_explanation(sig)[:80]
                if clean_sig:
                    key_signals.append(clean_sig)

    # 5. Explanation validation
    raw_exp = str(data.get("explanation", ""))
    explanation = sanitize_explanation(raw_exp)

    return AIResult(
        status="ok",
        threat_type=threat_type,
        ai_score=ai_score,
        confidence=confidence,
        explanation=explanation,
        key_signals=key_signals,
        model_name=model_name,
    )


def _call_gemini(user_prompt: str, api_key: str, model_name: str, timeout: float) -> tuple[str, str]:
    import google.generativeai as genai

    genai.configure(api_key=api_key)

    # Primary model + automatic fallback models for maximum reliability
    models_to_try = [model_name]
    fallback_candidates = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"]
    for candidate in fallback_candidates:
        if candidate not in models_to_try:
            models_to_try.append(candidate)

    for current_model_name in models_to_try:
        result_container = {"text": None, "error": None}

        def target(m_name=current_model_name):
            try:
                model = genai.GenerativeModel(
                    model_name=m_name,
                    system_instruction=AI_SYSTEM_PROMPT,
                    generation_config={"temperature": 0.1, "response_mime_type": "application/json"},
                )
                response = model.generate_content(user_prompt)
                if response and response.text:
                    result_container["text"] = response.text
            except Exception as e:
                result_container["error"] = e

        thread = threading.Thread(target=target)
        thread.start()
        thread.join(timeout=timeout)

        if thread.is_alive():
            logger.warning("Gemini AI call timed out for model %s after %s seconds", current_model_name, timeout)
            continue

        if result_container["error"]:
            logger.warning("Gemini AI API call error for %s: %s", current_model_name, type(result_container["error"]).__name__)
            continue

        if result_container["text"]:
            return result_container["text"], current_model_name

    return "", model_name


def analyze(
    text: str,
    scan_type: str = "message",
    meta: dict | None = None,
    url: str | None = None,
) -> AIResult:
    """
    Analyzes content with Gemini AI.
    Never raises an exception — returns AIResult with status 'ok', 'failed', or 'skipped'.
    """
    if not getattr(settings, "AI_ENABLED", False):
        return AIResult.skipped()

    api_key = getattr(settings, "GEMINI_API_KEY", "")
    if not api_key:
        return AIResult.skipped()

    model_name = getattr(settings, "AI_MODEL", "gemini-2.0-flash")
    timeout = getattr(settings, "AI_TIMEOUT_SECONDS", 12.0)

    try:
        user_prompt = build_user_prompt(scan_type, text, meta, url)
        raw_response, used_model = _call_gemini(user_prompt, api_key, model_name, timeout)
        if not raw_response:
            return AIResult.failed(used_model or model_name)

        return parse_and_validate_ai_response(raw_response, used_model or model_name)
    except Exception as e:
        logger.warning("Unexpected error during AI analysis: %s", type(e).__name__)
        return AIResult.failed(model_name)
