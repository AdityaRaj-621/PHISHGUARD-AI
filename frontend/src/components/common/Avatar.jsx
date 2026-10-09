import React from 'react';

export default function Avatar({ name = '', size = 36, className = '' }) {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div
      className={`ui-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--color-primary-soft)',
        color: 'var(--color-primary)',
        border: '1px solid #BFDBFE',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--fw-bold)',
        fontSize: size <= 32 ? 'var(--fs-xs)' : 'var(--fs-sm)',
        userSelect: 'none',
        flexShrink: 0
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
