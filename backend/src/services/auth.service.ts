import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { env } from '../config/env';

const SALT_ROUNDS = 12;

export async function register(
  pseudo: string,
  email: string,
  password: string,
): Promise<User> {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = Object.assign(new Error('Email already in use'), { status: 409 });
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return User.create({ pseudo, email, passwordHash });
}

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  const user = await User.findOne({ where: { email }, attributes: { include: ['passwordHash'] } });
  if (!user) {
    const err = Object.assign(new Error('Invalid credentials'), { status: 401 });
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = Object.assign(new Error('Invalid credentials'), { status: 401 });
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'] },
  );

  return { token, user };
}
