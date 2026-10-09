import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-text-inverse)',
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-6)',
        borderTop: '1px solid var(--color-secondary-soft)'
      }}
    >
      <div className="container">
        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)'
          }}
        >
          {/* Column 1: Brand & About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-bold)' }}>
                PhishGuard AI
              </span>
            </div>
            <p style={{ fontSize: 'var(--fs-sm)', color: '#94A3B8', lineHeight: 1.5 }}>
              Defensive security intelligence for everyday users. Scan suspicious messages, links, and emails before you act.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: '#F8FAFC', marginBottom: 'var(--space-3)' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)', color: '#94A3B8' }}>
              <li><Link to="/scan/message" style={{ color: 'inherit' }}>Message Scanner</Link></li>
              <li><Link to="/scan/url" style={{ color: 'inherit' }}>URL Inspector</Link></li>
              <li><Link to="/scan/email" style={{ color: 'inherit' }}>Email Analyzer</Link></li>
              <li><Link to="/dashboard" style={{ color: 'inherit' }}>Security Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Security Education */}
          <div>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: '#F8FAFC', marginBottom: 'var(--space-3)' }}>
              Learn
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)', color: '#94A3B8' }}>
              <li><Link to="/education" style={{ color: 'inherit' }}>All Topics</Link></li>
              <li><Link to="/education/phishing" style={{ color: 'inherit' }}>Phishing Basics</Link></li>
              <li><Link to="/education/otp-safety" style={{ color: 'inherit' }}>OTP Safety</Link></li>
              <li><Link to="/education/fake-urls" style={{ color: 'inherit' }}>Spotting Fake Links</Link></li>
            </ul>
          </div>

          {/* Column 4: About & Disclaimer */}
          <div>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: '#F8FAFC', marginBottom: 'var(--space-3)' }}>
              About & Trust
            </h4>
            <p style={{ fontSize: 'var(--fs-xs)', color: '#94A3B8', lineHeight: 1.5, marginBottom: 'var(--space-2)' }}>
              PhishGuard AI is an educational defensive-security project. It provides guidance, not a guarantee — always verify directly with the organization.
            </p>
            <span style={{ fontSize: 'var(--fs-xs)', color: '#64748B' }}>
              Built for AI Hackathon 2026
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--color-secondary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            fontSize: 'var(--fs-xs)',
            color: '#64748B'
          }}
        >
          <span>© {new Date().getFullYear()} PhishGuard AI. All rights reserved.</span>
          <span>Zero backend tracking · Educational and Defensive Security</span>
        </div>
      </div>
    </footer>
  );
}
