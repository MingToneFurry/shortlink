// Types for ShortLink Admin Dashboard

export interface ShortLink {
  shortCode: string;
  url: string;
  title: string;
  description: string;
  showInterstitial: boolean;
  delay: number;
  clicks: number;
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
  updatedBy?: string;
  expiresAt?: number | null;
  active?: boolean;
}

export interface CreateLinkRequest {
  url: string;
  customSuffix?: string;
  title?: string;
  description?: string;
  showInterstitial?: boolean;
  delay?: number;
  expiresAt?: number | null;
}

export interface UpdateLinkRequest {
  url?: string;
  title?: string;
  description?: string;
  showInterstitial?: boolean;
  delay?: number;
  expiresAt?: number | null;
  active?: boolean;
}

export interface LinkListResponse {
  links: ShortLink[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalyticsData {
  totalClicks: number;
  period: number;
  countries: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  browsers: { name: string; value: number }[];
  daily: { date: string; value: number }[];
  hourly: { hour: number; value: number }[];
  recentClicks: {
    timestamp: number;
    ip: string;
    country: string;
    device: string;
    browser: string;
    os: string;
    referrer: string;
  }[];
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  todayClicks: number;
  activeLinks: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ApiError {
  error: string;
}
