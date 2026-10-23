import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CopyCheck, 
  BrainCircuit, 
  MapPin, 
  ShieldCheck, 
  UserCheck2, 
  Radar, 
  Lock,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      num: '01',
      title: 'Gemini-Powered Complaint Understanding',
      icon: Sparkles,
      tag: 'Multimodal Reasoning',
      desc: 'Multimodal extraction accepting natural language in English, Hindi, voice audio, or direct photographic proof. Gemini classifies issues into 4 strict technical operational categories, derives an actionable title, assigns the responsible engineering department, evaluates safety hazard priority, and crafts single-sentence targeted follow-up questions when vital location clues are missing.',
    },
    {
      num: '02',
      title: 'Real-Time Duplicate Detection Queue',
      icon: CopyCheck,
      tag: 'Spatial Deduplication',
      desc: 'Spatial and semantic clustering cross-references incoming complaints against active tickets within the same campus facility and floor. High-similarity reports are flagged in a supervisor triage queue where staff can link them to one primary operational incident, preventing duplicate technician dispatch while keeping all reporting students updated.',
    },
    {
      num: '03',
      title: 'Campus Brain Operational Intelligence',
      icon: BrainCircuit,
      tag: 'Grounded Query Engine',
      desc: 'Natural language operations console that translates administrative inquiries into controlled, deterministic queries against live database state. Campus Brain calculates real-time SLA metrics, spots bottlenecked facilities, and synthesizes operational briefings with supporting data citations.',
    },
    {
      num: '04',
      title: 'Campus Pulse Spatial Heatmap',
      icon: MapPin,
      tag: 'Geospatial Grid',
      desc: 'Interactive 2D vector map and 3D procedural Living Campus digital twin displaying real-time incident density, department filters, and building inspection drawers with immediate telemetry across all registered facilities.',
    },
    {
      num: '05',
      title: 'Proof-of-Fix Evidence Verification',
      icon: ShieldCheck,
      tag: 'Visual Verification',
      desc: 'Completely eliminates premature ticket closures. Field technicians must upload post-repair visual evidence. Gemini conducts a comparative analysis between pre-repair complaint imagery and post-repair fixtures before triggering mandatory student confirmation.',
    },
    {
      num: '06',
      title: 'Smart Dispatch Balancing',
      icon: UserCheck2,
      tag: 'Workload Optimization',
      desc: 'Transparent algorithmic recommendation engine evaluating trade qualification, department affiliation, facility stationing, and active workload to match the most suitable technician for each incident.',
    },
    {
      num: '07',
      title: 'Recurrence Radar',
      icon: Radar,
      tag: 'Systemic Prevention',
      desc: 'Historical clustering algorithms detect recurring maintenance patterns across campus zones, revealing structural hardware degradation (such as riser pressure surges or channel contention) and enabling one-click scheduling of preventive engineering audits.',
    },
    {
      num: '08',
      title: 'Immutable Trust Ledger',
      icon: Lock,
      tag: 'Cryptographic Audit Trail',
      desc: 'Every intake, triage decision, technician assignment, status transition, and student rating is preserved in an append-oriented event history, guaranteeing operational accountability and transparency.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* 1. EDITORIAL HEADER */}
      <div className="max-w-3xl space-y-4 pb-8 border-b border-[#E7E1D7]">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#35483A] uppercase px-3 py-1 rounded-full bg-[#E7EBDD] border border-[#C5D1B8]">
          <Layers className="w-4 h-4 text-[#35483A]" />
          <span>Core Operational Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#24251F] tracking-tight leading-[1.1]">
          Eight layers of campus operational intelligence.
        </h1>
        <p className="text-base sm:text-lg text-[#57564E] leading-relaxed max-w-2xl">
          Engineered from the ground up to eliminate lost tickets, reduce premature closure, and turn unstructured student complaints into verified physical resolutions.
        </p>
      </div>

      {/* 2. REFINED EDITORIAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E7E1D7] border border-[#E7E1D7] rounded-xl overflow-hidden shadow-sm">
        {featureList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-8 sm:p-10 bg-[#FCFAF6] hover:bg-[#F8F4ED] transition-colors space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#35483A] tracking-wider">
                    MODULE {f.num}
                  </span>
                  <span className="font-mono text-xs px-2.5 py-1 rounded border border-[#D5CEBF] bg-[#EDE4D7] text-[#35483A] font-medium">
                    {f.tag}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 pt-1">
                  <div className="w-9 h-9 rounded-lg bg-[#EDE4D7] flex items-center justify-center text-[#35483A] shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#24251F] leading-snug">
                    {f.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-[#57564E] leading-relaxed pt-1">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. EDITORIAL CALL TO ACTION */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#35483A] text-[#F8F4ED] flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#24251F] shadow-sm">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F4ED]">
            Experience the complete incident lifecycle.
          </h2>
          <p className="text-sm sm:text-base text-[#E7EBDD]/90 leading-relaxed">
            Submit a real report as a student, inspect automated duplicate detection, and review verified Proof-of-Fix evidence in Operations Command.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/student/report"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#F8F4ED] hover:bg-white text-[#24251F] font-bold text-sm transition-colors shadow-sm"
          >
            <span>Report Campus Issue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/staff"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#35483A] hover:bg-[#2c3d31] text-[#F8F4ED] font-semibold text-sm transition-colors border border-[#E7EBDD]/30"
          >
            <span>Staff Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
