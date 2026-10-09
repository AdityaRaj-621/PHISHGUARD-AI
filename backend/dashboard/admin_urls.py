from django.urls import path
from dashboard.views import AdminStatsView

urlpatterns = [
    path("stats/", AdminStatsView.as_view(), name="admin-stats"),
]
