/// <reference types="vite/client" />
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface AdapterConfig {
  apiBaseUrl: string;
  authToken: string | null;
}

let config: AdapterConfig = {
  apiBaseUrl: API_BASE_URL,
  authToken: typeof window !== 'undefined' ? localStorage.getItem('yyc3_access_token') : null,
};

export function getAdapterConfig(): AdapterConfig {
  return { ...config };
}

export function setAuthToken(token: string | null): void {
  config.authToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('yyc3_access_token', token);
    } else {
      localStorage.removeItem('yyc3_access_token');
    }
  }
}

export function getAuthToken(): string | null {
  return config.authToken;
}

export function getApiBaseUrl(): string {
  return config.apiBaseUrl;
}

export function buildHeaders(overrides?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...overrides,
  };
  if (config.authToken) {
    headers['Authorization'] = `Bearer ${config.authToken}`;
  }
  return headers;
}
