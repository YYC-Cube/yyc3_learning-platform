// =============================================================================
// YYC3-Learning-Platform — AuthContext Tests
// =============================================================================
// Tests authentication state management, login/signup/logout/guest flows,
// session restoration, token refresh, and edge cases.
// =============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  createMockUserProfile,
  createMockLocalStorage,
  wrapApiResponse,
  TEST_USER_ID,
  MOCK_ACCESS_TOKEN,
  MOCK_REFRESH_TOKEN,
} from '../setup';

// =============================================================================
// Module-level mocks
// =============================================================================

// Mock the apiService module — we don't want real network calls
const mockUserProfile = createMockUserProfile();

const mockYYC3API = {
  signUp: vi.fn(),
  signIn: vi.fn(),
  getAuthUser: vi.fn(),
  getUserProfile: vi.fn(),
  refreshToken: vi.fn(),
  seed: vi.fn(),
};

vi.mock('../../services/apiService', () => ({
  YYC3API: mockYYC3API,
  registerAuthExpiredHandler: vi.fn(),
  unregisterAuthExpiredHandler: vi.fn(),
}));

// =============================================================================
// Import after mocks
// =============================================================================

import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// =============================================================================
// Test Wrapper
// =============================================================================

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
}

// =============================================================================
// Setup / Teardown
// =============================================================================

let mockStorage: Storage;

beforeEach(() => {
  vi.clearAllMocks();
  mockStorage = createMockLocalStorage();
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// =============================================================================
// Basic Context
// =============================================================================

describe('AuthContext: Basic Setup', () => {
  it('should throw when useAuth is used outside AuthProvider', () => {
    // We need to suppress the error boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    consoleSpy.mockRestore();
  });

  it('should provide initial loading state', () => {
    mockYYC3API.getUserProfile.mockResolvedValue(null);
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isGuest).toBe(false);
    expect(result.current.userId).toBe('');
  });
});

// =============================================================================
// Guest Mode
// =============================================================================

describe('AuthContext: Guest Mode', () => {
  it('should enter guest mode with userId = "default"', async () => {
    mockYYC3API.seed.mockResolvedValue({ message: 'Seeded' });
    mockYYC3API.getUserProfile.mockResolvedValue(mockUserProfile);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.enterGuestMode();
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isGuest).toBe(true);
    expect(result.current.userId).toBe('default');
    expect(mockStorage.getItem('yyc3_guest_mode')).toBe('true');
  });

  it('should restore guest mode from localStorage on mount', async () => {
    mockStorage.setItem('yyc3_guest_mode', 'true');
    mockYYC3API.getUserProfile.mockResolvedValue(mockUserProfile);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Wait for async restore
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(result.current.isGuest).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear auth tokens when entering guest mode', async () => {
    mockStorage.setItem('yyc3_access_token', 'old-token');
    mockStorage.setItem('yyc3_refresh_token', 'old-refresh');
    mockYYC3API.seed.mockResolvedValue({});
    mockYYC3API.getUserProfile.mockResolvedValue(mockUserProfile);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.enterGuestMode();
    });

    expect(mockStorage.getItem('yyc3_access_token')).toBeNull();
    expect(mockStorage.getItem('yyc3_refresh_token')).toBeNull();
  });
});

// =============================================================================
// Login
// =============================================================================

describe('AuthContext: Login', () => {
  it('should login successfully and update state', async () => {
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: TEST_USER_ID, email: 'test@test.com' },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: TEST_USER_ID, email: 'test@test.com' },
      profile: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isGuest).toBe(false);
    expect(result.current.userId).toBe(TEST_USER_ID);
    expect(mockStorage.getItem('yyc3_access_token')).toBe(MOCK_ACCESS_TOKEN);
    expect(mockStorage.getItem('yyc3_refresh_token')).toBe(MOCK_REFRESH_TOKEN);
  });

  it('should throw when login returns no access token', async () => {
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: TEST_USER_ID },
      accessToken: null,
      refreshToken: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await expect(
      act(async () => {
        await result.current.login('test@test.com', 'password123');
      })
    ).rejects.toThrow('Login failed: no access token returned');
  });

  it('should clear guest mode flag on login', async () => {
    mockStorage.setItem('yyc3_guest_mode', 'true');
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: TEST_USER_ID },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: TEST_USER_ID, email: 'test@test.com' },
      profile: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });

    expect(mockStorage.getItem('yyc3_guest_mode')).toBeNull();
  });
});

// =============================================================================
// Signup
// =============================================================================

describe('AuthContext: Signup', () => {
  it('should signup and auto-login', async () => {
    mockYYC3API.signUp.mockResolvedValue({ user: { id: 'new-user' } });
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: 'new-user', email: 'new@test.com' },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: 'new-user', email: 'new@test.com' },
      profile: createMockUserProfile({ id: 'new-user' }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.signup('new@test.com', 'password123', '新用户');
    });

    expect(mockYYC3API.signUp).toHaveBeenCalledWith('new@test.com', 'password123', '新用户');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userId).toBe('new-user');
  });
});

// =============================================================================
// Logout
// =============================================================================

describe('AuthContext: Logout', () => {
  it('should clear all state and tokens on logout', async () => {
    // First login
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: TEST_USER_ID },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: TEST_USER_ID, email: 'test@test.com' },
      profile: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    // Now logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isGuest).toBe(false);
    expect(result.current.userId).toBe('');
    expect(result.current.authUser).toBeNull();
    expect(result.current.userProfile).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(mockStorage.getItem('yyc3_access_token')).toBeNull();
    expect(mockStorage.getItem('yyc3_refresh_token')).toBeNull();
    expect(mockStorage.getItem('yyc3_guest_mode')).toBeNull();
  });
});

// =============================================================================
// Session Restore
// =============================================================================

describe('AuthContext: Session Restore', () => {
  it('should restore session from saved access token', async () => {
    mockStorage.setItem('yyc3_access_token', MOCK_ACCESS_TOKEN);
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: TEST_USER_ID, email: 'test@test.com' },
      profile: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userId).toBe(TEST_USER_ID);
  });

  it('should handle expired token gracefully on restore', async () => {
    mockStorage.setItem('yyc3_access_token', 'expired-token');
    mockYYC3API.getAuthUser.mockRejectedValue(new Error('Token expired'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(mockStorage.getItem('yyc3_access_token')).toBeNull();
  });

  it('should finish loading when no token is stored', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });
});

// =============================================================================
// Profile Refresh
// =============================================================================

describe('AuthContext: Profile Refresh', () => {
  it('should refresh profile for authenticated user', async () => {
    // Login first
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: TEST_USER_ID },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: TEST_USER_ID, email: 'test@test.com' },
      profile: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });

    // Refresh with updated profile
    const updatedProfile = createMockUserProfile({ firstName: '更新名' });
    mockYYC3API.getUserProfile.mockResolvedValue(updatedProfile);

    await act(async () => {
      await result.current.refreshProfile();
    });

    expect(result.current.userProfile?.firstName).toBe('更新名');
  });

  it('should not crash when refreshProfile is called with no userId', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should not throw
    await act(async () => {
      await result.current.refreshProfile();
    });
  });
});

// =============================================================================
// Edge Cases
// =============================================================================

describe('AuthContext: Edge Cases', () => {
  it('should handle concurrent login attempts gracefully', async () => {
    mockYYC3API.signIn.mockResolvedValue({
      user: { id: TEST_USER_ID },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    mockYYC3API.getAuthUser.mockResolvedValue({
      authUser: { id: TEST_USER_ID, email: 'test@test.com' },
      profile: mockUserProfile,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    // Fire two logins concurrently
    await act(async () => {
      await Promise.allSettled([
        result.current.login('test@test.com', 'pass1'),
        result.current.login('test@test.com', 'pass2'),
      ]);
    });

    // Should be in a valid state (not corrupted)
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle seed failure gracefully in guest mode', async () => {
    mockYYC3API.seed.mockRejectedValue(new Error('Seed failed'));
    mockYYC3API.getUserProfile.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.enterGuestMode();
    });

    // Should still enter guest mode despite seed failure
    expect(result.current.isGuest).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
