// src/services/api.js
import axios from 'axios';
import { getAccessToken, setTokens, clearTokens, getRefreshToken } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    // 401 -> try refresh once, then force logout
    if (response?.status === 401 && !config?.__retried && getRefreshToken()) {
      config.__retried = true;
      try {
        refreshing = refreshing ?? axios.post(
          `${api.defaults.baseURL}/auth/token/refresh/`,
          { refresh: getRefreshToken() }
        );
        const { data } = await refreshing;
        refreshing = null;
        setTokens({ access: data.access });
        config.headers.Authorization = `Bearer ${data.access}`;
        return api(config);
      } catch {
        refreshing = null;
        clearTokens();
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    }
    return Promise.reject(normalizeError(error));
  }
);

export function normalizeError(error) {
  if (axios.isCancel?.(error) || error.code === 'ERR_CANCELED') {
    return { kind: 'canceled', message: 'Scan canceled.' };
  }
  if (error.code === 'ECONNABORTED') {
    return { kind: 'timeout', message: 'This is taking longer than expected.' };
  }
  if (!error.response) {
    return { kind: 'network', message: "Can't reach PhishGuard. Check your connection and try again." };
  }

  const { status, data } = error.response;
  const map = {
    400: 'Some of the details need fixing.',
    401: 'Your session has expired. Sign in again.',
    403: "You don't have access to this.",
    404: "We couldn't find that.",
    429: 'Too many requests. Wait a moment and try again.'
  };

  return {
    kind: status >= 500 ? 'server' : 'client',
    status,
    message: data?.detail || map[status] || (status >= 500 ? 'Something went wrong on our side. Try again in a moment.' : 'Something went wrong.'),
    fields: status === 400 && data && typeof data === 'object' ? data : null,
    raw: import.meta.env.DEV ? data : undefined
  };
}

export default api;
