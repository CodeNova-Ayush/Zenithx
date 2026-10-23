'use client';

import React, { useState } from 'react';
import { CAMPUS_BUILDINGS, CATEGORY_COLORS, CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { Ticket } from '@/lib/types';
import { MapPin, Building2, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CampusPulseMapProps {
  tickets: Ticket[];
  onSelectBuilding?: (buildingName: string) => void;
  selectedBuilding?: string | null;
}

export default function CampusPulseMap({ tickets, onSelectBuilding, selectedBuilding: externalSelected }: CampusPulseMapProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(CAMPUS_BUILDINGS[0].building);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedBuilding = externalSelected !== undefined ? externalSelected : internalSelected;

  const handleSelect = (bName: string) => {
    setInternalSelected(bName);
    if (onSelectBuilding) onSelectBuilding(bName);
  };

  // Group tickets by building
  const buildingTicketStats: Record<string, { total: number; plumbing: number; electricity: number; cleanliness: number; internet: number; urgent: number }> = {};
  
  CAMPUS_BUILDINGS.forEach(b => {
    buildingTicketStats[b.building] = { total: 0, plumbing: 0, electricity: 0, cleanliness: 0, internet: 0, urgent: 0 };
  });

  tickets.forEach(t => {
    if (t.status !== 'closed') {
      const stats = buildingTicketStats[t.building];
      if (stats) {
        stats.total += 1;
        if (t.category === 'plumbing') stats.plumbing += 1;
        if (t.category === 'electricity') stats.electricity += 1;
        if (t.category === 'cleanliness') stats.cleanliness += 1;
        if (t.category === 'internet') stats.internet += 1;
        if (t.priority === 'urgent') stats.urgent += 1;
      }
    }
  });

  const selectedTickets = tickets.filter(t => t.building === selectedBuilding && t.status !== 'closed');
  const selectedBuildingObj = CAMPUS_BUILDINGS.find(b => b.building === selectedBuilding);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6">
      {/* 2D Vector Spatial Map */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#E7E1D7]">
          <div>
            <h3 className="text-sm font-bold text-[#24251F] flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#35483A]" />
              Campus Operational Pulse (Spatial Grid)
            </h3>
            <p className="text-xs text-[#77766E] mt-0.5">
              Incident density across 6 monitored facility zones. Click any building node to inspect queue.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#F8F4ED] border border-[#E7E1D7] rounded-lg text-xs font-mono">
            {['all', 'plumbing', 'electricity', 'cleanliness', 'internet'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#35483A] text-[#F8F4ED] font-bold'
                    : 'text-[#77766E] hover:text-[#24251F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural SVG Map Canvas */}
        <div className="relative w-full h-[420px] bg-[#F8F4ED] rounded-xl overflow-hidden border border-[#E7E1D7] p-4 select-none">
          {/* Subtle Campus Grid & Connecting Pathways */}
          <svg className="absolute inset-0 w-full h-full stroke-[#D5CEBF]/60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="campus-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#campus-grid)" />
            {/* Walkway paths connecting buildings */}
            <line x1="22%" y1="35%" x2="50%" y2="50%" stroke="#35483A" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
            <line x1="20%" y1="68%" x2="50%" y2="50%" stroke="#35483A" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
            <line x1="74%" y1="32%" x2="50%" y2="50%" stroke="#35483A" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
            <line x1="78%" y1="72%" x2="50%" y2="50%" stroke="#35483A" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
            <line x1="48%" y1="84%" x2="50%" y2="50%" stroke="#35483A" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.3" />
          </svg>

          {/* Central Commons Label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
            <div className="w-20 h-20 rounded-full border border-[#D5CEBF] bg-[#EDE4D7]/40 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-[#77766E] uppercase tracking-wider text-center leading-tight">
                Central<br/>Plaza
              </span>
            </div>
          </div>

          {/* Building Interactive Nodes */}
          {CAMPUS_BUILDINGS.map((b) => {
            const stats = buildingTicketStats[b.building] || { total: 0, plumbing: 0, electricity: 0, cleanliness: 0, internet: 0, urgent: 0 };
            const isSelected = selectedBuilding === b.building;
            const categoryMatchCount = activeCategory === 'all' ? stats.total : (stats as any)[activeCategory] || 0;

            return (
              <div
                key={b.id}
                onClick={() => handleSelect(b.building)}
                style={{
                  left: `${b.mapPosition.x}%`,
                  top: `${b.mapPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all duration-200 group z-10 ${
                  isSelected ? 'scale-105 z-20' : 'hover:scale-102'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg border transition-all shadow-sm flex flex-col items-center ${
                    isSelected
                      ? 'bg-[#35483A] text-[#F8F4ED] border-[#24251F] ring-2 ring-[#35483A]/30'
                      : 'bg-[#FCFAF6] text-[#24251F] border-[#D5CEBF] hover:border-[#35483A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${isSelected ? 'text-[#EDE4D7]' : 'text-[#35483A]'}`}>
                      {b.buildingCode}
                    </span>
                    {stats.urgent > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold truncate max-w-[120px] text-center">
                    {b.building.split('(')[0]}
                  </span>
                  <div className={`mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    categoryMatchCount > 0
                      ? isSelected ? 'bg-[#FCFAF6]/20 text-[#F8F4ED]' : 'bg-[#EDE4D7] text-[#35483A] font-bold'
                      : 'text-[#77766E]'
                  }`}>
                    {categoryMatchCount} Active
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Facility Inspector */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        <div className="p-4 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D7]">
            <span className="font-mono text-xs font-bold text-[#35483A] uppercase tracking-wider">
              {selectedBuildingObj?.buildingCode} Inspector
            </span>
            <span className="text-[11px] font-mono text-[#77766E]">{selectedTickets.length} open issues</span>
          </div>
          <h4 className="text-sm font-bold text-[#24251F]">
            {selectedBuilding}
          </h4>
          <p className="text-xs text-[#77766E]">
            {selectedBuildingObj?.type.toUpperCase()} facility • {selectedBuildingObj?.floors.length} floor levels • {selectedBuildingObj?.rooms.length} registered room sectors.
          </p>
        </div>

        {/* Ticket List in Selected Facility */}
        <div className="flex-1 space-y-2 max-h-[300px] overflow-y-auto">
          {selectedTickets.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#77766E] border border-dashed border-[#D5CEBF] rounded-xl">
              No unresolved tickets currently logged in this facility.
            </div>
          ) : (
            selectedTickets.map((t) => (
              <Link
                key={t.id}
                href={`/staff/tickets/${t.id}`}
                className="p-3 rounded-lg border border-[#E7E1D7] bg-[#FCFAF6] hover:bg-[#F8F4ED] transition-colors block space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#35483A]">{t.ticketNumber}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${PRIORITY_COLORS[t.priority]?.bg || 'bg-stone-100'} ${PRIORITY_COLORS[t.priority]?.text || 'text-stone-800'}`}>
                    {t.priority}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#24251F] group-hover:text-[#35483A] truncate">
                  {t.title}
                </div>
                <div className="text-[11px] text-[#77766E] font-mono flex items-center justify-between">
                  <span>Fl. {t.floor || 'G'} • {t.room}</span>
                  <span className="flex items-center text-[#35483A] group-hover:underline">Inspect <ArrowRight className="w-3 h-3 ml-0.5" /></span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
