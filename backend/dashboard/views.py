from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from scanner.constants import RiskLevel
from scanner.models import Scan
from scanner.serializers import ScanListSerializer
from dashboard.serializers import (
    DashboardResponseSerializer,
    AdminStatsSerializer,
)


class DashboardView(APIView):
    """
    Computes dashboard analytics for the currently authenticated user.
    All data computed efficiently with ORM queries and continuous 14-day activity.
    """
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"

    def get(self, request):
        user = request.user
        user_scans = Scan.objects.filter(user=user)

        total_scans = user_scans.count()
        low_count = user_scans.filter(risk_level=RiskLevel.LOW).count()
        med_count = user_scans.filter(risk_level=RiskLevel.MEDIUM).count()
        high_count = user_scans.filter(risk_level=RiskLevel.HIGH).count()
        crit_count = user_scans.filter(risk_level=RiskLevel.CRITICAL).count()

        totals = {
            "total_scans": total_scans,
            "low_risk": low_count,
            "medium_risk": med_count,
            "high_risk": high_count,
            "critical_risk": crit_count,
        }

        # Awareness score computation (§11)
        distinct_types = user_scans.values("scan_type").distinct().count()
        education_opened = user.profile.education_topics_opened if hasattr(user, "profile") else 0

        base = 40
        scan_activity_pts = min(total_scans, 20) * 1.5
        variety_pts = distinct_types * 5
        education_pts = min(education_opened, 5) * 3
        awareness_val = min(100, round(base + scan_activity_pts + variety_pts + education_pts))

        if awareness_val < 40:
            band = "needs_attention"
        elif awareness_val < 70:
            band = "developing"
        else:
            band = "strong"

        awareness_score = {
            "value": awareness_val,
            "band": band,
            "factors": [
                "Scans completed",
                "Scan variety tested",
                "Education topics opened",
            ],
        }

        # Risk distribution
        risk_dist = [
            {"level": RiskLevel.LOW.value, "count": low_count},
            {"level": RiskLevel.MEDIUM.value, "count": med_count},
            {"level": RiskLevel.HIGH.value, "count": high_count},
            {"level": RiskLevel.CRITICAL.value, "count": crit_count},
        ]

        # Threat categories
        threat_cats_query = (
            user_scans.values("threat_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        threat_categories = [
            {"threat_type": item["threat_type"], "count": item["count"]}
            for item in threat_cats_query
            if item["threat_type"] not in ["none", "unknown"]
        ]

        # 14-day scan activity with zero-filled continuous dates
        today = timezone.now().date()
        start_date = today - timedelta(days=13)
        daily_counts_qs = (
            user_scans.filter(created_at__date__gte=start_date)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        )
        count_map = {item["day"]: item["count"] for item in daily_counts_qs if item.get("day")}

        scan_activity = []
        for offset in range(13, -1, -1):
            day_date = today - timedelta(days=offset)
            scan_activity.append({
                "date": day_date.strftime("%Y-%m-%d"),
                "count": count_map.get(day_date, 0),
            })

        # Recent scans (max 5)
        recent_scans_qs = user_scans.order_by("-created_at")[:5]
        recent_scans = ScanListSerializer(recent_scans_qs, many=True).data

        # Recent alerts (max 5)
        recent_alerts_qs = (
            user_scans.filter(risk_level__in=[RiskLevel.HIGH, RiskLevel.CRITICAL])
            .order_by("-created_at")[:5]
        )
        recent_alerts = [
            {
                "id": s.id,
                "risk_level": s.risk_level,
                "threat_type": s.threat_type,
                "created_at": s.created_at,
            }
            for s in recent_alerts_qs
        ]

        payload = {
            "totals": totals,
            "awareness_score": awareness_score,
            "risk_distribution": risk_dist,
            "threat_categories": threat_categories,
            "scan_activity": scan_activity,
            "recent_scans": recent_scans,
            "recent_alerts": recent_alerts,
        }

        serializer = DashboardResponseSerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminStatsView(APIView):
    """
    Admin-only platform statistics view.
    Returns only system-wide aggregates — never scan contents, usernames, or emails.
    """
    permission_classes = [IsAdminUser]
    throttle_scope = "user"

    def get(self, request):
        total_users = User.objects.count()
        total_scans = Scan.objects.count()
        high_risk_scans = Scan.objects.filter(
            risk_level__in=[RiskLevel.HIGH, RiskLevel.CRITICAL]
        ).count()

        today = timezone.now().date()
        scans_today = Scan.objects.filter(created_at__date=today).count()

        # Most common threat
        top_threat = (
            Scan.objects.exclude(threat_type__in=["none", "unknown"])
            .values("threat_type")
            .annotate(count=Count("id"))
            .order_by("-count")
            .first()
        )
        most_common_threat = top_threat["threat_type"] if top_threat else None

        # Most scanned type
        top_type = (
            Scan.objects.values("scan_type")
            .annotate(count=Count("id"))
            .order_by("-count")
            .first()
        )
        most_scanned_type = top_type["scan_type"] if top_type else None

        # Threat distribution
        threat_dist_qs = (
            Scan.objects.values("threat_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        threat_distribution = [
            {"threat_type": item["threat_type"], "count": item["count"]}
            for item in threat_dist_qs
        ]

        # Risk distribution
        risk_dist_qs = (
            Scan.objects.values("risk_level")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        risk_distribution = [
            {"level": item["risk_level"], "count": item["count"]}
            for item in risk_dist_qs
        ]

        # 14-day daily scans
        start_date = today - timedelta(days=13)
        daily_counts_qs = (
            Scan.objects.filter(created_at__date__gte=start_date)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        )
        count_map = {item["day"]: item["count"] for item in daily_counts_qs if item.get("day")}

        daily_scans = []
        for offset in range(13, -1, -1):
            day_date = today - timedelta(days=offset)
            daily_scans.append({
                "date": day_date.strftime("%Y-%m-%d"),
                "count": count_map.get(day_date, 0),
            })

        payload = {
            "total_users": total_users,
            "total_scans": total_scans,
            "high_risk_scans": high_risk_scans,
            "scans_today": scans_today,
            "most_common_threat": most_common_threat,
            "most_scanned_type": most_scanned_type,
            "threat_distribution": threat_distribution,
            "risk_distribution": risk_distribution,
            "daily_scans": daily_scans,
        }

        serializer = AdminStatsSerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)
