import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * 工作流触发器类型
 */
export const triggerTypes = ['manual', 'schedule', 'webhook', 'event'] as const;
export type TriggerType = (typeof triggerTypes)[number];

/**
 * 工作流执行模式
 */
export const executionModes = ['serial', 'parallel', 'conditional'] as const;
export type ExecutionMode = (typeof executionModes)[number];

/**
 * 工作流步骤定义
 */
export interface WorkflowStep {
  id: string;
  agentId: number;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
  dependencies?: string[]; // 依赖的步骤 ID 列表
}

/**
 * 工作流表
 * 定义多步骤 Agent 协作流程
 */
export const workflows = pgTable('workflows', {
  id: serial('id').primaryKey(),
  // 基础信息
  name: text('name').notNull(),
  description: text('description'),
  // 工作流配置
  steps: jsonb('steps').$type<WorkflowStep[]>().notNull().default([]),
  executionMode: text('execution_mode').$type<ExecutionMode>().default('serial'),
  // 触发器
  trigger: text('trigger').$type<TriggerType>().default('manual'),
  triggerConfig: jsonb('trigger_config'),
  // 状态
  isActive: boolean('is_active').default(true),
  // 关联
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 工作流执行记录表
 * 跟踪工作流执行状态和结果
 */
export const executions = pgTable('executions', {
  id: serial('id').primaryKey(),
  // 关联
  workflowId: integer('workflow_id')
    .notNull()
    .references(() => workflows.id),
  // 执行状态
  status: text('status')
    .$type<'pending' | 'running' | 'completed' | 'failed' | 'cancelled'>()
    .default('pending'),
  // 输入输出
  input: jsonb('input'),
  output: jsonb('output'),
  error: text('error'),
  // 步骤执行详情
  stepResults:
    jsonb('step_results').$type<
      Array<{
        stepId: string;
        status: string;
        output?: unknown;
        error?: string;
        startTime?: Date;
        endTime?: Date;
      }>
    >(),
  // 时间戳
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 类型导出
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type Execution = typeof executions.$inferSelect;
export type NewExecution = typeof executions.$inferInsert;
