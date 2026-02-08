// API client for ShortLink Admin Dashboard

import type {
  ShortLink,
  CreateLinkRequest,
  UpdateLinkRequest,
  LinkListResponse,
  AnalyticsData,
  DashboardStats,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ApiError,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ApiError).error || 'Request failed');
    }

    return data as T;
  }

  // Auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Links
  async getLinks(page: number = 1, limit: number = 50): Promise<LinkListResponse> {
    return this.request<LinkListResponse>(`/links?page=${page}&limit=${limit}`);
  }

  async getLink(shortCode: string): Promise<ShortLink> {
    return this.request<ShortLink>(`/links/${shortCode}`);
  }

  async createLink(data: CreateLinkRequest): Promise<ShortLink> {
    return this.request<ShortLink>('/links', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLink(shortCode: string, data: UpdateLinkRequest): Promise<ShortLink> {
    return this.request<ShortLink>(`/links/${shortCode}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLink(shortCode: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/links/${shortCode}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getAnalytics(shortCode: string, days: number = 30): Promise<AnalyticsData> {
    return this.request<AnalyticsData>(`/analytics/${shortCode}?days=${days}`);
  }

  async getStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/stats');
  }
}

export const api = new ApiClient();
