import { builtinSkills } from './builtin';
import { SkillRegistry } from './registry';

export * from './errors';
export * from './registry';
export * from './types';
export {
  codeAnalyzeSkill,
  fileReadSkill,
  fileWriteSkill,
  gitCommitSkill,
  gitDiffSkill,
} from './builtin';

export const createDefaultSkillRegistry = () => {
  const registry = new SkillRegistry();
  registry.registerAll(builtinSkills);
  return registry;
};
