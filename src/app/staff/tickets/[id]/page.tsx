'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getTicketById, 
  updateTicketStatus, 
  assignStaffToTicket, 
  addTicketResolutionEvidence, 
  addTicketNote 
} from '@/lib/data/store';
import { Ticket, TicketStatus } from '@/lib/types';
import { DEMO_STAFF, CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  Send, 
  Clock, 
  Building2, 
  User, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function StaffTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  // Assignment state
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Status transition state
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('in_progress');

  // Notes state
  const [noteText, setNoteText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(true);

  // Proof-of-Fix Resolution Evidence Upload & AI Verification
  const [resolutionPhotoBase64, setResolutionPhotoBase64] = useState<string | null>(null);
  const [technicianNotes, setTechnicianNotes] = useState('Replaced damaged gasket with new valve fitting. Flushed line and confirmed zero drips under pressure.');
  const [isEvaluatingEvidence, setIsEvaluatingEvidence] = useState(false);

  const loadData = () => {
    const t = getTicketById(resolvedParams.id);
    if (t) {
      setTicket(t);
      setSelectedStaffId(t.assignedStaffId || '');
      setSelectedStatus(t.status);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, [resolvedParams.id]);

  if (!ticket) {
    return (
      <div className="p-12 text-center text-[#77766E] font-mono">
        Ticket not found in local operations database.
      </div>
    );
  }

  const handleAssign = () => {
    const staff = DEMO_STAFF.find(s => s.id === selectedStaffId);
    if (!staff) return;
    assignStaffToTicket(ticket.id, staff.id, staff.name);
    loadData();
    alert(`Ticket dispatched to technician ${staff.name}!`);
  };

  const handleStatusChange = () => {
    updateTicketStatus(ticket.id, selectedStatus, 'Lead Operations Dispatch');
    loadData();
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addTicketNote(ticket.id, noteText, 'Staff Operations', isInternalNote);
    setNoteText('');
    loadData();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setResolutionPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProofOfFix = async () => {
    if (!resolutionPhotoBase64) {
      alert('Please select or upload a repair proof photograph first.');
      return;
    }

    setIsEvaluatingEvidence(true);

    try {
      const res = await fetch('/api/ai/review-resolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket,
          resolutionPhotoBase64,
          technicianNotes,
        })
      });

      const data = await res.json();
      const assessment = data.assessment;

      addTicketResolutionEvidence(ticket.id, {
        imageUrl: resolutionPhotoBase64,
        uploaderId: 'staff-lead-id',
        uploaderName: ticket.assignedStaffName || 'Assigned Technician',
        assessment,
      });

      setResolutionPhotoBase64(null);
      loadData();
      alert('Proof-of-Fix uploaded and evaluated! Ticket moved to RESOLVED awaiting student sign-off.');
    } catch (e) {
      console.error('Resolution evaluation error', e);
    } finally {
      setIsEvaluatingEvidence(false);
    }
  };

  const complaintPhoto = ticket.attachments.find(a => a.type === 'complaint_photo');
  const resolutionPhoto = ticket.attachments.find(a => a.type === 'resolution_evidence');

  return (
    <div className="space-y-6">
      {/* 1. TOP BREADCRUMB & STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <Link
          href="/staff/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#77766E] hover:text-[#24251F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Operations Queue</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#77766E]">Lifecycle:</span>
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
            ticket.status === 'resolved' || ticket.status === 'closed'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : ticket.status === 'in_progress'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-stone-100 text-stone-800 border-stone-200'
          }`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 2. TWO-COLUMN EDITORIAL COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* MAIN COLUMN (8 cols): Description, AI reasoning, Proof-of-Fix, Events */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Incident Details */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#35483A]">
                {ticket.ticketNumber}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[ticket.category]?.bg || 'bg-stone-100'} ${CATEGORY_COLORS[ticket.category]?.text || 'text-stone-800'}`}>
                {CATEGORY_LABELS[ticket.category] || ticket.category}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${PRIORITY_COLORS[ticket.priority]?.bg || 'bg-stone-100'} ${PRIORITY_COLORS[ticket.priority]?.text || 'text-stone-800'}`}>
                {PRIORITY_LABELS[ticket.priority] || ticket.priority}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#24251F]">
              {ticket.title}
            </h1>
            <p className="text-sm text-[#77766E] leading-relaxed whitespace-pre-wrap">
              {ticket.originalDescription}
            </p>

            {/* AI Summary */}
            {ticket.aiSummary && (
              <div className="p-3.5 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-[#35483A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#35483A]" /> Gemini Operational Digest
                </span>
                <p className="text-[#24251F]">{ticket.aiSummary}</p>
              </div>
            )}

            {/* Location & Reporter Info */}
            <div className="pt-4 border-t border-[#E7E1D7] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Location</span>
                <span className="text-[#24251F] font-bold">{ticket.building} (Fl. {ticket.floor || 'G'})</span>
                <div className="text-[#77766E]">{ticket.room}</div>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">Reporter</span>
                <span className="text-[#24251F] font-bold">{ticket.studentName}</span>
                <div className="text-[#77766E]">{ticket.studentEmail}</div>
              </div>
              <div>
                <span className="text-[#77766E] block text-[10px] uppercase">SLA Window</span>
                <span className="text-[#24251F] font-bold">{ticket.slaTargetHours} Hours</span>
                <div className="text-[#77766E]">Due: {new Date(ticket.slaDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>

          {/* Proof-of-Fix Resolution Panel */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E7E1D7]">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#35483A] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#35483A]" />
                  <span>Proof-of-Fix Resolution Protocol</span>
                </div>
                <p className="text-xs text-[#77766E] mt-0.5">
                  Technicians submit post-repair photographic proof. Gemini compares images to verify work before student confirmation.
                </p>
              </div>
            </div>

            {resolutionPhoto && ticket.resolutionAssessment ? (
              <div className="p-4 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-3">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[#35483A]">Verified Resolution Evidence</span>
                  <span className="text-[#77766E]">{ticket.resolutionAssessment.confidenceScore}% Confidence</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg overflow-hidden border border-[#E7E1D7] aspect-video bg-[#FCFAF6]">
                    <img src={resolutionPhoto.url} alt="Proof of fix" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-[#24251F]">{ticket.resolutionAssessment.summary}</p>
                    <p className="text-[#77766E]">Verdict: <strong className="text-[#24251F]">{ticket.resolutionAssessment.verdict}</strong></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-2 font-semibold">
                    1. Upload Repair Completion Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-[#D5CEBF] hover:border-[#35483A] bg-[#F8F4ED] text-xs font-medium text-[#24251F] transition-colors">
                      <Camera className="w-3.5 h-3.5 text-[#35483A]" />
                      <span>Select Repair Evidence Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {resolutionPhotoBase64 && (
                      <span className="text-xs font-mono text-[#35483A] font-semibold">✓ Photo staged for Gemini evaluation</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1 font-semibold">
                    2. Technician Work Log
                  </label>
                  <textarea
                    rows={2}
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmitProofOfFix}
                  disabled={isEvaluatingEvidence}
                  className="btn-primary"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>{isEvaluatingEvidence ? 'Evaluating Evidence with Gemini...' : 'Verify Proof-of-Fix & Move to Resolved'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Operational Ledger / Event History */}
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

        {/* SECONDARY SIDEBAR (4 cols): Technician assignment, status override, note logger */}
        <div className="lg:col-span-4 space-y-4">
          {/* Assignment */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-5 space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#35483A] pb-2 border-b border-[#E7E1D7]">
              Technician Dispatch
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#77766E] mb-1 font-semibold">
                Qualified Specialist
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs font-mono text-[#24251F] mb-3 focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              >
                <option value="">Select Technician...</option>
                {DEMO_STAFF.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department.split('&')[0]} • {s.activeWorkload} active)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAssign}
                className="btn-primary w-full text-xs justify-center"
              >
                Assign & Dispatch
              </button>
            </div>
          </div>

          {/* Status Override */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-5 space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#35483A] pb-2 border-b border-[#E7E1D7]">
              Lifecycle Transition
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
              className="w-full p-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs font-mono text-[#24251F] mb-2 focus:outline-none focus:ring-1 focus:ring-[#35483A]"
            >
              <option value="open">Open (Triage)</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="reopened">Reopened</option>
            </select>
            <button
              type="button"
              onClick={handleStatusChange}
              className="btn-secondary w-full text-xs justify-center"
            >
              Update Status
            </button>
          </div>

          {/* Add Staff Log Note */}
          <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-5 space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#35483A] pb-2 border-b border-[#E7E1D7]">
              Staff Operations Log
            </div>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Internal technical notes or contractor observations..."
              className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-[#77766E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="rounded border-[#D5CEBF] text-[#35483A]"
                />
                <span>Internal Only</span>
              </label>
              <button
                type="button"
                onClick={handleAddNote}
                className="btn-secondary text-xs"
              >
                Add Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
