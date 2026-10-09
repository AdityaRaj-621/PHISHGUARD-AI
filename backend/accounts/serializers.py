import re
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import Profile


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    display_name = serializers.CharField(source="profile.display_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "display_name", "is_staff", "date_joined"]

    def get_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name if name else obj.username


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    username = serializers.CharField(required=False, allow_blank=True, max_length=150)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})
    password2 = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized_email

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError({"password2": ["Passwords don't match."]})

        # Django password validators
        user_instance = User(
            username=attrs.get("username") or attrs.get("email", "").split("@")[0],
            email=attrs.get("email")
        )
        try:
            validate_password(attrs.get("password"), user=user_instance)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()
        raw_username = validated_data.get("username", "").strip()
        name = validated_data.get("name", "").strip()

        if not raw_username:
            # Derive from email local part
            base_username = re.sub(r"[^\w.@+-]", "", email.split("@")[0])[:20] or "user"
            candidate = base_username
            suffix = 1
            while User.objects.filter(username__iexact=candidate).exists():
                candidate = f"{base_username}{suffix}"
                suffix += 1
            username = candidate
        else:
            if User.objects.filter(username__iexact=raw_username).exists():
                raise serializers.ValidationError({"username": ["A user with this username already exists."]})
            username = raw_username

        # Split name into first and last
        name_parts = name.split(None, 1)
        first_name = name_parts[0] if name_parts else ""
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
        )

        profile, _ = Profile.objects.get_or_create(user=user)
        if name:
            profile.display_name = name
            profile.save()

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={"input_type": "password"})


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect current password.")
        return value

    def validate(self, attrs):
        if attrs.get("new_password") != attrs.get("new_password2"):
            raise serializers.ValidationError({"new_password2": ["New passwords don't match."]})

        user = self.context["request"].user
        try:
            validate_password(attrs.get("new_password"), user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"new_password": list(exc.messages)})

        return attrs

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    display_name = serializers.CharField(required=False, allow_blank=True, max_length=80)

    class Meta:
        model = Profile
        fields = ["name", "display_name"]

    def update(self, instance, validated_data):
        name = validated_data.get("name")
        if name is not None:
            parts = name.strip().split(None, 1)
            instance.user.first_name = parts[0] if parts else ""
            instance.user.last_name = parts[1] if len(parts) > 1 else ""
            instance.user.save()

        if "display_name" in validated_data:
            instance.display_name = validated_data["display_name"]
            instance.save()

        return instance
