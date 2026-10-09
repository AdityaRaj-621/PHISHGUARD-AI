from django.test import SimpleTestCase
from scanner.services import rule_engine
from scanner.constants import IndicatorType, Severity


class RuleEngineTests(SimpleTestCase):
    def test_section_16_reference_message(self):
        text = "URGENT: Your bank account will be blocked today. Verify your account immediately using the link below and enter your OTP. http://secure-hdfc-verify.co/otp"
        result = rule_engine.analyze(text=text)

        self.assertTrue(result.has(IndicatorType.URGENCY))
        self.assertTrue(result.has(IndicatorType.CREDENTIAL_REQUEST))
        self.assertTrue(result.has(IndicatorType.THREAT_LANGUAGE))
        self.assertTrue(result.has(IndicatorType.IMPERSONATION))
        self.assertGreaterEqual(result.score, 60)

    def test_legitimate_otp_notice_scores_low(self):
        """Authentic bank OTP notices with protective warnings must not trigger credential request alerts."""
        text = "Your OTP is 448213 for payment of INR 500 at Amazon. Do not share this OTP with anyone, including bank officials."
        result = rule_engine.analyze(text=text)

        self.assertFalse(result.has(IndicatorType.CREDENTIAL_REQUEST))
        self.assertLessEqual(result.score, 30)

    def test_plain_newsletter_scores_low(self):
        text = "Here is our weekly product digest discussing the latest architecture patterns in cloud systems and Python backend performance."
        result = rule_engine.analyze(text=text)

        self.assertEqual(len(result.indicators), 0)
        self.assertEqual(result.score, 0)

    def test_urgency_rule_positive_and_negative(self):
        pos_text = "Act now! Your account access expires today within 24 hours. Contact us."
        pos_result = rule_engine.analyze(pos_text)
        self.assertTrue(pos_result.has(IndicatorType.URGENCY))

        neg_text = "Take your time reviewing the document whenever you are free next week."
        neg_result = rule_engine.analyze(neg_text)
        self.assertFalse(neg_result.has(IndicatorType.URGENCY))

    def test_financial_request_rule(self):
        text = "To claim your gift, you must transfer a registration fee of Rs. 500 via UPI immediately."
        result = rule_engine.analyze(text)
        self.assertTrue(result.has(IndicatorType.FINANCIAL_REQUEST))

    def test_reward_bait_rule(self):
        text = "Congratulations! You won a lottery cash prize of $10,000. Claim your prize now."
        result = rule_engine.analyze(text)
        self.assertTrue(result.has(IndicatorType.REWARD_BAIT))

    def test_tech_support_rule(self):
        text = "Critical security alert: virus detected on your computer. Call Microsoft support or install AnyDesk."
        result = rule_engine.analyze(text)
        self.assertTrue(result.has(IndicatorType.THREAT_LANGUAGE))
