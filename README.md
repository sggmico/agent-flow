# Agent Flow

<div align="center">

<h4> 让 AI Agent 协作触手可及 </h4>

一个现代化的 AI Agent 协作平台，通过可视化界面轻松创建、编排和监控 AI Agent

[功能特性](#-核心特性) • [快速开始](#-快速开始) • [贡献指南](#-贡献指南)

</div>

---

## 🎯 项目简介

Agent Flow 致力于将 AI 从"问答工具"升级为"可协作、可审计、可执行的工作系统"。通过直观的可视化界面，开发者可以：

- **可视化编排**：拖拽式设计 AI Agent 工作流，无需编写复杂代码
- **多 Agent 协作**：让多个专业 Agent 协同完成复杂任务
- **实时监控**：追踪每个 Agent 的执行状态和结果
- **智能代码理解**：基于向量搜索的代码语义问答
- **质量保证**：内置代码审查、安全扫描等专业工具

### 应用场景

- **代码审查自动化**：多个 Agent 并行检查安全性、性能、最佳实践
- **文档生成**：自动分析代码库生成 API 文档、架构说明
- **智能代码助手**：基于项目上下文的精准代码问答
- **工作流自动化**：串联多个 AI 能力完成复杂开发任务

---

## ✨ 核心特性

### Agent 管理

- 支持 Claude Sonnet 4、GPT-4o、Gemini 2.0 Flash 等主流模型
- 灵活的角色定义和能力配置
- 可复用的 Agent 模板

### 工作流编排

- 基于 React Flow 的可视化编辑器
- 支持串行、并行、条件、循环等执行模式
- 实时预览工作流执行过程

### 代码库智能索引

- 支持 TypeScript、JavaScript、Python 等语言
- pgvector 向量搜索，10-30ms 查询响应
- 智能代码分块和语义理解

### AI 对话与问答

- 基于代码上下文的精准问答
- 流式响应，实时显示生成过程
- 保持对话历史，支持多轮交互

### 代码审查

- 安全性、性能、最佳实践多维度检查
- 集成 Semgrep 等专业工具
- 生成详细的审查报告和修复建议

### 多端支持（规划中）

- Web 应用（MVP）
- 桌面应用（Tauri）
- VS Code 扩展
- CLI 工具

---

## 🛠️ 技术栈

### 前端

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript 5.x
- **UI**：Tailwind CSS + shadcn/ui
- **状态管理**：Zustand + TanStack Query
- **工作流编辑器**：React Flow

### 后端与数据

- **数据库**：PostgreSQL 16+ (含 pgvector 扩展)
- **ORM**：Drizzle ORM（100% 类型安全）
- **向量搜索**：pgvector
- **缓存**：Redis / Upstash Redis

### AI 引擎

- **框架**：Mastra（TypeScript 原生 agent 框架）
- **LLM**：Claude、GPT-4、Gemini
- **Embeddings**：OpenAI text-embedding-3-large

### 工具链

- **包管理器**：pnpm
- **Monorepo**：pnpm workspace
- **Linter/Formatter**：Biome
- **测试**：Vitest + Playwright
- **部署**：Vercel + Neon/Supabase

---

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- PostgreSQL >= 16.0 (需要 pgvector 扩展)
- Redis >= 7.0
- pnpm >= 8.0

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-username/agent-flow.git
cd agent-flow

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入以下配置：
# - DATABASE_URL (PostgreSQL 连接字符串)
# - REDIS_URL (Redis 连接字符串)
# - OPENAI_API_KEY (用于 embeddings)
# - ANTHROPIC_API_KEY (用于 Claude)

# 4. 初始化数据库
pnpm db:migrate

# 5. 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 开始使用！

### 数据库配置

如果你使用的是 Neon 或 Supabase，请确保启用 pgvector 扩展：

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 📁 项目结构

```
agent-flow/
├── apps/                    # 平台特定应用
│   └── web/                # Next.js Web 应用
├── packages/               # 共享代码
│   ├── shared/            # 业务逻辑 (100% 共享)
│   ├── ui/                # React 组件 (90% 共享)
│   ├── database/          # Drizzle schemas
│   └── mastra/            # AI agent 配置
├── docs/
│   ├── spec.md            # 功能规格说明
│   └── local/             # 私有规划文档
├── CLAUDE.md              # AI 开发指南
└── README.md              # 本文件
```

---

## 🔧 开发指南

### 常用命令

```bash
# 开发
pnpm dev                    # 启动开发服务器
pnpm build                  # 构建生产版本
pnpm start                  # 启动生产服务器

# 数据库
pnpm db:generate            # 生成数据库迁移
pnpm db:migrate             # 运行数据库迁移
pnpm db:studio              # 打开 Drizzle Studio

# 代码质量
pnpm check                  # 运行 Biome 检查
pnpm check:fix              # 自动修复问题
pnpm type-check             # TypeScript 类型检查

# 测试
pnpm test                   # 运行单元测试
pnpm test:coverage          # 生成覆盖率报告
pnpm test:e2e               # 运行 E2E 测试
```

### 技术约束

为了保持架构简洁和性能最优，项目遵循以下约束：

- 使用 **PostgreSQL + pgvector**（不使用 Pinecone/Chroma）
- 使用 **Drizzle ORM**（不使用 Prisma）
- 使用 **Biome**（不使用 ESLint + Prettier）
- 使用 **pnpm workspace**（不使用 Turborepo）
- 优先使用 **Server-Sent Events**（仅必要时使用 WebSocket）

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是报告 Bug、提出新功能建议，还是提交代码改进。

### 参与方式

1. **Fork 本仓库**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'feat: 添加某个很棒的功能'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **创建 Pull Request**

### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
feat(agents): 添加 Agent 创建 API
fix(workflow): 修复执行死锁问题
docs: 更新 README 文档
refactor(db): 迁移到 Drizzle ORM
```

### 代码质量要求

- 所有新功能需要添加单元测试（覆盖率 ≥ 80%）
- 通过 Biome 检查 (`pnpm check`)
- 通过 TypeScript 类型检查 (`pnpm type-check`)
- API 变更需要更新 `docs/spec.md`

---

## 🙏 致谢

感谢以下优秀的开源项目：

- [Next.js](https://nextjs.org/) - React 框架
- [Mastra](https://mastra.ai/) - AI Agent 框架
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [pgvector](https://github.com/pgvector/pgvector) - PostgreSQL 向量扩展
- [React Flow](https://reactflow.dev/) - 工作流编辑器
- [Biome](https://biomejs.dev/) - 工具链

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。
