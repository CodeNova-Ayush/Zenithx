import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React, { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import TopBar from '@/components/navigation/TopBar';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CampusConnect — AI Campus Operations Intelligence Platform',
  description: 'From campus complaints to intelligent action. Transforming fragmented university maintenance reports into structured, trackable workflows with Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col paper-canvas text-[#24251F] font-sans">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 border-b border-[#E7E1D7] bg-[#F8F4ED]" />}>
            <TopBar />
          </Suspense>
          <div className="flex-1">
            {children}
          </div>
          {/* Global Editorial Footer */}
          <footer className="border-t border-[#E7E1D7] bg-[#FCFAF6]/90 py-10 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#77766E]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#35483A] flex items-center justify-center text-[#F8F4ED] font-bold text-[10px]">
                  CC
                </div>
                <span className="font-bold text-[#24251F]">CampusConnect</span>
                <span>• Intelligent Operations Layer for Campus Maintenance</span>
              </div>

              <div className="flex items-center gap-6">
                <Link href="/" className="hover:text-[#24251F]">Overview</Link>
                <Link href="/features" className="hover:text-[#24251F]">Features</Link>
                <Link href="/how-it-works" className="hover:text-[#24251F]">Workflow</Link>
                <Link href="/about" className="hover:text-[#24251F]">About</Link>
                <Link href="/student" className="hover:text-[#24251F]">Student Portal</Link>
                <Link href="/staff" className="hover:text-[#24251F]">Staff Command</Link>
              </div>

              <div className="font-mono text-[11px] text-[#77766E]">
                Operational Intelligence • 2026
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
