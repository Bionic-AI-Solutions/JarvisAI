import Redis from 'ioredis';
import { logger } from './logger';

interface RedisSentinelOptions {
  sentinels: Array<{ host: string; port: number }>;
  sentinelName: string;
  password?: string;
  db?: number;
}

export function createRedisClient(options: RedisSentinelOptions): Redis {
  try {
    const client = new Redis({
      sentinels: options.sentinels,
      name: options.sentinelName,
      password: options.password,
      db: options.db || 0,
      connectTimeout: 5000,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      enableOfflineQueue: true,
    });

    client.on('connect', () => {
      logger.info('Redis: Connected to cluster');
    });

    client.on('error', (err) => {
      logger.error('Redis: Connection error', { error: err.message });
    });

    client.on('close', () => {
      logger.warn('Redis: Connection closed');
    });

    client.on('reconnecting', () => {
      logger.info('Redis: Attempting to reconnect');
    });

    return client;
  } catch (error) {
    logger.error('Failed to create Redis client', { error });
    throw error;
  }
}

export async function closeRedisClient(client: Redis): Promise<void> {
  if (!client) return;
  try {
    await client.quit();
    logger.info('Redis: Connection closed gracefully');
  } catch (error) {
    logger.warn('Redis: Error closing connection', { error });
    await client.disconnect();
  }
}
