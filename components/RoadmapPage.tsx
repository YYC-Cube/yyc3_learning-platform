// =============================================================================
// YYC3-Learning-Platform — 项目规划路线图 (v2.6.0 → v6.0)
// =============================================================================
// 结合智能行业发展趋势的完整项目演进方案
// 量化・分化・细化 — 节点有预期，预期有结果，衔接有序
// =============================================================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rocket, Target, TrendingUp, Shield, Brain, Globe, Users,
  ChevronDown, ChevronRight, CheckCircle2, Clock, AlertTriangle,
  BarChart3, Code2, Layers, Smartphone, Wifi, Database,
  Bot, CreditCard, Building2, Languages, Sparkles,
  ArrowRight, Star, Flag, Calendar, Activity, Eye, Award,
  Lightbulb, Network, Cpu, Search, FileText, PieChart, ShieldCheck
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface PhaseTask {
  id: string;
  title: string;
  description: string;
  estimatedDays: number;
  priority: 'P0' | 'P1' | 'P2';
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  deliverables: string[];
  techStack: string[];
}

interface PhaseKR {
  metric: string;
  target: string;
  unit: string;
}

interface PhaseData {
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
  status: 'completed' | 'active' | 'upcoming' | 'future';
  objectives: string[];
  keyResults: PhaseKR[];
  tasks: PhaseTask[];
  expectedOutcomes: string[];
  industryTrend: string;
  riskLevel: 'low' | 'medium' | 'high';
  estimatedHours: number;
  teamSize: { frontend: number; backend: number; design: number };
}

interface RiskItem {
  risk: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  phase: string;
}

interface IndustryTrend {
  trend: string;
  relevance: number;
  adoption: string;
  impact: string;
  icon: React.ElementType;
}

// =============================================================================
// Data: Phase Definitions
// =============================================================================

const phases: PhaseData[] = [
  {
    id: 'phase-1',
    phase: 'Phase 1',
    version: 'v2.0 → v2.6',
    title: '基础加固',
    subtitle: 'Foundation Hardening',
    theme: '修复技术债 + Auth 完整集成 + Admin 面板上线 + 角色权限体系',
    period: '2026年1月 — 2月',
    icon: Shield,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/10',
    progress: 95,
    status: 'completed',
    objectives: [
      '消除全部 P0 技术债 (TD-01~07)',
      'Auth 完整集成: 注册/登录/会话管理/401 自动登出',
      'Admin Dashboard 对接 API 实际数据渲染',
      '三级角色权限系统 (user/vip/admin)',
      '全局头像资产统一 (defaultAvatarAsset)',
      '31 条服务端路由全线上线',
    ],
    keyResults: [
      { metric: '技术债 P0', target: '0', unit: '个' },
      { metric: '服务端路由', target: '31', unit: '条' },
      { metric: 'TypeScript 严格性', target: '零 any', unit: '' },
      { metric: 'Auth 覆盖率', target: '100', unit: '%' },
      { metric: '虚拟滚动阈值', target: '≥30', unit: '用户' },
    ],
    tasks: [
      {
        id: 't1-1', title: 'Auth 完整集成', description: 'AuthContext + AuthGate + 深海蓝玻璃态登录/注册页 + 401 自动登出',
        estimatedDays: 5, priority: 'P0', status: 'completed',
        deliverables: ['AuthContext.tsx', 'LoginPage.tsx', 'RegisterPage.tsx', 'ForgotPasswordPage.tsx'],
        techStack: ['Supabase Auth', 'React Context', 'Motion'],
      },
      {
        id: 't1-2', title: '角色权限系统 (Phase 2)', description: '三级权限: user/vip/admin + 路由守卫 + 条件渲染',
        estimatedDays: 3, priority: 'P0', status: 'completed',
        deliverables: ['UserRole 类型', 'AdminLayout.tsx', '权限中间件'],
        techStack: ['TypeScript', 'React', 'Hono middleware'],
      },
      {
        id: 't1-3', title: 'Admin 用户管理面板', description: '批量删除 + 搜索防抖 250ms + 自定义零依赖虚拟滚动',
        estimatedDays: 4, priority: 'P0', status: 'completed',
        deliverables: ['UsersManagement.tsx', '虚拟滚动引擎', '批量操作 API'],
        techStack: ['React', 'KV Store', 'Custom VirtualScroll'],
      },
      {
        id: 't1-4', title: '全局头像资产统一', description: '将所有 Unsplash/randomuser 头像替换为 defaultAvatarAsset',
        estimatedDays: 1, priority: 'P1', status: 'completed',
        deliverables: ['统一 figma:asset 导入', 'ImageWithFallback 替换'],
        techStack: ['figma:asset', 'ImageWithFallback'],
      },
      {
        id: 't1-5', title: 'TypeScript 清理', description: '服务端类型断言 + react-dnd 重构 + 死代码清除',
        estimatedDays: 2, priority: 'P1', status: 'completed',
        deliverables: ['审计报告 P0 清零', '类型安全工具函数'],
        techStack: ['TypeScript strict', 'ESLint'],
      },
    ],
    expectedOutcomes: [
      'Auth 流程完整可用，支持多用户隔离',
      'Admin 后台显示真实平台数据',
      'TypeScript 审计 P0 清零',
      '31 条 API 路由覆盖全业务域',
      '虚拟滚动支持大规模用户列表 (≥30自动启用)',
    ],
    industryTrend: '零信任安全架构 (Zero Trust) 成为 SaaS 标配，RBAC 权限体系是最低门槛',
    riskLevel: 'low',
    estimatedHours: 80,
    teamSize: { frontend: 1, backend: 0.5, design: 0 },
  },
  {
    id: 'phase-2',
    phase: 'Phase 2',
    version: 'v3.0 → v3.5',
    title: '体验深化',
    subtitle: 'Experience Enhancement',
    theme: '学习闭环完善 + 社区互动升级 + 证书系统 + 智能搜索',
    period: '2026年3月 — 5月',
    icon: Sparkles,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/10',
    progress: 0,
    status: 'upcoming',
    objectives: [
      '视频课程系统完善: 断点续播 + 进度追踪',
      '社区互动升级: 评论线程 + @提及',
      '证书系统: 自动颁发 + Canvas PDF 生成',
      '全站智能搜索: 跨前缀 KV 检索 + 热搜聚合',
      '个性化推荐引擎 v1: 基于学习历史协同过滤',
    ],
    keyResults: [
      { metric: '学习完成率', target: '55', unit: '%' },
      { metric: '社区互动率', target: '>15', unit: '%' },
      { metric: '推荐命中率', target: '>60', unit: '%' },
      { metric: '搜索准确率', target: '>85', unit: '%' },
      { metric: '注册用户', target: '500', unit: '人' },
    ],
    tasks: [
      {
        id: 't2-1', title: '视频播放系统', description: 'Supabase Storage + signed URLs + 断点续播 + 完成标记',
        estimatedDays: 5, priority: 'P0', status: 'planned',
        deliverables: ['LessonPlayer 对接真实视频', 'ModuleProgress.lastPosition', '自动完成标记'],
        techStack: ['Supabase Storage', 'Video API', 'KV Store'],
      },
      {
        id: 't2-2', title: '社区互动增强', description: '嵌套评论 (2层) + 帖子编辑/删除 + @提及用户',
        estimatedDays: 4, priority: 'P0', status: 'planned',
        deliverables: ['PostComment 数据模型', '评论组件', '@提及解析'],
        techStack: ['KV Store', 'React', 'RegExp'],
      },
      {
        id: 't2-3', title: '证书系统', description: '模块完成自动颁发 + Canvas PDF 生成 + Storage 存储',
        estimatedDays: 3, priority: 'P1', status: 'planned',
        deliverables: ['Certificate 数据模型', 'CertificatesPage.tsx', 'PDF Canvas 生成'],
        techStack: ['Canvas API', 'Supabase Storage', 'Blob'],
      },
      {
        id: 't2-4', title: '全站搜索系统', description: '服务端跨 KV 搜索 + 分类结果 + 搜索历史 + 热搜',
        estimatedDays: 3, priority: 'P1', status: 'planned',
        deliverables: ['GET /search', '搜索结果页', '热搜聚合'],
        techStack: ['KV getByPrefix', 'Hono', 'React'],
      },
      {
        id: 't2-5', title: '个性化推荐 v1', description: '基于 ModuleProgress 完成模式的简化协同过滤',
        estimatedDays: 3, priority: 'P2', status: 'planned',
        deliverables: ['推荐算法', '"为你推荐"模块', 'A/B 测试基础'],
        techStack: ['KV Analytics', 'React', 'Statistics'],
      },
    ],
    expectedOutcomes: [
      '学习闭环完整: 观看 → 笔记 → 完成 → 证书',
      '社区 DAU 提升，评论互动率 >15%',
      '个性化推荐初步上线，命中率 >60%',
      '搜索体验大幅改善，覆盖课程/帖子/用户',
    ],
    industryTrend: '微学习 (Micro-Learning) + 社区驱动增长 (Community-Led Growth) 成为 EdTech 核心策略',
    riskLevel: 'medium',
    estimatedHours: 120,
    teamSize: { frontend: 1.5, backend: 1, design: 0.5 },
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    version: 'v3.5 → v4.0',
    title: '商业化引擎',
    subtitle: 'Commercialization Engine',
    theme: '支付集成 + 多租户 + 数据分析平台 + PWA + 邮件通知',
    period: '2026年6月 — 8月',
    icon: CreditCard,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/10',
    progress: 0,
    status: 'upcoming',
    objectives: [
      '支付系统: Stripe Checkout + 支付宝集成',
      '多租户架构: B2B 企业级数据隔离',
      'Admin 高级数据看板: 漏斗/留存/MRR 趋势',
      'PWA: 离线缓存 + 安装提示 + Lighthouse >90',
      '邮件通知: 学习提醒 + 周报',
    ],
    keyResults: [
      { metric: 'MRR', target: '50K+', unit: '¥' },
      { metric: 'B2B 客户', target: '5', unit: '家' },
      { metric: '移动端占比', target: '>40', unit: '%' },
      { metric: 'Lighthouse PWA', target: '>90', unit: '分' },
      { metric: '注册用户', target: '2,000', unit: '人' },
    ],
    tasks: [
      {
        id: 't3-1', title: '支付系统集成', description: 'Stripe Checkout Session + Webhook + 模块解锁逻辑 + 退款流程',
        estimatedDays: 7, priority: 'P0', status: 'planned',
        deliverables: ['POST /create-checkout', 'POST /webhook', '支付记录 KV', '退款API'],
        techStack: ['Stripe', 'Hono', 'KV Store', 'Webhook'],
      },
      {
        id: 't3-2', title: '多租户架构', description: 'KV Key 租户前缀 + 租户配置 + 数据隔离中间件',
        estimatedDays: 5, priority: 'P0', status: 'planned',
        deliverables: ['租户 KV 前缀', '租户配置面板', '隔离中间件'],
        techStack: ['KV Store', 'Hono middleware', 'React'],
      },
      {
        id: 't3-3', title: 'Admin 数据分析平台', description: '用户行为漏斗 + 留存曲线 + MRR/ARR 趋势',
        estimatedDays: 5, priority: 'P1', status: 'planned',
        deliverables: ['行为漏斗', '留存曲线', 'MRR 趋势图', '实时在线数'],
        techStack: ['Recharts', 'KV Analytics', 'React'],
      },
      {
        id: 't3-4', title: 'PWA 支持', description: 'Service Worker + App Manifest + 安装提示 + 后台同步',
        estimatedDays: 3, priority: 'P1', status: 'planned',
        deliverables: ['Service Worker', 'Manifest', '安装 Banner', '离线策略'],
        techStack: ['PWA', 'Service Worker', 'Cache API'],
      },
      {
        id: 't3-5', title: '邮件通知系统', description: 'Edge Function 定时触发 + 学习提醒 + 周报摘要',
        estimatedDays: 3, priority: 'P2', status: 'planned',
        deliverables: ['邮件触发器', '提醒模板', '周报生成'],
        techStack: ['Supabase Edge Functions', 'Email API'],
      },
    ],
    expectedOutcomes: [
      'MRR 从 0 增长至 50K+',
      'B2B 客户首批入驻 (≥5家)',
      '移动端用户占比 >40%',
      '用户留存 D7 >30%',
    ],
    industryTrend: 'PLG (Product-Led Growth) + 垂直 SaaS 细分市场爆发，培训 SaaS ARR 年增长 40%+',
    riskLevel: 'medium',
    estimatedHours: 200,
    teamSize: { frontend: 2, backend: 1.5, design: 1 },
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    version: 'v4.0 → v5.0',
    title: 'AI 智能化',
    subtitle: 'AI Intelligence',
    theme: 'AI 学习助手 + 直播系统 + 开放 API + 数据迁移',
    period: '2026年9月 — 11月',
    icon: Brain,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-600/5',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/10',
    progress: 0,
    status: 'future',
    objectives: [
      'AI 学习助手: GPT-4o 集成 + 上下文感知 + 流式响应',
      '直播系统: WebRTC/Zoom SDK + 聊天室 + 回放',
      '开放 API: Key 管理 + Rate Limiting + OpenAPI 文档',
      '国际化扩展: 5+ 语言 + RTL 预备',
      '数据迁移: KV → PostgreSQL 关系型',
    ],
    keyResults: [
      { metric: 'AI 问答准确率', target: '>85', unit: '%' },
      { metric: '直播在线时长', target: '+30', unit: '%' },
      { metric: 'API 可用性', target: '99.5', unit: '%' },
      { metric: '支持语言', target: '5+', unit: '种' },
      { metric: '注册用户', target: '5,000', unit: '人' },
    ],
    tasks: [
      {
        id: 't4-1', title: 'AI 学习助手', description: 'OpenAI GPT-4o 集成 + 课程上下文 Prompt + 流式 SSE 响应 + 浮窗组件',
        estimatedDays: 8, priority: 'P0', status: 'planned',
        deliverables: ['POST /ai/chat', 'AI 浮窗组件', 'Prompt 模板', 'Token 预算管理'],
        techStack: ['OpenAI API', 'SSE', 'React', 'Hono'],
      },
      {
        id: 't4-2', title: '直播系统', description: 'WebRTC/Zoom SDK + 实时聊天室 + 回放存储 + 预约提醒',
        estimatedDays: 7, priority: 'P0', status: 'planned',
        deliverables: ['LivePage 完善', '聊天室 WebSocket', '回放 Storage', '预约系统'],
        techStack: ['WebRTC', 'WebSocket', 'Supabase Storage'],
      },
      {
        id: 't4-3', title: '开放 API', description: 'API Key CRUD + Rate Limiting + OpenAPI/Swagger 文档',
        estimatedDays: 4, priority: 'P1', status: 'planned',
        deliverables: ['API Key 管理', 'Rate Limiter', 'Swagger 文档', 'Webhook'],
        techStack: ['Hono', 'OpenAPI', 'KV Store'],
      },
      {
        id: 't4-4', title: '国际化扩展', description: '5+ 语言支持 + 按需加载 + 日期/数字本地化 + RTL',
        estimatedDays: 4, priority: 'P1', status: 'planned',
        deliverables: ['语言包 (en/ja/ko/es/de)', 'Code Splitting', 'Intl API'],
        techStack: ['React i18n', 'Intl API', 'Dynamic Import'],
      },
      {
        id: 't4-5', title: '数据迁移 KV→SQL', description: 'KV 数据导出 → PostgreSQL 建表 → 迁移脚本 → API 切换',
        estimatedDays: 5, priority: 'P0', status: 'planned',
        deliverables: ['迁移脚本', 'SQL Schema', 'API 路由切换', 'KV 缓存层'],
        techStack: ['PostgreSQL', 'Supabase', 'Migration'],
      },
    ],
    expectedOutcomes: [
      'AI 驱动个性化学习体验上线',
      '直播互动提升用户粘性 (在线时长 +30%)',
      '开放 API 吸引生态合作伙伴',
      '完成 KV → PostgreSQL 平滑迁移',
    ],
    industryTrend: 'AI Agent + RAG 技术在教育领域落地，2026年全球 AI EdTech 市场规模突破 $60B',
    riskLevel: 'high',
    estimatedHours: 250,
    teamSize: { frontend: 2, backend: 2, design: 1 },
  },
  {
    id: 'phase-5',
    phase: 'Phase 5',
    version: 'v5.0 → v6.0',
    title: '生态化扩展',
    subtitle: 'Ecosystem Expansion',
    theme: 'AI 内容生成 + 企业定制 + 数据智能 + 全球化运营',
    period: '2026年12月 — 2027年Q1',
    icon: Globe,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    borderColor: 'border-cyan-500/30',
    glowColor: 'shadow-cyan-500/10',
    progress: 0,
    status: 'future',
    objectives: [
      'AI 内容生成: 自动课件/测验/摘要',
      '企业定制门户: 白标 + 品牌定制 + SSO',
      '数据智能: 预测性分析 + 学习路径优化',
      '全球化: 多币种 + 合规 + CDN 加速',
      '移动原生: React Native 跨平台 App',
    ],
    keyResults: [
      { metric: 'MRR', target: '500K+', unit: '¥' },
      { metric: 'NPS', target: '>70', unit: '' },
      { metric: '企业客户', target: '30+', unit: '家' },
      { metric: 'API 可用性', target: '99.9', unit: '%' },
      { metric: '注册用户', target: '20,000', unit: '人' },
    ],
    tasks: [
      {
        id: 't5-1', title: 'AI 内容生成引擎', description: 'GPT 自动生成课件大纲/测验题/学习摘要 + 人工审核工作流',
        estimatedDays: 10, priority: 'P0', status: 'planned',
        deliverables: ['内容生成 API', '审核工作流', '模板库', '质量评分'],
        techStack: ['OpenAI', 'LangChain', 'React', 'Workflow'],
      },
      {
        id: 't5-2', title: '企业定制门户', description: '白标解决方案 + 品牌配置 + SSO (SAML/OIDC) + 企业报告',
        estimatedDays: 8, priority: 'P0', status: 'planned',
        deliverables: ['白标配置', 'SSO 集成', '企业仪表盘', '批量用户管理'],
        techStack: ['SAML', 'OIDC', 'Multi-tenant', 'React'],
      },
      {
        id: 't5-3', title: '预测性数据智能', description: '学习效果预测 + 流失预警 + 路径优化 + ROI 报告',
        estimatedDays: 6, priority: 'P1', status: 'planned',
        deliverables: ['预测模型', '预警系统', '路径优化器', 'ROI 报告'],
        techStack: ['ML', 'PostgreSQL', 'Recharts', 'Analytics'],
      },
      {
        id: 't5-4', title: '全球化运营', description: '多币种支付 + GDPR/CCPA 合规 + 全球 CDN + 时区处理',
        estimatedDays: 5, priority: 'P1', status: 'planned',
        deliverables: ['多币种 Stripe', 'GDPR 合规', 'CDN 配置', '时区自动检测'],
        techStack: ['Stripe', 'Compliance', 'CDN', 'Intl'],
      },
      {
        id: 't5-5', title: 'React Native App', description: '跨平台移动应用 + 推送通知 + 离线学习 + 生物认证',
        estimatedDays: 15, priority: 'P2', status: 'planned',
        deliverables: ['iOS/Android App', '推送通知', '离线模式', 'Face ID/指纹'],
        techStack: ['React Native', 'Expo', 'Push Notification'],
      },
    ],
    expectedOutcomes: [
      'AI 内容生产效率提升 10x',
      '企业客户规模化获取 (30+)',
      'MRR 突破 500K，实现盈利',
      '全球化运营覆盖 3+ 大洲',
    ],
    industryTrend: 'Agentic AI + 企业级 LMS 融合，垂直培训 SaaS 进入万亿级赛道整合期',
    riskLevel: 'high',
    estimatedHours: 350,
    teamSize: { frontend: 3, backend: 2.5, design: 1.5 },
  },
];

// =============================================================================
// Data: Risk Matrix
// =============================================================================

const risks: RiskItem[] = [
  { risk: 'KV 存储性能瓶颈 (大量前缀查询)', probability: 'medium', impact: 'high', mitigation: 'Phase 4 迁移 PostgreSQL; Phase 2 引入缓存层', phase: 'Phase 2-4' },
  { risk: 'Figma Make 环境限制 (无法安装系统依赖)', probability: 'low', impact: 'medium', mitigation: '坚持 npm 包方案; 纯前端 PDF/Canvas 生成', phase: 'Phase 2' },
  { risk: '多租户数据隔离安全风险', probability: 'low', impact: 'high', mitigation: 'RLS 策略 + 中间件校验 + 自动化测试', phase: 'Phase 3' },
  { risk: '支付集成合规风险 (PCI DSS)', probability: 'medium', impact: 'high', mitigation: 'Stripe Checkout (PCI 合规) + 法律咨询', phase: 'Phase 3' },
  { risk: 'AI API 成本失控', probability: 'medium', impact: 'medium', mitigation: 'Token 预算管理; 缓存常见问答; 用户配额', phase: 'Phase 4' },
  { risk: '直播系统稳定性 (WebRTC ICE 失败)', probability: 'medium', impact: 'high', mitigation: 'TURN 服务器备份; Zoom SDK 降级方案', phase: 'Phase 4' },
  { risk: '国际化文案质量不一致', probability: 'high', impact: 'medium', mitigation: 'Native speaker 审核 + AI 翻译 + 社区反馈', phase: 'Phase 4-5' },
  { risk: '竞品压力 (Coursera/Udemy 下沉)', probability: 'medium', impact: 'medium', mitigation: '差异化: 中法双语 + 商业培训垂直 + AI 加持', phase: '全周期' },
];

// =============================================================================
// Data: Industry Trends
// =============================================================================

const industryTrends: IndustryTrend[] = [
  { trend: 'AI Agent 自主学习', relevance: 95, adoption: '2026 H2', impact: '颠覆性', icon: Bot },
  { trend: 'RAG 知识检索增强', relevance: 90, adoption: '2026 Q2', impact: '高', icon: Search },
  { trend: '微学习 (Micro-Learning)', relevance: 88, adoption: '已成熟', impact: '高', icon: Smartphone },
  { trend: '社区驱动增长 (CLG)', relevance: 85, adoption: '2026 Q1', impact: '高', icon: Users },
  { trend: 'PLG 产品驱动增长', relevance: 82, adoption: '已成熟', impact: '中高', icon: Rocket },
  { trend: '生成式 AI 内容创作', relevance: 92, adoption: '2026 Q2', impact: '颠覆性', icon: Sparkles },
  { trend: '零信任安全架构', relevance: 78, adoption: '已成熟', impact: '中', icon: ShieldCheck },
  { trend: '边缘计算 + CDN', relevance: 72, adoption: '已成熟', impact: '中', icon: Network },
];

// =============================================================================
// Data: OKR Summary
// =============================================================================

const okrSummary = [
  { metric: '注册用户', values: ['100', '500', '2,000', '5,000', '20,000'], icon: Users },
  { metric: 'MAU', values: ['30', '200', '800', '2,500', '8,000'], icon: Activity },
  { metric: '完成率', values: ['40%', '55%', '65%', '75%', '85%'], icon: Target },
  { metric: 'MRR (¥)', values: ['0', '0', '50K', '200K', '500K'], icon: TrendingUp },
  { metric: 'NPS', values: ['—', '50+', '60+', '70+', '70+'], icon: Star },
  { metric: 'API 可用性', values: ['95%', '98%', '99.5%', '99.9%', '99.9%'], icon: Wifi },
];

// =============================================================================
// Sub-Components
// =============================================================================

const StatusBadge: React.FC<{ status: PhaseData['status'] }> = ({ status }) => {
  const config = {
    completed: { label: '已完成', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
    active: { label: '进行中', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: Activity },
    upcoming: { label: '即将开始', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: Clock },
    future: { label: '规划中', bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', icon: Flag },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.bg} ${c.text} border ${c.border}`}>
      <c.icon size={12} />
      {c.label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: 'P0' | 'P1' | 'P2' }> = ({ priority }) => {
  const config = {
    P0: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    P1: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    P2: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider border ${config[priority]}`}>
      {priority}
    </span>
  );
};

const TaskStatusIcon: React.FC<{ status: PhaseTask['status'] }> = ({ status }) => {
  switch (status) {
    case 'completed': return <CheckCircle2 size={16} className="text-emerald-400" />;
    case 'in-progress': return <Activity size={16} className="text-blue-400 animate-pulse" />;
    case 'planned': return <Clock size={16} className="text-amber-400" />;
    default: return <Clock size={16} className="text-slate-600" />;
  }
};

const ProgressBar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      className={`h-full rounded-full ${color}`}
    />
  </div>
);

const RiskLevelIndicator: React.FC<{ level: 'low' | 'medium' | 'high' }> = ({ level }) => {
  const dots = level === 'low' ? 1 : level === 'medium' ? 2 : 3;
  const color = level === 'low' ? 'bg-emerald-400' : level === 'medium' ? 'bg-amber-400' : 'bg-rose-400';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= dots ? color : 'bg-white/10'}`} />
      ))}
    </div>
  );
};

// =============================================================================
// Phase Card Component
// =============================================================================

const PhaseCard: React.FC<{ phase: PhaseData; index: number }> = ({ phase, index }) => {
  const [isExpanded, setIsExpanded] = useState(phase.status === 'completed' || phase.status === 'active');
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'kr' | 'outcomes'>('tasks');

  const completedTasks = phase.tasks.filter(t => t.status === 'completed').length;
  const totalDays = phase.tasks.reduce((s, t) => s + t.estimatedDays, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      {/* Timeline connector */}
      {index < phases.length - 1 && (
        <div className="absolute left-8 top-full w-px h-8 bg-gradient-to-b from-white/10 to-transparent z-0 hidden lg:block" />
      )}

      <div className={`relative bg-[#0F172A]/60 backdrop-blur-xl border ${phase.borderColor} rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg ${phase.glowColor}`}>
        {/* Phase Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 lg:p-8 flex items-start lg:items-center gap-4 lg:gap-6 text-left group"
        >
          {/* Phase Icon */}
          <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${phase.gradient} border ${phase.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
            <phase.icon size={28} className={phase.color} />
          </div>

          {/* Phase Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${phase.color}`}>
                {phase.phase}
              </span>
              <span className="text-[9px] text-slate-600 font-bold tracking-wider">
                {phase.version}
              </span>
              <StatusBadge status={phase.status} />
            </div>
            <h3 className="text-lg lg:text-xl font-black text-white tracking-tight">
              {phase.title}
              <span className="text-slate-500 font-medium text-sm ml-2">{phase.subtitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{phase.theme}</p>

            {/* Progress + Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <Calendar size={12} />
                {phase.period}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <Clock size={12} />
                {phase.estimatedHours}h
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <Users size={12} />
                {phase.teamSize.frontend + phase.teamSize.backend + phase.teamSize.design} 人
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                <AlertTriangle size={12} />
                <RiskLevelIndicator level={phase.riskLevel} />
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-3 max-w-md">
              <div className="flex justify-between text-[9px] text-slate-600 font-bold mb-1">
                <span>{completedTasks}/{phase.tasks.length} 任务</span>
                <span>{phase.progress}%</span>
              </div>
              <ProgressBar
                value={phase.progress}
                color={phase.status === 'completed' ? 'bg-emerald-500' : phase.status === 'active' ? 'bg-blue-500' : 'bg-slate-700'}
              />
            </div>
          </div>

          {/* Expand Toggle */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-600 group-hover:text-white transition-colors flex-shrink-0"
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 lg:px-8 pb-6 lg:pb-8 border-t border-white/5 pt-6">
                {/* Sub-tabs */}
                <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
                  {([
                    { key: 'tasks' as const, label: '任务分解', icon: Layers },
                    { key: 'kr' as const, label: '关键成果', icon: Target },
                    { key: 'outcomes' as const, label: '预期结果', icon: Flag },
                  ]).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSubTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeSubTab === tab.key
                          ? 'bg-white/10 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tasks Tab */}
                {activeSubTab === 'tasks' && (
                  <div className="space-y-3">
                    {phase.tasks.map((task, ti) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ti * 0.05 }}
                        className="bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <TaskStatusIcon status={task.status} />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-white">{task.title}</h4>
                              <PriorityBadge priority={task.priority} />
                              <span className="text-[9px] text-slate-600 font-bold">{task.estimatedDays} 天</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">{task.description}</p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {task.techStack.map(tech => (
                                <span key={tech} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-bold">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {task.deliverables.map(d => (
                                <span key={d} className="flex items-center gap-1 text-[9px] text-slate-500">
                                  <ChevronRight size={10} className="text-slate-700" />
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Total estimation */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[10px] text-slate-500 font-bold">合计工时估算</span>
                      <span className="text-sm font-black text-white">{totalDays} 天 / {phase.estimatedHours} 小时</span>
                    </div>
                  </div>
                )}

                {/* Key Results Tab */}
                {activeSubTab === 'kr' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.keyResults.map((kr, ki) => (
                      <motion.div
                        key={kr.metric}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: ki * 0.05 }}
                        className={`bg-gradient-to-br ${phase.gradient} border ${phase.borderColor} rounded-xl p-4`}
                      >
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">{kr.metric}</p>
                        <p className={`text-2xl font-black ${phase.color}`}>
                          {kr.target}
                          {kr.unit && <span className="text-xs text-slate-500 ml-1">{kr.unit}</span>}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Outcomes Tab */}
                {activeSubTab === 'outcomes' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {phase.expectedOutcomes.map((outcome, oi) => (
                        <motion.div
                          key={oi}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: oi * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl"
                        >
                          <CheckCircle2 size={16} className={`${phase.color} flex-shrink-0 mt-0.5`} />
                          <p className="text-sm text-slate-300">{outcome}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Industry Trend */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={14} className="text-indigo-400" />
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">行业趋势洞察</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{phase.industryTrend}</p>
                    </div>

                    {/* Team Composition */}
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Code2 size={12} /> 前端 {phase.teamSize.frontend}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Database size={12} /> 后端 {phase.teamSize.backend}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Eye size={12} /> 设计 {phase.teamSize.design}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const RoadmapPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'timeline' | 'okr' | 'risks' | 'trends'>('timeline');

  const totalHours = useMemo(() => phases.reduce((s, p) => s + p.estimatedHours, 0), []);
  const totalTasks = useMemo(() => phases.reduce((s, p) => s + p.tasks.length, 0), []);
  const completedTasks = useMemo(() => phases.reduce((s, p) => s + p.tasks.filter(t => t.status === 'completed').length, 0), []);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10 rounded-3xl blur-xl" />
        <div className="relative bg-[#0F172A]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Rocket size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.25em]">YYC3 Project Roadmap</p>
                  <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">项目规划路线图</h1>
                </div>
              </div>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                从 v2.6 基础加固到 v6.0 全球化生态，结合 AI 智能行业发展趋势，分 5 阶段量化推进。
                覆盖学习体验深化、商业化引擎、AI 智能化、生态扩展全链路。
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: '阶段总数', value: `${phases.length}`, icon: Layers, color: 'text-blue-400' },
                { label: '总任务', value: `${totalTasks}`, icon: FileText, color: 'text-purple-400' },
                { label: '已完成', value: `${completedTasks}/${totalTasks}`, icon: CheckCircle2, color: 'text-emerald-400' },
                { label: '总工时', value: `${totalHours}h`, icon: Clock, color: 'text-amber-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <stat.icon size={16} className={`${stat.color} mx-auto mb-1`} />
                  <p className="text-lg font-black text-white">{stat.value}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
        {([
          { key: 'timeline' as const, label: '阶段时间线', icon: Calendar },
          { key: 'okr' as const, label: 'OKR 成果矩阵', icon: Target },
          { key: 'risks' as const, label: '风险评估', icon: AlertTriangle },
          { key: 'trends' as const, label: '行业趋势', icon: TrendingUp },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`flex items-center gap-2 px-4 lg:px-6 py-3 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeSection === tab.key
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Timeline */}
        {activeSection === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Visual Timeline Bar */}
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 overflow-x-auto no-scrollbar">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">版本演进时间轴</p>
              <div className="flex items-center gap-2 min-w-[700px]">
                {phases.map((p, i) => (
                  <div key={p.id} className="contents">
                    <div className="flex-1 relative">
                      <div className={`h-2 rounded-full ${
                        p.status === 'completed' ? 'bg-emerald-500' :
                        p.status === 'active' ? 'bg-blue-500 animate-pulse' :
                        'bg-white/10'
                      }`} />
                      <div className="mt-2 text-center">
                        <p className={`text-[9px] font-black ${p.color}`}>{p.version}</p>
                        <p className="text-[8px] text-slate-600 font-bold">{p.title}</p>
                      </div>
                    </div>
                    {i < phases.length - 1 && (
                      <ArrowRight size={14} className="text-slate-700 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Cards */}
            {phases.map((phase, index) => (
              <PhaseCard key={phase.id} phase={phase} index={index} />
            ))}

            {/* Technology Evolution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Cpu size={20} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Tech Stack Evolution</p>
                  <h3 className="text-lg font-black text-white">技术栈演进路径</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { phase: 'P1', stack: 'KV Store', desc: 'Hono + Auth + RBAC', color: 'emerald' },
                  { phase: 'P2', stack: 'KV + Storage', desc: 'Video + Search + Cert', color: 'blue' },
                  { phase: 'P3', stack: 'KV + Stripe', desc: 'Payment + PWA + Email', color: 'amber' },
                  { phase: 'P4', stack: 'PostgreSQL', desc: 'AI + WebRTC + OpenAPI', color: 'purple' },
                  { phase: 'P5', stack: 'Full Stack', desc: 'ML + SSO + RN App', color: 'cyan' },
                ].map((item, i) => (
                  <div key={i} className={`bg-${item.color}-500/5 border border-${item.color}-500/20 rounded-xl p-4 text-center`}
                    style={{
                      background: `rgba(${item.color === 'emerald' ? '16,185,129' : item.color === 'blue' ? '59,130,246' : item.color === 'amber' ? '245,158,11' : item.color === 'purple' ? '168,85,247' : '6,182,212'}, 0.05)`,
                      borderColor: `rgba(${item.color === 'emerald' ? '16,185,129' : item.color === 'blue' ? '59,130,246' : item.color === 'amber' ? '245,158,11' : item.color === 'purple' ? '168,85,247' : '6,182,212'}, 0.2)`,
                    }}
                  >
                    <p className="text-[9px] font-black uppercase tracking-wider mb-1" style={{ color: item.color === 'emerald' ? '#34d399' : item.color === 'blue' ? '#60a5fa' : item.color === 'amber' ? '#fbbf24' : item.color === 'purple' ? '#c084fc' : '#22d3ee' }}>
                      {item.phase}
                    </p>
                    <p className="text-sm font-black text-white mb-1">{item.stack}</p>
                    <p className="text-[9px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* OKR Matrix */}
        {activeSection === 'okr' && (
          <motion.div
            key="okr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Target size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Objective & Key Results</p>
                  <h3 className="text-lg font-black text-white">将 YYC3 打造为行业领先的商业培训 SaaS 平台</h3>
                </div>
              </div>

              {/* OKR Table */}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-[10px] text-slate-500 font-black uppercase tracking-wider">指标</th>
                      {phases.map(p => (
                        <th key={p.id} className="text-center py-3 px-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider ${p.color}`}>{p.phase}</span>
                          <p className="text-[8px] text-slate-600">{p.version}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {okrSummary.map((row, ri) => (
                      <motion.tr
                        key={row.metric}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ri * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <row.icon size={14} className="text-slate-500" />
                            <span className="text-xs font-bold text-white">{row.metric}</span>
                          </div>
                        </td>
                        {row.values.map((val, vi) => (
                          <td key={vi} className="text-center py-3 px-3">
                            <span className={`text-sm font-black ${vi === 0 ? 'text-emerald-400' : vi === phases.length - 1 ? 'text-cyan-400' : 'text-slate-300'}`}>
                              {val}
                            </span>
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resource Planning */}
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                  <BarChart3 size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.2em]">Resource Planning</p>
                  <h3 className="text-lg font-black text-white">资源需求估算</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {phases.map(p => {
                  const total = p.teamSize.frontend + p.teamSize.backend + p.teamSize.design;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`bg-gradient-to-br ${p.gradient} border ${p.borderColor} rounded-xl p-4`}
                    >
                      <p className={`text-[9px] font-black uppercase tracking-wider ${p.color} mb-3`}>{p.phase}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">前端</span>
                          <span className="font-bold text-white">{p.teamSize.frontend}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">后端</span>
                          <span className="font-bold text-white">{p.teamSize.backend}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">设计</span>
                          <span className="font-bold text-white">{p.teamSize.design}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 flex justify-between text-xs">
                          <span className="text-slate-400 font-bold">合计</span>
                          <span className={`font-black ${p.color}`}>{total} 人</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">工时</span>
                          <span className="font-bold text-white">{p.estimatedHours}h</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Risk Assessment */}
        {activeSection === 'risks' && (
          <motion.div
            key="risks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.2em]">Risk Assessment Matrix</p>
                  <h3 className="text-lg font-black text-white">风险评估与缓解策略</h3>
                </div>
              </div>

              <div className="space-y-3">
                {risks.map((risk, ri) => {
                  const probColor = risk.probability === 'low' ? 'text-emerald-400 bg-emerald-500/10' : risk.probability === 'medium' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10';
                  const impColor = risk.impact === 'low' ? 'text-emerald-400 bg-emerald-500/10' : risk.impact === 'medium' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10';

                  return (
                    <motion.div
                      key={ri}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: ri * 0.05 }}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white mb-1">{risk.risk}</p>
                          <p className="text-xs text-slate-500">{risk.mitigation}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className={`px-2 py-1 rounded text-[9px] font-black ${probColor}`}>
                            概率: {risk.probability === 'low' ? '低' : risk.probability === 'medium' ? '中' : '高'}
                          </div>
                          <div className={`px-2 py-1 rounded text-[9px] font-black ${impColor}`}>
                            影响: {risk.impact === 'low' ? '低' : risk.impact === 'medium' ? '中' : '高'}
                          </div>
                          <span className="text-[9px] text-slate-600 font-bold">{risk.phase}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Risk Summary */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: '高风险', count: risks.filter(r => r.probability === 'high' || r.impact === 'high').length, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                  { label: '中风险', count: risks.filter(r => r.probability === 'medium' && r.impact !== 'high').length, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: '低风险', count: risks.filter(r => r.probability === 'low' && r.impact === 'low').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border rounded-xl p-4 text-center`}>
                    <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Industry Trends */}
        {activeSection === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <TrendingUp size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.2em]">AI & EdTech Industry Trends 2026</p>
                  <h3 className="text-lg font-black text-white">智能行业发展趋势与平台对齐</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industryTrends.map((trend, ti) => (
                  <motion.div
                    key={trend.trend}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: ti * 0.05 }}
                    className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-cyan-500/20 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                        <trend.icon size={20} className="text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">{trend.trend}</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-bold">
                            相关度 {trend.relevance}%
                          </span>
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[9px] font-bold">
                            {trend.impact}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded text-[9px] font-bold">
                            {trend.adoption}
                          </span>
                        </div>
                        {/* Relevance bar */}
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${trend.relevance}%` }}
                            transition={{ duration: 1, delay: ti * 0.1, ease: [0.23, 1, 0.32, 1] }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI EdTech Market Overview */}
            <div className="bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <PieChart size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em]">Market Intelligence</p>
                  <h3 className="text-lg font-black text-white">2026 智能培训市场数据</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: '全球 AI EdTech 市场', value: '$60B+', delta: '+38% YoY', color: 'text-blue-400' },
                  { label: '企业培训 SaaS CAGR', value: '42%', delta: '2024-2028', color: 'text-emerald-400' },
                  { label: 'AI 辅助学习采纳率', value: '67%', delta: '+22pp YoY', color: 'text-purple-400' },
                  { label: '中国在线教育市场', value: '¥8,000亿', delta: '+25% YoY', color: 'text-amber-400' },
                ].map((stat, si) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: si * 0.1 }}
                    className="bg-white/[0.03] border border-white/5 rounded-xl p-4"
                  >
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className={`text-xl lg:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1">{stat.delta}</p>
                  </motion.div>
                ))}
              </div>

              {/* Strategic positioning */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 border border-blue-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={16} className="text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">YYC3 差异化定位</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: '中法双语商业培训', desc: '覆盖��法商业文化交叉需求，占据独特细分市场', icon: Languages },
                    { title: 'AI 原生学习体验', desc: '从 Phase 4 起深度集成 AI Agent，实现个性化学习路径', icon: Brain },
                    { title: '企业级 SaaS 架构', desc: '多租户 + 白标 + SSO，支撑 B2B 规模化获客', icon: Building2 },
                  ].map(item => (
                    <div key={item.title} className="flex items-start gap-3">
                      <item.icon size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-4"
      >
        <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em]">
          规划制定: 2026-02-18 &bull; 下次评审: 2026-03-01 &bull; YYC3 Architecture Team
        </p>
      </motion.div>
    </div>
  );
};
