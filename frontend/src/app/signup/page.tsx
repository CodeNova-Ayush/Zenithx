'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your full student name.');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please provide a valid university email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the campus operations policy to continue.');
      return;
    }

    setLoading(true);
    const res = await signup(name, email, password);
    setLoading(false);

    if (res.success) {
      router.push('/student');
    } else {
      setError(res.error || 'Failed to create student account.');
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
                Student Account Enrollment
              </span>
              <h2 className="text-2xl font-bold text-[#24251F] leading-snug">
                Join your university&apos;s verified operations layer.
              </h2>
              <p className="text-xs text-[#77766E] leading-relaxed pt-1">
                Report plumbing, electrical, hygiene, and connectivity defects in residential hostels and academic halls with verified resolution tracking.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E7E1D7] space-y-2 text-[11px] text-[#77766E]">
            <div className="flex items-center gap-2 text-[#35483A] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Role-Protected Access</span>
            </div>
            <p>New public registrations receive secure Student permissions with residence hall access.</p>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-[#24251F]">
              Create student account
            </h1>
            <p className="text-xs text-[#77766E] mt-1">
              Already registered?{' '}
              <Link href="/login" className="text-[#35483A] font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#F7E5E5] border border-[#E6BCBC] text-xs text-[#9E2A2B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Roy"
                className="w-full p-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#24251F] text-xs focus:outline-none focus:ring-2 focus:ring-[#35483A]/30 focus:border-[#35483A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E] mb-1.5">
                University Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full p-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#24251F] text-xs focus:outline-none focus:ring-2 focus:ring-[#35483A]/30 focus:border-[#35483A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
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

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full p-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#24251F] text-xs focus:outline-none focus:ring-2 focus:ring-[#35483A]/30 focus:border-[#35483A]"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 pt-1 text-xs text-[#77766E] cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#35483A] focus:ring-[#35483A]"
              />
              <span>I confirm enrollment as an active student and agree to respectful campus reporting rules.</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
            >
              <span>{loading ? 'Registering Account...' : 'Create Student Account'}</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
