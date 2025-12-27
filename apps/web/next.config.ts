import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@agent-flow/shared', '@agent-flow/ui'],
};

export default nextConfig;
