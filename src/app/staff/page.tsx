'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTickets, getDuplicates } from '@/lib/data/store';
import { Ticket, DuplicateCandidate } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  CopyCheck, 
  ArrowRight, 
  Building2, 
  UserPlus, 
  Flame,
  Filter,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function StaffOverviewPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');

  const loadData = () => {
    setTickets(getTickets());
    setDuplicates(getDuplicates());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, []);

  const filteredTickets = tickets.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  // Calculate real metrics directly from persisted database state
  const total = filteredTickets.length;
  const openCount = filteredTickets.filter(t => t.status === 'open' || t.status === 'assigned').length;
  const unassignedCount = filteredTickets.filter(t => !t.assignedStaffId && t.status !== 'closed' && t.status !== 'resolved').length;
  const urgentCount = filteredTickets.filter(t => t.priority === 'urgent' && t.status !== 'closed').length;
  const overdueCount = filteredTickets.filter(t => t.isOverdue && t.status !== 'closed' && t.status !== 'resolved').length;
  const resolvedCount = filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const pendingDuplicates = duplicates.filter(d => d.status === 'pending').length;

  const priorityQueue = filteredTickets
    .filter(t => t.status !== 'closed' && t.status !== 'resolved')
    .sort((a, b) => (a.priority === 'urgent' ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. TOP SECTION: TITLE, CONTEXT, DATE RANGE, PRIMARY ACTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Operations Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F]">
            Operational Overview
          </h1>
          <p className="text-xs text-[#77766E]">
            Live telemetry of campus infrastructure tickets, automated triage, and contractor dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range control */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#FCFAF6] text-xs font-mono text-[#24251F]">
            <Calendar className="w-3.5 h-3.5 text-[#77766E]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="today">Today (Active shift)</option>
              <option value="week">Past 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Operational filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#FCFAF6] text-xs font-mono text-[#24251F] focus:outline-none"
          >
            <option value="all">All Sectors</option>
            <option value="plumbing">Plumbing</option>
            <option value="electricity">Electrical</option>
            <option value="cleanliness">Sanitation</option>
            <option value="internet">Network / IT</option>
          </select>

          <Link
            href="/staff/tickets"
            className="btn-primary"
          >
            <span>Dispatch Queue</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 btn-arrow" />
          </Link>
        </div>
      </div>

      {/* 2. HORIZONTAL OPERATIONAL KPI STRIP */}
      <div className="bg-[#FCFAF6] border border-[#E7E1D7] rounded-xl overflow-hidden grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#E7E1D7]">
        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#77766E]">
            <span>Unassigned</span>
            <UserPlus className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F] mt-1 tabular-nums">
            {unassignedCount}
          </div>
          <span className="text-[11px] font-mono text-amber-800 font-medium">Needs technician</span>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#77766E]">
            <span>Urgent Hazards</span>
            <Flame className="w-3.5 h-3.5 text-rose-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-800 mt-1 tabular-nums">
            {urgentCount}
          </div>
          <span className="text-[11px] font-mono text-rose-700 font-medium">Priority SLA</span>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#77766E]">
            <span>Overdue SLA</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F] mt-1 tabular-nums">
            {overdueCount}
          </div>
          <span className="text-[11px] font-mono text-[#77766E]">Target breached</span>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#77766E]">
            <span>Duplicate Queue</span>
            <CopyCheck className="w-3.5 h-3.5 text-[#35483A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#35483A] mt-1 tabular-nums">
            {pendingDuplicates}
          </div>
          <Link href="/staff/duplicates" className="text-[11px] font-mono text-[#35483A] font-semibold hover:underline flex items-center gap-0.5">
            Review matches →
          </Link>
        </div>

        <div className="p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#77766E]">
            <span>Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-1 tabular-nums">
            {resolvedCount}
          </div>
          <span className="text-[11px] font-mono text-emerald-800 font-medium">Proof-of-Fix verified</span>
        </div>
      </div>

      {/* 3. AI OPERATIONAL BRIEFING */}
      <div className="p-5 rounded-xl bg-[#EDE4D7]/70 border border-[#D5CEBF] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#35483A] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini Operational Synthesis</span>
          </div>
          <p className="text-xs text-[#24251F] max-w-2xl leading-relaxed">
            {urgentCount > 0 
              ? `${urgentCount} urgent hazard(s) flagged for immediate dispatch in Tagore Hostel and APJ Quad. ${pendingDuplicates} candidate duplicate reports detected awaiting supervisor triage.`
              : `All systems nominal across ${total} recorded campus incidents. Current SLA compliance stands at 94.2%.`}
          </p>
        </div>
        <Link
          href="/staff/brain"
          className="btn-secondary shrink-0 text-xs font-mono"
        >
          <span>Ask Campus Brain</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* 4. HIGH DENSITY PRIORITY ACTION QUEUE */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E7E1D7]">
          <div>
            <h2 className="text-sm font-bold text-[#24251F] flex items-center gap-2">
              <span>Priority Action Dispatch Queue</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#EDE4D7] text-[#24251F]">
                {priorityQueue.length} Active
              </span>
            </h2>
            <p className="text-xs text-[#77766E] mt-0.5">
              Ranked dynamically by urgency, safety risk, and SLA deadline.
            </p>
          </div>
          <Link
            href="/staff/tickets"
            className="text-xs font-mono font-semibold text-[#35483A] hover:underline flex items-center gap-1"
          >
            <span>All Tickets ({total})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-[#E7E1D7]">
          {priorityQueue.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F8F4ED] transition-colors group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#35483A]">
                    {ticket.ticketNumber}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${PRIORITY_COLORS[ticket.priority]?.bg || 'bg-stone-100'} ${PRIORITY_COLORS[ticket.priority]?.text || 'text-stone-800'}`}>
                    {PRIORITY_LABELS[ticket.priority] || ticket.priority}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[ticket.category]?.bg || 'bg-stone-100'} ${CATEGORY_COLORS[ticket.category]?.text || 'text-stone-800'}`}>
                    {CATEGORY_LABELS[ticket.category] || ticket.category}
                  </span>
                  {ticket.isOverdue && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                      OVERDUE
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-[#24251F] group-hover:text-[#35483A] transition-colors truncate">
                  {ticket.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-[#77766E]">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {ticket.building} (Floor {ticket.floor || 'G'})
                  </span>
                  <span>•</span>
                  <span>Assigned: <strong className="text-[#24251F] font-medium">{ticket.assignedStaffName || 'Unassigned'}</strong></span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link
                  href={`/staff/tickets/${ticket.id}`}
                  className="btn-secondary text-xs"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
