import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as userService from '../services/user.service';
import { User, UserRole } from '../models/user.model';
import crypto from 'crypto';
import * as storageService from '../services/storageService';
import { env } from '../config/env';

interface SerializedUser {
  id: number;
  pseudo: string;
  email: string;
  bio: string | null;
  role: UserRole;
  createdAt: Date;
  avatarUrl: string | null;
}

export async function serializeUser(user: User): Promise<SerializedUser> {
  let avatarUrl: string | null = null;
  if (user.avatarKey) {
    avatarUrl = storageService.getPublicUrl(env.minio.bucketAvatars, user.avatarKey);
  }
  return {
    id: user.id,
    pseudo: user.pseudo,
    email: user.email,
    bio: user.bio ?? null,
    role: user.role,
    createdAt: user.createdAt,
    avatarUrl,
  };
}

export const updateMeValidation = [
  body('pseudo').optional().trim().notEmpty().isLength({ max: 64 }),
  body('bio').optional().isString().isLength({ max: 500 }),
];

export const updateUserAdminValidation = [
  body('pseudo').optional().trim().notEmpty().isLength({ max: 64 }),
  body('bio').optional().isString().isLength({ max: 500 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin']),
];

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.findById(req.user!.id);
    res.json({ user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { pseudo, bio } = req.body as { pseudo?: string; bio?: string };
    const user = await userService.updateUser(req.user!.id, { pseudo, bio });
    res.json({ user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.findAll();
    const serialized = await Promise.all(users.map(serializeUser));
    res.json({ users: serialized });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.findById(Number(req.params.id));
    res.json({ user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { pseudo, bio, email, role } = req.body;
    const user = await userService.updateUserAdmin(Number(req.params.id), {
      pseudo,
      bio,
      email,
      role,
    });
    res.json({ user: await serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  try {
    const ext = req.file.originalname.split('.').pop() ?? 'bin';
    const objectName = `${crypto.randomUUID()}.${ext}`;

    await storageService.uploadFile(req.file.buffer, env.minio.bucketAvatars, objectName);

    const user = await userService.findById(req.user!.id);
    await user.update({ avatarKey: objectName });

    const avatarUrl = storageService.getPublicUrl(env.minio.bucketAvatars, objectName);
    res.json({ avatarUrl });
  } catch (err) {
    next(err);
  }
}
