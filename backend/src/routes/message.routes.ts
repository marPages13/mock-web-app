import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { upload } from '../middleware/upload';
import {
  getMessages,
  createMessage,
  createMessageValidation,
  deleteMessage,
} from '../controllers/message.controller';

const router = Router();

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get paginated messages (public)
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 30 }
 *       - in: query
 *         name: before
 *         description: Cursor — returns messages with id less than this value
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of messages with hasMore flag
 */
router.get('/', getMessages);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Post a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *               imageKey: { type: string }
 *     responses:
 *       201:
 *         description: Message created
 *       401:
 *         description: Authentication required
 */
router.post('/', verifyJWT, upload.single('file'), createMessageValidation, createMessage);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message (admin)
 *     tags: [Admin - Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Message deleted
 *       404:
 *         description: Message not found
 */
router.delete('/:id', verifyJWT, requireAdmin, deleteMessage);

export default router;
