// =============================================================================
// YYC3-Learning-Platform — Test Setup & Shared Mock Factories
// =============================================================================
// Provides reusable mock data, factory functions, and test helpers.
// Import from this file in every test suite for consistency.
// =============================================================================

import type {
  UserProfile,
  UserSettings,
  ModuleProgress,
  DashboardStats,
  Achievement,
  ModuleCardData,
  Task,
  Post,
  PostComment,
  Certificate,
  VideoProgress,
  SaleRecord,
  SalesKPI,
  FeedbackEntry,
  RoadmapData,
  SprintPhase,
  LiveSession,
  Lesson,
  UserRole,
  Breakpoint,
} from '../types';

// =============================================================================
// Constants
// =============================================================================

export const TEST_USER_ID = 'test-user-001';
export const TEST_ADMIN_ID = 'test-admin-001';
export const TEST_MODULE_ID = 'mod-001';
export const TEST_LESSON_ID = 'lesson-001';
export const TEST_POST_ID = 'post-001';
export const MOCK_ACCESS_TOKEN = 'mock-access-token-abc123';
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token-xyz789';

// =============================================================================
// Factory Functions — User Domain
// =============================================================================

export function createMockUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: TEST_USER_ID,
    firstName: '测试',
    lastName: '用户',
    email: 'test@yyc3.com',
    avatar: '/avatars/default.png',
    bio: '测试用户简介',
    location: '中国，北京',
    role: 'user',
    membershipTier: 'free',
    completionPercentage: 45,
    unlockedModules: 3,
    totalModules: 12,
    streakDays: 5,
    certificatesCount: 1,
    joinedAt: '2025-01-01T00:00:00.000Z',
    lastActiveAt: '2026-02-25T10:00:00.000Z',
    ...overrides,
  };
}

export function createMockAdminProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return createMockUserProfile({
    id: TEST_ADMIN_ID,
    firstName: '管理员',
    lastName: '',
    email: 'admin@yyc3.com',
    role: 'admin',
    membershipTier: 'platinum',
    ...overrides,
  });
}

export function createMockUserSettings(overrides: Partial<UserSettings> = {}): UserSettings {
  return {
    userId: TEST_USER_ID,
    language: 'zh',
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    theme: 'dark',
    dailyGoalMinutes: 30,
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Module & Lesson Domain
// =============================================================================

export function createMockModuleProgress(overrides: Partial<ModuleProgress> = {}): ModuleProgress {
  return {
    moduleId: TEST_MODULE_ID,
    userId: TEST_USER_ID,
    status: 'in-progress',
    completedLessons: ['lesson-001'],
    totalLessons: 10,
    progressPercent: 10,
    lastAccessedAt: '2026-02-25T10:00:00.000Z',
    timeSpentMinutes: 120,
    score: 85,
    notes: '学习笔记',
    ...overrides,
  };
}

export function createMockModuleCard(overrides: Partial<ModuleCardData> = {}): ModuleCardData {
  return {
    id: TEST_MODULE_ID,
    title: '测试课程模块',
    subtitle: '测试子标题',
    category: 'ia',
    level: '高级',
    status: 'unlocked',
    price: 250,
    lessonsCount: 10,
    duration: '5h 30min',
    thumbnail: '/thumbnails/test.png',
    progress: 45,
    ...overrides,
  };
}

export function createMockLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: TEST_LESSON_ID,
    title: '测试课时',
    duration: '25min',
    isCompleted: false,
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Community Domain
// =============================================================================

export function createMockPost(overrides: Partial<Post> = {}): Post {
  return {
    id: TEST_POST_ID,
    user: '测试用户',
    avatar: '/avatars/default.png',
    content: '测试帖子内容',
    time: '2小时前',
    likes: 5,
    comments: 2,
    tags: ['测试'],
    ...overrides,
  };
}

export function createMockComment(overrides: Partial<PostComment> = {}): PostComment {
  return {
    id: 'cmt-001',
    postId: TEST_POST_ID,
    userId: TEST_USER_ID,
    userName: '测试用户',
    userAvatar: '/avatars/default.png',
    userRole: 'user',
    content: '测试评论内容',
    createdAt: '2026-02-25T10:00:00.000Z',
    likes: 0,
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Task Domain
// =============================================================================

export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-001',
    title: '测试任务',
    priority: 'P1',
    status: 'todo',
    assignee: '张伟',
    dueDate: '明日',
    tags: ['测试'],
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Phase 2 Domain
// =============================================================================

export function createMockCertificate(overrides: Partial<Certificate> = {}): Certificate {
  return {
    id: 'cert-001',
    userId: TEST_USER_ID,
    moduleId: TEST_MODULE_ID,
    moduleTitle: '人工智能高级营销',
    category: 'ia',
    earnedAt: '2026-02-25T10:00:00.000Z',
    validUntil: '2027-02-25T10:00:00.000Z',
    credentialId: 'YYC3-2026-001',
    skills: ['AI营销', '数据分析'],
    issuer: 'YYC3 Academy',
    recipientName: '测试用户',
    score: 92,
    ...overrides,
  };
}

export function createMockVideoProgress(overrides: Partial<VideoProgress> = {}): VideoProgress {
  return {
    lessonId: TEST_LESSON_ID,
    moduleId: TEST_MODULE_ID,
    userId: TEST_USER_ID,
    currentTime: 120,
    duration: 600,
    percentWatched: 20,
    completed: false,
    lastWatchedAt: '2026-02-25T10:00:00.000Z',
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Sales Domain
// =============================================================================

export function createMockSaleRecord(overrides: Partial<SaleRecord> = {}): SaleRecord {
  return {
    id: 'sale-001',
    client: '张三',
    email: 'zhangsan@test.com',
    avatar: '/avatars/default.png',
    module: '人工智能高级营销',
    price: 2500,
    date: '2026-02-25',
    time: '14:32',
    paymentMethod: '支付宝',
    status: 'completed',
    source: '自然搜索',
    transactionId: 'TXN_TEST_001',
    ...overrides,
  };
}

export function createMockSalesKPI(overrides: Partial<SalesKPI> = {}): SalesKPI {
  return {
    totalRevenue: 100000,
    monthlyRevenue: 25000,
    totalSales: 50,
    conversionRate: 8.5,
    avgOrderValue: 2000,
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Dashboard & Stats
// =============================================================================

export function createMockDashboardStats(overrides: Partial<DashboardStats> = {}): DashboardStats {
  return {
    activeUsers: 1847,
    totalCourses: 32,
    completionRate: 78,
    revenue: 125400,
    weeklyGrowth: 12.5,
    avgSessionMinutes: 42,
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Achievement
// =============================================================================

export function createMockAchievement(overrides: Partial<Achievement> = {}): Achievement {
  return {
    id: 'ach-001',
    name: '首次登录',
    description: '完成首次平台登录',
    icon: 'star',
    earnedAt: '2026-02-25T10:00:00.000Z',
    category: 'learning',
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Feedback
// =============================================================================

export function createMockFeedback(overrides: Partial<FeedbackEntry> = {}): FeedbackEntry {
  return {
    id: 'fb-001',
    type: 'beta_feedback',
    message: '平台体验很好',
    rating: 5,
    userId: TEST_USER_ID,
    createdAt: '2026-02-25T10:00:00.000Z',
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Roadmap
// =============================================================================

export function createMockSprintPhase(overrides: Partial<SprintPhase> = {}): SprintPhase {
  return {
    phaseId: 'phase-1',
    version: 'v2.0',
    title: '基础加固',
    status: 'completed',
    progress: 100,
    tasks: [
      { id: 'task-1', title: '技术债修复', status: 'completed', completedAt: '2026-01-15' },
    ],
    startedAt: '2026-01-01',
    completedAt: '2026-02-01',
    updatedAt: '2026-02-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockRoadmapData(overrides: Partial<RoadmapData> = {}): RoadmapData {
  return {
    phases: [createMockSprintPhase()],
    lastUpdated: '2026-02-25T10:00:00.000Z',
    version: 'v2.6.0',
    ...overrides,
  };
}

// =============================================================================
// Factory Functions — Live Session
// =============================================================================

export function createMockLiveSession(overrides: Partial<LiveSession> = {}): LiveSession {
  return {
    id: 'live-001',
    title: '测试直播',
    description: '测试直播描述',
    zoomUrl: 'https://zoom.us/test',
    startDate: '2026-03-01T10:00:00.000Z',
    duration: 60,
    isActive: false,
    maxParticipants: 100,
    instructor: '张老师',
    ...overrides,
  };
}

// =============================================================================
// API Response Helpers
// =============================================================================

export function wrapApiResponse<T>(data: T, success = true) {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function wrapApiError(error: string, status = 500) {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

// =============================================================================
// Fetch Mock Helper
// =============================================================================

/**
 * Creates a mock fetch function that resolves/rejects based on provided config.
 * Use in jest.spyOn(global, 'fetch').mockImplementation(createMockFetch(...))
 */
export function createMockFetch(responses: Array<{
  url?: string | RegExp;
  status?: number;
  body?: unknown;
  error?: Error;
}>) {
  let callIndex = 0;
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    const matchedResponse = responses.find((r, i) => {
      if (r.url instanceof RegExp) return r.url.test(url);
      if (typeof r.url === 'string') return url.includes(r.url);
      return i === callIndex;
    }) || responses[callIndex] || responses[responses.length - 1];

    callIndex++;

    if (matchedResponse?.error) {
      throw matchedResponse.error;
    }

    const status = matchedResponse?.status ?? 200;
    const body = matchedResponse?.body ?? {};

    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
}

// =============================================================================
// Window / DOM Mocks
// =============================================================================

export function mockWindowResize(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

export function createMockResizeObserver() {
  const instances: Array<{ callback: ResizeObserverCallback; targets: Element[] }> = [];

  class MockResizeObserver implements ResizeObserver {
    private callback: ResizeObserverCallback;
    private targets: Element[] = [];

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      instances.push({ callback, targets: this.targets });
    }

    observe(target: Element) {
      this.targets.push(target);
    }

    unobserve(_target: Element) {
      this.targets = this.targets.filter(t => t !== _target);
    }

    disconnect() {
      this.targets = [];
    }
  }

  return { MockResizeObserver, instances };
}

// =============================================================================
// localStorage Mock
// =============================================================================

export function createMockLocalStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}
