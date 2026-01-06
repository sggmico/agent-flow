import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { db } from '../index';
import {
  agentSkills,
  agents,
  executions,
  skills,
  skillExecutions,
  users,
  workflows,
} from '../schema';

const requireDefined = <T,>(value: T | undefined, label: string): T => {
  expect(value, `${label} should be defined`).toBeDefined();
  if (value === undefined) {
    throw new Error(`${label} is undefined`);
  }
  return value;
};

const createUser = async (email: string) => {
  const [user] = await db
    .insert(users)
    .values({ email, name: 'Skill Test User' })
    .returning();
  return requireDefined(user, 'created user');
};

describe('Skills 外键约束', () => {
  it('删除 user 时 skill.created_by 应置为 null', async () => {
    const stamp = Date.now();
    const user = await createUser(`skill-null-${stamp}@example.com`);
    const skillId = `skill.null.${stamp}`;
    const [skill] = await db
      .insert(skills)
      .values({
        skillId,
        name: 'Null Skill',
        description: 'test',
        category: 'other',
        parameters: {},
        returns: {},
        handler: 'builtin',
        handlerType: 'builtin',
        createdBy: user.id,
      })
      .returning();
    const createdSkill = requireDefined(skill, 'created skill');

    try {
      await db.delete(users).where(eq(users.id, user.id));
      const [updated] = await db
        .select({ createdBy: skills.createdBy })
        .from(skills)
        .where(eq(skills.skillId, skillId));
      expect(updated?.createdBy).toBeNull();
    } finally {
      await db.delete(skills).where(eq(skills.id, createdSkill.id));
    }
  });

  it('删除 agent 时 agent_skills 应级联删除', async () => {
    const stamp = Date.now();
    const user = await createUser(`skill-cascade-${stamp}@example.com`);
    const [agent] = await db
      .insert(agents)
      .values({
        name: 'Cascade Agent',
        role: 'tester',
        model: 'claude-sonnet-4',
        createdBy: user.id,
      })
      .returning();
    const createdAgent = requireDefined(agent, 'created agent');
    const skillId = `skill.cascade.${stamp}`;
    await db.insert(skills).values({
      skillId,
      name: 'Cascade Skill',
      description: 'test',
      category: 'other',
      parameters: {},
      returns: {},
      handler: 'builtin',
      handlerType: 'builtin',
      createdBy: user.id,
    });
    await db.insert(agentSkills).values({
      agentId: createdAgent.id,
      skillId,
      config: {},
    });

    try {
      await db.delete(agents).where(eq(agents.id, createdAgent.id));
      const linked = await db
        .select()
        .from(agentSkills)
        .where(eq(agentSkills.agentId, createdAgent.id));
      expect(linked).toHaveLength(0);
    } finally {
      await db.delete(agentSkills).where(eq(agentSkills.skillId, skillId));
      await db.delete(skills).where(eq(skills.skillId, skillId));
      await db.delete(users).where(eq(users.id, user.id));
    }
  });

  it(
    '有执行记录的 skill 应禁止删除',
    async () => {
      const stamp = Date.now();
      const user = await createUser(`skill-restrict-${stamp}@example.com`);
    const [agent] = await db
      .insert(agents)
      .values({
        name: 'Restrict Agent',
        role: 'tester',
        model: 'claude-sonnet-4',
        createdBy: user.id,
      })
      .returning();
    const createdAgent = requireDefined(agent, 'created agent');

    const skillId = `skill.restrict.${stamp}`;
    await db.insert(skills).values({
      skillId,
      name: 'Restrict Skill',
      description: 'test',
      category: 'other',
      parameters: {},
      returns: {},
      handler: 'builtin',
      handlerType: 'builtin',
      createdBy: user.id,
    });

    const [workflow] = await db
      .insert(workflows)
      .values({
        name: 'Restrict Workflow',
        steps: [],
        createdBy: user.id,
      })
      .returning();
    const createdWorkflow = requireDefined(workflow, 'created workflow');
    const [execution] = await db
      .insert(executions)
      .values({
        workflowId: createdWorkflow.id,
      })
      .returning();
    const createdExecution = requireDefined(execution, 'created execution');

    await db.insert(skillExecutions).values({
      skillId,
      agentId: createdAgent.id,
      executionId: createdExecution.id,
      input: {},
      status: 'success',
    });

    try {
      await expect(db.delete(skills).where(eq(skills.skillId, skillId))).rejects.toThrow();
    } finally {
      await db.delete(skillExecutions).where(eq(skillExecutions.skillId, skillId));
      await db.delete(skills).where(eq(skills.skillId, skillId));
      await db.delete(executions).where(eq(executions.id, createdExecution.id));
      await db.delete(workflows).where(eq(workflows.id, createdWorkflow.id));
      await db.delete(agents).where(eq(agents.id, createdAgent.id));
      await db.delete(users).where(eq(users.id, user.id));
    }
  },
  20000,
  );
});
