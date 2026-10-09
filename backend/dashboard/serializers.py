from rest_framework import serializers
from scanner.serializers import ScanListSerializer


class AwarenessScoreSerializer(serializers.Serializer):
    value = serializers.IntegerField()
    band = serializers.CharField()
    factors = serializers.ListField(child=serializers.CharField())


class DashboardTotalsSerializer(serializers.Serializer):
    total_scans = serializers.IntegerField()
    low_risk = serializers.IntegerField()
    medium_risk = serializers.IntegerField()
    high_risk = serializers.IntegerField()
    critical_risk = serializers.IntegerField()


class RiskDistributionItemSerializer(serializers.Serializer):
    level = serializers.CharField()
    count = serializers.IntegerField()


class ThreatCategoryItemSerializer(serializers.Serializer):
    threat_type = serializers.CharField()
    count = serializers.IntegerField()


class ScanActivityItemSerializer(serializers.Serializer):
    date = serializers.CharField()
    count = serializers.IntegerField()


class RecentAlertSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    risk_level = serializers.CharField()
    threat_type = serializers.CharField()
    created_at = serializers.DateTimeField()


class DashboardResponseSerializer(serializers.Serializer):
    totals = DashboardTotalsSerializer()
    awareness_score = AwarenessScoreSerializer()
    risk_distribution = RiskDistributionItemSerializer(many=True)
    threat_categories = ThreatCategoryItemSerializer(many=True)
    scan_activity = ScanActivityItemSerializer(many=True)
    recent_scans = ScanListSerializer(many=True)
    recent_alerts = RecentAlertSerializer(many=True)


class AdminStatsSerializer(serializers.Serializer):
    """Aggregates only — never scan contents, usernames, or emails."""
    total_users = serializers.IntegerField()
    total_scans = serializers.IntegerField()
    high_risk_scans = serializers.IntegerField()
    scans_today = serializers.IntegerField()
    most_common_threat = serializers.CharField(allow_null=True)
    most_scanned_type = serializers.CharField(allow_null=True)
    threat_distribution = ThreatCategoryItemSerializer(many=True)
    risk_distribution = RiskDistributionItemSerializer(many=True)
    daily_scans = ScanActivityItemSerializer(many=True)
