import { buildHeaders, getApiBaseUrl, setAuthToken } from './config';

interface AuthResult {
  user: { id: string; email: string };
  accessToken: string;
  refreshToken?: string;
}

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const STORAGE_KEY_REFRESH = 'yyc3_refresh_token';
const STORAGE_KEY_GUEST = 'yyc3_guest_mode';

let _isRefreshing = false;
let _refreshPromise: Promise<string | null> | null = null;

type AuthExpiredHandler = () => void;
let _authExpiredHandler: AuthExpiredHandler | null = null;

export function registerAuthExpiredHandler(handler: AuthExpiredHandler): void {
  _authExpiredHandler = handler;
}

export function unregisterAuthExpiredHandler(): void {
  _authExpiredHandler = null;
}

export function isGuestMode(): boolean {
  return typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY_GUEST) === 'true';
}

export function enterGuestMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_GUEST, 'true');
  }
}

export function exitGuestMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_GUEST);
  }
}

export function getStoredRefreshToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_REFRESH) : null;
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResult> {
  const res = await fetch(`${getApiBaseUrl()}/signup`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error(`注册失败: ${res.status}`);
  const json = await res.json();
  const data = json.data || json;
  if (data.accessToken) {
    setAuthToken(data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem(STORAGE_KEY_REFRESH, data.refreshToken);
    }
  }
  return data;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${getApiBaseUrl()}/signin`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`登录失败: ${res.status}`);
  const json = await res.json();
  const data = json.data || json;
  if (data.accessToken) {
    setAuthToken(data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem(STORAGE_KEY_REFRESH, data.refreshToken);
    }
  }
  return data;
}

export async function getAuthUser(accessToken: string): Promise<{ authUser: { id: string; email: string }; profile: unknown }> {
  const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: buildHeaders({ Authorization: `Bearer ${accessToken}` }),
  });
  if (!res.ok) throw new Error(`获取用户失败: ${res.status}`);
  const json = await res.json();
  return json.data || json;
}

export async function resetPassword(email: string, newPassword: string): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/auth/reset-password`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, newPassword }),
  });
  if (!res.ok) throw new Error(`重置密码失败: ${res.status}`);
}

export function attemptTokenRefresh(): Promise<string | null> {
  if (_isRefreshing && _refreshPromise) return _refreshPromise;

  _isRefreshing = true;
  _refreshPromise = (async (): Promise<string | null> => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      const data: RefreshResult = json.data || json;
      if (data.accessToken) {
        setAuthToken(data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEY_REFRESH, data.refreshToken);
        }
        return data.accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      _isRefreshing = false;
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

export function clearAuthState(): void {
  setAuthToken(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_REFRESH);
    localStorage.removeItem(STORAGE_KEY_GUEST);
  }
}

export { _authExpiredHandler };
