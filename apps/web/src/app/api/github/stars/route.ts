import { NextResponse } from "next/server";

// GitHub 仓库配置
const GITHUB_REPO = (
  process.env.NEXT_PUBLIC_GITHUB_REPO || "yourusername/agent-flow"
).replace(/\/+$/, "");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
}

export async function GET() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}`;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }, // ISR 缓存 1 小时
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
    console.error("Failed to fetch GitHub stars:", error);

    return NextResponse.json(
      {
        stars: 0,
        forks: 0,
        watchers: 0,
        error: "Failed to fetch GitHub data",
      },
      { status: 500 }
    );
  }
}
