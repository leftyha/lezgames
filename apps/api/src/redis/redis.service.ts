import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis?: Redis;
  private readonly memory = new Map<string, { value: number; expiresAt: number }>();

  constructor() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1, enableOfflineQueue: false });
      void this.redis.connect().catch(() => undefined);
    }
  }

  async incrWithTtl(key: string, ttlSeconds: number) {
    if (this.redis?.status === 'ready') {
      const count = await this.redis.incr(key);
      if (count === 1) await this.redis.expire(key, ttlSeconds);
      const ttl = await this.redis.ttl(key);
      return { count, ttlSeconds: ttl > 0 ? ttl : ttlSeconds, backend: 'redis' as const };
    }

    const now = Date.now();
    const existing = this.memory.get(key);
    if (!existing || existing.expiresAt <= now) {
      this.memory.set(key, { value: 1, expiresAt: now + ttlSeconds * 1000 });
      return { count: 1, ttlSeconds, backend: 'memory-fallback' as const };
    }

    existing.value += 1;
    return { count: existing.value, ttlSeconds: Math.ceil((existing.expiresAt - now) / 1000), backend: 'memory-fallback' as const };
  }

  async onModuleDestroy() {
    await this.redis?.quit().catch(() => undefined);
  }
}
