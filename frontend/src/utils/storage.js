// src/utils/storage.js

let memoryAccessToken = null;

export function getAccessToken() {
  if (memoryAccessToken) return memoryAccessToken;
  try {
    const token = sessionStorage.getItem('phishguard_access_token');
    memoryAccessToken = token;
    return token;
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem('phishguard_refresh_token');
  } catch {
    return null;
  }
}

export function setTokens({ access, refresh }) {
  if (access) {
    memoryAccessToken = access;
    try {
      sessionStorage.setItem('phishguard_access_token', access);
    } catch {}
  }
  if (refresh) {
    try {
      localStorage.setItem('phishguard_refresh_token', refresh);
    } catch {}
  }
}

export function clearTokens() {
  memoryAccessToken = null;
  try {
    sessionStorage.removeItem('phishguard_access_token');
    localStorage.removeItem('phishguard_refresh_token');
  } catch {}
}
