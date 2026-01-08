import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../client';
import { skills } from '../schema';

export type SkillSortBy = 'createdAt' | 'updatedAt' | 'usageCount' | 'name';
export type SkillSortOrder = 'asc' | 'desc';

export interface ListSkillsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  mode?: string;
  sortBy: SkillSortBy;
  sortOrder: SkillSortOrder;
}

export async function listSkills(params: ListSkillsParams) {
  const { page, limit, search, category, mode, sortBy, sortOrder } = params;
  const offset = (page - 1) * limit;
  const conditions = [];

  if (category) {
    conditions.push(eq(skills.category, category));
  }

  if (mode) {
    conditions.push(eq(skills.mode, mode));
  }

  if (search) {
    conditions.push(
      or(
        ilike(skills.name, `%${search}%`),
        ilike(skills.description, `%${search}%`),
        ilike(skills.skillId, `%${search}%`),
      ),
    );
  }

  const orderByColumn = skills[sortBy];
  const orderByFn = sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByFn)
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(skills)
      .where(conditions.length > 0 ? and(...conditions) : undefined),
  ]);

  const total = Number(countResult[0]?.value || 0);

  return { items, total };
}

export async function getSkillBySkillId(skillId: string) {
  const [skill] = await db.select().from(skills).where(eq(skills.skillId, skillId)).limit(1);
  return skill;
}

export async function createSkill(values: typeof skills.$inferInsert) {
  const [created] = await db.insert(skills).values(values).returning();
  return created;
}
