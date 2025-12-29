import { NextResponse } from 'next/server';

// GitHub 仓库配置 - 在环境变量中配置
// 优先使用服务端专用的 GITHUB_REPO，回退到 NEXT_PUBLIC_GITHUB_REPO
const GITHUB_REPO = (
  process.env.GITHUB_REPO ||
  process.env.NEXT_PUBLIC_GITHUB_REPO ||
  'yourusername/agent-flow'
).replace(/\/+$/, ''); // 移除末尾斜杠
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // 可选，提高 API 限制

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

export async function GET() {
  try {
    // 调试日志：查看环境变量实际值
    console.log('DEBUG: 环境变量读取');
    console.log('  process.env.NEXT_PUBLIC_GITHUB_REPO:', process.env.NEXT_PUBLIC_GITHUB_REPO);
    console.log('  GITHUB_REPO (处理后):', GITHUB_REPO);
    console.log('  GITHUB_TOKEN:', GITHUB_TOKEN ? '已配置' : '未配置');

    const url = `https://api.github.com/repos/${GITHUB_REPO}`;
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // 如果配置了 GitHub Token，添加到请求头
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    console.log(`Fetching GitHub data from: ${url}`);

    const response = await fetch(url, {
      headers,
      // 缓存 1 小时 (3600 秒)
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} - ${errorText}`);
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data: GitHubRepoResponse = await response.json();

    return NextResponse.json({
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
    });
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error);

    // 返回默认值 0，客户端会使用缓存值
    return NextResponse.json(
      {
        stars: 0,
        forks: 0,
        watchers: 0,
        error: 'Failed to fetch GitHub data',
      },
      { status: 500 },
    );
  }
}
