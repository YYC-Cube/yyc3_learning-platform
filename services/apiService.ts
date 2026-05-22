// =============================================================================
// YYC3-Learning-Platform — Unified API Service
// =============================================================================
// Type-safe API client for all server endpoints.
// Handles fallback to mock data when backend is unavailable.
// =============================================================================

import { detailedModules, updatedMockModules } from '../data/modulesData';
import type {
  AIChatRequest,
  AIChatResponse,
  AIConfigResponse,
  AIProvider,
  AIUserSettings,
  Achievement,
  Certificate,
  DashboardStats,
  DataExport,
  FeedbackEntry,
  FeedbackPayload,
  ModuleCardData,
  ModuleProgress,
  Post,
  PostComment,
  RoadmapData,
  SaleRecord,
  SalesKPI,
  SeedPayload,
  SprintPhase,
  Task,
  UserProfile,
  UserRole,
  UserSettings,
  VideoProgress,
} from '../types';

// Default avatar asset for CHINA YANYU (言语)
const defaultAvatarAsset = '/yyc3-dist/yanyu_cloud_64x64.png';

// Re-export the default avatar asset so other components can use it as fallback
export { defaultAvatarAsset };

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = typeof window !== 'undefined'
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api')
  : 'http://localhost:3001/api';

const headers = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('yyc3_access_token') : null;
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

// ---------------------------------------------------------------------------
// Token refresh state (singleton, prevents concurrent refresh races)
// ---------------------------------------------------------------------------

const STORAGE_KEY_TOKEN = 'yyc3_access_token';
const STORAGE_KEY_REFRESH = 'yyc3_refresh_token';

let _isRefreshing = false;
let _refreshPromise: Promise<string | null> | null = null;

// ---------------------------------------------------------------------------
// Auth-expired callback (allows AuthContext to register its logout handler)
// ---------------------------------------------------------------------------

type AuthExpiredHandler = () => void;
let _authExpiredHandler: AuthExpiredHandler | null = null;

/**
 * Register a callback that will be invoked when a 401 response cannot be
 * recovered by token refresh. Typically, AuthContext registers its `logout`.
 */
export function registerAuthExpiredHandler(handler: AuthExpiredHandler): void {
  _authExpiredHandler = handler;
}

/**
 * Unregister the auth-expired callback (cleanup on unmount).
 */
export function unregisterAuthExpiredHandler(): void {
  _authExpiredHandler = null;
}

/**
 * Attempt to exchange the stored refresh token for a new access token.
 * Deduplicates concurrent callers — only one network request is in-flight.
 */
function attemptTokenRefresh(): Promise<string | null> {
  if (_isRefreshing && _refreshPromise) return _refreshPromise;

  _isRefreshing = true;
  _refreshPromise = (async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH);
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;

      const json = await res.json();
      if (json?.success && json.data) {
        localStorage.setItem(STORAGE_KEY_TOKEN, json.data.accessToken);
        if (json.data.refreshToken) {
          localStorage.setItem(STORAGE_KEY_REFRESH, json.data.refreshToken);
        }
        return json.data.accessToken as string;
      }
      return null;
    } catch (err) {
      console.warn('[API] Token refresh attempt failed:', err);
      return null;
    } finally {
      _isRefreshing = false;
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Generic fetch wrapper with consistent error handling.
 * Unwraps the `{ success, data, error }` envelope when present.
 * On 401 responses, automatically attempts token refresh + one retry.
 */
async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  fallback?: T,
): Promise<T> {
  const doFetch = async (overrideHeaders?: Record<string, string>): Promise<T> => {
    const mergedHeaders = {
      ...headers(),
      ...(options?.headers as Record<string, string>),
      ...overrideHeaders,
    };

    const res = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[API ${res.status}] ${url}: ${errorText}`);
      // Return status so caller can decide whether to retry
      const err = new Error(`API request failed: ${res.status} ${errorText}`);
      (err as ApiError).status = res.status;
      throw err;
    }

    const json = await res.json();

    // If the server returns our standard envelope, unwrap it
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      if (!json.success && json.error) {
        console.error(`[API Error] ${url}: ${json.error}`);
        if (fallback !== undefined) return fallback;
        throw new Error(json.error);
      }
      return json.data as T;
    }

    // Legacy endpoints may return raw data
    return json as T;
  };

  try {
    return await doFetch();
  } catch (err) {
    const apiErr = err as ApiError;

    // 401 → try refresh once (skip for the refresh endpoint itself to avoid loops)
    if (apiErr.status === 401 && !url.includes('/auth/refresh')) {
      const newToken = await attemptTokenRefresh();
      if (newToken) {
        console.log('[API] Retrying request after token refresh:', url);
        try {
          return await doFetch({ Authorization: `Bearer ${newToken}` });
        } catch (retryErr) {
          console.error('[API] Retry after refresh also failed:', retryErr);
          // Retry also failed — session is truly dead
          if (_authExpiredHandler) {
            console.log('[API] Invoking auth-expired handler (retry failed)');
            _authExpiredHandler();
          }
          if (fallback !== undefined) return fallback;
          throw retryErr;
        }
      } else {
        // Refresh token itself is invalid/expired — force logout
        console.warn('[API] Token refresh returned null — session expired');
        if (_authExpiredHandler) {
          console.log('[API] Invoking auth-expired handler (refresh returned null)');
          _authExpiredHandler();
        }
      }
    }

    if (fallback !== undefined) return fallback;
    throw err;
  }
}

/** Internal error subtype to carry HTTP status */
interface ApiError extends Error {
  status?: number;
}

// ---------------------------------------------------------------------------
// Default data factories (match server defaults for consistent fallback)
// ---------------------------------------------------------------------------

const defaultProfile: UserProfile = {
  id: 'default',
  firstName: '言语',
  lastName: '',
  email: 'yanyu@yyc3.com',
  avatar: defaultAvatarAsset,
  bio: '专注于 SaaS 产品架构与增长策略。YYC3 2026 首席增长官训练营成员。',
  location: '中国，上海',
  role: 'user',
  membershipTier: 'platinum',
  completionPercentage: 68,
  unlockedModules: 5,
  totalModules: 12,
  streakDays: 12,
  certificatesCount: 5,
  joinedAt: '2025-09-15T00:00:00.000Z',
  lastActiveAt: new Date().toISOString(),
};

const defaultStats: DashboardStats = {
  activeUsers: 1847,
  totalCourses: 32,
  completionRate: 78,
  revenue: 125400,
  weeklyGrowth: 12.5,
  avgSessionMinutes: 42,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const YYC3API = {
  // -------------------------------------------------------------------------
  // Health
  // -------------------------------------------------------------------------
  healthCheck: () =>
    apiFetch<{ status: string; version: string }>(`${API_BASE}/health`),

  // -------------------------------------------------------------------------
  // User Profile
  // -------------------------------------------------------------------------
  getUserProfile: (userId = 'default') =>
    apiFetch<UserProfile | null>(
      `${API_BASE}/user/profile?userId=${userId}`,
      undefined,
      defaultProfile,
    ),

  updateUserProfile: (profile: Partial<UserProfile>) =>
    apiFetch<UserProfile>(`${API_BASE}/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  // -------------------------------------------------------------------------
  // User Settings
  // -------------------------------------------------------------------------
  getUserSettings: (userId = 'default') =>
    apiFetch<UserSettings>(`${API_BASE}/user/settings?userId=${userId}`),

  updateUserSettings: (settings: Partial<UserSettings>) =>
    apiFetch<UserSettings>(`${API_BASE}/user/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // -------------------------------------------------------------------------
  // Module Progress
  // -------------------------------------------------------------------------
  getAllProgress: (userId = 'default') =>
    apiFetch<ModuleProgress[]>(
      `${API_BASE}/user/progress?userId=${userId}`,
      undefined,
      [],
    ),

  getModuleProgress: (moduleId: string, userId = 'default') =>
    apiFetch<ModuleProgress | null>(
      `${API_BASE}/user/progress/${moduleId}?userId=${userId}`,
      undefined,
      null,
    ),

  updateModuleProgress: (moduleId: string, data: Partial<ModuleProgress>, userId = 'default') =>
    apiFetch<ModuleProgress>(
      `${API_BASE}/user/progress/${moduleId}?userId=${userId}`,
      { method: 'PUT', body: JSON.stringify(data) },
    ),

  // -------------------------------------------------------------------------
  // Achievements
  // -------------------------------------------------------------------------
  getAchievements: (userId = 'default') =>
    apiFetch<Achievement[]>(
      `${API_BASE}/user/achievements?userId=${userId}`,
      undefined,
      [],
    ),

  awardAchievement: (achievement: Omit<Achievement, 'earnedAt'>, userId = 'default') =>
    apiFetch<Achievement[]>(
      `${API_BASE}/user/achievements?userId=${userId}`,
      { method: 'POST', body: JSON.stringify(achievement) },
    ),

  // -------------------------------------------------------------------------
  // Dashboard Stats
  // -------------------------------------------------------------------------
  getDashboardStats: () =>
    apiFetch<DashboardStats>(`${API_BASE}/stats`, undefined, defaultStats),

  updateDashboardStats: (stats: Partial<DashboardStats>) =>
    apiFetch<DashboardStats>(`${API_BASE}/stats`, {
      method: 'PUT',
      body: JSON.stringify(stats),
    }),

  // -------------------------------------------------------------------------
  // Courses
  // -------------------------------------------------------------------------
  getModules: async (): Promise<ModuleCardData[]> => {
    const data = await apiFetch<ModuleCardData[]>(
      `${API_BASE}/courses`,
      undefined,
      [],
    );
    // If KV is empty, return client-side mock modules
    return data.length > 0 ? data : updatedMockModules;
  },

  getModuleById: async (id: string) => {
    const idMap: Record<string, string> = {
      '1': 'ia', '2': 'seo', '3': 'ecommerce', '4': 'copywriting',
      '5': 'branding', '6': 'analytics', '7': 'ads',
    };
    const targetId = idMap[id] || id;
    return detailedModules.find(m => m.id === targetId) || null;
  },

  saveCourses: (courses: ModuleCardData[]) =>
    apiFetch<void>(`${API_BASE}/courses`, {
      method: 'POST',
      body: JSON.stringify(courses),
    }),

  // -------------------------------------------------------------------------
  // Kanban Tasks
  // -------------------------------------------------------------------------
  getTasks: () =>
    apiFetch<Task[]>(`${API_BASE}/tasks`, undefined, []),

  saveTasks: (tasks: Task[]) =>
    apiFetch<void>(`${API_BASE}/tasks`, {
      method: 'POST',
      body: JSON.stringify(tasks),
    }),

  // -------------------------------------------------------------------------
  // Community Posts
  // -------------------------------------------------------------------------
  getPosts: () =>
    apiFetch<Post[]>(`${API_BASE}/posts`, undefined, []),

  savePosts: (posts: Post[]) =>
    apiFetch<void>(`${API_BASE}/posts`, {
      method: 'POST',
      body: JSON.stringify(posts),
    }),

  // -------------------------------------------------------------------------
  // Learning Activity (heatmap)
  // -------------------------------------------------------------------------
  getActivity: (userId = 'default') =>
    apiFetch<Record<string, number>>(
      `${API_BASE}/activity?userId=${userId}`,
      undefined,
      {},
    ),

  recordActivity: (date: string, minutes: number, userId = 'default') =>
    apiFetch<{ totalToday: number }>(`${API_BASE}/activity`, {
      method: 'POST',
      body: JSON.stringify({ date, minutes, userId }),
    }),

  // -------------------------------------------------------------------------
  // Daily Notes (learning journal)
  // -------------------------------------------------------------------------
  getDailyNotes: (userId = 'default') =>
    apiFetch<Record<string, string>>(
      `${API_BASE}/daily-notes?userId=${userId}`,
      undefined,
      {},
    ),

  saveDailyNotes: (notes: Record<string, string>, userId = 'default') =>
    apiFetch<void>(`${API_BASE}/daily-notes`, {
      method: 'POST',
      body: JSON.stringify({ notes, userId }),
    }),

  // -------------------------------------------------------------------------
  // Lesson Notes (per-lesson)
  // -------------------------------------------------------------------------
  getLessonNotes: (lessonId: string) =>
    apiFetch<{ notes: string }>(`${API_BASE}/notes/${lessonId}`, undefined, { notes: '' }),

  saveLessonNotes: (lessonId: string, notes: string) =>
    apiFetch<void>(`${API_BASE}/notes`, {
      method: 'POST',
      body: JSON.stringify({ lessonId, notes }),
    }),

  // -------------------------------------------------------------------------
  // Data Export / Migration
  // -------------------------------------------------------------------------
  exportAllData: (userId = 'default') =>
    apiFetch<DataExport>(`${API_BASE}/export?userId=${userId}`),

  // -------------------------------------------------------------------------
  // Seed / Initialize
  // -------------------------------------------------------------------------
  seed: (payload: SeedPayload) =>
    apiFetch<{ message: string }>(`${API_BASE}/seed`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // -------------------------------------------------------------------------
  // Feedback (P0-001 fix)
  // -------------------------------------------------------------------------
  submitFeedback: (payload: FeedbackPayload) =>
    apiFetch<FeedbackEntry>(`${API_BASE}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getFeedback: (userId = 'default') =>
    apiFetch<FeedbackEntry[]>(
      `${API_BASE}/feedback?userId=${userId}`,
      undefined,
      [],
    ),

  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------
  signUp: (email: string, password: string, name: string) =>
    apiFetch<{ user: { id: string; email: string } }>(`${API_BASE}/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  signIn: (email: string, password: string) =>
    apiFetch<{ user: { id: string; email: string }; accessToken: string | null; refreshToken: string | null }>(
      `${API_BASE}/signin`,
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),

  getAuthUser: (accessToken: string) =>
    apiFetch<{ authUser: { id: string; email: string }; profile: UserProfile }>(
      `${API_BASE}/auth/me`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ),

  resetPassword: (email: string, newPassword: string) =>
    apiFetch<{ message: string }>(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    }),

  refreshToken: (refreshToken: string) =>
    apiFetch<{ accessToken: string; refreshToken: string; expiresAt: number }>(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  // -------------------------------------------------------------------------
  // Admin
  // -------------------------------------------------------------------------
  /** Bootstrap the first admin (one-time, must be authenticated) */
  bootstrapAdmin: (accessToken: string) =>
    apiFetch<{ userId: string; role: string; message: string }>(`${API_BASE}/admin/bootstrap`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** Set a user's role (requires admin auth) */
  setUserRole: (targetUserId: string, role: UserRole, accessToken: string) =>
    apiFetch<{ userId: string; role: string; profile: UserProfile }>(`${API_BASE}/admin/set-role`, {
      method: 'POST',
      body: JSON.stringify({ targetUserId, role }),
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  // -------------------------------------------------------------------------
  // Avatar Upload
  // -------------------------------------------------------------------------
  uploadAvatar: (userId: string, base64Data: string, mimeType: string) =>
    apiFetch<{ avatarUrl: string; profile: UserProfile }>(`${API_BASE}/user/avatar`, {
      method: 'POST',
      body: JSON.stringify({ userId, base64Data, mimeType }),
    }),

  // -------------------------------------------------------------------------
  // Sales (Admin)
  // -------------------------------------------------------------------------
  getSales: () =>
    apiFetch<{ records: SaleRecord[]; kpis: SalesKPI }>(
      `${API_BASE}/sales`,
      undefined,
      { records: [], kpis: { totalRevenue: 0, monthlyRevenue: 0, totalSales: 0, conversionRate: 0, avgOrderValue: 0 } },
    ),

  saveSales: (data: { records?: SaleRecord[]; kpis?: Partial<SalesKPI> }) =>
    apiFetch<void>(`${API_BASE}/sales`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // -------------------------------------------------------------------------
  // Admin: User Management
  // -------------------------------------------------------------------------
  /** List all user profiles (admin-only) */
  listUsers: (accessToken: string) =>
    apiFetch<UserProfile[]>(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }, []),

  /** Delete a user profile (admin-only) */
  deleteUser: (targetUserId: string, accessToken: string) =>
    apiFetch<{ message: string }>(`${API_BASE}/admin/users/${targetUserId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  /** Batch update roles for multiple users (admin-only) */
  batchSetRole: (userIds: string[], role: UserRole, accessToken: string) =>
    apiFetch<{ updated: number; results: Array<{ userId: string; success: boolean }> }>(
      `${API_BASE}/admin/batch-set-role`,
      {
        method: 'POST',
        body: JSON.stringify({ userIds, role }),
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    ),

  /** Batch delete multiple users (admin-only, skips admins + self) */
  batchDeleteUsers: (userIds: string[], accessToken: string) =>
    apiFetch<{ deleted: number; skipped: number; results: Array<{ userId: string; success: boolean; reason?: string }> }>(
      `${API_BASE}/admin/batch-delete`,
      {
        method: 'POST',
        body: JSON.stringify({ userIds }),
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    ),

  // -------------------------------------------------------------------------
  // Sprint / Roadmap Progress Tracking (Route #32-33)
  // -------------------------------------------------------------------------
  /** Get roadmap sprint data from KV */
  getRoadmapData: () =>
    apiFetch<RoadmapData | null>(
      `${API_BASE}/roadmap`,
      undefined,
      null,
    ),

  /** Save/update roadmap sprint data to KV */
  saveRoadmapData: (data: RoadmapData) =>
    apiFetch<RoadmapData>(`${API_BASE}/roadmap`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Update a single phase's progress */
  updatePhaseProgress: (phaseId: string, phase: Partial<SprintPhase>) =>
    apiFetch<SprintPhase>(`${API_BASE}/roadmap/phase/${phaseId}`, {
      method: 'PUT',
      body: JSON.stringify(phase),
    }),

  // -------------------------------------------------------------------------
  // Phase 2: Certificates (Route #35-36)
  // -------------------------------------------------------------------------
  /** Get all certificates for a user */
  getCertificates: (userId = 'default') =>
    apiFetch<Certificate[]>(
      `${API_BASE}/certificates?userId=${userId}`,
      undefined,
      [],
    ),

  /** Award a new certificate */
  awardCertificate: (userId: string, certificate: Certificate) =>
    apiFetch<{ certificate: Certificate; certificates: Certificate[] }>(
      `${API_BASE}/certificates`,
      {
        method: 'POST',
        body: JSON.stringify({ userId, certificate }),
      },
    ),

  // -------------------------------------------------------------------------
  // Phase 2: Video Progress (Route #37-38)
  // -------------------------------------------------------------------------
  /** Get video progress for a specific lesson */
  getVideoProgress: (userId: string, moduleId: string, lessonId: string) =>
    apiFetch<VideoProgress | null>(
      `${API_BASE}/video-progress?userId=${userId}&moduleId=${moduleId}&lessonId=${lessonId}`,
      undefined,
      null,
    ),

  /** Get all video progress for a module */
  getModuleVideoProgress: (userId: string, moduleId: string) =>
    apiFetch<VideoProgress[]>(
      `${API_BASE}/video-progress?userId=${userId}&moduleId=${moduleId}`,
      undefined,
      [],
    ),

  /** Save video playback progress */
  saveVideoProgress: (data: {
    userId: string;
    moduleId: string;
    lessonId: string;
    currentTime: number;
    duration: number;
    percentWatched: number;
    completed: boolean;
  }) =>
    apiFetch<VideoProgress>(`${API_BASE}/video-progress`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // -------------------------------------------------------------------------
  // Phase 2: Community Comments (Route #39-40)
  // -------------------------------------------------------------------------
  /** Get comments for a post */
  getPostComments: (postId: string) =>
    apiFetch<PostComment[]>(
      `${API_BASE}/posts/${postId}/comments`,
      undefined,
      [],
    ),

  /** Add a comment (or reply) to a post */
  addPostComment: (postId: string, comment: Omit<PostComment, 'id' | 'createdAt' | 'likes'>) =>
    apiFetch<PostComment>(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    }),

  // -------------------------------------------------------------------------
  // Phase 3: AI Assistant (Route #41-43)
  // -------------------------------------------------------------------------

  /** Get AI configuration (providers, models, connection status) */
  getAIConfig: (userId?: string) =>
    apiFetch<AIConfigResponse>(
      `${API_BASE}/ai/config${userId ? `?userId=${userId}` : ''}`,
      undefined,
      {
        activeProvider: 'zhipu' as AIProvider,
        providers: [],
        models: [],
        hasEnvKey: false,
      },
    ),

  /** Save AI settings (provider, key, model, system prompt) */
  saveAIConfig: (userId: string, settings: Partial<AIUserSettings>) =>
    apiFetch<AIUserSettings>(`${API_BASE}/ai/config`, {
      method: 'POST',
      body: JSON.stringify({ userId, settings }),
    }),

  /** Send AI chat message (non-streaming) */
  sendAIChat: (request: AIChatRequest & { userId?: string }) =>
    apiFetch<AIChatResponse>(`${API_BASE}/ai/chat`, {
      method: 'POST',
      body: JSON.stringify({ ...request, stream: false }),
    }),

  /**
   * Send AI chat message with SSE streaming.
   * Returns a ReadableStream — caller must read chunks via reader.
   */
  sendAIChatStream: async (
    request: AIChatRequest & { userId?: string },
  ): Promise<Response> => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ ...request, stream: true }),
    });
    return res;
  },
};
