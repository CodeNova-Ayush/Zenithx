'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Wrench, 
  Clock, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Ticket, RepairCopilotGuidance } from '@/lib/types';
import { generateRepairCopilotGuidance } from '@/lib/services/repair-copilot';
import { recordFeedback } from '@/lib/data/knowledge-base';

interface RepairCopilotPanelProps {
  ticket: Ticket;
}

export default function RepairCopilotPanel({ ticket }: RepairCopilotPanelProps) {
  const [guidance, setGuidance] = useState<RepairCopilotGuidance | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [feedbackSent, setFeedbackSent] = useState<'helpful' | 'unhelpful' | null>(null);
  const [isCollapsedMobile, setIsCollapsedMobile] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadGuidance() {
      setLoading(true);
      try {
        const res = await generateRepairCopilotGuidance(ticket);
        if (isMounted) setGuidance(res);
      } catch (err) {
        console.error('Failed to load copilot guidance:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadGuidance();
    return () => { isMounted = false; };
  }, [ticket]);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleFeedback = (helpful: boolean) => {
    if (guidance?.supportingTickets[0]) {
      recordFeedback(guidance.supportingTickets[0].ticketId, helpful);
    }
    setFeedbackSent(helpful ? 'helpful' : 'unhelpful');
  };

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-border-subtle bg-paper space-y-3">
        <div className="flex items-center gap-2 text-forest font-mono text-xs font-bold">
          <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
          <span>Retrieving Historical Campus Fixes...</span>
        </div>
        <p className="text-xs text-muted-ink">
          Searching campus knowledge base for similar {ticket.category} precedent and part inventories.
        </p>
      </div>
    );
  }

  if (!guidance) return null;

  return (
    <div className="rounded-2xl border border-border-strong bg-paper shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-ivory border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-forest text-ivory flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-ink">Prepare for this Job</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-pale-sage text-forest font-bold border border-border-subtle">
                COPILOT
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted-ink">
              Technician Pre-Dispatch Guidance & Precedent Retrieval
            </p>
          </div>
        </div>

        {/* Mobile Collapse Toggle */}
        <button
          onClick={() => setIsCollapsedMobile(!isCollapsedMobile)}
          className="lg:hidden p-1.5 rounded-lg text-muted-ink hover:text-ink"
        >
          {isCollapsedMobile ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      <div className={`p-4 sm:p-5 space-y-5 ${isCollapsedMobile ? 'hidden lg:block' : 'block'}`}>
        {/* Factual Precedent & Time Estimation */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-ivory/60 border border-border-subtle space-y-1">
            <span className="text-[10px] uppercase text-muted-ink">Median Time</span>
            <div className="text-base font-bold text-ink flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-forest" />
              <span>{guidance.medianTimeMinutes} mins</span>
            </div>
            <span className="text-[10px] text-muted-ink block">Range: {guidance.estimatedTimeRange}</span>
          </div>

          <div className="p-3 rounded-xl bg-ivory/60 border border-border-subtle space-y-1">
            <span className="text-[10px] uppercase text-muted-ink">Campus Precedent</span>
            <div className="text-base font-bold text-ink flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-forest" />
              <span>{guidance.similarCasesCount} Similar Cases</span>
            </div>
            <span className="text-[10px] text-muted-ink block">
              {guidance.hasSufficientPrecedent ? 'Verified fixes' : 'Limited precedent'}
            </span>
          </div>
        </div>

        {/* Common Parts Requisite */}
        {guidance.mostCommonParts.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-ink font-bold">
              Most Frequently Used Replacement Parts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {guidance.mostCommonParts.map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-ivory border border-border-subtle text-xs text-ink font-mono flex items-center gap-1.5"
                >
                  <span className="font-bold text-forest">{item.count}x</span>
                  <span>{item.part}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Tools */}
        {guidance.suggestedTools.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-ink font-bold">
              Recommended Tool Kit
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs text-muted-ink font-mono">
              {guidance.suggestedTools.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-paper border border-border-subtle">
                  🔧 {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Pre-Job Checklist */}
        <div className="space-y-2 pt-1 border-t border-border-subtle">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-ink font-bold">
            Job Preparation Checklist
          </span>
          <div className="space-y-1.5">
            {guidance.checklist.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCheck(idx)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-start gap-2.5 ${
                  checkedItems[idx] 
                    ? 'bg-pale-sage/40 border-forest/30 text-ink line-through' 
                    : 'bg-ivory/50 border-border-subtle text-ink hover:bg-ivory'
                }`}
              >
                {checkedItems[idx] ? (
                  <CheckSquare className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-muted-ink shrink-0 mt-0.5" />
                )}
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Safety Steps Alert */}
        <div className="p-3.5 rounded-xl bg-amber/10 border border-amber/30 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-mono font-bold text-[11px] uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Critical Job Safety Protocol</span>
          </div>
          <ul className="space-y-1 text-ink/90 text-[11px]">
            {guidance.safetyPrecautions.map((step, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-700">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supporting Tickets Citations */}
        {guidance.supportingTickets.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-border-subtle">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-ink font-bold">
              Cited Precedent from Resolved Tickets
            </span>
            <div className="space-y-2">
              {guidance.supportingTickets.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-ivory/50 border border-border-subtle text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-forest">{t.ticketNumber}</span>
                    <span className="text-[11px] font-mono text-muted-ink">{t.timeSpentMinutes} mins</span>
                  </div>
                  <p className="text-muted-ink text-[11px] leading-relaxed line-clamp-2">
                    &ldquo;{t.resolutionNotes}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Loop */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-muted-ink">Was this guidance helpful?</span>
          {feedbackSent ? (
            <span className="font-mono text-forest text-[11px] font-bold">✓ Feedback recorded</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className="p-1.5 rounded-lg border border-border-subtle hover:bg-pale-sage text-muted-ink hover:text-forest transition-colors"
                title="Helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className="p-1.5 rounded-lg border border-border-subtle hover:bg-rose-50 text-muted-ink hover:text-rose-700 transition-colors"
                title="Not helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
