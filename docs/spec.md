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
- 🧩 **可扩展能力**：Agent Skills 系统支持自定义工具和能力

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

### 7. Agent Skills 系统

**功能描述**：可复用、可组合、类型安全的 Agent 能力单元系统

**核心概念**：
- **Skill 定义**：明确的输入/输出接口、执行逻辑、权限和成本
- **Skill Registry**：中央注册表，管理所有可用 Skills
- **Skill Execution**：统一的执行引擎，包含验证、追踪、成本计算

**核心能力**：
- Skill 管理
  - 内置 Skills（文件操作、代码分析、Git 操作、安全扫描）
  - 自定义 Skills（用户可创建私有 Skills）
  - Skill Marketplace（未来功能：公开分享和安装）

- Agent-Skill 绑定
  - Agent 创建时选择可用 Skills
  - 多对多关系（一个 Agent 可用多个 Skills，一个 Skill 可被多个 Agent 使用）
  - 优先级和配置覆盖

- 执行追踪
  - 记录每次 Skill 调用（输入、输出、耗时、成本）
  - 成功率统计和错误分析
  - 成本监控和优化建议

**Skill 类型**：
- `filesystem`：文件读写、目录遍历
- `code`：代码解析、AST 分析、重构
- `git`：Git 操作、Diff 分析、PR 管理
- `api`：外部 API 调用、Webhook
- `database`：数据库查询、数据同步
- `shell`：Shell 命令执行
- `other`：其他自定义类型

**内置 Skills 示例**：
- `file.read`：读取文件内容
- `file.write`：写入文件
- `code.parse`：解析代码 AST
- `semgrep.scan`：Semgrep 安全扫描
- `git.diff`：获取 Git Diff
- `eslint.check`：ESLint 代码检查

**用户界面**：
- Skill 列表页面（按分类展示）
- Skill 详情页（参数、返回值、使用示例、统计数据）
- Agent 配置中的 Skill 选择器
- Execution 日志中的 Skill 调用记录

**技术实现**：
- TypeScript 类型安全（Zod Schema 验证）
- 数据库存储（skills, agent_skills, skill_executions 表）
- OpenAI Function Calling 集成（Skill → OpenAI Tool 转换）

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

### Skills API

#### 获取 Skills 列表

```http
GET /api/skills?category=filesystem&search=file

Response 200:
{
  "data": [
    {
      "id": "skill_001",
      "skillId": "file.read",
      "name": "Read File",
      "description": "Read content from a file",
      "category": "filesystem",
      "version": "1.0.0",
      "isActive": true,
      "usageCount": 1234
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

#### 获取 Skill 详情

```http
GET /api/skills/:id

Response 200:
{
  "id": "skill_001",
  "skillId": "file.read",
  "name": "Read File",
  "description": "Read content from a file in the filesystem",
  "category": "filesystem",
  "parameters": {
    "type": "object",
    "properties": {
      "path": { "type": "string", "description": "File path" },
      "encoding": { "type": "string", "enum": ["utf8", "base64"], "default": "utf8" }
    },
    "required": ["path"]
  },
  "returns": {
    "type": "object",
    "properties": {
      "content": { "type": "string" },
      "size": { "type": "number" }
    }
  },
  "permissions": ["filesystem:read"],
  "estimatedCost": { "tokens": 0, "credits": 1 },
  "version": "1.0.0",
  "usageCount": 1234,
  "createdAt": "2024-12-27T10:00:00Z"
}
```

#### 创建自定义 Skill

```http
POST /api/skills
Content-Type: application/json

{
  "skillId": "custom.validator",
  "name": "Custom Validator",
  "description": "Validate custom data format",
  "category": "other",
  "parameters": { /* Zod schema JSON */ },
  "returns": { /* Zod schema JSON */ },
  "handler": "export async function execute(input) { ... }",
  "handlerType": "custom",
  "permissions": ["network:request"]
}

Response 201:
{
  "id": "skill_999",
  "skillId": "custom.validator",
  "createdAt": "2024-12-27T10:00:00Z"
}
```

#### 执行 Skill（测试）

```http
POST /api/skills/:id/execute
Content-Type: application/json

{
  "input": {
    "path": "/path/to/file.txt",
    "encoding": "utf8"
  }
}

Response 200:
{
  "success": true,
  "data": {
    "content": "Hello World",
    "size": 11
  },
  "duration": 15,
  "cost": { "tokens": 0, "credits": 1 }
}
```

#### 获取 Agent 的 Skills

```http
GET /api/agents/:id/skills

Response 200:
{
  "data": [
    {
      "id": "agent_skill_001",
      "agentId": "agent_123",
      "skill": {
        "id": "skill_001",
        "skillId": "file.read",
        "name": "Read File"
      },
      "config": { /* Agent 特定配置 */ },
      "priority": 10
    }
  ]
}
```

#### 为 Agent 添加 Skill

```http
POST /api/agents/:id/skills
Content-Type: application/json

{
  "skillId": "skill_001",
  "config": { "maxSize": 10485760 },
  "priority": 10
}

Response 201:
{
  "id": "agent_skill_001",
  "createdAt": "2024-12-27T10:00:00Z"
}
```

#### 获取 Skill 执行历史

```http
GET /api/skills/:id/executions?limit=20

Response 200:
{
  "data": [
    {
      "id": "exec_001",
      "skillId": "skill_001",
      "agentId": "agent_123",
      "executionId": "workflow_exec_456",
      "input": { "path": "/file.txt" },
      "output": { "content": "...", "size": 100 },
      "status": "success",
      "duration": 25,
      "actualCost": { "tokens": 0, "credits": 1 },
      "startedAt": "2024-12-27T10:00:00Z",
      "completedAt": "2024-12-27T10:00:00.025Z"
    }
  ],
  "statistics": {
    "totalExecutions": 1234,
    "successRate": 0.98,
    "avgDuration": 23,
    "totalCost": { "tokens": 0, "credits": 1234 }
  }
}
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
  tools: string[];               // ⚠️ 已废弃，使用 skills 替代
  status: AgentStatus;           // 当前状态
  createdAt: Date;
  updatedAt: Date;
}

type AgentStatus = 'idle' | 'working' | 'completed' | 'failed' | 'paused';
```

### Skill

```typescript
interface Skill {
  id: string;                    // UUID
  skillId: string;               // 唯一标识（如 "file.read"）
  name: string;                  // 显示名称
  description: string;           // 功能描述
  category: SkillCategory;       // 分类

  // 定义（JSON Schema 格式）
  parameters: JSONSchema;        // 输入参数 schema
  returns: JSONSchema;           // 输出 schema

  // 实现
  handler: string;               // 执行代码或引用路径
  handlerType: 'builtin' | 'custom' | 'remote';

  // 权限和成本
  permissions: string[];         // 如 ["filesystem:read", "network:request"]
  estimatedCost: {
    tokens?: number;
    credits?: number;
    apiCalls?: number;
  };

  // 元数据
  version: string;               // 版本号
  isActive: boolean;             // 是否启用
  isPublic: boolean;             // 是否公开到 Marketplace
  createdBy: string;             // 创建者 ID
  usageCount: number;            // 使用次数统计

  createdAt: Date;
  updatedAt: Date;
}

type SkillCategory =
  | 'filesystem'
  | 'code'
  | 'git'
  | 'api'
  | 'database'
  | 'shell'
  | 'other';
```

### AgentSkill（关联表）

```typescript
interface AgentSkill {
  id: string;                    // UUID
  agentId: string;               // Agent ID
  skillId: string;               // Skill ID

  // Agent 特定配置（可覆盖 Skill 默认配置）
  config?: Record<string, any>;

  // 优先级（数字越大优先级越高）
  priority: number;

  createdAt: Date;
}
```

### SkillExecution

```typescript
interface SkillExecution {
  id: string;                    // UUID
  skillId: string;               // Skill ID
  agentId?: string;              // 执行的 Agent ID（可选）
  executionId?: string;          // 关联的 Workflow Execution ID（可选）

  // 执行数据
  input: Record<string, any>;    // 输入参数
  output?: Record<string, any>;  // 输出结果
  error?: string;                // 错误信息

  // 执行元数据
  status: 'success' | 'error' | 'timeout';
  duration: number;              // 执行时长（毫秒）

  // 实际成本
  actualCost?: {
    tokens?: number;
    credits?: number;
    apiCalls?: number;
  };

  startedAt: Date;
  completedAt?: Date;
}
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

### v1.1 - 2025-01-05
- ✅ **新增 Agent Skills 系统规格**
  - 新增 Skills 核心功能说明
  - 新增 Skills API 规格（8 个端点）
  - 新增 Skill、AgentSkill、SkillExecution 数据模型
  - Agent 模型标记 tools 字段为已废弃

### v1.0 - 2025-12-29
- 初始版本
- 定义核心功能规格
- 定义 API 接口
- 定义数据模型

---

**维护者**: Agent Flow Team
**最后更新**: 2025-01-05
