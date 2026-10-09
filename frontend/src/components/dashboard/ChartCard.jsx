import React from 'react';
import Card from '../ui/Card';
import EmptyState from '../feedback/EmptyState';

export default function ChartCard({
  title,
  description = null,
  children,
  isEmpty = false,
  emptyMessage = 'No chart data available yet',
  tableFallback = null,
  action = null,
  className = ''
}) {
  return (
    <Card padding="md" className={`chart-card ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', margin: 0 }}>
            {title}
          </h3>
          {description && (
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-secondary)', marginTop: '2px', margin: 0 }}>
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {isEmpty ? (
        <EmptyState
          variant="card"
          title="No data"
          description={emptyMessage}
        />
      ) : (
        <div>
          <div style={{ width: '100%', minHeight: '220px' }}>
            {children}
          </div>

          {tableFallback && (
            <details style={{ marginTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2)' }}>
              <summary style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                View as table
              </summary>
              <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--fs-xs)', overflowX: 'auto' }}>
                {tableFallback}
              </div>
            </details>
          )}
        </div>
      )}
    </Card>
  );
}
