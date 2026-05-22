# YYC³-Learning-Platform

**面向高净值商务用户的商业培训 SaaS 平台**

> 基于 React 18 + TypeScript + Tailwind CSS v4 + Motion 构建
> 深海蓝主题设计 | Motion 交互动画 | 本地优先数据架构

---

## 项目概览

YYC3-Learning-Platform 是一款定位于高端商务教育市场的 SaaS 培训平台。平台提供沉浸式课程学习、实战项目看板、精英社区交流、学习数据分析等核心功能，采用深海蓝 (Deep Sea Blue) 主题设计语言，面向中文和法语双语用户。

### 核心特性

- **沉浸式课程体系**: 7 大商业模块 (AI 营销、SEO、电商、文案、品牌、数据分析、广告投放)，含 57+ 课时
- **智能学习看板**: 基于 react-dnd 的拖拽看板系统，实时同步学习任务状态
- **精英社区**: 支持发帖、点赞、频道切换的社交交流平台
- **学习热力图**: 168 天活跃度可视化，支持每日心得记录
- **能力雷达图**: 基于 Recharts 的多维度能力诊断模型
- **三层数据架构**: 前端 → API 服务层 → 持久化存储
- **AI 智能助手**: 多 Provider 支持 (智谱/DeepSeek/OpenAI/Ollama)，SSE 流式输出
- **三权 RBAC**: user / vip / admin 角色体系，路由守卫 + 条件渲染
- **多端响应式**: 桌面端 / 平板端 / 移动端三级适配
- **国际化**: 中文/法语双语切换 (56+ 翻译 Key)

---

## 技术架构

### 前端

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript (Strict) | 类型安全 |
| Tailwind CSS v4 | 样式系统 |
| Motion (Framer Motion) | 交互动画 |
| Recharts | 数据可视化 |
| react-dnd | 拖拽交互 (看板) |
| Sonner v2.0.3 | Toast 通知 |
| Lucide React | 图标库 |
| Radix UI / shadcn/ui | 无障碍组件库 |

### 数据架构

```
前端 (YYC3API 静态类)
     │
     │ HTTPS + Bearer Token
     ▼
API 服务层 (apiService.ts)
     │
     │ 降级策略: API 不可用时回退至本地 Mock 数据
     ▼
持久化存储 (可插拔适配)
```

---

## 项目结构

```
/
├── App.tsx                    # 应用入口 (AuthProvider + AuthGate + AppContent)
├── types/index.ts             # 统一类型定义 (35+ 接口/类型)
├── services/apiService.ts     # YYC3API 静态类 (类型安全 API 客户端)
├── contexts/AuthContext.tsx    # 全局认证状态管理
├── components/
│   ├── Header.tsx             # 顶部导航栏
│   ├── Sidebar.tsx            # 侧边导航
│   ├── UserDashboard.tsx      # 用户仪表盘
│   ├── ModulePage.tsx         # 课程详情页
│   ├── Kanban.tsx             # 学习看板
│   ├── Community.tsx          # 精英社区
│   ├── Profile.tsx            # 个人中心
│   ├── AIAssistant.tsx        # AI 智能助手
│   ├── auth/                  # 认证页面 (登录/注册/找回密码)
│   ├── admin/                 # 管理后台组件
│   └── ui/                    # shadcn/ui 基础组件
├── data/                      # Mock 数据 & 课程数据
├── hooks/                     # 自定义 Hooks
├── constants/                 # 常量定义
├── styles/globals.css         # 全局样式 (深海蓝主题)
├── docs/                      # 项目文档体系 (10 阶段)
└── tests/                     # 测试套件
```

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 运行测试

```bash
pnpm test
```

---

## 文档体系

完整项目文档位于 `docs/` 目录，遵循「五高五标五化五维」标准体系：

| 阶段 | 目录 | 描述 |
|------|------|------|
| 00 | `docs/00-项目总览索引/` | 项目全局视图与导航 |
| 01 | `docs/01-启动规划阶段/` | 项目启动与规划管理 |
| 02 | `docs/02-项目设计阶段/` | 系统架构与详细设计 |
| 03 | `docs/03-开发实施阶段/` | 代码开发与实施 |
| 04 | `docs/04-测试审核阶段/` | 质量保障与审核 |
| 05 | `docs/05-交付部署阶段/` | 项目交付与部署 |
| 06 | `docs/06-运维保障阶段/` | 系统运维与保障 |
| 07 | `docs/07-合规安全保障/` | 安全与合规管理 |
| 08 | `docs/08-资产知识管理/` | 资产与知识管理 |
| 09 | `docs/09-智能演进优化/` | 持续演进与优化 |
| 10 | `docs/10-团队标准规范/` | 团队核心标准与规范 |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

**© 2025-2026 YYC³ Team. All Rights Reserved.**
</div>
