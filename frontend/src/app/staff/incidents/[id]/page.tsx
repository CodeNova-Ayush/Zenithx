'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Network, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  GitMerge, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Edit3, 
  Save, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { getIncidentById, confirmIncident, dismissIncident, resolveIncident } from '@/lib/services/outage-detective';
import { getTickets } from '@/lib/data/store';
import { ProbableIncident, Ticket } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [incident, setIncident] = useState<ProbableIncident | null>(null);
  const [memberTickets, setMemberTickets] = useState<Ticket[]>([]);
  const [isEditingWorkOrder, setIsEditingWorkOrder] = useState(false);
  const [workOrderDraft, setWorkOrderDraft] = useState('');

  const refresh = () => {
    if (!id) return;
    const found = getIncidentById(id);
    if (found) {
      setIncident(found);
      setWorkOrderDraft(found.technicianWorkOrderDraft || '');
      const allTickets = getTickets();
      const members = allTickets.filter(t => found.memberTicketIds.includes(t.id));
      setMemberTickets(members);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  if (!incident) {
    return (
      <div className="min-h-screen paper-canvas flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-xl font-bold text-ink">Incident Record Not Found</h2>
        <p className="text-xs text-muted-ink mt-2">The requested incident ID does not exist in the active graph store.</p>
        <Link href="/staff/incidents" className="mt-4 px-4 py-2 rounded-lg bg-forest text-ivory text-xs font-mono">
          Return to Incidents Queue
        </Link>
      </div>
    );
  }

  const handleConfirm = () => {
    confirmIncident(incident.id, user?.name || 'Operations Lead', workOrderDraft);
    refresh();
    alert('Incident confirmed and work order published!');
  };

  const handleResolve = () => {
    resolveIncident(incident.id);
    refresh();
    alert('Incident marked as resolved. You may now verify member tickets.');
  };

  return (
    <div className="min-h-screen paper-canvas py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link
            href="/staff/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-ink hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Outage Detective Queue</span>
          </Link>

          <div className="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-bold text-forest px-2.5 py-1 rounded bg-pale-sage border border-border-subtle">
                  {incident.incidentNumber}
                </span>
                <span className="text-xs font-mono uppercase text-muted-ink px-2 py-0.5 rounded bg-ivory border border-border-subtle">
                  {incident.category}
                </span>
                <span className={`text-xs font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                  incident.status === 'proposed'
                    ? 'bg-amber/10 text-amber border-amber/30'
                    : incident.status === 'confirmed'
                    ? 'bg-forest/10 text-forest border-forest/30'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Status: {incident.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
                {incident.title}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {incident.status === 'proposed' && (
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2.5 rounded-lg bg-forest hover:bg-forest/90 text-ivory text-xs font-mono font-bold transition-all shadow-xs"
                >
                  Confirm & Merge Work Order
                </button>
              )}
              {incident.status === 'confirmed' && (
                <button
                  onClick={handleResolve}
                  className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold transition-all shadow-xs"
                >
                  Mark Incident Resolved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 1. Refined SVG Topology Path Diagram */}
        <div className="p-6 rounded-2xl border border-border-subtle bg-paper shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-forest" />
              <h2 className="font-serif text-base font-bold text-ink">Campus Infrastructure Topology Tree</h2>
            </div>
            <span className="text-[11px] font-mono text-muted-ink">Lowest Common Ancestor: {incident.sharedNodeType}</span>
          </div>

          <div className="w-full overflow-x-auto p-4 rounded-xl bg-ivory/70 border border-border-subtle">
            <svg viewBox="0 0 800 220" className="w-full min-w-[700px] h-auto font-mono text-xs">
              {/* Connection Lines */}
              <path d="M 120 110 L 280 110" stroke="#CCD6BE" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 380 110 L 520 60" stroke="#C87D28" strokeWidth="2.5" />
              <path d="M 380 110 L 520 160" stroke="#C87D28" strokeWidth="2.5" />
              <path d="M 620 60 L 700 40" stroke="#35483A" strokeWidth="1.5" />
              <path d="M 620 60 L 700 80" stroke="#35483A" strokeWidth="1.5" />
              <path d="M 620 160 L 700 140" stroke="#35483A" strokeWidth="1.5" />
              <path d="M 620 160 L 700 180" stroke="#35483A" strokeWidth="1.5" />

              {/* Node 1: Backbone Core */}
              <g transform="translate(40, 80)">
                <rect width="140" height="60" rx="8" fill="#FCFAF6" stroke="#CCD6BE" strokeWidth="1.5" />
                <text x="70" y="25" textAnchor="middle" fill="#77766E" fontSize="9" fontWeight="bold">CAMPUS CORE</text>
                <text x="70" y="42" textAnchor="middle" fill="#24251F" fontSize="10" fontWeight="bold">N9K-CORE-01</text>
              </g>

              {/* Node 2: Shared Upstream Switch (Highlighted Fault Domain) */}
              <g transform="translate(260, 75)">
                <rect width="180" height="70" rx="10" fill="#FCFAF6" stroke="#C87D28" strokeWidth="2.5" />
                <rect x="0" y="0" width="180" height="18" rx="8" fill="#C87D28" />
                <text x="90" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">SHARED OUTAGE NODE</text>
                <text x="90" y="38" textAnchor="middle" fill="#24251F" fontSize="11" fontWeight="bold">SW-ENG-DIST-01</text>
                <text x="90" y="55" textAnchor="middle" fill="#77766E" fontSize="9">Building Distribution</text>
              </g>

              {/* Node 3: Floor Switches */}
              <g transform="translate(500, 30)">
                <rect width="130" height="50" rx="8" fill="#FCFAF6" stroke="#D5CEBF" strokeWidth="1.5" />
                <text x="65" y="22" textAnchor="middle" fill="#77766E" fontSize="9">EDGE SWITCH</text>
                <text x="65" y="38" textAnchor="middle" fill="#24251F" fontSize="10" fontWeight="bold">Floor 1 Access</text>
              </g>

              <g transform="translate(500, 130)">
                <rect width="130" height="50" rx="8" fill="#FCFAF6" stroke="#D5CEBF" strokeWidth="1.5" />
                <text x="65" y="22" textAnchor="middle" fill="#77766E" fontSize="9">EDGE SWITCH</text>
                <text x="65" y="38" textAnchor="middle" fill="#24251F" fontSize="10" fontWeight="bold">Floor 2 Access</text>
              </g>

              {/* Leaves: Reported Endpoints */}
              <g transform="translate(680, 25)">
                <rect width="90" height="26" rx="4" fill="#E7EBDD" stroke="#35483A" strokeWidth="1" />
                <text x="45" y="17" textAnchor="middle" fill="#35483A" fontSize="9" fontWeight="bold">Lab 102</text>
              </g>
              <g transform="translate(680, 65)">
                <rect width="90" height="26" rx="4" fill="#E7EBDD" stroke="#35483A" strokeWidth="1" />
                <text x="45" y="17" textAnchor="middle" fill="#35483A" fontSize="9" fontWeight="bold">Lab 104</text>
              </g>
              <g transform="translate(680, 125)">
                <rect width="90" height="26" rx="4" fill="#E7EBDD" stroke="#35483A" strokeWidth="1" />
                <text x="45" y="17" textAnchor="middle" fill="#35483A" fontSize="9" fontWeight="bold">Room 201</text>
              </g>
              <g transform="translate(680, 165)">
                <rect width="90" height="26" rx="4" fill="#E7EBDD" stroke="#35483A" strokeWidth="1" />
                <text x="45" y="17" textAnchor="middle" fill="#35483A" fontSize="9" fontWeight="bold">Lab 208</text>
              </g>
            </svg>
          </div>
          <p className="text-[11px] font-mono text-muted-ink text-center">
            Diagram represents physical cable and optical uplink relationships. The highlighted node represents the convergence point of all member reports.
          </p>
        </div>

        {/* 2. Work Order Draft & AI Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: AI Observation & Root Cause */}
          <div className="p-6 rounded-2xl border border-border-subtle bg-paper space-y-4">
            <div className="flex items-center gap-2 text-forest font-mono text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Probable Root Cause Rationale</span>
            </div>
            <p className="text-xs text-ink/90 leading-relaxed bg-ivory/50 p-4 rounded-xl border border-border-subtle">
              {incident.aiExplanation}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase text-muted-ink font-bold">Confidence Breakdown</span>
              <div className="space-y-1.5">
                {incident.confidence.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-ink/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {incident.studentNotice && (
              <div className="pt-3 border-t border-border-subtle">
                <span className="text-[11px] font-mono text-muted-ink uppercase">Automated Student Notice</span>
                <p className="text-xs text-muted-ink italic mt-1 bg-paper/80 p-3 rounded-lg border border-border-subtle">
                  &ldquo;{incident.studentNotice}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Right: Technician Work Order (Editable) */}
          <div className="p-6 rounded-2xl border border-border-subtle bg-paper space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-forest font-mono text-xs font-bold uppercase">
                <Edit3 className="w-4 h-4" />
                <span>Technician Work Order Draft</span>
              </div>
              <button
                onClick={() => setIsEditingWorkOrder(!isEditingWorkOrder)}
                className="text-xs font-mono text-forest hover:underline"
              >
                {isEditingWorkOrder ? 'Cancel' : 'Edit Order'}
              </button>
            </div>

            {isEditingWorkOrder ? (
              <div className="space-y-3">
                <textarea
                  value={workOrderDraft}
                  onChange={(e) => setWorkOrderDraft(e.target.value)}
                  rows={8}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-border-strong bg-ivory focus:ring-1 focus:ring-forest text-ink"
                />
                <button
                  onClick={() => {
                    setIsEditingWorkOrder(false);
                    incident.technicianWorkOrderDraft = workOrderDraft;
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-forest text-ivory text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-ivory/60 border border-border-subtle text-xs font-mono text-ink whitespace-pre-line leading-relaxed">
                {workOrderDraft}
              </div>
            )}

            <div className="text-[11px] font-mono text-muted-ink flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Work orders require safety verification before field execution.</span>
            </div>
          </div>
        </div>

        {/* 3. Member Tickets Table */}
        <div className="p-6 rounded-2xl border border-border-subtle bg-paper space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-forest" />
              <h2 className="font-serif text-base font-bold text-ink">
                Member Complaints ({incident.memberTicketIds.length} Reports)
              </h2>
            </div>
            <span className="text-xs text-muted-ink font-mono">Original student reports remain preserved</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-muted-ink uppercase">
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Reported By</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Summary</th>
                  <th className="py-2.5 px-3">Reported</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {memberTickets.length > 0 ? (
                  memberTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-ivory/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-forest">
                        {ticket.ticketNumber}
                      </td>
                      <td className="py-3 px-3 text-ink">
                        {ticket.studentName}
                      </td>
                      <td className="py-3 px-3 text-muted-ink">
                        {ticket.building} {ticket.room ? `• ${ticket.room}` : ''}
                      </td>
                      <td className="py-3 px-3 text-ink max-w-xs truncate">
                        {ticket.title}
                      </td>
                      <td className="py-3 px-3 text-muted-ink">
                        {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/staff/tickets/${ticket.id}`}
                          className="text-forest hover:underline font-bold"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  incident.memberTicketIds.map(tid => (
                    <tr key={tid} className="hover:bg-ivory/50">
                      <td className="py-3 px-3 font-bold text-forest">{tid}</td>
                      <td className="py-3 px-3 text-ink">Preserved Student Complaint</td>
                      <td className="py-3 px-3 text-muted-ink">{incident.building}</td>
                      <td className="py-3 px-3 text-ink">Linked incident member</td>
                      <td className="py-3 px-3 text-muted-ink">Recent</td>
                      <td className="py-3 px-3 text-right">
                        <Link href={`/staff/tickets/${tid}`} className="text-forest hover:underline font-bold">
                          Inspect →
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
    </div>
  );
}
