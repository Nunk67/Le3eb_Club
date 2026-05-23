import { Redis } from 'ioredis';
import { loadEnv } from '../config/env.js';
import { logger } from '../logging/logger.js';

export interface ICache {
  get(key: string): Promise<string | null>;
  setex(key: string, ttl: number, value: string): Promise<void>;
  del(key: string): Promise<number>;
  setnx(key: string, ttl: number, value: string): Promise<boolean>;
  ping(): Promise<'PONG'>;
}

class MemoryCache implements ICache {
  private store = new Map<string, { v: string; exp: number }>();
  private sweep() {
    const now = Date.now();
    for (const [k, e] of this.store) if (e.exp < now) this.store.delete(k);
  }
  async get(key: string) {
    this.sweep();
    const e = this.store.get(key);
    return e ? e.v : null;
  }
  async setex(key: string, ttl: number, value: string) {
    this.store.set(key, { v: value, exp: Date.now() + ttl * 1000 });
  }
  async del(key: string) {
    return this.store.delete(key) ? 1 : 0;
  }
  async setnx(key: string, ttl: number, value: string) {
    this.sweep();
    if (this.store.has(key)) return false;
    await this.setex(key, ttl, value);
    return true;
  }
  async ping() {
    return 'PONG' as const;
  }
}

class RedisCache implements ICache {
  constructor(private c: Redis) {}
  get(key: string) {
    return this.c.get(key);
  }
  async setex(key: string, ttl: number, value: string) {
    await this.c.setex(key, ttl, value);
  }
  del(key: string) {
    return this.c.del(key);
  }
  async setnx(key: string, ttl: number, value: string) {
    return (await this.c.set(key, value, 'EX', ttl, 'NX')) === 'OK';
  }
  async ping() {
    return (await this.c.ping()) as 'PONG';
  }
}

let cached: ICache | null = null;

export function getCache(): ICache {
  if (cached) return cached;
  const env = loadEnv();
  if (env.REDIS_URL) {
    const client = new Redis(env.REDIS_URL);
    client.on('error', e => logger.error({ err: e }, 'redis_error'));
    cached = new RedisCache(client);
    return cached;
  }
  if (env.NODE_ENV === 'production') throw new Error('REDIS_URL required in production');
  logger.warn('using in-memory cache');
  cached = new MemoryCache();
  return cached;
}
