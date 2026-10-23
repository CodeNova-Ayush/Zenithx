'use client';

import React, { useState, useEffect } from 'react';
import { getTickets } from '@/lib/data/store';
import { Ticket } from '@/lib/types';
import CampusPulseMap from '@/components/campus/CampusPulseMap';
import LivingCampus from '@/components/campus-3d/LivingCampus';
import { MapPin, Box, Layers, Sparkles } from 'lucide-react';

export default function CampusPulsePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const loadData = () => {
    setTickets(getTickets());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_state_change', loadData);
    return () => window.removeEventListener('campusconnect_state_change', loadData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Campus Pulse (Spatial Intelligence)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time geospatial layout of active maintenance incidents across academic, residential, and dining sectors.
          </p>
        </div>

        {/* 2D / 3D Visual Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2d'
                ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Sector View</span>
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Living Campus</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === '2d' ? (
        <CampusPulseMap tickets={tickets} />
      ) : (
        <div className="space-y-4">
          <LivingCampus />
        </div>
      )}
    </div>
  );
}
