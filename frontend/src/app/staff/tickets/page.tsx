'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTickets, updateTicketStatus } from '@/lib/data/store';
import { Ticket, TicketStatus } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, CAMPUS_BUILDINGS } from '@/lib/constants';
import { 
  Search, 
  ArrowUpDown, 
  AlertTriangle,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function StaffTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'slaDeadline'>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const loadData = () => {
    setTickets(getTickets());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, []);

  const filteredTickets = tickets
    .filter((t) => {
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (buildingFilter !== 'all' && t.building !== buildingFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.ticketNumber.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.studentName.toLowerCase().includes(q) ||
          t.building.toLowerCase().includes(q) ||
          (t.assignedStaffName && t.assignedStaffName.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'priority') {
        const pWeight: Record<string, number> = { urgent: 4, high: 3, normal: 2, low: 1 };
        const diff = (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0);
        return sortAsc ? -diff : diff;
      }
      if (sortField === 'slaDeadline') {
        const diff = new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
        return sortAsc ? -diff : diff;
      }
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortAsc ? -diff : diff;
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredTickets.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: TicketStatus) => {
    if (selectedIds.length === 0) return;
    if (confirm(`Update ${selectedIds.length} tickets to ${status.toUpperCase()}?`)) {
      selectedIds.forEach(id => {
        updateTicketStatus(id, status, 'Bulk Operations Dispatch');
      });
      setSelectedIds([]);
      loadData();
    }
  };

  const toggleSort = (field: 'createdAt' | 'priority' | 'slaDeadline') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F]">
            Operations Incident Ledger
          </h1>
          <p className="text-xs text-[#77766E] mt-0.5">
            Real-time multi-department maintenance tracking with SLA enforcement and contractor assignment.
          </p>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-[#35483A] text-[#F8F4ED] text-xs font-mono">
            <span className="px-2 font-bold tabular-nums">{selectedIds.length} selected</span>
            <button
              onClick={() => handleBulkStatus('in_progress')}
              className="px-2 py-1 rounded bg-[#FCFAF6]/20 hover:bg-[#FCFAF6]/30 text-[#F8F4ED] font-medium"
            >
              In Progress
            </button>
            <button
              onClick={() => handleBulkStatus('resolved')}
              className="px-2 py-1 rounded bg-[#E7EBDD] text-[#35483A] font-bold"
            >
              Resolve
            </button>
          </div>
        )}
      </div>

      {/* 2. COMPACT SEARCH & MULTI-FILTER BAR */}
      <div className="p-3 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        <div className="relative lg:col-span-1">
          <Search className="w-3.5 h-3.5 text-[#77766E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, student, technician..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] placeholder:text-[#77766E]/60 focus:outline-none focus:ring-1 focus:ring-[#35483A]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs font-mono text-[#24251F] focus:outline-none"
        >
          <option value="all">All Sectors</option>
          <option value="plumbing">Plumbing</option>
          <option value="electricity">Electrical</option>
          <option value="cleanliness">Sanitation</option>
          <option value="internet">Network / IT</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs font-mono text-[#24251F] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="reopened">Reopened</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs font-mono text-[#24251F] focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs font-mono text-[#24251F] focus:outline-none truncate"
        >
          <option value="all">All Buildings</option>
          {CAMPUS_BUILDINGS.map((b) => (
            <option key={b.id} value={b.building}>
              {b.buildingCode} - {b.building}
            </option>
          ))}
        </select>
      </div>

      {/* 3. EDITORIAL TABLE */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F4ED] border-b border-[#E7E1D7] text-[#77766E] font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                    className="rounded border-[#D5CEBF] text-[#35483A]"
                  />
                </th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort('createdAt')}>
                  <div className="flex items-center gap-1">
                    <span>Incident</span>
                    <ArrowUpDown className="w-3 h-3 text-[#77766E]" />
                  </div>
                </th>
                <th className="p-3">Category</th>
                <th className="p-3">Facility</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort('priority')}>
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-[#77766E]" />
                  </div>
                </th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Staff</th>
                <th className="p-3 cursor-pointer" onClick={() => toggleSort('slaDeadline')}>
                  <div className="flex items-center gap-1">
                    <span>SLA Target</span>
                    <ArrowUpDown className="w-3 h-3 text-[#77766E]" />
                  </div>
                </th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E1D7]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#77766E] font-mono">
                    No tickets match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-[#F8F4ED] transition-colors"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(t.id)}
                        onChange={() => toggleSelect(t.id)}
                        className="rounded border-[#D5CEBF] text-[#35483A]"
                      />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/staff/tickets/${t.id}`}
                        className="font-mono font-bold text-[#35483A] hover:underline"
                      >
                        {t.ticketNumber}
                      </Link>
                      <div className="text-[#24251F] font-medium truncate max-w-xs">{t.title}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CATEGORY_COLORS[t.category]?.bg || 'bg-stone-100'} ${CATEGORY_COLORS[t.category]?.text || 'text-stone-800'}`}>
                        {CATEGORY_LABELS[t.category] || t.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      <div className="text-[#24251F]">{t.building.split('(')[0]}</div>
                      <div className="text-[#77766E]">Fl. {t.floor || 'G'} • {t.room}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${PRIORITY_COLORS[t.priority]?.bg || 'bg-stone-100'} ${PRIORITY_COLORS[t.priority]?.text || 'text-stone-800'}`}>
                        {PRIORITY_LABELS[t.priority] || t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        t.status === 'resolved' || t.status === 'closed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : t.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-stone-100 text-stone-800 border-stone-200'
                      }`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#24251F]">
                      {t.assignedStaffName || (
                        <span className="text-amber-800 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {t.isOverdue && t.status !== 'closed' && t.status !== 'resolved' ? (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> SLA Breach
                        </span>
                      ) : (
                        <span className="text-[#77766E]">{t.slaTargetHours}h Target</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/staff/tickets/${t.id}`}
                        className="btn-secondary text-[11px] px-2.5 py-1"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3 ml-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
