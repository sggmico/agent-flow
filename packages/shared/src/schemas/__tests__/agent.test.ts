import { describe, expect, it } from 'vitest';
import {
  agentIdSchema,
  agentListQuerySchema,
  agentStatusSchema,
  createAgentSchema,
  executeAgentSchema,
  llmModelSchema,
  updateAgentSchema,
} from '../agent';

describe('Agent Schemas', () => {
  describe('agentStatusSchema', () => {
    it('应该接受有效的状态值', () => {
      const validStatuses = ['idle', 'working', 'completed', 'failed', 'paused'];
      for (const status of validStatuses) {
        expect(() => agentStatusSchema.parse(status)).not.toThrow();
      }
    });

    it('应该拒绝无效的状态值', () => {
      expect(() => agentStatusSchema.parse('invalid')).toThrow();
      expect(() => agentStatusSchema.parse('')).toThrow();
      expect(() => agentStatusSchema.parse(123)).toThrow();
    });
  });

  describe('llmModelSchema', () => {
    it('应该接受有效的模型名称', () => {
      const validModels = [
        'claude-sonnet-4',
        'claude-opus-4',
        'gpt-4o',
        'gpt-4-turbo',
        'gemini-2.0-flash',
      ];
      for (const model of validModels) {
        expect(() => llmModelSchema.parse(model)).not.toThrow();
      }
    });

    it('应该拒绝无效的模型名称', () => {
      expect(() => llmModelSchema.parse('gpt-3.5-turbo')).toThrow();
      expect(() => llmModelSchema.parse('invalid-model')).toThrow();
    });
  });

  describe('createAgentSchema', () => {
    const validAgent = {
      name: 'Test Agent',
      role: 'code_reviewer',
      description: 'A test agent',
      model: 'claude-sonnet-4' as const,
      systemPrompt: 'You are a helpful assistant',
      temperature: 70,
      maxTokens: 4000,
      tools: ['search', 'code_analysis'],
      createdBy: 1,
    };

    it('应该接受完整有效的 agent 数据', () => {
      expect(() => createAgentSchema.parse(validAgent)).not.toThrow();
      const result = createAgentSchema.parse(validAgent);
      expect(result).toEqual(validAgent);
    });

    it('应该使用默认值填充可选字段', () => {
      const minimalAgent = {
        name: 'Minimal Agent',
        role: 'debugger',
        createdBy: 1,
      };
      const result = createAgentSchema.parse(minimalAgent);

      expect(result.model).toBe('claude-sonnet-4');
      expect(result.temperature).toBe(70);
      expect(result.maxTokens).toBe(4000);
      expect(result.tools).toEqual([]);
    });

    describe('name 字段验证', () => {
      it('应该拒绝空名称', () => {
        const invalidAgent = { ...validAgent, name: '' };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('名称不能为空');
      });

      it('应该拒绝超长名称', () => {
        const invalidAgent = { ...validAgent, name: 'a'.repeat(101) };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('名称不能超过100个字符');
      });
    });

    describe('role 字段验证', () => {
      it('应该拒绝空角色', () => {
        const invalidAgent = { ...validAgent, role: '' };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('角色不能为空');
      });

      it('应该拒绝超长角色', () => {
        const invalidAgent = { ...validAgent, role: 'a'.repeat(51) };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('角色不能超过50个字符');
      });
    });

    describe('description 字段验证', () => {
      it('应该接受可选的描述', () => {
        const agentWithoutDesc = { ...validAgent };
        delete (agentWithoutDesc as any).description;
        expect(() => createAgentSchema.parse(agentWithoutDesc)).not.toThrow();
      });

      it('应该拒绝超长描述', () => {
        const invalidAgent = { ...validAgent, description: 'a'.repeat(501) };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('描述不能超过500个字符');
      });
    });

    describe('temperature 字段验证', () => {
      it('应该接受 0-100 范围内的值', () => {
        const validTemperatures = [0, 50, 100];
        for (const temp of validTemperatures) {
          const agent = { ...validAgent, temperature: temp };
          expect(() => createAgentSchema.parse(agent)).not.toThrow();
        }
      });

      it('应该拒绝超出范围的值', () => {
        const invalidAgent1 = { ...validAgent, temperature: -1 };
        expect(() => createAgentSchema.parse(invalidAgent1)).toThrow();

        const invalidAgent2 = { ...validAgent, temperature: 101 };
        expect(() => createAgentSchema.parse(invalidAgent2)).toThrow();
      });

      it('应该拒绝小数值', () => {
        const invalidAgent = { ...validAgent, temperature: 70.5 };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow();
      });
    });

    describe('maxTokens 字段验证', () => {
      it('应该接受 100-100000 范围内的值', () => {
        const validTokens = [100, 4000, 100000];
        for (const tokens of validTokens) {
          const agent = { ...validAgent, maxTokens: tokens };
          expect(() => createAgentSchema.parse(agent)).not.toThrow();
        }
      });

      it('应该拒绝小于 100 的值', () => {
        const invalidAgent = { ...validAgent, maxTokens: 99 };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('最大 token 数不能小于100');
      });

      it('应该拒绝大于 100000 的值', () => {
        const invalidAgent = { ...validAgent, maxTokens: 100001 };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('最大 token 数不能超过100000');
      });
    });

    describe('systemPrompt 字段验证', () => {
      it('应该接受可选的系统提示词', () => {
        const agentWithoutPrompt = { ...validAgent };
        delete (agentWithoutPrompt as any).systemPrompt;
        expect(() => createAgentSchema.parse(agentWithoutPrompt)).not.toThrow();
      });

      it('应该拒绝超长系统提示词', () => {
        const invalidAgent = { ...validAgent, systemPrompt: 'a'.repeat(4001) };
        expect(() => createAgentSchema.parse(invalidAgent)).toThrow('系统提示词不能超过4000个字符');
      });
    });

    describe('createdBy 字段验证', () => {
      it('应该拒绝非正整数', () => {
        const invalidAgents = [
          { ...validAgent, createdBy: 0 },
          { ...validAgent, createdBy: -1 },
          { ...validAgent, createdBy: 1.5 },
        ];
        for (const agent of invalidAgents) {
          expect(() => createAgentSchema.parse(agent)).toThrow();
        }
      });
    });
  });

  describe('updateAgentSchema', () => {
    it('应该接受所有字段为可选', () => {
      const emptyUpdate = {};
      expect(() => updateAgentSchema.parse(emptyUpdate)).not.toThrow();
    });

    it('应该接受部分字段更新', () => {
      const partialUpdate = {
        name: 'Updated Name',
        temperature: 80,
      };
      expect(() => updateAgentSchema.parse(partialUpdate)).not.toThrow();
      const result = updateAgentSchema.parse(partialUpdate);
      expect(result).toEqual(partialUpdate);
    });

    it('应该验证 status 字段', () => {
      const validUpdate = { status: 'paused' as const };
      expect(() => updateAgentSchema.parse(validUpdate)).not.toThrow();

      const invalidUpdate = { status: 'invalid' };
      expect(() => updateAgentSchema.parse(invalidUpdate)).toThrow();
    });

    it('应该保持与 createAgentSchema 相同的验证规则', () => {
      const invalidUpdates = [
        { name: '' }, // 空名称
        { role: 'a'.repeat(51) }, // 超长角色
        { temperature: 101 }, // 温度超出范围
        { maxTokens: 50 }, // token 数过小
      ];

      for (const update of invalidUpdates) {
        expect(() => updateAgentSchema.parse(update)).toThrow();
      }
    });
  });

  describe('agentListQuerySchema', () => {
    it('应该使用默认值解析空查询', () => {
      const result = agentListQuerySchema.parse({});
      expect(result).toEqual({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('应该强制转换字符串为数字', () => {
      const query = { page: '2', limit: '20' };
      const result = agentListQuerySchema.parse(query);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(typeof result.page).toBe('number');
      expect(typeof result.limit).toBe('number');
    });

    it('应该验证 page 必须为正整数', () => {
      expect(() => agentListQuerySchema.parse({ page: 0 })).toThrow();
      expect(() => agentListQuerySchema.parse({ page: -1 })).toThrow();
    });

    it('应该验证 limit 范围 (1-100)', () => {
      expect(() => agentListQuerySchema.parse({ limit: 0 })).toThrow();
      expect(() => agentListQuerySchema.parse({ limit: 101 })).toThrow();

      const validResult = agentListQuerySchema.parse({ limit: 50 });
      expect(validResult.limit).toBe(50);
    });

    it('应该验证 sortBy 枚举值', () => {
      const validSortBy = ['createdAt', 'updatedAt', 'name'];
      for (const sortBy of validSortBy) {
        const result = agentListQuerySchema.parse({ sortBy });
        expect(result.sortBy).toBe(sortBy);
      }

      expect(() => agentListQuerySchema.parse({ sortBy: 'invalid' })).toThrow();
    });

    it('应该验证 sortOrder 枚举值', () => {
      const validOrders = ['asc', 'desc'];
      for (const sortOrder of validOrders) {
        const result = agentListQuerySchema.parse({ sortOrder });
        expect(result.sortOrder).toBe(sortOrder);
      }

      expect(() => agentListQuerySchema.parse({ sortOrder: 'invalid' })).toThrow();
    });

    it('应该接受可选的 status 和 search', () => {
      const query = {
        status: 'working' as const,
        search: 'test',
      };
      const result = agentListQuerySchema.parse(query);
      expect(result.status).toBe('working');
      expect(result.search).toBe('test');
    });
  });

  describe('agentIdSchema', () => {
    it('应该强制转换字符串 ID 为数字', () => {
      const result = agentIdSchema.parse({ id: '123' });
      expect(result.id).toBe(123);
      expect(typeof result.id).toBe('number');
    });

    it('应该拒绝非正整数 ID', () => {
      expect(() => agentIdSchema.parse({ id: 0 })).toThrow();
      expect(() => agentIdSchema.parse({ id: -1 })).toThrow();
      expect(() => agentIdSchema.parse({ id: 1.5 })).toThrow();
    });

    it('应该拒绝无效的 ID 格式', () => {
      expect(() => agentIdSchema.parse({ id: 'abc' })).toThrow();
      expect(() => agentIdSchema.parse({ id: null })).toThrow();
      expect(() => agentIdSchema.parse({})).toThrow();
    });
  });

  describe('executeAgentSchema', () => {
    it('应该接受任意 JSON 对象作为输入', () => {
      const validInputs = [
        { input: { task: 'review code' } },
        { input: { files: ['a.ts', 'b.ts'], options: { strict: true } } },
        { input: {} },
      ];

      for (const data of validInputs) {
        expect(() => executeAgentSchema.parse(data)).not.toThrow();
      }
    });

    it('应该拒绝非对象的输入', () => {
      const invalidInputs = [{ input: 'string' }, { input: 123 }, { input: null }, { input: [] }];

      for (const data of invalidInputs) {
        expect(() => executeAgentSchema.parse(data)).toThrow();
      }
    });

    it('应该要求 input 字段存在', () => {
      expect(() => executeAgentSchema.parse({})).toThrow();
    });
  });
});
