import React from 'react';
import Skeleton from '../ui/Skeleton';
import Spinner from '../ui/Spinner';

export default function LoadingState({
  variant = 'skeleton', // 'skeleton', 'spinner'
  lines = 3,
  height = null,
  message = 'Loading...',
  className = ''
}) {
  if (variant === 'spinner') {
    return (
      <div
        className={`loading-state-spinner ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-8) var(--space-4)',
          gap: 'var(--space-3)'
        }}
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner size={32} color="var(--color-primary)" />
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)' }}>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={`loading-state-skeleton ${className}`}
      style={{ width: '100%', height: height || 'auto' }}
      aria-live="polite"
      aria-busy="true"
    >
      <Skeleton lines={lines} height={height} />
    </div>
  );
}
