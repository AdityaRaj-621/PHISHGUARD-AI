from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=80, blank=True)
    education_topics_opened = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Profile of {self.user.username}"
