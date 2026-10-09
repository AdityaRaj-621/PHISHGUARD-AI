import React, { useState, useId } from 'react';

export default function Tooltip({ content, children, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  if (!content) return children;

  return (
    <span
      className={`tooltip-container ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      {React.cloneElement(children, {
        'aria-describedby': isVisible ? tooltipId : undefined
      })}
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-text-inverse)',
            fontSize: 'var(--fs-xs)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap',
            zIndex: 'var(--z-toast)',
            pointerEvents: 'none',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
