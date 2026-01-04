import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { db } from '../index';
import { agentExecutions, agents, users } from '../schema';

describe('Agent 数据库操作', () => {
  let testUserId: number;
  let testAgentId: number;

  beforeAll(async () => {
    // 清理可能已存在的测试用户
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, 'test-agent-db@example.com'));

    if (existingUser.length > 0) {
      const userId = existingUser[0].id;
      // 清理该用户的 agents 和 executions
      const userAgents = await db.select().from(agents).where(eq(agents.createdBy, userId));
      for (const agent of userAgents) {
        await db.delete(agentExecutions).where(eq(agentExecutions.agentId, agent.id));
      }
      await db.delete(agents).where(eq(agents.createdBy, userId));
      await db.delete(users).where(eq(users.id, userId));
    }

    // 创建测试用户
    const [user] = await db
      .insert(users)
      .values({
        email: 'test-agent-db@example.com',
        password: 'hashed_password',
        name: 'Test User',
      })
      .returning();
    testUserId = user.id;
  });

  afterAll(async () => {
    // 清理测试数据
    await db.delete(agentExecutions).where(eq(agentExecutions.agentId, testAgentId));
    await db.delete(agents).where(eq(agents.createdBy, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  beforeEach(async () => {
    // 清理之前的测试 agents（先删除 executions，再删除 agents）
    const existingAgents = await db.select().from(agents).where(eq(agents.createdBy, testUserId));
    for (const agent of existingAgents) {
      await db.delete(agentExecutions).where(eq(agentExecutions.agentId, agent.id));
    }
    await db.delete(agents).where(eq(agents.createdBy, testUserId));
  });

  describe('CREATE - 创建 Agent', () => {
    it('应该成功创建一个 Agent', async () => {
      const [agent] = await db
        .insert(agents)
        .values({
          name: 'Code Reviewer',
          role: 'code_reviewer',
          description: 'Reviews code for best practices',
          model: 'claude-sonnet-4',
          systemPrompt: 'You are a code reviewer',
          temperature: 70,
          maxTokens: 4000,
          tools: ['search', 'analyze'],
          createdBy: testUserId,
        })
        .returning();

      expect(agent).toBeDefined();
      expect(agent.id).toBeTypeOf('number');
      expect(agent.name).toBe('Code Reviewer');
      expect(agent.role).toBe('code_reviewer');
      expect(agent.model).toBe('claude-sonnet-4');
      expect(agent.status).toBe('idle'); // 默认状态
      expect(agent.createdAt).toBeInstanceOf(Date);
      expect(agent.updatedAt).toBeInstanceOf(Date);

      testAgentId = agent.id;
    });

    it('应该使用默认值创建 Agent', async () => {
      const [agent] = await db
        .insert(agents)
        .values({
          name: 'Minimal Agent',
          role: 'debugger',
          model: 'gpt-4o',
          createdBy: testUserId,
        })
        .returning();

      expect(agent.status).toBe('idle');
      expect(agent.temperature).toBe(70);
      expect(agent.maxTokens).toBe(4000);
      expect(agent.tools).toEqual([]);
    });
  });

  describe('READ - 查询 Agent', () => {
    beforeEach(async () => {
      // 创建多个测试 agents
      await db.insert(agents).values([
        {
          name: 'Agent 1',
          role: 'reviewer',
          model: 'claude-sonnet-4',
          status: 'idle',
          createdBy: testUserId,
        },
        {
          name: 'Agent 2',
          role: 'debugger',
          model: 'gpt-4o',
          status: 'working',
          createdBy: testUserId,
        },
        {
          name: 'Agent 3',
          role: 'documenter',
          model: 'gemini-2.0-flash',
          status: 'completed',
          createdBy: testUserId,
        },
      ]);
    });

    it('应该查询所有 Agents', async () => {
      const allAgents = await db.select().from(agents).where(eq(agents.createdBy, testUserId));

      expect(allAgents).toHaveLength(3);
      expect(allAgents[0]).toHaveProperty('id');
      expect(allAgents[0]).toHaveProperty('name');
    });

    it('应该根据 ID 查询单个 Agent', async () => {
      const [created] = await db
        .insert(agents)
        .values({
          name: 'Specific Agent',
          role: 'tester',
          model: 'claude-opus-4',
          createdBy: testUserId,
        })
        .returning();

      const [found] = await db.select().from(agents).where(eq(agents.id, created.id));

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.name).toBe('Specific Agent');
    });

    it('应该根据状态筛选 Agents', async () => {
      const workingAgents = await db.select().from(agents).where(eq(agents.status, 'working'));

      expect(workingAgents.length).toBeGreaterThanOrEqual(1);
      expect(workingAgents.every((a) => a.status === 'working')).toBe(true);
    });

    it('应该支持分页查询', async () => {
      const page1 = await db.select().from(agents).limit(2).offset(0);
      const page2 = await db.select().from(agents).limit(2).offset(2);

      expect(page1).toHaveLength(2);
      expect(page2.length).toBeGreaterThanOrEqual(1);
      expect(page1[0].id).not.toBe(page2[0]?.id);
    });
  });

  describe('UPDATE - 更新 Agent', () => {
    it('应该成功更新 Agent', async () => {
      const [created] = await db
        .insert(agents)
        .values({
          name: 'Original Name',
          role: 'original_role',
          model: 'claude-sonnet-4',
          status: 'idle',
          createdBy: testUserId,
        })
        .returning();

      const [updated] = await db
        .update(agents)
        .set({
          name: 'Updated Name',
          status: 'working',
          updatedAt: new Date(),
        })
        .where(eq(agents.id, created.id))
        .returning();

      expect(updated.name).toBe('Updated Name');
      expect(updated.status).toBe('working');
      expect(updated.role).toBe('original_role'); // 未改变的字段
      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    it('应该允许部分字段更新', async () => {
      const [created] = await db
        .insert(agents)
        .values({
          name: 'Test Agent',
          role: 'tester',
          model: 'gpt-4o',
          temperature: 70,
          createdBy: testUserId,
        })
        .returning();

      const [updated] = await db
        .update(agents)
        .set({ temperature: 90 })
        .where(eq(agents.id, created.id))
        .returning();

      expect(updated.temperature).toBe(90);
      expect(updated.name).toBe('Test Agent'); // 其他字段不变
      expect(updated.role).toBe('tester');
    });
  });

  describe('DELETE - 删除 Agent', () => {
    it('应该成功删除 Agent', async () => {
      const [created] = await db
        .insert(agents)
        .values({
          name: 'To Be Deleted',
          role: 'temporary',
          model: 'claude-sonnet-4',
          createdBy: testUserId,
        })
        .returning();

      await db.delete(agents).where(eq(agents.id, created.id));

      const found = await db.select().from(agents).where(eq(agents.id, created.id));

      expect(found).toHaveLength(0);
    });
  });

  describe('Agent Executions 关系', () => {
    it('应该创建 Agent Execution 记录', async () => {
      const [agent] = await db
        .insert(agents)
        .values({
          name: 'Executor',
          role: 'executor',
          model: 'claude-sonnet-4',
          createdBy: testUserId,
        })
        .returning();

      const [execution] = await db
        .insert(agentExecutions)
        .values({
          agentId: agent.id,
          status: 'running',
          input: { task: 'review code' },
          model: 'claude-sonnet-4',
        })
        .returning();

      expect(execution).toBeDefined();
      expect(execution.agentId).toBe(agent.id);
      expect(execution.status).toBe('running');
      expect(execution.input).toEqual({ task: 'review code' });
    });

    it('应该更新 Execution 结果', async () => {
      const [agent] = await db
        .insert(agents)
        .values({
          name: 'Task Runner',
          role: 'runner',
          model: 'gpt-4o',
          createdBy: testUserId,
        })
        .returning();

      const [execution] = await db
        .insert(agentExecutions)
        .values({
          agentId: agent.id,
          status: 'pending',
          input: { task: 'analyze' },
          model: 'gpt-4o',
        })
        .returning();

      const [completed] = await db
        .update(agentExecutions)
        .set({
          status: 'completed',
          output: { result: 'success' },
          tokensUsed: 1500,
          executionTime: 2500, // ms
          completedAt: new Date(),
        })
        .where(eq(agentExecutions.id, execution.id))
        .returning();

      expect(completed.status).toBe('completed');
      expect(completed.output).toEqual({ result: 'success' });
      expect(completed.tokensUsed).toBe(1500);
      expect(completed.executionTime).toBe(2500);
      expect(completed.completedAt).toBeInstanceOf(Date);
    });

    it('应该记录执行失败', async () => {
      const [agent] = await db
        .insert(agents)
        .values({
          name: 'Faulty Agent',
          role: 'faulty',
          model: 'claude-sonnet-4',
          createdBy: testUserId,
        })
        .returning();

      const [execution] = await db
        .insert(agentExecutions)
        .values({
          agentId: agent.id,
          status: 'running',
          input: { task: 'fail' },
          model: 'claude-sonnet-4',
        })
        .returning();

      const [failed] = await db
        .update(agentExecutions)
        .set({
          status: 'failed',
          error: 'API timeout',
          completedAt: new Date(),
        })
        .where(eq(agentExecutions.id, execution.id))
        .returning();

      expect(failed.status).toBe('failed');
      expect(failed.error).toBe('API timeout');
    });

    it('应该查询 Agent 的所有执行记录', async () => {
      const [agent] = await db
        .insert(agents)
        .values({
          name: 'Multi Runner',
          role: 'runner',
          model: 'gemini-2.0-flash',
          createdBy: testUserId,
        })
        .returning();

      // 创建多条执行记录
      await db.insert(agentExecutions).values([
        { agentId: agent.id, status: 'completed', model: 'gemini-2.0-flash', input: {} },
        { agentId: agent.id, status: 'completed', model: 'gemini-2.0-flash', input: {} },
        { agentId: agent.id, status: 'failed', model: 'gemini-2.0-flash', input: {} },
      ]);

      const executions = await db
        .select()
        .from(agentExecutions)
        .where(eq(agentExecutions.agentId, agent.id));

      expect(executions).toHaveLength(3);
      expect(executions.filter((e) => e.status === 'completed')).toHaveLength(2);
      expect(executions.filter((e) => e.status === 'failed')).toHaveLength(1);
    });
  });

  describe('数据完整性约束', () => {
    it('应该要求必填字段', async () => {
      await expect(async () => {
        await db.insert(agents).values({
          // @ts-expect-error - 测试缺少必填字段
          role: 'tester',
          model: 'claude-sonnet-4',
          createdBy: testUserId,
        });
      }).rejects.toThrow();
    });

    it('应该验证外键约束 (createdBy)', async () => {
      await expect(async () => {
        await db.insert(agents).values({
          name: 'Invalid User Agent',
          role: 'tester',
          model: 'claude-sonnet-4',
          createdBy: 999999, // 不存在的用户 ID
        });
      }).rejects.toThrow();
    });

    it('应该验证外键约束 (agentId in executions)', async () => {
      await expect(async () => {
        await db.insert(agentExecutions).values({
          agentId: 999999, // 不存在的 agent ID
          status: 'pending',
          model: 'claude-sonnet-4',
          input: {},
        });
      }).rejects.toThrow();
    });
  });
});
