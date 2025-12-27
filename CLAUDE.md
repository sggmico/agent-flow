# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

---

## 项目概述

**Agent Flow** 是一个 AI Agent 协作平台，使开发者能够通过可视化界面创建、编排和监控 AI Agent。该平台将 AI 从"问答工具"转变为"可协作、可审计、可执行的工作系统"。

**核心架构**：Monorepo 架构，通过共享包支持多端（Web、Desktop、VS Code 扩展、CLI）。

---

## 技术栈

### 前端
- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript 5.x
- **UI**：Tailwind CSS + shadcn/ui
- **状态管理**：Zustand + TanStack Query
- **工作流编辑器**：React Flow
- **实时通信**：Server-Sent Events (SSE) via Vercel AI SDK

### 后端与数据
- **数据库**：PostgreSQL 16+ (含 pgvector 扩展)
- **ORM**：Drizzle ORM (类型安全，零运行时开销)
- **向量搜索**：pgvector (嵌入在 PostgreSQL 中)
- **全文搜索**：PostgreSQL Full-Text Search
- **缓存**：Redis / Upstash Redis
- **队列**：BullMQ (基于 Redis)

### AI 引擎
- **框架**：Mastra (TypeScript 原生 agent 框架)
- **LLM**：Claude Sonnet 4 (主要)、GPT-4o、Gemini 2.0 Flash
- **Embeddings**：OpenAI text-embedding-3-large

### 工具链
- **包管理器**：pnpm
- **Monorepo**：pnpm workspace
- **Linter/Formatter**：Biome (替代 ESLint + Prettier)
- **测试**：Vitest (单元测试)、Playwright (E2E)
- **CI/CD**：GitHub Actions
- **部署**：Vercel (前端)、Neon/Supabase (数据库)

---

## 项目结构

```
agent-flow/
├── apps/                    # 平台特定应用
│   ├── web/                # Next.js Web 应用 (MVP)
│   ├── desktop/            # Tauri 桌面应用 (Phase 2)
│   ├── vscode/             # VS Code 扩展 (Phase 2)
│   └── cli/                # CLI 工具 (Phase 2)
├── packages/               # 共享代码 (90-100% 复用)
│   ├── shared/            # 业务逻辑 (100% 共享)
│   ├── ui/                # React 组件 (90% 共享)
│   ├── database/          # Drizzle schemas (100% 共享)
│   └── mastra/            # AI agent 配置 (100% 共享)
└── docs/
    ├── spec.md            # 功能规格说明
    ├── task.md            # 开发任务清单
    └── local/             # 私有规划文档 (不跟踪)
```

**注意**：匹配 `*local*` 的文件/目录已被 gitignore，包含私有规划文档。

---

## 架构原则

### 四层架构

```
┌─────────────────────────────────────────┐
│  前端层 (Next.js + React Flow)         │
│  - Agent Builder                        │
│  - Workflow Designer                    │
│  - Execution Monitor                    │
└─────────────────────────────────────────┘
              ↓ SSE
┌─────────────────────────────────────────┐
│  AI 引擎层 (Mastra)                     │
│  - Agent 管理                           │
│  - Workflow 编排                        │
│  - LLM 适配器                           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  工具与集成层                           │
│  - 代码分析 (Biome, ts-morph)          │
│  - Git API (GitHub/GitLab)              │
│  - 安全扫描 (Semgrep)                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  数据层 (PostgreSQL 统一方案)           │
│  - 关系型数据 (Drizzle ORM)            │
│  - 向量搜索 (pgvector)                  │
│  - 全文搜索 (PG FTS)                    │
│  + Redis 缓存                           │
└─────────────────────────────────────────┘
```

### 关键架构决策

1. **统一数据库**：PostgreSQL 同时处理关系型数据（通过 Drizzle ORM）和向量搜索（通过 pgvector 扩展），无需单独的 Pinecone/Elasticsearch 服务。

2. **SSE 优先于 WebSocket**：单向实时更新（agent 状态、进度）优先使用 Server-Sent Events。仅在需要双向通信时使用 WebSocket。

3. **Monorepo 代码复用**：`packages/shared/` 中的业务逻辑在 Web、Desktop、VS Code 和 CLI 平台间 100% 复用。`packages/ui/` 中的 UI 组件达到 90%+ 复用。

4. **Drizzle ORM**：选用 Drizzle 以实现 100% 类型安全且零运行时开销。所有数据库 schema 在 TypeScript 中定义并自动生成类型。

---

## 核心领域模型

### Agent
- **用途**：表示具有特定角色和能力的 AI agent
- **关键字段**：`id`、`name`、`role`、`model`、`systemPrompt`、`tools`、`status`
- **状态**：idle → working → completed/failed

### Workflow
- **用途**：定义多步骤 agent 协作流程
- **关键字段**：`id`、`name`、`steps[]`、`trigger`
- **执行模式**：串行、并行、条件、循环

### CodeEmbedding
- **用途**：存储向量化的代码块用于语义搜索
- **关键字段**：`filePath`、`codeChunk`、`embedding` (1536 维向量)、`metadata`
- **索引**：embedding 列上的 HNSW 索引，实现 10-30ms 查询性能

### Execution
- **用途**：跟踪工作流执行状态和结果
- **关键字段**：`workflowId`、`status`、`input`、`output`、`steps[]`
- **生命周期**：pending → running → completed/failed/cancelled

---

## 开发工作流

### 初始化设置

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际值：
# - DATABASE_URL (PostgreSQL with pgvector)
# - REDIS_URL
# - OPENAI_API_KEY (用于 embeddings)
# - ANTHROPIC_API_KEY (用于 Claude)

# 初始化数据库
pnpm db:migrate

# 启动开发服务器
pnpm dev
```

### 常用命令

```bash
# 开发
pnpm dev                    # 启动 Next.js 开发服务器
pnpm build                  # 构建生产版本
pnpm start                  # 启动生产服务器

# 数据库
pnpm db:generate            # 从 schema 变更生成 Drizzle 迁移
pnpm db:migrate             # 运行数据库迁移
pnpm db:studio              # 打开 Drizzle Studio (可视化数据库编辑器)
pnpm db:push                # 直接推送 schema 变更 (仅开发环境)

# 代码质量
pnpm check                  # 运行 Biome 检查 (lint + format)
pnpm check:fix              # 自动修复 Biome 问题
pnpm type-check             # 运行 TypeScript 类型检查

# 测试
pnpm test                   # 运行单元测试 (Vitest)
pnpm test:watch             # 监听模式运行测试
pnpm test:coverage          # 生成覆盖率报告 (目标: 80%+)
pnpm test:e2e               # 运行 E2E 测试 (Playwright)

# Monorepo
pnpm -F web dev             # 在特定工作空间运行命令 (web app)
pnpm -F @agent-flow/shared build  # 构建共享包
```

### Drizzle ORM 模式

```typescript
// 定义 schema (packages/database/schema/agents.ts)
import { pgTable, serial, text, timestamp, vector } from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  model: text('model').notNull(),
  status: text('status').default('idle'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 查询时完全类型安全
const result = await db.select().from(agents).where(eq(agents.id, 1));
// result 自动推导为 Agent[] 类型

// 关系定义独立
export const agentsRelations = relations(agents, ({ many }) => ({
  executions: many(executions),
}));
```

### pgvector 使用方法

```sql
-- 启用扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建带向量列的表
CREATE TABLE code_embeddings (
  id SERIAL PRIMARY KEY,
  embedding vector(1536),  -- OpenAI embedding 维度
  code_chunk TEXT,
  file_path TEXT
);

-- 创建 HNSW 索引用于快速相似度搜索
CREATE INDEX ON code_embeddings USING hnsw (embedding vector_cosine_ops);
```

```typescript
// Drizzle + pgvector 语义搜索
import { sql } from 'drizzle-orm';

const results = await db.execute(sql`
  SELECT *, 1 - (embedding <=> ${queryVector}::vector) as similarity
  FROM code_embeddings
  ORDER BY embedding <=> ${queryVector}::vector
  LIMIT 10
`);
```

---

## API 设计模式

### RESTful 路由 (Next.js App Router)

```typescript
// app/api/agents/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;

  const agents = await db.select().from(agentsTable)
    .limit(10)
    .offset((page - 1) * 10);

  return Response.json({ data: agents });
}

export async function POST(req: Request) {
  const body = await req.json();
  const validated = createAgentSchema.parse(body); // Zod 验证

  const agent = await db.insert(agentsTable).values(validated).returning();
  return Response.json(agent[0], { status: 201 });
}
```

### SSE 流式传输 (实时更新)

```typescript
// app/api/workflows/[id]/stream/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const update of executeWorkflow(params.id)) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(update)}\n\n`)
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## 代码质量标准

### 类型安全
- 所有数据库查询必须使用 Drizzle ORM (除 pgvector 外不使用原始 SQL)
- API 请求/响应体必须使用 Zod schemas 验证
- 禁止使用 `any` 类型，除非特殊情况（必须注释说明）

### 测试要求
- 单元测试覆盖率：`packages/shared/` 和 services ≥80%
- 所有 API 端点需要集成测试
- 关键用户流程需要 E2E 测试（agent 创建、workflow 执行）

### 性能目标
- API 响应时间 (P95)：<200ms
- 向量搜索 (Top-10)：<30ms
- 页面加载 (FCP)：<1.5s
- Biome 检查：全代码库 <500ms

---

## 多端策略

### Phase 1: Web (MVP)
专注于 `apps/web/` 的 Next.js 开发。所有业务逻辑必须放在 `packages/shared/` 以支持未来平台扩展。

### Phase 2: Desktop + 扩展
- **Desktop**：Tauri 应用包装 React UI (90% 代码复用)
- **VS Code**：扩展使用 `packages/shared/` 的所有逻辑
- **CLI**：Node.js 工具，100% 复用共享包

**代码组织规则**：永远不要在 `apps/web/` 中直接放置业务逻辑。始终提取到 `packages/shared/` 以实现跨平台复用。

---

## 关键参考文档

- **功能规格**：`docs/spec.md` - 完整的 API 规格、数据模型和功能需求
- **任务追踪**：`docs/local/task.md` (私有) - 开发任务检查清单和进度
- **技术栈分析**：`docs/local/tech-cherry-pick.md` (私有) - 详细的技术选型理由
- **架构规划**：`docs/local/kick-off.md` (私有) - 综合项目计划

---

## 关键约束

1. **禁止使用 Elasticsearch**：使用 PostgreSQL Full-Text Search
2. **禁止使用 Pinecone/Chroma**：使用 pgvector (PostgreSQL 扩展)
3. **禁止使用 ESLint/Prettier**：统一使用 Biome 进行 lint 和 format
4. **禁止使用 Turborepo**：使用 pnpm workspace 管理 monorepo
5. **SSE 优先**：仅在需要双向通信时使用 WebSocket

---

## 必需的环境变量

```bash
# 数据库
DATABASE_URL=               # PostgreSQL 连接字符串 (必须支持 pgvector)

# 缓存与队列
REDIS_URL=                  # Redis 连接字符串

# AI 服务
OPENAI_API_KEY=            # 用于 text-embedding-3-large
ANTHROPIC_API_KEY=         # 用于 Claude Sonnet 4
GOOGLE_API_KEY=            # 用于 Gemini (可选)

# Next.js
NEXT_PUBLIC_APP_URL=       # 应用 URL
```

---

## Git 工作流

- **主分支**：`main` (生产就绪代码)
- **提交规范**：Conventional Commits (强制)
  - `feat(agents): 添加 agent 创建 API`
  - `fix(workflow): 解决执行死锁问题`
  - `docs: 更新 API 规格说明`
  - `refactor(db): 迁移到 Drizzle ORM`
- **分支命名**：`feature/agent-management`、`fix/vector-search-bug`

---

## 编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | `getUserData`, `isActive` |
| 常量 | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY` |
| 组件/类 | PascalCase | `AgentCard`, `WorkflowEditor` |
| 文件名 | kebab-case | `agent-card.tsx`, `use-agents.ts` |
| Hooks | use前缀 + camelCase | `useAgents`, `useWorkflow` |

### 代码风格（Biome 强制）

- **缩进**：2 空格
- **行宽**：100 字符
- **引号**：单引号（JS/TS），双引号（JSX）
- **分号**：必须
- **尾随逗号**：必须

### React 组件规范

**组件结构顺序**：
```typescript
// 1. imports
// 2. types/interfaces
// 3. component definition
//   3.1 hooks (固定顺序)
//   3.2 event handlers
//   3.3 早期返回（loading/error）
//   3.4 JSX
```

**强制规则**：
- 函数组件优先，使用 `React.FC` 或省略
- Props 必须用 `interface` 定义（支持 extends）
- 事件处理函数前缀 `handle`：`handleSubmit`, `handleClick`
- 列表渲染必须有唯一 `key`（禁止用 index）
- 避免内联对象/函数定义（使用 `useMemo`/`useCallback`）

**Hooks 规则**：
- 固定顺序：状态 → 副作用 → 自定义 hooks
- `useEffect` 必须明确依赖项
- 避免 `useEffect` 中的副作用（首选 `useMutation`）

### TypeScript 严格规范

- **禁止 `any`**：除非特殊情况（需注释说明）
- **优先类型推导**：简单类型不需显式声明
- **API 类型**：所有 API 请求/响应用 Zod schema 验证
- **数据库类型**：Drizzle 自动推导，禁止手写
- **事件类型**：使用 React 内置类型（`React.MouseEvent<HTMLButtonElement>`）

### 性能优化

- 大列表使用虚拟滚动（`@tanstack/react-virtual`）
- 路由级别懒加载：`const Page = lazy(() => import('./Page'))`
- 图片使用 Next.js `<Image>`，启用优化
- 避免过度 memo（仅用于昂贵计算/复杂组件）

### 测试要求

- **覆盖率**：`packages/shared/` ≥80%，关键业务逻辑 100%
- **命名**：`describe('组件/功能', () => it('应该...', ...)`（中文描述）
- **文件位置**：`__tests__/` 或 `.test.ts` 后缀

### 禁止事项

- ❌ 在 `apps/web/` 中编写业务逻辑（应放 `packages/shared/`）
- ❌ 使用 `moment`（用 `date-fns`）
- ❌ 使用 `lodash`（用 `lodash-es` 或原生方法）
- ❌ 在 render 中定义组件
- ❌ 解构 reactive 对象（会失去响应性）

---

**最后更新**：2024-12-27
