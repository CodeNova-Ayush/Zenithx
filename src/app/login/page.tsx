'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { Building2, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (email.includes('staff') || email.includes('admin')) {
        router.push('/staff');
      } else {
        router.push('/student');
      }
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoPersona = (role: UserRole) => {
    loginAsDemo(role);
    if (role === 'student') {
      router.push('/student');
    } else {
      router.push('/staff');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 paper-canvas">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-[#E7E1D7] shadow-xl bg-[#FCFAF6]">
        {/* Left Editorial Visual Section */}
        <div className="md:col-span-5 p-8 sm:p-10 bg-[#EDE4D7]/50 border-b md:border-b-0 md:border-r border-[#E7E1D7] flex flex-col justify-between">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#35483A] flex items-center justify-center text-[#F8F4ED]">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-tight text-[#24251F] text-base">
                CampusConnect
              </span>
            </Link>

            <div className="space-y-2 pt-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#77766E] font-bold">
                Operations Authentication
              </span>
              <h2 className="text-2xl font-bold text-[#24251F] leading-snug">
                One intelligent operations layer. Every issue accounted for.
              </h2>
              <p className="text-xs text-[#77766E] leading-relaxed pt-1">
                Access your campus maintenance workspace, track real-time SLA resolutions, and audit facility incident histories.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E7E1D7] space-y-2 text-[11px] text-[#77766E]">
            <div className="flex items-center gap-2 text-[#35483A] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Role-Protected Session</span>
            </div>
            <p>Access permissions are validated server-side for Student, Maintenance Staff, and Directorate roles.</p>
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[#24251F]">
              Sign in to CampusConnect
            </h1>
            <p className="text-xs text-[#77766E] mt-1">
              New to the platform?{' '}
              <Link href="/signup" className="text-[#35483A] font-bold hover:underline">
                Create a student account
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#F7E5E5] border border-[#E6BCBC] text-xs text-[#9E2A2B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E] mb-1.5">
                University Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ananya.roy@campus.edu"
                className="w-full p-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#24251F] text-xs focus:outline-none focus:ring-2 focus:ring-[#35483A]/30 focus:border-[#35483A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-[#77766E] hover:text-[#24251F] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pr-9 rounded-xl border border-[#D5CEBF] bg-white text-[#24251F] text-xs focus:outline-none focus:ring-2 focus:ring-[#35483A]/30 focus:border-[#35483A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77766E] hover:text-[#24251F]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </button>
          </form>

          {/* Quick Demo Access Bar (Clearly labelled) */}
          <div className="pt-6 border-t border-[#E7E1D7] space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#77766E]">
              <span className="font-mono uppercase font-bold flex items-center gap-1 text-[#35483A]">
                <Sparkles className="w-3 h-3 text-[#C87D28]" /> Judge & Evaluator Demo Entry
              </span>
              <span className="text-[10px]">Pre-seeded data</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <button
                type="button"
                onClick={() => handleDemoPersona('student')}
                className="p-2 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#EDE4D7]/60 text-[#24251F] font-semibold text-[11px] transition-colors"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleDemoPersona('staff')}
                className="p-2 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#EDE4D7]/60 text-[#24251F] font-semibold text-[11px] transition-colors"
              >
                Staff Lead
              </button>
              <button
                type="button"
                onClick={() => handleDemoPersona('admin')}
                className="p-2 rounded-xl border border-[#D5CEBF] bg-white hover:bg-[#EDE4D7]/60 text-[#24251F] font-semibold text-[11px] transition-colors"
              >
                Director
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
