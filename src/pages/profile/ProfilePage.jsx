import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatShortDate, formatRelativeTime } from '../../utils/format';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/common/Avatar';
import SecurityScore from '../../components/risk/SecurityScore';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  User,
  Shield,
  History,
  Calendar,
  LogOut,
  ShieldCheck,
  Award,
  Database
} from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, isAdmin, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const memberSince = user?.date_joined ? formatShortDate(user.date_joined) : 'February 2026';
  const lastScan = user?.stats?.last_scan_at ? formatRelativeTime(user.stats.last_scan_at) : 'Today';

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-title">User Profile</h1>
        <p className="profile-subtitle">
          Manage your account credentials, view security statistics, and data privacy settings.
        </p>
      </div>

      <div className="profile-grid">
        {/* 1. Identity Card */}
        <Card padding="lg" className="profile-identity-card">
          <div className="profile-avatar-row">
            <Avatar name={user?.name || user?.username || 'User'} size={64} />
            <div className="profile-identity-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 className="profile-user-name">{user?.name || 'Aisha Kumar'}</h2>
                {isAdmin && (
                  <span className="profile-admin-chip">
                    <ShieldCheck size={12} />
                    <span>Administrator</span>
                  </span>
                )}
              </div>
              <span className="profile-user-username">@{user?.username || 'aisha'}</span>
              <span className="profile-user-email">{user?.email || 'aisha@example.com'}</span>
            </div>
          </div>

          <div className="profile-identity-footer">
            <div className="profile-meta-item">
              <Calendar size={14} />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </Card>

        {/* 2. Activity Metrics */}
        <Card padding="lg" className="profile-activity-card">
          <h3 className="profile-card-title">Scanning Activity</h3>
          <div className="profile-stats-row">
            <div className="profile-stat-box">
              <span className="profile-stat-val">{user?.stats?.total_scans ?? 24}</span>
              <span className="profile-stat-lbl">Total scans completed</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val" style={{ color: 'var(--color-danger)' }}>{user?.stats?.high_risk_scans ?? 7}</span>
              <span className="profile-stat-lbl">High-risk threats flagged</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val">{lastScan}</span>
              <span className="profile-stat-lbl">Last scan performed</span>
            </div>
          </div>
        </Card>

        {/* 3. Security Awareness Score */}
        <div className="profile-score-section">
          <SecurityScore
            value={user?.stats?.awareness_score ?? 78}
            band="strong"
            factors={[
              '24 total security scans evaluated',
              'Critical threat mitigation steps reviewed',
              'Active engagement with educational topics'
            ]}
          />
        </div>

        {/* 4. Data & Privacy Notice */}
        <Card padding="lg" className="profile-data-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <Database size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 className="profile-card-title" style={{ marginBottom: 'var(--space-1)' }}>
                Data & Storage Policy
              </h3>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Your scans are stored securely on the PhishGuard server so you can review your history anytime.
                Content is used solely for defensive risk analysis and is never shared, published, or sold.
              </p>
            </div>
          </div>
        </Card>

        {/* 5. Session Actions */}
        <div className="profile-actions-row">
          <Button
            variant="danger"
            size="md"
            onClick={() => setLogoutModalOpen(true)}
            icon={<LogOut size={16} />}
          >
            Sign out of account
          </Button>
        </div>
      </div>

      {/* Logout Confirmation */}
      <ConfirmDialog
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign out of PhishGuard AI?"
        message="Your active session will end. You can sign back in anytime to access your scan history."
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
