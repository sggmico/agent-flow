import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * 获取数据库连接字符串
 * 优先从环境变量读取，否则抛出错误
 */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
        'Please set it in your .env file or environment.',
    );
  }

  return url;
}

/**
 * PostgreSQL 连接客户端
 * 使用 postgres.js 作为底层驱动
 */
export const client = postgres(getDatabaseUrl(), {
  max: 10, // 最大连接数
  idle_timeout: 20, // 空闲超时（秒）
  connect_timeout: 10, // 连接超时（秒）
});

/**
 * Drizzle ORM 数据库实例
 * 提供类型安全的查询 API
 */
export const db = drizzle(client, { schema });

/**
 * 测试数据库连接
 */
export async function testConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

/**
 * 关闭数据库连接
 * 在应用关闭时调用
 */
export async function closeConnection(): Promise<void> {
  await client.end();
  console.log('Database connection closed');
}
