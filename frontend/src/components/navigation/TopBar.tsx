'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Bell, 
  UserCheck, 
  Sparkles, 
  Menu, 
  X,
  RotateCcw,
  LogOut,
  ArrowRight,
  Scan
} from 'lucide-react';
import { getNotifications, markAllNotificationsAsRead, resetToDemoData } from '@/lib/data/store';
import { NotificationItem, UserRole } from '@/lib/types';
import FaceRecognitionModal from '@/components/auth/FaceRecognitionModal';

export default function TopBar() {
  const { user, role, loginAsDemo, logout, isDemoMode } = useAuth();
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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    loginAsDemo(e.target.value as UserRole);
  };

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E7E1D7] bg-[#F8F4ED]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#35483A] flex items-center justify-center text-[#F8F4ED] shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#24251F] flex items-center gap-2">
                  CampusConnect
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E7EBDD] text-[#35483A] border border-[#CCD6BE] font-bold">
                    OPS
                  </span>
                </span>
                <p className="text-xs text-[#77766E] hidden sm:block font-mono">Operations Intelligence</p>
              </div>
            </Link>

            {/* Primary Nav Links (Comfortable readable text) */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/' ? 'text-[#35483A] bg-[#EDE4D7] font-bold' : 'text-[#77766E] hover:text-[#24251F]'
                }`}
              >
                Overview
              </Link>
              <Link
                href="/student"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith('/student') ? 'text-[#35483A] bg-[#EDE4D7] font-bold' : 'text-[#77766E] hover:text-[#24251F]'
                }`}
              >
                Student Portal
              </Link>
              <Link
                href="/staff"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname.startsWith('/staff') ? 'text-[#35483A] bg-[#EDE4D7] font-bold' : 'text-[#77766E] hover:text-[#24251F]'
                }`}
              >
                Staff Command
              </Link>
              <Link
                href="/features"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/features' ? 'text-[#35483A] bg-[#EDE4D7] font-bold' : 'text-[#77766E] hover:text-[#24251F]'
                }`}
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/how-it-works' ? 'text-[#35483A] bg-[#EDE4D7] font-bold' : 'text-[#77766E] hover:text-[#24251F]'
                }`}
              >
                Workflow
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Face ID Biometric Trigger Button */}
            <button
              onClick={() => setIsFaceModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCFAF6] border border-[#D5CEBF] hover:bg-[#EDE4D7] text-xs font-mono font-bold text-[#35483A] transition-colors shadow-xs"
              title="Launch AI Face Recognition Scanner"
            >
              <Scan className="w-3.5 h-3.5 text-[#35483A]" />
              <span>{biometricVerifiedUser ? `Verified: ${biometricVerifiedUser.split(' ')[0]}` : 'Face ID Scan'}</span>
            </button>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCFAF6] border border-[#D5CEBF] text-xs">
              <UserCheck className="w-4 h-4 text-[#35483A]" />
              <span className="text-xs font-mono text-[#77766E] uppercase font-bold">Role:</span>
              <select
                value={role}
                onChange={handleRoleChange}
                className="text-xs font-bold bg-transparent text-[#24251F] focus:outline-none cursor-pointer"
              >
                <option value="student">Student (Ananya)</option>
                <option value="staff">Staff (Rajesh)</option>
                <option value="admin">Director (Meenakshi)</option>
              </select>
            </div>

            {/* Reset Demo Data */}
            <button
              onClick={handleResetData}
              title="Reset Demo Data"
              className="p-2 rounded-xl text-[#77766E] hover:text-[#24251F] hover:bg-[#EDE4D7] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (!showNotifs) markAllNotificationsAsRead();
                }}
                className="relative p-2 rounded-xl text-[#77766E] hover:text-[#24251F] hover:bg-[#EDE4D7] transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#FCFAF6] border border-[#D5CEBF] shadow-xl p-4 z-50 space-y-3 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D7]">
                    <span className="text-xs font-mono font-bold uppercase text-[#35483A]">
                      Operations Notifications
                    </span>
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-xs font-mono text-[#77766E] hover:text-[#24251F]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 divide-y divide-[#E7E1D7]">
                    {notifications.map((n) => (
                      <div key={n.id} className="pt-2 text-xs space-y-0.5">
                        <div className="font-bold text-[#24251F]">{n.title}</div>
                        <div className="text-[#77766E] text-[11px]">{n.message}</div>
                        <div className="text-[10px] text-[#77766E] font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <Link
              href="/student/report"
              className="btn-primary text-xs sm:text-sm px-4 py-2"
            >
              <span>Report Issue</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 btn-arrow" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#24251F] hover:bg-[#EDE4D7]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 border-t border-[#E7E1D7] bg-[#FCFAF6] space-y-2">
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
              href="/staff"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Staff Command
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24251F] hover:bg-[#EDE4D7]"
            >
              Workflow
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
