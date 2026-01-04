import { resolve } from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

// 加载环境变量
config();

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        'scripts/**',
        'apps/web/.next/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@agent-flow/shared': resolve(__dirname, './packages/shared/src'),
      '@agent-flow/database': resolve(__dirname, './packages/database/src'),
    },
  },
});
