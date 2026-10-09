import React from 'react';
import { useApi } from '../../hooks/useApi';
import adminService from '../../services/adminService';
import Card from '../../components/ui/Card';
import StatCard from '../../components/dashboard/StatCard';
import RiskDistributionChart from '../../components/dashboard/RiskDistributionChart';
import ThreatCategoryChart from '../../components/dashboard/ThreatCategoryChart';
import ActivityChart from '../../components/dashboard/ActivityChart';
import LoadingState from '../../components/feedback/LoadingState';
import ErrorState from '../../components/feedback/ErrorState';
import {
  ShieldAlert,
  Users,
  Activity,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const { data: stats, loading, error, refetch } = useApi(adminService.getPlatformStats);

  if (loading) {
    return (
      <div className="admin-loading-state">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <LoadingState lines={2} height="28px" />
        </div>
        <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
          <Card padding="md"><LoadingState lines={2} /></Card>
          <Card padding="md"><LoadingState lines={2} /></Card>
          <Card padding="md"><LoadingState lines={2} /></Card>
          <Card padding="md"><LoadingState lines={2} /></Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load platform statistics"
        description={error.message || 'An error occurred while fetching aggregate admin metrics.'}
        onRetry={refetch}
      />
    );
  }

  const threatDist = stats?.threat_distribution || [];
  const totalThreatItems = threatDist.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Platform Overview</h1>
          <p className="admin-subtitle">
            System-wide telemetry, aggregate threat vectors, and detection throughput.
          </p>
        </div>
      </div>

      {/* Aggregate Privacy Notice Banner */}
      <div className="admin-privacy-banner">
        <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)' }}>
          <strong>Privacy note:</strong> Aggregated platform statistics. Individual scan contents and personal messages are strictly private and not displayed.
        </p>
      </div>

      {/* 1. Stat Row */}
      <div className="admin-stats-grid">
        <StatCard
          label="Total registered users"
          value={stats?.total_users || 128}
          icon={<Users size={18} />}
        />
        <StatCard
          label="Total scans executed"
          value={stats?.total_scans || 1043}
          icon={<Activity size={18} />}
        />
        <StatCard
          label="High-risk scans flagged"
          value={stats?.high_risk_scans || 312}
          riskLevel="HIGH"
          icon={<ShieldAlert size={18} />}
        />
        <StatCard
          label="Scans today"
          value={stats?.scans_today || 47}
          icon={<TrendingUp size={18} />}
        />
      </div>

      {/* 2. Highlight Cards */}
      <div className="admin-highlights-grid">
        <Card padding="md" className="admin-highlight-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="admin-highlight-icon admin-highlight-icon--danger">
              <ShieldAlert size={20} />
            </div>
            <div>
              <span className="admin-highlight-label">Most common threat type</span>
              <h3 className="admin-highlight-val" style={{ textTransform: 'capitalize' }}>
                {stats?.most_common_threat?.replace(/_/g, ' ') || 'Phishing'}
              </h3>
            </div>
          </div>
        </Card>

        <Card padding="md" className="admin-highlight-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="admin-highlight-icon admin-highlight-icon--primary">
              <MessageSquare size={20} />
            </div>
            <div>
              <span className="admin-highlight-label">Most scanned vector</span>
              <h3 className="admin-highlight-val" style={{ textTransform: 'capitalize' }}>
                {stats?.most_scanned_type || 'Message (SMS / Chat)'}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Charts Grid */}
      <div className="admin-charts-grid">
        {/* Daily Scan Volume Line/Area Chart */}
        <ActivityChart data={stats?.daily_scans || []} />

        {/* Platform Risk Distribution */}
        <RiskDistributionChart data={stats?.risk_distribution || []} />
      </div>

      {/* 4. Threat Categories Ranking */}
      <div className="admin-threats-grid">
        <ThreatCategoryChart data={stats?.threat_distribution || []} />

        {/* Ranked Share Table */}
        <Card padding="md">
          <h3 style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--fw-semibold)', marginBottom: 'var(--space-3)' }}>
            Threat Share Breakdown
          </h3>
          <div className="admin-share-list">
            {threatDist.map((item, idx) => {
              const pct = totalThreatItems > 0 ? Math.round((item.count / totalThreatItems) * 100) : 0;
              return (
                <div key={item.threat_type} className="admin-share-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="admin-rank-num">#{idx + 1}</span>
                    <span style={{ textTransform: 'capitalize', fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)' }}>
                      {item.threat_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                      {item.count} items
                    </span>
                    <span className="admin-share-pill">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
