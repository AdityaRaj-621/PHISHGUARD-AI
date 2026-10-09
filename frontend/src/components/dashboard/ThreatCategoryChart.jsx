import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';

export default function ThreatCategoryChart({ data = [], className = '' }) {
  // Format categories (top 6 descending)
  const formattedData = [...data]
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((d) => ({
      name: d.threat_type ? d.threat_type.replace(/_/g, ' ') : 'Other',
      count: d.count
    }));

  const isEmpty = formattedData.length === 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-text-inverse)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--fs-xs)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{item.name}: </span>
          <span>{item.count} items</span>
        </div>
      );
    }
    return null;
  };

  const tableFallback = (
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
          <th style={{ padding: '4px 8px' }}>Threat Category</th>
          <th style={{ padding: '4px 8px' }}>Count</th>
        </tr>
      </thead>
      <tbody>
        {formattedData.map((row) => (
          <tr key={row.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '4px 8px', textTransform: 'capitalize' }}>{row.name}</td>
            <td style={{ padding: '4px 8px' }}>{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ChartCard
      title="Threat categories"
      description="Most frequent scam types scanned"
      isEmpty={isEmpty}
      emptyMessage="No threat categories logged yet."
      tableFallback={tableFallback}
      className={className}
    >
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={formattedData}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis
              type="number"
              stroke="#64748B"
              fontSize={12}
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              width={90}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#1D4ED8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
