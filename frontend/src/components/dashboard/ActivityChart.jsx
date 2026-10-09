import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import Button from '../ui/Button';

export default function ActivityChart({ data = [], className = '' }) {
  const [days, setDays] = useState(14);

  const filteredData = data.slice(-days);
  const isEmpty = filteredData.length === 0;

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
          <span style={{ fontWeight: 'bold' }}>{item.date}: </span>
          <span>{item.count} scans</span>
        </div>
      );
    }
    return null;
  };

  const actionToggle = (
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button
        variant={days === 14 ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => setDays(14)}
        style={{ padding: '2px 8px', height: '26px', fontSize: 'var(--fs-xs)' }}
      >
        14 days
      </Button>
      <Button
        variant={days === 30 ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => setDays(30)}
        style={{ padding: '2px 8px', height: '26px', fontSize: 'var(--fs-xs)' }}
      >
        30 days
      </Button>
    </div>
  );

  return (
    <ChartCard
      title="Scan activity"
      description={`Daily scan frequency over the past ${days} days`}
      action={actionToggle}
      isEmpty={isEmpty}
      emptyMessage="No activity logged for this time range."
      className={className}
    >
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1D4ED8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#activityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
