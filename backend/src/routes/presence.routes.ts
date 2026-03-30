import { Router } from 'express';
import { streamPresence } from '../controllers/presence.controller';

const router = Router();

/**
 * @swagger
 * /presence/stream:
 *   get:
 *     summary: Real-time presence stream (SSE)
 *     tags: [Presence]
 *     description: Opens a Server-Sent Events stream that emits the list of currently online users.
 *     responses:
 *       200:
 *         description: SSE stream
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
router.get('/stream', streamPresence);

export default router;
