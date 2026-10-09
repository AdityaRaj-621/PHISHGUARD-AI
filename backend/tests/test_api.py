from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from scanner.constants import ScanType, RiskLevel, ThreatType
from scanner.models import Scan


class PhishGuardAPITests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="user_a",
            email="usera@example.com",
            password="SecurePassword123!",
            first_name="Alice",
            last_name="Smith",
        )
        self.user_b = User.objects.create_user(
            username="user_b",
            email="userb@example.com",
            password="SecurePassword123!",
            first_name="Bob",
            last_name="Jones",
        )

    def test_registration_and_autologin(self):
        reg_payload = {
            "name": "Charlie Brown",
            "email": "charlie@example.com",
            "password": "StrongPassword99!",
            "password2": "StrongPassword99!",
        }
        res = self.client.post("/api/v1/auth/register/", reg_payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertIn("user", res.data)
        self.assertEqual(res.data["user"]["email"], "charlie@example.com")

    def test_login_with_email_or_username(self):
        # 1. Login with email
        res_email = self.client.post(
            "/api/v1/auth/login/",
            {"username": "usera@example.com", "password": "SecurePassword123!"},
        )
        self.assertEqual(res_email.status_code, status.HTTP_200_OK)
        self.assertIn("access", res_email.data)

        # 2. Login with username
        res_user = self.client.post(
            "/api/v1/auth/login/",
            {"username": "user_a", "password": "SecurePassword123!"},
        )
        self.assertEqual(res_user.status_code, status.HTTP_200_OK)

        # 3. Invalid password -> generic 401
        res_bad = self.client.post(
            "/api/v1/auth/login/",
            {"username": "usera@example.com", "password": "WrongPassword!"},
        )
        self.assertEqual(res_bad.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(res_bad.data["detail"], "No active account found with the given credentials")

    def test_unauthenticated_scan_returns_401(self):
        res = self.client.post("/api/v1/scans/message/", {"content": "Check this out"})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_message_scan_and_section_16_reference(self):
        self.client.force_authenticate(user=self.user_a)
        ref_message = (
            "URGENT: Your bank account will be blocked today. Verify your account "
            "immediately using the link below and enter your OTP. http://secure-hdfc-verify.co/otp"
        )
        res = self.client.post("/api/v1/scans/message/", {"content": ref_message})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        data = res.data
        self.assertEqual(data["scan_type"], "message")
        self.assertIn(data["risk_level"], ["HIGH", "CRITICAL"])
        self.assertIn(data["threat_type"], ["phishing", "banking_scam"])
        self.assertGreaterEqual(len(data["indicators"]), 4)
        self.assertGreaterEqual(len(data["recommendations"]), 2)
        self.assertIn("score_breakdown", data)

    def test_url_scan_flow(self):
        self.client.force_authenticate(user=self.user_a)
        res = self.client.post("/api/v1/scans/url/", {"url": "http://192.168.1.1/admin/login"})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["scan_type"], "url")
        self.assertIsNotNone(res.data["url_analysis"])
        self.assertTrue(res.data["url_analysis"]["ip_host"])

    def test_email_scan_flow(self):
        self.client.force_authenticate(user=self.user_a)
        payload = {
            "sender": "alert@fake-service.xyz",
            "subject": "Account suspension notice",
            "body": "Your account will be suspended today unless you pay the overdue fee immediately.",
        }
        res = self.client.post("/api/v1/scans/email/", payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["scan_type"], "email")

    def test_multi_user_isolation_returns_404_not_403(self):
        # User A creates a scan
        self.client.force_authenticate(user=self.user_a)
        scan_res = self.client.post(
            "/api/v1/scans/message/",
            {"content": "Confidential test message for User A only with at least ten characters."},
        )
        scan_id = scan_res.data["id"]

        # User B attempts to access User A's scan
        self.client.force_authenticate(user=self.user_b)
        res_b = self.client.get(f"/api/v1/scans/{scan_id}/")
        self.assertEqual(res_b.status_code, status.HTTP_404_NOT_FOUND)

        # User B cannot see it in scan list
        list_res = self.client.get("/api/v1/scans/")
        self.assertEqual(list_res.data["count"], 0)

    def test_oversized_and_short_input_validation(self):
        self.client.force_authenticate(user=self.user_a)
        # Short message (<10 chars)
        res_short = self.client.post("/api/v1/scans/message/", {"content": "Hi"})
        self.assertEqual(res_short.status_code, status.HTTP_400_BAD_REQUEST)

        # Oversized message (>5000 chars)
        res_long = self.client.post("/api/v1/scans/message/", {"content": "A" * 5005})
        self.assertEqual(res_long.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dashboard_aggregates(self):
        self.client.force_authenticate(user=self.user_a)
        # Create 2 scans for user A
        self.client.post("/api/v1/scans/message/", {"content": "First scan with sufficient length."})
        self.client.post("/api/v1/scans/url/", {"url": "https://www.wikipedia.org/"})

        res_dash = self.client.get("/api/v1/dashboard/")
        self.assertEqual(res_dash.status_code, status.HTTP_200_OK)
        self.assertEqual(res_dash.data["totals"]["total_scans"], 2)
        self.assertEqual(len(res_dash.data["scan_activity"]), 14)
        self.assertIn("awareness_score", res_dash.data)
        self.assertIn("band", res_dash.data["awareness_score"])
