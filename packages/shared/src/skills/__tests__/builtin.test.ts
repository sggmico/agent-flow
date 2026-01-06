import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { builtinSkills } from '../builtin';
import { SkillRegistry } from '../registry';

describe('Builtin Skills', () => {
  it('file.read 和 file.write 可以读写文件', async () => {
    const registry = new SkillRegistry();
    registry.registerAll(builtinSkills);

    const tempDir = await mkdtemp(join(tmpdir(), 'agent-flow-'));
    const filePath = join(tempDir, 'note.txt');

    try {
      const writeResult = (await registry.execute('file.write', {
        path: filePath,
        content: 'hello',
      })) as { bytesWritten: number; path: string };
      expect(writeResult.bytesWritten).toBe(5);

      const readResult = (await registry.execute('file.read', { path: filePath })) as {
        content: string;
        size: number;
      };
      expect(readResult.content).toBe('hello');
      expect(readResult.size).toBe(5);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('code.analyze 返回基本统计信息', async () => {
    const registry = new SkillRegistry();
    registry.registerAll(builtinSkills);

    const result = (await registry.execute('code.analyze', {
      code: 'function demo() {}\nclass Demo {}',
      language: 'typescript',
    })) as {
      metrics: { lines: number; functions: number; classes: number };
    };

    expect(result.metrics.lines).toBe(2);
    expect(result.metrics.functions).toBeGreaterThan(0);
    expect(result.metrics.classes).toBe(1);
  });
});
