// =============================================================================
// YYC3-Learning-Platform — Unified Type Definitions (v3.0.0)
// =============================================================================
// Complete type system for the entire platform.
// Organized by domain:
//   1. Enums & Union Types
//   2. User Domain
//   3. Module & Lesson Domain
//   4. Kanban / Task Domain
//   5. Community Domain
//   6. Navigation & UI Domain
//   7. Chart / Analytics Domain
//   8. KV Data Persistence Domain
//   9. Admin / Sales Domain
//   10. Feedback Domain
//   11. Sprint / Roadmap Domain
//   12. Phase 2: Certificates, Video, Comments
//   13. Live Session Domain
//   14. Discussion Domain
//   15. Auth Domain
//   16. API Request / Response Types
//   17. Component Props Interfaces
// =============================================================================

import type { LucideIcon } from 'lucide-react';

// =============================================================================
// 1. Enums & Union Types
// =============================================================================

/** User role within the platform */
export type UserRole = 'user' | 'admin' | 'vip';

/** Difficulty level tiers */
export type ModuleLevel = '初级' | '高级' | '专家' | 'Débutant' | 'Confirmé' | 'Expert';

/** Module unlock / progress status */
export type ModuleStatus = 'unlocked' | 'in-progress' | 'locked' | 'completed';

/** Category identifier for modules */
export type ModuleCategory =
  | 'ia'
  | 'seo'
  | 'ecom'
  | 'ads'
  | 'branding'
  | 'copywriting'
  | 'analytics';

/** Task priority tiers */
export type TaskPriority = 'P0' | 'P1' | 'P2';

/** Task status columns */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/** Top-level navigation tab identifiers */
export type NavigationTab =
  | 'dashboard'
  | 'courses'
  | 'kanban'
  | 'community'
  | 'certificates'
  | 'roadmap'
  | 'profile'
  | 'admin'
  | 'module-detail';

/** App view state used by useAppNavigation */
export type AppView =
  | 'dashboard'
  | 'module'
  | 'video'
  | 'certificates'
  | 'services'
  | 'module-page'
  | 'discussion'
  | 'projects'
  | 'profile'
  | 'guide';

/** Responsive breakpoint tiers */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** Supported UI languages */
export type Language = 'zh' | 'fr';

/** Sprint milestone status */
export type SprintStatus = 'completed' | 'active' | 'upcoming' | 'future';

/** Auth gate view state */
export type AuthView = 'login' | 'register' | 'forgot-password';

/** Premium button visual variant */
export type PremiumButtonVariant = 'primary' | 'outline';

/** Skeleton visual variant */
export type SkeletonVariant = 'rect' | 'circle' | 'text';

/** Admin section identifiers */
export type AdminSection =
  | 'dashboard'
  | 'users'
  | 'modules'
  | 'clients'
  | 'sales'
  | 'affiliates'
  | 'projects'
  | 'live'
  | 'support'
  | 'services'
  | 'settings';

/** Project type (admin project management) */
export type ProjectType = 'module' | 'service' | 'creative' | 'landing' | 'tunnel' | 'campaign';

/** Project status (admin project management) */
export type ProjectStatus = 'todo' | 'in-progress' | 'review' | 'completed';

/** Project priority level */
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Live session broadcast status */
export type LiveSessionStatus = 'scheduled' | 'live' | 'ended';

/** Risk probability / impact level */
export type RiskLevel = 'low' | 'medium' | 'high';

/** Payment status */
export type PaymentStatus = 'completed' | 'pending' | 'failed';

/** Membership tier */
export type MembershipTier = 'free' | 'premium' | 'platinum';

/** Theme preference */
export type ThemePreference = 'dark' | 'light' | 'auto';

/** Feedback type */
export type FeedbackType = 'beta_feedback' | 'bug_report' | 'feature_request' | 'general';

/** Achievement category */
export type AchievementCategory = 'learning' | 'community' | 'streak' | 'mastery';

/** Discussion channel category */
export type DiscussionChannelCategory = 'general' | 'module' | 'project';

// =============================================================================
// 2. User Domain
// =============================================================================

/** Core user profile (UI-facing) */
export interface User {
  firstName: string;
  lastName: string;
  avatar: string;
  completionPercentage: number;
  unlockedModules: number;
  totalModules: number;
  role: UserRole;
}

/** Compact user reference for Header and other UI surfaces */
export interface UserSummary {
  firstName: string;
  lastName: string;
  avatar: string;
  role: UserRole;
}

// =============================================================================
// 3. Module & Lesson Domain
// =============================================================================

/** Compact module card representation (listing pages) */
export interface ModuleCardData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: ModuleLevel;
  status: ModuleStatus;
  price: number;
  lessonsCount: number;
  duration: string;
  thumbnail: string;
  isPromoted?: boolean;
  promotedBy?: string;
  progress?: number;
}

/** Lesson within a module */
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

/** Instructor metadata */
export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  experience: string;
}

/** Full module detail (detail page) */
export interface DetailedModule {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  level: ModuleLevel;
  status: ModuleStatus;
  price: number;
  lessonsCount: number;
  duration: string;
  thumbnail: string;
  description: string;
  keyPoints: string[];
  lessons: Lesson[];
  instructor: Instructor;
}

// =============================================================================
// 4. Kanban / Task Domain
// =============================================================================

/** Kanban task */
export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  tags: string[];
}

// =============================================================================
// 5. Community Domain
// =============================================================================

/** Community post */
export interface Post {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  image?: string;
  tags?: string[];
  role?: string;
}

/** Discussion channel (sidebar/navigation) */
export interface Channel {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

// =============================================================================
// 6. Navigation & UI Domain
// =============================================================================

/** Responsive state shape (returned by useResponsive) */
export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  screenWidth: number;
}

/** Single breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
  isSearchKeyword?: boolean;
  isPrediction?: boolean;
}

/** AI-predicted navigation path */
export interface PredictionPath {
  label: string;
  subLabel?: string;
  targetId?: string;
  depth?: number;
}

/** Translation dictionary shape */
export interface TranslationDictionary {
  [langCode: string]: {
    [key: string]: string;
  };
}

/** Language context value */
export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

/** Sidebar menu item */
export interface SidebarMenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

// =============================================================================
// 7. Chart / Analytics Domain
// =============================================================================

/** Radar chart data point */
export interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

/** Time-series activity data point */
export interface ActivityDataPoint {
  name: string;
  value: number;
}

/** Peer comparison data point */
export interface PeerComparisonPoint {
  name: string;
  user: number;
  peer: number;
}

/** Generic stat card */
export interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: string;
}

// =============================================================================
// 8. KV Data Persistence Domain
// =============================================================================

/**
 * KV key prefix convention for the kv_store.
 * All keys follow the pattern: `{prefix}:{identifier}`.
 * Use `getByPrefix` to query all records under a domain.
 */
export const KV_PREFIXES = {
  USER_PROFILE: 'user:profile',
  USER_SETTINGS: 'user:settings',
  USER_PROGRESS: 'user:progress',
  USER_ACHIEVEMENTS: 'user:achievements',
  USER_CERTIFICATES: 'user:certificates',
  LEARNING_ACTIVITY: 'user:activity',
  DAILY_NOTES: 'user:notes',
  VIDEO_PROGRESS: 'video:progress',
  COURSE: 'course',
  COMMUNITY_POSTS: 'community:posts',
  COMMUNITY_COMMENTS: 'community:comments',
  KANBAN_TASKS: 'kanban:tasks',
  DASHBOARD_STATS: 'dashboard:stats',
  ROADMAP_SPRINTS: 'roadmap:sprints',
  SALES_RECORDS: 'sales:records',
  SALES_KPIS: 'sales:kpis',
  FEEDBACK: 'feedback',
  SYSTEM_CONFIG: 'system:config',
} as const;

/** Persisted user profile (superset of UI User) */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  role: UserRole;
  membershipTier: MembershipTier;
  completionPercentage: number;
  unlockedModules: number;
  totalModules: number;
  streakDays: number;
  certificatesCount: number;
  joinedAt: string;
  lastActiveAt: string;
}

/** User preference settings */
export interface UserSettings {
  userId: string;
  language: Language;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  theme: ThemePreference;
  dailyGoalMinutes: number;
}

/** Per-module progress tracking */
export interface ModuleProgress {
  moduleId: string;
  userId: string;
  status: ModuleStatus;
  completedLessons: string[];
  totalLessons: number;
  progressPercent: number;
  lastAccessedAt: string;
  timeSpentMinutes: number;
  score: number;
  notes: string;
}

/** Dashboard aggregate statistics */
export interface DashboardStats {
  activeUsers: number;
  totalCourses: number;
  completionRate: number;
  revenue: number;
  weeklyGrowth: number;
  avgSessionMinutes: number;
}

/** User achievement / badge */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: AchievementCategory;
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

/** Data export payload for migration */
export interface DataExport {
  version: string;
  exportedAt: string;
  platform: string;
  data: {
    userProfile: UserProfile | null;
    userSettings: UserSettings | null;
    moduleProgress: ModuleProgress[];
    achievements: Achievement[];
    learningActivity: Record<string, number>;
    dailyNotes: Record<string, string>;
    communityPosts: Post[];
    kanbanTasks: Task[];
    dashboardStats: DashboardStats | null;
  };
}

/** Seed data payload for initial setup */
export interface SeedPayload {
  userProfile?: Partial<UserProfile>;
  dashboardStats?: Partial<DashboardStats>;
  courses?: ModuleCardData[];
  tasks?: Task[];
  posts?: Post[];
}

// =============================================================================
// 9. Admin / Sales Domain
// =============================================================================

/** Sales transaction record */
export interface SaleRecord {
  id: string;
  client: string;
  email: string;
  avatar: string;
  module: string;
  price: number;
  date: string;
  time: string;
  paymentMethod: string;
  status: PaymentStatus;
  source: string;
  transactionId: string;
}

/** Sales KPI aggregate */
export interface SalesKPI {
  totalRevenue: number;
  monthlyRevenue: number;
  totalSales: number;
  conversionRate: number;
  avgOrderValue: number;
}

/** Admin project */
export interface AdminProject {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  assignedTo: string[];
  deadline: string;
  status: ProjectStatus;
  linkedEntity?: string;
  comments: number;
  progress: number;
  priority: ProjectPriority;
  tags: string[];
  subtasks: ProjectSubtask[];
  attachments: number;
  createdDate: string;
  client?: ProjectClient;
  objectives?: string[];
  timeline?: ProjectTimelineEvent[];
  files?: ProjectFile[];
}

/** Subtask within a project */
export interface ProjectSubtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo: string;
}

/** Project client reference */
export interface ProjectClient {
  name: string;
  email: string;
  avatar: string;
  company?: string;
}

/** Project timeline event */
export interface ProjectTimelineEvent {
  id: string;
  date: string;
  title: string;
  completed: boolean;
  description?: string;
}

/** Project file attachment */
export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

/** Team member (admin project management) */
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

/** Admin role selection option */
export interface RoleOption {
  value: UserRole;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

/** Support ticket KPIs */
export interface SupportKPIs {
  activeTickets: number;
  newTickets: number;
  resolvedToday: number;
  avgResponseTime: number;
  satisfactionRate: number;
  totalTickets: number;
}

/** Affiliate KPIs */
export interface AffiliateKPIs {
  totalAffiliates: number;
  activeAffiliates: number;
  totalClicks: number;
  totalCommissions: number;
  avgCommissionRate: number;
  topAffiliate: { name: string; commissions: number };
}

// =============================================================================
// 10. Feedback Domain
// =============================================================================

/** Beta feedback entry */
export interface FeedbackEntry {
  id: string;
  type: FeedbackType;
  message: string;
  rating?: number;
  userId: string;
  createdAt: string;
}

/** Payload for submitting feedback */
export interface FeedbackPayload {
  type: FeedbackEntry['type'];
  message: string;
  rating?: number;
  userId?: string;
}

/** Props for BetaFeedbackModal component */
export interface BetaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// =============================================================================
// 11. Sprint / Roadmap Domain
// =============================================================================

/** Individual sprint task tracking */
export interface SprintTask {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  completedAt?: string;
}

/** Phase-level sprint data persisted in KV */
export interface SprintPhase {
  phaseId: string;
  version: string;
  title: string;
  status: SprintStatus;
  progress: number;
  tasks: SprintTask[];
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

/** Full roadmap sprint data */
export interface RoadmapData {
  phases: SprintPhase[];
  lastUpdated: string;
  version: string;
}

/** Roadmap page task with full metadata */
export interface RoadmapPhaseTask {
  id: string;
  title: string;
  description: string;
  estimatedDays: number;
  priority: TaskPriority;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  deliverables: string[];
  techStack: string[];
}

/** Roadmap key result metric */
export interface RoadmapKeyResult {
  metric: string;
  target: string;
  unit: string;
}

/** Roadmap phase visual data (used by RoadmapPage) */
export interface RoadmapPhaseData {
  id: string;
  phase: string;
  version: string;
  title: string;
  subtitle: string;
  theme: string;
  period: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  progress: number;
  status: SprintStatus;
  objectives: string[];
  keyResults: RoadmapKeyResult[];
  tasks: RoadmapPhaseTask[];
  expectedOutcomes: string[];
  industryTrend: string;
  riskLevel: RiskLevel;
  estimatedHours: number;
  teamSize: { frontend: number; backend: number; design: number };
}

/** Risk assessment item */
export interface RiskItem {
  risk: string;
  probability: RiskLevel;
  impact: RiskLevel;
  mitigation: string;
  phase: string;
}

/** Industry trend data point */
export interface IndustryTrend {
  trend: string;
  relevance: number;
  adoption: string;
  impact: string;
  icon: React.ElementType;
}

// =============================================================================
// 12. Phase 2: Certificates, Video, Comments
// =============================================================================

/** A single comment on a post */
export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: string;
  replies?: PostComment[];
}

/** Extended Post with comments list */
export interface PostWithComments extends Post {
  commentsList?: PostComment[];
}

/** Earned certificate record */
export interface Certificate {
  id: string;
  userId: string;
  moduleId: string;
  moduleTitle: string;
  category: string;
  earnedAt: string;
  validUntil: string;
  credentialId: string;
  skills: string[];
  issuer: string;
  recipientName: string;
  score: number;
}

/** Video lesson playback progress */
export interface VideoProgress {
  lessonId: string;
  moduleId: string;
  userId: string;
  /** Playback position in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Percent watched (0–100) */
  percentWatched: number;
  /** Whether the lesson is considered completed (>90% watched) */
  completed: boolean;
  lastWatchedAt: string;
}

// =============================================================================
// 13. Live Session Domain
// =============================================================================

/** Base live session (shared across components) */
export interface LiveSession {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  zoomUrl: string;
  embedCode?: string;
  startDate: string;
  duration: number;
  isActive: boolean;
  maxParticipants?: number;
  instructor?: string;
  status?: LiveSessionStatus;
  participants?: number;
  createdAt?: string;
  conversionURL?: string;
  conversionText?: string;
  viewerCount?: number;
  autoPlay?: boolean;
}

/** Live block session (simplified for embed block) */
export interface LiveBlockSession {
  id: string;
  title: string;
  subtitle: string;
  zoomUrl: string;
  embedCode?: string;
  isActive: boolean;
  conversionURL?: string;
  conversionText?: string;
  viewerCount?: number;
  autoPlay?: boolean;
}

// =============================================================================
// 14. Discussion Domain
// =============================================================================

/** Discussion page channel (full detail) */
export interface DiscussionChannel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isLocked: boolean;
  isPremium?: boolean;
  lastActivity: string;
  unreadCount?: number;
  category: DiscussionChannelCategory;
}

/** Discussion message */
export interface DiscussionMessage {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isPinned?: boolean;
}

// =============================================================================
// 15. Auth Domain
// =============================================================================

/** Supabase auth user reference */
export interface AuthUser {
  id: string;
  email: string;
}

/** Internal auth state shape */
export interface AuthState {
  authUser: AuthUser | null;
  userProfile: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}

/** Auth context exposed value */
export interface AuthContextValue extends AuthState {
  userId: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  enterGuestMode: () => void;
  refreshProfile: () => Promise<void>;
}

// =============================================================================
// 16. API Request / Response Types
// =============================================================================

/** Sign-up response */
export interface SignUpResponse {
  user: { id: string; email: string };
}

/** Sign-in response */
export interface SignInResponse {
  user: { id: string; email: string };
  accessToken: string | null;
  refreshToken: string | null;
}

/** Auth/me response */
export interface AuthMeResponse {
  authUser: AuthUser;
  profile: UserProfile;
}

/** Token refresh response */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/** Password reset response */
export interface PasswordResetResponse {
  message: string;
}

/** Admin bootstrap response */
export interface AdminBootstrapResponse {
  userId: string;
  role: string;
  message: string;
}

/** Admin set-role response */
export interface AdminSetRoleResponse {
  userId: string;
  role: string;
  profile: UserProfile;
}

/** Batch set-role response */
export interface BatchSetRoleResponse {
  updated: number;
  results: Array<{ userId: string; success: boolean }>;
}

/** Batch delete response */
export interface BatchDeleteResponse {
  deleted: number;
  skipped: number;
  results: Array<{ userId: string; success: boolean; reason?: string }>;
}

/** Avatar upload response */
export interface AvatarUploadResponse {
  avatarUrl: string;
  profile: UserProfile;
}

/** Sales data response */
export interface SalesDataResponse {
  records: SaleRecord[];
  kpis: SalesKPI;
}

/** Certificate award response */
export interface CertificateAwardResponse {
  certificate: Certificate;
  certificates: Certificate[];
}

/** Activity record response */
export interface ActivityRecordResponse {
  totalToday: number;
}

/** Health check response */
export interface HealthCheckResponse {
  status: string;
  version: string;
  timestamp?: string;
  services?: Record<string, string>;
  routes?: number;
}

/** Lesson notes response */
export interface LessonNotesResponse {
  notes: string;
}

/** Seed response */
export interface SeedResponse {
  message: string;
}

/** Generic delete response */
export interface DeleteResponse {
  message: string;
}

// =============================================================================
// 18. AI Domain (Phase 3 — BigModel Z.AI SDK Integration)
// =============================================================================

/** Supported AI provider identifiers */
export type AIProvider = 'zhipu' | 'openai' | 'ollama' | 'custom';

/** AI provider connection status */
export type AIProviderStatus = 'connected' | 'no_api_key' | 'error' | 'offline';

/** Single chat message in the AI assistant */
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  /** Optional context about which module/lesson the user was viewing */
  context?: AIMessageContext;
  /** Whether the message is still being streamed */
  isStreaming?: boolean;
}

/** Contextual info attached to a user message */
export interface AIMessageContext {
  moduleId?: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  pageSection?: string;
}

/** AI model descriptor */
export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  isFree: boolean;
  maxTokens: number;
  capabilities: AIModelCapability[];
}

/** Model capability flags */
export type AIModelCapability = 'chat' | 'thinking' | 'vision' | 'tool_use' | 'web_search' | 'code';

/** Provider configuration stored per-user in KV */
export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

/** Full AI settings object stored in KV as `ai:config:{userId}` */
export interface AIUserSettings {
  activeProvider: AIProvider;
  providers: Partial<Record<AIProvider, AIProviderConfig>>;
  systemPrompt?: string;
  enableContext?: boolean;
}

/** Server-side AI config response */
export interface AIConfigResponse {
  activeProvider: AIProvider;
  providers: AIProviderInfo[];
  models: AIModel[];
  hasEnvKey: boolean;
}

/** Public provider info (no secrets) */
export interface AIProviderInfo {
  provider: AIProvider;
  status: AIProviderStatus;
  baseUrl: string;
  model: string;
  freeModels: string[];
}

/** SSE chat request payload */
export interface AIChatRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  context?: AIMessageContext;
}

/** Non-streaming chat response */
export interface AIChatResponse {
  id: string;
  content: string;
  model: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/** Offline fallback suggestion (used when no AI key is available) */
export interface AIOfflineSuggestion {
  question: string;
  answer: string;
  category: string;
}

// =============================================================================
// 17. Component Props Interfaces
// =============================================================================

// ── App & Layout ────────────────────────────────────────────────────────────

/** Sidebar navigation props */
export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  closeMobileMenu: () => void;
  isOpen?: boolean;
  isMobile?: boolean;
  onLogout?: () => void;
  userRole?: UserRole;
}

/** Header bar props */
export interface HeaderProps {
  user: UserSummary;
  isMobile: boolean;
  isTablet: boolean;
  isLiveActive?: boolean;
  onSearch: (query: string) => void;
  isGuest?: boolean;
  onLogout?: () => void;
}

/** AdminLayout wrapper props */
export interface AdminLayoutProps {
  adminSection: string;
  onSectionChange: (section: string) => void;
  onBackToUser: () => void;
  isMobile?: boolean;
  breakpoint?: Breakpoint;
}

/** Mobile bottom navigation props */
export interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: UserRole;
}

/** Mobile search modal props */
export interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

/** Breadcrumbs props */
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  predictions?: PredictionPath[];
  onPredictionClick?: (path: PredictionPath) => void;
}

// ── Dashboard & Courses ─────────────────────────────��───────────────────────

/** User dashboard props */
export interface UserDashboardProps {
  activeCategory: string;
  modules: ModuleCardData[];
  onModuleClick: (id: string) => void;
  isMobile: boolean;
  breakpoint: Breakpoint;
}

/** Module card props */
export interface ModuleCardProps {
  module: ModuleCardData;
  onModuleClick: (moduleId: string) => void;
  isMobile?: boolean;
  breakpoint?: Breakpoint;
}

/** Module page (detail) props */
export interface ModulePageProps {
  moduleId: string;
  onBack: () => void;
  onStartLesson: (lessonId: string) => void;
  isMobile?: boolean;
}

/** Module details (inner detail view) props */
export interface ModuleDetailsProps {
  moduleId: string;
  onBack: () => void;
  onLessonStart?: (moduleId: string, lessonId: string) => void;
  isMobile?: boolean;
}

// ── Video & Lesson ──────────────────────────────────────────────────────────

/** Legacy video player props */
export interface VideoPlayerProps {
  moduleId: string;
  lessonId: string;
  onBack: () => void;
  onLessonChange: (lessonId: string) => void;
}

/** Phase 2 lesson player props (HTML5 video with resume/auto-complete) */
export interface LessonPlayerProps {
  moduleId: string;
  lessonId: string;
  onBack: () => void;
  moduleTitle: string;
  lessons: Lesson[];
}

// ── Community & Discussion ──────────────────────────────────────────────────

/** Comment thread props (Phase 2) */
export interface CommentThreadProps {
  postId: string;
  commentCount: number;
  onCommentCountChange: (postId: string, newCount: number) => void;
}

/** Discussion page props */
export interface DiscussionPageProps {
  isMobile?: boolean;
}

// ── Profile ─────────────────────────────────────────────────────────────────

/** Profile page props */
export interface ProfileProps {
  onModuleClick: (id: string) => void;
}

/** Architecture diagram renderer props */
export interface ArchitectureDiagramProps {
  code: string;
}

/** Simple markdown renderer props */
export interface SimpleMarkdownProps {
  text: string;
}

// ── Live ────────────────────────────────────────────────────────────────────

/** Live page props */
export interface LivePageProps {
  liveSession?: LiveSession | null;
  isLiveActive?: boolean;
  isMobile?: boolean;
  breakpoint?: Breakpoint;
}

/** Live zoom player props */
export interface LiveZoomPlayerProps {
  liveSession?: LiveSession | null;
}

/** Live zoom block props */
export interface LiveZoomBlockProps {
  liveSession: LiveBlockSession | null;
  isVisible: boolean;
  isMobile?: boolean;
  breakpoint?: Breakpoint;
}

// ── Member Space ────────────────────────────────────────────────────────────

/** Member space page props */
export interface MemberSpaceProps {
  isMobile?: boolean;
  breakpoint?: Breakpoint;
}

// ── Kanban ───────────────────────────────────────────────────────────────────

/** Kanban card props */
export interface KanbanCardProps {
  task: Task;
  moveCard: (id: string, status: TaskStatus) => void;
  getPriorityStyle: (p: TaskPriority) => string;
}

/** Kanban column props */
export interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  tasks: Task[];
  moveCard: (id: string, status: TaskStatus) => void;
  getPriorityStyle: (p: TaskPriority) => string;
}

// ── Premium ─────────────────────────────────────────────────────────────────

/** Premium button props */
export interface PremiumButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: PremiumButtonVariant;
}

// ── Skeleton & Loading ──────────────────────────────────────────────────────

/** Skeleton loader props */
export interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

/** User dashboard skeleton props */
export interface UserDashboardSkeletonProps {
  isMobile: boolean;
}

// ── Admin Components ────────────────────────────────────────────────────────

/** Admin sidebar props */
export interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBackToUser: () => void;
}

/** Users management props */
export interface UsersManagementProps {
  isMobile?: boolean;
}

/** Project detail modal props */
export interface ModalProjectDetailsExpandedProps {
  project: AdminProject | null;
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
}

/** Search highlight text props */
export interface HighlightedTextProps {
  text: string;
  query: string;
}

/** Virtual scroll list props */
export interface VirtualizedUserListProps {
  users: UserProfile[];
  rowHeight: number;
  maxHeight: number;
  renderRow: (user: UserProfile, style?: React.CSSProperties) => React.ReactNode;
}

// ── Auth Pages ──────────────────────────────────────────────────────────────

/** Login page props */
export interface LoginPageProps {
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

/** Register page props */
export interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

/** Forgot password page props */
export interface ForgotPasswordPageProps {
  onBack: () => void;
}

/** Auth provider wrapper props */
export interface AuthProviderProps {
  children: React.ReactNode;
}

// ── Hooks Return Types ──────────────────────────────────────────────────────

/** useChartReady hook return value */
export interface UseChartReadyReturn {
  containerRef: React.RefCallback<HTMLDivElement>;
  isReady: boolean;
}
