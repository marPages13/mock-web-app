import { createApp } from './app';
import { sequelize, User } from './models';
import { env } from './config/env';
import logger from './logger';
import bcrypt from 'bcryptjs';
import * as storageService from './services/storageService';
import { redisPublisher, redisSubscriber } from './config/redis';
import { subscribeToChanges } from './services/presenceService';

// Catch unhandled promise rejections (e.g. ioredis reconnect errors) so they
// don't propagate as uncaught exceptions and crash requests.
process.on('unhandledRejection', (reason) => {
  logger.warn('Unhandled promise rejection (non-fatal)', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

async function seedAdmin() {
  if (!env.admin.email || !env.admin.password) return;

  const existing = await User.findOne({ where: { role: 'admin' } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.admin.password, 12);
  await User.create({
    pseudo: 'Admin',
    email: env.admin.email,
    passwordHash,
    role: 'admin',
  });
  logger.info(`Admin account created: ${env.admin.email}`);
}

async function waitForDb(retries = 10, delayMs = 3000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      logger.warn(`Database not ready, retrying in ${delayMs / 1000}s… (${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function connectRedis(): Promise<void> {
  // Ping to confirm both clients can reach Redis
  await redisPublisher.ping();
  await redisSubscriber.ping();
  subscribeToChanges();
  logger.info('Redis connected and presence subscription active');
}

async function start() {
  try {
    // Connect and sync DB schema (with retry for slow MySQL startup)
    await waitForDb();
    logger.info('Database connection established');

    await sequelize.sync({ alter: env.nodeEnv !== 'production' });
    logger.info('Database schema synchronised');

    // Seed admin if needed
    await seedAdmin();

    // Initialize MinIO buckets
    await storageService.initBuckets();
    logger.info('MinIO buckets initialised');

    await connectRedis();

    // Start HTTP server
    const app = createApp();
    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err });
    process.exit(1);
  }
}

start();
