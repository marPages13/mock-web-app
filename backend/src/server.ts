import { createApp } from './app';
import { sequelize, User } from './models';
import { env } from './config/env';
import logger from './logger';
import bcrypt from 'bcryptjs';
import * as storageService from './services/storageService';

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

async function start() {
  try {
    // Connect and sync DB schema
    await sequelize.authenticate();
    logger.info('Database connection established');

    await sequelize.sync({ alter: env.nodeEnv !== 'production' });
    logger.info('Database schema synchronised');

    // Seed admin if needed
    await seedAdmin();

    // Initialize MinIO buckets
    await storageService.initBuckets();
    logger.info('MinIO buckets initialised');

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
