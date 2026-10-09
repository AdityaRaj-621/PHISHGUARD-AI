from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.models import Profile
from accounts.serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    ProfileUpdateSerializer,
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def compute_user_stats(user):
    # Aggregates without loading all scans
    total_scans = user.scans.count()
    threats_detected = user.scans.filter(risk_level__in=["HIGH", "CRITICAL"]).count()
    variety = user.scans.values("scan_type").distinct().count()
    education = user.profile.education_topics_opened if hasattr(user, "profile") else 0

    base = 40
    scan_activity = min(total_scans, 20) * 1.5
    variety_score = variety * 5
    education_score = min(education, 5) * 3
    value = min(100, round(base + scan_activity + variety_score + education_score))

    if value < 40:
        band = "needs_attention"
    elif value < 70:
        band = "developing"
    else:
        band = "strong"

    return {
        "total_scans": total_scans,
        "threats_detected": threats_detected,
        "education_topics_opened": education,
        "awareness_score": {
            "value": value,
            "band": band,
            "factors": [
                "Scans completed",
                "Scan variety tested",
                "Education topics opened",
            ],
        },
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return Response(
            {
                "user": user_data,
                "access": tokens["access"],
                "refresh": tokens["refresh"],
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data["username"].strip()
        password = serializer.validated_data["password"]

        username_to_auth = identifier
        if "@" in identifier:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
                username_to_auth = user_obj.username
            except User.DoesNotExist:
                return Response(
                    {"detail": "No active account found with the given credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        user = authenticate(request, username=username_to_auth, password=password)
        if not user or not user.is_active:
            return Response(
                {"detail": "No active account found with the given credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return Response(
            {
                "user": user_data,
                "access": tokens["access"],
                "refresh": tokens["refresh"],
            },
            status=status.HTTP_200_OK,
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"

    def get(self, request):
        user_data = UserSerializer(request.user).data
        stats = compute_user_stats(request.user)
        return Response({**user_data, "stats": stats})

    def patch(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = UserSerializer(request.user).data
        stats = compute_user_stats(request.user)
        return Response({**user_data, "stats": stats})

    def put(self, request):
        return self.patch(request)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "auth"

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)


class EducationTopicOpenView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "user"

    def post(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.education_topics_opened += 1
        profile.save()
        return Response(
            {"education_topics_opened": profile.education_topics_opened},
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
