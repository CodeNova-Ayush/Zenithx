'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, X, ArrowRight, Send, Sparkles, Building2, AlertCircle } from 'lucide-react';
import RoboDogAvatar from '@/components/assistant/RoboDogAvatar';
import { AssistantMessage } from '@/lib/types';

export default function AssistantLauncher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [miniQuery, setMiniQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState<AssistantMessage | null>(null);

  // Don't show on the assistant page itself or sign-in/up pages
  if (pathname === '/student/assistant' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

  const handleQuickAsk = async (queryToAsk: string) => {
    const q = (queryToAsk || miniQuery).trim();
    if (!q || isAnswering) return;

    setIsAnswering(true);
    setQuickAnswer(null);

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: 'en' }),
      });

      if (res.ok) {
        const data: AssistantMessage = await res.json();
        setQuickAnswer(data);
      } else {
        router.push(`/student/assistant?q=${encodeURIComponent(q)}`);
      }
    } catch (e) {
      // Fallback: navigate directly to full assistant
      router.push(`/student/assistant?q=${encodeURIComponent(q)}`);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-[340px] sm:w-[410px] rounded-2xl border-2 border-[#D5CEBF] bg-[#FCFAF6] text-[#24251F] shadow-[0_20px_50px_rgba(0,0,0,0.22)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header with Robo-Dog Branding */}
          <div className="bg-[#35483A] text-[#F8F4ED] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RoboDogAvatar size="md" mood={isAnswering ? 'listening' : 'idle'} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#F8F4ED] leading-none">
                    Spot K-9 Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#E7EBDD] text-[#35483A]">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-[#CCD6BE] font-mono mt-0.5">
                  Campus Guide & Outage Radar
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-[#CCD6BE] hover:text-[#F8F4ED] hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5 bg-[#FCFAF6]">
            {!quickAnswer ? (
              <>
                <p className="text-xs text-[#57564E] leading-relaxed">
                  Hi! I&apos;m <strong>Spot K-9</strong>. Ask me anything about hostel curfews, bonafide certificates, Wi-Fi outages, or campus facility timings.
                </p>

                {/* Quick Inquiries Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#77766E] uppercase tracking-wider font-bold">
                    Quick Verification Questions:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { label: '📡 Wi-Fi Outage in my hostel?', q: 'Is there a Wi-Fi outage in my hostel?' },
                      { label: '📜 How to get a bonafide letter?', q: 'How do I get a bonafide letter?' },
                      { label: '⏰ Hostel curfew & entry gate hours?', q: 'What are the hostel entry and curfew rules?' },
                      { label: '🔌 Are room heaters allowed?', q: 'Are room heaters or irons allowed in hostels?' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMiniQuery(item.q);
                          handleQuickAsk(item.q);
                        }}
                        className="text-left p-2 rounded-lg bg-[#F8F4ED] hover:bg-[#EDE4D7] border border-[#E7E1D7] text-xs font-medium text-[#24251F] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-3 h-3 text-[#77766E] group-hover:text-[#35483A] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Quick Answer Card inside Popup */
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#35483A]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Spot&apos;s Verified Answer
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuickAnswer(null)}
                      className="text-[#77766E] hover:text-[#24251F] underline text-[10px]"
                    >
                      Ask another
                    </button>
                  </div>
                  <p className="text-[#24251F] font-serif leading-relaxed text-xs">
                    {quickAnswer.answerText}
                  </p>
                  {quickAnswer.sources?.length > 0 && (
                    <div className="pt-2 border-t border-[#E7E1D7] text-[10px] text-[#77766E] font-mono">
                      Source: {quickAnswer.sources[0].title} ({quickAnswer.sources[0].id})
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/student/assistant?q=${encodeURIComponent(miniQuery)}`}
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-mono font-semibold text-[#35483A] hover:underline flex items-center gap-1"
                  >
                    View in Full Assistant Desk →
                  </Link>
                  <Link
                    href="/student/report"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-mono text-[#77766E] hover:text-[#24251F]"
                  >
                    Report Physical Issue
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Ask Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuickAsk(miniQuery);
              }}
              className="flex items-center gap-2 pt-2 border-t border-[#E7E1D7]"
            >
              <input
                type="text"
                value={miniQuery}
                onChange={(e) => setMiniQuery(e.target.value)}
                placeholder="Ask Spot anything..."
                className="flex-1 p-2 rounded-lg border border-[#D5CEBF] bg-[#F8F4ED] text-xs text-[#24251F] placeholder-[#77766E] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              />
              <button
                type="submit"
                disabled={isAnswering || !miniQuery.trim()}
                className="px-3 py-2 rounded-lg bg-[#35483A] text-[#F8F4ED] text-xs font-semibold hover:bg-[#2A3B2F] disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                {isAnswering ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ask</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Status bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#77766E] pt-1">
              <span className="flex items-center gap-1 text-[#35483A] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Handbook Grounded
              </span>
              <Link
                href="/student/assistant"
                onClick={() => setIsOpen(false)}
                className="text-[#35483A] font-bold hover:underline"
              >
                Open Full Desk →
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Floating Launcher Pill Button */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#FCFAF6] border-2 border-[#35483A]/30 text-[#24251F] shadow-xl hover:shadow-2xl hover:border-[#35483A] transition-all group cursor-pointer hover:scale-[1.03]"
          aria-label="Open Spot K-9 Campus Assistant"
        >
          <RoboDogAvatar size="sm" isAnimated={true} />
          <div className="text-left hidden sm:block pr-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold font-serif leading-tight text-[#24251F] group-hover:text-[#35483A] transition-colors">
                Spot K-9 Bot
              </p>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                AI
              </span>
            </div>
            <p className="text-[10px] text-[#77766E] font-mono">Official Campus Guide</p>
          </div>
        </button>
      )}
    </div>
  );
}
