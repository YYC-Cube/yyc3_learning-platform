<div align="center">
  <img src="public/Learning-Platform.png" alt="YYC³ Learning Platform" width="100%" />
</div>

<br/>

<div align="center">

# YanYuCloudCube™ Learning Platform

**五高五标五化五维 · 面向高净值商务用户的智能培训 SaaS 平台**

[![Deploy](https://github.com/YYC-Cube/yyc3_learning-platform/actions/workflows/deploy.yml/badge.svg)](https://github.com/YYC-Cube/yyc3_learning-platform/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg?style=flat-square)](https://github.com/YYC-Cube/yyc3_learning-platform)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-9.15-F69220.svg?style=flat-square)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Live-222222.svg?style=flat-square&logo=github)](https://learning-ai.yyc3.top)

</div>

<br/>

---

## 品牌概述

YanYuCloudCube™ (YYC³) 是一款定位于高端商务教育市场的智能培训 SaaS 平台，秉承「**言启千行代码，语枢万物智能**」的品牌理念，以深海蓝 (Deep Sea Blue `#020617`) 为主题色，构建沉浸式、智能化的学习体验。

### 五维驱动体系

| 体系 | 核心要素 |
|------|---------|
| **五高架构** | 高可用 · 高性能 · 高安全 · 高扩展 · 高智能 |
| **五标体系** | 标准化 · 规范化 · 自动化 · 可视化 · 智能化 |
| **五化转型** | 流程化 · 数字化 · 生态化 · 工具化 · 服务化 |
| **五维评估** | 时间维 · 空间维 · 属性维 · 事件维 · 关联维 |

---

## 核心特性

| 能力域 | 功能 | 技术实现 |
|--------|------|---------|
| **沉浸式课程体系** | 7 大商业模块 · 57+ 课时 | 模块化数据架构 · 课时进度追踪 |
| **智能学习看板** | 拖拽式任务管理 | react-dnd · 实时状态同步 |
| **精英社区** | 发帖 · 点赞 · 频道切换 | 社交化互动 · 多频道架构 |
| **学习热力图** | 168 天活跃度可视化 | Canvas 渲染 · 每日心得记录 |
| **能力雷达图** | 多维度能力诊断 | Recharts · 6 维评估模型 |
| **AI 智能助手** | 多 Provider SSE 流式 | 智谱 / OpenAI / Ollama · 上下文感知 |
| **三权 RBAC** | user / vip / admin | 路由守卫 · 条件渲染 · JWT 认证 |
| **管理后台** | 10+ 管理模块 | 用户 · 课程 · 销售 · 项目 · 直播 |
| **多端响应式** | Desktop / Tablet / Mobile | 三级断点适配 · 触控优化 |
| **国际化** | 中文 / 法语双语 | 56+ 翻译 Key · 动态切换 |

---

## 技术架构

### 技术栈

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **UI 框架** | React | 18.3 | 组件化 UI |
| **类型系统** | TypeScript | 5.7 (Strict) | 类型安全 |
| **样式引擎** | Tailwind CSS | 4.0 | 原子化 CSS |
| **动画引擎** | Motion | 11.18 | 物理动画 · 手势交互 |
| **图表可视化** | Recharts | 2.15 | 数据可视化 |
| **拖拽交互** | react-dnd | 16.0 | 看板拖拽 |
| **通知系统** | Sonner | 2.0 | Toast 通知 |
| **图标库** | Lucide React | 0.468 | 1500+ 图标 |
| **UI 原语** | Radix UI / shadcn/ui | Latest | 无障碍组件库 |
| **状态管理** | React Context | 18.3 | 全局状态 |
| **后端服务** | Express | 5.2 | API 服务 · JWT 认证 |
| **构建工具** | Vite | 6.4 | 极速 HMR · 生产构建 |
| **包管理** | pnpm | 9.15 | 高效依赖管理 |
| **测试框架** | Vitest | 2.1 | 单元测试 · 集成测试 |

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React 18 SPA)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ AuthGate │  │ Dashboard│  │ AI Chat  │  │ Admin Panel  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘ │
│       │              │              │               │         │
│  ┌────┴──────────────┴──────────────┴───────────────┴──────┐  │
│  │              YYC3API · Unified Service Layer             │  │
│  │     (Type-safe API Client · Mock Fallback · JWT)        │  │
│  └──────────────────────┬──────────────────────────────────┘  │
│                         │                                     │
│  ┌──────────────────────┴──────────────────────────────────┐  │
│  │              Adapter Layer (Supabase-Free)               │  │
│  │   adapters/config.ts · adapters/auth.ts · adapters/api  │  │
│  └──────────────────────┬──────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP / Bearer Token
┌─────────────────────────┼───────────────────────────────────┐
│               Backend (Express 5 · Node.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │   Auth   │  │   User   │  │  Health  │  │ CRUD Stubs   │ │
│  │ /signup  │  │ /profile │  │ /health  │  │ /api/*       │ │
│  │ /signin  │  │ /settings│  │          │  │              │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
│                    Port 3001 · Guest Mode                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 项目结构

```
YYC3-Learning-Platform/
├── .github/workflows/         # CI/CD (GitHub Pages 自动部署)
├── adapters/                  # 适配器层 (API · Auth · Config)
├── components/
│   ├── admin/                 # 管理后台 (10+ 模块)
│   ├── auth/                  # 认证页面 (登录 · 注册 · 找回密码)
│   ├── figma/                 # Figma 资源组件
│   ├── ui/                    # shadcn/ui 基础组件 (40+)
│   ├── AIAssistant.tsx        # AI 智能助手 (多 Provider · SSE)
│   ├── Sidebar.tsx            # 侧边导航
│   ├── UserDashboard.tsx      # 用户仪表盘
│   ├── Kanban.tsx             # 学习看板 (react-dnd)
│   ├── Community.tsx          # 精英社区
│   ├── Profile.tsx            # 个人中心
│   └── ...                    # 其他业务组件
├── contexts/AuthContext.tsx    # 全局认证 (JWT · Guest Mode)
├── services/apiService.ts     # YYC3API 统一服务层
├── types/index.ts             # 类型定义 (35+ 接口)
├── hooks/                     # 自定义 Hooks
├── data/                      # Mock 数据 · 课程数据
├── constants/                 # 常量定义
├── styles/globals.css         # 全局样式 (Deep Sea Blue Theme)
├── server/                    # Express 后端 (Auth · Health · CRUD)
├── docs/                      # 文档体系 (10 阶段 · 51 文档)
├── tests/                     # 测试套件 (Unit · Integration)
├── public/
│   ├── yyc3-dist/             # 品牌资源 (Logo · Favicon · PWA)
│   └── CNAME                  # 自定义域名 learning-ai.yyc3.top
├── App.tsx                    # 应用入口
├── main.tsx                   # Vite 入口
├── index.html                 # HTML 模板
├── vite.config.ts             # Vite 配置 (Tailwind · Figma Plugin)
├── tsconfig.json              # TypeScript 配置 (Strict)
└── package.json               # 项目配置 (pnpm · 40+ 依赖)
```

---

## 快速开始

### 环境要求

| 依赖 | 最低版本 | 推荐 |
|------|---------|------|
| Node.js | >= 18.0.0 | 20.x LTS |
| pnpm | >= 8.0.0 | 9.15 |

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/YYC-Cube/yyc3_learning-platform.git
cd yyc3_learning-platform

# 安装依赖
pnpm install

# 启动开发服务器 (端口 3061)
pnpm dev

# 生产构建
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm typecheck
```

### 环境变量

```bash
cp .env.example .env
```

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | API 服务地址 | `http://localhost:3001/api` |

---

## 部署

| 环境 | 地址 | 方式 |
|------|------|------|
| **生产** | [learning-ai.yyc3.top](https://learning-ai.yyc3.top) | GitHub Pages · HTTPS |
| **本地前端** | `http://localhost:3061` | `pnpm dev` |
| **本地后端** | `http://localhost:3001` | `pnpm exec tsx server/index.ts` |

### CI/CD 流水线

```
push to main → GitHub Actions
  → pnpm install (frozen-lockfile)
  → vite build (生产构建)
  → upload-pages-artifact
  → deploy-pages
  → https://learning-ai.yyc3.top (自动生效)
```

---

## 文档体系

完整项目文档位于 `docs/` 目录，遵循「五高五标五化五维」标准体系：

| 阶段 | 目录 | 描述 |
|------|------|------|
| 00 | `00-项目总览索引/` | 项目全局视图与导航 |
| 01 | `01-启动规划阶段/` | 项目启动与规划管理 |
| 02 | `02-项目设计阶段/` | 系统架构与详细设计 |
| 03 | `03-开发实施阶段/` | 代码开发与实施 |
| 04 | `04-测试审核阶段/` | 质量保障与审核 |
| 05 | `05-交付部署阶段/` | 项目交付与部署 |
| 06 | `06-运维保障阶段/` | 系统运维与保障 |
| 07 | `07-合规安全保障/` | 安全与合规管理 |
| 08 | `08-资产知识管理/` | 资产与知识管理 |
| 09 | `09-智能演进优化/` | 持续演进与优化 |
| 10 | `10-团队标准规范/` | 团队核心标准与规范 |

---

## 品牌标识

| 资产 | 路径 |
|------|------|
| Logo (128px) | `public/yyc3-dist/yanyu_cloud_128x128.png` |
| Favicon | `public/yyc3-dist/favicon.ico` |
| PWA Icon (512px) | `public/yyc3-dist/yanyu_cloud_512x512.png` |
| 全平台图标 | `public/yyc3/` (Android / iOS / macOS / watchOS / Web) |

---

<div align="center">

**YanYuCloudCube™**

*言启象限 · 语枢未来*

***Words Initiate Quadrants, Language Serves as Core for Future***

*万象归元于云枢 · 深栈智启新纪元*

***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

<br />

**© 2025-2026 YanYuCloudCube™ Team. All Rights Reserved.**

</div>
