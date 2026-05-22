# YYC3-Learning-Platform

**面向高净值商务用户的商业培训 SaaS 平台**

> 基于 React + Tailwind CSS v4 + Supabase 构建的全栈学习管理系统 (LMS)  
> 深海蓝主题设计 | Motion 交互动画 | 三层数据持久化架构

---

## 项目概览

YYC3-Learning-Platform 是一款定位于高端商务教育市场的 SaaS 培训平台。平台提供沉浸式课程学习、实战项目看板、精英社区交流、学习数据分析等核心功能，采用深海蓝 (Deep Sea Blue) 主题设计语言，面向中文和法语双语用户。

### 核心特性

- **沉浸式课程体系**: 7 大商业模块 (AI 营销、SEO、电商、文案、品牌、数据分析、广告投放)，含 57+ 课时
- **智能学习看板**: 基于 react-dnd 的拖拽看板系统，实时同步学习任务状态
- **精英社区**: 支持发帖、点赞、频道切换的社交交流平台
- **学习热力图**: 168 天活跃度可视化，支持每日心得记录与架构 DSL 渲染
- **能力雷达图**: 基于 Recharts 的多维度能力诊断模型
- **同行对比**: 学习进度与行业均值的实时对比分析
- **多端响应式**: 桌面端 (>1024px) / 平板端 (769-1024px) / 移动端 (<=768px) 三级适配
- **国际化**: 中文/法语双语切换 (56+ 翻译 Key)
- **三层数据架构**: 前端 → Hono API Server → Supabase KV Store

---

## 技术架构

### 前端

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript (Strict) | 类型安全 |
| Tailwind CSS v4 | 样式系统 |
| Motion (Framer Motion) | 交互动画 |
| Recharts | 数据可视化 (雷达图/面积图/折线图) |
| react-dnd | 拖拽交互 (看板) |
| Sonner v2.0.3 | Toast 通知 |
| Lucide React | 图标库 |

### 后端

| 技术 | 用途 |
|------|------|
| Deno Runtime | 边缘函数运行时 |
| Hono Web Framework | HTTP 路由 + 中间件 |
| Supabase PostgreSQL | KV 数据存储 |
| Supabase Auth | 用户认证 |
| Supabase Storage | 文件存储 (预备) |

### 数据架构

```
前端 (YYC3API)
     │
     │ HTTPS + Bearer Token
     ▼
Hono API Server (15 路由)
     │
     │ kv_store.tsx
     ▼
Supabase PostgreSQL
(kv_store_dae9c128 表)
```

---

## 项目结构

```
/
├── App.tsx                          # 应用入口 (LanguageProvider + AppContent)
├── types/
│   └── index.ts                     # 统一类型定义 (35+ 接口/类型)
├── services/
│   └── apiService.ts                # YYC3API 静态类 (类型安全 API 客户端)
├── components/
│   ├── Header.tsx                   # 顶部导航栏 (搜索/通知/用户菜单)
│   ├── Sidebar.tsx                  # 侧边导航 (悬停展开/收缩)
│   ├── UserDashboard.tsx            # 用户仪表盘 (Hero/统计/雷达图/推荐)
│   ├── Kanban.tsx                   # 拖拽看板 (DnD Provider/Column/Card)
│   ├── Community.tsx                # 社区频道 (帖子/频道/发布)
│   ├── Profile.tsx                  # 个人中心 (热力图/笔记/成就/对比)
│   ├── ModulePage.tsx               # 课程模块详情 (目录/导师/规格)
│   ├── LessonPlayer.tsx             # 课时播放器 (视频/笔记)
│   ├── Breadcrumbs.tsx              # 面包屑导航 (AI 预测路径)
│   ├── MobileBottomNav.tsx          # 移动端底部导航栏
│   ├── MobileSearchModal.tsx        # 移动端全屏搜索
│   ├── BetaFeedbackModal.tsx        # Beta 反馈模态框
│   ├── LanguageContext.tsx          # i18n 上下文 (zh/fr)
│   ├── GlobalLoading.tsx            # 全局加载骨架屏
│   ├── admin/
│   │   ├── AdminDashboard.tsx       # 管理后台仪表盘
│   │   ├── SalesManagement.tsx      # 销售管理面板
│   │   ├── ModulesManagement.tsx    # 模块管理
│   │   ├── ClientsManagement.tsx    # 客户管理
│   │   └── ...                      # 其他管理面板
│   ├── ui/                          # 基础 UI 组件库 (shadcn/ui 风格)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── sonner.tsx               # Toast (无 next-themes 依赖)
│   │   └── ... (30+ 组件)
│   └── figma/
│       └── ImageWithFallback.tsx     # 图片降级组件 (受保护)
├── hooks/
│   ├── useResponsive.ts             # 响应式断点检测 (mobile/tablet/desktop)
│   ├── useChartReady.ts             # Recharts 容器尺寸安全检测
│   └── useAppNavigation.ts          # 应用导航状态管理 (待清理)
├── data/
│   ├── modulesData.ts               # 课程详细数据 (detailedModules + updatedMockModules)
│   └── mockData.ts                  # 法语版模拟数据 (历史遗留)
├── constants/
│   └── categories.ts                # 分类常量
├── styles/
│   └── globals.css                  # 全局样式 (Tailwind v4 @theme + 自定义)
├── imports/
│   ├── Cover.tsx                    # Figma 导入组件
│   └── svg-wjts5vwe7i.ts           # Figma 导入 SVG
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx            # Hono API 服务器 (15 路由)
│           └── kv_store.tsx         # KV 存储工具 (受保护)
└── utils/
    └── supabase/
        └── info.tsx                 # Supabase 配置信息 (受保护)
```

---

## 开发规范

### TypeScript 规则

1. **禁止 `any`**: 所有变量、参数、返回值必须有明确类型
2. **类型集中管理**: 所有自定义类型定义在 `/types/index.ts`
3. **Props 命名**: React 组件 Props 接口命名为 `{ComponentName}Props`
4. **文件结构顺序**: 导入 → 类型 → 组件 → 导出
5. **函数式组件**: 所有 React 组件使用函数式写法 (`React.FC` 或函数声明)

### 样式规则

1. 使用 Tailwind CSS v4 内联类
2. 全局样式和主题变量定义在 `/styles/globals.css`
3. 不创建 `tailwind.config.js` (使用 v4 CSS-first 配置)
4. 深海蓝主题色系: `#020617` (背景) / `#0F172A` (卡片) / `#3b82f6` (强调色)

### API 规则

1. 组件不得直接引用 `projectId` / `publicAnonKey`
2. 所有 API 调用通过 `YYC3API` 静态类发起
3. API 响应统一使用 `{ success, data, timestamp }` 信封格式
4. 每个方法应提供 fallback 值以支持离线降级

---

## API 端点总览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/user/profile` | 获取用户档案 |
| PUT | `/user/profile` | 更新用户档案 |
| GET | `/user/settings` | 获取用户设置 |
| PUT | `/user/settings` | 更新用户设置 |
| GET | `/user/progress` | 获取所有模块进度 |
| GET | `/user/progress/:moduleId` | 获取单模块进度 |
| PUT | `/user/progress/:moduleId` | 更新模块进度 |
| GET | `/user/achievements` | 获取成就列表 |
| POST | `/user/achievements` | 新增成就 |
| GET | `/stats` | 获取仪表盘统计 |
| PUT | `/stats` | 更新仪表盘统计 |
| GET | `/courses` | 获取课程列表 |
| POST | `/courses` | 保存课程列表 |
| GET | `/tasks` | 获取看板任务 |
| POST | `/tasks` | 保存看板任务 |
| GET | `/posts` | 获取社区帖子 |
| POST | `/posts` | 保存社区帖子 |
| GET | `/activity` | 获取学习活跃度 |
| POST | `/activity` | 记录学习时间 |
| GET | `/daily-notes` | 获取每日心得 |
| POST | `/daily-notes` | 保存每日心得 |
| GET | `/notes/:lessonId` | 获取课时笔记 |
| POST | `/notes` | 保存课时笔记 |
| GET | `/export` | 导出所有数据 |
| POST | `/seed` | 播种初始数据 |
| POST | `/signup` | 用户注册 |
| POST | `/init-storage` | 初始化存储桶 |

---

## 数据模型

### 核心类型

| 类型 | 字段数 | 用途 |
|------|--------|------|
| `UserProfile` | 17 | 用户完整档案 |
| `UserSettings` | 7 | 用户偏好设置 |
| `ModuleCardData` | 12 | 课程卡片数据 |
| `DetailedModule` | 14 | 课程完整详情 |
| `ModuleProgress` | 10 | 学习进度跟踪 |
| `Task` | 7 | 看板任务 |
| `Post` | 10 | 社区帖子 |
| `DashboardStats` | 6 | 仪表盘统计 |
| `Achievement` | 6 | 成就勋章 |

### KV 存储约定

所有数据存储在 Supabase 的 `kv_store_dae9c128` 表中，通过前缀命名约定模拟关系型结构。详见 `/types/index.ts` 中的 `KV_PREFIXES` 常量。

---

## 核心功能模块

### 1. 用户仪表盘

- Welcome Hero: 渐变文字标题 + 学习进度动画条
- 统计卡片: 4 宫格 (学分/时长/排名/模块数)
- 能力雷达图: 6 维度 Recharts RadarChart
- 活跃度趋势: 7 日 AreaChart
- 推荐课程: Top 3 模块卡片 (悬停上浮动画)

### 2. 学习看板 (Kanban)

- 三列布局: 待处理 / 进行中 / 已完成
- react-dnd 拖拽: HTML5Backend + 视觉反馈
- 任务优先级: P0 (玫红) / P1 (琥珀) / P2 (蓝色)
- 实时统计: 平均处理时效、P0 任务数、团队饱和度、完成率
- 数据持久化: 拖拽完成后自动保存至 KV

### 3. 精英社区

- 频道系统: 全频道大厅 / 技术实战 / 商业增长 / 问答
- 发帖: 富文本输入 + 图片/表情/@ 提及
- 互动: 点赞 (带填充动画) + 评论计数
- 社交同步: 微信/小红书按钮 (UI 占位)

### 4. 个人中心

- 个人资料 Hero: 渐变边框头像 + 铂金会员标签
- 学习热力图: 168 天 Grid (点击查看详情)
- 每日心得: Markdown 编辑器 + 架构 DSL 渲染 (```arch)
- 同行对比: 用户 vs 行业均值 AreaChart
- AI 策略推荐: 基于对比数据自动生成建议
- 成就勋章: 4 枚徽章 (悬停放大)

### 5. 课程详情

- 模块信息: 缩略图 + 难度标签 + 课时/时长
- 课程目录: 可点击进入播放器
- 导师信息: 头像 + 经验年限
- 面包屑: 含 AI 预测路径跳转

### 6. 管理后台 (Admin)

- 仪表盘: 收入趋势图 / 模块热度排行 (当前为 Mock 数据)
- 销售管理: 交易列表 / KPI 统计 (当前为 Mock 数据)
- 模块管理 / 客户管理 / 直播管理 / 服务管理 / 支持管理

---

## 响应式设计

| 断点 | 宽度 | 导航 | 搜索 | 布局 |
|------|------|------|------|------|
| Mobile | <= 768px | 底部 Tab Bar | 全屏模态 | 单列 |
| Tablet | 769-1024px | 底部 Tab Bar | Header 搜索栏 | 双列 |
| Desktop | > 1024px | 左侧 Sidebar (悬停展开) | Header 搜索栏 | 三列 |

### 特殊适配

- 移动端头部: 向下滚动 >100px 自动隐藏
- Safe Area: 底部导航适配 `env(safe-area-inset-bottom)`
- Touch 优化: 按钮消除 tap highlight, 触控区域 >= 44px

---

## 主题与样式

### 颜色体系

| 用途 | 色值 | Tailwind 类 |
|------|------|------------|
| 主背景 | `#020617` | `bg-[#020617]` / `bg-slate-950` |
| 卡片背景 | `#0F172A` (40% 透明) | `bg-[#0F172A]/40` |
| 主强调色 | `#3b82f6` | `text-blue-500` |
| 次强调色 | `#6366f1` | `text-indigo-500` |
| 成功色 | `#10b981` | `text-emerald-400` |
| 危险色 | `#f43f5e` | `text-rose-500` |
| 文字主色 | `#e2e8f0` | `text-slate-200` |
| 文字次级 | `#64748b` | `text-slate-500` |

### 动画体系

- 页面切换: `AnimatePresence mode="wait"` + fade/slide
- 侧边栏: `spring { stiffness: 300, damping: 30 }`
- 卡片: `whileHover={{ y: -10 }}` + 图片 scale
- 进度条: `width: 0 → N%` (1.5s ease-out)
- 背景: 双色 blob 无限旋转 + 呼吸缩放

### 排版

- 主字体: Inter + PingFang SC (中文)
- 标题风格: `font-black uppercase tracking-tight italic`
- 标签风格: `text-[9-10px] font-black uppercase tracking-widest`
- 中文行高: 1.75 (移动端), letter-spacing: 0.02em

---

## 已知限制

1. **KV 存储**: 使用 PostgreSQL KV 表模拟关系型数据，无法进行复杂 JOIN 查询
2. **Auth**: 用户注册已实现，登录流程尚未集成到前端 UI
3. **Admin 面板**: 仪表盘和销售管理使用 Mock 数据，未接入真实 API
4. **反馈系统**: `BetaFeedbackModal` 中的 `submitFeedback` 方法待实现
5. **i18n**: 法语翻译缺失约 15 个 Key
6. **视频播放**: LessonPlayer 使用占位内容，未对接真实视频源
7. **看板 List 视图**: 仅有按钮切换 UI，List 视图未实现

---

## 项目文档

| 文档 | 路径 | 说明 |
|------|------|------|
| TypeScript 审计报告 | `/docs/01-typescript-audit-report.md` | 全局类型安全分析 |
| 核心功能测试用例 | `/docs/02-test-cases.md` | 77 个测试用例 |
| API 功能文档 | `/docs/03-api-documentation.md` | 28 个端点详细文档 |
| 扩展规划方案 | `/docs/04-expansion-roadmap.md` | 四阶段发展路线图 |
| README | `/docs/05-README.md` | 本文档 |

---

## 安全注意事项

- `SUPABASE_SERVICE_ROLE_KEY` 仅在服务端使用，**绝不可泄露至前端**
- 前端使用 `publicAnonKey` 进行 API 认证
- 所有用户数据通过 userId 隔离
- CORS 策略当前为开放模式 (开发阶段)
- 待实施: Row Level Security (RLS)、请求频率限制

---

## 版本历史

| 版本 | 日期 | 主要变更 |
|------|------|---------|
| v2.0.0 | 2026-02-16 | 三层数据持久化架构、15 路由 API、TypeScript 类型体系重构 |
| v1.5.0 | 2026-02-10 | Recharts 安全渲染、导航多端适配、移动端优化 |
| v1.0.0 | 2026-01-20 | 初始版本: UI 框架搭建、Mock 数据、动画体系 |

---

## License

Copyright (c) 2026 YYC3. All rights reserved.

---

*Built with Figma Make | Powered by Supabase*
