import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models';
import * as presenceService from '../services/presenceService';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export async function streamPresence(req: Request, res: Response): Promise<void> {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Normalize IP (strip IPv4-mapped IPv6 prefix ::ffff:)
  const ip = (req.ip ?? '127.0.0.1').replace(/^::ffff:/, '');

  // Optionally decode JWT from query param
  let key = `${ip}:anon`;
  let value = 'anon';
  const token = typeof req.query.token === 'string' ? req.query.token : undefined;
  if (token) {
    try {
      const payload = jwt.verify(token, env.jwt.secret) as JwtPayload;
      const user = await User.findByPk(payload.id, { attributes: ['pseudo'] });
      if (user) {
        key = `${ip}:user:${payload.id}`;
        value = user.pseudo;
      }
    } catch {
      // Invalid / expired token → treat as anonymous
    }
  }

  presenceService.addSseClient(res);
  await presenceService.connect(key, value);

  // Send current state immediately to this client
  await presenceService.broadcast();

  req.on('close', () => {
    presenceService.removeSseClient(res);
    presenceService.disconnect(key).catch(() => {/* already logged in service */});
  });
}
