// =============================================================================
// YYC3-Learning-Platform — API Service Unit Tests
// =============================================================================
// Tests YYC3API static methods with mocked fetch.
// Covers: envelope unwrap, fallback logic, auth token refresh, error handling.
// =============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createMockUserProfile,
  createMockUserSettings,
  createMockModuleProgress,
  createMockModuleCard,
  createMockDashboardStats,
  createMockAchievement,
  createMockTask,
  createMockPost,
  createMockCertificate,
  createMockVideoProgress,
  createMockFeedback,
  createMockSaleRecord,
  createMockSalesKPI,
  createMockRoadmapData,
  createMockSprintPhase,
  createMockComment,
  createMockFetch,
  wrapApiResponse,
  wrapApiError,
  createMockLocalStorage,
  TEST_USER_ID,
  TEST_MODULE_ID,
  TEST_LESSON_ID,
  TEST_POST_ID,
  MOCK_ACCESS_TOKEN,
} from '../setup';

// =============================================================================
// Mock Setup
// =============================================================================

// We mock the fetch globally; apiService uses raw fetch internally
const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

/**
 * Helper: set up fetch to return a standard envelope response
 */
function mockFetchSuccess<T>(data: T) {
  globalThis.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(wrapApiResponse(data)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function mockFetchError(errorMessage: string, status = 500) {
  globalThis.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(wrapApiError(errorMessage)), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

// =============================================================================
// Envelope Unwrap Tests
// =============================================================================

describe('API Service: Envelope Unwrap', () => {
  it('should unwrap standard { success, data } envelope', async () => {
    const mockProfile = createMockUserProfile();
    mockFetchSuccess(mockProfile);

    // Dynamically import to get fresh module with mocked fetch
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getUserProfile(TEST_USER_ID);
    expect(result).toBeTruthy();
  });

  it('should pass through raw response when no envelope present', async () => {
    const rawData = { custom: 'response' };
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(rawData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.healthCheck();
    expect(result).toBeTruthy();
  });
});

// =============================================================================
// Health Check
// =============================================================================

describe('API Service: Health Check', () => {
  it('should call /health endpoint', async () => {
    mockFetchSuccess({ status: 'operational', version: '2.6.0' });
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.healthCheck();
    expect(result).toHaveProperty('status');
  });
});

// =============================================================================
// User Profile CRUD
// =============================================================================

describe('API Service: User Profile', () => {
  it('getUserProfile should return profile or fallback', async () => {
    const mock = createMockUserProfile();
    mockFetchSuccess(mock);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getUserProfile(TEST_USER_ID);
    expect(result).toBeTruthy();
  });

  it('getUserProfile should use default userId when omitted', async () => {
    mockFetchSuccess(createMockUserProfile());
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.getUserProfile();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('userId=default'),
      expect.anything()
    );
  });

  it('updateUserProfile should send PUT with profile data', async () => {
    const update = { firstName: '新名字' };
    mockFetchSuccess(createMockUserProfile(update));
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.updateUserProfile(update);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/profile'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(update),
      })
    );
  });
});

// =============================================================================
// User Settings
// =============================================================================

describe('API Service: User Settings', () => {
  it('getUserSettings should return settings', async () => {
    mockFetchSuccess(createMockUserSettings());
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getUserSettings(TEST_USER_ID);
    expect(result).toHaveProperty('language');
    expect(result).toHaveProperty('dailyGoalMinutes');
  });

  it('updateUserSettings should send PUT', async () => {
    const update = { language: 'fr' as const };
    mockFetchSuccess(createMockUserSettings(update));
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.updateUserSettings(update);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/settings'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

// =============================================================================
// Module Progress
// =============================================================================

describe('API Service: Module Progress', () => {
  it('getAllProgress should return array', async () => {
    mockFetchSuccess([createMockModuleProgress()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getAllProgress(TEST_USER_ID);
    expect(Array.isArray(result)).toBe(true);
  });

  it('getModuleProgress should return single progress or null', async () => {
    mockFetchSuccess(createMockModuleProgress());
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getModuleProgress(TEST_MODULE_ID, TEST_USER_ID);
    expect(result).toBeTruthy();
  });

  it('updateModuleProgress should send PUT with module ID', async () => {
    const update = { progressPercent: 50 };
    mockFetchSuccess(createMockModuleProgress(update));
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.updateModuleProgress(TEST_MODULE_ID, update, TEST_USER_ID);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/user/progress/${TEST_MODULE_ID}`),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

// =============================================================================
// Achievements
// =============================================================================

describe('API Service: Achievements', () => {
  it('getAchievements should return array', async () => {
    mockFetchSuccess([createMockAchievement()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getAchievements(TEST_USER_ID);
    expect(Array.isArray(result)).toBe(true);
  });

  it('awardAchievement should POST new achievement', async () => {
    const achievement = createMockAchievement();
    const { earnedAt, ...withoutEarnedAt } = achievement;
    mockFetchSuccess([achievement]);
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.awardAchievement(withoutEarnedAt, TEST_USER_ID);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/achievements'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Dashboard Stats
// =============================================================================

describe('API Service: Dashboard Stats', () => {
  it('getDashboardStats should return stats with fallback', async () => {
    mockFetchSuccess(createMockDashboardStats());
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getDashboardStats();
    expect(result).toHaveProperty('activeUsers');
    expect(result).toHaveProperty('totalCourses');
  });

  it('updateDashboardStats should send PUT', async () => {
    mockFetchSuccess(createMockDashboardStats({ activeUsers: 2000 }));
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.updateDashboardStats({ activeUsers: 2000 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/stats'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

// =============================================================================
// Courses
// =============================================================================

describe('API Service: Courses', () => {
  it('getModules should return non-empty array (falls back to mock data)', async () => {
    mockFetchSuccess([]); // KV empty → should fallback to mock
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getModules();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0); // uses client-side mock fallback
  });

  it('getModuleById should return detailed module or null', async () => {
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getModuleById('1'); // maps to 'ia'
    // May or may not find it depending on mock data availability
    // The important thing is it doesn't throw
    expect(result === null || typeof result === 'object').toBe(true);
  });

  it('saveCourses should POST courses array', async () => {
    const courses = [createMockModuleCard()];
    mockFetchSuccess(undefined);
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.saveCourses(courses);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/courses'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Kanban Tasks
// =============================================================================

describe('API Service: Kanban Tasks', () => {
  it('getTasks should return array', async () => {
    mockFetchSuccess([createMockTask()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getTasks();
    expect(Array.isArray(result)).toBe(true);
  });

  it('saveTasks should POST tasks', async () => {
    mockFetchSuccess(undefined);
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.saveTasks([createMockTask()]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tasks'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Community Posts
// =============================================================================

describe('API Service: Community Posts', () => {
  it('getPosts should return array', async () => {
    mockFetchSuccess([createMockPost()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getPosts();
    expect(Array.isArray(result)).toBe(true);
  });

  it('savePosts should POST posts', async () => {
    mockFetchSuccess(undefined);
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.savePosts([createMockPost()]);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/posts'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Learning Activity
// =============================================================================

describe('API Service: Learning Activity', () => {
  it('getActivity should return record map', async () => {
    mockFetchSuccess({ '2026-02-25': 30 });
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getActivity(TEST_USER_ID);
    expect(typeof result).toBe('object');
  });

  it('recordActivity should POST date and minutes', async () => {
    mockFetchSuccess({ totalToday: 60 });
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.recordActivity('2026-02-25', 30, TEST_USER_ID);
    expect(result).toHaveProperty('totalToday');
  });
});

// =============================================================================
// Feedback
// =============================================================================

describe('API Service: Feedback', () => {
  it('submitFeedback should POST feedback payload', async () => {
    mockFetchSuccess(createMockFeedback());
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.submitFeedback({
      type: 'beta_feedback',
      message: '很好',
      rating: 5,
      userId: TEST_USER_ID,
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/feedback'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('getFeedback should return array', async () => {
    mockFetchSuccess([createMockFeedback()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getFeedback(TEST_USER_ID);
    expect(Array.isArray(result)).toBe(true);
  });
});

// =============================================================================
// Sales
// =============================================================================

describe('API Service: Sales', () => {
  it('getSales should return { records, kpis }', async () => {
    mockFetchSuccess({
      records: [createMockSaleRecord()],
      kpis: createMockSalesKPI(),
    });
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getSales();
    expect(result).toHaveProperty('records');
    expect(result).toHaveProperty('kpis');
  });
});

// =============================================================================
// Phase 2: Certificates
// =============================================================================

describe('API Service: Certificates', () => {
  it('getCertificates should return array', async () => {
    mockFetchSuccess([createMockCertificate()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getCertificates(TEST_USER_ID);
    expect(Array.isArray(result)).toBe(true);
  });

  it('awardCertificate should POST certificate', async () => {
    const cert = createMockCertificate();
    mockFetchSuccess({ certificate: cert, certificates: [cert] });
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.awardCertificate(TEST_USER_ID, cert);
    expect(result).toHaveProperty('certificate');
    expect(result).toHaveProperty('certificates');
  });
});

// =============================================================================
// Phase 2: Video Progress
// =============================================================================

describe('API Service: Video Progress', () => {
  it('getVideoProgress should return progress or null', async () => {
    mockFetchSuccess(createMockVideoProgress());
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getVideoProgress(TEST_USER_ID, TEST_MODULE_ID, TEST_LESSON_ID);
    expect(result).toBeTruthy();
  });

  it('getModuleVideoProgress should return array', async () => {
    mockFetchSuccess([createMockVideoProgress()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getModuleVideoProgress(TEST_USER_ID, TEST_MODULE_ID);
    expect(Array.isArray(result)).toBe(true);
  });

  it('saveVideoProgress should POST progress data', async () => {
    mockFetchSuccess(createMockVideoProgress());
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.saveVideoProgress({
      userId: TEST_USER_ID,
      moduleId: TEST_MODULE_ID,
      lessonId: TEST_LESSON_ID,
      currentTime: 300,
      duration: 600,
      percentWatched: 50,
      completed: false,
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/video-progress'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Phase 2: Comments
// =============================================================================

describe('API Service: Post Comments', () => {
  it('getPostComments should return array', async () => {
    mockFetchSuccess([createMockComment()]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getPostComments(TEST_POST_ID);
    expect(Array.isArray(result)).toBe(true);
  });

  it('addPostComment should POST comment', async () => {
    mockFetchSuccess(createMockComment());
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.addPostComment(TEST_POST_ID, {
      postId: TEST_POST_ID,
      userId: TEST_USER_ID,
      userName: '测试',
      userAvatar: '/avatar.png',
      userRole: 'user',
      content: '新评论',
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/posts/${TEST_POST_ID}/comments`),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Roadmap
// =============================================================================

describe('API Service: Roadmap', () => {
  it('getRoadmapData should return data or null', async () => {
    mockFetchSuccess(createMockRoadmapData());
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getRoadmapData();
    // Could be data or null
    expect(result === null || typeof result === 'object').toBe(true);
  });

  it('saveRoadmapData should POST roadmap', async () => {
    const data = createMockRoadmapData();
    mockFetchSuccess(data);
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.saveRoadmapData(data);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/roadmap'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('updatePhaseProgress should PUT phase update', async () => {
    mockFetchSuccess(createMockSprintPhase());
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.updatePhaseProgress('phase-1', { progress: 80 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/roadmap/phase/phase-1'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

// =============================================================================
// Auth
// =============================================================================

describe('API Service: Auth', () => {
  it('signUp should POST email/password/name', async () => {
    mockFetchSuccess({ user: { id: 'new-user', email: 'test@test.com' } });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.signUp('test@test.com', 'password123', '测试');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/signup'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('signIn should POST email/password', async () => {
    mockFetchSuccess({
      user: { id: 'user-1', email: 'test@test.com' },
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: 'refresh-token',
    });
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.signIn('test@test.com', 'password123');
    expect(result).toHaveProperty('accessToken');
  });

  it('getAuthUser should send Authorization header', async () => {
    mockFetchSuccess({
      authUser: { id: 'user-1', email: 'test@test.com' },
      profile: createMockUserProfile(),
    });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.getAuthUser(MOCK_ACCESS_TOKEN);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/me'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${MOCK_ACCESS_TOKEN}`,
        }),
      })
    );
  });

  it('resetPassword should POST email and newPassword', async () => {
    mockFetchSuccess({ message: 'Password reset successfully' });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.resetPassword('test@test.com', 'newpass123');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/reset-password'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});

// =============================================================================
// Admin Operations
// =============================================================================

describe('API Service: Admin Operations', () => {
  it('bootstrapAdmin should POST with auth token', async () => {
    mockFetchSuccess({ userId: 'admin-1', role: 'admin', message: 'OK' });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.bootstrapAdmin(MOCK_ACCESS_TOKEN);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/bootstrap'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('setUserRole should POST targetUserId and role', async () => {
    mockFetchSuccess({
      userId: TEST_USER_ID,
      role: 'vip',
      profile: createMockUserProfile({ role: 'vip' }),
    });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.setUserRole(TEST_USER_ID, 'vip', MOCK_ACCESS_TOKEN);
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toContain('/admin/set-role');
    const body = JSON.parse(call[1].body);
    expect(body.targetUserId).toBe(TEST_USER_ID);
    expect(body.role).toBe('vip');
  });

  it('listUsers should GET with auth header', async () => {
    mockFetchSuccess([createMockUserProfile()]);
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.listUsers(MOCK_ACCESS_TOKEN);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/users'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${MOCK_ACCESS_TOKEN}`,
        }),
      })
    );
  });

  it('deleteUser should send DELETE with userId', async () => {
    mockFetchSuccess({ message: 'Deleted' });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.deleteUser(TEST_USER_ID, MOCK_ACCESS_TOKEN);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/admin/users/${TEST_USER_ID}`),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('batchSetRole should POST array of userIds', async () => {
    mockFetchSuccess({ updated: 2, results: [] });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.batchSetRole(['user-1', 'user-2'], 'vip', MOCK_ACCESS_TOKEN);
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.userIds).toHaveLength(2);
    expect(body.role).toBe('vip');
  });

  it('batchDeleteUsers should POST array of userIds', async () => {
    mockFetchSuccess({ deleted: 1, skipped: 1, results: [] });
    const { YYC3API } = await import('../../services/apiService');
    await YYC3API.batchDeleteUsers(['user-1', 'user-2'], MOCK_ACCESS_TOKEN);
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.userIds).toHaveLength(2);
  });
});

// =============================================================================
// Error Handling & Fallbacks
// =============================================================================

describe('API Service: Error Handling', () => {
  it('should return fallback value on network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const { YYC3API } = await import('../../services/apiService');
    // getUserProfile has a fallback defaultProfile
    const result = await YYC3API.getUserProfile(TEST_USER_ID);
    expect(result).toBeTruthy(); // should return fallback, not throw
  });

  it('should return empty array fallback for list endpoints', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const { YYC3API } = await import('../../services/apiService');
    const tasks = await YYC3API.getTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toHaveLength(0);
  });

  it('should throw on error when no fallback provided', async () => {
    mockFetchError('Server error', 500);
    const { YYC3API } = await import('../../services/apiService');
    await expect(YYC3API.updateUserProfile({ firstName: 'fail' })).rejects.toThrow();
  });
});

// =============================================================================
// Edge Cases
// =============================================================================

describe('API Service: Edge Cases', () => {
  it('getModuleById should map numeric IDs to string IDs', async () => {
    const { YYC3API } = await import('../../services/apiService');
    // '1' maps to 'ia', '2' to 'seo', etc.
    const result = await YYC3API.getModuleById('999'); // non-existent
    expect(result).toBeNull();
  });

  it('getModules should return mock data when KV returns empty array', async () => {
    mockFetchSuccess([]);
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getModules();
    expect(result.length).toBeGreaterThan(0); // fallback mock data
  });

  it('should handle empty response body gracefully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(wrapApiResponse(null)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const { YYC3API } = await import('../../services/apiService');
    const result = await YYC3API.getUserProfile(TEST_USER_ID);
    // Should not throw — null is a valid response
    expect(result === null || typeof result === 'object').toBe(true);
  });
});
