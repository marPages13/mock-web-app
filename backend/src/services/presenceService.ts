import type { Response } from 'express';
import { redisPublisher, redisSubscriber } from '../config/redis';
import logger from '../logger';

const HASH_KEY = 'presence';
const CHANNEL = 'presence:changes';

// Number of open SSE connections per (ip:identity) key
const refCounts = new Map<string, number>();
// Every open SSE response object
const sseClients = new Set<Response>();

export function addSseClient(res: Response): void {
  sseClients.add(res);
}

export function removeSseClient(res: Response): void {
  sseClients.delete(res);
}

/** Call when a new SSE connection opens. Adds the key to Redis on first connection. */
export async function connect(key: string, value: string): Promise<void> {
  const count = (refCounts.get(key) ?? 0) + 1;
  refCounts.set(key, count);
  if (count === 1) {
    await redisPublisher.hset(HASH_KEY, key, value);
    await redisPublisher.publish(CHANNEL, '');
  }
}

/** Call when an SSE connection closes. Removes the key from Redis when the last connection drops. */
export async function disconnect(key: string): Promise<void> {
  const count = (refCounts.get(key) ?? 1) - 1;
  if (count <= 0) {
    refCounts.delete(key);
    await redisPublisher.hdel(HASH_KEY, key);
  } else {
    refCounts.set(key, count);
  }
  await redisPublisher.publish(CHANNEL, '');
}

/** Read the full presence Hash and push the current state to every SSE client. */
export async function broadcast(): Promise<void> {
  const hash = (await redisPublisher.hgetall(HASH_KEY)) ?? {};
  const values = Object.values(hash);
  const anon = values.filter((v) => v === 'anon').length;
  // Deduplicate pseudos (same user on multiple IPs shows once in the list)
  const users = [...new Set(values.filter((v) => v !== 'anon'))].sort();
  const data = `data: ${JSON.stringify({ anon, users })}\n\n`;
  for (const res of sseClients) {
    res.write(data);
  }
}

/** Subscribe to the Pub/Sub channel and broadcast on every change. Call once at startup. */
export function subscribeToChanges(): void {
  redisSubscriber.subscribe(CHANNEL, (err) => {
    if (err) logger.error('Redis subscribe error', { error: err });
  });
  redisSubscriber.on('message', () => {
    broadcast().catch((err) => logger.error('Presence broadcast error', { error: err }));
  });
}
