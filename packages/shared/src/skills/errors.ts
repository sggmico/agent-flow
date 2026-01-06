export class SkillNotFoundError extends Error {
  readonly skillId: string;

  constructor(skillId: string) {
    super(`Skill not found: ${skillId}`);
    this.name = 'SkillNotFoundError';
    this.skillId = skillId;
  }
}

export class SkillValidationError extends Error {
  readonly skillId: string;
  readonly stage: 'parameters' | 'returns' | 'definition';

  constructor(skillId: string, stage: 'parameters' | 'returns' | 'definition', message: string) {
    super(message);
    this.name = 'SkillValidationError';
    this.skillId = skillId;
    this.stage = stage;
  }
}

export class SkillExecutionError extends Error {
  readonly skillId: string;

  constructor(skillId: string, message: string) {
    super(message);
    this.name = 'SkillExecutionError';
    this.skillId = skillId;
  }
}
