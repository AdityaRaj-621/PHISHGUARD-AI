import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, History } from 'lucide-react';
import Card from '../ui/Card';
import ScanCard from '../scan/ScanCard';
import Button from '../ui/Button';

export default function RecentScansList({ scans = [], className = '' }) {
  const recent = scans.slice(0, 5);

  return (
    <Card padding="md" className={`recent-scans-card ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <History size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)', margin: 0 }}>
            Recent scans
          </h3>
        </div>

        <Link
          to="/scans"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--fs-sm)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-primary)',
            textDecoration: 'none'
          }}
        >
          <span>View all</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>
          No recent scans. Run your first scan above!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {recent.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      )}
    </Card>
  );
}
