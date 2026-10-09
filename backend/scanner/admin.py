from django.contrib import admin
from scanner.models import Scan, ThreatIndicator, Recommendation, AIAnalysis, ThreatCategory


class ThreatIndicatorInline(admin.TabularInline):
    model = ThreatIndicator
    extra = 0
    readonly_fields = ("indicator_type", "title", "description", "severity", "evidence", "weight")


class RecommendationInline(admin.TabularInline):
    model = Recommendation
    extra = 0
    readonly_fields = ("title", "description", "priority", "order")


class AIAnalysisInline(admin.StackedInline):
    model = AIAnalysis
    extra = 0
    readonly_fields = ("threat_type", "ai_score", "confidence", "explanation", "key_signals", "status", "model_name", "created_at")


@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "scan_type", "risk_level", "risk_score", "threat_type", "status", "analysis_mode", "created_at")
    list_filter = ("scan_type", "risk_level", "threat_type", "status", "analysis_mode", "created_at")
    search_fields = ("user__username", "threat_type", "summary")
    readonly_fields = ("created_at", "score_breakdown", "url_analysis", "input_text")
    inlines = [ThreatIndicatorInline, RecommendationInline, AIAnalysisInline]


@admin.register(ThreatCategory)
class ThreatCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "severity")
    prepopulated_fields = {"key": ("name",)}
