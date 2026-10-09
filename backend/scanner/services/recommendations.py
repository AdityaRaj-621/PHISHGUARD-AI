from dataclasses import dataclass
from scanner.constants import Priority, RiskLevel, IndicatorType
from scanner.services.rule_engine import RuleResult
from scanner.services.url_analyzer import UrlResult
from scanner.services.ai_analyzer import AIResult
from scanner.services.risk_engine import FinalResult


@dataclass
class RecommendationData:
    title: str
    description: str
    priority: str
    order: int


def build(
    final_result: FinalResult,
    rule_result: RuleResult,
    url_result: UrlResult | None,
    ai_result: AIResult,
) -> list[RecommendationData]:
    """
    Generates 2 to 6 prioritized, deterministic recommendations based on detected indicators and overall risk.
    """
    candidates: list[tuple[str, str, str]] = []  # (priority, title, description)

    has_url_indicator = bool(url_result and (url_result.score > 0 or url_result.indicators))
    has_url_rule = rule_result.has(IndicatorType.SUSPICIOUS_URL) or rule_result.has(IndicatorType.URL_SHORTENER)
    has_credential_request = rule_result.has(IndicatorType.CREDENTIAL_REQUEST)
    has_financial_request = rule_result.has(IndicatorType.FINANCIAL_REQUEST)
    has_impersonation = rule_result.has(IndicatorType.IMPERSONATION)
    has_urgency_or_threat = rule_result.has(IndicatorType.URGENCY) or rule_result.has(IndicatorType.THREAT_LANGUAGE)

    # 1. URL warning (Critical)
    if has_url_indicator or has_url_rule or url_result is not None:
        candidates.append((
            Priority.CRITICAL,
            "Don't click the link",
            "Open the organisation's official mobile app or type their verified address directly into your browser.",
        ))

    # 2. Credential warning (Critical)
    if has_credential_request or final_result.threat_type == "otp_scam":
        candidates.append((
            Priority.CRITICAL,
            "Never share your OTP, password or PIN",
            "No legitimate bank, employer, or customer service team will ever ask you to disclose verification codes or passwords.",
        ))

    # 3. Financial warning (Critical)
    if has_financial_request or final_result.threat_type in ["job_scam", "investment_scam", "banking_scam"]:
        candidates.append((
            Priority.CRITICAL,
            "Don't pay any fee or transfer funds",
            "Legitimate employers, prizes, and courier services do not demand upfront registration fees, customs duties, or deposits.",
        ))

    # 4. Impersonation / Direct Verification (High)
    if has_impersonation or final_result.threat_type in ["phishing", "fake_support", "banking_scam"]:
        candidates.append((
            Priority.HIGH,
            "Verify with the organisation directly",
            "Use the official telephone number printed on your card or the contact page on their official verified website.",
        ))

    # 5. Threat Language / Urgency (High)
    if has_urgency_or_threat:
        candidates.append((
            Priority.HIGH,
            "Ignore the deadline pressure",
            "Urgency and fear of account suspension are manipulation tactics. Take time to verify independently.",
        ))

    # 6. High/Critical reporting & deletion
    if final_result.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
        candidates.append((
            Priority.NORMAL,
            "Report it to authorities or the institution",
            "Forward the message to your service provider's fraud reporting channel or your national cybercrime portal.",
        ))
        candidates.append((
            Priority.INFO,
            "Delete the message after reporting",
            "Keep a screenshot if you require evidence, then delete the communication to avoid accidental clicks.",
        ))

    # 7. Low risk caution
    if final_result.risk_level == RiskLevel.LOW:
        candidates.append((
            Priority.INFO,
            "Stay cautious anyway",
            "If this sender later asks for sensitive credentials, personal details, or unexpected payments, verify first.",
        ))
        candidates.append((
            Priority.INFO,
            "Check the sender address carefully",
            "Ensure the sender email or number matches the official domain exactly before replying.",
        ))

    # Priority sorting weight: CRITICAL (1), HIGH (2), NORMAL (3), INFO (4)
    priority_order = {
        Priority.CRITICAL: 1,
        Priority.HIGH: 2,
        Priority.NORMAL: 3,
        Priority.INFO: 4,
    }

    candidates.sort(key=lambda item: priority_order.get(item[0], 99))

    # Deduplicate by title
    seen_titles = set()
    recommendations: list[RecommendationData] = []
    order_counter = 1

    for prio, title, desc in candidates:
        if title not in seen_titles:
            seen_titles.add(title)
            recommendations.append(RecommendationData(
                title=title,
                description=desc,
                priority=prio,
                order=order_counter,
            ))
            order_counter += 1
            if len(recommendations) >= 6:
                break

    # Ensure at least 2 recommendations
    if len(recommendations) < 2:
        fallback = RecommendationData(
            title="Verify unknown communications",
            description="Always confirm unprompted messages through known, trusted channels.",
            priority=Priority.NORMAL,
            order=order_counter,
        )
        recommendations.append(fallback)

    return recommendations
