import Redis from 'ioredis';

/**
 * 获取 Redis 连接字符串
 * 优先从环境变量读取，否则使用默认值
 */
function getRedisUrl(): string {
  return process.env.REDIS_URL || 'redis://localhost:6379';
}

/**
 * Redis 客户端实例
 * 使用 ioredis 库，支持 Promise 和 TypeScript
 */
export const redis = new Redis(getRedisUrl(), {
  // 重试策略
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // 最大重试次数
  maxRetriesPerRequest: 3,
  // 启用离线队列（断线时缓存命令）
  enableOfflineQueue: true,
  // 连接超时
  connectTimeout: 10000,
});

// 连接事件监听
redis.on('connect', () => {
  console.log('✓ Redis connected');
});

redis.on('error', (err) => {
  console.error('✗ Redis connection error:', err.message);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

/**
 * 测试 Redis 连接
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    console.log('✓ Redis ping successful');
    return true;
  } catch (error) {
    console.error('✗ Redis ping failed:', error);
    return false;
  }
}

/**
 * 关闭 Redis 连接
 */
export async function closeRedisConnection(): Promise<void> {
  await redis.quit();
  console.log('Redis connection closed gracefully');
}

/**
 * Redis 缓存工具类
 * 提供常用的缓存操作方法
 */
export class CacheService {
  /**
   * 获取缓存值
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * 设置缓存值
   * @param ttl 过期时间（秒），默认 1 小时
   */
  async set(key: string, value: unknown, ttl = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  /**
   * 删除匹配模式的所有键
   */
  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  }

  /**
   * 设置键的过期时间
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await redis.expire(key, seconds);
    return result === 1;
  }

  /**
   * 获取键的剩余过期时间（秒）
   */
  async ttl(key: string): Promise<number> {
    return await redis.ttl(key);
  }

  /**
   * 原子递增
   */
  async incr(key: string): Promise<number> {
    return await redis.incr(key);
  }

  /**
   * 原子递减
   */
  async decr(key: string): Promise<number> {
    return await redis.decr(key);
  }

  /**
   * 列表操作：推入
   */
  async lpush(key: string, ...values: string[]): Promise<number> {
    return await redis.lpush(key, ...values);
  }

  /**
   * 列表操作：弹出
   */
  async lpop(key: string): Promise<string | null> {
    return await redis.lpop(key);
  }

  /**
   * 列表操作：获取范围
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await redis.lrange(key, start, stop);
  }
}

// 导出缓存服务实例
export const cache = new CacheService();
