import { resolve } from 'node:path';
import { config } from 'dotenv';
import type { NextConfig } from 'next';

/**
 * Monorepo 环境变量分层加载
 *
 * 分层策略：
 * - L1: repo/.env → 后端共享（DATABASE_URL, *_API_KEY）
 * - L2/L3: apps/web/.env.local → App 私有 + NEXT_PUBLIC_*
 *
 * 核心规则：
 * - ✅ NEXT_PUBLIC_* 只在 app 层定义
 * - ❌ 禁止在根 .env 定义 NEXT_PUBLIC_*
 *
 */

const monorepoRoot = resolve(__dirname, '../../');
const appRoot = __dirname;

// L1: 全局后端共享
config({ path: resolve(monorepoRoot, '.env') });

// L2/L3: App 私有 + NEXT_PUBLIC_*（覆盖全局）
config({ path: resolve(appRoot, '.env.local'), override: true });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@agent-flow/shared', '@agent-flow/ui'],
  outputFileTracingRoot: monorepoRoot, // Monorepo 工作空间根目录
};

export default nextConfig;
