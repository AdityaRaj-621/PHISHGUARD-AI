from django.db.models import Q
from django.utils.dateparse import parse_date, parse_datetime


def filter_scans(queryset, query_params):
    """
    Applies search, type, risk_level, threat_type, date range, and ordering filters to Scan queryset.
    """
    scan_type = query_params.get("type") or query_params.get("scan_type")
    if scan_type:
        queryset = queryset.filter(scan_type=scan_type)

    risk_level = query_params.get("risk_level")
    if risk_level:
        queryset = queryset.filter(risk_level__iexact=risk_level)

    threat_type = query_params.get("threat_type")
    if threat_type:
        queryset = queryset.filter(threat_type__iexact=threat_type)

    search = query_params.get("search")
    if search:
        search_term = search.strip()
        queryset = queryset.filter(
            Q(input_text__icontains=search_term) | Q(threat_type__icontains=search_term)
        )

    date_from = query_params.get("date_from")
    if date_from:
        parsed_from = parse_datetime(date_from) or parse_date(date_from)
        if parsed_from:
            queryset = queryset.filter(created_at__gte=parsed_from)

    date_to = query_params.get("date_to")
    if date_to:
        parsed_to = parse_datetime(date_to) or parse_date(date_to)
        if parsed_to:
            queryset = queryset.filter(created_at__lte=parsed_to)

    ordering = query_params.get("ordering", "-created_at")
    allowed_orderings = {
        "-created_at",
        "created_at",
        "-risk_score",
        "risk_score",
        "-risk_level",
        "risk_level",
    }
    if ordering in allowed_orderings:
        queryset = queryset.order_by(ordering)
    else:
        queryset = queryset.order_by("-created_at")

    return queryset
