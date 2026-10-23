'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTickets, assignStaffToTicket } from '@/lib/data/store';
import { Ticket, StaffMember } from '@/lib/types';
import { DEMO_STAFF, CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { 
  UserCheck2, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function SmartDispatchPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const loadData = () => {
    const all = getTickets();
    const unassigned = all.filter(t => !t.assignedStaffId && t.status !== 'closed' && t.status !== 'resolved');
    setTickets(unassigned);
    if (unassigned.length > 0 && !selectedTicketId) {
      setSelectedTicketId(unassigned[0].id);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, []);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  // Rank staff for active ticket
  const rankCandidates = (ticket?: Ticket) => {
    if (!ticket) return [];

    return DEMO_STAFF.map(staff => {
      let score = 50;
      const reasons: string[] = [];

      // Skill match
      if (staff.skills.includes(ticket.category)) {
        score += 30;
        reasons.push(`Certified for ${CATEGORY_LABELS[ticket.category]}`);
      } else {
        score -= 20;
      }

      // Department match
      if (staff.department === ticket.department) {
        score += 15;
        reasons.push(`Member of ${staff.department}`);
      }

      // Location proximity
      if (staff.assignedBuilding === ticket.building) {
        score += 20;
        reasons.push(`Stationed at ${ticket.building}`);
      }

      // Workload penalty
      if (staff.activeWorkload === 0) {
        score += 15;
        reasons.push(`Zero active tasks; immediately available`);
      } else if (staff.activeWorkload <= 2) {
        score += 5;
        reasons.push(`Light queue (${staff.activeWorkload} active tasks)`);
      } else {
        score -= 10;
        reasons.push(`Heavy queue (${staff.activeWorkload} active tasks)`);
      }

      return {
        staff,
        score: Math.min(Math.max(score, 10), 99),
        reasons,
      };
    }).sort((a, b) => b.score - a.score);
  };

  const candidates = rankCandidates(activeTicket);

  const handleDispatch = (staffId: string, staffName: string) => {
    if (!activeTicket) return;
    assignStaffToTicket(activeTicket.id, staffId, staffName, 'Smart Dispatch Engine');
    alert(`Dispatched ${staffName} to ticket ${activeTicket.ticketNumber}!`);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="pb-4 border-b border-[#E7E1D7]">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
          <UserCheck2 className="w-3.5 h-3.5 text-[#35483A]" />
          <span>Algorithmic Operations Dispatch</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F] mt-1">
          Smart Dispatch Engine
        </h1>
        <p className="text-xs text-[#77766E] mt-0.5">
          Calculates real-time candidate suitability based on trade certification, facility proximity, and active queue workload.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#35483A] mx-auto opacity-80" />
          <h3 className="text-base font-serif font-bold text-[#24251F]">Zero Unassigned Incidents</h3>
          <p className="text-xs text-[#77766E] max-w-sm mx-auto">
            All active campus maintenance reports have been matched to qualified technicians.
          </p>
          <div className="pt-2">
            <Link
              href="/staff/tickets"
              className="btn-secondary text-xs"
            >
              <span>Review Operational Ledger →</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Unassigned Tickets Queue */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
              Awaiting Dispatch ({tickets.length})
            </h2>

            <div className="space-y-2">
              {tickets.map((t) => {
                const isSelected = t.id === activeTicket?.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FCFAF6] border-[#35483A] ring-1 ring-[#35483A] shadow-sm'
                        : 'bg-[#FCFAF6] border-[#E7E1D7] hover:border-[#D5CEBF]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-[#35483A]">
                        {t.ticketNumber}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${PRIORITY_COLORS[t.priority]?.bg || 'bg-stone-100'} ${PRIORITY_COLORS[t.priority]?.text || 'text-stone-800'}`}>
                        {PRIORITY_LABELS[t.priority] || t.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-[#24251F] line-clamp-1 mb-1">
                      {t.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-[#77766E] font-mono">
                      <span>{t.building.split('(')[0]}</span>
                      <span className="text-[#35483A] font-medium">
                        {CATEGORY_LABELS[t.category]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Ranked Candidate Recommendations */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xl bg-[#EDE4D7] border border-[#D5CEBF] text-xs space-y-1">
              <span className="font-mono uppercase font-bold text-[#35483A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#35483A]" /> Dispatch Telemetry for {activeTicket?.ticketNumber}
              </span>
              <p className="text-[#24251F] font-mono text-[11px]">
                Target SLA: <strong>{activeTicket?.slaTargetHours}h</strong> • Facility: <strong>{activeTicket?.building}</strong> • Sector: <strong>{CATEGORY_LABELS[activeTicket?.category || 'plumbing']}</strong>
              </p>
            </div>

            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
              Ranked Specialist Candidates
            </h2>

            <div className="space-y-3">
              {candidates.map((cand, index) => {
                const isTopPick = index === 0;

                return (
                  <div
                    key={cand.staff.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isTopPick
                        ? 'bg-[#FCFAF6] border-[#35483A] shadow-sm'
                        : 'bg-[#FCFAF6] border-[#E7E1D7]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E1D7]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#24251F]">
                            {cand.staff.name}
                          </h3>
                          {isTopPick && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#35483A] text-[#F8F4ED]">
                              RECOMMENDED #1
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#77766E] mt-0.5">
                          {cand.staff.department} • {cand.staff.assignedBuilding || 'Floating'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-lg font-serif font-bold text-[#35483A] tabular-nums">
                            {cand.score}%
                          </span>
                          <span className="text-[10px] text-[#77766E] block font-mono">MATCH SCORE</span>
                        </div>

                        <button
                          onClick={() => handleDispatch(cand.staff.id, cand.staff.name)}
                          className="btn-primary text-xs"
                        >
                          Dispatch
                        </button>
                      </div>
                    </div>

                    {/* Rationale Bullet Points */}
                    <div className="pt-3">
                      <span className="text-[10px] font-mono uppercase text-[#77766E] font-semibold block mb-1">
                        Algorithmic Rationale:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.reasons.map((r, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-[#F8F4ED] border border-[#E7E1D7] text-[#24251F]"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
