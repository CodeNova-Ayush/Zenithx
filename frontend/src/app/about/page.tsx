import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, HeartHandshake, Zap, ArrowRight, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* 1. EDITORIAL HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pb-6 border-b border-[#E7E1D7]">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
          <Layers className="w-3.5 h-3.5 text-[#35483A]" />
          <span>Operational Philosophy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#24251F] tracking-tight leading-[1.1]">
          Empowering university campuses through operational transparency.
        </h1>
        <p className="text-xs sm:text-sm text-[#77766E] leading-relaxed">
          CampusConnect was created to bridge the communication disconnect between students living in residential halls and the dedicated maintenance engineers keeping facilities functioning.
        </p>
      </div>

      {/* 2. THREE PILLARS (WARM PAPER STYLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#EDE4D7] text-[#35483A] flex items-center justify-center mb-2">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif font-bold text-[#24251F]">Respect Student Time</h3>
          <p className="text-xs text-[#77766E] leading-relaxed">
            Students should not navigate labyrinthine paper bureaucracy just to report broken plumbing, unlit corridors, or power hazards.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#EDE4D7] text-[#35483A] flex items-center justify-center mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif font-bold text-[#24251F]">Empower Staff Teams</h3>
          <p className="text-xs text-[#77766E] leading-relaxed">
            Maintenance technicians deserve intelligent dispatch recommendations that respect trade certifications and active workload.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#FCFAF6] border border-[#E7E1D7] space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#EDE4D7] text-[#35483A] flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-serif font-bold text-[#24251F]">Eliminate Premature Sign-Offs</h3>
          <p className="text-xs text-[#77766E] leading-relaxed">
            Proof-of-Fix visual evidence ensures repairs are physically verified before tickets can be signed off, rebuilding institutional trust.
          </p>
        </div>
      </div>

      {/* 3. CALL TO ACTION */}
      <div className="p-8 rounded-xl bg-[#35483A] text-[#F8F4ED] text-center space-y-4 border border-[#24251F]">
        <h3 className="text-xl font-serif font-bold text-[#F8F4ED]">
          Test CampusConnect in Real-Time
        </h3>
        <p className="text-xs text-[#E7EBDD]/80 max-w-md mx-auto">
          Explore the student reporting flow or switch to the operations command desk to manage the complete incident lifecycle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <Link
            href="/student"
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#F8F4ED] hover:bg-white text-[#24251F] font-bold text-xs transition-colors shadow-sm"
          >
            Launch Student Portal
          </Link>
          <Link
            href="/staff"
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#35483A] hover:bg-[#2c3d31] text-[#F8F4ED] font-semibold text-xs border border-[#E7EBDD]/30 transition-colors"
          >
            Launch Staff Command
          </Link>
        </div>
      </div>
    </div>
  );
}
