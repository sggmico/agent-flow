import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { agents } from './agents';
import { users } from './users';
import { executions } from './workflows';

/**
 * Skill 分类枚举
 */
export const SKILL_CATEGORIES = [
  'filesystem',
  'code',
  'git',
  'api',
  'database',
  'shell',
  'other',
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

/**
 * Skill 执行类型枚举
 */
export const SKILL_HANDLER_TYPES = ['builtin', 'custom', 'remote'] as const;
export type SkillHandlerType = (typeof SKILL_HANDLER_TYPES)[number];

/**
 * Skill 执行状态枚举
 */
export const SKILL_EXECUTION_STATUSES = ['success', 'error', 'timeout'] as const;
export type SkillExecutionStatus = (typeof SKILL_EXECUTION_STATUSES)[number];

export interface SkillCost {
  tokens?: number;
  credits?: number;
  apiCalls?: number;
}

/**
 * Skills 表
 * 存储 Skill 定义与元数据
 */
export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  skillId: text('skill_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull().$type<SkillCategory>(),
  parameters: jsonb('parameters').$type<Record<string, unknown>>().notNull().default({}),
  returns: jsonb('returns').$type<Record<string, unknown>>().notNull().default({}),
  handler: text('handler').notNull(),
  handlerType: text('handler_type').notNull().$type<SkillHandlerType>().default('builtin'),
  permissions: jsonb('permissions').$type<string[]>().default([]),
  estimatedCost: jsonb('estimated_cost').$type<SkillCost>().default({}),
  version: text('version').default('1.0.0'),
  isActive: boolean('is_active').default(true),
  isPublic: boolean('is_public').default(false),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Agent-Skill 关联表
 */
export const agentSkills = pgTable('agent_skills', {
  id: serial('id').primaryKey(),
  agentId: integer('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  skillId: text('skill_id')
    .notNull()
    .references(() => skills.skillId, { onDelete: 'cascade' }),
  config: jsonb('config').$type<Record<string, unknown>>(),
  priority: integer('priority').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Skill 执行记录表
 */
export const skillExecutions = pgTable('skill_executions', {
  id: serial('id').primaryKey(),
  skillId: text('skill_id')
    .notNull()
    .references(() => skills.skillId, { onDelete: 'restrict' }),
  agentId: integer('agent_id').references(() => agents.id, { onDelete: 'set null' }),
  executionId: integer('execution_id').references(() => executions.id, { onDelete: 'cascade' }),
  input: jsonb('input').$type<Record<string, unknown>>().notNull(),
  output: jsonb('output').$type<Record<string, unknown>>(),
  error: text('error'),
  status: text('status').$type<SkillExecutionStatus>().default('success'),
  duration: integer('duration'),
  actualCost: jsonb('actual_cost').$type<SkillCost>(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 关系定义
export const skillsRelations = relations(skills, ({ one, many }) => ({
  creator: one(users, {
    fields: [skills.createdBy],
    references: [users.id],
  }),
  agentLinks: many(agentSkills),
  executions: many(skillExecutions),
}));

export const agentSkillsRelations = relations(agentSkills, ({ one }) => ({
  agent: one(agents, {
    fields: [agentSkills.agentId],
    references: [agents.id],
  }),
  skill: one(skills, {
    fields: [agentSkills.skillId],
    references: [skills.skillId],
  }),
}));

export const skillExecutionsRelations = relations(skillExecutions, ({ one }) => ({
  skill: one(skills, {
    fields: [skillExecutions.skillId],
    references: [skills.skillId],
  }),
  agent: one(agents, {
    fields: [skillExecutions.agentId],
    references: [agents.id],
  }),
  workflowExecution: one(executions, {
    fields: [skillExecutions.executionId],
    references: [executions.id],
  }),
}));

// 类型导出
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type AgentSkill = typeof agentSkills.$inferSelect;
export type NewAgentSkill = typeof agentSkills.$inferInsert;
export type SkillExecution = typeof skillExecutions.$inferSelect;
export type NewSkillExecution = typeof skillExecutions.$inferInsert;
