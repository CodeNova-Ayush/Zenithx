'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTickets } from '@/lib/data/store';
import { Ticket } from '@/lib/types';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  RotateCcw,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  supportingMetrics?: { label: string; value: string; trend?: string }[];
  relatedTicketNumbers?: string[];
  suggestedAction?: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  'What needs attention first?',
  'Which buildings have the most unresolved plumbing issues?',
  'Which internet complaints may be related?',
  'Summarise overdue tickets by department',
  'Which issues keep recurring?',
  "Prepare today's maintenance briefing",
];

export default function CampusBrainPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const loaded = getTickets();
    setTickets(loaded);

    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: `Campus Brain online. I have live access to ${loaded.length} campus operational records across all 6 facilities. You can query me using natural language to extract trends, identify bottlenecks, or assess urgent priorities.`,
        supportingMetrics: [
          { label: 'Live Telemetry', value: `${loaded.length} Tickets`, trend: 'Synchronized' },
          { label: 'Active Queue', value: `${loaded.filter(t => t.status !== 'closed' && t.status !== 'resolved').length} Open`, trend: 'Monitored' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  const handleSend = async (userPrompt: string) => {
    const textToSend = userPrompt || query;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/campus-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          tickets: getTickets(),
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        text: data.answer,
        supportingMetrics: data.supportingMetrics,
        relatedTicketNumbers: data.relatedTicketNumbers,
        suggestedAction: data.suggestedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Campus brain error', e);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: 'assistant',
          text: 'Unable to complete natural language query. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#35483A] uppercase">
            <BrainCircuit className="w-3.5 h-3.5 text-[#35483A]" />
            <span>Campus Brain AI Reasoning Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#24251F] mt-1">
            Operational Intelligence Query
          </h1>
          <p className="text-xs text-[#77766E] mt-0.5">
            Query entire incident history using natural conversational language. Grounded in live database state.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setQuery('');
          }}
          className="btn-secondary text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* 2. SUGGESTED PROMPTS */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-[#77766E] font-semibold">
          Recommended Queries:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs px-2.5 py-1 rounded-md bg-[#FCFAF6] hover:bg-[#F8F4ED] border border-[#E7E1D7] text-[#24251F] font-mono transition-colors"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* 3. CHAT MESSAGES FEED */}
      <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#E7EBDD] border border-[#D5CEBF] flex items-center justify-center text-[#35483A] shrink-0 mt-0.5">
                <BrainCircuit className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-xl space-y-2.5 rounded-xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#35483A] text-[#F8F4ED] ml-12'
                  : 'bg-[#F8F4ED] border border-[#E7E1D7] text-[#24251F]'
              }`}
            >
              <p>{msg.text}</p>

              {/* Supporting Metrics */}
              {msg.supportingMetrics && msg.supportingMetrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E7E1D7]">
                  {msg.supportingMetrics.map((met, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[#FCFAF6] border border-[#E7E1D7]">
                      <span className="text-[10px] text-[#77766E] font-mono block">{met.label}</span>
                      <span className="font-serif font-bold text-[#24251F] text-sm tabular-nums">{met.value}</span>
                      {met.trend && <span className="text-[10px] font-mono text-[#35483A] block">{met.trend}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Recommendation */}
              {msg.suggestedAction && (
                <div className="p-2.5 rounded-lg bg-[#EDE4D7] border border-[#D5CEBF] text-[11px] text-[#24251F]">
                  <span className="font-mono font-bold uppercase text-[10px] block text-[#35483A]">
                    Operational Action:
                  </span>
                  {msg.suggestedAction}
                </div>
              )}

              {/* Related Ticket Pills */}
              {msg.relatedTicketNumbers && msg.relatedTicketNumbers.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#77766E]">Referenced:</span>
                  {msg.relatedTicketNumbers.map((tid, idx) => (
                    <Link
                      key={idx}
                      href={`/staff/tickets`}
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EDE4D7] text-[#35483A] hover:underline"
                    >
                      {tid}
                    </Link>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-[#77766E] block text-right font-mono">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-[#EDE4D7] flex items-center justify-center text-[#24251F] shrink-0 mt-0.5 font-mono text-xs font-bold">
                U
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs font-mono text-[#77766E]">
            <div className="w-4 h-4 rounded-full border-2 border-[#35483A] border-t-transparent animate-spin" />
            <span>Campus Brain synthesizing authorized operational data...</span>
          </div>
        )}
      </div>

      {/* 4. QUERY INPUT */}
      <div className="relative">
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(query);
            }
          }}
          placeholder="Ask a question about ticket bottlenecks, building clusters, or department workload..."
          className="w-full p-3.5 pr-14 rounded-xl border border-[#E7E1D7] bg-[#FCFAF6] text-[#24251F] placeholder:text-[#77766E]/60 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-[#35483A]"
        />
        <button
          type="button"
          onClick={() => handleSend(query)}
          disabled={!query.trim() || isLoading}
          className="btn-primary absolute right-3 bottom-3 text-xs px-3 py-1.5"
        >
          <Send className="w-3.5 h-3.5 mr-1" />
          <span>Ask</span>
        </button>
      </div>
    </div>
  );
}
