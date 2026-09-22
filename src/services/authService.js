// src/services/authService.js
import api from './api';
import { mockAuthService } from './mock/mockApi';

const realAuthService = {
  async register({ name, username, email, password, password2 }) {
    const res = await api.post('/auth/register/', { name, username, email, password, password2 });
    return res.data;
  },

  async login({ identifier, username, password }) {
    const res = await api.post('/auth/login/', { username: identifier || username, password });
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/auth/profile/');
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout/');
    } catch {}
    return { success: true };
  }
};

const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false';
export default isMock ? mockAuthService : realAuthService;
