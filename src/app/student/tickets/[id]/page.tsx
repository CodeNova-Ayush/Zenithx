'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTicketById, confirmTicketResolution, reopenTicket } from '@/lib/data/store';
import { Ticket } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  User, 
  Calendar, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  FileCheck2,
  X
} from 'lucide-react';

export default function StudentTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  // Resolution confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Everything is working properly now. Thank you!');

  // Reopen modal state
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const loadData = () => {
    const t = getTicketById(resolvedParams.id);
    if (t) setTicket(t);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, [resolvedParams.id]);

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-base font-bold text-[#24251F]">Ticket not found</h2>
        <Link href="/student" className="mt-3 inline-block text-xs font-mono font-semibold text-[#35483A] hover:underline">
          ← Return to Student Portal
        </Link>
      </div>
    );
  }

  const handleConfirmFixed = () => {
    confirmTicketResolution(ticket.id, rating, feedback);
    setShowConfirmModal(false);
    try {
      confetti({ particleCount: 80, spread: 60 });
    } catch {}
    loadData();
  };

  const handleReopen = () => {
    if (!reopenReason.trim()) {
      alert('Please provide a reason why this issue is not fixed.');
      return;
    }
    reopenTicket(ticket.id, reopenReason);
    setShowReopenModal(false);
    loadData();
  };

  const complaintPhoto = ticket.attachments.find(a => a.type === 'complaint_photo');
  const resolutionPhoto = ticket.attachments.find(a => a.type === 'resolution_evidence');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. TOP BREADCRUMB & CONTEXTUAL STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <Link
          href="/student/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#77766E] hover:text-[#24251F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Ticket Ledger</span>
        </Link>

        <div className="flex items-center gap-2">
          {ticket.isOverdue && ticket.status !== 'closed' && ticket.status !== 'resolved' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300">
              <AlertTriangle className="w-3 h-3" /> SLA Breach Risk
            </span>
          )}
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
            ticket.status === 'resolved' || ticket.status === 'closed'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : ticket.status === 'in_progress'
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-stone-100 text-stone-800 border-stone-300'
          }`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 2. TWO-COLUMN EDITORIAL DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MAIN COLUMN (8 cols): Description, Evidence, Proof-of-Fix, Events Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Block */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-[#35483A]">{ticket.ticketNumber}</span>
              <span className="text-[#77766E]">•</span>
              <span className="text-[#77766E]">{new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>

            <h1 className="text-2xl font-serif font-bold text-[#24251F]">
              {ticket.title}
            </h1>

            <p className="text-sm text-[#77766E] leading-relaxed whitespace-pre-wrap">
              {ticket.originalDescription}
            </p>

            {/* AI Operational Summary */}
            {ticket.aiSummary && (
              <div className="p-3.5 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-[#35483A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#35483A]" /> Gemini Operational Digest
                </span>
                <p className="text-[#24251F]">{ticket.aiSummary}</p>
              </div>
            )}
          </div>

          {/* Proof-of-Fix Verification Callout */}
          {ticket.status === 'resolved' && (
            <div className="p-6 rounded-xl bg-[#EDE4D7] border border-[#D5CEBF] text-[#24251F] space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#35483A]" />
                  <div>
                    <h3 className="text-sm font-bold">Proof-of-Fix Verification Required</h3>
                    <p className="text-xs text-[#77766E]">
                      Technician {ticket.assignedStaffName || 'Maintenance'} has completed work. Review evidence below to sign off.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#35483A] text-[#F8F4ED] uppercase">
                  Pending Sign-off
                </span>
              </div>

              {ticket.resolutionAssessment && (
                <div className="p-3.5 rounded-lg bg-[#FCFAF6] border border-[#E7E1D7] text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#35483A]">Gemini Vision Assessment</span>
                    <span className="text-[#77766E]">{ticket.resolutionAssessment.confidenceScore}% Confidence</span>
                  </div>
                  <p className="text-[#24251F] font-medium">{ticket.resolutionAssessment.summary}</p>
                  {ticket.resolutionAssessment.visibleChanges.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[#77766E] block font-mono text-[10px] uppercase">Detected Repairs:</span>
                      <ul className="list-disc list-inside text-[#24251F] text-xs space-y-0.5 mt-0.5">
                        {ticket.resolutionAssessment.visibleChanges.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn-primary"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Confirm Issue is Fixed</span>
                </button>
                <button
                  onClick={() => setShowReopenModal(true)}
                  className="px-3.5 py-2 rounded-md border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors"
                >
                  <span>Defect Persists: Reopen</span>
                </button>
              </div>
            </div>
          )}

          {/* Photographic Evidence: Pre-repair vs Post-repair */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
              Photographic Verification Audit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[#77766E]">01. Initial Defect Photo</span>
                {complaintPhoto ? (
                  <div className="rounded-lg overflow-hidden border border-[#E7E1D7] aspect-video bg-[#F8F4ED]">
                    <img src={complaintPhoto.url} alt="Initial intake photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-[#F8F4ED] border border-dashed border-[#D5CEBF] flex items-center justify-center text-xs text-[#77766E]">
                    No intake photo attached
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-[#77766E]">02. Proof-of-Fix Resolution</span>
                {resolutionPhoto ? (
                  <div className="rounded-lg overflow-hidden border border-[#D5CEBF] aspect-video bg-[#F8F4ED]">
                    <img src={resolutionPhoto.url} alt="Resolution evidence" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-[#F8F4ED] border border-dashed border-[#D5CEBF] flex items-center justify-center text-xs text-[#77766E]">
                    {ticket.status === 'closed' ? 'Verified & Closed' : 'Awaiting technician upload'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Event Ledger Timeline */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#35483A]" />
              <span>Immutable Operational Audit Trail</span>
            </h3>

            <div className="relative pl-5 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E7E1D7]">
              {ticket.events.map((ev) => (
                <div key={ev.id} className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#35483A] ring-2 ring-[#FCFAF6]" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#24251F]">
                      {ev.actorName} <span className="font-mono font-normal text-[#77766E]">({ev.actorRole})</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#77766E]">
                      {new Date(ev.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#77766E] mt-0.5">
                    {ev.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECONDARY SIDEBAR COLUMN (4 cols): Status, Assignment, Location, Contextual Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-5 space-y-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#35483A] pb-3 border-b border-[#E7E1D7]">
              Incident Parameters
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Category</span>
                <span className="font-bold text-[#24251F]">{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Assessed Priority</span>
                <span className="font-bold text-[#35483A]">{PRIORITY_LABELS[ticket.priority] || ticket.priority}</span>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Facility & Location</span>
                <span className="font-bold text-[#24251F]">{ticket.building}, Fl. {ticket.floor || 'G'}</span>
                <div className="text-[11px] text-[#77766E]">{ticket.room}</div>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Responsible Department</span>
                <span className="font-bold text-[#24251F]">{ticket.department}</span>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Assigned Staff</span>
                <span className="font-bold text-[#35483A]">{ticket.assignedStaffName || 'In Dispatch Queue'}</span>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">SLA Deadline</span>
                <span className="text-[#24251F]">{new Date(ticket.slaDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-5 text-xs text-[#77766E] space-y-2">
            <span className="font-mono font-bold uppercase tracking-wider text-[#24251F] block">Reporter Protection</span>
            <p>
              Your student identity is protected under campus operations privacy guidelines. Updates are logged to an immutable audit record.
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24251F]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FCFAF6] rounded-xl p-6 border border-[#E7E1D7] shadow-xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#24251F]">
              Confirm Resolution Sign-Off
            </h3>
            <p className="text-xs text-[#77766E]">
              Confirming will mark this incident as verified and closed. Rate the quality of the contractor&apos;s repair.
            </p>

            <div className="flex items-center gap-2 py-2">
              <span className="text-xs font-mono text-[#77766E]">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'text-amber-500 fill-amber-500' : 'text-[#D5CEBF]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Feedback on the fix..."
              className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFixed}
                className="btn-primary"
              >
                Sign Off & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REOPEN MODAL */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24251F]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FCFAF6] rounded-xl p-6 border border-[#E7E1D7] shadow-xl space-y-4">
            <h3 className="text-base font-serif font-bold text-[#24251F]">
              Reopen Ticket #{ticket.ticketNumber}
            </h3>
            <p className="text-xs text-[#77766E]">
              State clearly why the defect remains unresolved. This will escalate priority to Urgent for supervisor review.
            </p>

            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="E.g. Sink is still leaking underneath after water turned back on..."
              className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-rose-600"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReopenModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReopen}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Escalate & Reopen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
