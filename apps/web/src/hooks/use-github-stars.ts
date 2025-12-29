'use client';

import { useEffect, useState } from 'react';

interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  error?: string;
}

const CACHE_KEY = 'github_stats_cache';

// 从 localStorage 获取缓存
function getCachedStats(): GitHubStats | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to read cache:', error);
  }

  return null;
}

// 保存到 localStorage
function setCachedStats(stats: GitHubStats) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save cache:', error);
  }
}

export function useGitHubStars() {
  const [stats, setStats] = useState<GitHubStats>(() => {
    // 首次加载时尝试使用缓存，否则使用默认值 0
    const cached = getCachedStats();
    return (
      cached || {
        stars: 0,
        forks: 0,
        watchers: 0,
      }
    );
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('/api/github/stars');
        const data: GitHubStats = await response.json();

        // 如果 API 返回成功的数据（stars > 0），更新并缓存
        if (data.stars > 0) {
          setStats(data);
          setCachedStats(data);
        } else {
          // API 失败，使用缓存值或保持当前值
          const cached = getCachedStats();
          if (cached && cached.stars > 0) {
            setStats(cached);
          }
          // 否则保持默认值 0
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
        // API 调用失败，尝试使用缓存值
        const cached = getCachedStats();
        if (cached && cached.stars > 0) {
          setStats(cached);
        }
        // 否则保持默认值 0
      } finally {
        setLoading(false);
      }
    };

    fetchStars();

    // 每 5 分钟刷新一次数据
    const interval = setInterval(fetchStars, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { ...stats, loading };
}
