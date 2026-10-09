// src/services/mock/fixtures/adminStats.js

export const MOCK_ADMIN_STATS = {
  total_users: 128,
  total_scans: 1043,
  high_risk_scans: 312,
  scans_today: 47,
  most_common_threat: 'phishing',
  most_scanned_type: 'message',
  threat_distribution: [
    { threat_type: 'phishing', count: 401 },
    { threat_type: 'job_scam', count: 215 },
    { threat_type: 'otp_scam', count: 180 },
    { threat_type: 'delivery_scam', count: 142 },
    { threat_type: 'investment_scam', count: 105 }
  ],
  risk_distribution: [
    { level: 'LOW', count: 380 },
    { level: 'MEDIUM', count: 351 },
    { level: 'HIGH', count: 210 },
    { level: 'CRITICAL', count: 102 }
  ],
  daily_scans: [
    { date: 'Mar 14', count: 38 },
    { date: 'Mar 15', count: 42 },
    { date: 'Mar 16', count: 35 },
    { date: 'Mar 17', count: 50 },
    { date: 'Mar 18', count: 45 },
    { date: 'Mar 19', count: 51 },
    { date: 'Mar 20', count: 47 }
  ]
};
