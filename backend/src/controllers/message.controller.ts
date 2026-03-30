import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as messageService from '../services/message.service';
import { Message } from '../models/message.model';
import * as storageService from '../services/storageService';
import { env } from '../config/env';
import crypto from 'crypto';

async function serializeMessage(message: Message) {
  const user = message.user;
  let attachmentUrl: string | null = null;
  if (message.attachmentKey) {
    attachmentUrl = storageService.getPublicUrl(
      env.minio.bucketAttachments,
      message.attachmentKey,
    );
  }
  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    attachmentUrl,
    user: user ? { id: user.id, pseudo: user.pseudo } : null,
  };
}

export const createMessageValidation = [
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 2000 }),
];

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const before = req.query.before ? Number(req.query.before) : undefined;
    const after = req.query.after ? Number(req.query.after) : undefined;

    const { messages, hasMore } = await messageService.getMessages({ limit, before, after });
    const serialized = await Promise.all(messages.map(serializeMessage));
    res.json({ messages: serialized, hasMore });
  } catch (err) {
    next(err);
  }
}

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { content } = req.body as { content: string };
    let attachmentKey: string | null = null;

    if (req.file) {
      const ext = req.file.originalname.split('.').pop() ?? 'bin';
      const objectName = `${crypto.randomUUID()}.${ext}`;
      await storageService.uploadFile(req.file.buffer, env.minio.bucketAttachments, objectName);
      attachmentKey = objectName;
    }

    const message = await messageService.createMessage(req.user!.id, content, attachmentKey);
    res.status(201).json({ message: await serializeMessage(message) });
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    await messageService.deleteMessage(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
