import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * 用户表
 * 存储平台用户信息
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  // 认证相关（预留，后续可集成 NextAuth）
  passwordHash: text('password_hash'),
  // 时间戳
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
