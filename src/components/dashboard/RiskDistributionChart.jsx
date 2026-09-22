import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import ChartCard from './ChartCard';

const RISK_COLORS = {
  LOW: '#047857',
  MEDIUM: '#B45309',
  HIGH: '#C2410C',
  CRITICAL: '#9F1239'
};

export default function RiskDistributionChart({ data = [], className = '' }) {
  const chartData = [
    { level: 'LOW', name: 'Low', count: data.find((d) => d.level === 'LOW')?.count || 0 },
    { level: 'MEDIUM', name: 'Medium', count: data.find((d) => d.level === 'MEDIUM')?.count || 0 },
    { level: 'HIGH', name: 'High', count: data.find((d) => d.level === 'HIGH')?.count || 0 },
    { level: 'CRITICAL', name: 'Critical', count: data.find((d) => d.level === 'CRITICAL')?.count || 0 }
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const isEmpty = total === 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
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
          <span style={{ fontWeight: 'bold' }}>{item.name} Risk: </span>
          <span>{item.count} scans ({pct}%)</span>
        </div>
      );
    }
    return null;
  };

  const tableFallback = (
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
          <th style={{ padding: '4px 8px' }}>Risk Level</th>
          <th style={{ padding: '4px 8px' }}>Count</th>
          <th style={{ padding: '4px 8px' }}>Share</th>
        </tr>
      </thead>
      <tbody>
        {chartData.map((row) => (
          <tr key={row.level} style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '4px 8px' }}>{row.name}</td>
            <td style={{ padding: '4px 8px' }}>{row.count}</td>
            <td style={{ padding: '4px 8px' }}>{total > 0 ? Math.round((row.count / total) * 100) : 0}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <ChartCard
      title="Risk distribution"
      description="Scans grouped by detected risk severity"
      isEmpty={isEmpty}
      emptyMessage="Complete scans to view your risk severity distribution."
      tableFallback={tableFallback}
      className={className}
    >
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.level}`} fill={RISK_COLORS[entry.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
