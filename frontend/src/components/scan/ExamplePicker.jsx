import React from 'react';
import Card from '../ui/Card';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

export default function ExamplePicker({
  title = 'Try an example',
  examples = [],
  onSelectExample,
  className = ''
}) {
  return (
    <Card padding="md" className={`example-picker-card ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Lightbulb size={16} style={{ color: 'var(--color-warning)' }} />
          <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', margin: 0 }}>
            {title}
          </h4>
        </div>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
          Fictional examples
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {examples.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectExample(ex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-card-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease)'
            }}
            className="example-btn"
          >
            <div>
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', display: 'block' }}>
                {ex.title}
              </span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
                {ex.subtitle}
              </span>
            </div>
            <ArrowUpRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </Card>
  );
}
