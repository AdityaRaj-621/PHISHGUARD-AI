import React from 'react';
import './Skeleton.css';

export default function Skeleton({
  variant = 'text', // 'text', 'circular', 'rectangular', 'card'
  width = '100%',
  height,
  lines = 1,
  className = '',
  style = {}
}) {
  if (lines > 1) {
    return (
      <div className={`skeleton-stack ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton skeleton--${variant}`}
            style={{
              width: i === lines - 1 && variant === 'text' ? '70%' : width,
              height: height || (variant === 'text' ? '1em' : '100%'),
              ...style
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={{
        width,
        height: height || (variant === 'text' ? '1em' : '100%'),
        ...style
      }}
      aria-hidden="true"
    />
  );
}
