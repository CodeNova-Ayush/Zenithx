import { z } from 'zod';

export const CategoryEnum = z.enum(['plumbing', 'electricity', 'cleanliness', 'internet']);
export type Category = z.infer<typeof CategoryEnum>;

export const PriorityEnum = z.enum(['low', 'normal', 'high', 'urgent']);
export type Priority = z.infer<typeof PriorityEnum>;

export const TicketStatusEnum = z.enum(['open', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened']);
export type TicketStatus = z.infer<typeof TicketStatusEnum>;

export const UserRoleEnum = z.enum(['student', 'staff', 'admin']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
}

export interface CampusLocation {
  id: string;
  building: string;
  buildingCode: string;
  floors: number[];
  rooms: string[];
  type: 'hostel' | 'academic' | 'library' | 'dining' | 'facility';
  coordinates: { x: number; y: number; z: number }; // 3D coordinates for Three.js
  mapPosition: { x: number; y: number }; // 2D percentage for SVG map
}

export interface TicketEvent {
  id: string;
  ticketId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  eventType: 
    | 'created'
    | 'ai_analyzed'
    | 'assigned'
    | 'status_changed'
    | 'priority_changed'
    | 'note_added'
    | 'evidence_uploaded'
    | 'resolution_verified'
    | 'student_confirmed'
    | 'reopened'
    | 'duplicate_linked';
  previousValue?: string;
  newValue?: string;
  message: string;
  isInternal: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  type: 'complaint_photo' | 'resolution_evidence';
  url: string;
  fileName: string;
  uploaderId: string;
  uploaderName: string;
  createdAt: string;
}

export interface ResolutionAssessment {
  summary: string;
  visibleChanges: string[];
  remainingConcerns: string[];
  evidenceLimitations: string[];
  verdict: 
    | 'Evidence appears consistent with resolution'
    | 'Evidence is inconclusive'
    | 'Possible unresolved issue'
    | 'Manual review required';
  confidenceScore: number; // 0 - 100
  evaluatedAt: string;
  isAiEvaluated: boolean;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "CAMPUS-1042"
  studentId: string;
  studentName: string;
  studentEmail: string;
  title: string;
  originalDescription: string;
  aiSummary: string;
  category: Category;
  department: string;
  building: string;
  floor?: number | string;
  room?: string;
  priority: Priority;
  status: TicketStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedAt?: string;
  slaTargetHours: number;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  isOverdue: boolean;
  attachments: TicketAttachment[];
  events: TicketEvent[];
  resolutionAssessment?: ResolutionAssessment;
  studentRating?: number;
  studentFeedback?: string;
  relatedIncidentId?: string;
  isDuplicateOf?: string;
}

export interface DuplicateCandidate {
  id: string;
  sourceTicketId: string;
  candidateTicketId: string;
  candidateTicket: Ticket;
  similarityScore: number; // 0 - 100
  matchSignals: string[];
  status: 'pending' | 'confirmed_duplicate' | 'marked_separate';
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  skills: Category[];
  activeWorkload: number;
  assignedBuilding?: string;
  isAvailable: boolean;
}

export interface RecurrenceInsight {
  id: string;
  title: string;
  building: string;
  category: Category;
  incidentCount: number;
  dateRange: string;
  supportingTicketIds: string[];
  severity: 'low' | 'medium' | 'high';
  aiObservation: string;
  suggestedAction: string;
  status: 'active' | 'inspected' | 'dismissed';
}

export interface NotificationItem {
  id: string;
  recipientId: string; // or 'all_staff', 'all_students'
  ticketId?: string;
  ticketNumber?: string;
  title: string;
  message: string;
  type: 'ticket_created' | 'status_update' | 'assigned' | 'evidence_ready' | 'resolved' | 'reopened' | 'sla_alert';
  isRead: boolean;
  createdAt: string;
}
