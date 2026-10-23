'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your registered university email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit request.');
      }
    } catch {
      setError('Network communication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 paper-canvas">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-[#E7E1D7] shadow-xl bg-[#FCFAF6] space-y-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77766E] hover:text-[#24251F]">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>

        <div>
          <h1 className="text-xl font-bold text-[#24251F]">
            Reset your password
          </h1>
          <p className="text-xs text-[#77766E] mt-1">
            Enter your university email address and we will dispatch a password recovery link.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#F7E5E5] border border-[#E6BCBC] text-xs text-[#9E2A2B] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-5 rounded-2xl bg-[#E7EBDD] border border-[#CCD6BE] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#35483A] mx-auto" />
            <h3 className="text-xs font-bold text-[#35483A] uppercase tracking-wider font-mono">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-[#35483A] leading-relaxed">
              If an active account is registered with <strong>{email}</strong>, check your inbox for instructions to reset your password.
            </p>
            <div className="pt-2">
              <Link href="/login" className="text-xs font-bold text-[#35483A] underline">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#77766E] mb-1.5">
                University Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                className="w-full p-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#24251F] text-xs focus:outline-none focus:ring-2 focus:ring-[#35483A]/30 focus:border-[#35483A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              <span>{loading ? 'Sending Recovery Link...' : 'Send Password Recovery Link'}</span>
              <Send className="w-3.5 h-3.5 btn-arrow" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
