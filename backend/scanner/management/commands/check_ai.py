from django.core.management.base import BaseCommand
from django.conf import settings
from scanner.services.ai_analyzer import analyze


class Command(BaseCommand):
    help = "Tests connectivity and API key validity with the configured AI provider."

    def handle(self, *args, **options):
        self.stdout.write("Checking AI configuration...")
        self.stdout.write(f"  AI_ENABLED: {getattr(settings, 'AI_ENABLED', False)}")
        self.stdout.write(f"  AI_PROVIDER: {getattr(settings, 'AI_PROVIDER', 'gemini')}")
        self.stdout.write(f"  AI_MODEL: {getattr(settings, 'AI_MODEL', 'gemini-2.0-flash')}")

        api_key = getattr(settings, "GEMINI_API_KEY", "")
        if not api_key:
            self.stdout.write(
                self.style.WARNING("  GEMINI_API_KEY is not set. Scans will run in 'rules_only' mode.")
            )
            return

        self.stdout.write("Sending test payload to AI provider...")
        test_text = "URGENT: Your account has been suspended. Please confirm your OTP at http://test-bank.xyz"
        result = analyze(text=test_text, scan_type="message")

        if result.status == "ok":
            self.stdout.write(
                self.style.SUCCESS(
                    f"AI Check OK!\n  Threat type: {result.threat_type}\n  AI score: {result.ai_score}\n  Confidence: {result.confidence}\n  Explanation: {result.explanation}"
                )
            )
        else:
            self.stdout.write(
                self.style.ERROR(
                    f"AI Check FAILED with status: {result.status}. Verify your GEMINI_API_KEY and network connection."
                )
            )
