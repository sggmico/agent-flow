import type { z } from 'zod';
import type { SkillCategory, SkillHandlerType, SkillMode } from '../schemas/skill';

export type SkillHandler<Params, Result> = (params: Params) => Promise<Result> | Result;

export interface SkillDefinition<Params, Result> {
  skillId: string;
  name: string;
  description: string;
  documentation?: string;
  mode?: SkillMode;
  category: SkillCategory;
  parametersSchema: z.ZodType<Params>;
  returnsSchema: z.ZodType<Result>;
  handler: SkillHandler<Params, Result>;
  handlerType?: SkillHandlerType;
  permissions?: string[];
  version?: string;
}
