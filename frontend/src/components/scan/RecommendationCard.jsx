import React from 'react';
import {
  Link2Off,
  KeyRound,
  PhoneCall,
  Flag,
  Trash2,
  IndianRupee,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function RecommendationCard({
  number = 1,
  title,
  description,
  priority = 'normal', // 'critical', 'high', 'normal', 'info'
  icon = null,
  className = ''
}) {
  const getIcon = () => {
    if (icon) return icon;
    const lower = `${title} ${description}`.toLowerCase();
    if (lower.includes('click') || lower.includes('link') || lower.includes('url')) {
      return <Link2Off size={18} />;
    }
    if (lower.includes('otp') || lower.includes('password') || lower.includes('pin') || lower.includes('credential')) {
      return <KeyRound size={18} />;
    }
    if (lower.includes('verify') || lower.includes('call') || lower.includes('bank') || lower.includes('contact')) {
      return <PhoneCall size={18} />;
    }
    if (lower.includes('report') || lower.includes('cybercrime') || lower.includes('flag')) {
      return <Flag size={18} />;
    }
    if (lower.includes('delete') || lower.includes('block') || lower.includes('trash')) {
      return <Trash2 size={18} />;
    }
    if (lower.includes('pay') || lower.includes('transfer') || lower.includes('deposit') || lower.includes('fee')) {
      return <IndianRupee size={18} />;
    }
    return <ShieldCheck size={18} />;
  };

  const priorityStyles = {
    critical: {
      bg: 'var(--color-critical-bg)',
      border: 'var(--color-critical-border)',
      leftBorder: 'var(--color-critical)',
      chipBg: 'var(--color-critical)',
      chipColor: '#ffffff'
    },
    high: {
      bg: 'var(--color-danger-bg)',
      border: 'var(--color-danger-border)',
      leftBorder: 'var(--color-danger)',
      chipBg: 'var(--color-danger)',
      chipColor: '#ffffff'
    },
    normal: {
      bg: 'var(--color-surface)',
      border: 'var(--color-border)',
      leftBorder: 'transparent',
      chipBg: 'var(--color-primary-soft)',
      chipColor: 'var(--color-primary)'
    },
    info: {
      bg: 'var(--color-info-bg)',
      border: 'var(--color-info-border)',
      leftBorder: 'var(--color-primary)',
      chipBg: 'var(--color-primary)',
      chipColor: '#ffffff'
    }
  };

  const styleConfig = priorityStyles[priority?.toLowerCase()] || priorityStyles.normal;

  return (
    <div
      className={`recommendation-item ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        backgroundColor: styleConfig.bg,
        border: `1px solid ${styleConfig.border}`,
        borderLeft: styleConfig.leftBorder !== 'transparent' ? `4px solid ${styleConfig.leftBorder}` : `1px solid ${styleConfig.border}`,
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-3)'
      }}
    >
      {/* Number Badge */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: styleConfig.chipBg,
          color: styleConfig.chipColor,
          fontSize: 'var(--fs-xs)',
          fontWeight: 'var(--fw-bold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {number}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
          <span style={{ color: styleConfig.leftBorder !== 'transparent' ? styleConfig.leftBorder : 'var(--color-primary)', display: 'inline-flex' }}>
            {getIcon()}
          </span>
          <h4 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text)' }}>
            {title}
          </h4>
        </div>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
