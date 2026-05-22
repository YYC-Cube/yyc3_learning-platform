// =============================================================================
// YYC3-Learning-Platform — Auth Context
// =============================================================================
// Global authentication state management.
// Provides userId, login, signup, logout, and guest mode.
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { YYC3API } from '../services/apiService';
import { registerAuthExpiredHandler, unregisterAuthExpiredHandler } from '../services/apiService';
import type { UserProfile } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  /** Supabase auth user (null if guest or unauthenticated) */
  authUser: AuthUser | null;
  /** KV-persisted user profile */
  userProfile: UserProfile | null;
  /** Supabase access token */
  accessToken: string | null;
  /** Whether auth check has completed */
  isLoading: boolean;
  /** True if logged in or in guest mode */
  isAuthenticated: boolean;
  /** True when using guest mode (userId = 'default') */
  isGuest: boolean;
}

interface AuthContextValue extends AuthState {
  /** Resolved userId — auth user id or 'default' for guest */
  userId: string;
  /** Email/password login */
  login: (email: string, password: string) => Promise<void>;
  /** Email/password registration */
  signup: (email: string, password: string, name: string) => Promise<void>;
  /** Sign out and clear persisted session */
  logout: () => void;
  /** Enter guest mode (no auth required) */
  enterGuestMode: () => void;
  /** Refresh the user profile from KV */
  refreshProfile: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_TOKEN = 'yyc3_access_token';
const STORAGE_KEY_REFRESH = 'yyc3_refresh_token';
const STORAGE_KEY_GUEST = 'yyc3_guest_mode';

/** Refresh the token 2 minutes before it expires (default Supabase JWT lifetime: 1 hour) */
const TOKEN_REFRESH_INTERVAL_MS = 55 * 60 * 1000; // 55 minutes

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    authUser: null,
    userProfile: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
    isGuest: false,
  });

  // Derive userId from state
  const userId = state.authUser?.id ?? (state.isGuest ? 'default' : '');

  // -------------------------------------------------------------------------
  // Boot: restore session from localStorage
  // -------------------------------------------------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      // Check guest mode first
      const isGuestStored = localStorage.getItem(STORAGE_KEY_GUEST) === 'true';
      if (isGuestStored) {
        const profile = await YYC3API.getUserProfile('default').catch(() => null);
        setState({
          authUser: null,
          userProfile: profile ?? null,
          accessToken: null,
          isLoading: false,
          isAuthenticated: true,
          isGuest: true,
        });
        return;
      }

      // Check for saved access token
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (!savedToken) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const data = await YYC3API.getAuthUser(savedToken);
        setState({
          authUser: data.authUser,
          userProfile: data.profile,
          accessToken: savedToken,
          isLoading: false,
          isAuthenticated: true,
          isGuest: false,
        });
      } catch (err) {
        console.warn('Session restore failed — token may be expired:', err);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_REFRESH);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    restoreSession();
  }, []);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const data = await YYC3API.signIn(email, password);
    if (!data.accessToken) throw new Error('Login failed: no access token returned');

    // Save tokens
    localStorage.setItem(STORAGE_KEY_TOKEN, data.accessToken);
    if (data.refreshToken) localStorage.setItem(STORAGE_KEY_REFRESH, data.refreshToken);
    localStorage.removeItem(STORAGE_KEY_GUEST);

    // Validate token and fetch full profile via auth/me (always returns a profile)
    const authData = await YYC3API.getAuthUser(data.accessToken);

    setState({
      authUser: authData.authUser,
      userProfile: authData.profile,
      accessToken: data.accessToken,
      isLoading: false,
      isAuthenticated: true,
      isGuest: false,
    });
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    // Create user via server (uses admin API)
    await YYC3API.signUp(email, password, name);
    // Auto-login after signup
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_REFRESH);
    localStorage.removeItem(STORAGE_KEY_GUEST);
    setState({
      authUser: null,
      userProfile: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
      isGuest: false,
    });
  }, []);

  const enterGuestMode = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_REFRESH);
    localStorage.setItem(STORAGE_KEY_GUEST, 'true');

    // Seed default data & load profile
    try {
      await YYC3API.seed({
        userProfile: {
          id: 'default',
          firstName: '言语',
          lastName: '',
          email: 'yanyu@yyc3.com',
          role: 'user',
        },
        dashboardStats: {
          activeUsers: 1847,
          totalCourses: 32,
          completionRate: 78,
          revenue: 125400,
          weeklyGrowth: 12.5,
          avgSessionMinutes: 42,
        },
      });
    } catch {
      console.warn('Seed failed in guest mode — continuing with fallback');
    }

    const profile = await YYC3API.getUserProfile('default').catch(() => null);
    setState({
      authUser: null,
      userProfile: profile ?? null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: true,
      isGuest: true,
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    const id = state.authUser?.id ?? (state.isGuest ? 'default' : '');
    if (!id) return;
    const profile = await YYC3API.getUserProfile(id).catch(() => null);
    if (profile) {
      setState(prev => ({ ...prev, userProfile: profile }));
    }
  }, [state.authUser?.id, state.isGuest]);

  // -------------------------------------------------------------------------
  // Token auto-refresh (proactive, runs on interval)
  // -------------------------------------------------------------------------
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const attemptTokenRefresh = useCallback(async () => {
    const savedRefresh = localStorage.getItem(STORAGE_KEY_REFRESH);
    if (!savedRefresh || state.isGuest || !state.isAuthenticated) return;

    try {
      const data = await YYC3API.refreshToken(savedRefresh);
      localStorage.setItem(STORAGE_KEY_TOKEN, data.accessToken);
      if (data.refreshToken) localStorage.setItem(STORAGE_KEY_REFRESH, data.refreshToken);
      setState(prev => ({ ...prev, accessToken: data.accessToken }));
      console.log('[Auth] Token refreshed successfully, expires at:', new Date((data.expiresAt ?? 0) * 1000).toISOString());
    } catch (err) {
      console.warn('[Auth] Proactive token refresh failed — forcing logout:', err);
      logout();
    }
  }, [state.isGuest, state.isAuthenticated, logout]);

  useEffect(() => {
    // Only run timer when authenticated (non-guest) and have a refresh token
    if (state.isAuthenticated && !state.isGuest && localStorage.getItem(STORAGE_KEY_REFRESH)) {
      refreshTimerRef.current = setInterval(attemptTokenRefresh, TOKEN_REFRESH_INTERVAL_MS);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [state.isAuthenticated, state.isGuest, attemptTokenRefresh]);

  // -------------------------------------------------------------------------
  // Register auth-expired handler (reactive 401 → force logout)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Only register for authenticated, non-guest sessions
    if (state.isAuthenticated && !state.isGuest) {
      registerAuthExpiredHandler(() => {
        console.log('[Auth] Auth-expired handler triggered — logging out');
        logout();
      });
    } else {
      unregisterAuthExpiredHandler();
    }
    return () => {
      unregisterAuthExpiredHandler();
    };
  }, [state.isAuthenticated, state.isGuest, logout]);

  // -------------------------------------------------------------------------
  // Context value
  // -------------------------------------------------------------------------
  const value: AuthContextValue = {
    ...state,
    userId,
    login,
    signup,
    logout,
    enterGuestMode,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}