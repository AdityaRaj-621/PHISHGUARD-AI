import re
from dataclasses import dataclass, field
from scanner.constants import IndicatorType, Severity, ThreatType


@dataclass
class IndicatorData:
    indicator_type: str
    title: str
    description: str
    severity: str
    evidence: str
    weight: int


@dataclass
class RuleResult:
    score: int
    indicators: list[IndicatorData] = field(default_factory=list)
    threat_hints: dict[str, int] = field(default_factory=dict)

    def has(self, indicator_type: str) -> bool:
        return any(ind.indicator_type == indicator_type for ind in self.indicators)


# Precompiled negative patterns to prevent false positives on legitimate OTP/security notifications
PROTECTIVE_PATTERNS = [
    re.compile(r"\bdo\s+not\s+share\s+(?:this\s+)?(?:otp|code|pin|password)", re.IGNORECASE),
    re.compile(r"\bnever\s+share\s+(?:your\s+|this\s+)?(?:otp|code|pin|password)", re.IGNORECASE),
    re.compile(r"\bdo\s+not\s+disclose\b", re.IGNORECASE),
    re.compile(r"\bkeep\s+(?:this\s+)?(?:otp|code|password)\s+confidential\b", re.IGNORECASE),
    re.compile(r"\bfor\s+your\s+eyes\s+only\b", re.IGNORECASE),
    re.compile(r"\bif\s+not\s+requested\s+by\s+you\b", re.IGNORECASE),
    re.compile(r"\bdo\s+not\s+share\s+it\s+with\s+anyone\b", re.IGNORECASE),
    re.compile(r"\bnever\s+share\s+it\s+with\s+anyone\b", re.IGNORECASE),
]

CREDENTIAL_REQUEST_AFFIRMATIVE = [
    re.compile(r"\b(?:enter|share|send|provide|give|submit|confirm|verify|update)\s+(?:your\s+)?(?:otp|one[- ]time\s+password|pin|password|cvv|credentials|code)\b", re.IGNORECASE),
    re.compile(r"\b(?:login|sign[- ]?in)\s+(?:with|using|to\s+verify)\b", re.IGNORECASE),
    re.compile(r"\benter\s+(?:the\s+)?otp\b", re.IGNORECASE),
]

ACTIONABLE_VERBS = re.compile(
    r"\b(?:click|tap|visit|open|call|dial|contact|pay|transfer|send|verify|enter|submit|download|install|claim)\b",
    re.IGNORECASE,
)
PHONE_PATTERN = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
URL_REGEX = re.compile(r"https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|in|xyz|top|site|live|online|info|me)/[^\s]*", re.IGNORECASE)

# Rule definitions catalogue
RULES_CATALOGUE = [
    {
        "id": "urgency",
        "indicator_type": IndicatorType.URGENCY,
        "title": "Urgency pressure",
        "description": "The message attempts to pressure you into acting immediately.",
        "base_weight": 15,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.PHISHING: 1},
        "patterns": [
            re.compile(r"\b(?:urgent|urgently|immediately|act\s+now|action\s+required|right\s+now|last\s+warning|final\s+notice)\b", re.IGNORECASE),
            re.compile(r"\b(?:within\s+\d+\s+(?:hours?|mins?|minutes?)|today\s+only|expires?\s+today|time\s+is\s+running\s+out)\b", re.IGNORECASE),
            re.compile(r"\b(?:limited\s+time|account\s+will\s+be\s+closed\s+today)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "credential_request",
        "indicator_type": IndicatorType.CREDENTIAL_REQUEST,
        "title": "Credential or verification code requested",
        "description": "The message requests sensitive login information, OTPs, or passwords.",
        "base_weight": 25,
        "severity": Severity.HIGH,
        "threat_hints": {ThreatType.OTP_SCAM: 2, ThreatType.PHISHING: 1, ThreatType.BANKING_SCAM: 1},
        "patterns": [
            re.compile(r"\b(?:otp|one[- ]time\s+password|pin|password|cvv|verification\s+code|login\s+details|net\s*banking\s+credentials|secret\s+key)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "financial_request",
        "indicator_type": IndicatorType.FINANCIAL_REQUEST,
        "title": "Direct financial request or fee demanded",
        "description": "The communication asks for payment, fund transfers, or upfront fees.",
        "base_weight": 25,
        "severity": Severity.HIGH,
        "threat_hints": {ThreatType.BANKING_SCAM: 1, ThreatType.INVESTMENT_SCAM: 1, ThreatType.SHOPPING_SCAM: 1},
        "patterns": [
            re.compile(r"\b(?:pay\s+now|processing\s+fee|registration\s+fee|security\s+deposit|refundable\s+fee|transfer\s+money|wire\s+transfer|upi|gift\s+card|crypto\s+payment)\b", re.IGNORECASE),
            re.compile(r"\b(?:send\s+(?:rs\.?|inr|\$|\u20B9)\s*\d+|deposit\s+amount|send\s+payment)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "threat_language",
        "indicator_type": IndicatorType.THREAT_LANGUAGE,
        "title": "Account suspension or legal threat",
        "description": "Threatens negative consequences such as account block, fines, or legal action.",
        "base_weight": 10,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.BANKING_SCAM: 1, ThreatType.PHISHING: 1},
        "patterns": [
            re.compile(r"\b(?:account\s+(?:will\s+be\s+)?(?:blocked|suspended|closed|terminated|deactivated|frozen|locked))\b", re.IGNORECASE),
            re.compile(r"\b(?:legal\s+action|penalty|fir|police\s+complaint|court\s+order|arrest\s+warrant|fine\s+imposed)\b", re.IGNORECASE),
            re.compile(r"\b(?:electricity\s+power\s+will\s+be\s+disconnected|sim\s+(?:card\s+)?blocked)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "reward_bait",
        "indicator_type": IndicatorType.REWARD_BAIT,
        "title": "Unrealistic reward or prize lure",
        "description": "Lures you with unexpected winnings, lotteries, or guaranteed free rewards.",
        "base_weight": 15,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.SHOPPING_SCAM: 1, ThreatType.INVESTMENT_SCAM: 1},
        "patterns": [
            re.compile(r"\b(?:you\s+won|won\s+a\s+lottery|cash\s+prize|free\s+money|claim\s+your\s+reward|congratulations\s+you\s+have\s+been\s+selected)\b", re.IGNORECASE),
            re.compile(r"\b(?:double\s+your\s+money|guaranteed\s+(?:profit|returns?|cashback)|jackpot)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "impersonation",
        "indicator_type": IndicatorType.IMPERSONATION,
        "title": "Brand or authority impersonation",
        "description": "Uses known banking, delivery, or technology brand names to gain false trust.",
        "base_weight": 10,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.PHISHING: 1, ThreatType.FAKE_SUPPORT: 1},
        "patterns": [
            re.compile(r"\b(?:hdfc|sbi|icici|axis|pnb|kotak|paypal|paytm|google\s*pay|phonepe|amazon|netflix|apple|microsoft|fedex|dhl|indiapost|ups)\b(?=.*?\b(?:bank|account|service|support|team|security|alert|official|desk|update|verify)\b)", re.IGNORECASE),
        ],
    },
    {
        "id": "delivery_pattern",
        "indicator_type": IndicatorType.SUSPICIOUS_URL,
        "title": "Delivery or parcel scam pattern",
        "description": "Mentions failed parcel deliveries or address confirmation requests.",
        "base_weight": 12,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.DELIVERY_SCAM: 2},
        "patterns": [
            re.compile(r"\b(?:parcel|shipment|customs\s+(?:duty|fee)|delivery\s+failed|reschedule\s+delivery|package\s+pending|courier\s+held|update\s+delivery\s+address)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "job_pattern",
        "indicator_type": IndicatorType.REWARD_BAIT,
        "title": "Suspicious job or task earning offer",
        "description": "Offers easy part-time earnings or daily payouts for simple online tasks.",
        "base_weight": 12,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.JOB_SCAM: 2},
        "patterns": [
            re.compile(r"\b(?:work\s+from\s+home|part[- ]time\s+job|daily\s+payout|hiring\s+now|earn\s+daily|like\s+and\s+subscribe\s+to\s+earn|earn\s+(?:rs\.?|\$)\s*\d+\s+per\s+day)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "investment_pattern",
        "indicator_type": IndicatorType.FINANCIAL_REQUEST,
        "title": "High-yield investment lure",
        "description": "Promotes crypto trading, guaranteed market profits, or high-yield schemes.",
        "base_weight": 15,
        "severity": Severity.HIGH,
        "threat_hints": {ThreatType.INVESTMENT_SCAM: 2},
        "patterns": [
            re.compile(r"\b(?:crypto(?:currency)?|trading\s+signals?|guaranteed\s+returns?|investment\s+plan|profit\s+daily|forex\s+trading|binary\s+options?|high\s+yield)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "tech_support_pattern",
        "indicator_type": IndicatorType.THREAT_LANGUAGE,
        "title": "Fake tech support or malware alert",
        "description": "Falsely claims your computer/device is infected and directs you to call or install software.",
        "base_weight": 12,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.TECH_SUPPORT: 2},
        "patterns": [
            re.compile(r"\b(?:virus\s+detected|device\s+is\s+infected|computer\s+is\s+locked|call\s+microsoft\s+support|remote\s+access|anydesk|teamviewer|quicksupport)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "contact_pressure",
        "indicator_type": IndicatorType.CONTACT_PRESSURE,
        "title": "Off-platform contact pressure",
        "description": "Instructs you to communicate exclusively over WhatsApp or keep conversations secret.",
        "base_weight": 8,
        "severity": Severity.LOW,
        "threat_hints": {ThreatType.JOB_SCAM: 1, ThreatType.INVESTMENT_SCAM: 1},
        "patterns": [
            re.compile(r"\b(?:whatsapp\s+only|telegram\s+only|don'?t\s+tell\s+anyone|keep\s+this\s+confidential|message\s+on\s+whatsapp|dm\s+on\s+telegram)\b", re.IGNORECASE),
        ],
    },
    {
        "id": "shortened_link",
        "indicator_type": IndicatorType.URL_SHORTENER,
        "title": "Shortened or obfuscated link",
        "description": "Contains a shortened link that conceals the true web destination.",
        "base_weight": 12,
        "severity": Severity.MEDIUM,
        "threat_hints": {ThreatType.SUSPICIOUS_URL: 1},
        "patterns": [
            re.compile(r"\b(?:bit\.ly|tinyurl\.com|t\.me|is\.gd|rb\.gy|cutt\.ly|goo\.gl|ow\.ly)/\w+", re.IGNORECASE),
        ],
    },
    {
        "id": "attachment_ref",
        "indicator_type": IndicatorType.ATTACHMENT,
        "title": "Suspicious attachment reference",
        "description": "Prompts you to open an attachment or download an executable/APK file.",
        "base_weight": 6,
        "severity": Severity.LOW,
        "threat_hints": {ThreatType.PHISHING: 1},
        "patterns": [
            re.compile(r"\b(?:attached\s+invoice|open\s+the\s+attachment|download\s+attachment|view\s+attached\s+pdf|\.apk|\.exe|\.scr|\.bat|\.vbs)\b", re.IGNORECASE),
        ],
    },
]


def extract_evidence(text: str, match_span: tuple[int, int]) -> str:
    start = max(0, match_span[0] - 20)
    end = min(len(text), match_span[1] + 20)
    snippet = text[start:end].replace("\n", " ").replace("\r", " ")
    snippet = re.sub(r"\s+", " ", snippet).strip()
    return snippet[:200]


def is_legitimate_otp_notice(text: str) -> bool:
    has_protective = any(pattern.search(text) for pattern in PROTECTIVE_PATTERNS)
    has_request = any(pattern.search(text) for pattern in CREDENTIAL_REQUEST_AFFIRMATIVE)
    return has_protective and not has_request


def analyze(text: str, scan_type: str = "message", meta: dict | None = None) -> RuleResult:
    """
    Executes the deterministic rule engine over input text.
    Returns RuleResult with calculated score, threat indicators, and threat category votes.
    """
    if not text or not text.strip():
        return RuleResult(score=0, indicators=[], threat_hints={})

    text_to_check = text.strip()
    indicators: list[IndicatorData] = []
    threat_hints: dict[str, int] = {}
    total_score = 0

    # False-positive guard for authentic OTP notifications
    skip_credential_rule = is_legitimate_otp_notice(text_to_check)

    # 1. Process catalogue rules
    for rule in RULES_CATALOGUE:
        if rule["id"] == "credential_request" and skip_credential_rule:
            continue

        matches = []
        for pattern in rule["patterns"]:
            for m in pattern.finditer(text_to_check):
                matches.append(m)

        if matches:
            first_match = matches[0]
            evidence = extract_evidence(text_to_check, first_match.span())

            # Repeated hits bonus (+3 per additional hit, max +9)
            extra_hits = min(len(matches) - 1, 3)
            rule_weight = rule["base_weight"] + (extra_hits * 3)

            indicator = IndicatorData(
                indicator_type=rule["indicator_type"],
                title=rule["title"],
                description=rule["description"],
                severity=rule["severity"],
                evidence=evidence,
                weight=rule_weight,
            )
            indicators.append(indicator)
            total_score += rule_weight

            # Accumulate threat hints
            for threat_cat, count in rule.get("threat_hints", {}).items():
                threat_hints[threat_cat] = threat_hints.get(threat_cat, 0) + count

    # 2. Check excessive capitalization or exclamation marks
    if len(text_to_check) >= 30:
        uppercase_chars = sum(1 for c in text_to_check if c.isupper())
        total_letters = sum(1 for c in text_to_check if c.isalpha())
        is_shouting = (total_letters > 0 and (uppercase_chars / total_letters) > 0.45)
        has_triple_excl = "!!!" in text_to_check or "???" in text_to_check

        if is_shouting or has_triple_excl:
            caps_weight = 5
            total_score += caps_weight
            indicators.append(
                IndicatorData(
                    indicator_type=IndicatorType.EXCESSIVE_CAPS,
                    title="Excessive capitalization or punctuation",
                    description="The text uses heavy capitalization or multiple exclamation marks to create tension.",
                    severity=Severity.LOW,
                    evidence=text_to_check[:100],
                    weight=caps_weight,
                )
            )

    # 3. Actionable content reduction: If no link, no phone number, and no actionable verb -> reduce by 10
    has_url = bool(URL_REGEX.search(text_to_check))
    has_phone = bool(PHONE_PATTERN.search(text_to_check))
    has_action = bool(ACTIONABLE_VERBS.search(text_to_check))

    if not has_url and not has_phone and not has_action and total_score > 0:
        total_score = max(0, total_score - 10)

    # Clamp total score 0 - 100
    clamped_score = max(0, min(100, total_score))

    return RuleResult(
        score=clamped_score,
        indicators=indicators,
        threat_hints=threat_hints,
    )
