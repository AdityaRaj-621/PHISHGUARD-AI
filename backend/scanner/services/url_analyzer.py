import re
import urllib.parse
from dataclasses import dataclass, field
from scanner.constants import IndicatorType, Severity
from scanner.services.rule_engine import IndicatorData


@dataclass
class UrlResult:
    url: str
    domain: str
    scheme: str
    https: bool
    subdomain_count: int
    length: int
    ip_host: bool
    has_encoded_chars: bool
    has_punycode: bool
    has_at_symbol: bool
    is_shortener: bool
    digit_ratio: float
    hyphen_count: int
    suspicious_keywords: list[str]
    lookalike_of: str | None
    reputation: dict | None
    score: int
    indicators: list[IndicatorData] = field(default_factory=list)


KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.me", "is.gd", "rb.gy", "cutt.ly",
    "goo.gl", "ow.ly", "shorturl.at", "bl.ink", "trib.al", "buff.ly",
}

SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "click", "buzz", "rest", "fit", "surf",
    "tk", "ml", "ga", "cf", "gq", "cam", "icu", "site", "online",
}

RISKY_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "otp", "wallet",
    "kyc", "refund", "signin", "confirm", "banking", "authenticate",
    "password", "validate", "support", "billing", "recover",
]

KNOWN_BRANDS = [
    {"brand": "hdfc", "canonical": "hdfcbank.com"},
    {"brand": "sbi", "canonical": "onlinesbi.sbi"},
    {"brand": "icici", "canonical": "icicibank.com"},
    {"brand": "axis", "canonical": "axisbank.com"},
    {"brand": "paypal", "canonical": "paypal.com"},
    {"brand": "amazon", "canonical": "amazon.com"},
    {"brand": "netflix", "canonical": "netflix.com"},
    {"brand": "google", "canonical": "google.com"},
    {"brand": "apple", "canonical": "apple.com"},
    {"brand": "microsoft", "canonical": "microsoft.com"},
    {"brand": "fedex", "canonical": "fedex.com"},
    {"brand": "dhl", "canonical": "dhl.com"},
    {"brand": "chase", "canonical": "chase.com"},
    {"brand": "wellsfargo", "canonical": "wellsfargo.com"},
    {"brand": "paytm", "canonical": "paytm.com"},
    {"brand": "phonepe", "canonical": "phonepe.com"},
]

IP_V4_PATTERN = re.compile(r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
URL_FINDER = re.compile(r"https?://[^\s<>\"'{}|\\^`]+|(?:www\.)[^\s<>\"'{}|\\^`]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|in|xyz|top|site|live|online|info|me|gov|edu)/[^\s<>\"'{}|\\^`]*", re.IGNORECASE)


def extract_urls(text: str) -> list[str]:
    """Finds up to 5 URLs in given text."""
    if not text:
        return []
    matches = URL_FINDER.findall(text)
    cleaned = []
    for raw in matches[:5]:
        url = raw.strip(".,;:()[]{}<>\"'")
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "http://" + url
        if url not in cleaned:
            cleaned.append(url)
    return cleaned


def levenshtein_distance(s1: str, s2: str) -> int:
    """Calculates Levenshtein edit distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


def get_registrable_domain(host: str) -> tuple[str, str, int]:
    """
    Splits hostname into (subdomain, registrable_domain, subdomain_count).
    Simplified heuristic for 2-part and known 3-part SLD ccTLDs (e.g., .co.in, .co.uk, .com.au).
    """
    labels = host.lower().split(".")
    if len(labels) <= 1:
        return "", host, 0

    known_sld_cctlds = {"co.uk", "co.in", "com.au", "co.nz", "com.br", "co.za", "gov.in", "ac.in", "edu.au"}
    if len(labels) >= 3:
        two_tail = f"{labels[-2]}.{labels[-1]}"
        if two_tail in known_sld_cctlds:
            reg_domain = f"{labels[-3]}.{two_tail}"
            subdomains = ".".join(labels[:-3])
            count = len(labels[:-3])
            return subdomains, reg_domain, count

    reg_domain = f"{labels[-2]}.{labels[-1]}"
    subdomains = ".".join(labels[:-2])
    count = len(labels[:-2])
    return subdomains, reg_domain, count


def check_lookalike(host: str, reg_domain: str) -> str | None:
    """Checks if hostname or registrable domain impersonates a known brand."""
    main_label = reg_domain.split(".")[0] if "." in reg_domain else reg_domain

    for b in KNOWN_BRANDS:
        brand = b["brand"]
        canonical = b["canonical"]

        # If domain is already the legitimate canonical brand domain, skip
        if reg_domain == canonical or host.endswith("." + canonical):
            continue

        # Check if brand appears in subdomain or hyphenated part of host
        if brand in host:
            return canonical

        # Check Levenshtein distance on the registrable domain root name (e.g. paypa1 vs paypal)
        if len(brand) >= 4 and len(main_label) >= 4:
            dist = levenshtein_distance(main_label, brand)
            if 0 < dist <= 2:
                return canonical

    return None


def analyze(raw_url: str) -> UrlResult:
    """
    Performs pure string heuristic analysis of a URL.
    NEVER makes any network calls.
    """
    if not raw_url:
        return UrlResult(
            url="", domain="", scheme="", https=False, subdomain_count=0,
            length=0, ip_host=False, has_encoded_chars=False, has_punycode=False,
            has_at_symbol=False, is_shortener=False, digit_ratio=0.0,
            hyphen_count=0, suspicious_keywords=[], lookalike_of=None,
            reputation=None, score=0, indicators=[]
        )

    # Normalize url
    clean_url = raw_url.strip()
    if not clean_url.startswith("http://") and not clean_url.startswith("https://"):
        clean_url = "http://" + clean_url

    parsed = urllib.parse.urlparse(clean_url)
    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()
    path = parsed.path.lower()
    query = parsed.query.lower()

    # Extract host and port
    host = netloc.split("@")[-1].split(":")[0]
    has_at_symbol = "@" in parsed.netloc

    https = (scheme == "https")
    subdomain, reg_domain, subdomain_count = get_registrable_domain(host)

    length = len(clean_url)
    ip_host = bool(IP_V4_PATTERN.match(host) or (host.startswith("[") and host.endswith("]")))
    has_punycode = host.startswith("xn--") or any(ord(c) > 127 for c in host)
    is_shortener = host in KNOWN_SHORTENERS or reg_domain in KNOWN_SHORTENERS

    # Digits and hyphens
    digits = sum(1 for c in host if c.isdigit())
    digit_ratio = round(digits / len(host), 2) if host else 0.0
    hyphen_count = host.count("-")

    # Encoded characters (%xx)
    has_encoded_chars = ("%" in host) or (path.count("%") > 3)

    # Suspicious keywords
    matched_keywords = []
    full_url_text = f"{host}{path}?{query}"
    for kw in RISKY_KEYWORDS:
        if kw in full_url_text:
            matched_keywords.append(kw)

    # Lookalike check
    lookalike_of = check_lookalike(host, reg_domain)

    # Indicators and scoring
    indicators: list[IndicatorData] = []
    score = 0

    # 1. No HTTPS
    if not https:
        pts = 10
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_NO_HTTPS,
            title="Unencrypted HTTP Connection",
            description="The URL does not use HTTPS encryption, leaving communications vulnerable.",
            severity=Severity.LOW,
            evidence=clean_url[:60],
            weight=pts,
        ))

    # 2. IP Address Host
    if ip_host:
        pts = 25
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_IP_HOST,
            title="IP Address Used As Hostname",
            description="The link directly uses a numerical IP address instead of a recognized domain name.",
            severity=Severity.HIGH,
            evidence=host,
            weight=pts,
        ))

    # 3. @ Symbol in authority
    if has_at_symbol:
        pts = 25
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.SUSPICIOUS_URL,
            title="Credential-Confusion (@) Symbol in Link",
            description="The link contains an '@' character to mislead users about the true destination domain.",
            severity=Severity.HIGH,
            evidence=parsed.netloc[:60],
            weight=pts,
        ))

    # 4. Lookalike domain
    if lookalike_of:
        pts = 25
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_LOOKALIKE,
            title=f"Lookalike Domain (Impersonating {lookalike_of})",
            description=f"The domain closely mimics official website '{lookalike_of}' to trick users.",
            severity=Severity.HIGH,
            evidence=host,
            weight=pts,
        ))

    # 5. Punycode / mixed scripts
    if has_punycode:
        pts = 20
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_LOOKALIKE,
            title="Internationalized / Punycode Characters",
            description="The domain contains non-standard characters (homoglyphs) that can deceive human eyes.",
            severity=Severity.HIGH,
            evidence=host,
            weight=pts,
        ))

    # 6. Shortener
    if is_shortener:
        pts = 12
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_SHORTENER,
            title="Known URL Shortener Service",
            description="The link is shortened, hiding the ultimate website destination.",
            severity=Severity.MEDIUM,
            evidence=host,
            weight=pts,
        ))

    # 7. Risky keywords in host / path
    if matched_keywords:
        pts = 12
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_KEYWORDS,
            title="Security / Banking Keywords in Link",
            description=f"Link contains high-risk terms frequently seen in phishing: {', '.join(matched_keywords[:4])}.",
            severity=Severity.MEDIUM,
            evidence=", ".join(matched_keywords[:4]),
            weight=pts,
        ))

    # 8. Excessive subdomains
    if subdomain_count > 3:
        pts = 12
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_SUBDOMAINS,
            title="Excessive Subdomain Levels",
            description="The link uses multiple subdomain layers, commonly done to mask fraudulent destinations.",
            severity=Severity.MEDIUM,
            evidence=host,
            weight=pts,
        ))

    # 9. Hyphens / Digits in hostname
    if hyphen_count >= 3 or digit_ratio > 0.25:
        pts = 8
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_LENGTH,
            title="Unusual Hostname Structure (Hyphens / Digits)",
            description="The domain structure contains an unusually high frequency of numbers or hyphens.",
            severity=Severity.LOW,
            evidence=host,
            weight=pts,
        ))

    # 10. URL Length
    if length > 75:
        pts = 8
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_LENGTH,
            title="Excessive URL Length",
            description="The link length is unusually long (>75 characters), typical of obfuscated phishing links.",
            severity=Severity.LOW,
            evidence=f"{length} characters",
            weight=pts,
        ))

    # 11. Encoded characters
    if has_encoded_chars:
        pts = 8
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.URL_ENCODED,
            title="Obfuscated / Percent-Encoded Characters",
            description="The URL contains percent-encoded hex sequences that conceal the destination path.",
            severity=Severity.LOW,
            evidence=clean_url[:60],
            weight=pts,
        ))

    # 12. Suspicious TLD
    tld = host.split(".")[-1] if "." in host else ""
    if tld in SUSPICIOUS_TLDS:
        pts = 10
        score += pts
        indicators.append(IndicatorData(
            indicator_type=IndicatorType.SUSPICIOUS_URL,
            title="High-Abuse Top Level Domain",
            description=f"The domain uses the .{tld} extension, statistically associated with spam and scam sites.",
            severity=Severity.LOW,
            evidence=f".{tld}",
            weight=pts,
        ))

    clamped_score = max(0, min(100, score))

    return UrlResult(
        url=clean_url,
        domain=host,
        scheme=scheme,
        https=https,
        subdomain_count=subdomain_count,
        length=length,
        ip_host=ip_host,
        has_encoded_chars=has_encoded_chars,
        has_punycode=has_punycode,
        has_at_symbol=has_at_symbol,
        is_shortener=is_shortener,
        digit_ratio=digit_ratio,
        hyphen_count=hyphen_count,
        suspicious_keywords=matched_keywords,
        lookalike_of=lookalike_of,
        reputation=None,
        score=clamped_score,
        indicators=indicators,
    )
