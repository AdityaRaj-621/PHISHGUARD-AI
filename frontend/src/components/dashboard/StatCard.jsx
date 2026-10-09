import React from 'react';
import Card from '../ui/Card';
import './StatCard.css';

export default function StatCard({
  label,
  value,
  delta = null,
  icon = null,
  riskLevel = null, // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  className = ''
}) {
  const borderColors = {
    LOW: 'var(--color-success)',
    MEDIUM: 'var(--color-warning)',
    HIGH: 'var(--color-danger)',
    CRITICAL: 'var(--color-critical)'
  };

  const leftBorderColor = riskLevel ? borderColors[riskLevel.toUpperCase()] : 'var(--color-primary)';

  return (
    <Card
      padding="md"
      className={`stat-card ${className}`}
      style={{
        borderLeft: `4px solid ${leftBorderColor}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <span className="stat-card__label">{label}</span>
        {icon && <span className="stat-card__icon" style={{ color: leftBorderColor }}>{icon}</span>}
      </div>

      <div className="stat-card__value-row">
        <span className="stat-card__value">{value !== null && value !== undefined ? value : '—'}</span>
      </div>

      {delta && (
        <p className="stat-card__delta">
          {delta}
        </p>
      )}
    </Card>
  );
}
