import React from 'react';
import { ScanSearch } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyState({
  icon = null,
  title = 'No items found',
  description = 'There is nothing to display right now.',
  action = null, // { label, onClick, to, icon }
  secondaryAction = null,
  variant = 'page', // 'page', 'card'
  className = ''
}) {
  return (
    <div
      className={`empty-state empty-state--${variant} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: variant === 'page' ? 'var(--space-8) var(--space-4)' : 'var(--space-6) var(--space-4)',
        background: variant === 'card' ? 'var(--color-card-alt)' : 'transparent',
        borderRadius: variant === 'card' ? 'var(--radius-lg)' : '0',
        border: variant === 'card' ? '1px dashed var(--color-border-strong)' : 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--color-primary-soft)',
          color: 'var(--color-primary)',
          marginBottom: 'var(--space-4)'
        }}
      >
        {icon || <ScanSearch size={28} />}
      </div>

      <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--color-text-secondary)',
          maxWidth: '48ch',
          marginBottom: action || secondaryAction ? 'var(--space-6)' : '0'
        }}
      >
        {description}
      </p>

      {(action || secondaryAction) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {action && (
            <Button
              variant="primary"
              size="md"
              to={action.to}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="md"
              to={secondaryAction.to}
              onClick={secondaryAction.onClick}
              icon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
