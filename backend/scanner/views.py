from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from scanner.constants import ScanType
from scanner.models import Scan
from scanner.serializers import (
    MessageScanInputSerializer,
    UrlScanInputSerializer,
    EmailScanInputSerializer,
    ScanResultSerializer,
    ScanListSerializer,
)
from scanner.services.orchestrator import run_scan
from scanner.filters import filter_scans


class StandardScanPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50


class MessageScanView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "scan"

    def post(self, request):
        serializer = MessageScanInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        scan = run_scan(
            user=request.user,
            scan_type=ScanType.MESSAGE,
            payload=serializer.validated_data,
        )
        return Response(ScanResultSerializer(scan).data, status=status.HTTP_201_CREATED)


class UrlScanView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "scan"

    def post(self, request):
        serializer = UrlScanInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        scan = run_scan(
            user=request.user,
            scan_type=ScanType.URL,
            payload=serializer.validated_data,
        )
        return Response(ScanResultSerializer(scan).data, status=status.HTTP_201_CREATED)


class EmailScanView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "scan"

    def post(self, request):
        serializer = EmailScanInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        scan = run_scan(
            user=request.user,
            scan_type=ScanType.EMAIL,
            payload=serializer.validated_data,
        )
        return Response(ScanResultSerializer(scan).data, status=status.HTTP_201_CREATED)


class ScanListView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"

    def get(self, request):
        # Strict isolation: filter by user first
        queryset = Scan.objects.filter(user=request.user)
        queryset = filter_scans(queryset, request.query_params)

        paginator = StandardScanPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ScanListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ScanDetailView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"

    def get(self, request, pk):
        try:
            scan = (
                Scan.objects.filter(user=request.user)
                .prefetch_related("indicators", "recommendations")
                .select_related("ai_analysis")
                .get(pk=pk)
            )
        except Scan.DoesNotExist:
            raise Http404("Not found.")

        return Response(ScanResultSerializer(scan).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            scan = Scan.objects.filter(user=request.user).get(pk=pk)
        except Scan.DoesNotExist:
            raise Http404("Not found.")

        scan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
