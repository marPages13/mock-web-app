import Redis from 'ioredis';
import { env } from './env';
import logger from '../logger';

const opts = {
  host: env.redis.host,
  port: env.redis.port,
  // Do not throw on commands while disconnected — queue them instead
  enableOfflineQueue: true,
  // Cap reconnect attempts to avoid infinite noise
  maxRetriesPerRequest: null,
  retryStrategy: (times: number) => {
    if (times > 20) return null; // stop retrying after 20 attempts
    return Math.min(times * 200, 5000);
  },
};

function attachErrorHandler(client: Redis, name: string): Redis {
  client.on('error', (err: Error) =>
    logger.warn(`Redis ${name} connection error (will retry)`, { message: err.message }),
  );
  return client;
}

// Used for HSET / HDEL / PUBLISH and all regular commands
export const redisPublisher = attachErrorHandler(new Redis(opts), 'publisher');

// Dedicated client for SUBSCRIBE — cannot run other commands while subscribed
export const redisSubscriber = attachErrorHandler(new Redis(opts), 'subscriber');
