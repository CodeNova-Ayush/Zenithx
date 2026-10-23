'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TicketCheck, 
  CopyCheck, 
  UserCheck2, 
  MapPin, 
  Radar, 
  BrainCircuit, 
  Settings, 
  Building2,
  LogOut,
  User
} from 'lucide-react';
import { getTickets, getDuplicates } from '@/lib/data/store';
import { useAuth } from '@/context/AuthContext';

function StaffSidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);

  const refreshBadges = () => {
    const tickets = getTickets();
    const unassigned = tickets.filter(t => !t.assignedStaffId && t.status !== 'closed' && t.status !== 'resolved').length;
    setUnassignedCount(unassigned);

    const dups = getDuplicates();
    const pendingDups = dups.filter(d => d.status === 'pending').length;
    setDuplicateCount(pendingDups);
  };

  useEffect(() => {
    refreshBadges();
    window.addEventListener('campusconnect_state_change', refreshBadges);
    return () => window.removeEventListener('campusconnect_state_change', refreshBadges);
  }, []);

  const navItems = [
    { label: 'Overview', href: '/staff', icon: LayoutDashboard },
    { label: 'Tickets Queue', href: '/staff/tickets', icon: TicketCheck, badge: unassignedCount > 0 ? `${unassignedCount}` : undefined },
    { label: 'Duplicate Review', href: '/staff/duplicates', icon: CopyCheck, badge: duplicateCount > 0 ? `${duplicateCount}` : undefined, badgeColor: 'bg-amber-600' },
    { label: 'Smart Dispatch', href: '/staff/dispatch', icon: UserCheck2 },
    { label: 'Campus Pulse', href: '/staff/campus-pulse', icon: MapPin },
    { label: 'Recurrence Radar', href: '/staff/recurrence', icon: Radar },
    { label: 'Campus Brain AI', href: '/staff/campus-brain', icon: BrainCircuit, highlight: true },
    { label: 'Settings & Routing', href: '/staff/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/staff' 
            ? pathname === '/staff' 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
                isActive
                  ? 'bg-[#EDE4D7] text-[#24251F] font-bold border-l-2 border-[#35483A]'
                  : item.highlight
                  ? 'text-[#35483A] font-semibold hover:bg-[#F8F4ED]'
                  : 'text-[#77766E] hover:text-[#24251F] hover:bg-[#F8F4ED]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#35483A]' : 'text-[#77766E]'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded text-white ${
                    item.badgeColor || 'bg-[#35483A]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile & sign-out */}
      <div className="pt-4 border-t border-[#E7E1D7] space-y-3">
        <div className="flex items-center gap-2 px-2 text-xs">
          <div className="w-6 h-6 rounded-full bg-[#EDE4D7] flex items-center justify-center text-[#24251F] font-mono text-[10px] font-bold">
            {user?.name?.[0] || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[#24251F] truncate">{user?.name || 'Staff User'}</div>
            <div className="text-[10px] font-mono text-[#77766E] capitalize">{user?.role || 'Staff'}</div>
          </div>
          <button
            onClick={() => logout()}
            title="Sign out"
            className="p-1.5 rounded hover:bg-[#F8F4ED] text-[#77766E] hover:text-[#24251F] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SLA Telemetry pill */}
        <div className="p-2.5 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-[11px] font-mono space-y-1">
          <div className="flex items-center justify-between text-[#77766E]">
            <span>SLA COMPLIANCE</span>
            <span className="text-[#35483A] font-bold">94.2%</span>
          </div>
          <div className="w-full bg-[#E7E1D7] h-1 rounded-full overflow-hidden">
            <div className="bg-[#35483A] h-full w-[94%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Restrained Sidebar Navigation */}
      <aside className="w-full md:w-60 shrink-0 border-r border-[#E7E1D7] bg-[#FCFAF6] flex flex-col justify-between p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="px-2 py-1 flex items-center justify-between pb-3 border-b border-[#E7E1D7]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#35483A] tracking-wider uppercase">
                Operations Desk
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EDE4D7] text-[#24251F] font-semibold">
              Live
            </span>
          </div>

          {/* Navigation Items in Suspense */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-[#F8F4ED] rounded-lg" />}>
            <StaffSidebarNav />
          </Suspense>
        </div>
      </aside>

      {/* Main Operations Content */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
