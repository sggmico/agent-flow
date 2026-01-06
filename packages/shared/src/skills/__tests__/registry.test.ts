import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { SkillExecutionError, SkillNotFoundError, SkillValidationError } from '../errors';
import { SkillRegistry } from '../registry';
import type { SkillDefinition } from '../types';

const addParamsSchema = z.object({
  a: z.number(),
  b: z.number(),
});

const addResultSchema = z.object({
  sum: z.number(),
});

const addSkill: SkillDefinition<z.input<typeof addParamsSchema>, z.infer<typeof addResultSchema>> = {
  skillId: 'math.add',
  name: 'Add',
  description: '加法示例',
  category: 'other',
  parametersSchema: addParamsSchema,
  returnsSchema: addResultSchema,
  handler: async ({ a, b }) => ({ sum: a + b }),
  handlerType: 'builtin',
};

const createEchoSkill = (skillId: string) => {
  const paramsSchema = z.object({ value: z.string() });
  const returnsSchema = z.object({ value: z.string() });
  return {
    skillId,
    name: 'Echo',
    description: '回显参数',
    category: 'code',
    parametersSchema: paramsSchema,
    returnsSchema,
    handler: async ({ value }) => ({ value }),
    handlerType: 'builtin',
  } satisfies SkillDefinition<z.input<typeof paramsSchema>, z.infer<typeof returnsSchema>>;
};

describe('SkillRegistry', () => {
  it('注册与获取技能', () => {
    const registry = new SkillRegistry();
    registry.register(addSkill);

    const skill = registry.get('math.add');
    expect(skill?.skillId).toBe('math.add');
  });

  it('重复注册应报错', () => {
    const registry = new SkillRegistry();
    registry.register(addSkill);
    expect(() => registry.register(addSkill)).toThrow(SkillValidationError);
  });

  it('执行技能并返回结果', async () => {
    const registry = new SkillRegistry();
    registry.register(addSkill);
    const result = (await registry.execute('math.add', { a: 1, b: 2 })) as { sum: number };
    expect(result.sum).toBe(3);
  });

  it('返回值校验失败时抛出 SkillValidationError', async () => {
    const registry = new SkillRegistry();
    registry.register({
      ...addSkill,
      skillId: 'math.add.invalid',
      handler: async () => ({ sum: 'wrong' } as unknown),
    });
    await expect(registry.execute('math.add.invalid', { a: 1, b: 2 })).rejects.toBeInstanceOf(
      SkillValidationError,
    );
  });

  it('参数校验失败时抛出 SkillValidationError', async () => {
    const registry = new SkillRegistry();
    registry.register(addSkill);
    await expect(registry.execute('math.add', { a: '1', b: 2 } as any)).rejects.toBeInstanceOf(
      SkillValidationError,
    );
  });

  it('执行超时应抛出 SkillExecutionError', async () => {
    const registry = new SkillRegistry();
    registry.register({
      skillId: 'test.slow',
      name: 'Slow',
      description: 'Slow skill',
      category: 'other',
      parametersSchema: z.object({}),
      returnsSchema: z.object({ ok: z.boolean() }),
      handler: async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return { ok: true };
      },
      handlerType: 'builtin',
    });

    await expect(registry.execute('test.slow', {}, { timeout: 50 })).rejects.toBeInstanceOf(
      SkillExecutionError,
    );
  });

  it('未知技能抛出 SkillNotFoundError', async () => {
    const registry = new SkillRegistry();
    await expect(registry.execute('missing.skill', {})).rejects.toBeInstanceOf(SkillNotFoundError);
  });

  it('unregister 后无法再次获取技能', () => {
    const registry = new SkillRegistry();
    registry.register(addSkill);
    expect(registry.unregister('math.add')).toBe(true);
    expect(registry.get('math.add')).toBeUndefined();
  });

  it('按分类筛选技能', () => {
    const registry = new SkillRegistry();
    registry.register(addSkill);
    registry.register(createEchoSkill('code.echo'));

    const codeSkills = registry.list('code');
    expect(codeSkills).toHaveLength(1);
    expect(codeSkills[0]?.skillId).toBe('code.echo');
  });

  it('并发注册不同技能', async () => {
    const registry = new SkillRegistry();
    const skills = ['test.a', 'test.b', 'test.c'].map((id) => createEchoSkill(id));

    await Promise.all(skills.map((skill) => Promise.resolve().then(() => registry.register(skill))));
    expect(registry.list()).toHaveLength(3);
  });
});
