// src/services/mock/mockApi.js
import { INITIAL_MOCK_SCANS } from './fixtures/scans';
import { getMockDashboardData } from './fixtures/dashboard';
import { MOCK_PROFILE } from './fixtures/profile';
import { MOCK_ADMIN_STATS } from './fixtures/adminStats';
import { runMockScan } from './mockScanEngine';

let scansDatabase = [...INITIAL_MOCK_SCANS];
let currentUser = { ...MOCK_PROFILE };

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthService = {
  async login({ username, identifier, password }) {
    await delay(600);
    const userIdentifier = (username || identifier || '').trim();
    if (!userIdentifier || !password) {
      const err = new Error('Invalid credentials');
      err.response = { status: 400, data: { detail: 'Please provide both username and password.' } };
      throw err;
    }

    if (userIdentifier === 'wrong@example.com') {
      const err = new Error('Authentication failed');
      err.response = { status: 401, data: { detail: 'No active account found with the given credentials.' } };
      throw err;
    }

    return {
      user: {
        id: currentUser.id,
        username: userIdentifier.split('@')[0] || currentUser.username,
        name: currentUser.name,
        email: userIdentifier.includes('@') ? userIdentifier : currentUser.email,
        is_staff: true,
        date_joined: currentUser.date_joined
      },
      access: 'mock_jwt_access_token_' + Date.now(),
      refresh: 'mock_jwt_refresh_token_' + Date.now()
    };
  },

  async register({ name, username, email, password }) {
    await delay(700);
    const newUser = {
      id: Date.now(),
      username: username || email.split('@')[0],
      name: name || 'New User',
      email: email,
      is_staff: false,
      date_joined: new Date().toISOString()
    };
    currentUser = { ...newUser, stats: { total_scans: 0, high_risk_scans: 0, last_scan_at: null, awareness_score: 50 } };

    return {
      user: newUser,
      access: 'mock_jwt_access_token_' + Date.now(),
      refresh: 'mock_jwt_refresh_token_' + Date.now()
    };
  },

  async getProfile() {
    await delay(300);
    return { ...currentUser };
  },

  async logout() {
    await delay(200);
    return { success: true };
  }
};

export const mockScanService = {
  async scanMessage({ content }, config = {}) {
    await delay(1200);
    const result = runMockScan({ content, scanType: 'message' });
    scansDatabase.unshift(result);
    return result;
  },

  async scanUrl({ url }, config = {}) {
    await delay(1100);
    const result = runMockScan({ url, scanType: 'url' });
    scansDatabase.unshift(result);
    return result;
  },

  async scanEmail({ sender, subject, body, url }, config = {}) {
    await delay(1300);
    const result = runMockScan({ sender, subject, body, url, scanType: 'email' });
    scansDatabase.unshift(result);
    return result;
  },

  async listScans(params = {}) {
    await delay(400);
    let list = [...scansDatabase];

    const { type, risk_level, search, ordering = '-created_at', page = 1, page_size = 20 } = params;

    // Filter by type
    if (type && type !== 'all') {
      list = list.filter((s) => s.scan_type?.toLowerCase() === type.toLowerCase());
    }

    // Filter by risk level
    if (risk_level && risk_level !== 'all') {
      list = list.filter((s) => s.risk_level?.toUpperCase() === risk_level.toUpperCase());
    }

    // Filter by search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.input_text?.toLowerCase().includes(q) ||
          s.threat_type?.toLowerCase().includes(q) ||
          s.summary?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (ordering) {
      const isDesc = ordering.startsWith('-');
      const field = isDesc ? ordering.substring(1) : ordering;
      list.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        if (field === 'created_at') {
          valA = new Date(valA || 0).getTime();
          valB = new Date(valB || 0).getTime();
        }
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // Pagination
    const total = list.length;
    const startIndex = (page - 1) * page_size;
    const paginated = list.slice(startIndex, startIndex + page_size);

    return {
      count: total,
      next: startIndex + page_size < total ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: paginated
    };
  },

  async getScan(id) {
    await delay(300);
    const numId = Number(id);
    const item = scansDatabase.find((s) => s.id === numId || String(s.id) === String(id));
    if (!item) {
      const err = new Error('Scan not found');
      err.response = { status: 404, data: { detail: 'This scan does not exist or is not yours.' } };
      throw err;
    }
    return item;
  }
};

export const mockDashboardService = {
  async getDashboard() {
    await delay(400);
    return getMockDashboardData(scansDatabase);
  }
};

export const mockAdminService = {
  async getPlatformStats() {
    await delay(400);
    return { ...MOCK_ADMIN_STATS };
  }
};
