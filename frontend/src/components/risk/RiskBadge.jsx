import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert, HelpCircle } from 'lucide-react';
import { getRiskMeta } from '../../utils/risk';
import Badge from '../ui/Badge';

export default function RiskBadge({
  level = 'UNKNOWN',
  score = null,
  size = 'md',
  showScore = true,
  uppercase = false,
  className = ''
}) {
  const meta = getRiskMeta(level || score);

  const getIcon = () => {
    const iconSize = size === 'sm' ? 12 : 14;
    switch (meta.icon) {
      case 'ShieldCheck': return <ShieldCheck size={iconSize} />;
      case 'AlertTriangle': return <AlertTriangle size={iconSize} />;
      case 'AlertOctagon': return <AlertOctagon size={iconSize} />;
      case 'ShieldAlert': return <ShieldAlert size={iconSize} />;
      default: return <HelpCircle size={iconSize} />;
    }
  };

  const variantMap = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
    CRITICAL: 'critical',
    UNKNOWN: 'neutral'
  };

  const labelText = uppercase ? meta.badgeLabel : meta.label;
  const scoreText = showScore && score !== null && score !== undefined ? ` · ${score}` : '';

  return (
    <Badge
      variant={variantMap[level?.toUpperCase()] || 'neutral'}
      size={size}
      icon={getIcon()}
      pattern={meta.pattern}
      className={`risk-badge ${className}`}
    >
      {labelText}{scoreText}
    </Badge>
  );
}
