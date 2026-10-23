'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getTickets } from '@/lib/data/store';
import { Ticket } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { 
  Sparkles, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function StudentHomePage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadData = () => {
    const all = getTickets();
    const studentTickets = all.filter(t => t.studentId === user?.id || t.studentEmail === user?.email);
    setTickets(studentTickets);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, [user]);

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'assigned');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. EDITORIAL HEADER & PRIMARY REPORT ACTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E7E1D7]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35483A]" />
            Student Operations Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#24251F]">
            Welcome, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-sm text-[#77766E] max-w-xl">
            Live overview of your campus maintenance dispatches. Every issue is tracked with cryptographic verification and photo proof.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/student/report"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Report Campus Issue</span>
          </Link>
        </div>
      </div>

      {/* 2. OPERATIONAL MAINTENANCE ADVISORY */}
      <div className="p-4 rounded-xl bg-[#EDE4D7]/50 border border-[#D5CEBF] flex items-start gap-3 text-xs text-[#24251F]">
        <Info className="w-4 h-4 text-[#35483A] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-mono font-bold uppercase tracking-wider text-[#35483A] mr-2">Notice:</span>
          <span>Basement riser pressure inspection scheduled for Tagore Hostel Block C between 14:00 and 17:00 today. Minor pressure drops expected.</span>
        </div>
      </div>

      {/* 3. HORIZONTAL METRIC STRIP (REPLACING OVERSIZED CARDS) */}
      <div className="bg-[#FCFAF6] border border-[#E7E1D7] rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E1D7]">
        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#77766E]">
            <span>Awaiting Action</span>
            <Clock className="w-3.5 h-3.5 text-[#77766E]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#24251F] mt-2 tabular-nums">
            {openTickets.length}
          </div>
          <p className="text-xs text-[#77766E] mt-1">Queued for automated contractor dispatch</p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#77766E]">
            <span>Active on-site</span>
            <Sparkles className="w-3.5 h-3.5 text-[#35483A]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#35483A] mt-2 tabular-nums">
            {inProgressTickets.length}
          </div>
          <p className="text-xs text-[#77766E] mt-1">Assigned technician currently working</p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#77766E]">
            <span>Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#24251F] mt-2 tabular-nums">
            {resolvedTickets.length}
          </div>
          <p className="text-xs text-[#77766E] mt-1">Verified with photographic Proof-of-Fix</p>
        </div>
      </div>

      {/* 4. STRUCTURED EDITORIAL TICKET LIST */}
      <div className="bg-[#FCFAF6] border border-[#E7E1D7] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#E7E1D7]">
          <div>
            <h2 className="text-base font-bold text-[#24251F]">
              Active Incident Tickets
            </h2>
            <p className="text-xs text-[#77766E] mt-0.5">
              Click any report to inspect technician progress, photos, and live lifecycle timeline.
            </p>
          </div>
          <Link
            href="/student/tickets"
            className="text-xs font-mono font-semibold text-[#35483A] hover:underline flex items-center gap-1"
          >
            <span>All Records ({tickets.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="py-14 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-[#EDE4D7] flex items-center justify-center mx-auto mb-3 text-[#35483A]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#24251F]">No active incident tickets</p>
            <p className="text-xs text-[#77766E] mt-1 max-w-sm mx-auto">
              You currently have no pending campus maintenance reports. If you notice any infrastructure issues, click Report Campus Issue above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E7E1D7]">
            {tickets.map((t) => (
              <Link
                key={t.id}
                href={`/student/tickets/${t.id}`}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8F4ED] transition-colors group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#35483A] tracking-wider">
                      {t.ticketNumber}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                      t.status === 'resolved' || t.status === 'closed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : t.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-stone-100 text-stone-800 border-stone-200'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[t.category]?.bg || 'bg-stone-100'} ${CATEGORY_COLORS[t.category]?.text || 'text-stone-800'}`}>
                      {CATEGORY_LABELS[t.category] || t.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#24251F] group-hover:text-[#35483A] transition-colors truncate">
                    {t.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-[#77766E]">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {t.building} {t.floor ? `(Floor ${t.floor})` : ''}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {t.status === 'resolved' && (
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                      Verify Resolution Proof
                    </span>
                  )}
                  <span className="text-xs font-medium text-[#77766E] group-hover:text-[#35483A] flex items-center gap-1">
                    Inspect <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
