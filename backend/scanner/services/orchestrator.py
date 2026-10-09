import logging
from django.db import transaction
from django.conf import settings
from scanner.constants import ScanType, RiskLevel, ThreatType
from scanner.models import Scan, ThreatIndicator, Recommendation, AIAnalysis
from scanner.services import rule_engine, url_analyzer, ai_analyzer, risk_engine, recommendations

logger = logging.getLogger("phishguard")


def _extract(scan_type: str, payload: dict) -> tuple[str, dict, str | None]:
    if scan_type == ScanType.MESSAGE:
        text = payload.get("content", "").strip()
        meta = {}
        extracted = url_analyzer.extract_urls(text)
        url = extracted[0] if extracted else None
        if url:
            meta["url"] = url
        return text, meta, url

    elif scan_type == ScanType.URL:
        raw_url = payload.get("url", "").strip()
        if not raw_url.startswith("http://") and not raw_url.startswith("https://"):
            raw_url = "http://" + raw_url
        text = raw_url
        meta = {"url": raw_url}
        return text, meta, raw_url

    elif scan_type == ScanType.EMAIL:
        text = payload.get("body", "").strip()
        meta = {
            "sender": payload.get("sender"),
            "subject": payload.get("subject"),
            "url": payload.get("url"),
        }
        url = payload.get("url")
        if not url:
            extracted = url_analyzer.extract_urls(text)
            url = extracted[0] if extracted else None
            if url:
                meta["url"] = url
        return text, meta, url

    return payload.get("content", ""), {}, None


def serialize_url_result(url_res: url_analyzer.UrlResult | None) -> dict | None:
    if not url_res or not url_res.url:
        return None
    return {
        "url": url_res.url,
        "domain": url_res.domain,
        "scheme": url_res.scheme,
        "https": url_res.https,
        "subdomain_count": url_res.subdomain_count,
        "length": url_res.length,
        "ip_host": url_res.ip_host,
        "has_encoded_chars": url_res.has_encoded_chars,
        "has_punycode": url_res.has_punycode,
        "has_at_symbol": url_res.has_at_symbol,
        "is_shortener": url_res.is_shortener,
        "digit_ratio": url_res.digit_ratio,
        "hyphen_count": url_res.hyphen_count,
        "suspicious_keywords": url_res.suspicious_keywords,
        "lookalike_of": url_res.lookalike_of,
        "reputation": url_res.reputation,
        "score": url_res.score,
    }


def run_scan(*, user, scan_type: str, payload: dict) -> Scan:
    """
    Core entry point for the analysis pipeline.
    Executes rule engine, URL analyzer, and AI analyzer, combines their results,
    builds recommendations, and persists the complete scan transactionally.
    """
    text, meta, url = _extract(scan_type, payload)

    # 1. Rules analysis (safe, fast, deterministic)
    try:
        rule_result = rule_engine.analyze(text=text, scan_type=scan_type, meta=meta)
    except Exception as e:
        logger.exception("Error in rule engine: %s", e)
        rule_result = rule_engine.RuleResult(score=0, indicators=[], threat_hints={})

    # 2. URL analysis
    url_result = None
    target_url = url
    if not target_url and scan_type != ScanType.URL:
        found_urls = url_analyzer.extract_urls(text)
        if found_urls:
            target_url = found_urls[0]

    if target_url:
        try:
            url_result = url_analyzer.analyze(target_url)
        except Exception as e:
            logger.exception("Error in url analyzer: %s", e)
            url_result = None

    # 3. AI analysis (safe, hard timeout, non-blocking)
    try:
        if getattr(settings, "AI_ENABLED", False):
            ai_result = ai_analyzer.analyze(
                text=text,
                scan_type=scan_type,
                meta=meta,
                url=target_url,
            )
        else:
            ai_result = ai_analyzer.AIResult.skipped()
    except Exception as e:
        logger.exception("Error in AI analyzer: %s", e)
        ai_result = ai_analyzer.AIResult.failed()

    # 4. Combine signals
    try:
        final = risk_engine.combine(rule_result, url_result, ai_result)
    except Exception as e:
        logger.exception("Error in risk engine: %s", e)
        final = risk_engine.FinalResult(
            risk_score=rule_result.score,
            risk_level=risk_engine.level_for_score(rule_result.score),
            threat_type=ThreatType.UNKNOWN,
            summary="Analysis completed using standard rule set.",
            analysis_mode="rules_only",
            score_breakdown={"rule_score": rule_result.score, "url_score": None, "ai_score": None},
        )

    # 5. Build recommendations
    try:
        recs = recommendations.build(final, rule_result, url_result, ai_result)
    except Exception as e:
        logger.exception("Error in recommendations engine: %s", e)
        recs = [
            recommendations.RecommendationData(
                title="Exercise caution with unsolicited messages",
                description="Never share sensitive information or click unverified links.",
                priority="normal",
                order=1,
            )
        ]

    # 6. Atomic database persistence
    indicators_to_create = []
    seen_ind_keys = set()

    # Add rule indicators
    for ind in rule_result.indicators:
        key = (ind.indicator_type, ind.title)
        if key not in seen_ind_keys:
            seen_ind_keys.add(key)
            indicators_to_create.append(ind)

    # Add URL indicators
    if url_result:
        for ind in url_result.indicators:
            key = (ind.indicator_type, ind.title)
            if key not in seen_ind_keys:
                seen_ind_keys.add(key)
                indicators_to_create.append(ind)

    url_analysis_data = serialize_url_result(url_result)

    with transaction.atomic():
        scan = Scan.objects.create(
            user=user,
            scan_type=scan_type,
            input_text=text,
            input_meta=meta,
            risk_score=final.risk_score,
            risk_level=final.risk_level,
            threat_type=final.threat_type,
            summary=final.summary,
            status="completed",
            analysis_mode=final.analysis_mode,
            score_breakdown=final.score_breakdown,
            url_analysis=url_analysis_data,
        )

        # Bulk create indicators
        indicator_objs = [
            ThreatIndicator(
                scan=scan,
                indicator_type=ind.indicator_type,
                title=ind.title,
                description=ind.description,
                severity=ind.severity,
                evidence=ind.evidence,
                weight=ind.weight,
            )
            for ind in indicators_to_create
        ]
        ThreatIndicator.objects.bulk_create(indicator_objs)

        # Bulk create recommendations
        rec_objs = [
            Recommendation(
                scan=scan,
                title=r.title,
                description=r.description,
                priority=r.priority,
                order=r.order,
            )
            for r in recs
        ]
        Recommendation.objects.bulk_create(rec_objs)

        # Save AI Analysis record if AI ran
        if ai_result.status != "skipped":
            AIAnalysis.objects.create(
                scan=scan,
                threat_type=ai_result.threat_type,
                ai_score=ai_result.ai_score,
                confidence=ai_result.confidence,
                explanation=ai_result.explanation,
                key_signals=ai_result.key_signals,
                status=ai_result.status,
                model_name=ai_result.model_name or getattr(settings, "AI_MODEL", ""),
            )

    return scan
