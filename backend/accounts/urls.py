from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import (
    RegisterView,
    LoginView,
    ProfileView,
    ChangePasswordView,
    EducationTopicOpenView,
    LogoutView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="auth-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
    path("education-topic/", EducationTopicOpenView.as_view(), name="auth-education-topic"),
]
