// src/services/mock/fixtures/profile.js

export const MOCK_PROFILE = {
  id: 12,
  username: 'aisha',
  name: 'Aisha Kumar',
  email: 'aisha@example.com',
  date_joined: '2026-02-14T09:00:00Z',
  is_staff: true, // Demo account includes staff privileges to test Admin route
  stats: {
    total_scans: 24,
    high_risk_scans: 7,
    last_scan_at: '2026-03-20T11:02:00Z',
    awareness_score: 78
  }
};
