import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Sparkles, 
  CopyCheck, 
  UserCheck2, 
  Wrench, 
  ShieldCheck, 
  Radar, 
  ArrowRight,
  Workflow
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      stage: 'Intake Protocol',
      actor: 'Student Action',
      title: 'Conversational Reporting with Zero Drop-Down Friction',
      desc: 'Students report defects by speaking or typing naturally in English, Hindi, or Hinglish, with optional photographic proof. Tedious facility codes and complicated form drop-downs are completely bypassed.',
      icon: FileText,
      meta: 'Supports Web Speech API & Camera uploads',
    },
    {
      num: '02',
      stage: 'Multimodal Synthesis',
      actor: 'Gemini AI Intelligence',
      title: 'Multimodal Defect Classification & Department Routing',
      desc: 'Gemini evaluates the report, extracts the technical category (Plumbing, Electricity, Sanitation, IT), maps the responsible engineering department, assesses hazard priority, and formulates targeted single-sentence clarification questions when vital location clues are missing.',
      icon: Sparkles,
      meta: 'Classifies into 4 strict technical domains with SLA window calculation',
    },
    {
      num: '03',
      stage: 'Triage & Deduplication',
      actor: 'Automated Operations Filter',
      title: 'Real-Time Spatial Deduplication Queue',
      desc: 'Spatial and textual matching cross-checks the new ticket against existing complaints in the same campus facility and floor. High-similarity incidents are flagged for supervisor triage to link reports into one incident and avoid duplicate contractor dispatch.',
      icon: CopyCheck,
      meta: 'Prevents multiple contractors dispatched to the same riser leak',
    },
    {
      num: '04',
      stage: 'Smart Dispatch',
      actor: 'Algorithmic Optimization',
      title: 'Workload & Proximity-Aware Technician Matching',
      desc: 'The intelligent dispatch recommendation engine evaluates certified trade skills, department affiliation, building proximity, and active ticket workloads to propose the most suitable technician with transparent, auditable rationale.',
      icon: UserCheck2,
      meta: 'Balances queue across available staff without manual bottlenecks',
    },
    {
      num: '05',
      stage: 'Field Execution',
      actor: 'Contractor Work',
      title: 'On-Site Repair & Operational State Transition',
      desc: 'Assigned technicians receive building coordinates and floor landmarks, transition the ticket to In Progress, perform physical remediation, and log replacement part details.',
      icon: Wrench,
      meta: 'Logged to tamper-resistant append-only event ledger',
    },
    {
      num: '06',
      stage: 'Proof-of-Fix',
      actor: 'Dual-Key Verification',
      title: 'Photographic AI Evidence & Mandatory Student Sign-Off',
      desc: 'Premature closures are stopped. Technicians must upload post-repair photos. Gemini performs a vision check comparing pre-repair defect photos against post-repair fixtures. Once verified, the student reviews the evidence and confirms resolution with a 5-star rating or reopens with escalated priority.',
      icon: ShieldCheck,
      meta: 'Eliminates unsupported or false ticket sign-offs',
    },
    {
      num: '07',
      stage: 'Preventive Intelligence',
      actor: 'Recurrence Radar',
      title: 'Systemic Degradation Detection & Preventive Audits',
      desc: 'Historical clustering algorithms detect chronic hardware failures across campus zones (such as repeated pipe pressure surges or overloaded power circuits), alerting leadership and enabling preventive maintenance audits before catastrophic failure.',
      icon: Radar,
      meta: 'Transitions campus operations from reactive patching to proactive prevention',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* 1. EDITORIAL HEADER */}
      <div className="max-w-2xl space-y-4 pb-8 border-b border-[#E7E1D7]">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#35483A] uppercase px-3 py-1 rounded-full bg-[#E7EBDD] border border-[#C5D1B8]">
          <Workflow className="w-4 h-4 text-[#35483A]" />
          <span>Operational Lifecycle Protocol</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#24251F] tracking-tight leading-[1.1]">
          How CampusConnect works.
        </h1>
        <p className="text-base sm:text-lg text-[#57564E] leading-relaxed">
          A 7-stage closed-loop operational pipeline ensuring every reported campus defect leads to verified physical resolution.
        </p>
      </div>

      {/* 2. ARCHITECTURAL STEP-BY-STEP LIFECYCLE */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-px before:bg-[#E7E1D7]">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="relative space-y-3 group">
              {/* Timeline marker */}
              <div className="absolute -left-[27px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full bg-[#FCFAF6] border-2 border-[#35483A] flex items-center justify-center font-mono text-xs font-bold text-[#35483A] shadow-xs">
                {s.num}
              </div>

              {/* Step Card in Warm Paper Style */}
              <div className="p-6 sm:p-8 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] hover:border-[#D5CEBF] transition-all space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E7E1D7]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#35483A] uppercase tracking-wider">
                      STAGE {s.num}: {s.stage}
                    </span>
                    <span className="text-[#77766E]">•</span>
                    <span className="text-xs font-mono font-medium text-[#77766E]">{s.actor}</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#EDE4D7] text-[#35483A] font-semibold border border-[#D5CEBF]">
                    {s.meta}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-9 h-9 rounded-lg bg-[#EDE4D7] flex items-center justify-center text-[#35483A] shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#24251F]">
                    {s.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-[#57564E] leading-relaxed pl-12">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CALL TO ACTION */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#35483A] text-[#F8F4ED] flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#24251F] shadow-sm">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F4ED]">
            Test the live incident pipeline.
          </h2>
          <p className="text-sm sm:text-base text-[#E7EBDD]/90 leading-relaxed">
            Report an issue as a student, witness Gemini multimodal reasoning, and track verification on the immutable audit trail.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/student/report"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#F8F4ED] hover:bg-white text-[#24251F] font-bold text-sm transition-colors shadow-sm"
          >
            <span>Start Student Report Flow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/staff"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#35483A] hover:bg-[#2c3d31] text-[#F8F4ED] font-semibold text-sm transition-colors border border-[#E7EBDD]/30"
          >
            <span>Open Staff Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
