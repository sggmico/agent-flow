import { describe, expect, it } from 'vitest';
import {
  skillCategorySchema,
  createSkillSchema,
  skillDefinitionSchema,
  skillExecutionSchema,
  skillHandlerTypeSchema,
  skillModeSchema,
} from '../skill';

describe('Skill Schemas', () => {
  describe('skillCategorySchema', () => {
    it('应该接受有效的分类', () => {
      const validCategories = ['filesystem', 'code', 'git', 'api', 'database', 'shell', 'other'];
      for (const category of validCategories) {
        expect(() => skillCategorySchema.parse(category)).not.toThrow();
      }
    });

    it('应该拒绝无效的分类', () => {
      expect(() => skillCategorySchema.parse('invalid')).toThrow();
    });
  });

  describe('skillHandlerTypeSchema', () => {
    it('应该接受有效的 handler 类型', () => {
      const validTypes = ['builtin', 'custom', 'remote'];
      for (const type of validTypes) {
        expect(() => skillHandlerTypeSchema.parse(type)).not.toThrow();
      }
    });
  });

  describe('skillModeSchema', () => {
    it('应该接受有效的模式', () => {
      const validModes = ['prompt', 'tool'];
      for (const mode of validModes) {
        expect(() => skillModeSchema.parse(mode)).not.toThrow();
      }
    });
  });

  describe('skillDefinitionSchema', () => {
    const baseDefinition = {
      skillId: 'file.read',
      name: 'Read File',
      description: '读取文件',
      category: 'filesystem' as const,
      parameters: { path: { type: 'string' } },
      returns: { content: { type: 'string' } },
      handler: 'file.read',
      createdBy: 1,
    };

    it('应该填充默认值', () => {
      const result = skillDefinitionSchema.parse(baseDefinition);
      expect(result.documentation).toBe('');
      expect(result.mode).toBe('tool');
      expect(result.handlerType).toBe('builtin');
      expect(result.permissions).toEqual([]);
      expect(result.estimatedCost).toEqual({});
      expect(result.version).toBe('1.0.0');
      expect(result.isActive).toBe(true);
      expect(result.isPublic).toBe(false);
      expect(result.usageCount).toBe(0);
    });

    it('应该拒绝空的 skillId', () => {
      expect(() => skillDefinitionSchema.parse({ ...baseDefinition, skillId: '' })).toThrow();
    });

    it('应该要求 createdBy 为正整数', () => {
      expect(() => skillDefinitionSchema.parse({ ...baseDefinition, createdBy: 0 })).toThrow();
    });

    it('应该允许 createdBy 为空', () => {
      const result = skillDefinitionSchema.parse({ ...baseDefinition, createdBy: null });
      expect(result.createdBy).toBeNull();
    });
  });

  describe('createSkillSchema', () => {
    it('应该允许 prompt 模式缺省 handler', () => {
      const result = createSkillSchema.parse({
        skillId: 'prompt.example',
        name: 'Prompt Example',
        description: 'Prompt 模式 Skill',
        mode: 'prompt',
        category: 'other',
      });
      expect(result.mode).toBe('prompt');
    });
  });

  describe('skillExecutionSchema', () => {
    it('应该接受最小执行输入', () => {
      const result = skillExecutionSchema.parse({
        skillId: 'file.read',
        input: { path: 'README.md' },
      });
      expect(result.skillId).toBe('file.read');
    });

    it('应该拒绝缺少 input', () => {
      expect(() => skillExecutionSchema.parse({ skillId: 'file.read' })).toThrow();
    });
  });
});
