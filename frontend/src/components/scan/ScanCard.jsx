import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Link2, Mail, ArrowRight } from 'lucide-react';
import RiskBadge from '../risk/RiskBadge';
import ThreatBadge from '../risk/ThreatBadge';
import { formatRelativeTime, truncate } from '../../utils/format';
import Card from '../ui/Card';

export default function ScanCard({ scan, className = '' }) {
  if (!scan) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'url': return <Link2 size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const typeLabel = scan.scan_type === 'url' ? 'Link' : scan.scan_type === 'email' ? 'Email' : 'Message';

  return (
    <Link to={`/scans/${scan.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <Card
        variant="default"
        padding="md"
        className={`scan-card ${className}`}
        style={{
          transition: 'border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)',
          minHeight: '44px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--fs-xs)' }}>
            <span style={{ color: 'var(--color-primary)', display: 'inline-flex' }}>{getTypeIcon(scan.scan_type)}</span>
            <span style={{ fontWeight: 'var(--fw-medium)' }}>{typeLabel}</span>
            <span>·</span>
            <span>{formatRelativeTime(scan.created_at)}</span>
          </div>

          <span style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)' }}>
            <span>View report</span>
            <ArrowRight size={14} />
          </span>
        </div>

        <p
          className={scan.scan_type === 'url' ? 'font-mono' : ''}
          style={{
            fontSize: 'var(--fs-sm)',
            fontWeight: 'var(--fw-medium)',
            color: 'var(--color-text)',
            marginBottom: 'var(--space-3)',
            lineHeight: 1.4
          }}
        >
          {truncate(scan.input_preview || scan.input_text, 80)}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <ThreatBadge threatType={scan.threat_type} size="sm" />
          <RiskBadge level={scan.risk_level} score={scan.risk_score} size="sm" />
        </div>
      </Card>
    </Link>
  );
}
