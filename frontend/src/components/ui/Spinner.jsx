import React from 'react';

export default function Spinner({ size = 16, color = 'currentColor', className = '' }) {
  return (
    <svg
      className={`ui-spinner ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
