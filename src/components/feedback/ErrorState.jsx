import React from 'react';
import { AlertOctagon, RotateCw, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry = null,
  retryLabel = 'Try again',
  onBack = null,
  backLabel = 'Go back',
  variant = 'page', // 'page', 'card', 'inline'
  details = null,
  className = ''
}) {
  const isInline = variant === 'inline';

  if (isInline) {
    return (
      <div
        className={`error-state-inline ${className}`}
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--color-critical-bg)',
          border: '1px solid var(--color-critical-border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-critical)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <AlertOctagon size={16} />
          <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>{description || title}</span>
        </div>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} style={{ color: 'var(--color-critical)' }}>
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`error-state error-state--${variant} ${className}`}
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: variant === 'page' ? 'var(--space-8) var(--space-4)' : 'var(--space-6) var(--space-4)',
        background: variant === 'card' ? 'var(--color-card-alt)' : 'transparent',
        borderRadius: variant === 'card' ? 'var(--radius-lg)' : '0'
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
          backgroundColor: 'var(--color-critical-bg)',
          color: 'var(--color-critical)',
          marginBottom: 'var(--space-4)'
        }}
      >
        <AlertOctagon size={28} />
      </div>

      <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: 'var(--fs-body)',
          color: 'var(--color-text-secondary)',
          maxWidth: '48ch',
          marginBottom: onRetry || onBack ? 'var(--space-6)' : '0'
        }}
      >
        {description}
      </p>

      {/* Details rendered only in dev mode */}
      {import.meta.env?.DEV && details && (
        <pre
          style={{
            maxWidth: '600px',
            textAlign: 'left',
            padding: 'var(--space-3)',
            backgroundColor: 'var(--color-card-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--fs-xs)',
            overflowX: 'auto',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-text-muted)'
          }}
        >
          {typeof details === 'object' ? JSON.stringify(details, null, 2) : details}
        </pre>
      )}

      {(onRetry || onBack) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {onRetry && (
            <Button
              variant="primary"
              size="md"
              onClick={onRetry}
              icon={<RotateCw size={16} />}
            >
              {retryLabel}
            </Button>
          )}
          {onBack && (
            <Button
              variant="secondary"
              size="md"
              onClick={onBack}
              icon={<ArrowLeft size={16} />}
            >
              {backLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
