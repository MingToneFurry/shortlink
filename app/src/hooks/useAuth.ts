import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { LoginRequest } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      // Verify token by making a stats request
      api.getStats()
        .then(() => {
          setAuthState({
            isAuthenticated: true,
            username: localStorage.getItem('admin_username'),
            isLoading: false,
          });
        })
        .catch(() => {
          api.clearToken();
          setAuthState({
            isAuthenticated: false,
            username: null,
            isLoading: false,
          });
        });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await api.login(credentials);
      api.setToken(response.token);
      localStorage.setItem('admin_username', response.username);
      setAuthState({
        isAuthenticated: true,
        username: response.username,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    api.clearToken();
    localStorage.removeItem('admin_username');
    setAuthState({
      isAuthenticated: false,
      username: null,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
}
