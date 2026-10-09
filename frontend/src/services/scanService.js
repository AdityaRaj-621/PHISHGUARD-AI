// src/services/scanService.js
import api from './api';
import { toScanResult } from './adapters';
import { mockScanService } from './mock/mockApi';

const realScanService = {
  async scanMessage({ content }, { signal } = {}) {
    const res = await api.post('/scans/message/', { content }, { signal });
    return toScanResult(res.data);
  },

  async scanUrl({ url }, { signal } = {}) {
    const res = await api.post('/scans/url/', { url }, { signal });
    return toScanResult(res.data);
  },

  async scanEmail({ sender, subject, body, url }, { signal } = {}) {
    const payload = {};
    if (sender) payload.sender = sender;
    if (subject) payload.subject = subject;
    if (body) payload.body = body;
    if (url) payload.url = url;
    const res = await api.post('/scans/email/', payload, { signal });
    return toScanResult(res.data);
  },

  async listScans(params = {}) {
    const res = await api.get('/scans/', { params });
    return {
      ...res.data,
      results: (res.data.results || []).map(toScanResult)
    };
  },

  async getScan(id) {
    const res = await api.get(`/scans/${id}/`);
    return toScanResult(res.data);
  }
};

const isMock = import.meta.env.VITE_USE_MOCK_API !== 'false';
export default isMock ? mockScanService : realScanService;
