from django.test import SimpleTestCase
from scanner.constants import RiskLevel, IndicatorType, ThreatType, Severity
from scanner.services import risk_engine, rule_engine, url_analyzer, ai_analyzer


class RiskEngineTests(SimpleTestCase):
    def test_score_to_risk_level_boundaries(self):
        self.assertEqual(risk_engine.level_for_score(0), RiskLevel.LOW)
        self.assertEqual(risk_engine.level_for_score(30), RiskLevel.LOW)
        self.assertEqual(risk_engine.level_for_score(31), RiskLevel.MEDIUM)
        self.assertEqual(risk_engine.level_for_score(60), RiskLevel.MEDIUM)
        self.assertEqual(risk_engine.level_for_score(61), RiskLevel.HIGH)
        self.assertEqual(risk_engine.level_for_score(80), RiskLevel.HIGH)
        self.assertEqual(risk_engine.level_for_score(81), RiskLevel.CRITICAL)
        self.assertEqual(risk_engine.level_for_score(100), RiskLevel.CRITICAL)

    def test_missing_ai_fallback_rules_only(self):
        rule_res = rule_engine.RuleResult(
            score=50,
            indicators=[
                rule_engine.IndicatorData(
                    indicator_type=IndicatorType.URGENCY,
                    title="Urgency",
                    description="desc",
                    severity=Severity.MEDIUM,
                    evidence="urgent",
                    weight=15,
                ),
                rule_engine.IndicatorData(
                    indicator_type=IndicatorType.THREAT_LANGUAGE,
                    title="Threat",
                    description="desc",
                    severity=Severity.MEDIUM,
                    evidence="blocked",
                    weight=10,
                ),
            ],
            threat_hints={ThreatType.PHISHING: 1},
        )
        ai_res = ai_analyzer.AIResult.skipped()

        final = risk_engine.combine(rule_res, None, ai_res)
        self.assertEqual(final.analysis_mode, "rules_only")
        self.assertEqual(final.risk_score, 50)
        self.assertEqual(final.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(final.threat_type, ThreatType.PHISHING)

    def test_decisive_floors(self):
        # 1. IP host floor >= 70
        rule_res = rule_engine.RuleResult(score=10, indicators=[], threat_hints={})
        url_res = url_analyzer.UrlResult(
            url="http://1.2.3.4",
            domain="1.2.3.4",
            scheme="http",
            https=False,
            subdomain_count=0,
            length=14,
            ip_host=True,
            has_encoded_chars=False,
            has_punycode=False,
            has_at_symbol=False,
            is_shortener=False,
            digit_ratio=0.5,
            hyphen_count=0,
            suspicious_keywords=[],
            lookalike_of=None,
            reputation=None,
            score=35,
            indicators=[],
        )
        final = risk_engine.combine(rule_res, url_res, ai_analyzer.AIResult.skipped())
        self.assertGreaterEqual(final.risk_score, 70)
        self.assertIn("ip_host", final.score_breakdown["floors_applied"])

    def test_thin_evidence_ceiling(self):
        # Single weak indicator, no URL, no AI -> ceiling at 45
        rule_res = rule_engine.RuleResult(
            score=60,
            indicators=[
                rule_engine.IndicatorData(
                    indicator_type=IndicatorType.EXCESSIVE_CAPS,
                    title="Caps",
                    description="desc",
                    severity=Severity.LOW,
                    evidence="!!!",
                    weight=5,
                )
            ],
            threat_hints={},
        )
        final = risk_engine.combine(rule_res, None, ai_analyzer.AIResult.skipped())
        self.assertLessEqual(final.risk_score, 45)
