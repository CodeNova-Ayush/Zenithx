'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRecurrenceInsights } from '@/lib/data/store';
import { RecurrenceInsight } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { 
  Radar, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Wrench,
  Calendar
} from 'lucide-react';

export default function RecurrenceRadarPage() {
  const [insights, setInsights] = useState<RecurrenceInsight[]>([]);

  const loadData = () => {
    setInsights(getRecurrenceInsights());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, []);

  const handleMarkInspected = (id: string) => {
    setInsights(prev => prev.map(item => item.id === id ? { ...item, status: 'inspected' } : item));
    alert('Preventive maintenance inspection logged. Team will be scheduled.');
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="pb-4 border-b border-[#E7E1D7]">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
          <Radar className="w-3.5 h-3.5 text-[#35483A]" />
          <span>Systemic Failure Detection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F] mt-1">
          Recurrence Radar
        </h1>
        <p className="text-xs text-[#77766E] mt-0.5">
          Surfaces chronic structural failures across dorms, labs, and academic blocks before hardware breakdown occurs.
        </p>
      </div>

      {/* 2. RECURRENCE PATTERN CARDS */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E1D7]">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                  insight.severity === 'high'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {insight.severity} Severity Pattern
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${CATEGORY_COLORS[insight.category]?.bg || 'bg-stone-100'} ${CATEGORY_COLORS[insight.category]?.text || 'text-stone-800'}`}>
                  {CATEGORY_LABELS[insight.category] || insight.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#77766E] font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {insight.dateRange}
                </span>
                <span>•</span>
                <span className="font-bold text-[#24251F]">
                  {insight.incidentCount} Repeated Incidents
                </span>
              </div>
            </div>

            {/* Pattern Title & Location */}
            <div>
              <h3 className="text-base font-serif font-bold text-[#24251F]">
                {insight.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#77766E] mt-0.5 font-mono">
                <Building2 className="w-3.5 h-3.5 text-[#35483A]" />
                <span>Target Facility: <strong className="text-[#24251F]">{insight.building}</strong></span>
              </div>
            </div>

            {/* AI Observation Card */}
            <div className="p-3.5 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-1">
              <span className="font-mono uppercase font-bold text-[#35483A] text-[10px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#35483A]" /> Root Cause Hypothesis (Gemini Flash)
              </span>
              <p className="text-[#24251F] leading-relaxed">
                {insight.aiObservation}
              </p>
            </div>

            {/* Recommended Preventive Action */}
            <div className="p-3.5 rounded-lg bg-[#EDE4D7] border border-[#D5CEBF] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#35483A] block mb-0.5">
                  Recommended Engineering Remediation:
                </span>
                <p className="font-semibold text-[#24251F]">
                  {insight.suggestedAction}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {insight.status === 'inspected' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Inspection Scheduled
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkInspected(insight.id)}
                    className="btn-primary text-xs"
                  >
                    <Wrench className="w-3.5 h-3.5 mr-1" />
                    <span>Schedule Preventive Audit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Supporting Tickets Linkage */}
            <div className="pt-1 text-xs text-[#77766E] flex flex-wrap items-center gap-1.5 font-mono">
              <span className="text-[11px]">Corroborated Reports:</span>
              {insight.supportingTicketIds.map((tid, idx) => (
                <span
                  key={idx}
                  className="font-medium px-2 py-0.5 rounded bg-[#F8F4ED] border border-[#E7E1D7] text-[#24251F] text-[11px]"
                >
                  {tid}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
