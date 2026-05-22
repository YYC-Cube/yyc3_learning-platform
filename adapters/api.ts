import { buildHeaders, getApiBaseUrl, getAuthToken } from './config';
import { attemptTokenRefresh, registerAuthExpiredHandler, unregisterAuthExpiredHandler } from './auth';

interface ApiError extends Error {
  status?: number;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  fallback?: T,
): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;

  const doFetch = async (overrideHeaders?: Record<string, string>): Promise<T> => {
    const mergedHeaders = {
      ...buildHeaders(),
      ...(options?.headers as Record<string, string>),
      ...overrideHeaders,
    };

    const res = await fetch(url, { ...options, headers: mergedHeaders });

    if (!res.ok) {
      const errorText = await res.text();
      const err = new Error(`API request failed: ${res.status} ${errorText}`) as ApiError;
      err.status = res.status;
      throw err;
    }

    const json = await res.json();
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      if (!json.success && json.error) {
        if (fallback !== undefined) return fallback;
        throw new Error(json.error);
      }
      return json.data as T;
    }
    return json as T;
  };

  try {
    return await doFetch();
  } catch (err) {
    const apiErr = err as ApiError;

    if (apiErr.status === 401 && !path.includes('/auth/refresh')) {
      const newToken = await attemptTokenRefresh();
      if (newToken) {
        try {
          return await doFetch({ Authorization: `Bearer ${newToken}` });
        } catch {
          if (_expiredHandler) _expiredHandler();
          if (fallback !== undefined) return fallback;
          throw err;
        }
      } else {
        if (_expiredHandler) _expiredHandler();
      }
    }

    if (fallback !== undefined) return fallback;
    throw err;
  }
}

let _expiredHandler: (() => void) | null = null;

export { registerAuthExpiredHandler, unregisterAuthExpiredHandler };
export { getAuthToken } from './config';
