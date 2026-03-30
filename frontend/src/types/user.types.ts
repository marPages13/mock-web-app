export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  pseudo: string;
  email: string;
  bio: string | null;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface RegisterPayload {
  pseudo: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  pseudo?: string;
  bio?: string;
}

export interface UpdateUserAdminPayload {
  pseudo?: string;
  bio?: string;
  email?: string;
  role?: UserRole;
}
