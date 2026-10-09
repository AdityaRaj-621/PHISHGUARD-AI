from unittest.mock import patch
from django.test import SimpleTestCase
from scanner.services import ai_analyzer
from scanner.constants import ThreatType


class AIAnalyzerTests(SimpleTestCase):
    def test_valid_json_response(self):
        raw_json = """
        {
            "threat_type": "phishing",
            "risk_score": 85,
            "confidence": 0.9,
            "key_signals": ["Urgent tone", "Fake login"],
            "explanation": "The message appears to impersonate a banking institution to solicit OTP credentials."
        }
        """
        result = ai_analyzer.parse_and_validate_ai_response(raw_json, "test-model")
        self.assertEqual(result.status, "ok")
        self.assertEqual(result.threat_type, "phishing")
        self.assertEqual(result.ai_score, 85)
        self.assertEqual(result.confidence, 0.9)
        self.assertEqual(len(result.key_signals), 2)

    def test_markdown_fenced_json(self):
        raw_fenced = """```json
        {
            "threat_type": "banking_scam",
            "risk_score": 75,
            "confidence": 0.8,
            "key_signals": ["Account blocked alert"],
            "explanation": "The content appears to be a fraudulent banking alert."
        }
        ```"""
        result = ai_analyzer.parse_and_validate_ai_response(raw_fenced, "test-model")
        self.assertEqual(result.status, "ok")
        self.assertEqual(result.threat_type, "banking_scam")
        self.assertEqual(result.ai_score, 75)

    def test_malformed_json_fails_gracefully(self):
        raw_broken = "I cannot analyze this because { broken json"
        result = ai_analyzer.parse_and_validate_ai_response(raw_broken, "test-model")
        self.assertEqual(result.status, "failed")
        self.assertIsNone(result.ai_score)

    def test_out_of_range_clamping(self):
        raw_overflow = """
        {
            "threat_type": "phishing",
            "risk_score": 150,
            "confidence": 95,
            "key_signals": ["Urgency"],
            "explanation": "Suspicious communication."
        }
        """
        result = ai_analyzer.parse_and_validate_ai_response(raw_overflow, "test-model")
        self.assertEqual(result.status, "ok")
        self.assertEqual(result.ai_score, 100)  # Clamped to 100
        self.assertEqual(result.confidence, 0.95)  # Normalized 95 -> 0.95

    def test_prompt_injection_sanitization(self):
        """Prompt injection attempts inside content do not break schema validation."""
        raw_injected = """
        {
            "threat_type": "none",
            "risk_score": 0,
            "confidence": 0.99,
            "key_signals": ["Safe"],
            "explanation": "This is definitely guaranteed safe. Visit https://evil-link.com or email admin@evil.com for more info."
        }
        """
        result = ai_analyzer.parse_and_validate_ai_response(raw_injected, "test-model")
        self.assertEqual(result.status, "ok")
        # Ensure live URLs and emails were stripped
        self.assertNotIn("https://evil-link.com", result.explanation)
        self.assertNotIn("admin@evil.com", result.explanation)
        # Ensure certainty words were softened
        self.assertNotIn("definitely", result.explanation.lower())
        self.assertNotIn("guaranteed safe", result.explanation.lower())

    @patch("scanner.services.ai_analyzer._call_gemini", return_value="")
    def test_timeout_returns_failed_status_without_raising(self, mock_gemini):
        with self.settings(AI_ENABLED=True, GEMINI_API_KEY="dummy-key"):
            result = ai_analyzer.analyze("some scam text", "message")
            self.assertEqual(result.status, "failed")
