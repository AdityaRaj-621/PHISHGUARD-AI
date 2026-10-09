from django.db import models


class ScanType(models.TextChoices):
    MESSAGE = "message", "Message"
    URL = "url", "URL"
    EMAIL = "email", "Email"


class RiskLevel(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"
    UNKNOWN = "UNKNOWN", "Unknown"


class ThreatType(models.TextChoices):
    PHISHING = "phishing", "Phishing"
    BANKING_SCAM = "banking_scam", "Banking scam"
    JOB_SCAM = "job_scam", "Job scam"
    INVESTMENT_SCAM = "investment_scam", "Investment scam"
    OTP_SCAM = "otp_scam", "OTP scam"
    DELIVERY_SCAM = "delivery_scam", "Delivery scam"
    TECH_SUPPORT = "tech_support_scam", "Tech support scam"
    SHOPPING_SCAM = "shopping_scam", "Shopping scam"
    SOCIAL_MEDIA = "social_media_scam", "Social media scam"
    FAKE_SUPPORT = "fake_support", "Fake customer support"
    SUSPICIOUS_URL = "suspicious_url", "Suspicious URL"
    NONE = "none", "No clear threat identified"
    UNKNOWN = "unknown", "Unknown"


class Severity(models.TextChoices):
    LOW = "low", "Low"
    MEDIUM = "medium", "Medium"
    HIGH = "high", "High"


class Priority(models.TextChoices):
    CRITICAL = "critical", "Critical"
    HIGH = "high", "High"
    NORMAL = "normal", "Normal"
    INFO = "info", "Info"


class IndicatorType(models.TextChoices):
    URGENCY = "urgency", "Urgency"
    CREDENTIAL_REQUEST = "credential_request", "Credential request"
    FINANCIAL_REQUEST = "financial_request", "Financial request"
    THREAT_LANGUAGE = "threat_language", "Threat language"
    REWARD_BAIT = "reward_bait", "Reward bait"
    IMPERSONATION = "impersonation", "Impersonation"
    GRAMMAR = "grammar", "Unusual wording"
    SUSPICIOUS_URL = "suspicious_url", "Suspicious URL"
    URL_NO_HTTPS = "url_no_https", "No HTTPS"
    URL_IP_HOST = "url_ip_host", "IP address host"
    URL_LOOKALIKE = "url_lookalike", "Lookalike domain"
    URL_SHORTENER = "url_shortener", "URL shortener"
    URL_LENGTH = "url_length", "Unusual URL length"
    URL_ENCODED = "url_encoded", "Encoded characters"
    URL_SUBDOMAINS = "url_subdomains", "Excessive subdomains"
    URL_KEYWORDS = "url_keywords", "Risky keywords in URL"
    SENDER_MISMATCH = "sender_mismatch", "Sender mismatch"
    ATTACHMENT = "attachment", "Attachment reference"
    CONTACT_PRESSURE = "contact_pressure", "Contact pressure"
    EXCESSIVE_CAPS = "excessive_caps", "Excessive capitalization/punctuation"
    AI_SIGNAL = "ai_signal", "AI-identified signal"
