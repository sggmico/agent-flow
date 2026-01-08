import { z } from 'zod';

/**
 * Agent-Skill 绑定请求 Schema
 */
export const bindAgentSkillSchema = z.object({
  skillId: z.string().min(1, 'Skill ID 不能为空'),
  config: z.record(z.string(), z.unknown()).optional(),
  priority: z.number().int().min(0).max(100).optional(),
});

/**
 * Agent-Skill 路径参数 Schema
 */
export const agentSkillParamSchema = z.object({
  skillId: z.string().min(1, 'Skill ID 不能为空'),
});

// 类型导出
export type BindAgentSkillInput = z.infer<typeof bindAgentSkillSchema>;
export type AgentSkillParam = z.infer<typeof agentSkillParamSchema>;
