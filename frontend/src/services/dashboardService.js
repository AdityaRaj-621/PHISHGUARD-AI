// src/services/dashboardService.js
import api from './api';
import { mockDashboardService } from './mock/mockApi';

const realDashboardService = {
  async getDashboard() {
    const res = await api.get('/dashboard/');
    return res.data;
  }
};

const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false';
export default isMock ? mockDashboardService : realDashboardService;
