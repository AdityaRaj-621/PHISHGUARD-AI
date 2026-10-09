from django.urls import path
from scanner.views import (
    MessageScanView,
    UrlScanView,
    EmailScanView,
    ScanListView,
    ScanDetailView,
)

urlpatterns = [
    path("message/", MessageScanView.as_view(), name="scan-message"),
    path("url/", UrlScanView.as_view(), name="scan-url"),
    path("email/", EmailScanView.as_view(), name="scan-email"),
    path("", ScanListView.as_view(), name="scan-list"),
    path("<int:pk>/", ScanDetailView.as_view(), name="scan-detail"),
]
