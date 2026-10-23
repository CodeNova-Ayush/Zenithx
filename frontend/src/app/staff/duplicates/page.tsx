'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDuplicates, resolveDuplicateReview, getTicketById } from '@/lib/data/store';
import { DuplicateCandidate } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { 
  CopyCheck, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Clock, 
  Link2,
  Sparkles
} from 'lucide-react';

export default function DuplicateReviewPage() {
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);

  const loadData = () => {
    setDuplicates(getDuplicates());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, []);

  const handleDecision = (id: string, decision: 'confirmed_duplicate' | 'marked_separate') => {
    resolveDuplicateReview(id, decision, 'Staff Triage Lead');
    loadData();
  };

  const pendingDuplicates = duplicates.filter(d => d.status === 'pending');
  const resolvedDuplicates = duplicates.filter(d => d.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="pb-4 border-b border-[#E7E1D7]">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
          <CopyCheck className="w-3.5 h-3.5 text-[#35483A]" />
          <span>Spatial & Semantic Incident Deduplication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F] mt-1">
          Duplicate Review Queue
        </h1>
        <p className="text-xs text-[#77766E] mt-0.5">
          Intelligent clustering identifies simultaneous student reports for the same physical fixture failure. Link reports to unify technician dispatch.
        </p>
      </div>

      {/* 2. PENDING TRIAGE CANDIDATES */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
          Pending Evaluation ({pendingDuplicates.length})
        </h2>

        {pendingDuplicates.length === 0 ? (
          <div className="p-10 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] text-center text-xs text-[#77766E] font-mono">
            <CheckCircle2 className="w-7 h-7 text-[#35483A] mx-auto mb-2 opacity-80" />
            No pending duplicate candidates detected. All current reports represent independent incidents.
          </div>
        ) : (
          pendingDuplicates.map((item) => {
            const sourceTicket = getTicketById(item.sourceTicketId);
            const candidateTicket = item.candidateTicket;

            return (
              <div
                key={item.id}
                className="p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-4"
              >
                {/* Header score & signals */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E1D7]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE4D7] text-[#35483A] border border-[#D5CEBF]">
                      {item.similarityScore}% Match Confidence
                    </span>
                    <span className="text-xs text-[#77766E]">
                      High spatial & semantic correlation
                    </span>
                  </div>

                  {/* Match Signals */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.matchSignals.map((sig, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F4ED] border border-[#E7E1D7] text-[#77766E]">
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Incoming Source Ticket */}
                  <div className="p-4 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-[#35483A] font-bold">
                        Incoming: {sourceTicket?.ticketNumber || 'New Report'}
                      </span>
                      <span className="text-[#77766E]">
                        {sourceTicket ? new Date(sourceTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#24251F] text-sm">
                      {sourceTicket?.title}
                    </h4>
                    <p className="text-[#77766E]">
                      {sourceTicket?.originalDescription}
                    </p>
                    <div className="pt-2 text-[#77766E] text-[11px] font-mono">
                      Location: <strong className="text-[#24251F]">{sourceTicket?.building}</strong> (Fl. {sourceTicket?.floor || 'G'})
                    </div>
                  </div>

                  {/* Existing Active Candidate Ticket */}
                  <div className="p-4 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-[#77766E] font-bold">
                        Existing Active: {candidateTicket.ticketNumber}
                      </span>
                      <span className="text-[#77766E]">
                        {new Date(candidateTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#24251F] text-sm">
                      {candidateTicket.title}
                    </h4>
                    <p className="text-[#77766E]">
                      {candidateTicket.originalDescription}
                    </p>
                    <div className="pt-2 text-[#77766E] text-[11px] font-mono">
                      Location: <strong className="text-[#24251F]">{candidateTicket.building}</strong> (Fl. {candidateTicket.floor || 'G'})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleDecision(item.id, 'marked_separate')}
                    className="btn-secondary text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Mark as Separate Issue</span>
                  </button>
                  <button
                    onClick={() => handleDecision(item.id, 'confirmed_duplicate')}
                    className="btn-primary text-xs"
                  >
                    <Link2 className="w-3.5 h-3.5 mr-1" />
                    <span>Confirm Duplicate & Link</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. RESOLVED HISTORY */}
      {resolvedDuplicates.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
            Triage History ({resolvedDuplicates.length})
          </h2>
          <div className="divide-y divide-[#E7E1D7] bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-4">
            {resolvedDuplicates.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#24251F]">
                      Ticket {item.sourceTicketId} ↔ {item.candidateTicket.ticketNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                      item.status === 'confirmed_duplicate' ? 'bg-[#EDE4D7] text-[#35483A] border-[#D5CEBF]' : 'bg-[#F8F4ED] text-[#77766E] border-[#E7E1D7]'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[#77766E] text-[11px]">{item.reviewNotes}</p>
                </div>
                <span className="text-[10px] font-mono text-[#77766E]">
                  {item.reviewedAt ? new Date(item.reviewedAt).toLocaleDateString() : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
