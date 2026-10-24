'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Archive, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  HelpCircle, 
  TrendingUp, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  getAllKnowledgeEntries, 
  getKnowledgeGaps, 
  saveKnowledgeEntry, 
} from '@/lib/data/campus-knowledge-base';
import { 
  CampusKnowledgeEntry, 
  KnowledgeGap, 
  CampusKnowledgeCategory,
  KnowledgeAudience
} from '@/lib/types';

export default function StaffKnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<'entries' | 'gaps'>('entries');
  const [entries, setEntries] = useState<CampusKnowledgeEntry[]>(() => getAllKnowledgeEntries());
  const [gaps, setGaps] = useState<KnowledgeGap[]>(() => getKnowledgeGaps());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyStale, setOnlyStale] = useState(false);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<CampusKnowledgeEntry>>({
    title: '',
    slug: '',
    category: 'hostel_rules',
    summary: '',
    content: '',
    ownerDepartment: 'Hostel Administration',
    contactEmail: 'warden-tagore@campus.edu',
    contactPhone: '+91-11-2700-1010',
    officeLocation: 'Tagore Block C Room 101',
    sourceLink: 'https://campus.edu/handbook',
    audience: 'students',
    status: 'published',
    effectiveFrom: new Date().toISOString().split('T')[0],
    lastReviewedAt: new Date().toISOString(),
    tags: [],
  });

  const filteredEntries = entries.filter(e => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
    if (onlyStale && !e.isStale && (Date.now() - new Date(e.lastReviewedAt).getTime()) <= 180 * 24 * 3600 * 1000) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || 
             e.summary.toLowerCase().includes(q) || 
             e.ownerDepartment.toLowerCase().includes(q) ||
             e.tags.some((t: string) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleOpenCreateModal = (gapTopic?: string, suggestedDept?: string) => {
    setEditingEntry({
      id: `kb-custom-${Date.now()}`,
      title: gapTopic || '',
      slug: (gapTopic || 'new-entry').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'faqs',
      summary: '',
      content: '',
      ownerDepartment: suggestedDept || 'Dean of Student Affairs',
      contactEmail: 'dosa@campus.edu',
      contactPhone: '+91-11-2700-1020',
      officeLocation: 'Admin Block Room 204',
      sourceLink: 'https://campus.edu/policy',
      audience: 'students',
      status: 'published',
      effectiveFrom: new Date().toISOString().split('T')[0],
      lastReviewedAt: new Date().toISOString(),
      tags: gapTopic ? gapTopic.toLowerCase().split(/\s+/).slice(0, 4) : ['policy'],
      helpfulCount: 0,
      unhelpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: CampusKnowledgeEntry) => {
    setEditingEntry({ ...entry });
    setIsModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry.title || !editingEntry.content) {
      alert('Title and Content are required.');
      return;
    }

    const saved = saveKnowledgeEntry(editingEntry as CampusKnowledgeEntry);
    setEntries(getAllKnowledgeEntries());
    setIsModalOpen(false);
  };

  const handleToggleStatus = (entry: CampusKnowledgeEntry, newStatus: 'published' | 'draft' | 'archived') => {
    saveKnowledgeEntry({ ...entry, status: newStatus });
    setEntries(getAllKnowledgeEntries());
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-mono font-medium tracking-wide mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Operations Knowledge Governance
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Campus Knowledge Base & Intelligence Gaps
          </h1>
          <p className="text-sm text-muted-ink max-w-2xl mt-1">
            Maintain verified regulations, hostel protocols, and facility directories. Log and address unanswered student questions with one-click policy creation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCreateModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-card hover:bg-forest/90 font-mono text-xs font-semibold tracking-wider transition-all self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Knowledge Entry
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border-subtle text-sm font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('entries')}
          className={`pb-3 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'entries'
              ? 'border-forest text-forest'
              : 'border-transparent text-muted-ink hover:text-ink'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Published Knowledge Entries ({entries.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gaps')}
          className={`pb-3 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'gaps'
              ? 'border-forest text-forest'
              : 'border-transparent text-muted-ink hover:text-ink'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Unanswered Gaps & Feedback ({gaps.length})
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE ENTRIES */}
      {activeTab === 'entries' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card p-4 rounded-xl border border-border-subtle shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-ink" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search knowledge..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border-subtle bg-ivory focus:bg-card focus:outline-none focus:ring-1 focus:ring-forest text-ink"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-border-subtle bg-ivory text-ink focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="hostel_rules">Hostel Rules & Policies</option>
              <option value="services">College Services & Admin</option>
              <option value="facilities">Facilities & Amenities</option>
              <option value="department_directory">Department Directory</option>
              <option value="events">Campus Events</option>
              <option value="faqs">Technical FAQs & Self-Help</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-border-subtle bg-ivory text-ink focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <label className="flex items-center gap-2 text-xs font-mono text-ink cursor-pointer px-2">
              <input
                type="checkbox"
                checked={onlyStale}
                onChange={e => setOnlyStale(e.target.checked)}
                className="rounded text-forest focus:ring-forest"
              />
              Show Only Stale (&gt;6 Months)
            </label>
          </div>

          {/* Entries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map(entry => {
              const isStale = Boolean(entry.isStale || (Date.now() - new Date(entry.lastReviewedAt).getTime()) > 180 * 24 * 3600 * 1000);
              return (
                <div
                  key={entry.id}
                  className={`border rounded-2xl p-5 bg-card space-y-4 shadow-sm flex flex-col justify-between ${
                    isStale ? 'border-amber/40 bg-amber/5' : 'border-border-subtle'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-forest/10 border border-forest/20 text-forest uppercase tracking-wider font-semibold">
                        {entry.category.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                          entry.status === 'published' ? 'bg-forest/15 text-forest' : 'bg-muted-ink/15 text-muted-ink'
                        }`}>
                          {entry.status}
                        </span>
                        {isStale && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber/20 text-amber font-bold border border-amber/30">
                            Stale (&gt;180d)
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-ink leading-snug">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-muted-ink line-clamp-2">
                      {entry.summary || entry.content}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border-subtle/80 text-xs text-muted-ink font-mono">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-forest" />
                        {entry.ownerDepartment}
                      </span>
                      <span>Rev: {new Date(entry.lastReviewedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span>👍 {entry.helpfulCount}</span>
                        <span>👎 {entry.unhelpfulCount}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(entry)}
                          className="px-2.5 py-1 rounded bg-ivory border border-border-subtle hover:border-forest/40 text-ink text-xs flex items-center gap-1 font-semibold"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        {entry.status === 'published' ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(entry, 'archived')}
                            className="px-2.5 py-1 rounded bg-ivory border border-border-subtle hover:text-rust text-muted-ink text-xs font-semibold"
                          >
                            Archive
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(entry, 'published')}
                            className="px-2.5 py-1 rounded bg-forest text-card text-xs font-semibold"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE GAPS */}
      {activeTab === 'gaps' && (
        <div className="space-y-6">
          <div className="border border-border-subtle bg-ivory p-4 rounded-xl text-xs space-y-1">
            <p className="font-bold text-ink uppercase tracking-wider font-mono">Real-Time Knowledge Gap Mining</p>
            <p className="text-muted-ink">
              These topics represent unanswered questions or negative student feedback received by the Campus Assistant. Click "Create Knowledge Entry" to resolve a gap and immediately train the assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {gaps.map(gap => (
              <div
                key={gap.id}
                className="border border-border-subtle bg-card rounded-2xl p-6 shadow-sm space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rust/10 text-rust font-bold uppercase">
                      {gap.count} Inquiries
                    </span>
                    <span className="text-[11px] font-mono text-muted-ink">
                      Target Dept: {gap.suggestedDepartment}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ink">
                    {gap.normalizedTopic}
                  </h3>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-muted-ink uppercase">Sample Student Questions:</span>
                    <ul className="text-xs text-muted-ink space-y-0.5 italic">
                      {gap.sampleQuestions.map((sq: string, sqIdx: number) => (
                        <li key={sqIdx}>• "{sq}"</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal(gap.normalizedTopic, gap.suggestedDepartment)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-card hover:bg-forest/90 font-mono text-xs font-semibold tracking-wider transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Entry
                  </button>
                  <span className="text-[11px] font-mono text-muted-ink">
                    {gap.thumbsDownCount} thumbs-down
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h2 className="font-serif text-xl font-bold text-ink">
                {editingEntry.id?.startsWith('kb-custom') ? 'Create New Knowledge Entry' : 'Edit Knowledge Entry'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-ink hover:text-ink rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">Document Title</label>
                <input
                  type="text"
                  required
                  value={editingEntry.title || ''}
                  onChange={e => setEditingEntry({ ...editingEntry, title: e.target.value })}
                  placeholder="e.g. Drone Flying and Photography Regulations"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink focus:bg-card focus:outline-none focus:ring-1 focus:ring-forest text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">Category</label>
                  <select
                    value={editingEntry.category || 'hostel_rules'}
                    onChange={e => setEditingEntry({ ...editingEntry, category: e.target.value as CampusKnowledgeCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink text-xs focus:outline-none"
                  >
                    <option value="hostel_rules">Hostel Rules & Policies</option>
                    <option value="services">College Services & Admin</option>
                    <option value="facilities">Facilities & Amenities</option>
                    <option value="department_directory">Department Directory</option>
                    <option value="events">Campus Events</option>
                    <option value="faqs">Technical FAQs & Self-Help</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">Audience</label>
                  <select
                    value={editingEntry.audience || 'students'}
                    onChange={e => setEditingEntry({ ...editingEntry, audience: e.target.value as KnowledgeAudience })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink text-xs focus:outline-none"
                  >
                    <option value="all">All Campus Members</option>
                    <option value="students">General Students</option>
                    <option value="hostel_residents">Hostel Residents Only</option>
                    <option value="staff">Staff Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">One-Sentence Summary</label>
                <input
                  type="text"
                  value={editingEntry.summary || ''}
                  onChange={e => setEditingEntry({ ...editingEntry, summary: e.target.value })}
                  placeholder="Concise summary shown in search results..."
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">Official Policy Content (Full Text)</label>
                <textarea
                  rows={6}
                  required
                  value={editingEntry.content || ''}
                  onChange={e => setEditingEntry({ ...editingEntry, content: e.target.value })}
                  placeholder="Enter detailed rules, procedure steps, required documents, and regulations..."
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink text-xs focus:bg-card focus:outline-none focus:ring-1 focus:ring-forest leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">Owner Department</label>
                  <input
                    type="text"
                    value={editingEntry.ownerDepartment || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, ownerDepartment: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase text-muted-ink font-semibold">Contact Email</label>
                  <input
                    type="email"
                    value={editingEntry.contactEmail || ''}
                    onChange={e => setEditingEntry({ ...editingEntry, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-ivory text-ink text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-ivory border border-border-subtle text-muted-ink hover:text-ink text-xs font-mono font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-forest text-card hover:bg-forest/90 text-xs font-mono font-semibold tracking-wider transition-colors shadow-sm"
                >
                  Save & Publish Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
