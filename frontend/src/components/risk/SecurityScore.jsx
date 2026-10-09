import React, { useState } from 'react';
import { HelpCircle, Award, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function SecurityScore({
  value = 78,
  band = 'strong', // 'needs_attention', 'developing', 'strong'
  factors = [
    'Scans completed regularly',
    'High-risk items reviewed with recommendations',
    'Security education topics explored'
  ],
  className = ''
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (value === null || value === undefined) return null;

  const getBandInfo = (score) => {
    if (score < 40) return { label: 'Needs attention (0–39)', color: 'var(--color-warning)' };
    if (score < 70) return { label: 'Developing (40–69)', color: 'var(--color-primary)' };
    return { label: 'Strong (70–100)', color: 'var(--color-success)' };
  };

  const bandInfo = getBandInfo(value);

  return (
    <>
      <Card className={`security-score-card ${className}`} padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Award size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)' }}>
              Security Awareness Score
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '2px'
            }}
            aria-label="Explain security awareness score"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', color: bandInfo.color, fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </span>
          <span style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-secondary)' }}>
            / 100 · {bandInfo.label}
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div style={{ display: 'flex', gap: '4px', height: '8px', width: '100%', marginBottom: 'var(--space-3)' }}>
          <div
            style={{
              flex: 1,
              backgroundColor: value > 0 ? (value >= 40 ? 'var(--color-success)' : 'var(--color-warning)') : 'var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              opacity: value >= 30 ? 1 : 0.4
            }}
          />
          <div
            style={{
              flex: 1,
              backgroundColor: value >= 40 ? (value >= 70 ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              opacity: value >= 60 ? 1 : value >= 40 ? 0.6 : 0.2
            }}
          />
          <div
            style={{
              flex: 1,
              backgroundColor: value >= 70 ? 'var(--color-success)' : 'var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              opacity: value >= 70 ? 1 : 0.2
            }}
          />
        </div>

        {/* Mandatory Disclaimer */}
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
          This is an in-app engagement metric based on your scanning activity and education progress. It isn't a validated measure of your real-world security.
        </p>
      </Card>

      {/* Factors Explanation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Security Awareness Score"
        size="md"
        footer={
          <Button variant="primary" size="md" onClick={() => setModalOpen(false)}>
            Understood
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Your Security Awareness Score measures how actively you verify suspicious messages and learn scam protection tactics.
          </p>

          <div>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-2)' }}>
              Factors influencing your score:
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {factors.map((factor, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-card-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              <strong>Notice:</strong> This score encourages proactive security habits and does not represent a technical security audit.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
