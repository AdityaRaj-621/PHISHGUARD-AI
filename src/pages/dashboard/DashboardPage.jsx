import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Link2,
  Mail,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  BarChart3,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import dashboardService from '../../services/dashboardService';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import StatCard from '../../components/dashboard/StatCard';
import SecurityScore from '../../components/risk/SecurityScore';
import RiskDistributionChart from '../../components/dashboard/RiskDistributionChart';
import ThreatCategoryChart from '../../components/dashboard/ThreatCategoryChart';
import RecentScansList from '../../components/dashboard/RecentScansList';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import LoadingState from '../../components/feedback/LoadingState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatRelativeTime } from '../../utils/format';
import { INITIAL_MOCK_SCANS } from '../../services/mock/fixtures/scans';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboard, loading, error, refetch } = useApi(dashboardService.getDashboard);

  const firstName = user?.name ? user.name.split(' ')[0] : user?.username || 'Defender';

  if (loading) {
    return (
      <div className="dashboard-loading-grid">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <LoadingState lines={2} height="28px" />
        </div>
        <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
          <Card padding="md"><LoadingState lines={3} /></Card>
          <Card padding="md"><LoadingState lines={3} /></Card>
          <Card padding="md"><LoadingState lines={3} /></Card>
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
        title="Couldn't load dashboard"
        description={error.message || 'We ran into a problem loading your security metrics.'}
        onRetry={refetch}
      />
    );
  }

  const totals = dashboard?.totals || { total_scans: 0, high_risk: 0, medium_risk: 0, low_risk: 0, critical_risk: 0 };
  const hasZeroScans = totals.total_scans === 0;

  const handleSeeExample = () => {
    // Loads §37 demo result in read-only demo mode
    navigate('/scans/481', { state: { result: INITIAL_MOCK_SCANS[0], fresh: false } });
  };

  return (
    <div className="dashboard-page">
      {/* 1. Greeting Row */}
      <div className="dashboard-greeting-row">
        <div>
          <h1 className="dashboard-greeting-title">
            Welcome back, {firstName}
          </h1>
          <p className="dashboard-greeting-sub">
            Here's your personal threat scanning posture and activity.
          </p>
        </div>

        {dashboard?.recent_scans?.[0]?.created_at && (
          <div className="dashboard-last-scan">
            <span style={{ color: 'var(--color-text-muted)' }}>Last scanned: </span>
            <strong>{formatRelativeTime(dashboard.recent_scans[0].created_at)}</strong>
          </div>
        )}
      </div>

      {/* 2. Quick Actions */}
      <section className="dashboard-section">
        <div className="quick-actions-grid">
          <QuickActionCard
            to="/scan/message"
            title="Scan message"
            description="Inspect suspicious SMS, WhatsApp, Telegram, or social media texts."
            icon={<MessageSquare size={22} />}
          />
          <QuickActionCard
            to="/scan/url"
            title="Check URL"
            description="Inspect domain structures, typosquatting, and hidden links safely."
            icon={<Link2 size={22} />}
          />
          <QuickActionCard
            to="/scan/email"
            title="Scan email"
            description="Analyze invoices, sender discrepancies, and deceptive headers."
            icon={<Mail size={22} />}
          />
        </div>
      </section>

      {hasZeroScans ? (
        /* Empty State */
        <EmptyState
          title="No scans yet"
          description="Paste a suspicious message, link, or email, and PhishGuard will break down what's risky about it."
          action={{ label: 'Scan a message', to: '/scan/message', icon: <MessageSquare size={16} /> }}
          secondaryAction={{ label: 'See an example result', onClick: handleSeeExample, icon: <BarChart3 size={16} /> }}
        />
      ) : (
        <>
          {/* 3. Stat Cards */}
          <section className="dashboard-section">
            <div className="stats-grid">
              <StatCard
                label="Total scans"
                value={totals.total_scans}
                delta="+4 this week"
                icon={<BarChart3 size={18} />}
              />
              <StatCard
                label="High risk"
                value={totals.high_risk + (totals.critical_risk || 0)}
                riskLevel="HIGH"
                delta="Flagged items"
                icon={<AlertOctagon size={18} />}
              />
              <StatCard
                label="Medium risk"
                value={totals.medium_risk}
                riskLevel="MEDIUM"
                delta="Requires caution"
                icon={<AlertTriangle size={18} />}
              />
              <StatCard
                label="Low risk"
                value={totals.low_risk}
                riskLevel="LOW"
                delta="No clear threat"
                icon={<ShieldCheck size={18} />}
              />
            </div>
          </section>

          {/* 4. Security Awareness Score */}
          {dashboard?.awareness_score && (
            <section className="dashboard-section">
              <SecurityScore
                value={dashboard.awareness_score.value}
                band={dashboard.awareness_score.band}
                factors={dashboard.awareness_score.factors}
              />
            </section>
          )}

          {/* 5. Charts Row */}
          <section className="dashboard-section">
            <div className="charts-grid">
              <div className="chart-col-left">
                <RiskDistributionChart data={dashboard?.risk_distribution || []} />
              </div>
              <div className="chart-col-right">
                <ThreatCategoryChart data={dashboard?.threat_categories || []} />
              </div>
            </div>
          </section>

          {/* 6. Recent Scans */}
          <section className="dashboard-section">
            <RecentScansList scans={dashboard?.recent_scans || []} />
          </section>
        </>
      )}
    </div>
  );
}
