import { execFile } from 'node:child_process';
import { z } from 'zod';
import type { SkillDefinition } from '../types';

const execGit = (args: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    execFile('git', args, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        const message = (stderr || stdout || error.message).toString().trim();
        reject(new Error(message || 'git command failed'));
        return;
      }
      resolve(stdout.toString().trim());
    });
  });

const gitCommitParametersSchema = z.object({
  message: z.string().min(1),
  files: z.array(z.string().min(1)).min(1),
});

const gitCommitReturnsSchema = z.object({
  commitHash: z.string().min(1),
  timestamp: z.string().min(1),
});

export const gitCommitSkill: SkillDefinition<
  z.input<typeof gitCommitParametersSchema>,
  z.infer<typeof gitCommitReturnsSchema>
> = {
  skillId: 'git.commit',
  name: 'Git Commit',
  description: '提交指定文件到 Git 仓库',
  category: 'git',
  parametersSchema: gitCommitParametersSchema,
  returnsSchema: gitCommitReturnsSchema,
  handler: async ({ message, files }) => {
    await execGit(['add', '--', ...files]);
    await execGit(['commit', '-m', message]);
    const commitHash = await execGit(['rev-parse', 'HEAD']);
    return {
      commitHash,
      timestamp: new Date().toISOString(),
    };
  },
  handlerType: 'builtin',
  permissions: ['git:write'],
  version: '1.0.0',
};

const gitDiffParametersSchema = z.object({
  baseRef: z.string().min(1),
  targetRef: z.string().min(1),
});

const gitDiffFileSchema = z.object({
  path: z.string().min(1),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
});

const gitDiffReturnsSchema = z.object({
  files: z.array(gitDiffFileSchema),
  stats: z.object({
    filesChanged: z.number().int().nonnegative(),
    additions: z.number().int().nonnegative(),
    deletions: z.number().int().nonnegative(),
  }),
});

export const gitDiffSkill: SkillDefinition<
  z.input<typeof gitDiffParametersSchema>,
  z.infer<typeof gitDiffReturnsSchema>
> = {
  skillId: 'git.diff',
  name: 'Git Diff',
  description: '对比两个 Git 引用的差异统计',
  category: 'git',
  parametersSchema: gitDiffParametersSchema,
  returnsSchema: gitDiffReturnsSchema,
  handler: async ({ baseRef, targetRef }) => {
    const diffOutput = await execGit(['diff', '--numstat', `${baseRef}..${targetRef}`]);
    const files = diffOutput
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const [additionsRaw, deletionsRaw, filePath] = line.split('\t');
        if (!filePath) {
          return null;
        }
        const additions = Number.parseInt(additionsRaw ?? '0', 10);
        const deletions = Number.parseInt(deletionsRaw ?? '0', 10);
        return {
          path: filePath,
          additions: Number.isNaN(additions) ? 0 : additions,
          deletions: Number.isNaN(deletions) ? 0 : deletions,
        };
      })
      .filter((file): file is { path: string; additions: number; deletions: number } =>
        Boolean(file),
      );

    const stats = files.reduce(
      (acc, file) => {
        acc.filesChanged += 1;
        acc.additions += file.additions;
        acc.deletions += file.deletions;
        return acc;
      },
      { filesChanged: 0, additions: 0, deletions: 0 },
    );

    return {
      files,
      stats,
    };
  },
  handlerType: 'builtin',
  permissions: ['git:read'],
  version: '1.0.0',
};
