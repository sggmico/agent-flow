#!/usr/bin/env node
/**
 * 数据库连接测试脚本
 * 用于快速验证数据库配置是否正确
 */

import { testConnection } from '../packages/database/src/client.js';

async function main() {
  console.log('🔍 测试数据库连接...\n');

  const connected = await testConnection();

  if (connected) {
    console.log('\n✨ 数据库连接测试通过!\n');
    process.exit(0);
  } else {
    console.log('\n❌ 数据库连接失败，请检查配置\n');
    console.log('💡 提示:');
    console.log('  - 检查 .env 文件中的 DATABASE_URL');
    console.log('  - 确保使用 Supabase Session Pooler 连接');
    console.log('  - 查看文档: docs.local/001_database_setup_with_drizzle_and_pgvector.md\n');
    process.exit(1);
  }
}

main();
