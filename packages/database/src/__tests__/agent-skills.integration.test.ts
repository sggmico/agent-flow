import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { bindSkillToAgent, db, getAgentSkills, unbindSkillFromAgent } from '../index';
import { agents, agentSkills, skills, users } from '../schema';

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
    .values({ email, name: 'Agent Skill Test User' })
    .returning();
  return requireDefined(user, 'created user');
};

describe('Agent-Skill 绑定', () => {
  it(
    '应支持绑定、查询和解绑',
    async () => {
      const stamp = Date.now();
      const user = await createUser(`agent-skill-${stamp}@example.com`);
      const skillId = `skill.bind.${stamp}`;
      let createdAgentId: number | undefined;

      try {
        const [agent] = await db
          .insert(agents)
          .values({
            name: 'Bind Agent',
            role: 'tester',
            model: 'claude-sonnet-4',
            createdBy: user.id,
          })
          .returning();
        const createdAgent = requireDefined(agent, 'created agent');
        createdAgentId = createdAgent.id;

        await db.insert(skills).values({
          skillId,
          name: 'Bind Skill',
          description: 'test',
          category: 'other',
          parameters: {},
          returns: {},
          handler: 'builtin',
        });

        const createdLink = await bindSkillToAgent(createdAgent.id, skillId, {
          config: { maxSize: 42 },
          priority: 10,
        });
        expect(createdLink).toBeDefined();
        expect(createdLink.agentId).toBe(createdAgent.id);
        expect(createdLink.skillId).toBe(skillId);

        const links = await getAgentSkills(createdAgent.id);
        expect(links).toHaveLength(1);
        expect(links[0]?.skill.skillId).toBe(skillId);
        expect(links[0]?.priority).toBe(10);

        const deleted = await unbindSkillFromAgent(createdAgent.id, skillId);
        expect(deleted).toBeDefined();
        const remaining = await getAgentSkills(createdAgent.id);
        expect(remaining).toHaveLength(0);
      } finally {
        await db.delete(agentSkills).where(eq(agentSkills.skillId, skillId));
        await db.delete(skills).where(eq(skills.skillId, skillId));
        if (createdAgentId) {
          await db.delete(agents).where(eq(agents.id, createdAgentId));
        }
        await db.delete(users).where(eq(users.id, user.id));
      }
    },
    20000,
  );
});
