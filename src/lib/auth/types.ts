import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SessionData {
  user: AuthUser;
  token: string;
  expiresAt: number;
}
