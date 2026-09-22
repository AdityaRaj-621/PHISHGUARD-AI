// src/services/mock/fixtures/dashboard.js
import { INITIAL_MOCK_SCANS } from './scans';

export function getMockDashboardData(scans = INITIAL_MOCK_SCANS) {
  const completedScans = scans.filter((s) => s.status === 'completed');
  const total_scans = completedScans.length;
  const high_risk = completedScans.filter((s) => s.risk_level === 'HIGH').length;
  const medium_risk = completedScans.filter((s) => s.risk_level === 'MEDIUM').length;
  const low_risk = completedScans.filter((s) => s.risk_level === 'LOW').length;
  const critical_risk = completedScans.filter((s) => s.risk_level === 'CRITICAL').length;

  const threatCountMap = {};
  completedScans.forEach((s) => {
    if (s.threat_type && s.threat_type !== 'safe' && s.threat_type !== 'unknown') {
      threatCountMap[s.threat_type] = (threatCountMap[s.threat_type] || 0) + 1;
    }
  });

  const threat_categories = Object.entries(threatCountMap).map(([threat_type, count]) => ({
    threat_type,
    count
  }));

  const risk_distribution = [
    { level: 'LOW', count: low_risk },
    { level: 'MEDIUM', count: medium_risk },
    { level: 'HIGH', count: high_risk },
    { level: 'CRITICAL', count: critical_risk }
  ];

  // Daily scans for past 14 days
  const scan_activity = [
    { date: 'Mar 7', count: 1 },
    { date: 'Mar 8', count: 0 },
    { date: 'Mar 9', count: 2 },
    { date: 'Mar 10', count: 1 },
    { date: 'Mar 11', count: 3 },
    { date: 'Mar 12', count: 2 },
    { date: 'Mar 13', count: 1 },
    { date: 'Mar 14', count: 2 },
    { date: 'Mar 15', count: 1 },
    { date: 'Mar 16', count: 1 },
    { date: 'Mar 17', count: 2 },
    { date: 'Mar 18', count: 2 },
    { date: 'Mar 19', count: 2 },
    { date: 'Mar 20', count: 2 }
  ];

  const recent_alerts = completedScans
    .filter((s) => s.risk_level === 'HIGH' || s.risk_level === 'CRITICAL')
    .slice(0, 3)
    .map((s) => ({
      id: s.id,
      risk_level: s.risk_level,
      threat_type: s.threat_type,
      created_at: s.created_at
    }));

  return {
    totals: {
      total_scans,
      high_risk,
      medium_risk,
      low_risk,
      critical_risk
    },
    awareness_score: {
      value: 78,
      band: 'strong',
      factors: [
        '12 security scans completed',
        'High-risk indicators and recommendations reviewed',
        'Security education modules explored'
      ]
    },
    risk_distribution,
    threat_categories,
    scan_activity,
    recent_scans: scans.slice(0, 5),
    recent_alerts
  };
}
