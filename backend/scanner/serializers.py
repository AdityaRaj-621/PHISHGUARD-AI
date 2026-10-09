import urllib.parse
from django.conf import settings
from rest_framework import serializers
from scanner.models import Scan, ThreatIndicator, Recommendation, AIAnalysis


class MessageScanInputSerializer(serializers.Serializer):
    content = serializers.CharField(
        required=True,
        min_length=10,
        max_length=getattr(settings, "MAX_MESSAGE_LENGTH", 5000),
        error_messages={
            "blank": "This field may not be blank.",
            "min_length": "Paste at least 10 characters.",
            "max_length": "Maximum 5000 characters.",
        },
    )

    def validate_content(self, value):
        cleaned = value.strip().replace("\x00", "")
        if len(cleaned) < 10:
            raise serializers.ValidationError("Paste at least 10 characters.")
        return cleaned


class UrlScanInputSerializer(serializers.Serializer):
    url = serializers.CharField(
        required=True,
        max_length=getattr(settings, "MAX_URL_LENGTH", 2048),
        error_messages={
            "blank": "This field may not be blank.",
            "max_length": "Maximum 2048 characters.",
        },
    )

    def validate_url(self, value):
        cleaned = value.strip().replace("\x00", "")
        if not cleaned:
            raise serializers.ValidationError("Enter a valid URL.")
        if not cleaned.startswith("http://") and not cleaned.startswith("https://"):
            cleaned = "http://" + cleaned

        parsed = urllib.parse.urlparse(cleaned)
        host = parsed.netloc.split("@")[-1].split(":")[0]
        if not host or "." not in host:
            raise serializers.ValidationError("Enter a valid URL.")
        return cleaned


class EmailScanInputSerializer(serializers.Serializer):
    body = serializers.CharField(
        required=True,
        min_length=10,
        max_length=getattr(settings, "MAX_EMAIL_BODY_LENGTH", 10000),
        error_messages={
            "blank": "This field may not be blank.",
            "min_length": "Paste at least 10 characters.",
            "max_length": "Maximum 10000 characters.",
        },
    )
    sender = serializers.CharField(required=False, allow_blank=True, max_length=254)
    subject = serializers.CharField(required=False, allow_blank=True, max_length=300)
    url = serializers.CharField(required=False, allow_blank=True, max_length=2048)

    def validate_body(self, value):
        cleaned = value.strip().replace("\x00", "")
        if len(cleaned) < 10:
            raise serializers.ValidationError("Paste at least 10 characters.")
        return cleaned

    def validate_url(self, value):
        if not value:
            return None
        cleaned = value.strip().replace("\x00", "")
        if not cleaned.startswith("http://") and not cleaned.startswith("https://"):
            cleaned = "http://" + cleaned
        return cleaned


class ThreatIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreatIndicator
        fields = ["id", "indicator_type", "title", "description", "severity", "evidence"]


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ["id", "title", "description", "priority"]


class AIAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysis
        fields = ["threat_type", "ai_score", "confidence", "explanation", "key_signals", "status", "model_name"]


class ScanResultSerializer(serializers.ModelSerializer):
    indicators = ThreatIndicatorSerializer(many=True, read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)
    ai_analysis = AIAnalysisSerializer(read_only=True)

    class Meta:
        model = Scan
        fields = [
            "id",
            "scan_type",
            "status",
            "input_text",
            "input_meta",
            "risk_score",
            "risk_level",
            "threat_type",
            "summary",
            "analysis_mode",
            "score_breakdown",
            "indicators",
            "recommendations",
            "ai_analysis",
            "url_analysis",
            "created_at",
        ]


class ScanListSerializer(serializers.ModelSerializer):
    input_preview = serializers.CharField(read_only=True)

    class Meta:
        model = Scan
        fields = [
            "id",
            "scan_type",
            "input_preview",
            "risk_score",
            "risk_level",
            "threat_type",
            "status",
            "created_at",
        ]
