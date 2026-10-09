// src/services/adminService.js
import api from './api';
import { mockAdminService } from './mock/mockApi';

const realAdminService = {
  async getPlatformStats() {
    try {
      const res = await api.get('/admin/stats/');
      return res.data;
    } catch {
      // Fallback per §30
      const fallback = await api.get('/dashboard/', { params: { scope: 'platform' } });
      return fallback.data;
    }
  }
};

const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false';
export default isMock ? mockAdminService : realAdminService;
