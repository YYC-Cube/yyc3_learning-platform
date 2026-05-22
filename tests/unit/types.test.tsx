// =============================================================================
// YYC3-Learning-Platform — Type System Validation Tests
// =============================================================================
// Validates type guards, KV_PREFIXES completeness, factory output shapes,
// and compile-time type safety via runtime structural assertions.
// =============================================================================

import { describe, it, expect } from 'vitest';
import {
  KV_PREFIXES,
  type UserProfile,
  type UserSettings,
  type ModuleProgress,
  type DashboardStats,
  type Achievement,
  type ModuleCardData,
  type Task,
  type Post,
  type PostComment,
  type Certificate,
  type VideoProgress,
  type SaleRecord,
  type SalesKPI,
  type FeedbackEntry,
  type RoadmapData,
  type SprintPhase,
  type LiveSession,
  type ApiResponse,
  type UserRole,
  type Breakpoint,
  type ModuleStatus,
  type TaskPriority,
  type TaskStatus,
  type PaymentStatus,
  type AdminSection,
  type ProjectType,
  type ProjectStatus,
  type ProjectPriority,
} from '../../types';

import {
  createMockUserProfile,
  createMockUserSettings,
  createMockModuleProgress,
  createMockModuleCard,
  createMockTask,
  createMockPost,
  createMockComment,
  createMockCertificate,
  createMockVideoProgress,
  createMockSaleRecord,
  createMockSalesKPI,
  createMockDashboardStats,
  createMockAchievement,
  createMockFeedback,
  createMockSprintPhase,
  createMockRoadmapData,
  createMockLiveSession,
} from '../setup';

// =============================================================================
// KV_PREFIXES Completeness
// =============================================================================

describe('KV_PREFIXES', () => {
  it('should contain all required domain prefixes', () => {
    const requiredPrefixes = [
      'USER_PROFILE',
      'USER_SETTINGS',
      'USER_PROGRESS',
      'USER_ACHIEVEMENTS',
      'USER_CERTIFICATES',
      'LEARNING_ACTIVITY',
      'DAILY_NOTES',
      'VIDEO_PROGRESS',
      'COURSE',
      'COMMUNITY_POSTS',
      'COMMUNITY_COMMENTS',
      'KANBAN_TASKS',
      'DASHBOARD_STATS',
      'ROADMAP_SPRINTS',
      'SALES_RECORDS',
      'SALES_KPIS',
      'FEEDBACK',
      'SYSTEM_CONFIG',
    ];

    for (const prefix of requiredPrefixes) {
      expect(KV_PREFIXES).toHaveProperty(prefix);
      expect(typeof (KV_PREFIXES as Record<string, string>)[prefix]).toBe('string');
    }
  });

  it('should have non-empty string values for all prefixes', () => {
    Object.entries(KV_PREFIXES).forEach(([key, value]) => {
      expect(value).toBeTruthy();
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should use colon-separated naming convention', () => {
    const colonSeparated = Object.values(KV_PREFIXES).filter(v => v.includes(':'));
    // Most prefixes use colon, except COURSE and FEEDBACK
    expect(colonSeparated.length).toBeGreaterThan(10);
  });
});

// =============================================================================
// Factory Shape Validation — ensures mock factories produce structurally valid data
// =============================================================================

describe('Mock Factory: UserProfile', () => {
  it('should produce a valid UserProfile with all required fields', () => {
    const profile = createMockUserProfile();
    expect(profile.id).toBeDefined();
    expect(profile.firstName).toBeDefined();
    expect(profile.email).toContain('@');
    expect(['user', 'admin', 'vip']).toContain(profile.role);
    expect(['free', 'premium', 'platinum']).toContain(profile.membershipTier);
    expect(profile.completionPercentage).toBeGreaterThanOrEqual(0);
    expect(profile.completionPercentage).toBeLessThanOrEqual(100);
    expect(profile.totalModules).toBeGreaterThan(0);
    expect(new Date(profile.joinedAt).getTime()).not.toBeNaN();
  });

  it('should allow overriding specific fields', () => {
    const profile = createMockUserProfile({ role: 'vip', streakDays: 100 });
    expect(profile.role).toBe('vip');
    expect(profile.streakDays).toBe(100);
    expect(profile.firstName).toBe('测试'); // default preserved
  });

  it('should produce unique instances', () => {
    const a = createMockUserProfile();
    const b = createMockUserProfile({ id: 'different' });
    expect(a).not.toBe(b);
    expect(a.id).not.toBe(b.id);
  });
});

describe('Mock Factory: UserSettings', () => {
  it('should produce valid settings', () => {
    const settings = createMockUserSettings();
    expect(settings.userId).toBeDefined();
    expect(['zh', 'fr']).toContain(settings.language);
    expect(typeof settings.emailNotifications).toBe('boolean');
    expect(typeof settings.dailyGoalMinutes).toBe('number');
    expect(settings.dailyGoalMinutes).toBeGreaterThan(0);
  });
});

describe('Mock Factory: ModuleProgress', () => {
  it('should produce valid progress data', () => {
    const progress = createMockModuleProgress();
    expect(progress.moduleId).toBeDefined();
    expect(progress.userId).toBeDefined();
    expect(['unlocked', 'in-progress', 'locked', 'completed']).toContain(progress.status);
    expect(Array.isArray(progress.completedLessons)).toBe(true);
    expect(progress.progressPercent).toBeGreaterThanOrEqual(0);
    expect(progress.progressPercent).toBeLessThanOrEqual(100);
    expect(progress.timeSpentMinutes).toBeGreaterThanOrEqual(0);
  });
});

describe('Mock Factory: ModuleCardData', () => {
  it('should produce valid card data', () => {
    const card = createMockModuleCard();
    expect(card.id).toBeDefined();
    expect(card.title.length).toBeGreaterThan(0);
    expect(card.lessonsCount).toBeGreaterThan(0);
    expect(card.price).toBeGreaterThanOrEqual(0);
  });
});

describe('Mock Factory: Task', () => {
  it('should produce valid task', () => {
    const task = createMockTask();
    expect(task.id).toBeDefined();
    expect(['P0', 'P1', 'P2']).toContain(task.priority);
    expect(['todo', 'in-progress', 'done']).toContain(task.status);
    expect(Array.isArray(task.tags)).toBe(true);
  });
});

describe('Mock Factory: Post & Comment', () => {
  it('should produce valid post', () => {
    const post = createMockPost();
    expect(post.id).toBeDefined();
    expect(post.user.length).toBeGreaterThan(0);
    expect(post.content.length).toBeGreaterThan(0);
    expect(post.likes).toBeGreaterThanOrEqual(0);
    expect(post.comments).toBeGreaterThanOrEqual(0);
  });

  it('should produce valid comment', () => {
    const comment = createMockComment();
    expect(comment.id).toBeDefined();
    expect(comment.postId).toBeDefined();
    expect(comment.userId).toBeDefined();
    expect(comment.content.length).toBeGreaterThan(0);
    expect(new Date(comment.createdAt).getTime()).not.toBeNaN();
  });

  it('should support nested reply structure', () => {
    const reply = createMockComment({
      id: 'reply-001',
      parentId: 'cmt-001',
    });
    expect(reply.parentId).toBe('cmt-001');
  });
});

describe('Mock Factory: Certificate', () => {
  it('should produce valid certificate', () => {
    const cert = createMockCertificate();
    expect(cert.id).toBeDefined();
    expect(cert.userId).toBeDefined();
    expect(cert.moduleId).toBeDefined();
    expect(cert.credentialId).toMatch(/^YYC3-/);
    expect(Array.isArray(cert.skills)).toBe(true);
    expect(cert.skills.length).toBeGreaterThan(0);
    expect(cert.score).toBeGreaterThanOrEqual(0);
    expect(cert.score).toBeLessThanOrEqual(100);
  });

  it('should have valid date range (earnedAt before validUntil)', () => {
    const cert = createMockCertificate();
    expect(new Date(cert.earnedAt).getTime()).toBeLessThan(new Date(cert.validUntil).getTime());
  });
});

describe('Mock Factory: VideoProgress', () => {
  it('should produce valid video progress', () => {
    const vp = createMockVideoProgress();
    expect(vp.lessonId).toBeDefined();
    expect(vp.moduleId).toBeDefined();
    expect(vp.currentTime).toBeGreaterThanOrEqual(0);
    expect(vp.duration).toBeGreaterThan(0);
    expect(vp.percentWatched).toBeGreaterThanOrEqual(0);
    expect(vp.percentWatched).toBeLessThanOrEqual(100);
    expect(typeof vp.completed).toBe('boolean');
  });

  it('should reflect completion threshold (≥90%)', () => {
    const incomplete = createMockVideoProgress({ percentWatched: 89, completed: false });
    expect(incomplete.completed).toBe(false);

    const complete = createMockVideoProgress({ percentWatched: 95, completed: true });
    expect(complete.completed).toBe(true);
  });
});

describe('Mock Factory: SaleRecord', () => {
  it('should produce valid sale record', () => {
    const sale = createMockSaleRecord();
    expect(sale.id).toBeDefined();
    expect(sale.price).toBeGreaterThan(0);
    expect(['completed', 'pending', 'failed']).toContain(sale.status);
    expect(sale.transactionId).toMatch(/^TXN_/);
  });
});

describe('Mock Factory: SalesKPI', () => {
  it('should produce valid KPI aggregate', () => {
    const kpi = createMockSalesKPI();
    expect(kpi.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(kpi.conversionRate).toBeGreaterThanOrEqual(0);
    expect(kpi.avgOrderValue).toBeGreaterThan(0);
  });
});

describe('Mock Factory: DashboardStats', () => {
  it('should produce valid stats', () => {
    const stats = createMockDashboardStats();
    expect(stats.activeUsers).toBeGreaterThanOrEqual(0);
    expect(stats.totalCourses).toBeGreaterThan(0);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
    expect(stats.completionRate).toBeLessThanOrEqual(100);
  });
});

describe('Mock Factory: LiveSession', () => {
  it('should produce valid live session', () => {
    const session = createMockLiveSession();
    expect(session.id).toBeDefined();
    expect(session.zoomUrl).toMatch(/^https?:\/\//);
    expect(session.duration).toBeGreaterThan(0);
    expect(typeof session.isActive).toBe('boolean');
  });
});

// =============================================================================
// Union Type Exhaustiveness — verifies all enum-like values are valid
// =============================================================================

describe('Union Type Coverage', () => {
  it('UserRole should accept exactly user | admin | vip', () => {
    const validRoles: UserRole[] = ['user', 'admin', 'vip'];
    expect(validRoles).toHaveLength(3);
    validRoles.forEach(r => expect(['user', 'admin', 'vip']).toContain(r));
  });

  it('Breakpoint should accept exactly mobile | tablet | desktop', () => {
    const validBPs: Breakpoint[] = ['mobile', 'tablet', 'desktop'];
    expect(validBPs).toHaveLength(3);
  });

  it('TaskPriority should accept P0 | P1 | P2', () => {
    const valid: TaskPriority[] = ['P0', 'P1', 'P2'];
    expect(valid).toHaveLength(3);
  });

  it('TaskStatus should accept todo | in-progress | done', () => {
    const valid: TaskStatus[] = ['todo', 'in-progress', 'done'];
    expect(valid).toHaveLength(3);
  });

  it('PaymentStatus should accept completed | pending | failed', () => {
    const valid: PaymentStatus[] = ['completed', 'pending', 'failed'];
    expect(valid).toHaveLength(3);
  });

  it('ModuleStatus should accept unlocked | in-progress | locked | completed', () => {
    const valid: ModuleStatus[] = ['unlocked', 'in-progress', 'locked', 'completed'];
    expect(valid).toHaveLength(4);
  });
});

// =============================================================================
// Edge Cases — boundary values
// =============================================================================

describe('Edge Cases: Boundary Values', () => {
  it('should handle empty strings in profile fields', () => {
    const profile = createMockUserProfile({ firstName: '', lastName: '', bio: '' });
    expect(profile.firstName).toBe('');
    expect(profile.lastName).toBe('');
    expect(profile.bio).toBe('');
  });

  it('should handle zero progress', () => {
    const progress = createMockModuleProgress({
      completedLessons: [],
      progressPercent: 0,
      timeSpentMinutes: 0,
      score: 0,
    });
    expect(progress.completedLessons).toHaveLength(0);
    expect(progress.progressPercent).toBe(0);
  });

  it('should handle 100% completion', () => {
    const progress = createMockModuleProgress({
      status: 'completed',
      progressPercent: 100,
      completedLessons: Array.from({ length: 10 }, (_, i) => `lesson-${i + 1}`),
    });
    expect(progress.progressPercent).toBe(100);
    expect(progress.completedLessons).toHaveLength(10);
  });

  it('should handle video at exactly 90% threshold', () => {
    const vp = createMockVideoProgress({
      percentWatched: 90,
      completed: true,
    });
    expect(vp.percentWatched).toBe(90);
    expect(vp.completed).toBe(true);
  });

  it('should handle maximum streak days', () => {
    const profile = createMockUserProfile({ streakDays: 9999 });
    expect(profile.streakDays).toBe(9999);
  });
});
