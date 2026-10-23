'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { AuthUser } from '@/lib/auth/types';
import { DEMO_PROFILES } from '@/lib/constants';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(true);

  // Load session from server / cookie on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setRole(data.user.role);
        } else {
          // Check saved demo role or fallback to default student demo
          const savedRole = (localStorage.getItem('campusconnect_active_role') as UserRole) || 'student';
          const demoProfile = DEMO_PROFILES[savedRole] || DEMO_PROFILES.student;
          setUser({
            id: demoProfile.id,
            name: demoProfile.name,
            email: demoProfile.email,
            role: demoProfile.role,
            department: demoProfile.department,
            avatarUrl: demoProfile.avatarUrl,
            createdAt: new Date().toISOString(),
          });
          setRole(demoProfile.role);
        }
      } catch (err) {
        console.warn('Session check fallback', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Authentication failed.' };
      }

      setUser(data.user);
      setRole(data.user.role);
      localStorage.setItem('campusconnect_active_role', data.user.role);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Network error during login.' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setIsLoading(false);
        return { success: false, error: data.error || 'Registration failed.' };
      }

      setUser(data.user);
      setRole('student');
      localStorage.setItem('campusconnect_active_role', 'student');
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Network error during registration.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
  };

  const loginAsDemo = (targetRole: UserRole) => {
    const demoProfile = DEMO_PROFILES[targetRole] || DEMO_PROFILES.student;
    const demoUser: AuthUser = {
      id: demoProfile.id,
      name: demoProfile.name,
      email: demoProfile.email,
      role: demoProfile.role,
      department: demoProfile.department,
      avatarUrl: demoProfile.avatarUrl,
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
    setRole(demoProfile.role);
    localStorage.setItem('campusconnect_active_role', targetRole);
    window.dispatchEvent(new Event('campusconnect_role_change'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        loginAsDemo,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
