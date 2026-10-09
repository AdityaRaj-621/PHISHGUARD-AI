import React from 'react';
import {
  ShieldAlert,
  Building2,
  Briefcase,
  TrendingUp,
  KeyRound,
  Package,
  Headphones,
  Users,
  Lock,
  Info
} from 'lucide-react';
import Badge from '../ui/Badge';

export const THREAT_CONFIG = {
  phishing: { label: 'Phishing', icon: ShieldAlert },
  banking_scam: { label: 'Banking scam', icon: Building2 },
  job_scam: { label: 'Job scam', icon: Briefcase },
  investment_scam: { label: 'Investment scam', icon: TrendingUp },
  otp_scam: { label: 'OTP scam', icon: KeyRound },
  delivery_scam: { label: 'Delivery scam', icon: Package },
  tech_support_scam: { label: 'Tech support scam', icon: Headphones },
  fake_support: { label: 'Fake support', icon: Headphones },
  social_media_scam: { label: 'Social media scam', icon: Users },
  account_takeover: { label: 'Account takeover', icon: Lock }
};

export default function ThreatBadge({
  threatType = 'unknown',
  size = 'md',
  className = ''
}) {
  const normalized = (threatType || '').toLowerCase().replace(/[\s-]/g, '_');
  const config = THREAT_CONFIG[normalized];

  const label = config?.label || threatType?.replace(/_/g, ' ') || 'Unknown';
  const IconComponent = config?.icon || Info;

  return (
    <Badge
      variant="neutral"
      size={size}
      icon={<IconComponent size={size === 'sm' ? 12 : 14} />}
      className={`threat-badge ${className}`}
    >
      {label}
    </Badge>
  );
}
