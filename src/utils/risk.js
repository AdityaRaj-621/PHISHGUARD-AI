// src/utils/risk.js
export const RISK_LEVELS = {
  LOW: {
    label: 'Low risk',
    badgeLabel: 'LOW RISK',
    min: 0,
    max: 30,
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
    border: 'var(--color-success-border)',
    icon: 'ShieldCheck',
    pattern: 'solid'
  },
  MEDIUM: {
    label: 'Medium risk',
    badgeLabel: 'MEDIUM RISK',
    min: 31,
    max: 60,
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
    border: 'var(--color-warning-border)',
    icon: 'AlertTriangle',
    pattern: 'dashed'
  },
  HIGH: {
    label: 'High risk',
    badgeLabel: 'HIGH RISK',
    min: 61,
    max: 80,
    color: 'var(--color-danger)',
    bg: 'var(--color-danger-bg)',
    border: 'var(--color-danger-border)',
    icon: 'AlertOctagon',
    pattern: 'double'
  },
  CRITICAL: {
    label: 'Critical risk',
    badgeLabel: 'CRITICAL RISK',
    min: 81,
    max: 100,
    color: 'var(--color-critical)',
    bg: 'var(--color-critical-bg)',
    border: 'var(--color-critical-border)',
    icon: 'ShieldAlert',
    pattern: 'double'
  },
  UNKNOWN: {
    label: 'Not determined',
    badgeLabel: 'NOT DETERMINED',
    min: null,
    max: null,
    color: 'var(--color-neutral)',
    bg: 'var(--color-neutral-bg)',
    border: 'var(--color-neutral-border)',
    icon: 'HelpCircle',
    pattern: 'dotted'
  }
};

export function getRiskLevel(score) {
  if (score === null || score === undefined || Number.isNaN(Number(score))) {
    return 'UNKNOWN';
  }
  const s = Math.max(0, Math.min(100, Number(score)));
  if (s <= 30) return 'LOW';
  if (s <= 60) return 'MEDIUM';
  if (s <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskMeta(levelOrScore) {
  const key = typeof levelOrScore === 'number'
    ? getRiskLevel(levelOrScore)
    : (levelOrScore || 'UNKNOWN').toUpperCase();
  return RISK_LEVELS[key] ?? RISK_LEVELS.UNKNOWN;
}
