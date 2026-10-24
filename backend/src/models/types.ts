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
  isSafetyHazard?: boolean;
  safetyEscalationReason?: string;
  mediaRecord?: TicketMediaRecord;
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
  type: 'ticket_created' | 'status_update' | 'assigned' | 'evidence_ready' | 'resolved' | 'reopened' | 'sla_alert' | 'incident_linked' | 'incident_resolved' | 'safety_alert';
  isRead: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// 1. OUTAGE DETECTIVE TYPES
// ---------------------------------------------------------------------------
export type InfrastructureNodeType = 
  | 'water_source'
  | 'riser'
  | 'main_feeder'
  | 'distribution_board'
  | 'floor_circuit'
  | 'network_core'
  | 'building_switch'
  | 'floor_ap'
  | 'fixture_group'
  | 'room';

export interface InfrastructureNode {
  id: string;
  name: string;
  type: InfrastructureNodeType;
  category: Category;
  parentIds: string[];
  building: string;
  floor?: number | string;
  room?: string;
  description?: string;
  isActive: boolean;
}

export type IncidentStatus = 'proposed' | 'confirmed' | 'dismissed' | 'resolved';

export interface IncidentConfidenceFactors {
  ticketCount: number;
  distinctRoomsCount: number;
  distinctFloorsCount: number;
  timeWindowMinutes: number;
  confidenceScore: number; // 0 - 100
  factors: string[];
}

export interface ProbableIncident {
  id: string;
  incidentNumber: string; // e.g. "INC-2026-001"
  category: Category;
  title: string;
  sharedNodeId: string;
  sharedNodeName: string;
  sharedNodeType: InfrastructureNodeType;
  building: string;
  status: IncidentStatus;
  confidence: IncidentConfidenceFactors;
  memberTicketIds: string[];
  aiExplanation?: string;
  technicianWorkOrderDraft?: string;
  studentNotice?: string;
  workOrderAssignedTo?: string;
  assignedStaffName?: string;
  dismissalReason?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// ---------------------------------------------------------------------------
// 2. SHOW-ME REPORTING (VIDEO & VOICE) TYPES
// ---------------------------------------------------------------------------
export interface MediaAnalysisResult {
  transcriptOriginal: string;
  transcriptEnglish: string;
  detectedLanguage: string;
  visualObservations: string[];
  audioObservations: string[];
  suggestedCategory: Category;
  suggestedDepartment: string;
  extractedLocation: {
    building?: string;
    floor?: string;
    room?: string;
  };
  missingInformation: string;
  followUpQuestion: string;
  suggestedPriority: Priority;
  safetyConcerns: string[];
  isSafetyHazard: boolean;
  uncertaintyNotes: string;
  confidenceScore: number;
}

export interface TicketMediaRecord {
  id: string;
  mediaType: 'video' | 'audio';
  mediaUrl: string;
  durationSeconds: number;
  fileSizeBytes: number;
  recordedAt: string;
  analysis?: MediaAnalysisResult;
}

// ---------------------------------------------------------------------------
// 3. REPAIR COPILOT TYPES
// ---------------------------------------------------------------------------
export interface KnowledgeBaseEntry {
  id: string;
  ticketId: string;
  ticketNumber: string;
  category: Category;
  title: string;
  issueSummary: string;
  locationType: string;
  fixtureType: string;
  resolutionNotes: string;
  partsUsed: string[];
  timeSpentMinutes: number;
  toolsNeeded: string[];
  studentConfirmedFix: boolean;
  isReliable: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  embeddingVersion?: string;
  createdAt: string;
}

export interface RepairCopilotGuidance {
  similarCasesCount: number;
  medianTimeMinutes: number;
  mostCommonParts: { part: string; count: number }[];
  suggestedTools: string[];
  checklist: string[];
  safetyPrecautions: string[];
  estimatedTimeRange: string;
  commonPitfalls: string[];
  supportingTickets: {
    ticketId: string;
    ticketNumber: string;
    resolutionNotes: string;
    timeSpentMinutes: number;
  }[];
  aiConfidenceNote: string;
  hasSufficientPrecedent: boolean;
}

export interface CopilotFeedback {
  id: string;
  ticketId: string;
  technicianId: string;
  helpful: boolean;
  editedChecklist?: string[];
  notes?: string;
  createdAt: string;
}


export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SessionData {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

// ---------------------------------------------------------------------------
// 4. STUDENT VERIFIED ASSISTANT & KNOWLEDGE BASE TYPES
// ---------------------------------------------------------------------------

export type CampusKnowledgeCategory = 
  | 'hostel_rules' 
  | 'facilities' 
  | 'services' 
  | 'department_directory' 
  | 'events' 
  | 'faqs';

export type KnowledgeAudience = 'all' | 'students' | 'hostel_residents' | 'staff';

export interface CampusKnowledgeEntry {
  id: string;
  title: string;
  slug: string;
  category: CampusKnowledgeCategory;
  summary: string;
  content: string;
  ownerDepartment: string;
  contactEmail: string;
  contactPhone: string;
  officeLocation: string;
  sourceLink?: string;
  audience: KnowledgeAudience;
  status: 'published' | 'draft' | 'archived';
  effectiveFrom: string;
  effectiveTo?: string | null;
  lastReviewedAt: string;
  isStale?: boolean;
  tags: string[];
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeGap {
  id: string;
  normalizedTopic: string;
  sampleQuestions: string[];
  count: number;
  unansweredCount: number;
  thumbsDownCount: number;
  suggestedDepartment: string;
  status: 'open' | 'addressed' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface AssistantSourceRef {
  id: string;
  title: string;
  department: string;
  link?: string;
  lastReviewedAt: string;
  isStale: boolean;
  category: string;
}

export interface AssistantLiveLookupRef {
  type: 'outage' | 'student_ticket' | 'event' | 'sla_metric' | 'emergency';
  title: string;
  referenceId?: string;
  details?: string;
}

export interface AssistantNextStep {
  label: string;
  action: 'report_issue' | 'follow_outage' | 'contact_dept' | 'view_ticket' | 'link';
  payload?: any;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  query: string;
  answerText: string;
  hindiTranslation?: string;
  sources: AssistantSourceRef[];
  liveLookupsUsed: AssistantLiveLookupRef[];
  nextSteps: AssistantNextStep[];
  isEmergency: boolean;
  isUnverifiedFallback: boolean;
  howAnswerWasMade: string;
  feedback?: 'helpful' | 'unhelpful';
  feedbackNotes?: string;
  language: 'en' | 'hi';
  createdAt: string;
}

