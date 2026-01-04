import { z } from 'zod';

/**
 * Agent 状态枚举
 */
export const agentStatusSchema = z.enum(['idle', 'working', 'completed', 'failed', 'paused']);

/**
 * LLM 模型枚举
 */
export const llmModelSchema = z.enum([
  'claude-sonnet-4',
  'claude-opus-4',
  'gpt-4o',
  'gpt-4-turbo',
  'gemini-2.0-flash',
]);

/**
 * 创建 Agent Schema
 */
export const createAgentSchema = z.object({
  name: z.string().min(1, '名称不能为空').max(100, '名称不能超过100个字符'),
  role: z.string().min(1, '角色不能为空').max(50, '角色不能超过50个字符'),
  description: z.string().max(500, '描述不能超过500个字符').optional(),
  model: llmModelSchema.default('claude-sonnet-4'),
  systemPrompt: z.string().max(4000, '系统提示词不能超过4000个字符').optional(),
  temperature: z.number().int().min(0, '温度不能小于0').max(100, '温度不能大于100').default(70),
  maxTokens: z
    .number()
    .int()
    .min(100, '最大 token 数不能小于100')
    .max(100000, '最大 token 数不能超过100000')
    .default(4000),
  tools: z.array(z.string()).default([]),
  createdBy: z.number().int().positive(),
});

/**
 * 更新 Agent Schema (所有字段可选)
 */
export const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
  model: llmModelSchema.optional(),
  systemPrompt: z.string().max(4000).optional(),
  temperature: z.number().int().min(0).max(100).optional(),
  maxTokens: z.number().int().min(100).max(100000).optional(),
  tools: z.array(z.string()).optional(),
  status: agentStatusSchema.optional(),
});

/**
 * Agent 列表查询参数 Schema
 */
export const agentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: agentStatusSchema.optional(),
  search: z.string().optional(), // 搜索名称或角色
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Agent ID 参数 Schema
 */
export const agentIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * 执行 Agent Schema
 */
export const executeAgentSchema = z.object({
  input: z.record(z.string(), z.unknown()), // 任意 JSON 对象
});

// 类型导出
export type AgentStatus = z.infer<typeof agentStatusSchema>;
export type LlmModel = z.infer<typeof llmModelSchema>;
export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type AgentListQuery = z.infer<typeof agentListQuerySchema>;
export type AgentIdParam = z.infer<typeof agentIdSchema>;
export type ExecuteAgentInput = z.infer<typeof executeAgentSchema>;
