import { ZodError } from 'zod';
import { SkillExecutionError, SkillNotFoundError, SkillValidationError } from './errors';
import type { SkillDefinition } from './types';

export class SkillRegistry {
  private readonly skills = new Map<string, SkillDefinition<unknown, unknown>>();

  register<Params, Result>(skill: SkillDefinition<Params, Result>): void {
    if (!skill.skillId) {
      throw new SkillValidationError('unknown', 'definition', 'Skill ID 不能为空');
    }
    if (this.skills.has(skill.skillId)) {
      throw new SkillValidationError(
        skill.skillId,
        'definition',
        `Skill 已存在: ${skill.skillId}`,
      );
    }

    this.skills.set(skill.skillId, skill as SkillDefinition<unknown, unknown>);
  }

  registerAll(skills: Array<SkillDefinition<unknown, unknown>>): void {
    for (const skill of skills) {
      this.register(skill);
    }
  }

  unregister(skillId: string): boolean {
    return this.skills.delete(skillId);
  }

  get(skillId: string): SkillDefinition<unknown, unknown> | undefined {
    return this.skills.get(skillId);
  }

  list(category?: string): Array<SkillDefinition<unknown, unknown>> {
    const allSkills = Array.from(this.skills.values());
    if (!category) {
      return allSkills;
    }
    return allSkills.filter((skill) => skill.category === category);
  }

  async execute<Params, Result>(
    skillId: string,
    params: Params,
    options?: { timeout?: number },
  ): Promise<Result> {
    const skill = this.skills.get(skillId) as SkillDefinition<Params, Result> | undefined;
    if (!skill) {
      throw new SkillNotFoundError(skillId);
    }

    let validatedParams: Params;
    try {
      validatedParams = skill.parametersSchema.parse(params) as Params;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new SkillValidationError(
          skillId,
          'parameters',
          `参数校验失败: ${error.message}`,
        );
      }
      throw error;
    }

    const executeHandler = async (): Promise<Result> => {
      try {
        const result = await skill.handler(validatedParams);
        try {
          return skill.returnsSchema.parse(result) as Result;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new SkillValidationError(
              skillId,
              'returns',
              `返回值校验失败: ${error.message}`,
            );
          }
          throw error;
        }
      } catch (error) {
        if (error instanceof SkillValidationError) {
          throw error;
        }
        const message = error instanceof Error ? error.message : '未知执行错误';
        throw new SkillExecutionError(skillId, message);
      }
    };

    const timeout = options?.timeout ?? 30000;
    if (timeout <= 0) {
      return executeHandler();
    }

    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new SkillExecutionError(skillId, '执行超时'));
      }, timeout);
    });

    try {
      return (await Promise.race([executeHandler(), timeoutPromise])) as Result;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}
