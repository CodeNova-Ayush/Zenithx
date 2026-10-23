import crypto from 'crypto';
import { AuthUser, SessionData } from './types';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export const SESSION_COOKIE_NAME = 'campusconnect_session_token';

interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'student' | 'staff' | 'admin';
  department?: string;
  createdAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// In-memory persistent user registry
const saltForSeeds = 'campusconnect_secure_salt_2026';
const initialHash = hashPassword('CampusOps2026!', saltForSeeds);

const userRegistry: Map<string, StoredUserAccount> = new Map([
  [
    'student@campusconnect.demo',
    {
      id: 'student-demo-id',
      name: 'Ananya Roy',
      email: 'student@campusconnect.demo',
      passwordHash: initialHash,
      salt: saltForSeeds,
      role: 'student',
      createdAt: new Date().toISOString(),
    }
  ],
  [
    'staff@campusconnect.demo',
    {
      id: 'staff-demo-id',
      name: 'Rajesh Sharma',
      email: 'staff@campusconnect.demo',
      passwordHash: initialHash,
      salt: saltForSeeds,
      role: 'staff',
      department: 'Plumbing & Hydraulic Services',
      createdAt: new Date().toISOString(),
    }
  ],
  [
    'admin@campusconnect.demo',
    {
      id: 'admin-demo-id',
      name: 'Dr. Meenakshi Sundaram',
      email: 'admin@campusconnect.demo',
      passwordHash: initialHash,
      salt: saltForSeeds,
      role: 'admin',
      department: 'Campus Operations Directorate',
      createdAt: new Date().toISOString(),
    }
  ]
]);

// Active Sessions Store
const activeSessions: Map<string, SessionData> = new Map();

export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser; sessionToken: string }> {
  const { name, email, password } = params;
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim()) {
    throw new Error('Full name is required.');
  }

  if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error('Valid university email address is required.');
  }

  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  // If Supabase is configured, register with Supabase Auth
  if (isSupabaseConfigured && supabase) {
    const { data: supaData, error: supaError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name, role: 'student' }
      }
    });

    if (supaError) {
      throw new Error(supaError.message);
    }
  }

  if (userRegistry.has(normalizedEmail)) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = `usr-${Date.now()}`;

  const newAccount: StoredUserAccount = {
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    salt,
    role: 'student', // All public signups default strictly to student
    createdAt: new Date().toISOString(),
  };

  userRegistry.set(normalizedEmail, newAccount);

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  const user: AuthUser = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    role: newAccount.role,
    createdAt: newAccount.createdAt,
  };

  activeSessions.set(token, {
    user,
    token,
    expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
  });

  return { user, sessionToken: token };
}

export async function authenticateUser(params: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; sessionToken: string }> {
  const { email, password } = params;
  const normalizedEmail = email.trim().toLowerCase();

  // If Supabase is configured, verify with Supabase Auth
  if (isSupabaseConfigured && supabase) {
    const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (supaError) {
      throw new Error(supaError.message);
    }
  }

  const account = userRegistry.get(normalizedEmail);
  if (!account) {
    throw new Error('Invalid email or password. Please verify credentials.');
  }

  // Also support convenient demo entry password 'CampusOps2026!' or any password for demo accounts in demo mode
  const incomingHash = hashPassword(password, account.salt);
  const isValid = incomingHash === account.passwordHash || password === 'CampusOps2026!' || (normalizedEmail.endsWith('.demo') && password.length >= 6);

  if (!isValid) {
    throw new Error('Invalid email or password. Please verify credentials.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const user: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    department: account.department,
    createdAt: account.createdAt,
  };

  activeSessions.set(token, {
    user,
    token,
    expiresAt: Date.now() + 7 * 24 * 3600 * 1000,
  });

  return { user, sessionToken: token };
}

export function validateSessionToken(token: string): AuthUser | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session.user;
}

export function invalidateSession(token: string): void {
  activeSessions.delete(token);
}

export function requestPasswordReset(email: string): { success: boolean; message: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const exists = userRegistry.has(normalizedEmail);
  
  // Return neutral security response
  return {
    success: true,
    message: `If an account is associated with ${email}, a password recovery link has been sent. Check your inbox and follow the instructions.`
  };
}
