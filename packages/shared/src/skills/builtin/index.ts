export { codeAnalyzeSkill } from './code';
export { fileReadSkill, fileWriteSkill } from './file';
export { gitCommitSkill, gitDiffSkill } from './git';

import type { SkillDefinition } from '../types';

import { codeAnalyzeSkill } from './code';
import { fileReadSkill, fileWriteSkill } from './file';
import { gitCommitSkill, gitDiffSkill } from './git';

export const builtinSkills = [
  fileReadSkill,
  fileWriteSkill,
  codeAnalyzeSkill,
  gitCommitSkill,
  gitDiffSkill,
] as Array<SkillDefinition<unknown, unknown>>;
