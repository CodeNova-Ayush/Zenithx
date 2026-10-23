'use client';

import React, { useState } from 'react';
import { 
  DEPARTMENT_MAPPINGS, 
  SLA_HOURS_MATRIX 
} from '@/lib/constants';
import { resetToDemoData } from '@/lib/data/store';
import { Settings, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function StaffSettingsPage() {
  const [departments, setDepartments] = useState(DEPARTMENT_MAPPINGS);
  const [slaMatrix, setSlaMatrix] = useState(SLA_HOURS_MATRIX);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset entire CampusConnect database and operational state back to initial seed data?')) {
      resetToDemoData();
      alert('Application reset to initial demo seeds successfully.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
            <Settings className="w-3.5 h-3.5 text-[#35483A]" />
            <span>Operations & Routing Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F] mt-1">
            System Routing Parameters
          </h1>
          <p className="text-xs text-[#77766E] mt-0.5">
            Configure automated department intake mappings, SLA target thresholds, and campus zones.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary text-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          <span>{saved ? 'Saved Changes!' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* 2. AUTOMATED ROUTING GUIDE */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
          Automated Department Routing Guide
        </h2>
        <p className="text-xs text-[#77766E]">
          When Gemini identifies an intake category, tickets are auto-routed to these designated campus departments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {Object.entries(departments).map(([cat, dept]) => (
            <div key={cat} className="space-y-1">
              <label className="block text-[11px] font-mono font-semibold uppercase text-[#77766E]">
                {cat} Category
              </label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDepartments({ ...departments, [cat]: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. SLA COMMITMENT MATRIX */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 space-y-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#77766E]">
          SLA Resolution Window (Hours)
        </h2>
        <p className="text-xs text-[#77766E]">
          Target maximum time allowed between ticket intake and verified technician resolution before escalation breach triggers.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F4ED] border-b border-[#E7E1D7] text-[#77766E] font-mono uppercase text-[11px]">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Urgent (Hours)</th>
                <th className="p-3">High (Hours)</th>
                <th className="p-3">Normal (Hours)</th>
                <th className="p-3">Low (Hours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E1D7] font-mono text-[11px]">
              {Object.entries(slaMatrix).map(([cat, hours]) => (
                <tr key={cat}>
                  <td className="p-3 font-sans font-bold capitalize text-[#24251F]">{cat}</td>
                  <td className="p-3 text-rose-700 font-bold">{hours.urgent}h</td>
                  <td className="p-3 text-amber-700">{hours.high}h</td>
                  <td className="p-3 text-[#24251F]">{hours.normal}h</td>
                  <td className="p-3 text-[#77766E]">{hours.low}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DEMO RESET BOX */}
      <div className="p-5 rounded-xl bg-[#EDE4D7] border border-[#D5CEBF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#24251F]">
            Factory State Reset
          </h3>
          <p className="text-xs text-[#77766E] mt-0.5">
            Restores all sample tickets, duplicates, and recurrence radar clusters to original demonstration state.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="btn-secondary text-xs text-rose-800 hover:text-rose-900"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>Reset Factory Demo Data</span>
        </button>
      </div>
    </div>
  );
}
