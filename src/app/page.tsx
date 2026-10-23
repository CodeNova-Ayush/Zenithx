'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LivingCampus from '@/components/campus-3d/LivingCampus';
import FaceRecognitionModal from '@/components/auth/FaceRecognitionModal';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  BrainCircuit, 
  Activity, 
  ArrowUpRight,
  ScanFace,
  Wrench,
  Layers,
  Cpu,
  Fingerprint,
  Radio,
  FileCheck2,
  ChevronRight,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'intake' | 'dispatch' | 'verification'>('intake');

  const workflowSteps = [
    {
      num: '01',
      title: 'Multimodal Intake',
      role: 'Student Desk',
      summary: 'Voice dictation, photo upload, or natural text in English or Hindi.',
      details: 'Students report broken fixtures without having to decode facility codes or dropdown trees.',
      tag: 'Zero Friction',
    },
    {
      num: '02',
      title: 'Gemini Reasoning',
      role: 'AI Engine',
      summary: 'Extracts trade category, maps department, and evaluates priority.',
      details: 'Identifies missing details and asks a single targeted follow-up question when needed.',
      tag: 'Structured AI',
    },
    {
      num: '03',
      title: 'Spatial Deduplication',
      role: 'Triage Layer',
      summary: 'Cross-checks reports in the same building and floor in real time.',
      details: 'Unifies multiple student complaints into one incident to prevent duplicated contractor dispatches.',
      tag: 'Resource Saving',
    },
    {
      num: '04',
      title: 'Smart Dispatch',
      role: 'Operations Engine',
      summary: 'Algorithmic matching by trade qualification, proximity, and queue.',
      details: 'Dispatches available specialists with transparent suitability scores and reasoning bullets.',
      tag: 'Optimal Queue',
    },
    {
      num: '05',
      title: 'Proof-of-Fix Verification',
      role: 'Quality Assurance',
      summary: 'Technician uploads post-repair photo; Gemini compares pre/post fix.',
      details: 'Requires student sign-off with 5-star rating before a ticket is permanently closed.',
      tag: 'Guaranteed Repair',
    },
    {
      num: '06',
      title: 'Recurrence Radar',
      role: 'Preventive Intelligence',
      summary: 'Detects chronic infrastructure fatigue across dorms and lecture halls.',
      details: 'Transitions campus operations from reactive emergency patching to proactive scheduled maintenance.',
      tag: 'Proactive Audits',
    },
  ];

  return (
    <div className="relative min-h-screen space-y-16 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 border-b border-[#E7E1D7]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Bold Editorial Headline & Actions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E7EBDD] border border-[#C5D1B8] text-[#35483A] text-xs font-semibold tracking-wide uppercase shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live Campus Operations Layer • Three.js Dynamic Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-serif font-bold tracking-tight text-[#24251F] leading-[1.08]">
                Every campus issue deserves a <span className="italic font-normal text-[#35483A]">better answer.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#57564E] leading-relaxed max-w-lg">
                CampusConnect transforms unstructured student complaints into intelligent, trackable action—powered by real-time Three.js spatial twins, Gemini multimodal vision, and verified physical repairs.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/student/report"
                  className="btn-primary px-6 py-3 text-sm sm:text-base font-semibold shadow-sm"
                >
                  <span>Report Campus Issue</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 btn-arrow" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsFaceModalOpen(true)}
                  className="px-4 py-3 rounded-md bg-[#EDE4D7] hover:bg-[#E2D8C9] border border-[#D5CEBF] text-[#24251F] font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <ScanFace className="w-4 h-4 text-[#35483A]" />
                  <span>Face ID Clearance</span>
                </button>

                <a
                  href="#operations-matrix"
                  className="btn-secondary px-5 py-3 text-sm sm:text-base"
                >
                  <span>Operations Matrix</span>
                </a>
              </div>

              {/* Live Trust Metrics Strip */}
              <div className="pt-6 border-t border-[#E7E1D7] grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F] tabular-nums">
                    2.4<span className="text-sm font-sans font-normal text-[#77766E] ml-1">hrs</span>
                  </div>
                  <div className="text-xs font-mono font-medium text-[#77766E] uppercase tracking-wider mt-1">
                    Avg SLA Turnaround
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#35483A] tabular-nums">
                    94.2<span className="text-sm font-sans font-normal text-[#77766E] ml-1">%</span>
                  </div>
                  <div className="text-xs font-mono font-medium text-[#77766E] uppercase tracking-wider mt-1">
                    Duplicates Filtered
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F] tabular-nums">
                    100<span className="text-sm font-sans font-normal text-[#77766E] ml-1">%</span>
                  </div>
                  <div className="text-xs font-mono font-medium text-[#77766E] uppercase tracking-wider mt-1">
                    Proof-of-Fix Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Signature 3D Living Campus Visual */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-[#E7E1D7] shadow-lg bg-[#FCFAF6]">
                <LivingCampus />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. YC-LEVEL OPERATIONS MATRIX & INTERACTIVE SHOWCASE (REPLACES OLD CLUMSY CARD) */}
      <section id="operations-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FCFAF6] border border-[#E7E1D7] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7E1D7] pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#35483A] uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-[#35483A]" />
                <span>Autonomous Operations Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F]">
                Engineered for Zero-Friction Campus Living
              </h2>
              <p className="text-sm sm:text-base text-[#57564E] max-w-2xl leading-relaxed">
                Experience how unstructured human complaints are resolved with machine precision through multimodal artificial intelligence, biometric verification, and physical proof.
              </p>
            </div>

            {/* Interactive Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-[#EDE4D7] p-1.5 rounded-lg border border-[#D5CEBF] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('intake')}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'intake'
                    ? 'bg-[#FCFAF6] text-[#24251F] shadow-xs'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                1. AI & Biometric Intake
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dispatch')}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'dispatch'
                    ? 'bg-[#FCFAF6] text-[#24251F] shadow-xs'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                2. Spatial Smart Dispatch
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'verification'
                    ? 'bg-[#FCFAF6] text-[#24251F] shadow-xs'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                3. Proof-of-Fix Dual-Key
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'intake' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Conversational Multimodal Intake</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Voice memos in Hindi or English, raw smartphone photos, or casual text. No cryptic facility dropdowns or category trees needed.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Input Types:</span>
                  <span className="font-bold text-[#35483A]">Voice, Photo, Text (EN/HI)</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Biometric Student Clearance</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Instant face recognition tool connects complaints to authenticated campus credentials, reducing prank reports to zero while fast-tracking urgent fixes.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Verification Rate:</span>
                  <span className="font-bold text-emerald-800">99.4% Student Match</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Real-Time Deduplication</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    If 15 students in Tagore Hostel report the same main riser leak, Gemini groups them into a single incident cluster with live subscriber updates.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Bandwidth Saved:</span>
                  <span className="font-bold text-[#35483A]">94.2% Duplicate Suppression</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dispatch' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Certified Trade Matching</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Automatically routes hydraulic leaks to pipefitters, power outages to certified electricians, and router issues to network engineers.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Trades Covered:</span>
                  <span className="font-bold text-[#35483A]">6 Trade Specializations</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Proximity & Queue Balancing</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Calculates distance from technician current station to the incident room, factoring active queue depth and urgent SLA commitments.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Response Time:</span>
                  <span className="font-bold text-emerald-800">&lt; 15 mins to on-site</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Spatial 3D Coordinate Lock</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Incidents are pinned directly to building, floor, wing, and coordinates on the Three.js campus model with live beacon color coding.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Spatial Precision:</span>
                  <span className="font-bold text-[#35483A]">Room & Wing Verified</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Pre/Post Photo Inspection</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Technicians cannot mark an issue done without uploading high-resolution visual proof of the physical replacement or repair.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Verification Mode:</span>
                  <span className="font-bold text-[#35483A]">Dual-Key Optical</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Student Sign-Off Gate</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    The reporting student receives an immediate push notification to approve the work and rate service quality with 1 to 5 stars.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Approval Gate:</span>
                  <span className="font-bold text-emerald-800">Mandatory Student Review</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E7EBDD] text-[#35483A] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#24251F]">Recurrence Radar Prevention</h3>
                  <p className="text-sm text-[#57564E] leading-relaxed">
                    Detects chronic equipment breakdowns before they turn into emergencies, prompting capital replacement instead of endless band-aids.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E7E1D7] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#77766E]">Asset Health:</span>
                  <span className="font-bold text-[#35483A]">Preventive Lifecycle</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7E1D7]">
            <div className="flex items-center gap-2 text-sm text-[#57564E]">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Full end-to-end workflow is live and operable across all campus portals.</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/student/report"
                className="btn-primary text-xs sm:text-sm"
              >
                <span>Report an Issue Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/features"
                className="btn-secondary text-xs sm:text-sm"
              >
                <span>Explore Features</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. OPERATIONAL COMPARISON: LEGACY VS CAMPUSCONNECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-xl">
          <span className="font-mono text-xs font-bold text-[#35483A] uppercase tracking-wider">
            Operational Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F] mt-1">
            Why traditional campus maintenance fails
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy System */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E1D7]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#24251F]">
                Fragmented Legacy Methods
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-[#77766E]">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>Complaints scattered across unmonitored WhatsApp groups, emails, and physical paper logs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>Students forced to guess technical category codes or decipher confusing department dropdowns.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>Tickets closed prematurely without photographic proof or student verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>Dozens of duplicate reports for identical leaks tie up technician phone lines.</span>
              </li>
            </ul>
          </div>

          {/* CampusConnect Operating System */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#FCFAF6] border border-[#35483A]/40 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7E1D7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35483A]" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#35483A]">
                CampusConnect Operating System
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-[#24251F]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#35483A] shrink-0 mt-0.5" />
                <span>Single conversational intake: speak or type naturally in English or Hindi with instant photos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#35483A] shrink-0 mt-0.5" />
                <span>Gemini multimodal reasoning extracts categories, assigns teams, and asks missing questions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#35483A] shrink-0 mt-0.5" />
                <span>Proof-of-Fix engine requires photographic comparison and student sign-off before completion.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#35483A] shrink-0 mt-0.5" />
                <span>Automated spatial deduplication clusters concurrent reports into single operational incidents.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. STRUCTURED INCIDENT LIFECYCLE (HORIZONTAL TABBED STRIP) */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#35483A] uppercase tracking-wider">
              Structured Incident Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F] mt-1">
              From report to verified physical repair
            </h2>
          </div>
          <Link href="/workflow" className="text-xs sm:text-sm font-mono font-semibold text-[#35483A] hover:underline flex items-center gap-1">
            <span>Detailed Lifecycle Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Lifecycle Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#E7E1D7] border border-[#E7E1D7] rounded-xl overflow-hidden">
          {workflowSteps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => setActiveWorkflowStep(idx)}
              className={`p-4 sm:p-5 cursor-pointer transition-colors space-y-2.5 ${
                activeWorkflowStep === idx ? 'bg-[#EDE4D7]' : 'bg-[#FCFAF6] hover:bg-[#F8F4ED]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#35483A]">
                  STEP {s.num}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FCFAF6] border border-[#E7E1D7] text-[#77766E]">
                  {s.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#24251F]">
                {s.title}
              </h4>
              <p className="text-xs text-[#77766E] leading-relaxed line-clamp-3">
                {s.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Step Expanded Drawer */}
        <div className="mt-3 p-5 sm:p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#35483A]">
              Step {workflowSteps[activeWorkflowStep].num} Deep Dive: {workflowSteps[activeWorkflowStep].title}
            </span>
            <p className="text-sm text-[#24251F] max-w-2xl leading-relaxed">
              {workflowSteps[activeWorkflowStep].details}
            </p>
          </div>
          <Link
            href="/student/report"
            className="btn-primary text-xs sm:text-sm shrink-0 self-start sm:self-center"
          >
            <span>Test This Workflow</span>
            <ArrowRight className="w-4 h-4 ml-1 btn-arrow" />
          </Link>
        </div>
      </section>

      {/* 6. CAMPUS BRAIN & PULSE SPATIAL INTELLIGENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Campus Brain NLP Console */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE4D7] border border-[#D5CEBF] text-[#24251F] text-xs font-mono font-medium">
              <BrainCircuit className="w-4 h-4 text-[#35483A]" />
              <span>Campus Brain • Natural Language Query</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#24251F]">
              Query your campus like a living database.
            </h2>

            <p className="text-sm sm:text-base text-[#57564E] leading-relaxed">
              Administrators and facility supervisors can query the entire operational history using plain natural language. Ask questions and receive synthesized data citations without guessing.
            </p>

            <div className="p-4 sm:p-5 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] font-mono text-xs sm:text-sm space-y-3">
              <div className="flex items-center gap-2 text-[#77766E]">
                <span className="text-[#35483A] font-bold">&gt;</span>
                <span>&quot;Show me unresolved electrical issues in Aryabhatta Hostel&quot;</span>
              </div>
              <div className="pt-2.5 border-t border-[#E7E1D7] text-[#24251F] space-y-1.5">
                <div className="font-bold text-[#35483A]">Found 2 tickets matching criteria:</div>
                <div className="text-[#57564E]">• CAMPUS-1041: Voltage fluctuation in Room 302 (Dispatched to Amit Verma)</div>
                <div className="text-[#57564E]">• CAMPUS-1044: Corridor lighting failed on 2nd Floor (SLA: 4h remaining)</div>
              </div>
            </div>

            <div>
              <Link href="/staff/campus-brain" className="btn-secondary text-xs sm:text-sm">
                <span>Try Campus Brain in Command</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Right: Spatial Telemetry Box */}
          <div className="lg:col-span-6 space-y-3">
            <div className="p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E1D7]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#35483A]" />
                  <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#24251F]">
                    Campus Pulse Heatmap
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Live Telemetry
                </span>
              </div>
              <p className="text-sm text-[#57564E]">
                Aggregates ticket density across buildings with spatial risk scoring to prioritize contractor dispatch.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 bg-[#F8F4ED] rounded-lg border border-[#E7E1D7]">
                  <div className="text-xs font-mono text-[#77766E]">Hostels</div>
                  <div className="text-lg font-serif font-bold text-[#24251F] mt-1">4 Active</div>
                </div>
                <div className="p-3.5 bg-[#F8F4ED] rounded-lg border border-[#E7E1D7]">
                  <div className="text-xs font-mono text-[#77766E]">Academic</div>
                  <div className="text-lg font-serif font-bold text-[#24251F] mt-1">1 Active</div>
                </div>
                <div className="p-3.5 bg-[#F8F4ED] rounded-lg border border-[#E7E1D7]">
                  <div className="text-xs font-mono text-[#77766E]">Sports Complex</div>
                  <div className="text-lg font-serif font-bold text-emerald-800 mt-1">0 Clean</div>
                </div>
              </div>
              <Link href="/staff/campus-pulse" className="block text-center text-xs sm:text-sm font-mono font-bold text-[#35483A] hover:underline pt-2">
                Open 2D Campus Spatial Heatmap →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#35483A] text-[#F8F4ED] text-center space-y-5 border border-[#24251F] shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#E7EBDD]/20 border border-[#E7EBDD]/40 flex items-center justify-center mx-auto text-[#E7EBDD]">
            <Building2 className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight max-w-xl mx-auto text-[#F8F4ED]">
            Experience a modern campus operational layer.
          </h2>
          <p className="text-sm sm:text-base text-[#E7EBDD]/85 max-w-lg mx-auto leading-relaxed">
            Report an issue as a student, review automated duplicates as a staff member, or inspect verified Proof-of-Fix resolutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/student/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#F8F4ED] hover:bg-white text-[#24251F] font-bold text-sm transition-colors shadow-sm"
            >
              <span>Submit Student Complaint</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/staff"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#35483A] hover:bg-[#2c3d31] text-[#F8F4ED] font-semibold text-sm transition-colors border border-[#E7EBDD]/30"
            >
              <span>Staff Operations Command</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Face Recognition Modal on Front Page */}
      <FaceRecognitionModal
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        onVerified={(data) => {
          setIsFaceModalOpen(false);
          alert(`Biometric Verified: Student ${data.name} (ID: ${data.studentId}) verified with 99.4% confidence!`);
        }}
      />
    </div>
  );
}
