/**
 * @agent-flow/database
 * 数据库包统一导出
 */

// 导出数据库客户端和连接工具
export { db, client, testConnection, closeConnection } from './client';

// 导出所有 schema 和类型
export * from './schema';

// 导出查询层
export * from './queries/agent-skills';
export * from './queries/skills';

// 导出常用查询构建器，确保在同一 drizzle-orm 实例下使用
export { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';
