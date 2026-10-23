'use client';

import { 
  Ticket, 
  TicketStatus, 
  Priority, 
  Category, 
  DuplicateCandidate, 
  RecurrenceInsight, 
  NotificationItem, 
  TicketEvent, 
  ResolutionAssessment,
  TicketAttachment
} from '../types';
import { 
  INITIAL_TICKETS, 
  INITIAL_DUPLICATES, 
  INITIAL_RECURRENCE_INSIGHTS, 
  INITIAL_NOTIFICATIONS 
} from './initial-data';
import { SLA_HOURS_MATRIX, DEPARTMENT_MAPPINGS } from '../constants';

const STORAGE_KEYS = {
  TICKETS: 'campusconnect_tickets_v1',
  DUPLICATES: 'campusconnect_duplicates_v1',
  RECURRENCE: 'campusconnect_recurrence_v1',
  NOTIFICATIONS: 'campusconnect_notifications_v1',
  CURRENT_USER_ROLE: 'campusconnect_user_role_v1',
};

// Memory fallback for SSR
let memoryTickets: Ticket[] = [...INITIAL_TICKETS];
let memoryDuplicates: DuplicateCandidate[] = [...INITIAL_DUPLICATES];
let memoryRecurrence: RecurrenceInsight[] = [...INITIAL_RECURRENCE_INSIGHTS];
let memoryNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getTickets(): Ticket[] {
  if (!isBrowser()) return memoryTickets;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return memoryTickets;
  }
}

export function saveTickets(tickets: Ticket[]): void {
  memoryTickets = tickets;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
      window.dispatchEvent(new Event('campusconnect_state_change'));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }
}

export function getTicketById(id: string): Ticket | undefined {
  const tickets = getTickets();
  return tickets.find(t => t.id === id || t.ticketNumber === id);
}

export function createTicket(params: {
  title: string;
  originalDescription: string;
  aiSummary: string;
  category: Category;
  department?: string;
  building: string;
  floor?: number | string;
  room?: string;
  priority: Priority;
  studentId: string;
  studentName: string;
  studentEmail: string;
  imageUrl?: string;
}): Ticket {
  const tickets = getTickets();
  const nextNum = 1050 + tickets.length;
  const ticketNumber = `CAMPUS-${nextNum}`;
  const now = new Date().toISOString();
  
  const category = params.category;
  const priority = params.priority;
  const slaTarget = SLA_HOURS_MATRIX[category]?.[priority] || 24;
  const deadline = new Date(Date.now() + slaTarget * 3600 * 1000).toISOString();
  const department = params.department || DEPARTMENT_MAPPINGS[category] || 'Campus Operations';

  const ticketId = `ticket-${Date.now()}`;
  
  const attachments: TicketAttachment[] = [];
  if (params.imageUrl) {
    attachments.push({
      id: `att-${Date.now()}`,
      ticketId,
      type: 'complaint_photo',
      url: params.imageUrl,
      fileName: 'complaint_photo.jpg',
      uploaderId: params.studentId,
      uploaderName: params.studentName,
      createdAt: now,
    });
  }

  const events: TicketEvent[] = [
    {
      id: `ev-${Date.now()}-1`,
      ticketId,
      actorId: params.studentId,
      actorName: params.studentName,
      actorRole: 'student',
      eventType: 'created',
      message: 'Complaint submitted by student with details and location.',
      isInternal: false,
      createdAt: now,
    },
    {
      id: `ev-${Date.now()}-2`,
      ticketId,
      actorId: 'system-ai',
      actorName: 'Gemini Operations Intelligence',
      actorRole: 'admin',
      eventType: 'ai_analyzed',
      message: `Categorized as ${category.toUpperCase()} (${priority.toUpperCase()}). Auto-routed to ${department}.`,
      isInternal: false,
      createdAt: new Date(Date.now() + 500).toISOString(),
    }
  ];

  const newTicket: Ticket = {
    id: ticketId,
    ticketNumber,
    studentId: params.studentId,
    studentName: params.studentName,
    studentEmail: params.studentEmail,
    title: params.title,
    originalDescription: params.originalDescription,
    aiSummary: params.aiSummary,
    category,
    department,
    building: params.building,
    floor: params.floor,
    room: params.room,
    priority,
    status: 'open',
    slaTargetHours: slaTarget,
    slaDeadline: deadline,
    createdAt: now,
    updatedAt: now,
    isOverdue: false,
    attachments,
    events,
  };

  const updatedTickets = [newTicket, ...tickets];
  saveTickets(updatedTickets);

  // Check for duplicate candidates in same building & category
  checkForDuplicates(newTicket, tickets);

  // Add notification for staff
  addNotification({
    recipientId: 'all_staff',
    ticketId: newTicket.id,
    ticketNumber: newTicket.ticketNumber,
    title: `New ${priority.toUpperCase()} Ticket Filed`,
    message: `${newTicket.ticketNumber}: ${newTicket.title} at ${newTicket.building}`,
    type: 'ticket_created',
  });

  return newTicket;
}

export function updateTicketStatus(ticketId: string, newStatus: TicketStatus, actorName = 'Staff Member', actorRole: 'staff' | 'admin' | 'student' = 'staff', note?: string): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return undefined;

  const ticket = tickets[index];
  const oldStatus = ticket.status;
  if (oldStatus === newStatus) return ticket;

  const now = new Date().toISOString();
  const updatedTicket: Ticket = {
    ...ticket,
    status: newStatus,
    updatedAt: now,
    resolvedAt: newStatus === 'resolved' ? now : ticket.resolvedAt,
    closedAt: newStatus === 'closed' ? now : ticket.closedAt,
  };

  const newEvent: TicketEvent = {
    id: `ev-${Date.now()}`,
    ticketId: ticket.id,
    actorId: 'user-id',
    actorName,
    actorRole,
    eventType: 'status_changed',
    previousValue: oldStatus,
    newValue: newStatus,
    message: note || `Status transitioned from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}.`,
    isInternal: false,
    createdAt: now,
  };

  updatedTicket.events = [...(updatedTicket.events || []), newEvent];
  tickets[index] = updatedTicket;
  saveTickets(tickets);

  // Notify student
  addNotification({
    recipientId: ticket.studentId,
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: `Ticket ${newStatus.toUpperCase()}`,
    message: `Your ticket ${ticket.ticketNumber} is now ${newStatus.replace('_', ' ')}.`,
    type: 'status_update',
  });

  return updatedTicket;
}

export function assignStaffToTicket(ticketId: string, staffId: string, staffName: string, actorName = 'Dispatcher'): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return undefined;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  const updatedTicket: Ticket = {
    ...ticket,
    assignedStaffId: staffId,
    assignedStaffName: staffName,
    assignedAt: now,
    status: ticket.status === 'open' ? 'assigned' : ticket.status,
    updatedAt: now,
  };

  const newEvent: TicketEvent = {
    id: `ev-${Date.now()}`,
    ticketId: ticket.id,
    actorId: 'dispatcher-id',
    actorName,
    actorRole: 'admin',
    eventType: 'assigned',
    newValue: staffName,
    message: `Assigned technician ${staffName} to ticket.`,
    isInternal: false,
    createdAt: now,
  };

  updatedTicket.events = [...(updatedTicket.events || []), newEvent];
  tickets[index] = updatedTicket;
  saveTickets(tickets);

  addNotification({
    recipientId: ticket.studentId,
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: 'Technician Assigned',
    message: `${staffName} has been assigned to work on your request.`,
    type: 'assigned',
  });

  return updatedTicket;
}

export function addTicketResolutionEvidence(ticketId: string, params: {
  imageUrl: string;
  uploaderName: string;
  uploaderId: string;
  assessment?: ResolutionAssessment;
}): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return undefined;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  const newAttachment: TicketAttachment = {
    id: `att-res-${Date.now()}`,
    ticketId: ticket.id,
    type: 'resolution_evidence',
    url: params.imageUrl,
    fileName: 'proof_of_fix.jpg',
    uploaderId: params.uploaderId,
    uploaderName: params.uploaderName,
    createdAt: now,
  };

  const updatedTicket: Ticket = {
    ...ticket,
    status: 'resolved',
    resolvedAt: now,
    updatedAt: now,
    attachments: [...ticket.attachments, newAttachment],
    resolutionAssessment: params.assessment,
  };

  const newEvent: TicketEvent = {
    id: `ev-res-${Date.now()}`,
    ticketId: ticket.id,
    actorId: params.uploaderId,
    actorName: params.uploaderName,
    actorRole: 'staff',
    eventType: 'evidence_uploaded',
    message: `Proof-of-Fix evidence uploaded. AI assessment: ${params.assessment?.verdict || 'Awaiting student confirmation'}.`,
    isInternal: false,
    createdAt: now,
  };

  updatedTicket.events = [...(updatedTicket.events || []), newEvent];
  tickets[index] = updatedTicket;
  saveTickets(tickets);

  addNotification({
    recipientId: ticket.studentId,
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: 'Repair Complete: Please Confirm',
    message: `Technician ${params.uploaderName} uploaded Proof-of-Fix evidence for ${ticket.ticketNumber}. Please verify the fix.`,
    type: 'evidence_ready',
  });

  return updatedTicket;
}

export function confirmTicketResolution(ticketId: string, rating: number, feedback?: string): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return undefined;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  const updatedTicket: Ticket = {
    ...ticket,
    status: 'closed',
    closedAt: now,
    studentRating: rating,
    studentFeedback: feedback,
    updatedAt: now,
  };

  const newEvent: TicketEvent = {
    id: `ev-confirm-${Date.now()}`,
    ticketId: ticket.id,
    actorId: ticket.studentId,
    actorName: ticket.studentName,
    actorRole: 'student',
    eventType: 'student_confirmed',
    message: `Student verified resolution (${rating}/5 stars). Feedback: ${feedback || 'Resolution confirmed.'}`,
    isInternal: false,
    createdAt: now,
  };

  updatedTicket.events = [...(updatedTicket.events || []), newEvent];
  tickets[index] = updatedTicket;
  saveTickets(tickets);

  return updatedTicket;
}

export function reopenTicket(ticketId: string, reason: string): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return undefined;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  const updatedTicket: Ticket = {
    ...ticket,
    status: 'reopened',
    priority: 'urgent', // auto-escalate reopened tickets
    updatedAt: now,
  };

  const newEvent: TicketEvent = {
    id: `ev-reopen-${Date.now()}`,
    ticketId: ticket.id,
    actorId: ticket.studentId,
    actorName: ticket.studentName,
    actorRole: 'student',
    eventType: 'reopened',
    message: `Student reported issue persists: "${reason}". Priority escalated to Urgent.`,
    isInternal: false,
    createdAt: now,
  };

  updatedTicket.events = [...(updatedTicket.events || []), newEvent];
  tickets[index] = updatedTicket;
  saveTickets(tickets);

  addNotification({
    recipientId: 'all_staff',
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: 'Ticket Reopened by Student',
    message: `${ticket.ticketNumber} was reopened: "${reason}"`,
    type: 'reopened',
  });

  return updatedTicket;
}

export function addTicketNote(ticketId: string, note: string, authorName: string, isInternal: boolean): Ticket | undefined {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return undefined;

  const ticket = tickets[index];
  const now = new Date().toISOString();

  const newEvent: TicketEvent = {
    id: `ev-note-${Date.now()}`,
    ticketId: ticket.id,
    actorId: 'author-id',
    actorName: authorName,
    actorRole: 'staff',
    eventType: 'note_added',
    message: note,
    isInternal,
    createdAt: now,
  };

  const updatedTicket: Ticket = {
    ...ticket,
    updatedAt: now,
    events: [...(ticket.events || []), newEvent],
  };

  tickets[index] = updatedTicket;
  saveTickets(tickets);
  return updatedTicket;
}

// Duplicate Detection & Review
export function getDuplicates(): DuplicateCandidate[] {
  if (!isBrowser()) return memoryDuplicates;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DUPLICATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DUPLICATES, JSON.stringify(INITIAL_DUPLICATES));
      return INITIAL_DUPLICATES;
    }
    return JSON.parse(raw);
  } catch {
    return memoryDuplicates;
  }
}

export function saveDuplicates(duplicates: DuplicateCandidate[]): void {
  memoryDuplicates = duplicates;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.DUPLICATES, JSON.stringify(duplicates));
      window.dispatchEvent(new Event('campusconnect_state_change'));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }
}

export function resolveDuplicateReview(duplicateId: string, decision: 'confirmed_duplicate' | 'marked_separate', reviewerName = 'Operations Staff', note?: string) {
  const duplicates = getDuplicates();
  const item = duplicates.find(d => d.id === duplicateId);
  if (!item) return;

  item.status = decision;
  item.reviewedBy = reviewerName;
  item.reviewedAt = new Date().toISOString();
  item.reviewNotes = note || (decision === 'confirmed_duplicate' ? 'Linked as duplicate incident.' : 'Confirmed as independent distinct incident.');

  saveDuplicates(duplicates);

  if (decision === 'confirmed_duplicate') {
    // link source ticket to candidate ticket
    const tickets = getTickets();
    const sourceIdx = tickets.findIndex(t => t.id === item.sourceTicketId);
    if (sourceIdx !== -1) {
      tickets[sourceIdx].isDuplicateOf = item.candidateTicketId;
      tickets[sourceIdx].events.push({
        id: `ev-dup-${Date.now()}`,
        ticketId: tickets[sourceIdx].id,
        actorId: 'reviewer',
        actorName: reviewerName,
        actorRole: 'staff',
        eventType: 'duplicate_linked',
        message: `Linked as duplicate of ${item.candidateTicket.ticketNumber}.`,
        isInternal: true,
        createdAt: new Date().toISOString(),
      });
      saveTickets(tickets);
    }
  }
}

function checkForDuplicates(newTicket: Ticket, existingTickets: Ticket[]): void {
  const candidates: DuplicateCandidate[] = [];
  const currentDuplicates = getDuplicates();

  for (const existing of existingTickets) {
    if (existing.id === newTicket.id) continue;
    if (existing.status === 'closed') continue;

    let score = 0;
    const signals: string[] = [];

    if (existing.building.toLowerCase() === newTicket.building.toLowerCase()) {
      score += 35;
      signals.push(`Matching Building: ${newTicket.building}`);
    }

    if (existing.category === newTicket.category) {
      score += 25;
      signals.push(`Matching Category: ${newTicket.category}`);
    }

    if (newTicket.floor && existing.floor && String(newTicket.floor) === String(existing.floor)) {
      score += 20;
      signals.push(`Same Floor: Level ${newTicket.floor}`);
    }

    if (newTicket.room && existing.room && newTicket.room.toLowerCase() === existing.room.toLowerCase()) {
      score += 20;
      signals.push(`Same Room/Area: ${newTicket.room}`);
    }

    // Time window within 24 hours
    const timeDiffHours = Math.abs(new Date(newTicket.createdAt).getTime() - new Date(existing.createdAt).getTime()) / (1000 * 3600);
    if (timeDiffHours <= 12) {
      score += 15;
      signals.push(`Reported within ${Math.round(timeDiffHours)} hours`);
    }

    // Text token overlap
    const newWords = new Set(newTicket.title.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const existWords = existing.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const common = existWords.filter(w => newWords.has(w));
    if (common.length >= 2) {
      score += 15;
      signals.push(`Shared keywords: ${common.slice(0, 3).join(', ')}`);
    }

    const finalScore = Math.min(score, 98);

    if (finalScore >= 65) {
      candidates.push({
        id: `dup-${Date.now()}-${existing.id}`,
        sourceTicketId: newTicket.id,
        candidateTicketId: existing.id,
        candidateTicket: existing,
        similarityScore: finalScore,
        matchSignals: signals,
        status: 'pending',
      });
    }
  }

  if (candidates.length > 0) {
    saveDuplicates([...candidates, ...currentDuplicates]);
  }
}

// Recurrence Radar
export function getRecurrenceInsights(): RecurrenceInsight[] {
  if (!isBrowser()) return memoryRecurrence;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECURRENCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RECURRENCE, JSON.stringify(INITIAL_RECURRENCE_INSIGHTS));
      return INITIAL_RECURRENCE_INSIGHTS;
    }
    return JSON.parse(raw);
  } catch {
    return memoryRecurrence;
  }
}

// Notifications
export function getNotifications(): NotificationItem[] {
  if (!isBrowser()) return memoryNotifications;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return memoryNotifications;
  }
}

export function addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): void {
  const notifs = getNotifications();
  const newItem: NotificationItem = {
    id: `notif-${Date.now()}`,
    ...item,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...notifs];
  memoryNotifications = updated;
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      window.dispatchEvent(new Event('campusconnect_state_change'));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }
}

export function markNotificationAsRead(id: string): void {
  const notifs = getNotifications();
  const item = notifs.find(n => n.id === id);
  if (item) {
    item.isRead = true;
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      window.dispatchEvent(new Event('campusconnect_state_change'));
    }
  }
}

export function markAllNotificationsAsRead(): void {
  const notifs = getNotifications().map(n => ({ ...n, isRead: true }));
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('campusconnect_state_change'));
  }
}

// Reset everything to pure demo state
export function resetToDemoData(): void {
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(STORAGE_KEYS.DUPLICATES, JSON.stringify(INITIAL_DUPLICATES));
    localStorage.setItem(STORAGE_KEYS.RECURRENCE, JSON.stringify(INITIAL_RECURRENCE_INSIGHTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    window.dispatchEvent(new Event('campusconnect_state_change'));
  }
  memoryTickets = [...INITIAL_TICKETS];
  memoryDuplicates = [...INITIAL_DUPLICATES];
  memoryRecurrence = [...INITIAL_RECURRENCE_INSIGHTS];
  memoryNotifications = [...INITIAL_NOTIFICATIONS];
}
