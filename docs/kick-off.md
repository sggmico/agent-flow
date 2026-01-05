# Agent Flow - AI Agent 协作平台项目规划

> 综合项目规划文档 v1.2
> 创建时间: 2024-12-26
> 最后更新: 2024-12-27
> 基于：6份调研文档 + 多端架构评估 + 技术栈深度优化

---

## 📋 目录

- [项目定位](#项目定位)
- [痛点分析](#痛点分析)
- [核心价值主张](#核心价值主张)
- [技术架构](#技术架构)
- [核心功能模块](#核心功能模块)
- [技术栈选型](#技术栈选型)
- [多端架构策略](#多端架构策略)
- [开发路线图](#开发路线图)
- [学习资源](#学习资源)
- [商业价值](#商业价值)

---

## 🎯 项目定位

### 项目名称：Agent Flow

**Slogan**: *Agent-driven Workflow Execution Platform*

### 一句话描述

> 一个面向开发者的 **AI Agent 协作平台**：通过可视化方式创建、编排和监控 AI Agent，让 AI 从"回答问题的工具"升级为"可协作、可审计、可落地的工作执行系统"。

### 项目类型

- **产品定位**：开发者工具 + AI 工作流平台
- **目标用户**：前端/全栈工程师、技术团队、企业研发部门
- **使用场景**：代码审查、文档生成、知识管理、研发流程自动化

---

## 💡 痛点分析

### 当前 AI 应用的核心问题

基于行业调研和实际业务场景分析，我们识别出以下关键痛点：

#### 1. **AI 输出不可控、不可信** 🚨

**数据支撑**：
- 84% 的软件开发者使用 AI，但近一半不信任结果的准确性
- 开发者将 75% 的时间浪费在调试 AI 输出上

**具体表现**：
- 生成的代码质量参差不齐，需要人工逐行检查
- 缺少标准化的审查流程和质量保障机制
- AI 的"黑盒"特性导致结果难以解释和追溯

#### 2. **缺少可视化协作流程** 👁️

**问题描述**：
- 多步任务的执行过程无法查看
- Agent 之间的协作关系不透明
- 难以复盘和优化工作流

**影响**：
- 维护成本高
- 知识难以沉淀
- 错误难以定位

#### 3. **自动化流程难构建** 🔧

**现状**：
- 现有工具依赖手工编码或固定脚本
- 缺少可复用的能力单元
- 写一个 AI 子流程难以复用和组合

**结果**：
- 重复造轮子
- 效率低下
- 技术门槛高

#### 4. **与业务系统难结合** 🔗

**挑战**：
- AI 与 CRM/工单/开发流程集成不易
- 缺少标准化的集成方案
- 需要大量定制开发

**影响**：
- AI 停留在"玩具"阶段
- 无法真正落地生产环境
- ROI 难以证明

#### 5. **知识孤岛严重** 📚

**具体场景**：
- 企业内部文档分散（PDF、Markdown、Notion、Slack）
- 员工花费 20% 时间寻找信息
- 核心逻辑只有少数人理解，离职后知识流失

---

## 🎁 核心价值主张

Agent Flow 通过以下方式解决上述痛点：

### 1. **可信赖的 AI 执行**

- ✅ **多 Agent 协作审查**：代码由专职 Agent（安全、性能、最佳实践）分别审查
- ✅ **透明的执行流程**：每一步操作都可追溯、可审计
- ✅ **人机协作机制**：关键决策点支持人工介入和审查

### 2. **可视化工作流编排**

- ✅ **拖拽式流程设计**：类似 n8n 的可视化界面
- ✅ **实时执行监控**：Timeline 和关系图展示 Agent 协作过程
- ✅ **状态机管理**：任务状态清晰（idle/working/completed/failed）

### 3. **可复用的 Agent 能力**

- ✅ **Agent 市场**：预置的 Agent 模板（代码审查、文档生成、测试生成）
- ✅ **组件化设计**：Agent 和 Tool 可自由组合
- ✅ **知识沉淀**：成功的工作流可保存为模板

### 4. **企业级集成能力**

- ✅ **多系统连接**：GitHub、GitLab、Jira、Notion、Slack
- ✅ **MCP 协议支持**：标准化的工具集成方式
- ✅ **API 优先**：所有功能均可通过 API 调用

### 5. **智能知识管理**

- ✅ **多源数据索引**：代码库、文档、对话记录统一向量化
- ✅ **语义搜索**：基于 RAG 的智能检索
- ✅ **自动文档生成**：代码与文档同步更新

---

## 🏗️ 技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    前端层 (Next.js 15)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │ Agent Builder│  │Flow Designer│  │  Monitor UI  │    │
│  │  创建 Agent  │  │  编排工作流  │  │  执行监控     │    │
│  │ + Skills 选择 │  │ 拖拽式编排   │  │ Skill 调用追踪│   │
│  └─────────────┘  └─────────────┘  └──────────────┘    │
│         ↓                  ↓                  ↓          │
│  ┌──────────────────────────────────────────────────┐  │
│  │      前端状态管理 (Zustand + TanStack Query)     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓ SSE (Server-Sent Events)
┌─────────────────────────────────────────────────────────┐
│                  AI 引擎层 (Mastra Core)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  Agent 管理   │  │ Workflow 引擎 │  │   Memory    │  │
│  │  defineAgent │  │defineWorkflow│  │ Redis Cache │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│         ↓                  ↓                  ↓         │
│  ┌──────────────────────────────────────────────────┐ │
│  │          LLM 适配层 (Claude/GPT-4/Gemini)        │ │
│  │         + OpenAI Function Calling (Skills)       │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              🧩 Agent Skills 层 (新增)                  │
│  ┌──────────────────────────────────────────────────┐ │
│  │          Skill Registry (技能注册表)             │ │
│  │  • 内置 Skills (文件、代码、Git、安全扫描)       │ │
│  │  • 自定义 Skills (用户可扩展)                    │ │
│  │  • Skill Execution Engine (执行引擎)            │ │
│  │  • Skill Cost Tracking (成本追踪)               │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   工具 & 集成层                          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐     │
│  │Code Analysis│  │  Git API   │  │   MCP Tools  │     │
│  │Biome/TS    │  │GitHub/Lab  │  │  可扩展工具集 │     │
│  └────────────┘  └────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              数据存储层 (PostgreSQL 16+ 统一方案)         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  向量搜索     │  │  关系型数据   │  │  全文搜索   │  │
│  │  pgvector    │  │ Drizzle ORM  │  │  PG FTS     │  │
│  │  代码/文档向量 │  │ 任务/状态/用户 │  │  文本检索   │  │
│  │              │  │ + Skills 存储 │  │             │  │
│  │              │  │ (skills,      │  │             │  │
│  │              │  │  agent_skills,│  │             │  │
│  │              │  │  skill_execs) │  │             │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│                     统一 PostgreSQL 数据库               │
│                     + Redis 缓存层                       │
└─────────────────────────────────────────────────────────┘
```

### 核心技术决策

#### 为什么选择 Mastra？

1. **TypeScript 原生**：类型安全，适合前端工程师
2. **工程化思维**：注重可测试性、可维护性、可组合性
3. **完整的生态**：Agent、Workflow、Tool、Memory 一体化
4. **A2A 支持**：原生支持多 Agent 协作
5. **可视化能力**：内置工作流可视化支持

#### 为什么是前端主导？

1. **用户体验至关重要**：工作流编排需要优秀的交互设计
2. **可视化是核心竞争力**：类似 Figma、n8n 的编辑体验
3. **实时反馈**：WebSocket/SSE 实现流式输出和状态同步
4. **前端 × AI 的新机会**：这是前端工程师进入 AI 领域的最佳路径

---

## 🧩 核心功能模块

### Phase 1: MVP 核心功能（第 1-3 周）

#### 模块 1: Agent 管理 🤖

**功能**：
- 创建和配置 Agent（角色、能力、使用的模型）
- Agent Card 展示（能力声明、接口定义）
- Agent 状态管理（idle/working/completed/failed）

**技术要点**：
```typescript
// Agent 配置结构
interface AgentConfig {
  id: string;
  name: string;
  role: string; // "code-reviewer" | "doc-generator" | "security-scanner"
  model: "claude-sonnet-4" | "gpt-4o" | "gemini-2.0";
  tools: Tool[];
  systemPrompt: string;
  capabilities: string[]; // 能力声明
}
```

**用户价值**：
- 快速创建专职 Agent
- 清晰的能力边界
- 可复用的 Agent 模板

---

#### 模块 2: 工作流编排 🔄

**功能**：
- 可视化工作流设计器（基于 React Flow）
- 定义 Agent 之间的协作关系（串行/并行/条件分支）
- 任务输入输出映射

**技术要点**：
```typescript
// Workflow 定义
interface WorkflowDefinition {
  id: string;
  name: string;
  trigger: "manual" | "webhook" | "schedule";
  steps: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  type: "agent" | "tool" | "condition";
  agentId?: string;
  dependencies: string[]; // 依赖的前置步骤
  inputMapping: Record<string, string>;
  outputMapping: Record<string, string>;
}
```

**用户价值**：
- 低代码构建复杂流程
- 清晰的任务依赖关系
- 易于调试和优化

---

#### 模块 3: 代码库智能索引 📚

**功能**：
- 扫描和解析代码仓库（支持 TypeScript/JavaScript/Python）
- AST 分析和语义块提取
- 向量化存储（Pinecone/Chroma）
- 智能代码搜索

**技术要点**：
```typescript
// 代码索引服务
class CodeIndexer {
  async indexRepository(repoPath: string) {
    // 1. 扫描代码文件
    const files = await this.scanCodeFiles(repoPath);

    // 2. 解析 AST 并提取语义块
    const codeBlocks = await this.parseAndChunk(files);

    // 3. 生成向量并存储
    const embeddings = await createEmbeddings(codeBlocks);
    await this.vectorDB.upsert(embeddings);

    // 4. 构建元数据索引
    await this.buildMetadataIndex(codeBlocks);
  }
}
```

**用户价值**：
- 快速理解大型代码库
- 语义级代码搜索
- 为 Agent 提供精准上下文

---

#### 模块 4: 智能代码问答 💬

**功能**：
- 基于 RAG 的代码问答
- 上下文感知对话
- 代码片段引用和跳转

**技术要点**：
```typescript
// 问答 Agent
class CodeQAAgent {
  async answerQuestion(question: string, repoContext: string) {
    // 1. 检索相关代码片段 (RAG)
    const relevantCode = await this.retrieveRelevantCode(question);

    // 2. 构建增强提示词
    const prompt = this.buildPrompt({
      question,
      codeContext: relevantCode,
      repoMetadata: repoContext
    });

    // 3. 调用 LLM
    const answer = await mastra.generate({
      model: 'claude-sonnet-4',
      prompt,
      temperature: 0.3
    });

    return this.formatAnswer(answer, relevantCode);
  }
}
```

**用户价值**：
- 新人快速上手代码库
- 降低知识传递成本
- 24/7 可用的代码助手

---

### Phase 2: 进阶功能（第 4-6 周）

#### 模块 5: AI 代码审查 🔍

**功能**：
- 多维度代码审查（安全、性能、最佳实践、架构）
- 自动生成审查报告
- 在 PR 中自动评论

**Multi-Agent 架构**：
```typescript
class AICodeReviewer {
  async reviewPR(prDiff: GitDiff) {
    const agents = {
      security: new SecurityAgent(),      // 安全漏洞检查
      performance: new PerfAgent(),       // 性能问题分析
      bestPractices: new BPAgent(),       // 最佳实践检查
      architecture: new ArchAgent()       // 架构一致性
    };

    // 并行执行多个 Agent
    const reviews = await Promise.all(
      Object.values(agents).map(agent => agent.review(prDiff))
    );

    // 汇总并生成报告
    return this.aggregateReviews(reviews);
  }
}
```

**创新点**：
- **专业化分工**：每个 Agent 只负责一个维度
- **并行执行**：提高审查速度
- **可配置规则**：团队可自定义审查标准

---

#### 模块 7: 自动文档生成 📝

**功能**：
- API 文档自动生成
- 使用示例代码生成
- 架构说明文档
- 变更日志自动更新

**技术实现**：
```typescript
class DocGenerator {
  async generateDocs(codeFile: string) {
    // 1. 解析代码结构
    const structure = await this.parseStructure(codeFile);

    // 2. 生成 API 文档
    const apiDocs = await this.generateAPIDocs(structure);

    // 3. 生成使用示例
    const examples = await this.generateExamples(structure);

    // 4. 生成架构说明
    const architecture = await this.explainArchitecture(structure);

    return { apiDocs, examples, architecture };
  }
}
```

**用户价值**：
- 文档与代码永不脱节
- 节省 50% 的文档维护时间
- 提升文档质量和一致性

---

#### 模块 8: 执行监控与可视化 👁️‍🗨️

**功能**：
- 实时执行状态展示
- Agent 协作关系图
- 执行 Timeline
- 错误追踪和重试机制

**UI 设计**：
```typescript
interface ExecutionMonitor {
  // 三栏布局
  sidebar: {
    workflowList: "工作流列表";
    executionHistory: "执行历史";
  };
  main: {
    relationshipGraph: "Agent 关系图（React Flow）";
    timeline: "执行时间线";
    realTimeLog: "实时日志流";
  };
  detail: {
    agentStatus: "Agent 状态详情";
    outputPreview: "输出预览";
    errorDetail: "错误详情";
  };
}
```

**技术要点**：
- WebSocket 实时推送
- SSE 流式输出
- 时间旅行调试（回放执行过程）

---

### Phase 3: 高级功能（第 7-10 周）

#### 模块 9: 知识图谱 🕸️

**功能**：
- 代码依赖关系图谱
- 业务概念图谱
- 人员-代码关联图谱

**应用场景**：
- 影响分析：修改这个函数会影响哪些模块？
- 责任人查找：这个功能的负责人是谁？
- 技术债务可视化

---

#### 模块 10: 变更影响分析 📊

**功能**：
- 分析代码变更的影响范围
- 生成受影响的模块列表
- 建议需要通知的人员

**技术实现**：
```typescript
class ImpactAnalyzer {
  async analyzeChange(diff: GitDiff) {
    // 1. 构建依赖图
    const depGraph = await this.buildDependencyGraph();

    // 2. 追踪影响链
    const impactChain = this.traceImpact(diff, depGraph);

    // 3. 生成可视化报告
    return this.generateImpactReport(impactChain);
  }
}
```

---

#### 模块 11: 重构建议 🔨

**功能**：
- 识别代码坏味道
- 生成重构方案
- 自动化重构（需人工确认）

**创新点**：
- 基于项目历史数据的个性化建议
- 考虑团队编码风格
- 评估重构风险

---

## 🛠️ 技术栈选型

### 前端技术栈

```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript 5.x",
  "ui": {
    "framework": "Tailwind CSS",
    "components": "shadcn/ui",
    "editor": "Monaco Editor (VS Code 内核)",
    "diagram": "React Flow (工作流可视化)"
  },
  "state": {
    "global": "Zustand",
    "server": "TanStack Query (React Query)"
  },
  "realtime": {
    "primary": "Server-Sent Events (SSE)",
    "streaming": "Vercel AI SDK",
    "fallback": "WebSocket (仅双向通信场景)"
  }
}
```

### AI 引擎层

```json
{
  "framework": "Mastra",
  "llm": {
    "primary": "Claude Sonnet 4",
    "alternative": ["GPT-4o", "Gemini 2.0 Flash"],
    "embedding": "OpenAI text-embedding-3-large"
  }
}
```

### 数据层技术栈

```json
{
  "database": "PostgreSQL 16+",
  "orm": "Drizzle ORM",
  "extensions": {
    "vector": "pgvector (向量搜索)",
    "fulltext": "PostgreSQL Full-Text Search (全文搜索)"
  },
  "cache": "Redis / Upstash Redis",
  "queue": "BullMQ (基于 Redis)"
}
```

### 后端技术栈

```json
{
  "runtime": "Node.js 20+",
  "codeAnalysis": {
    "typescript": "ts-morph",
    "javascript": "@babel/parser",
    "python": "tree-sitter"
  },
  "tools": {
    "linter": "Biome (统一 lint + format)",
    "security": "Semgrep",
    "testing": "Vitest"
  }
}
```

### DevOps & 工具链

```json
{
  "packageManager": "pnpm",
  "monorepo": "pnpm workspace",
  "ci": "GitHub Actions",
  "testing": {
    "unit": "Vitest",
    "e2e": "Playwright",
    "coverage": "Vitest Coverage"
  },
  "quality": {
    "linter": "Biome (10-100x 快于 ESLint)",
    "formatter": "Biome (内置，替代 Prettier)",
    "typeCheck": "TypeScript",
    "commit": "Conventional Commits"
  },
  "deployment": {
    "platform": "Vercel (Next.js)",
    "database": "Neon / Supabase (Serverless PostgreSQL)",
    "cache": "Upstash Redis (Edge)"
  }
}
```

### 技术选型优化说明

本项目在技术栈选择上进行了深度优化，重点关注**成本降低**、**性能提升**和**架构简化**：

#### 核心优化决策

| 技术领域 | 选择 | 优化收益 |
|---------|------|---------|
| **ORM** | Drizzle ORM | 类型安全 100%，查询性能 +75% |
| **向量数据库** | pgvector (PostgreSQL 扩展) | 成本节省 $70/月，查询 10-30ms |
| **全文搜索** | PostgreSQL Full-Text Search | 移除 Elasticsearch，节省 $50/月 |
| **实时通信** | Server-Sent Events (SSE) | 内存占用 -40%，实现更简单 |
| **Linter/Formatter** | Biome | 速度提升 20-50 倍 |
| **Monorepo** | pnpm workspace | 简单高效，适合初期阶段 |

**总体收益**：
- 💰 **月度成本**: $160 → $35 (节省 78%)
- ⚡ **性能提升**: 查询速度 +75%，Lint 速度 +96%
- 🔧 **服务简化**: 4 个独立服务 → 2 个服务

> 📖 **详细技术分析**：完整的技术选型对比、性能测试数据、成本分析和实施指南请参考 [`tech-cherry-pick.md`](./tech-cherry-pick.md)

---

## 🌐 多端架构策略

### 平台优先级评估

基于用户价值、技术复杂度和代码复用性的综合评估：

| 平台 | 优先级 | 用户价值 | 技术复杂度 | 代码复用率 | 开发阶段 |
|------|--------|----------|-----------|-----------|----------|
| **Web 浏览器** | ⭐⭐⭐⭐⭐ | 极高 | 中等 | 基准 | MVP |
| **VS Code 扩展** | ⭐⭐⭐⭐⭐ | 极高 | 低 | 90% | Phase 2 |
| **Desktop 应用** | ⭐⭐⭐⭐ | 高 | 中等 | 95% | Phase 2 |
| **CLI 工具** | ⭐⭐⭐⭐ | 高 | 低 | 100% | Phase 2 |
| **Mobile 应用** | ⭐⭐ | 低 | 高 | 80% | 未来 |

### 技术方案选择

#### ❌ 不推荐：Kotlin Multiplatform (KMP)

**原因**：
- 🚫 与现有 TypeScript + Mastra 技术栈不兼容
- 🚫 需要重写所有代码到 Kotlin
- 🚫 团队学习曲线陡峭（前端工程师不熟悉 Kotlin）
- 🚫 失去 React 生态系统和 npm 包支持

#### ✅ 推荐：Tauri + TypeScript 生态

**核心优势**：
- ✅ **100% TypeScript 兼容**：无需代码重写
- ✅ **90-100% 代码复用**：业务逻辑、UI 组件完全共享
- ✅ **Mastra 直接可用**：所有 AI 配置无缝迁移
- ✅ **原生性能**：Rust 后端，比 Electron 快 2-3 倍
- ✅ **极小体积**：8MB vs Electron 100MB（减少 92%）
- ✅ **前端友好**：使用熟悉的 React + TypeScript

**性能对比（Tauri vs Electron）**：

```bash
启动时间:  Tauri 2s   vs  Electron 4s   (+50% 更快)
内存占用:  Tauri 60MB vs  Electron 150MB (-60%)
安装包:    Tauri 8MB  vs  Electron 100MB (-92%)
```

### Monorepo 项目结构

```
agent-flow/
├── apps/
│   ├── web/                    # 🌐 Next.js Web 应用 (MVP)
│   │   ├── app/
│   │   └── package.json
│   ├── desktop/                # 💻 Tauri 桌面应用 (Phase 2)
│   │   ├── src/               # React UI (复用 web 90%+)
│   │   ├── src-tauri/         # Rust 后端
│   │   └── package.json
│   ├── vscode/                 # 🔌 VS Code 扩展 (Phase 2)
│   │   ├── src/
│   │   └── package.json
│   └── cli/                    # 🖥️ CLI 工具 (Phase 2)
│       ├── src/
│       └── package.json
├── packages/
│   ├── shared/                 # 🔥 100% 共享业务逻辑
│   │   ├── agents/            # Agent 配置
│   │   ├── workflows/         # 工作流定义
│   │   └── services/          # API 服务
│   ├── ui/                     # 🎨 90% 共享 UI 组件
│   │   ├── components/
│   │   └── styles/
│   ├── database/               # 🗄️ 100% 共享数据层
│   │   ├── schema/            # Drizzle 表定义
│   │   └── queries/           # 查询逻辑
│   └── mastra/                 # 🤖 100% 共享 AI 配置
│       ├── agents/
│       └── tools/
├── pnpm-workspace.yaml
└── package.json
```

### 代码复用示例

**100% 业务逻辑共享**：

```typescript
// packages/shared/src/agents/code-reviewer.ts
// 此文件在所有平台完全相同使用
export class CodeReviewAgent {
    private mastra: Mastra;

    async review(code: string) {
        return await this.mastra.execute('review', { code });
    }
}

// ✅ Web 使用
import { CodeReviewAgent } from '@agent-flow/shared';

// ✅ Desktop 使用（完全相同）
import { CodeReviewAgent } from '@agent-flow/shared';

// ✅ VS Code 使用（完全相同）
import { CodeReviewAgent } from '@agent-flow/shared';

// ✅ CLI 使用（完全相同）
import { CodeReviewAgent } from '@agent-flow/shared';
```

**90%+ UI 组件共享**：

```typescript
// packages/ui/src/WorkflowCanvas.tsx
// Web 和 Desktop 直接复用，VS Code 需要适配为 Webview

export function WorkflowCanvas({ workflow }: Props) {
    return (
        <ReactFlow nodes={workflow.nodes} edges={workflow.edges}>
            {/* 可视化工作流 */}
        </ReactFlow>
    );
}
```

### 三阶段实施计划

#### Phase 1: MVP - Web Only（Week 1-4）

**目标**：专注 Web 平台，快速验证核心功能

```bash
✅ 只开发 apps/web/
✅ 构建 packages/shared/ 为后续多端做准备
✅ 确保业务逻辑与 UI 分离
```

#### Phase 2: 多端扩展（Week 5-8）

**目标**：复用 90% 代码，快速支持 Desktop + VS Code + CLI

```bash
✅ Desktop: Tauri 封装（2-3 天）
   - 复用所有 React UI
   - 添加 Rust 后端增强功能（文件系统访问）

✅ VS Code: 扩展开发（3-4 天）
   - 复用所有业务逻辑
   - Webview 中使用相同 React 组件

✅ CLI: Node.js 工具（1-2 天）
   - 100% 复用 packages/shared
   - 添加命令行参数解析
```

#### Phase 3: 优化与移动端（未来）

```bash
⚠️ Mobile: 仅在有明确需求时考虑
   - 使用 Capacitor + React
   - 复用 80% UI 组件
   - 适配触摸交互
```

### 开发效率对比

**不使用多端架构（分别开发）**：
```
Web:     100% 工作量
Desktop: 100% 工作量
VS Code: 100% 工作量
CLI:     100% 工作量
总计:    400% 工作量 ❌
```

**使用 TypeScript Monorepo + 共享包**：
```
Web:     100% 工作量 (基准)
Desktop: +20% 工作量 (Tauri 配置 + Rust 封装)
VS Code: +15% 工作量 (扩展适配)
CLI:     +5% 工作量 (命令行包装)
总计:    140% 工作量 ✅ (节省 65%)
```

### 核心技术栈更新

```json
{
    "monorepo": "pnpm workspace",
    "platforms": {
        "web": "Next.js 15",
        "desktop": "Tauri 2.0 + React",
        "vscode": "VS Code Extension API",
        "cli": "Node.js + Commander.js"
    },
    "shared": {
        "language": "TypeScript 5.x",
        "ai": "Mastra",
        "ui": "React + Tailwind + shadcn/ui",
        "database": "Drizzle ORM + PostgreSQL + pgvector",
        "state": "Zustand"
    }
}
```

### 关键决策总结

| 决策点 | 选择 | 理由 |
|-------|------|------|
| **跨平台方案** | Tauri + TypeScript | 100% 代码复用，原生性能，前端友好 |
| **是否使用 KMP** | ❌ 否 | 与 TypeScript 栈不兼容，学习成本高 |
| **Desktop 技术** | Tauri > Electron | -92% 体积，-60% 内存，+50% 启动速度 |
| **Monorepo 工具** | pnpm workspace | 简单高效，成熟稳定 |
| **优先平台** | Web → Desktop/VS Code/CLI → Mobile | 价值驱动，渐进实现 |

> 💡 **详细技术分析**：完整的多端方案对比、性能测试数据和实现细节请参考 [`docs/multi-platform.md`](./multi-platform.md)

---

## 🗓️ 开发路线图

### Week 1-2: 基础搭建 🏗️

**目标**：完成项目脚手架和基础功能

#### Day 1-3: 项目初始化
- [ ] 创建 Next.js 项目（App Router）
- [ ] 配置 TypeScript + Biome
- [ ] 集成 Tailwind CSS + shadcn/ui
- [ ] 配置 Mastra 框架
- [ ] 设置项目目录结构

#### Day 4-7: 代码解析引擎
- [ ] 集成 ts-morph
- [ ] 实现代码文件扫描
- [ ] 实现 AST 解析和遍历
- [ ] 实现代码块智能分割
- [ ] 编写单元测试

#### Day 8-10: 向量化与检索
- [ ] 集成 Pinecone/Chroma
- [ ] 实现代码向量化
- [ ] 实现语义搜索
- [ ] 优化检索性能
- [ ] 测试检索准确性

#### Day 11-14: AI 对话核心
- [ ] 配置 Mastra Agent
- [ ] 实现 RAG 流程
- [ ] 编写 Prompt 模板
- [ ] 实现流式输出
- [ ] 测试问答质量

---

### Week 3: 前端界面 🎨

#### Day 15-17: 代码查看器
- [ ] 集成 Monaco Editor
- [ ] 实现语法高亮
- [ ] 实现代码跳转
- [ ] 实现代码搜索
- [ ] 实现主题切换

#### Day 18-20: 对话界面
- [ ] 设计对话 UI
- [ ] 实现 Markdown 渲染
- [ ] 实现代码块高亮
- [ ] 实现流式输出显示
- [ ] 实现代码引用跳转

#### Day 21: 整合与测试
- [ ] 端到端功能测试
- [ ] 性能优化
- [ ] Bug 修复
- [ ] 文档编写

**里程碑**：MVP 版本可演示

---

### Week 4-5: Agent 管理与工作流 🤖

#### Day 22-25: Agent 管理
- [ ] 实现 Agent 创建 UI
- [ ] 实现 Agent 配置表单
- [ ] 实现 Agent Card 组件
- [ ] 实现 Agent 列表管理
- [ ] 实现 Agent 状态监控

#### Day 26-29: 工作流编排
- [ ] 集成 React Flow
- [ ] 实现拖拽式流程设计器
- [ ] 实现节点配置面板
- [ ] 实现连线逻辑
- [ ] 实现工作流保存和加载

#### Day 30-35: 工作流执行引擎
- [ ] 实现 Mastra Workflow 集成
- [ ] 实现任务调度逻辑
- [ ] 实现状态机管理
- [ ] 实现错误处理和重试
- [ ] 实现执行日志记录

**里程碑**：可创建和执行简单工作流

---

### Week 6-7: 代码审查功能 🔍

#### Day 36-40: Multi-Agent 审查架构
- [ ] 设计 Agent 协作协议
- [ ] 实现安全审查 Agent
- [ ] 实现性能审查 Agent
- [ ] 实现最佳实践 Agent
- [ ] 实现架构一致性 Agent

#### Day 41-45: GitHub 集成
- [ ] 集成 GitHub API
- [ ] 实现 PR 读取
- [ ] 实现代码 diff 分析
- [ ] 实现自动评论
- [ ] 实现审查报告生成

#### Day 46-49: 审查规则配置
- [ ] 实现规则配置 UI
- [ ] 实现自定义规则引擎
- [ ] 实现规则测试功能
- [ ] 编写预置规则库

**里程碑**：可自动审查 PR 并生成报告

---

### Week 8-9: 文档生成与监控 📝

#### Day 50-54: 文档生成
- [ ] 实现 API 文档生成
- [ ] 实现使用示例生成
- [ ] 实现架构说明生成
- [ ] 实现文档模板系统
- [ ] 实现文档版本管理

#### Day 55-59: 执行监控
- [ ] 实现 WebSocket 实时通信
- [ ] 实现执行状态可视化
- [ ] 实现 Timeline 组件
- [ ] 实现关系图组件
- [ ] 实现日志查看器

#### Day 60-63: 可观测性
- [ ] 实现执行历史记录
- [ ] 实现性能指标收集
- [ ] 实现错误追踪
- [ ] 实现时间旅行调试

**里程碑**：完整的监控和文档能力

---

### Week 10+: 高级功能与优化 🚀

#### 知识图谱
- [ ] 设计图谱数据模型
- [ ] 实现依赖关系提取
- [ ] 实现图谱可视化
- [ ] 实现图谱查询 API

#### 变更影响分析
- [ ] 实现依赖图构建
- [ ] 实现影响链追踪
- [ ] 实现影响报告生成
- [ ] 实现可视化展示

#### 性能优化
- [ ] 代码分割和懒加载
- [ ] 缓存策略优化
- [ ] 数据库查询优化
- [ ] 并发处理优化

#### 工程化
- [ ] 完善单元测试（80%+ 覆盖率）
- [ ] 完善集成测试
- [ ] 完善 E2E 测试
- [ ] 性能基准测试
- [ ] 安全审计

**里程碑**：生产就绪版本

---

## 📚 学习资源

### Mastra 生态

1. **Mastra 官方文档**
   - 地址：https://mastra.ai/docs
   - 学习重点：Agent、Workflow、Tool、Memory 核心概念

2. **Mastra GitHub**
   - 仓库：https://github.com/mastra-ai/mastra
   - 学习重点：源码阅读、示例代码、最佳实践

3. **CLOSX 项目**
   - 描述：基于 Mastra 的交互式 CLI Agent
   - 学习重点：Tool 定义、多模型配置、项目结构

### AI Agent 架构

4. **Continue.dev** ⭐⭐⭐⭐⭐
   - 仓库：https://github.com/continuedev/continue
   - 学习重点：VS Code 扩展、代码上下文管理、RAG 应用

5. **Aider** ⭐⭐⭐⭐⭐
   - 仓库：https://github.com/paul-gauthier/aider
   - 学习重点：AI 驱动代码编辑、Git 集成、Prompt Engineering

6. **Sourcegraph Cody** ⭐⭐⭐⭐⭐
   - 仓库：https://github.com/sourcegraph/cody
   - 学习重点：企业级架构、上下文窗口管理、多模型支持

### Multi-Agent 协作

7. **Microsoft AutoGen**
   - 仓库：https://github.com/microsoft/autogen
   - 学习重点：多 Agent 对话、A2A 协作模式

8. **OpenAI Swarm**
   - 仓库：https://github.com/openai/swarm
   - 学习重点：轻量级 Agent 协作、任务编排

9. **CrewAI**
   - 仓库：https://github.com/crewAIInc/crewAI
   - 学习重点：角色化 Agent、协作协议

### 工作流可视化

10. **LangFlow**
    - 仓库：https://github.com/langflow-ai/langflow
    - 学习重点：可视化编排 UI、前端架构

11. **Flowise**
    - 仓库：https://github.com/FlowiseAI/Flowise
    - 学习重点：商业级 Workflow UI、集成方案

### 代码分析

12. **Bloop**
    - 仓库：https://github.com/BloopAI/bloop
    - 学习重点：代码搜索引擎、向量数据库应用

13. **Stripe Agent Toolkit**
    - 仓库：https://github.com/stripe/agent-toolkit
    - 学习重点：业务 API 封装为 Tool

### 知识管理

14. **Verba (by Weaviate)**
    - 仓库：https://github.com/weaviate/Verba
    - 学习重点：RAG 应用、数据摄入-检索-可视化全链路

---

## 💰 商业价值

### 解决的核心问题

1. **降低代码库学习曲线**
   - 新人从 2-4 周 → 1-2 天理解核心逻辑
   - ROI：节省 80% 的 onboarding 时间

2. **提升 Code Review 效率**
   - 自动发现 80% 的常规问题
   - 人工只需关注架构和业务逻辑
   - ROI：节省 50% 的 Review 时间

3. **活文档系统**
   - 文档与代码永不脱节
   - 节省 50% 的文档维护成本
   - ROI：提升文档可信度和使用率

4. **知识永久沉淀**
   - 核心逻辑不再依赖个人
   - 离职风险降低
   - ROI：降低知识流失风险

### 商业模式

#### 开源版本（免费）
- ✅ 核心功能：Agent 管理、工作流编排、代码问答
- ✅ 本地部署
- ✅ 社区支持

#### Pro 版本（付费）
- ✅ 企业级功能：团队协作、权限管理、审计日志
- ✅ 高级 Agent：定制化审查规则、行业最佳实践
- ✅ 私有部署支持
- ✅ 技术支持和培训

#### SaaS 服务（订阅）
- ✅ 云端托管，按 repo 数量收费
- ✅ 多团队管理
- ✅ 高可用保障
- ✅ 数据安全和备份

### 目标市场

1. **个人开发者**：学习和实践 AI Agent 技术
2. **创业团队**：提升研发效率，降低成本
3. **中小企业**：标准化代码质量，知识管理
4. **大型企业**：私有部署，定制化方案

### 竞争优势

1. **技术栈现代化**：TypeScript、Next.js、Mastra
2. **用户体验优先**：前端工程师主导的产品设计
3. **开源策略**：建立社区和生态
4. **可扩展性强**：MCP 协议支持任意工具集成
5. **A2A 前瞻性**：为 Agent 协作时代做准备

---

## 🎯 项目成功指标

### 技术指标

- [ ] 代码测试覆盖率 ≥ 80%
- [ ] API 响应时间 P95 < 200ms
- [ ] 前端 FCP < 1.5s
- [ ] 向量检索准确率 > 90%
- [ ] 系统可用性 > 99.9%

### 产品指标

- [ ] 用户留存率（周） > 40%
- [ ] 核心功能使用率 > 60%
- [ ] 用户满意度评分 > 4.5/5
- [ ] GitHub Star 数 > 1000（6个月内）
- [ ] 付费转化率 > 5%

### 业务指标

- [ ] 节省 Code Review 时间 > 50%
- [ ] 降低新人上手时间 > 80%
- [ ] 提升代码质量（Bug 数量减少 > 30%）
- [ ] 文档使用率提升 > 200%

---

## 🚀 下一步行动

### 立即可执行的任务

1. **技术预研**
   - [ ] 深入学习 Mastra 框架（1-2 天）
   - [ ] 研究 RAG 技术和向量数据库（1-2 天）
   - [ ] 学习代码分析工具（ts-morph, babel）（1 天）

2. **原型开发**
   - [ ] 创建 Next.js + Mastra 项目骨架（0.5 天）
   - [ ] 实现第一个 Agent（代码问答）（1-2 天）
   - [ ] 实现第一个 Workflow（代码审查）（2-3 天）

3. **UI 设计**
   - [ ] 设计 Agent 管理界面（1 天）
   - [ ] 设计工作流编排界面（2 天）
   - [ ] 设计执行监控界面（1 天）

4. **文档编写**
   - [ ] 编写项目 README（0.5 天）
   - [ ] 编写开发指南（1 天）
   - [ ] 编写 API 文档（持续）

---

## 📝 附录

### 项目目录结构

```
agent-flow/
├── apps/
│   ├── web/                 # Next.js 前端应用
│   │   ├── app/            # App Router 页面
│   │   ├── components/     # React 组件
│   │   ├── lib/            # 工具函数
│   │   └── styles/         # 样式文件
│   └── api/                # API 服务（可选独立部署）
├── packages/
│   ├── mastra-config/      # Mastra Agent 配置
│   ├── code-analyzer/      # 代码分析工具
│   ├── vector-db/          # 向量数据库客户端
│   └── shared/             # 共享代码
├── docs/                   # 项目文档
├── scripts/                # 构建脚本
└── tests/                  # 测试文件
```

### 环境变量配置

```bash
# AI 模型
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=

# 向量数据库
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=

# 数据库
DATABASE_URL=
REDIS_URL=

# GitHub 集成
GITHUB_TOKEN=
GITHUB_WEBHOOK_SECRET=

# 应用配置
NODE_ENV=development
PORT=3000
```

---

## 🎓 总结

Agent Flow 是一个：

- ✅ **解决真实痛点**的项目（代码理解、质量保障、知识管理）
- ✅ **技术前沿**的项目（Mastra、RAG、Multi-Agent、A2A）
- ✅ **适合前端**的项目（优秀的 UX 是核心竞争力）
- ✅ **可持续发展**的项目（从 MVP 到企业级产品的清晰路径）
- ✅ **有商业价值**的项目（开源+商业双轨道）

通过这个项目，你将：

1. **掌握前沿技术**：LLM 应用开发、RAG、Agent 架构
2. **建立技术壁垒**：从"调 API"到"架构 AI 系统"
3. **积累项目经验**：可用于面试、技术分享、开源贡献
4. **探索商业机会**：SaaS、企业服务、技术咨询

---

**让我们开始构建 Agent Flow！** 🚀

---

**文档版本**：v1.1.0
**最后更新**：2025-01-05
**维护者**：Sggmico

**v1.1.0 更新内容**（2025-01-05）：
- ✅ 新增模块 5：Agent Skills 系统（核心架构扩展）
- ✅ 更新技术架构图，新增 Skills 层
- ✅ 新增 3 个数据库表设计（skills, agent_skills, skill_executions）
- ✅ 新增 7 个 Skills API 端点
- ✅ 新增内置 Skills 示例（文件、代码、Git 操作）
- ✅ 模块编号调整（原模块 5-10 → 现模块 6-11）
