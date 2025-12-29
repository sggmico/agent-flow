import { resolve } from 'node:path';
import { config } from 'dotenv';
import type { NextConfig } from 'next';

// 加载根目录的 .env 文件（Monorepo 环境变量管理）
config({ path: resolve(__dirname, '../../.env') });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@agent-flow/shared', '@agent-flow/ui'],
};

export default nextConfig;
