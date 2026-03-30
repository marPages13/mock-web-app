import { apiClient } from './client';
import type { User, LoginPayload, RegisterPayload } from '../types/user.types';

export async function register(payload: RegisterPayload): Promise<{ user: User }> {
  const { data } = await apiClient.post<{ user: User }>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post<{ token: string; user: User }>('/auth/login', payload);
  return data;
}
