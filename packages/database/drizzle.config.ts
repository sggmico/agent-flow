import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { resolve } from 'path';

// 加载根目录的 .env 文件
config({ path: resolve(__dirname, '../../.env') });

/**
 * Drizzle Kit 配置
 * 用于生成迁移文件和管理数据库 schema
 */
export default defineConfig({
  // 数据库方言
  dialect: 'postgresql',

  // Schema 文件路径
  schema: './src/schema/**/*.ts',

  // 迁移文件输出目录
  out: './migrations',

  // 数据库连接配置
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },

  // 是否在控制台输出详细日志
  verbose: true,

  // 是否在迁移时严格模式（检查数据丢失风险）
  strict: true,
});
