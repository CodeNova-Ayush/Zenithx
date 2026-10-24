'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Bell, 
  ArrowRight, 
  Scan, 
  Menu, 
  X,
  RotateCcw
} from 'lucide-react';
import { getNotifications, markAllNotificationsAsRead, resetToDemoData } from '@/lib/data/store';
import { NotificationItem } from '@/lib/types';
import FaceRecognitionModal from '@/components/auth/FaceRecognitionModal';
import RoboDogAvatar from '@/components/assistant/RoboDogAvatar';

export default function TopBar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [biometricVerifiedUser, setBiometricVerifiedUser] = useState<string | null>(null);

  const refreshNotifs = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    refreshNotifs();
    window.addEventListener('campusconnect_state_change', refreshNotifs);
    return () => window.removeEventListener('campusconnect_state_change', refreshNotifs);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleResetData = () => {
    if (confirm('Reset CampusConnect demo data back to factory state?')) {
      resetToDemoData();
      alert('Demo data restored! All tickets, duplicates, and notifications reset.');
    }
  };

  const handleBiometricVerified = (data: { name: string; studentId: string }) => {
    setBiometricVerifiedUser(data.name);
    alert(`Biometric Face Scan Verified! Welcome, ${data.name} (ID: ${data.studentId}).`);
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip border-b border-[#E7E1D7] bg-[#F8F4ED]/98 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#35483A] flex items-center justify-center text-[#F8F4ED] shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#24251F]">
                  CampusConnect
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E7EBDD] text-[#35483A] border border-[#CCD6BE] font-bold">
                  OPS
                </span>
              </div>
            </Link>

            {/* Essential Nav Links (Compact, Well-Fitted & Zero Overflow) */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link
                href="/"
                className={`px-2.5 py-1.5 rounded-md transition-colors ${
                  isLinkActive('/') && pathname === '/'
                    ? 'text-[#35483A] bg-[#EDE4D7] font-bold'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                Overview
              </Link>

              <Link
                href="/student"
                className={`px-2.5 py-1.5 rounded-md transition-colors ${
                  isLinkActive('/student') && !pathname.startsWith('/student/assistant')
                    ? 'text-[#35483A] bg-[#EDE4D7] font-bold'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                Student Portal
              </Link>

              <Link
                href="/student/assistant"
                className={`px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/student/assistant')
                    ? 'text-[#35483A] bg-[#EDE4D7] font-bold'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                <RoboDogAvatar size="sm" isAnimated={false} className="w-3.5 h-3.5 !p-0" />
                <span>Assistant</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  K-9
                </span>
              </Link>

              <Link
                href="/staff"
                className={`px-2.5 py-1.5 rounded-md transition-colors ${
                  pathname === '/staff' || pathname.startsWith('/staff/tickets')
                    ? 'text-[#35483A] bg-[#EDE4D7] font-bold'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                Staff Command
              </Link>

              <Link
                href="/staff/incidents"
                className={`px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                  pathname.startsWith('/staff/incidents')
                    ? 'text-[#35483A] bg-[#EDE4D7] font-bold'
                    : 'text-[#57564E] hover:text-[#24251F]'
                }`}
              >
                <span>Incidents</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  AI
                </span>
              </Link>
            </nav>
          </div>

          {/* Right Section: Compact, Never Clips, Zero Horizontal Scroll */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Auth Sign In Button */}
            <Link
              href="/sign-in"
              className="px-2.5 py-1.5 rounded-md border border-[#D5CEBF] bg-[#FCFAF6] hover:bg-[#EDE4D7] text-xs font-mono font-bold text-[#24251F] transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (!showNotifs) markAllNotificationsAsRead();
                }}
                className="relative p-1.5 rounded-lg text-[#57564E] hover:text-[#24251F] hover:bg-[#EDE4D7] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#FCFAF6] border border-[#D5CEBF] shadow-2xl p-4 z-50 space-y-3 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D7]">
                    <span className="text-xs font-mono font-bold uppercase text-[#35483A]">
                      Operations Notifications
                    </span>
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-xs font-mono text-[#77766E] hover:text-[#24251F] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 divide-y divide-[#E7E1D7]">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#77766E] py-2 text-center">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="pt-2 text-xs space-y-0.5">
                          <div className="font-bold text-[#24251F]">{n.title}</div>
                          <div className="text-[#57564E] text-[11px]">{n.message}</div>
                          <div className="text-[10px] text-[#77766E] font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Report Issue */}
            <Link
              href="/student/report"
              className="btn-primary text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-2xs whitespace-nowrap"
            >
              <span>Report Issue</span>
              <ArrowRight className="w-3 h-3 btn-arrow" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-[#24251F] hover:bg-[#EDE4D7] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 border-t border-[#E7E1D7] bg-[#FCFAF6] space-y-2 animate-in fade-in-50">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Overview
            </Link>
            <Link
              href="/student"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Student Portal
            </Link>
            <Link
              href="/student/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              <RoboDogAvatar size="sm" isAnimated={false} className="w-4 h-4" />
              <span>Spot K-9 Assistant</span>
            </Link>
            <Link
              href="/staff"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Staff Command
            </Link>
            <Link
              href="/staff/incidents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Incident Clusters (Outage Detective)
            </Link>
            <Link
              href="/staff/knowledge"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Knowledge Base (Repair Copilot)
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Features & Architecture
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsFaceModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono font-bold text-[#35483A] hover:bg-[#EDE4D7] flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>Face ID Biometric Scan</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleResetData();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-[#77766E] hover:bg-[#EDE4D7] flex items-center gap-2 pt-2 border-t border-[#E7E1D7]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        )}
      </header>

      {/* Face Recognition Modal Dialog */}
      <FaceRecognitionModal
        isOpen={isFaceModalOpen}
        initialName={user?.name || ''}
        initialStudentId={user?.id || ''}
        onClose={() => setIsFaceModalOpen(false)}
        onVerified={handleBiometricVerified}
      />
    </>
  );
}
