import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Link2, Mail, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import RiskBadge from '../risk/RiskBadge';
import ThreatBadge from '../risk/ThreatBadge';
import { formatShortDate, formatRelativeTime, truncate } from '../../utils/format';
import Button from '../ui/Button';

export default function ScanTable({
  scans = [],
  sort = '-created_at',
  onSortChange = null,
  isTablet = false,
  className = ''
}) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'url': return <Link2 size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const handleSort = (field) => {
    if (!onSortChange) return;
    if (sort === field) {
      onSortChange(`-${field}`);
    } else if (sort === `-${field}`) {
      onSortChange(field);
    } else {
      onSortChange(field);
    }
  };

  const getSortIcon = (field) => {
    if (sort === field) return <ArrowUp size={14} />;
    if (sort === `-${field}`) return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
  };

  return (
    <div
      className={`scan-table-wrapper ${className}`}
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: 'var(--fs-sm)'
        }}
      >
        <caption className="sr-only">Scan History Table</caption>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--color-card-alt)',
              borderBottom: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--fw-semibold)'
            }}
          >
            <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)', width: '140px' }}>
              <button
                type="button"
                onClick={() => handleSort('created_at')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                <span>Date</span>
                {getSortIcon('created_at')}
              </button>
            </th>

            <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)', width: '110px' }}>
              Type
            </th>

            {!isTablet && (
              <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                Content
              </th>
            )}

            {!isTablet && (
              <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)', width: '140px' }}>
                Threat
              </th>
            )}

            <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)', width: '80px' }}>
              <button
                type="button"
                onClick={() => handleSort('risk_score')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 'inherit',
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                <span>Score</span>
                {getSortIcon('risk_score')}
              </button>
            </th>

            <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)', width: '130px' }}>
              Risk level
            </th>

            <th scope="col" style={{ padding: 'var(--space-3) var(--space-4)', width: '90px', textAlign: 'right' }}>
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {scans.map((scan, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <tr
                key={scan.id}
                style={{
                  backgroundColor: isEven ? 'var(--color-surface)' : 'var(--color-card-alt)',
                  borderBottom: '1px solid var(--color-border)',
                  transition: 'background-color var(--dur-fast) var(--ease)'
                }}
              >
                <td style={{ padding: 'var(--space-3) var(--space-4)', whiteSpace: 'nowrap' }} title={formatRelativeTime(scan.created_at)}>
                  {formatShortDate(scan.created_at)}
                </td>

                <td style={{ padding: 'var(--space-3) var(--space-4)', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--color-primary)' }}>{getTypeIcon(scan.scan_type)}</span>
                    <span style={{ textTransform: 'capitalize' }}>{scan.scan_type}</span>
                  </div>
                </td>

                {!isTablet && (
                  <td
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      maxWidth: '320px',
                      color: 'var(--color-text)'
                    }}
                    className={scan.scan_type === 'url' ? 'font-mono' : ''}
                  >
                    {truncate(scan.input_preview || scan.input_text, 55)}
                  </td>
                )}

                {!isTablet && (
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <ThreatBadge threatType={scan.threat_type} size="sm" />
                  </td>
                )}

                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums' }}>
                  {scan.risk_score !== null ? scan.risk_score : '—'}
                </td>

                <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                  <RiskBadge level={scan.risk_level} score={null} size="sm" />
                </td>

                <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    as={Link}
                    to={`/scans/${scan.id}`}
                  >
                    View
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
