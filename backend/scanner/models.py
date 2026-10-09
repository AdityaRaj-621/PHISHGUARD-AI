from django.db import models
from django.contrib.auth.models import User
from scanner.constants import (
    ScanType,
    RiskLevel,
    ThreatType,
    Severity,
    Priority,
    IndicatorType,
)


class Scan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scans")
    scan_type = models.CharField(max_length=16, choices=ScanType.choices)
    input_text = models.TextField()
    input_meta = models.JSONField(default=dict, blank=True)
    risk_score = models.PositiveSmallIntegerField(null=True, blank=True)
    risk_level = models.CharField(max_length=10, choices=RiskLevel.choices, default=RiskLevel.UNKNOWN)
    threat_type = models.CharField(max_length=32, choices=ThreatType.choices, default=ThreatType.UNKNOWN)
    summary = models.TextField(blank=True)
    status = models.CharField(max_length=12, default="completed")  # completed|partial|failed
    analysis_mode = models.CharField(max_length=12, default="rules_only")  # rules_ai|rules_only
    score_breakdown = models.JSONField(default=dict, blank=True)
    url_analysis = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["user", "risk_level"]),
            models.Index(fields=["user", "scan_type"]),
        ]

    def __str__(self):
        return f"Scan {self.id} ({self.scan_type}) - {self.risk_level} ({self.risk_score})"

    @property
    def input_preview(self):
        return (self.input_text or "")[:120]


class ThreatIndicator(models.Model):
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE, related_name="indicators")
    indicator_type = models.CharField(max_length=32, choices=IndicatorType.choices)
    title = models.CharField(max_length=120)
    description = models.TextField()
    severity = models.CharField(max_length=8, choices=Severity.choices, default=Severity.MEDIUM)
    evidence = models.CharField(max_length=200, blank=True)
    weight = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["-weight", "id"]

    def __str__(self):
        return f"{self.title} ({self.severity}) - weight {self.weight}"


class Recommendation(models.Model):
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE, related_name="recommendations")
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.NORMAL)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"[{self.priority}] {self.title}"


class AIAnalysis(models.Model):
    scan = models.OneToOneField(Scan, on_delete=models.CASCADE, related_name="ai_analysis")
    threat_type = models.CharField(max_length=32, choices=ThreatType.choices, default=ThreatType.UNKNOWN)
    ai_score = models.PositiveSmallIntegerField(null=True, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    explanation = models.TextField(blank=True)
    key_signals = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=10, default="ok")  # ok|failed|skipped
    model_name = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AIAnalysis for Scan {self.scan_id} ({self.status})"


class ThreatCategory(models.Model):
    key = models.SlugField(unique=True)
    name = models.CharField(max_length=80)
    description = models.TextField(blank=True)
    severity = models.CharField(max_length=8, choices=Severity.choices, default=Severity.MEDIUM)

    class Meta:
        verbose_name_plural = "Threat Categories"

    def __str__(self):
        return self.name
