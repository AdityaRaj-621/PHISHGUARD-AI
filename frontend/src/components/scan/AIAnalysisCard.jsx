import React, { useState } from 'react';
import { Sparkles, MinusCircle, CircleDot } from 'lucide-react';
import Card from '../ui/Card';
import ThreatBadge from '../risk/ThreatBadge';
import Tooltip from '../ui/Tooltip';
import { getHedgedClassification, getConfidenceLabel } from '../../utils/copy';

export default function AIAnalysisCard({
  ai = null,
  fallbackLevel = 'UNKNOWN',
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isFailed = !ai || ai.status === 'failed';

  if (isFailed) {
    return (
      <Card
        className={`ai-analysis-card ai-analysis-card--unavailable ${className}`}
        padding="lg"
        style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-alt)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <MinusCircle size={18} style={{ color: 'var(--color-text-muted)' }} />
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}>
            AI analysis unavailable
          </h3>
        </div>
        <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
          This result comes from rule-based detection only. The score may be less complete than usual.
        </p>
      </Card>
    );
  }

  const confidenceLabel = getConfidenceLabel(ai.confidence);
  const hedgedText = getHedgedClassification(ai.threat_type);
  const explanation = ai.explanation || '';
  const keySignals = ai.key_signals || [];

  return (
    <Card
      className={`ai-analysis-card ${className}`}
      padding="lg"
      style={{
        border: '1px solid #BFDBFE',
        backgroundColor: 'var(--color-surface)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}>
            AI analysis
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <ThreatBadge threatType={ai.threat_type} />
          {confidenceLabel && (
            <Tooltip content={`Model raw score: ${ai.confidence !== undefined ? ai.confidence : '—'}`}>
              <span
                style={{
                  fontSize: 'var(--fs-xs)',
                  fontWeight: 'var(--fw-medium)',
                  color: 'var(--color-primary)',
                  backgroundColor: 'var(--color-primary-soft)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid #BFDBFE'
                }}
              >
                {confidenceLabel}
              </span>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Hedged assessment */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <p style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
          Assessment: {hedgedText}
        </p>
      </div>

      {/* Explanation text */}
      {explanation && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p
            style={{
              fontSize: 'var(--fs-body)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: 'var(--reading-max)',
              margin: 0
            }}
          >
            {explanation}
          </p>
        </div>
      )}

      {/* Key signals list */}
      {keySignals.length > 0 && (
        <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-card-alt)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
            Key AI signals detected:
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0 }}>
            {keySignals.map((signal, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)' }}>
                <CircleDot size={12} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Static Model Note */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
          Generated by an AI model. It can be wrong, especially on short or unusual text.
        </p>
      </div>
    </Card>
  );
}
