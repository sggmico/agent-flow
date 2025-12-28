import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Agent 状态枚举
 */
export const agentStatuses = ['idle', 'working', 'completed', 'failed'] as const;
export type AgentStatus = (typeof agentStatuses)[number];

/**
 * LLM 模型枚举
 */
export const llmModels = [
  'claude-sonnet-4',
  'claude-opus-4',
  'gpt-4o',
  'gpt-4-turbo',
  'gemini-2.0-flash',
] as const;
export type LlmModel = (typeof llmModels)[number];

/**
 * Agent 表
 * 存储 AI Agent 配置和状态
 */
export const agents = pgTable('agents', {
  id: serial('id').primaryKey(),
  // 基础信息
  name: text('name').notNull(),
  role: text('role').notNull(), // 例如：code_reviewer, documenter, debugger
  description: text('description'),
  // LLM 配置
  model: text('model').notNull().$type<LlmModel>().default('claude-sonnet-4'),
  systemPrompt: text('system_prompt'),
  temperature: integer('temperature').default(70), // 0-100，转换为 0.0-1.0
  maxTokens: integer('max_tokens').default(4000),
  // 工具配置
  tools: jsonb('tools').$type<string[]>().default([]),
  // 状态
  status: text('status').$type<AgentStatus>().default('idle'),
  // 关联
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 类型导出
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
