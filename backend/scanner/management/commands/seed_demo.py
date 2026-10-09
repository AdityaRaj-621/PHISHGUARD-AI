import os
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from accounts.models import Profile
from scanner.constants import ScanType
from scanner.services.orchestrator import run_scan

DEMO_SCENARIOS = [
    # Day 13 ago (Phishing Message)
    {
        "days_ago": 13,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "URGENT: Your bank account will be blocked today. Verify your account immediately using the link below and enter your OTP. http://secure-hdfc-verify.co/otp"
        },
    },
    # Day 12 ago (Legitimate OTP)
    {
        "days_ago": 12,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "Your OTP for transaction at Amazon is 448213. Do not share this OTP with anyone, including bank representatives."
        },
    },
    # Day 11 ago (Suspicious URL)
    {
        "days_ago": 11,
        "scan_type": ScanType.URL,
        "payload": {
            "url": "http://192.168.1.5/banking/login.php"
        },
    },
    # Day 10 ago (Job Scam Message)
    {
        "days_ago": 10,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "Congratulations! You have been selected for a part-time work from home job. Daily payout Rs. 5000. Just pay a refundable registration fee of Rs. 499 via UPI to start immediately. Message on WhatsApp only: 9876543210"
        },
    },
    # Day 9 ago (Delivery Scam Email)
    {
        "days_ago": 9,
        "scan_type": ScanType.EMAIL,
        "payload": {
            "sender": "service@indiapost-tracking-update.xyz",
            "subject": "Delivery Failed: Action Required Immediately",
            "body": "Your parcel delivery has failed due to incorrect delivery address. Customs duty of Rs 25 is pending. Please click the link to confirm your delivery address and pay the fee: http://indiapost-parcel-reschedule.xyz/pay",
            "url": "http://indiapost-parcel-reschedule.xyz/pay",
        },
    },
    # Day 8 ago (Safe Website URL)
    {
        "days_ago": 8,
        "scan_type": ScanType.URL,
        "payload": {
            "url": "https://www.wikipedia.org/"
        },
    },
    # Day 7 ago (Investment Crypto Scam Message)
    {
        "days_ago": 7,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "Guaranteed profit daily! Join our VIP crypto trading signals group. Double your money within 24 hours with zero risk. Transfer payment now to activate your account."
        },
    },
    # Day 6 ago (Tech Support Scam Email)
    {
        "days_ago": 6,
        "scan_type": ScanType.EMAIL,
        "payload": {
            "sender": "alert@microsoft-security-desk.net",
            "subject": "CRITICAL: Virus detected on your computer",
            "body": "Your device is infected with spyware. Your computer is locked for security. Call Microsoft support immediately at 1800-555-0199 or install remote access software AnyDesk to resolve this issue.",
        },
    },
    # Day 5 ago (Reward Bait Message)
    {
        "days_ago": 5,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "You won a lottery cash prize of $50,000! Claim your reward today before it expires. Enter your details at http://claim-cash-prize-now.top/login"
        },
    },
    # Day 4 ago (Legitimate Newsletter Email)
    {
        "days_ago": 4,
        "scan_type": ScanType.EMAIL,
        "payload": {
            "sender": "newsletter@techweekly.io",
            "subject": "This Week in Open Source Software",
            "body": "Welcome to our weekly newsletter covering recent developments in Python frameworks, database optimizations, and system design tutorials.",
        },
    },
    # Day 3 ago (Lookalike Phishing URL)
    {
        "days_ago": 3,
        "scan_type": ScanType.URL,
        "payload": {
            "url": "http://paypa1-security-verification.com/login"
        },
    },
    # Day 2 ago (Bank Impersonation Message)
    {
        "days_ago": 2,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "SBI Alert: Your net banking credentials need mandatory KYC update within 24 hours or your debit card will be blocked. Visit http://sbi-kyc-update-portal.info to verify."
        },
    },
    # Day 1 ago (Shortened Phishing Link)
    {
        "days_ago": 1,
        "scan_type": ScanType.MESSAGE,
        "payload": {
            "content": "Your electricity power will be disconnected tonight due to unpaid bill. Pay immediately using this link: https://bit.ly/3xPowerPay or call 9876543210"
        },
    },
    # Today (Clean URL)
    {
        "days_ago": 0,
        "scan_type": ScanType.URL,
        "payload": {
            "url": "https://github.com/django/django"
        },
    },
]


class Command(BaseCommand):
    help = "Seeds demo users (aisha, admin, demo) and 14 backdated scans."

    def handle(self, *args, **options):
        # 1. Aisha (Demo User)
        user_aisha, _ = User.objects.get_or_create(
            username="aisha",
            defaults={"email": "aisha@example.com", "first_name": "Aisha", "last_name": "Kumar"}
        )
        user_aisha.email = "aisha@example.com"
        user_aisha.first_name = "Aisha"
        user_aisha.last_name = "Kumar"
        user_aisha.set_password("DemoPass123!")
        user_aisha.is_active = True
        user_aisha.save()

        profile_aisha, _ = Profile.objects.get_or_create(user=user_aisha)
        profile_aisha.display_name = "Aisha Kumar"
        profile_aisha.education_topics_opened = 4
        profile_aisha.save()

        user_aisha.scans.all().delete()
        now = timezone.now()
        created_scans = []

        self.stdout.write("Generating scans for demo user 'aisha'...")
        for scenario in DEMO_SCENARIOS:
            scan = run_scan(
                user=user_aisha,
                scan_type=scenario["scan_type"],
                payload=scenario["payload"],
            )
            backdated_time = now - timedelta(days=scenario["days_ago"], hours=2)
            type(scan).objects.filter(id=scan.id).update(created_at=backdated_time)
            created_scans.append(scan)

        # 2. Admin User
        user_admin, _ = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@phishguard.ai", "first_name": "System", "last_name": "Admin"}
        )
        user_admin.email = "admin@phishguard.ai"
        user_admin.set_password("AdminPass123!")
        user_admin.is_staff = True
        user_admin.is_superuser = True
        user_admin.is_active = True
        user_admin.save()
        profile_admin, _ = Profile.objects.get_or_create(user=user_admin)
        profile_admin.display_name = "System Admin"
        profile_admin.save()

        # 3. Demo User
        user_demo, _ = User.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@phishguard.ai", "first_name": "Demo", "last_name": "User"}
        )
        user_demo.email = "demo@phishguard.ai"
        user_demo.set_password("DemoPass123!")
        user_demo.is_active = True
        user_demo.save()
        profile_demo, _ = Profile.objects.get_or_create(user=user_demo)
        profile_demo.display_name = "Demo User"
        profile_demo.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded demo accounts (aisha@example.com, admin@phishguard.ai, demo@phishguard.ai) with {len(created_scans)} realistic backdated scans."
            )
        )
