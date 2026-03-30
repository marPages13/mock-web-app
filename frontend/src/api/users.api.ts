import { apiClient } from './client';
import type { User, UpdateProfilePayload, UpdateUserAdminPayload } from '../types/user.types';

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>('/users/me');
  return data.user;
}

export async function updateMe(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await apiClient.put<{ user: User }>('/users/me', payload);
  return data.user;
}

export async function listUsers(): Promise<User[]> {
  const { data } = await apiClient.get<{ users: User[] }>('/users');
  return data.users;
}

export async function getUser(id: number): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>(`/users/${id}`);
  return data.user;
}

export async function updateUser(id: number, payload: UpdateUserAdminPayload): Promise<User> {
  const { data } = await apiClient.put<{ user: User }>(`/users/${id}`, payload);
  return data.user;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}

export async function uploadAvatar(file: File): Promise<string> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await apiClient.put<{ avatarUrl: string }>('/users/me/avatar', form);
  return data.avatarUrl;
}
