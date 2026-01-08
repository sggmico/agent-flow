import { z } from 'zod';

/**
 * Skill 分类枚举
 */
export const skillCategorySchema = z.enum([
  'filesystem',
  'code',
  'git',
  'api',
  'database',
  'shell',
  'other',
]);

/**
 * Skill 模式枚举
 */
export const skillModeSchema = z.enum(['prompt', 'tool']);

/**
 * Skill 处理器类型枚举
 */
export const skillHandlerTypeSchema = z.enum(['builtin', 'custom', 'remote']);

/**
 * Skill 执行状态枚举
 */
export const skillExecutionStatusSchema = z.enum(['success', 'error', 'timeout']);

/**
 * Skill 成本信息
 */
export const skillCostSchema = z
  .object({
    tokens: z.number().int().nonnegative().optional(),
    credits: z.number().int().nonnegative().optional(),
    apiCalls: z.number().int().nonnegative().optional(),
  })
  .partial();

/**
 * Skill 定义 Schema
 */
export const skillDefinitionSchema = z.object({
  skillId: z.string().min(1, 'Skill ID 不能为空').max(100, 'Skill ID 不能超过 100 个字符'),
  name: z.string().min(1, '名称不能为空').max(100, '名称不能超过 100 个字符'),
  description: z.string().min(1, '描述不能为空').max(1000, '描述不能超过 1000 个字符'),
  documentation: z.string().max(20000, '文档不能超过 20000 个字符').default(''),
  mode: skillModeSchema.default('tool'),
  category: skillCategorySchema,
  parameters: z.record(z.string(), z.unknown()).default({}),
  returns: z.record(z.string(), z.unknown()).default({}),
  handler: z.string().min(1, 'Handler 不能为空'),
  handlerType: skillHandlerTypeSchema.default('builtin'),
  permissions: z.array(z.string()).default([]),
  estimatedCost: skillCostSchema.default({}),
  version: z.string().min(1).default('1.0.0'),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  createdBy: z.number().int().positive().nullable(),
  usageCount: z.number().int().nonnegative().default(0),
});

/**
 * Skill 执行 Schema
 */
export const skillExecutionSchema = z.object({
  skillId: z.string().min(1),
  agentId: z.number().int().positive().optional(),
  executionId: z.number().int().positive().optional(),
  input: z.record(z.string(), z.unknown()),
  output: z.record(z.string(), z.unknown()).optional(),
  error: z.string().optional(),
  status: skillExecutionStatusSchema.optional(),
  duration: z.number().int().nonnegative().optional(),
  actualCost: skillCostSchema.optional(),
});

/**
 * Skill 创建 Schema（Prompt/Tool 双层并存）
 */
export const createSkillSchema = z.object({
  skillId: z.string().min(1, 'Skill ID 不能为空').max(100, 'Skill ID 不能超过 100 个字符'),
  name: z.string().min(1, '名称不能为空').max(100, '名称不能超过 100 个字符'),
  description: z.string().min(1, '描述不能为空').max(1000, '描述不能超过 1000 个字符'),
  documentation: z.string().max(20000, '文档不能超过 20000 个字符').optional().default(''),
  mode: skillModeSchema.default('tool'),
  category: skillCategorySchema,
  parameters: z.record(z.string(), z.unknown()).default({}),
  returns: z.record(z.string(), z.unknown()).default({}),
  handler: z.string().min(1, 'Handler 不能为空').optional(),
  handlerType: skillHandlerTypeSchema.default('builtin'),
  permissions: z.array(z.string()).default([]),
  estimatedCost: skillCostSchema.default({}),
  version: z.string().min(1).default('1.0.0'),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(false),
  createdBy: z.number().int().positive().nullable().optional(),
  usageCount: z.number().int().nonnegative().default(0),
});

/**
 * Skill 列表查询 Schema
 */
export const skillListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: skillCategorySchema.optional(),
  mode: skillModeSchema.optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'usageCount', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// 类型导出
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type SkillMode = z.infer<typeof skillModeSchema>;
export type SkillHandlerType = z.infer<typeof skillHandlerTypeSchema>;
export type SkillExecutionStatus = z.infer<typeof skillExecutionStatusSchema>;
export type SkillCost = z.infer<typeof skillCostSchema>;
export type SkillDefinition = z.infer<typeof skillDefinitionSchema>;
export type SkillExecution = z.infer<typeof skillExecutionSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type SkillListQuery = z.infer<typeof skillListQuerySchema>;
