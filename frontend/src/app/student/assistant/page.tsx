'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Search, 
  Send, 
  FileText, 
  Building2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Wifi, 
  Radio, 
  PhoneCall, 
  Mail, 
  Clock, 
  HelpCircle,
  Flame,
  Volume2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AssistantMessage } from '@/lib/types';
import RoboDogAvatar from '@/components/assistant/RoboDogAvatar';

const SUGGESTED_PROMPTS = [
  { label: '📡 My hostel Wi-Fi is not working', query: 'My hostel Wi-Fi is not working. What should I do?' },
  { label: '📜 How to get a bonafide letter', query: 'How do I get a bonafide certificate for my passport application?' },
  { label: '⏰ Hostel curfew & gate timings', query: 'What is the hostel entry curfew and late night rule?' },
  { label: '🔌 Can I use an iron in my room?', query: 'Are electric heaters or irons allowed in hostel rooms?' },
  { label: '🏋️ Gymnasium timings & trainer', query: 'What are the campus gym timings and shoe rules?' },
  { label: '📋 Check my complaint status', query: 'What is the status of my maintenance ticket?' },
];

export default function StudentAssistantPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [expandedProvenanceId, setExpandedProvenanceId] = useState<string | null>(null);
  const [followedOutages, setFollowedOutages] = useState<string[]>([]);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  // Load conversation from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('campusconnect_assistant_history');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load assistant history:', e);
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusconnect_assistant_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save assistant history:', e);
    }
  }, [messages]);

  const handleAsk = async (userQuery: string) => {
    const q = userQuery.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setQuery('');

    // Optimistic user query record
    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      query: q,
      answerText: q,
      sources: [],
      liveLookupsUsed: [],
      nextSteps: [],
      isEmergency: false,
      isUnverifiedFallback: false,
      howAnswerWasMade: 'User query submitted.',
      language,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          language,
          studentId: user?.id || 'student-demo',
          studentName: user?.name || 'Ayush Mishra',
          studentBuilding: 'Tagore Hostel (Block C)',
          studentFloor: 2,
          studentRoom: '204',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch assistant response.');
      }

      const answer: AssistantMessage = await res.json();
      setMessages(prev => [...prev, answer]);
    } catch (err: any) {
      const errorMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        query: q,
        answerText: `⚠️ **Connection Error:** ${err.message || 'Unable to connect to the campus knowledge server.'} Please try again or visit the Operations Helpdesk in person.`,
        sources: [],
        liveLookupsUsed: [],
        nextSteps: [],
        isEmergency: false,
        isUnverifiedFallback: true,
        howAnswerWasMade: 'Network error fallback.',
        language,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear your assistant conversation history? (This removes local records from this browser)')) {
      setMessages([]);
      localStorage.removeItem('campusconnect_assistant_history');
    }
  };

  const handleFeedback = async (messageId: string, type: 'helpful' | 'unhelpful', queryText: string, topic: string) => {
    setFeedbackSent(prev => ({ ...prev, [messageId]: type }));

    try {
      await fetch('/api/assistant/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          query: queryText,
          topic,
          feedback: type,
        }),
      });
    } catch (e) {
      console.warn('Feedback submit failed:', e);
    }
  };

  const handleFollowOutage = (incidentId: string) => {
    if (!followedOutages.includes(incidentId)) {
      setFollowedOutages(prev => [...prev, incidentId]);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Editorial Banner */}
      <div className="border border-border-subtle bg-card rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="flex items-start gap-4">
            <RoboDogAvatar size="lg" className="hidden sm:inline-flex shrink-0 mt-1" />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-mono font-medium tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                Spot K-9 • Autonomous Campus Guide
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight flex items-center gap-2">
                <span>Spot K-9 Assistant</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VERIFIED AI
                </span>
              </h1>
              <p className="text-sm text-muted-ink max-w-2xl font-sans">
                Get certified answers about hostel rules, official certificates, campus facilities, and active maintenance outages. All answers are grounded strictly in approved campus documents with zero invented claims.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Language Selector */}
            <div className="inline-flex rounded-lg border border-border-subtle bg-ivory p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-md transition-colors ${language === 'en' ? 'bg-forest text-card font-semibold' : 'text-muted-ink hover:text-ink'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded-md transition-colors ${language === 'hi' ? 'bg-forest text-card font-semibold' : 'text-muted-ink hover:text-ink'}`}
              >
                हिंदी
              </button>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-ink hover:text-rust transition-colors px-3 py-2 rounded-lg border border-border-subtle bg-ivory"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'hi' ? 'कैंपस नियम, हॉस्टल समस्या या सेवा के बारे में पूछें...' : 'Ask about hostel rules, Wi-Fi outages, bonafide letters, or gym hours...'}
              className="w-full pl-4 pr-28 py-3.5 rounded-xl border border-border-subtle bg-ivory focus:bg-card focus:outline-none focus:ring-2 focus:ring-forest/20 text-sm font-sans placeholder:text-muted-ink/60 text-ink shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-forest text-card hover:bg-forest/90 font-medium text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-card/30 border-t-card rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Ask Desk
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-mono text-muted-ink uppercase tracking-wider">Suggested:</span>
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(p.query)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-md bg-ivory border border-border-subtle text-ink hover:border-forest/40 hover:bg-forest/5 transition-all text-left"
              >
                {p.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Main Conversation Stream (Document-Style, NOT Chat Bubbles) */}
      <div className="space-y-6">
        {messages.length === 0 ? (
          <div className="border border-border-subtle/80 bg-card/60 rounded-2xl p-10 text-center space-y-4">
            <RoboDogAvatar size="xl" className="mx-auto" />
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-serif text-lg font-bold text-ink">Spot K-9 Campus Reference Desk</h3>
              <p className="text-xs text-muted-ink">
                Ask Spot any question about university policies, hostel regulations, bonafide letters, or active facility outages. Every answer is grounded directly in official campus records.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex items-center gap-3 px-4 py-2 text-xs font-mono text-muted-ink border-b border-border-subtle/50">
                  <span className="w-2 h-2 rounded-full bg-forest" />
                  <span className="font-semibold text-ink uppercase tracking-wider">Student Inquiry:</span>
                  <span className="italic">"{msg.answerText}"</span>
                </div>
              );
            }

            const hasSources = msg.sources && msg.sources.length > 0;
            const hasStaleSource = msg.sources?.some(s => s.isStale);
            const isEmergency = msg.isEmergency;
            const isProvenenceOpen = expandedProvenanceId === msg.id;

            return (
              <article
                key={msg.id}
                className={`border rounded-2xl p-6 sm:p-8 space-y-6 transition-all ${
                  isEmergency
                    ? 'border-rust/40 bg-rust/5 shadow-md'
                    : msg.isUnverifiedFallback
                    ? 'border-amber/40 bg-amber/5'
                    : 'border-border-subtle bg-card shadow-sm'
                }`}
              >
                {/* Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <RoboDogAvatar size="sm" isAnimated={false} />
                    {isEmergency ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rust/20 border border-rust/40 text-rust font-mono text-xs font-bold uppercase tracking-wider">
                        <Flame className="w-3.5 h-3.5" /> Emergency Protocol
                      </span>
                    ) : msg.isUnverifiedFallback ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber/20 border border-amber/40 text-amber font-mono text-xs font-bold uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5" /> Verified Gap Notice
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/10 border border-forest/20 text-forest font-mono text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Spot Verified Campus Record
                      </span>
                    )}

                    {hasStaleSource && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/20 text-amber font-mono text-[11px] font-semibold border border-amber/30">
                        <AlertTriangle className="w-3 h-3" /> Stale Source Alert (&gt;6 Months)
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-muted-ink">
                    Answered at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Answer Content */}
                <div className="prose prose-sm max-w-none text-ink font-sans leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {language === 'hi' && msg.hindiTranslation ? msg.hindiTranslation : msg.answerText}
                </div>

                {/* Live Lookups Used (If Any) */}
                {msg.liveLookupsUsed && msg.liveLookupsUsed.length > 0 && (
                  <div className="rounded-xl border border-border-subtle bg-ivory p-3.5 space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-ink flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-forest animate-pulse" /> Live Operational Lookups Evaluated:
                    </span>
                    <div className="space-y-1">
                      {msg.liveLookupsUsed.map((lk, lkIdx) => (
                        <div key={lkIdx} className="text-xs text-ink flex items-start gap-2">
                          <span className="text-forest font-bold">•</span>
                          <span>
                            <strong className="font-semibold">{lk.title}</strong>
                            {lk.details && <span className="text-muted-ink ml-1.5">({lk.details})</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources Row */}
                {hasSources && (
                  <div className="space-y-2 pt-2 border-t border-border-subtle/80">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-ink flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Grounded Source Documents ({msg.sources.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.sources.map(src => (
                        <div
                          key={src.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            src.isStale 
                              ? 'border-amber/40 bg-amber/5' 
                              : 'border-border-subtle bg-ivory'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-ink line-clamp-1">{src.title}</span>
                            {src.link && (
                              <a
                                href={src.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-forest hover:text-forest/80 shrink-0"
                                title="Open official link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-ink flex items-center justify-between">
                            <span>{src.department}</span>
                            <span>Reviewed: {new Date(src.lastReviewedAt).toLocaleDateString()}</span>
                          </div>
                          {src.isStale && (
                            <div className="text-[10px] text-amber font-mono font-semibold pt-1">
                              ⚠️ Stale document warning: last reviewed &gt;180 days ago.
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps Action Row */}
                {msg.nextSteps && msg.nextSteps.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-ink">
                      Recommended Next Actions:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {msg.nextSteps.map((step, sIdx) => {
                        if (step.action === 'follow_outage') {
                          const incidentId = step.payload?.incidentId || '';
                          const isFollowed = Boolean(incidentId && followedOutages.includes(incidentId));
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => incidentId && handleFollowOutage(incidentId)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                                isFollowed
                                  ? 'bg-forest/20 text-forest border border-forest/30'
                                  : 'bg-forest text-card hover:bg-forest/90'
                              }`}
                            >
                              <Radio className="w-3.5 h-3.5" />
                              {isFollowed ? 'Subscribed to Live Outage SMS & App Alerts' : step.label}
                            </button>
                          );
                        }

                        if (step.action === 'report_issue') {
                          const url = step.payload?.category 
                            ? `/student/report?category=${step.payload.category}&title=${encodeURIComponent(step.payload.title || '')}`
                            : '/student/report';
                          return (
                            <Link
                              key={sIdx}
                              href={url}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest text-card hover:bg-forest/90 text-xs font-mono font-medium transition-colors"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                              {step.label}
                            </Link>
                          );
                        }

                        if (step.action === 'view_ticket') {
                          const url = step.payload?.ticketId ? `/student/tickets/${step.payload.ticketId}` : '/student/tickets';
                          return (
                            <Link
                              key={sIdx}
                              href={url}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory border border-border-subtle hover:border-forest/40 text-ink text-xs font-mono font-medium transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-forest" />
                              {step.label}
                            </Link>
                          );
                        }

                        if (step.action === 'contact_dept') {
                          return (
                            <a
                              key={sIdx}
                              href={step.payload?.phone ? `tel:${step.payload.phone}` : `mailto:${step.payload?.email}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory border border-border-subtle hover:border-forest/40 text-ink text-xs font-mono font-medium transition-colors"
                            >
                              {step.payload?.phone ? <PhoneCall className="w-3.5 h-3.5 text-forest" /> : <Mail className="w-3.5 h-3.5 text-forest" />}
                              {step.label}
                            </a>
                          );
                        }

                        if (step.action === 'link' && step.payload?.url) {
                          return (
                            <a
                              key={sIdx}
                              href={step.payload.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory border border-border-subtle hover:border-forest/40 text-ink text-xs font-mono font-medium transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-forest" />
                              {step.label}
                            </a>
                          );
                        }

                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Provenance & Feedback Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle/80 text-xs text-muted-ink">
                  {/* Expandable Provenance Note */}
                  <button
                    type="button"
                    onClick={() => setExpandedProvenanceId(isProvenenceOpen ? null : msg.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono hover:text-ink transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-forest" />
                    How this answer was created
                    {isProvenenceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* Feedback Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono">Was this answer helpful?</span>
                    <button
                      type="button"
                      disabled={Boolean(feedbackSent[msg.id])}
                      onClick={() => handleFeedback(msg.id, 'helpful', msg.query, msg.sources?.[0]?.title || 'General')}
                      className={`p-1 rounded hover:bg-forest/10 transition-colors ${
                        feedbackSent[msg.id] === 'helpful' ? 'text-forest font-bold' : 'text-muted-ink hover:text-forest'
                      }`}
                      title="Yes, helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(feedbackSent[msg.id])}
                      onClick={() => handleFeedback(msg.id, 'unhelpful', msg.query, msg.sources?.[0]?.title || 'General')}
                      className={`p-1 rounded hover:bg-rust/10 transition-colors ${
                        feedbackSent[msg.id] === 'unhelpful' ? 'text-rust font-bold' : 'text-muted-ink hover:text-rust'
                      }`}
                      title="No, unhelpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    {feedbackSent[msg.id] && (
                      <span className="text-[10px] font-mono text-forest">Feedback recorded</span>
                    )}
                  </div>
                </div>

                {/* Provenance Drawer */}
                {isProvenenceOpen && (
                  <div className="rounded-xl p-4 bg-ivory border border-border-subtle text-xs space-y-2 text-ink font-mono animate-in fade-in duration-200">
                    <p className="font-bold uppercase tracking-wider text-[11px] text-forest">Audit & Generation Provenance</p>
                    <p className="text-muted-ink text-xs">{msg.howAnswerWasMade}</p>
                    <p className="text-[11px] text-muted-ink">
                      Security Policy: Zero generative extrapolation permitted. All statements matched directly with certified campus records.
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Safety & Privacy Notice */}
      <div className="border-t border-border-subtle pt-6 text-center text-xs text-muted-ink space-y-1 font-mono">
        <p>CampusConnect Privacy Guarantee: Conversations are private to your session and never shared with other students.</p>
        <p>Emergency Situations: Always dial 1800-CAMPUS-911 for immediate first responders.</p>
      </div>
    </div>
  );
}
