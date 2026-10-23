'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getTickets } from '@/lib/data/store';
import { Ticket } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { Search, ArrowRight, Building2, Plus, Calendar } from 'lucide-react';

export default function StudentTicketsListPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadData = () => {
    const all = getTickets();
    setTickets(all.filter(t => t.studentId === user?.id || t.studentEmail === user?.email));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.building.toLowerCase().includes(q) ||
        t.originalDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F]">
            My Incident Tickets
          </h1>
          <p className="text-xs text-[#77766E] mt-0.5">
            Full audit ledger of all maintenance complaints submitted by {user?.name}.
          </p>
        </div>
        <Link
          href="/student/report"
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* 2. COMPACT SEARCH & EDITORIAL FILTERS */}
      <div className="p-3 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#77766E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, building, or description..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] placeholder:text-[#77766E]/60 focus:outline-none focus:ring-1 focus:ring-[#35483A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electricity">Electrical</option>
            <option value="cleanliness">Sanitation</option>
            <option value="internet">IT Wi-Fi</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>
        </div>
      </div>

      {/* 3. STRUCTURED TICKET TABLE */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-[#77766E] text-xs font-mono">
            No incident tickets match the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-[#E7E1D7]">
            {filteredTickets.map((t) => (
              <Link
                key={t.id}
                href={`/student/tickets/${t.id}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F8F4ED] transition-colors group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#35483A]">
                      {t.ticketNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
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
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${PRIORITY_COLORS[t.priority]?.bg || 'bg-stone-100'} ${PRIORITY_COLORS[t.priority]?.text || 'text-stone-800'}`}>
                      {PRIORITY_LABELS[t.priority] || t.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#24251F] group-hover:text-[#35483A] transition-colors truncate">
                    {t.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-[#77766E]">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {t.building} (Fl. {t.floor || 'G'})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-medium text-[#77766E] group-hover:text-[#35483A] flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5" />
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
