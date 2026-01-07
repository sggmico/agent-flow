const browserOnlyError = (): never => {
  throw new Error('Redis is only available in the Node.js runtime.');
};

export const redis = undefined as never;

export async function testRedisConnection(): Promise<boolean> {
  browserOnlyError();
}

export async function closeRedisConnection(): Promise<void> {
  browserOnlyError();
}

export class CacheService {
  async get<T>(_key: string): Promise<T | null> {
    browserOnlyError();
  }

  async set(_key: string, _value: unknown, _ttl = 3600): Promise<void> {
    browserOnlyError();
  }

  async del(_key: string): Promise<void> {
    browserOnlyError();
  }

  async delPattern(_pattern: string): Promise<void> {
    browserOnlyError();
  }

  async exists(_key: string): Promise<boolean> {
    browserOnlyError();
  }

  async expire(_key: string, _seconds: number): Promise<boolean> {
    browserOnlyError();
  }

  async ttl(_key: string): Promise<number> {
    browserOnlyError();
  }

  async incr(_key: string): Promise<number> {
    browserOnlyError();
  }

  async decr(_key: string): Promise<number> {
    browserOnlyError();
  }

  async lpush(_key: string, ..._values: string[]): Promise<number> {
    browserOnlyError();
  }

  async lpop(_key: string): Promise<string | null> {
    browserOnlyError();
  }

  async lrange(_key: string, _start: number, _stop: number): Promise<string[]> {
    browserOnlyError();
  }
}

export const cache = new CacheService();
