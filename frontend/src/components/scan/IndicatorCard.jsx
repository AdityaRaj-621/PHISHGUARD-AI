import React from 'react';
import {
  Clock,
  KeyRound,
  IndianRupee,
  AlertOctagon,
  Gift,
  Link2Off,
  Unlock,
  Server,
  Copy,
  Minimize2,
  UserX,
  Building2,
  SpellCheck,
  Paperclip,
  Info,
  Quote
} from 'lucide-react';
import { getIndicatorMeta } from '../../utils/indicators';
import Card from '../ui/Card';

const ICON_MAP = {
  Clock,
  KeyRound,
  IndianRupee,
  AlertOctagon,
  Gift,
  Link2Off,
  Unlock,
  Server,
  Copy,
  Minimize2,
  UserX,
  Building2,
  SpellCheck,
  Paperclip,
  Info
};

export default function IndicatorCard({
  type,
  title,
  description,
  severity = 'medium', // 'low', 'medium', 'high'
  evidence = null,
  className = ''
}) {
  const fallback = getIndicatorMeta(type);
  const displayTitle = title || fallback.title;
  const displayDesc = description || fallback.description;
  const iconKey = fallback.icon;
  const IconComponent = ICON_MAP[iconKey] || Info;

  const severityColors = {
    low: {
      color: 'var(--color-success)',
      bg: 'var(--color-success-bg)',
      border: 'var(--color-success-border)',
      label: 'Low signal'
    },
    medium: {
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-bg)',
      border: 'var(--color-warning-border)',
      label: 'Medium signal'
    },
    high: {
      color: 'var(--color-critical)',
      bg: 'var(--color-critical-bg)',
      border: 'var(--color-critical-border)',
      label: 'High signal'
    }
  };

  const sev = severityColors[severity?.toLowerCase()] || severityColors.medium;

  // Safe truncation of evidence
  const truncatedEvidence = evidence && typeof evidence === 'string'
    ? (evidence.length > 160 ? evidence.slice(0, 160) + '…' : evidence)
    : null;

  return (
    <Card className={`indicator-card ${className}`} padding="md">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        {/* 40px Icon Tile */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: sev.bg,
            border: `1px solid ${sev.border}`,
            color: sev.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <IconComponent size={20} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <h4 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}>
              {displayTitle}
            </h4>

            {/* Severity Chip */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-semibold)',
                color: sev.color,
                backgroundColor: sev.bg,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                border: `1px solid ${sev.border}`,
                whiteSpace: 'nowrap'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: sev.color
                }}
              />
              {sev.label}
            </span>
          </div>

          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: truncatedEvidence ? 'var(--space-3)' : '0' }}>
            {displayDesc}
          </p>

          {/* Quoted Evidence Block (rendered as plain text node) */}
          {truncatedEvidence && (
            <div
              style={{
                backgroundColor: 'var(--color-card-alt)',
                border: '1px solid var(--color-border)',
                borderLeft: `3px solid ${sev.color}`,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-2) var(--space-3)',
                marginTop: 'var(--space-2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <Quote size={12} style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', fontWeight: 'var(--fw-medium)' }}>
                  Found in your text
                </span>
              </div>
              <p
                className="font-mono"
                style={{
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--color-text)',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                  margin: 0
                }}
              >
                {truncatedEvidence}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
