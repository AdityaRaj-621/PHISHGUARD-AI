import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({
  to,
  title,
  description,
  icon,
  className = ''
}) {
  return (
    <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
      <Card
        padding="md"
        className={`quick-action-card ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          transition: 'border-color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease)'
        }}
      >
        <div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)'
            }}
          >
            {icon}
          </div>

          <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>
            {title}
          </h3>

          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
            {description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-4)', color: 'var(--color-primary)', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
          <span>Start scan</span>
          <ArrowRight size={16} />
        </div>
      </Card>
    </Link>
  );
}
