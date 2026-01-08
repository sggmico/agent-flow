import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from '../client';
import { agentSkills, skills } from '../schema';

export interface AgentSkillWithSkill {
  id: number;
  agentId: number;
  skillId: string;
  config: Record<string, unknown> | null;
  priority: number | null;
  createdAt: Date;
  skill: {
    id: number;
    skillId: string;
    name: string;
    description: string;
    documentation: string;
    mode: string;
    category: string;
    handlerType: string;
    isActive: boolean | null;
    isPublic: boolean | null;
  };
}

export async function getAgentSkillLink(agentId: number, skillId: string) {
  const [link] = await db
    .select()
    .from(agentSkills)
    .where(and(eq(agentSkills.agentId, agentId), eq(agentSkills.skillId, skillId)))
    .limit(1);
  return link;
}

export async function bindSkillToAgent(
  agentId: number,
  skillId: string,
  options: { config?: Record<string, unknown>; priority?: number } = {},
) {
  const values: {
    agentId: number;
    skillId: string;
    config?: Record<string, unknown>;
    priority?: number;
  } = {
    agentId,
    skillId,
  };

  if (options.config !== undefined) {
    values.config = options.config;
  }

  if (options.priority !== undefined) {
    values.priority = options.priority;
  }

  const [created] = await db
    .insert(agentSkills)
    .values(values)
    .returning();
  return created;
}

export async function unbindSkillFromAgent(agentId: number, skillId: string) {
  const [deleted] = await db
    .delete(agentSkills)
    .where(and(eq(agentSkills.agentId, agentId), eq(agentSkills.skillId, skillId)))
    .returning();
  return deleted;
}

export async function getAgentSkills(agentId: number): Promise<AgentSkillWithSkill[]> {
  const rows = await db
    .select({
      agentSkillId: agentSkills.id,
      agentId: agentSkills.agentId,
      skillId: agentSkills.skillId,
      config: agentSkills.config,
      priority: agentSkills.priority,
      createdAt: agentSkills.createdAt,
      skillDbId: skills.id,
      skillSkillId: skills.skillId,
      skillName: skills.name,
      skillDescription: skills.description,
      skillDocumentation: skills.documentation,
      skillMode: skills.mode,
      skillCategory: skills.category,
      skillHandlerType: skills.handlerType,
      skillIsActive: skills.isActive,
      skillIsPublic: skills.isPublic,
    })
    .from(agentSkills)
    .innerJoin(skills, eq(agentSkills.skillId, skills.skillId))
    .where(eq(agentSkills.agentId, agentId))
    .orderBy(desc(agentSkills.priority), asc(agentSkills.createdAt));

  return rows.map((row) => ({
    id: row.agentSkillId,
    agentId: row.agentId,
    skillId: row.skillId,
    config: row.config ?? null,
    priority: row.priority ?? null,
    createdAt: row.createdAt,
    skill: {
      id: row.skillDbId,
      skillId: row.skillSkillId,
      name: row.skillName,
      description: row.skillDescription,
      documentation: row.skillDocumentation,
      mode: row.skillMode,
      category: row.skillCategory,
      handlerType: row.skillHandlerType,
      isActive: row.skillIsActive ?? null,
      isPublic: row.skillIsPublic ?? null,
    },
  }));
}
