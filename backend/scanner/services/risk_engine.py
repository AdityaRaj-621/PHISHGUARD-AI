from dataclasses import dataclass, field
from scanner.constants import RiskLevel, ThreatType, IndicatorType
from scanner.services.rule_engine import RuleResult
from scanner.services.url_analyzer import UrlResult
from scanner.services.ai_analyzer import AIResult


@dataclass
class FinalResult:
    risk_score: int
    risk_level: str
    threat_type: str
    summary: str
    analysis_mode: str
    score_breakdown: dict = field(default_factory=dict)


def level_for_score(score: int) -> str:
    if score <= 30:
        return RiskLevel.LOW
    elif score <= 60:
        return RiskLevel.MEDIUM
    elif score <= 80:
        return RiskLevel.HIGH
    else:
        return RiskLevel.CRITICAL


SUMMARY_TEMPLATES = {
    RiskLevel.LOW: "No strong scam indicators were found. Stay cautious anyway — this isn't proof the content is genuine.",
    RiskLevel.MEDIUM: "Some suspicious signals were found. Verify through an official channel before acting.",
    RiskLevel.HIGH: "Several strong scam indicators were found. Treat this as unsafe until you verify directly.",
    RiskLevel.CRITICAL: "This matches the pattern of a known scam type. Do not interact with it.",
    RiskLevel.UNKNOWN: "Unable to determine threat level with confidence. Exercise standard caution.",
}


def resolve_threat_type(
    rule_result: RuleResult,
    url_result: UrlResult | None,
    ai_result: AIResult,
    final_score: int,
) -> str:
    # 1. AI result if confident
    if (
        ai_result.status == "ok"
        and (ai_result.confidence or 0.0) >= 0.6
        and ai_result.threat_type not in (ThreatType.UNKNOWN, ThreatType.NONE)
    ):
        return ai_result.threat_type

    # 2. Rule engine category votes
    if rule_result.threat_hints:
        sorted_hints = sorted(rule_result.threat_hints.items(), key=lambda item: item[1], reverse=True)
        if sorted_hints and sorted_hints[0][1] > 0:
            return sorted_hints[0][0]

    # 3. URL scan with score >= 40
    if url_result and url_result.score >= 40:
        return ThreatType.SUSPICIOUS_URL

    # 4. Low risk -> none; else unknown
    if final_score <= 30:
        return ThreatType.NONE

    return ThreatType.UNKNOWN


def combine(
    rule_result: RuleResult,
    url_result: UrlResult | None,
    ai_result: AIResult,
) -> FinalResult:
    """
    Combines rule engine, URL analyzer, and AI analyzer results into a single calibrated risk assessment.
    """
    url_points = (url_result.score * 0.5) if url_result else 0
    rule_component = max(0, min(100, round(rule_result.score + url_points)))

    floors_applied: list[str] = []

    if ai_result.status == "ok" and ai_result.ai_score is not None:
        final_score = round(rule_component * 0.6 + ai_result.ai_score * 0.4)
        analysis_mode = "rules_ai"
    else:
        final_score = rule_component
        analysis_mode = "rules_only"

    # Decisive floors
    if url_result and url_result.ip_host:
        if final_score < 70:
            final_score = 70
            floors_applied.append("ip_host")

    if url_result and url_result.lookalike_of:
        if final_score < 75:
            final_score = 75
            floors_applied.append("lookalike_domain")

    if rule_result.has(IndicatorType.CREDENTIAL_REQUEST) and url_result:
        if final_score < 80:
            final_score = 80
            floors_applied.append("credential_request+url")

    # Thin-evidence ceiling
    if len(rule_result.indicators) <= 1 and not url_result and ai_result.status != "ok":
        final_score = min(final_score, 45)

    final_score = max(0, min(100, final_score))
    risk_level = level_for_score(final_score)
    threat_type = resolve_threat_type(rule_result, url_result, ai_result, final_score)
    summary = SUMMARY_TEMPLATES.get(risk_level, SUMMARY_TEMPLATES[RiskLevel.LOW])

    score_breakdown = {
        "rule_score": rule_result.score,
        "url_score": url_result.score if url_result else None,
        "ai_score": ai_result.ai_score if (ai_result.status == "ok") else None,
        "weights": {"rule": 0.6, "ai": 0.4} if analysis_mode == "rules_ai" else {"rule": 1.0, "ai": 0.0},
        "floors_applied": floors_applied,
    }

    return FinalResult(
        risk_score=final_score,
        risk_level=risk_level,
        threat_type=threat_type,
        summary=summary,
        analysis_mode=analysis_mode,
        score_breakdown=score_breakdown,
    )
