# Agent Flow - 功能规格说明

> 产品功能规格文档
> 面向：开发者、贡献者、用户
> 版本: v1.0
> 最后更新: 2025-12-29

---

## 📋 目录

- [项目概述](#项目概述)
- [核心功能](#核心功能)
- [API 规格](#api-规格)
- [数据模型](#数据模型)
- [技术要求](#技术要求)
- [开发规范](#开发规范)

---

## 🎯 项目概述

### 项目定位

Agent Flow 是一个面向开发者的 **AI Agent 协作平台**，通过可视化方式创建、编排和监控 AI Agent，让 AI 从"回答问题的工具"升级为"可协作、可审计、可落地的工作执行系统"。

### 核心价值

- 🎨 **可视化编排**：拖拽式工作流设计，无需编码
- 🤖 **多 Agent 协作**：支持多个专业 Agent 协同工作
- 📊 **实时监控**：执行过程可视化，状态实时反馈
- 🔍 **代码理解**：基于向量搜索的智能代码问答
- ✅ **质量保证**：内置代码审查、安全扫描等工具

---

## 🧩 核心功能

### 1. Agent 管理

**功能描述**：创建、配置和管理 AI Agent

**核心能力**：
- Agent 创建与配置
  - 选择 LLM 模型（Claude, GPT-4, Gemini）
  - 定义 Agent 角色和职责
  - 配置 System Prompt
  - 选择可用工具集

- Agent 能力声明
  - 输入/输出格式定义
  - 能力边界说明
  - 性能指标

- Agent 状态管理
  - `idle` - 空闲
  - `working` - 执行中
  - `completed` - 已完成
  - `failed` - 失败
  - `paused` - 暂停

**用户界面**：
- Agent 列表视图
- Agent 配置表单
- Agent Card 展示

---

### 2. 工作流编排

**功能描述**：可视化设计 Agent 协作流程

**核心能力**：
- 流程设计器
  - 基于 React Flow 的可视化编辑器
  - 拖拽添加 Agent 节点
  - 连线定义执行顺序

- 执行模式
  - **串行执行**：Agent 按顺序执行
  - **并行执行**：多个 Agent 同时执行
  - **条件分支**：根据结果选择路径
  - **循环执行**：重复执行直到条件满足

- 数据流管理
  - 输入/输出映射
  - 变量传递
  - 结果聚合

**工作流示例**：
```
代码审查工作流：
1. 代码索引 Agent → 提取代码结构
2. 并行执行：
   - 安全扫描 Agent
   - 性能分析 Agent
   - 最佳实践检查 Agent
3. 结果汇总 Agent → 生成审查报告
```

---

### 3. 代码库智能索引

**功能描述**：扫描、解析和向量化代码仓库

**核心能力**：
- 代码扫描
  - 支持语言：TypeScript, JavaScript, Python
  - AST 解析和语义提取
  - 智能分块策略

- 向量化存储
  - 使用 OpenAI text-embedding-3-large
  - 存储到 pgvector (PostgreSQL)
  - HNSW 索引优化查询

- 智能搜索
  - 语义相似度搜索
  - 全文搜索 (PostgreSQL FTS)
  - 混合搜索（向量 + 全文）

**搜索性能**：
- Top-10 查询：10-30ms
- 支持 100 万+ 代码块

---

### 4. AI 对话与代码问答

**功能描述**：基于代码库上下文的智能问答

**核心能力**：
- 上下文感知对话
  - 基于向量搜索获取相关代码
  - 结合 LLM 理解和生成
  - 保持对话历史

- 问题类型支持
  - "这个函数是做什么的？"
  - "如何实现某个功能？"
  - "代码中有什么潜在问题？"
  - "生成单元测试"

- 流式响应
  - 使用 SSE (Server-Sent Events)
  - 实时显示生成过程
  - 支持中断和重试

---

### 5. 代码审查

**功能描述**：AI 驱动的自动化代码审查

**审查维度**：
- 🔒 **安全性**：SQL 注入、XSS、命令注入等
- ⚡ **性能**：循环优化、内存泄漏、大 O 复杂度
- 📐 **最佳实践**：命名规范、代码结构、设计模式
- 🧪 **可测试性**：单元测试覆盖、边界条件
- 📖 **可维护性**：注释质量、文档完整性

**输出格式**：
```json
{
  "summary": "发现 3 个问题，2 个建议",
  "issues": [
    {
      "severity": "high",
      "category": "security",
      "line": 42,
      "message": "潜在的 SQL 注入风险",
      "suggestion": "使用参数化查询"
    }
  ],
  "score": 85
}
```

---

### 6. 文档生成

**功能描述**：自动生成代码文档

**生成内容**：
- API 文档（基于 JSDoc/TypeScript）
- README.md（项目说明）
- 架构文档（依赖关系图）
- 变更日志（基于 Git 历史）

**生成格式**：
- Markdown
- HTML
- PDF

---

## 🔌 API 规格

### Agent API

#### 创建 Agent

```http
POST /api/agents
Content-Type: application/json

{
  "name": "Code Reviewer",
  "role": "code-reviewer",
  "model": "claude-sonnet-4",
  "systemPrompt": "You are an expert code reviewer...",
  "tools": ["semgrep", "eslint"]
}

Response 201:
{
  "id": "agent_123",
  "name": "Code Reviewer",
  "status": "idle",
  "createdAt": "2024-12-27T10:00:00Z"
}
```

#### 获取 Agent 列表

```http
GET /api/agents?page=1&limit=10

Response 200:
{
  "data": [
    {
      "id": "agent_123",
      "name": "Code Reviewer",
      "status": "idle"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### 更新 Agent

```http
PUT /api/agents/:id
Content-Type: application/json

{
  "systemPrompt": "Updated prompt..."
}

Response 200:
{
  "id": "agent_123",
  "updatedAt": "2024-12-27T10:30:00Z"
}
```

#### 删除 Agent

```http
DELETE /api/agents/:id

Response 204
```

---

### Workflow API

#### 创建工作流

```http
POST /api/workflows
Content-Type: application/json

{
  "name": "Code Review Workflow",
  "trigger": "manual",
  "steps": [
    {
      "id": "step_1",
      "type": "agent",
      "agentId": "agent_123",
      "inputMapping": {
        "code": "{{input.code}}"
      }
    }
  ]
}
```

#### 执行工作流

```http
POST /api/workflows/:id/execute
Content-Type: application/json

{
  "input": {
    "code": "function hello() { ... }"
  }
}

Response 202:
{
  "executionId": "exec_456",
  "status": "running"
}
```

#### 获取执行状态（SSE）

```http
GET /api/workflows/executions/:id/stream

Response (SSE Stream):
data: {"type":"start","status":"running"}

data: {"type":"progress","step":"step_1","progress":50}

data: {"type":"complete","result":{...}}
```

---

### Code Index API

#### 索引代码库

```http
POST /api/code/index
Content-Type: application/json

{
  "repoPath": "/path/to/repo",
  "languages": ["typescript", "javascript"]
}

Response 202:
{
  "jobId": "job_789",
  "status": "processing"
}
```

#### 语义搜索

```http
POST /api/code/search
Content-Type: application/json

{
  "query": "用户认证相关代码",
  "limit": 10,
  "type": "semantic"
}

Response 200:
{
  "results": [
    {
      "filePath": "/src/auth/login.ts",
      "codeChunk": "export async function login(...) {...}",
      "similarity": 0.92
    }
  ]
}
```

---

## 📊 数据模型

### Agent

```typescript
interface Agent {
  id: string;                    // UUID
  name: string;                  // Agent 名称
  role: string;                  // 角色类型
  model: string;                 // LLM 模型
  systemPrompt: string;          // 系统提示词
  tools: string[];               // 可用工具列表
  status: AgentStatus;           // 当前状态
  createdAt: Date;
  updatedAt: Date;
}

type AgentStatus = 'idle' | 'working' | 'completed' | 'failed' | 'paused';
```

### Workflow

```typescript
interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: 'manual' | 'webhook' | 'schedule';
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowStep {
  id: string;
  type: 'agent' | 'tool' | 'condition';
  agentId?: string;              // 如果 type === 'agent'
  dependencies: string[];        // 依赖的步骤 ID
  inputMapping: Record<string, string>;
  outputMapping: Record<string, string>;
  config?: Record<string, any>;
}
```

### CodeEmbedding

```typescript
interface CodeEmbedding {
  id: number;
  filePath: string;              // 文件路径
  codeChunk: string;             // 代码片段
  embedding: number[];           // 1536 维向量
  language: string;              // 编程语言
  metadata: {
    functionName?: string;
    className?: string;
    startLine: number;
    endLine: number;
  };
  createdAt: Date;
}
```

### Execution

```typescript
interface Execution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  input: Record<string, any>;
  output?: Record<string, any>;
  steps: ExecutionStep[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

interface ExecutionStep {
  stepId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  output?: any;
  error?: string;
}
```

---

## 🛠️ 技术要求

### 运行环境

- **Node.js**: >= 20.0.0
- **PostgreSQL**: >= 16.0 (需要 pgvector 扩展)
- **Redis**: >= 7.0
- **浏览器**: Chrome/Edge >= 100, Firefox >= 100, Safari >= 16

### 开发环境

- **包管理器**: pnpm >= 8.0
- **TypeScript**: >= 5.0
- **编辑器**: VS Code (推荐)

### 性能要求

- 页面加载时间 (FCP): < 1.5s
- API 响应时间 (P95): < 200ms
- 向量搜索 (Top-10): < 30ms
- 工作流执行启动: < 500ms

### 安全要求

- 所有 API 需要认证
- 敏感数据加密存储
- HTTPS Only
- CORS 配置严格
- 防止 SQL 注入、XSS、CSRF

---

## 📐 开发规范

### 代码规范

- **Linter**: Biome
- **Formatter**: Biome
- **提交规范**: Conventional Commits
- **分支策略**: Git Flow

### 测试要求

- 单元测试覆盖率: >= 80%
- 集成测试: 核心功能必须覆盖
- E2E 测试: 关键用户流程

### 文档要求

- 所有公共 API 必须有 JSDoc
- 复杂逻辑必须有注释说明
- README.md 必须包含快速开始指南

---

## 🔗 相关文档

- **项目规划**: `docs/local/kick-off.md` (私有)
- **技术选型**: `docs/local/tech-cherry-pick.md` (私有)
- **多端架构**: `docs/local/multi-platform.md` (私有)
- **开发任务**: `docs/task.md`

---

## 📝 变更历史

### v1.0 - 2025-12-29
- 初始版本
- 定义核心功能规格
- 定义 API 接口
- 定义数据模型

---

**维护者**: Agent Flow Team
**最后更新**: 2025-12-29
