// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { getAccessToken, setTokens, clearTokens } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      clearTokens();
      setUser(null);
      throw err;
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          await refreshUser();
        } catch {
          // Token expired or invalid
        }
      }
      setBootstrapping(false);
    };

    initAuth();

    // Listen for auth expiration event from Axios interceptor
    const handleExpired = () => {
      clearTokens();
      setUser(null);
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [refreshUser]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.access) {
      setTokens({ access: data.access, refresh: data.refresh });
    }
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    if (data.access) {
      setTokens({ access: data.access, refresh: data.refresh });
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    clearTokens();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user?.is_staff),
    bootstrapping,
    login,
    register,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
