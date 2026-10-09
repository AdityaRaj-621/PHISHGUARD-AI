from unittest.mock import patch
from django.test import SimpleTestCase
from scanner.services import url_analyzer
from scanner.constants import IndicatorType


class UrlAnalyzerTests(SimpleTestCase):
    def test_ip_host_url(self):
        url = "http://192.168.1.5/login"
        result = url_analyzer.analyze(url)

        self.assertTrue(result.ip_host)
        self.assertFalse(result.https)
        self.assertGreaterEqual(result.score, 35)
        self.assertTrue(any(i.indicator_type == IndicatorType.URL_IP_HOST for i in result.indicators))
        self.assertTrue(any(i.indicator_type == IndicatorType.URL_NO_HTTPS for i in result.indicators))

    def test_lookalike_and_keywords_url(self):
        url = "https://secure-hdfc-verify.co/otp"
        result = url_analyzer.analyze(url)

        self.assertIsNotNone(result.lookalike_of)
        self.assertEqual(result.lookalike_of, "hdfcbank.com")
        self.assertIn("verify", result.suspicious_keywords)
        self.assertIn("otp", result.suspicious_keywords)
        self.assertTrue(any(i.indicator_type == IndicatorType.URL_LOOKALIKE for i in result.indicators))

    def test_clean_wikipedia_url(self):
        url = "https://www.wikipedia.org/"
        result = url_analyzer.analyze(url)

        self.assertEqual(result.score, 0)
        self.assertEqual(len(result.indicators), 0)
        self.assertIsNone(result.lookalike_of)

    @patch("urllib.request.urlopen")
    @patch("requests.get")
    def test_zero_network_calls_made(self, mock_requests_get, mock_urllib_open):
        """URL analyzer must never make outbound HTTP requests to user-supplied URLs."""
        url = "http://malicious-scam-site-test.com/payload.exe"
        result = url_analyzer.analyze(url)

        mock_requests_get.assert_not_called()
        mock_urllib_open.assert_not_called()
        self.assertIsNotNone(result)

    def test_shortener_url(self):
        url = "https://bit.ly/3xPower"
        result = url_analyzer.analyze(url)

        self.assertTrue(result.is_shortener)
        self.assertTrue(any(i.indicator_type == IndicatorType.URL_SHORTENER for i in result.indicators))
