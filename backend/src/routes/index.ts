import { Router, Request, Response } from 'express';
import { sequelize } from '../models';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import messageRoutes from './message.routes';
import presenceRoutes from './presence.routes';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', db: 'unreachable' });
  }
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/presence', presenceRoutes);

export default router;
