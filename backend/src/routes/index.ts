import { Router, Request, Response } from 'express';
import { sequelize } from '../models';
import { redisPublisher } from '../config/redis';
import { minioClient } from '../config/storage';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import messageRoutes from './message.routes';
import presenceRoutes from './presence.routes';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  const checks: Record<string, string> = { db: 'ok', redis: 'ok', minio: 'ok' };

  try {
    await sequelize.authenticate();
  } catch {
    checks.db = 'unreachable';
  }

  try {
    await redisPublisher.ping();
  } catch {
    checks.redis = 'unreachable';
  }

  try {
    await minioClient.listBuckets();
  } catch {
    checks.minio = 'unreachable';
  }

  const allOk = Object.values(checks).every((v) => v === 'ok');
  res.status(allOk ? 200 : 503).json({ status: allOk ? 'ok' : 'degraded', ...checks });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/presence', presenceRoutes);

export default router;
