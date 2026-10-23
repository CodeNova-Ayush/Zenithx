'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Building, Award, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user?.name.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Role: <strong className="uppercase text-teal-600 dark:text-teal-400">{user?.role}</strong> • University ID: STU-2024-884
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block mb-0.5">Primary Email</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400 block mb-0.5">Assigned Residence</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Tagore Hostel (Block C, Room 204)</span>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center text-xs">
          <Link
            href="/student"
            className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
          >
            ← Back to Student Dashboard
          </Link>
          <span className="text-slate-400">Account status: Active</span>
        </div>
      </div>
    </div>
  );
}
