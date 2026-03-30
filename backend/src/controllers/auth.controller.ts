import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as authService from '../services/auth.service';
import { serializeUser } from './user.controller';

export const registerValidation = [
  body('pseudo').trim().notEmpty().withMessage('Pseudo is required').isLength({ max: 64 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export async function register(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { pseudo, email, password } = req.body as {
      pseudo: string;
      email: string;
      password: string;
    };
    const user = await authService.register(pseudo, email, password);
    res.status(201).json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    const { email, password } = req.body as { email: string; password: string };
    const { token, user } = await authService.login(email, password);
    res.json({ token, user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}
