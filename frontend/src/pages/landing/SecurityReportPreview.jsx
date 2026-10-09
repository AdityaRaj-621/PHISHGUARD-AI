import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import RiskBadge from '../../components/risk/RiskBadge';
import ThreatBadge from '../../components/risk/ThreatBadge';
import RiskMeter from '../../components/risk/RiskMeter';
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SecurityReportPreview() {
  const [meterScore, setMeterScore] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setMeterScore(92);
      return;
    }

    let startTime = null;
    const duration = 900; // 900ms per §13.2
    let animId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setMeterScore(Math.round(eased * 92));

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        setMeterScore(92);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <Card
      padding="none"
      variant="elevated"
      className="report-preview-card"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Verdict Hero Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-danger-bg)',
          borderBottom: '1px solid var(--color-danger-border)',
          borderTop: '4px solid var(--color-danger)',
          padding: 'var(--space-5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <RiskBadge level="HIGH" score={92} uppercase={true} size="md" />
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)' }}>
            Scanned 2 min ago
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
          <span
            style={{
              fontSize: '3.5rem',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-danger)',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {meterScore}
          </span>
          <span style={{ fontSize: 'var(--fs-h3)', color: 'var(--color-text-secondary)', fontWeight: 'var(--fw-medium)' }}>
            / 100
          </span>
        </div>

        {/* Animated Calibrated Meter */}
        <RiskMeter score={meterScore} level="HIGH" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Threat type:</span>
            <ThreatBadge threatType="phishing" size="sm" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--fs-xs)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Confidence:</span>
            <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}>Moderate</span>
          </div>
        </div>

        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)', lineHeight: 1.4, margin: 'var(--space-3) 0 0 0' }}>
          Several strong scam indicators were found. Treat this as unsafe until you verify directly.
        </p>
      </div>

      {/* Snippet breakdown */}
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Detected Signals
          </span>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-danger)', fontWeight: 'var(--fw-semibold)' }}>
            4 indicators
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-xs)', padding: '6px 8px', backgroundColor: 'var(--color-card-alt)', borderRadius: 'var(--radius-sm)' }}>
            <ShieldAlert size={14} style={{ color: 'var(--color-danger)' }} />
            <span style={{ fontWeight: 'var(--fw-medium)', color: 'var(--color-text)' }}>Urgent deadline pressure</span>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>"blocked today"</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-xs)', padding: '6px 8px', backgroundColor: 'var(--color-card-alt)', borderRadius: 'var(--radius-sm)' }}>
            <ShieldAlert size={14} style={{ color: 'var(--color-danger)' }} />
            <span style={{ fontWeight: 'var(--fw-medium)', color: 'var(--color-text)' }}>Sensitive OTP requested</span>
            <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>"enter your OTP"</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
            Interactive scan report preview
          </span>
          <Link
            to="/scan/message"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--color-primary)',
              textDecoration: 'none'
            }}
          >
            <span>Scan yours now</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
