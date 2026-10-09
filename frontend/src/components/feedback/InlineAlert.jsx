import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function InlineAlert({
  type = 'info', // 'info', 'warning', 'danger', 'success'
  title,
  children,
  onDismiss = null,
  className = ''
}) {
  const icons = {
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
    danger: <AlertCircle size={18} />,
    success: <CheckCircle size={18} />
  };

  const bgMap = {
    info: 'var(--color-info-bg)',
    warning: 'var(--color-warning-bg)',
    danger: 'var(--color-critical-bg)',
    success: 'var(--color-success-bg)'
  };

  const borderMap = {
    info: 'var(--color-info-border)',
    warning: 'var(--color-warning-border)',
    danger: 'var(--color-critical-border)',
    success: 'var(--color-success-border)'
  };

  const colorMap = {
    info: 'var(--color-info)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-critical)',
    success: 'var(--color-success)'
  };

  return (
    <div
      className={`inline-alert inline-alert--${type} ${className}`}
      role={type === 'danger' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        backgroundColor: bgMap[type] || bgMap.info,
        border: `1px solid ${borderMap[type] || borderMap.info}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text)',
        marginBottom: 'var(--space-4)'
      }}
    >
      <div style={{ color: colorMap[type] || colorMap.info, flexShrink: 0, marginTop: '2px' }}>
        {icons[type] || icons.info}
      </div>

      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: '2px', color: 'var(--color-text)' }}>
            {title}
          </h4>
        )}
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {children}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            color: 'var(--color-text-muted)',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer'
          }}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
