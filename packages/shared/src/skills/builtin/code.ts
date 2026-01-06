import { z } from 'zod';
import type { SkillDefinition } from '../types';

const codeAnalyzeParametersSchema = z.object({
  code: z.string().min(1),
  language: z.string().min(1).max(50),
});

const codeAnalyzeReturnsSchema = z.object({
  ast: z.record(z.string(), z.unknown()),
  metrics: z.object({
    lines: z.number().int().nonnegative(),
    characters: z.number().int().nonnegative(),
    functions: z.number().int().nonnegative(),
    classes: z.number().int().nonnegative(),
  }),
});

const countMatches = (source: string, matcher: RegExp) => {
  const matches = source.match(matcher);
  return matches ? matches.length : 0;
};

export const codeAnalyzeSkill: SkillDefinition<
  z.input<typeof codeAnalyzeParametersSchema>,
  z.infer<typeof codeAnalyzeReturnsSchema>
> = {
  skillId: 'code.analyze',
  name: 'Analyze Code',
  description: '对代码进行基础结构分析并返回统计信息',
  category: 'code',
  parametersSchema: codeAnalyzeParametersSchema,
  returnsSchema: codeAnalyzeReturnsSchema,
  handler: async ({ code, language }) => {
    const lines = code.length > 0 ? code.split(/\r\n|\r|\n/).length : 0;
    const characters = code.length;
    const functions =
      countMatches(code, /\bfunction\b/g) + countMatches(code, /=>/g);
    const classes = countMatches(code, /\bclass\b/g);

    return {
      ast: {
        type: 'summary',
        language,
        nodes: [],
      },
      metrics: {
        lines,
        characters,
        functions,
        classes,
      },
    };
  },
  handlerType: 'builtin',
  permissions: ['code:read'],
  version: '1.0.0',
};
