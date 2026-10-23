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
} from '../models/types';
import { 
  INITIAL_TICKETS, 
  INITIAL_DUPLICATES, 
  INITIAL_RECURRENCE_INSIGHTS, 
  INITIAL_NOTIFICATIONS 
} from './initial-data';
import { SLA_HOURS_MATRIX, DEPARTMENT_MAPPINGS } from '../constants';

// In-Memory Database Store for Node.js Backend Server
let tickets: Ticket[] = [...INITIAL_TICKETS];
let duplicates: DuplicateCandidate[] = [...INITIAL_DUPLICATES];
let recurrenceInsights: RecurrenceInsight[] = [...INITIAL_RECURRENCE_INSIGHTS];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

export const getTickets = (): Ticket[] => [...tickets];

export const getTicketById = (id: string): Ticket | undefined => {
  return tickets.find(t => t.id === id || t.ticketNumber === id);
};

export const createTicket = (payload: {
  title: string;
  originalDescription: string;
  aiSummary: string;
  category: Category;
  building: string;
  floor?: number | string;
  room?: string;
  priority: Priority;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  imageUrl?: string;
}): Ticket => {
  const count = tickets.length + 1045;
  const ticketNumber = `CAMPUS-${count}`;
  const id = `ticket-${Date.now()}`;
  const now = new Date().toISOString();

  const slaTarget = SLA_HOURS_MATRIX[payload.category]?.[payload.priority] || 4;
  const deadline = new Date(Date.now() + slaTarget * 3600 * 1000).toISOString();
  const department = DEPARTMENT_MAPPINGS[payload.category] || 'Campus Operations';

  const attachments: TicketAttachment[] = payload.imageUrl ? [
    {
      id: `att-${Date.now()}`,
      ticketId: id,
      url: payload.imageUrl,
      fileName: 'complaint_photo.jpg',
      type: 'complaint_photo',
      uploaderId: payload.studentId,
      uploaderName: payload.studentName,
      createdAt: now,
    }
  ] : [];

  const events: TicketEvent[] = [
    {
      id: `event-${Date.now()}-1`,
      ticketId: id,
      eventType: 'created',
      createdAt: now,
      actorRole: 'student',
      actorName: payload.studentName,
      actorId: payload.studentId,
      message: 'Ticket submitted via CampusConnect Intake Protocol with AI reasoning and verification.',
      isInternal: false,
    }
  ];

  const newTicket: Ticket = {
    id,
    ticketNumber,
    studentId: payload.studentId,
    studentName: payload.studentName,
    studentEmail: payload.studentEmail || `${payload.studentId}@campus.edu`,
    title: payload.title,
    originalDescription: payload.originalDescription,
    aiSummary: payload.aiSummary,
    category: payload.category,
    department,
    building: payload.building,
    floor: payload.floor,
    room: payload.room || 'General Area',
    priority: payload.priority,
    status: 'open',
    slaTargetHours: slaTarget,
    slaDeadline: deadline,
    createdAt: now,
    updatedAt: now,
    isOverdue: false,
    events,
    attachments,
  };

  tickets.unshift(newTicket);
  return newTicket;
};

export const updateTicketStatus = (
  id: string, 
  status: TicketStatus, 
  actorName: string = 'Staff Member', 
  actorRole: 'staff' | 'admin' | 'student' = 'staff',
  notes?: string
): Ticket | null => {
  const index = tickets.findIndex(t => t.id === id || t.ticketNumber === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = tickets[index];

  const updated: Ticket = {
    ...current,
    status,
    updatedAt: now,
    resolvedAt: status === 'resolved' || status === 'closed' ? now : current.resolvedAt,
    closedAt: status === 'closed' ? now : current.closedAt,
    events: [
      ...(current.events || []),
      {
        id: `event-${Date.now()}`,
        ticketId: current.id,
        eventType: 'status_changed',
        createdAt: now,
        actorRole,
        actorName,
        actorId: 'staff-user',
        previousValue: current.status,
        newValue: status,
        message: notes || `Operational status transitioned to ${status.toUpperCase()}`,
        isInternal: false,
      }
    ]
  };

  tickets[index] = updated;
  return updated;
};

export const assignTicket = (
  ticketId: string, 
  staffId: string, 
  staffName: string, 
  assignedBy: string = 'Operations Lead'
): Ticket | null => {
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = tickets[index];

  const updated: Ticket = {
    ...current,
    status: current.status === 'open' ? 'assigned' : current.status,
    assignedStaffId: staffId,
    assignedStaffName: staffName,
    assignedAt: now,
    updatedAt: now,
    events: [
      ...(current.events || []),
      {
        id: `event-${Date.now()}`,
        ticketId: current.id,
        eventType: 'status_changed',
        createdAt: now,
        actorRole: 'staff',
        actorName: assignedBy,
        actorId: staffId,
        previousValue: current.status,
        newValue: 'assigned',
        message: `Dispatched to certified technician: ${staffName}`,
        isInternal: false,
      }
    ]
  };

  tickets[index] = updated;
  return updated;
};

export const verifyTicketProofOfFix = (
  ticketId: string,
  assessment: ResolutionAssessment,
  technicianNotes: string,
  postRepairImageUrl: string
): Ticket | null => {
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = tickets[index];

  const updated: Ticket = {
    ...current,
    status: 'resolved',
    resolutionAssessment: assessment,
    updatedAt: now,
    events: [
      ...(current.events || []),
      {
        id: `event-${Date.now()}`,
        ticketId: current.id,
        eventType: 'evidence_uploaded',
        createdAt: now,
        actorRole: 'staff',
        actorName: current.assignedStaffName || 'Assigned Technician',
        actorId: current.assignedStaffId || 'staff-1',
        message: `Proof-of-Fix evidence uploaded. AI assessment score: ${assessment.verdict}. ${technicianNotes}`,
        isInternal: false,
      }
    ],
    attachments: [
      ...(current.attachments || []),
      {
        id: `att-${Date.now()}`,
        ticketId: current.id,
        url: postRepairImageUrl,
        fileName: 'resolution_evidence.jpg',
        type: 'resolution_evidence',
        uploaderId: current.assignedStaffId || 'staff-1',
        uploaderName: current.assignedStaffName || 'Field Technician',
        createdAt: now,
      }
    ]
  };

  tickets[index] = updated;
  return updated;
};

export const rateTicket = (
  ticketId: string,
  rating: number,
  feedback?: string,
  confirmed: boolean = true
): Ticket | null => {
  const index = tickets.findIndex(t => t.id === ticketId || t.ticketNumber === ticketId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const current = tickets[index];

  const updated: Ticket = {
    ...current,
    studentRating: rating,
    studentFeedback: feedback,
    status: confirmed ? 'closed' : 'reopened',
    closedAt: confirmed ? now : undefined,
    updatedAt: now,
    events: [
      ...(current.events || []),
      {
        id: `event-${Date.now()}`,
        ticketId: current.id,
        eventType: 'status_changed',
        createdAt: now,
        actorRole: 'student',
        actorName: current.studentName,
        actorId: current.studentId,
        previousValue: current.status,
        newValue: confirmed ? 'closed' : 'reopened',
        message: confirmed 
          ? `Student verified physical fix with ${rating}-star rating: "${feedback || 'No comments'}"`
          : `Student rejected fix; ticket reopened: "${feedback || 'Issue persists'}"`,
        isInternal: false,
      }
    ]
  };

  tickets[index] = updated;
  return updated;
};

export const getDuplicates = (): DuplicateCandidate[] => [...duplicates];

export const linkDuplicateTickets = (
  duplicateId: string,
  primaryTicketId: string,
  staffName: string = 'Supervisor'
): boolean => {
  const index = duplicates.findIndex(d => d.id === duplicateId);
  if (index === -1) return false;

  duplicates[index].status = 'confirmed_duplicate';
  duplicates[index].reviewedBy = staffName;
  duplicates[index].reviewedAt = new Date().toISOString();
  return true;
};

export const dismissDuplicate = (duplicateId: string): boolean => {
  const index = duplicates.findIndex(d => d.id === duplicateId);
  if (index === -1) return false;

  duplicates[index].status = 'marked_separate';
  duplicates[index].reviewedAt = new Date().toISOString();
  return true;
};

export const getRecurrenceInsights = (): RecurrenceInsight[] => [...recurrenceInsights];

export const getNotifications = (): NotificationItem[] => [...notifications];

export const markNotificationRead = (id: string): void => {
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.isRead = true;
};

export const resetStoreToDemo = (): void => {
  tickets = [...INITIAL_TICKETS];
  duplicates = [...INITIAL_DUPLICATES];
  recurrenceInsights = [...INITIAL_RECURRENCE_INSIGHTS];
  notifications = [...INITIAL_NOTIFICATIONS];
};
