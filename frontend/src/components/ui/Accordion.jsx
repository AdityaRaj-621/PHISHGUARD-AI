import React, { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  badge = null,
  icon = null,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const contentId = `${id}-content`;
  const headerId = `${id}-header`;

  return (
    <div
      className={`accordion-item ${isOpen ? 'accordion-item--open' : ''} ${className}`}
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-3)',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden'
      }}
    >
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 'var(--space-4) var(--space-5)',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontWeight: 'var(--fw-semibold)',
          fontSize: 'var(--fs-body)',
          color: 'var(--color-text)',
          gap: 'var(--space-3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {icon && <span style={{ color: 'var(--color-primary)' }}>{icon}</span>}
          <span>{title}</span>
          {badge}
        </div>
        <ChevronDown
          size={18}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--dur-fast) var(--ease)',
            color: 'var(--color-text-secondary)',
            flexShrink: 0
          }}
        />
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          style={{
            padding: '0 var(--space-5) var(--space-5)',
            fontSize: 'var(--fs-body)',
            color: 'var(--color-text-secondary)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--space-4)'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
