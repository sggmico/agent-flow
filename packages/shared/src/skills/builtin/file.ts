import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { z } from 'zod';
import type { SkillDefinition } from '../types';

const fileReadParametersSchema = z.object({
  path: z.string().min(1),
  encoding: z.string().default('utf8'),
});

const fileReadReturnsSchema = z.object({
  content: z.string(),
  size: z.number().int().nonnegative(),
});

export const fileReadSkill: SkillDefinition<
  z.input<typeof fileReadParametersSchema>,
  z.infer<typeof fileReadReturnsSchema>
> = {
  skillId: 'file.read',
  name: 'Read File',
  description: '读取文件内容',
  category: 'filesystem',
  parametersSchema: fileReadParametersSchema,
  returnsSchema: fileReadReturnsSchema,
  handler: async ({ path, encoding }) => {
    const [content, stats] = await Promise.all([
      readFile(path, { encoding: encoding as BufferEncoding }),
      stat(path),
    ]);
    return {
      content: String(content),
      size: stats.size,
    };
  },
  handlerType: 'builtin',
  permissions: ['filesystem:read'],
  version: '1.0.0',
};

const fileWriteParametersSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
});

const fileWriteReturnsSchema = z.object({
  bytesWritten: z.number().int().nonnegative(),
  path: z.string().min(1),
});

export const fileWriteSkill: SkillDefinition<
  z.input<typeof fileWriteParametersSchema>,
  z.infer<typeof fileWriteReturnsSchema>
> = {
  skillId: 'file.write',
  name: 'Write File',
  description: '写入文件内容',
  category: 'filesystem',
  parametersSchema: fileWriteParametersSchema,
  returnsSchema: fileWriteReturnsSchema,
  handler: async ({ path, content }) => {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, { encoding: 'utf8' });
    return {
      bytesWritten: Buffer.byteLength(content, 'utf8'),
      path,
    };
  },
  handlerType: 'builtin',
  permissions: ['filesystem:write'],
  version: '1.0.0',
};
