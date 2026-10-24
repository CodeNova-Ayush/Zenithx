'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  GitMerge, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Network, 
  Clock, 
  Building2,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { getIncidents, confirmIncident, dismissIncident } from '@/lib/services/outage-detective';
import { ProbableIncident, IncidentStatus } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function IncidentsQueuePage() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<ProbableIncident[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | IncidentStatus>('all');
  const [dismissModalId, setDismissModalId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState('');

  const refresh = () => {
    setIncidents(getIncidents());
  };

  useEffect(() => {
    refresh();
  }, []);

  const filteredIncidents = incidents.filter(inc => {
    if (activeTab === 'all') return true;
    return inc.status === activeTab;
  });

  const handleConfirm = (id: string) => {
    const staffName = user?.name || 'Staff Operations Engineer';
    confirmIncident(id, staffName);
    refresh();
    alert(`Incident confirmed! Unified work order created and member tickets linked.`);
  };

  const handleDismissSubmit = () => {
    if (!dismissModalId) return;
    dismissIncident(dismissModalId, dismissReason || 'Deemed independent user issues by staff review.');
    setDismissModalId(null);
    setDismissReason('');
    refresh();
  };

  const proposedCount = incidents.filter(i => i.status === 'proposed').length;
  const confirmedCount = incidents.filter(i => i.status === 'confirmed').length;

  return (
    <div className="min-h-screen paper-canvas py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Editorial Page Header */}
        <div className="border-b border-border-subtle pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-paper text-xs font-mono text-muted-ink mb-2">
              <Network className="w-3.5 h-3.5 text-forest" />
              <span>OUTAGE DETECTIVE • ROOT-CAUSE INFERENCE</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-ink tracking-tight">
              Campus Infrastructure Incidents
            </h1>
            <p className="text-sm text-muted-ink mt-1">
              Deterministic topology traversal identifying shared upstream infrastructure failures behind clustered student complaints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/staff"
              className="px-4 py-2 rounded-lg border border-border-strong bg-paper text-xs font-mono font-bold text-ink hover:bg-ivory transition-colors"
            >
              ← Back to Dispatch
            </Link>
          </div>
        </div>

        {/* Factual Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-border-subtle bg-paper/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-muted-ink">
              <span>PROPOSED FOR MERGE</span>
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            </div>
            <div className="text-2xl font-serif font-bold text-ink">{proposedCount}</div>
            <p className="text-[11px] text-muted-ink">Complaints clustered above threshold awaiting staff verification</p>
          </div>

          <div className="p-5 rounded-xl border border-border-subtle bg-paper/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-muted-ink">
              <span>CONFIRMED WORK ORDERS</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
            </div>
            <div className="text-2xl font-serif font-bold text-ink">{confirmedCount}</div>
            <p className="text-[11px] text-muted-ink">Active shared incidents under engineering dispatch</p>
          </div>

          <div className="p-5 rounded-xl border border-border-subtle bg-paper/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-muted-ink">
              <span>TOPOLOGY GRAPH NODES</span>
              <Network className="w-3.5 h-3.5 text-forest" />
            </div>
            <div className="text-2xl font-serif font-bold text-ink">18 Monitored</div>
            <p className="text-[11px] text-muted-ink">Water risers, electrical distribution boards, and optical switches</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
          {(['all', 'proposed', 'confirmed', 'resolved', 'dismissed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-forest text-ivory font-bold shadow-xs'
                  : 'text-muted-ink hover:text-ink hover:bg-paper'
              }`}
            >
              {tab} {tab === 'proposed' && proposedCount > 0 && `(${proposedCount})`}
            </button>
          ))}
        </div>

        {/* Incident Cards Queue */}
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border-strong bg-paper/50">
              <CheckCircle2 className="w-8 h-8 text-forest mx-auto mb-2" />
              <h3 className="font-serif text-base font-bold text-ink">No incidents in this status</h3>
              <p className="text-xs text-muted-ink mt-1">Campus infrastructure graph is operating within nominal thresholds.</p>
            </div>
          ) : (
            filteredIncidents.map(incident => (
              <div
                key={incident.id}
                className="p-6 rounded-2xl border border-border-subtle bg-paper hover:border-border-strong transition-all shadow-xs space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-forest px-2.5 py-1 rounded-md bg-pale-sage border border-border-subtle">
                      {incident.incidentNumber}
                    </span>
                    <span className="text-xs font-mono uppercase text-muted-ink px-2 py-0.5 rounded bg-ivory border border-border-subtle">
                      {incident.category}
                    </span>
                    <span className="text-xs font-mono text-muted-ink flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {incident.building}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${
                      incident.status === 'proposed'
                        ? 'bg-amber/10 text-amber border-amber/30'
                        : incident.status === 'confirmed'
                        ? 'bg-forest/10 text-forest border-forest/30'
                        : incident.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-muted-ink/10 text-muted-ink border-border-subtle'
                    }`}>
                      Status: {incident.status}
                    </span>
                  </div>
                </div>

                {/* Title & Shared Node Callout */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
                    {incident.title}
                  </h3>

                  <div className="mt-3 p-3.5 rounded-xl border border-border-subtle bg-ivory/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-forest text-ivory flex items-center justify-center">
                        <Network className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-ink">Identified Shared Upstream Node</div>
                        <div className="text-xs font-bold text-ink">{incident.sharedNodeName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted-ink">Confidence:</span>
                      <span className="font-bold text-forest bg-pale-sage px-2 py-0.5 rounded border border-border-subtle">
                        {incident.confidence.confidenceScore}% (High)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                {incident.aiExplanation && (
                  <div className="text-xs text-ink/80 leading-relaxed bg-paper/60 p-4 rounded-xl border border-border-subtle space-y-1">
                    <div className="flex items-center gap-1.5 text-forest font-mono font-bold text-[11px] uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Deterministic Root-Cause Inference</span>
                    </div>
                    <p>{incident.aiExplanation}</p>
                  </div>
                )}

                {/* Confidence Factors Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-muted-ink">
                  {incident.confidence.factors.map((factor, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-ivory border border-border-subtle">
                      • {factor}
                    </span>
                  ))}
                </div>

                {/* Footer Controls & Member Link */}
                <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-muted-ink font-mono flex items-center gap-2">
                    <GitMerge className="w-3.5 h-3.5 text-forest" />
                    <span>{incident.memberTicketIds.length} Linked Student Complaints</span>
                    <span className="text-border-strong">•</span>
                    <span>Created {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/staff/incidents/${incident.id}`}
                      className="px-3.5 py-2 rounded-lg border border-border-strong bg-paper hover:bg-ivory text-xs font-mono font-bold text-ink transition-colors flex items-center gap-1"
                    >
                      <span>View Topology Tree</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {incident.status === 'proposed' && (
                      <>
                        <button
                          onClick={() => setDismissModalId(incident.id)}
                          className="px-3 py-2 rounded-lg border border-border-subtle hover:bg-rose-50 text-rose-700 text-xs font-mono transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleConfirm(incident.id)}
                          className="px-4 py-2 rounded-lg bg-forest hover:bg-forest/90 text-ivory text-xs font-mono font-bold transition-all shadow-xs"
                        >
                          Confirm & Issue Work Order
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dismiss Reason Modal */}
      {dismissModalId && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-paper border border-border-strong rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink">Dismiss Incident Candidate</h3>
            <p className="text-xs text-muted-ink">
              Provide a rationale for dismissing this cluster. Reports will remain active as individual tickets.
            </p>
            <textarea
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="e.g. Inspected access point; reports were user configuration issues rather than distribution switch failure."
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-border-subtle bg-ivory focus:ring-1 focus:ring-forest text-ink"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDismissModalId(null)}
                className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-mono text-muted-ink hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleDismissSubmit}
                className="px-4 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-mono font-bold hover:bg-rose-800"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
