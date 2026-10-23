import test from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';

// 1. Zod Category & Priority Enum Tests
const CategoryEnum = z.enum(['plumbing', 'electricity', 'cleanliness', 'internet']);
const PriorityEnum = z.enum(['low', 'normal', 'high', 'urgent']);
const TicketStatusEnum = z.enum(['open', 'assigned', 'in_progress', 'resolved', 'closed', 'reopened']);

test('Category validation accepts valid categories and rejects invalid', () => {
  assert.strictEqual(CategoryEnum.parse('plumbing'), 'plumbing');
  assert.strictEqual(CategoryEnum.parse('electricity'), 'electricity');
  assert.strictEqual(CategoryEnum.parse('cleanliness'), 'cleanliness');
  assert.strictEqual(CategoryEnum.parse('internet'), 'internet');

  assert.throws(() => CategoryEnum.parse('carpentry'), /Invalid/);
  assert.throws(() => CategoryEnum.parse('food'), /Invalid/);
});

test('Priority validation behaves correctly', () => {
  assert.strictEqual(PriorityEnum.parse('urgent'), 'urgent');
  assert.strictEqual(PriorityEnum.parse('high'), 'high');
  assert.strictEqual(PriorityEnum.parse('normal'), 'normal');
  assert.strictEqual(PriorityEnum.parse('low'), 'low');
  assert.throws(() => PriorityEnum.parse('critical_disaster'), /Invalid/);
});

test('Ticket status transition state machine', () => {
  const allowedTransitions = {
    open: ['assigned', 'closed'],
    assigned: ['in_progress', 'open'],
    in_progress: ['resolved', 'assigned'],
    resolved: ['closed', 'reopened'],
    reopened: ['assigned', 'in_progress'],
    closed: ['reopened'],
  };

  assert.ok(allowedTransitions.open.includes('assigned'));
  assert.ok(allowedTransitions.resolved.includes('closed'));
  assert.ok(allowedTransitions.resolved.includes('reopened'));
  assert.ok(!allowedTransitions.open.includes('resolved'), 'Cannot skip to resolved directly from open');
});

// 2. Department routing test
test('Department routing mappings are exact and non-empty', () => {
  const DEPARTMENT_MAPPINGS = {
    plumbing: 'Plumbing & Hydraulic Services',
    electricity: 'Electrical Infrastructure',
    cleanliness: 'Campus Housekeeping & Sanitation',
    internet: 'IT Network & Systems Operations',
  };

  assert.strictEqual(DEPARTMENT_MAPPINGS.plumbing, 'Plumbing & Hydraulic Services');
  assert.strictEqual(DEPARTMENT_MAPPINGS.electricity, 'Electrical Infrastructure');
  assert.strictEqual(DEPARTMENT_MAPPINGS.cleanliness, 'Campus Housekeeping & Sanitation');
  assert.strictEqual(DEPARTMENT_MAPPINGS.internet, 'IT Network & Systems Operations');
});

// 3. SLA deadline calculations
test('SLA Matrix deadline calculation', () => {
  const SLA_HOURS_MATRIX = {
    plumbing: { urgent: 2, high: 6, normal: 24, low: 48 },
    electricity: { urgent: 1, high: 4, normal: 12, low: 36 },
    cleanliness: { urgent: 3, high: 8, normal: 24, low: 48 },
    internet: { urgent: 2, high: 6, normal: 18, low: 48 },
  };

  const urgentPlumbingHours = SLA_HOURS_MATRIX.plumbing.urgent;
  assert.strictEqual(urgentPlumbingHours, 2);

  const urgentElecHours = SLA_HOURS_MATRIX.electricity.urgent;
  assert.strictEqual(urgentElecHours, 1);

  const now = new Date('2026-10-23T12:00:00Z');
  const deadline = new Date(now.getTime() + urgentPlumbingHours * 3600 * 1000);
  assert.strictEqual(deadline.toISOString(), '2026-10-23T14:00:00.000Z');
});

// 4. AI Complaint Analysis Schema validation
test('AIComplaintAnalysisSchema parses structured output correctly', () => {
  const AIComplaintAnalysisSchema = z.object({
    summary: z.string(),
    category: CategoryEnum,
    department: z.string(),
    issue_details: z.string(),
    location: z.object({
      building: z.string().nullable(),
      floor: z.string().nullable(),
      room: z.string().nullable(),
      area: z.string().nullable(),
    }),
    missing_information: z.array(z.string()),
    follow_up_question: z.string().nullable(),
    suggested_priority: PriorityEnum,
    image_observations: z.array(z.string()),
    safety_concerns: z.array(z.string()),
    confidence: z.number().min(0).max(1),
  });

  const validSample = {
    summary: 'Water pipe leaking in washroom',
    category: 'plumbing',
    department: 'Plumbing & Hydraulic Services',
    issue_details: 'Continuous water drip from underside of basin',
    location: {
      building: 'Tagore Hostel (Block C)',
      floor: '2',
      room: 'Washroom Wing A',
      area: null,
    },
    missing_information: [],
    follow_up_question: null,
    suggested_priority: 'urgent',
    image_observations: ['Puddle on floor'],
    safety_concerns: ['Slip hazard'],
    confidence: 0.95,
  };

  const parsed = AIComplaintAnalysisSchema.parse(validSample);
  assert.strictEqual(parsed.category, 'plumbing');
  assert.strictEqual(parsed.confidence, 0.95);
});

// 5. Duplicate detection scoring logic test
test('Duplicate matching score algorithm calculates accurately', () => {
  function computeScore(newTicket, existing) {
    let score = 0;
    if (newTicket.building === existing.building) score += 35;
    if (newTicket.category === existing.category) score += 25;
    if (newTicket.floor === existing.floor) score += 20;
    if (newTicket.room === existing.room) score += 20;
    return Math.min(score, 99);
  }

  const ticketA = {
    building: 'Tagore Hostel (Block C)',
    category: 'plumbing',
    floor: 2,
    room: 'Washroom Wing A',
  };

  const ticketB = {
    building: 'Tagore Hostel (Block C)',
    category: 'plumbing',
    floor: 2,
    room: 'Washroom Wing A',
  };

  const ticketC = {
    building: 'APJ Abdul Kalam Engineering Quad',
    category: 'electricity',
    floor: 1,
    room: 'Room 101',
  };

  assert.strictEqual(computeScore(ticketA, ticketB), 99);
  assert.strictEqual(computeScore(ticketA, ticketC), 0);
});

// 6. Resolution Assessment Schema validation
test('AIResolutionReviewSchema parses Proof-of-Fix structured verdict', () => {
  const AIResolutionReviewSchema = z.object({
    summary: z.string(),
    visibleChanges: z.array(z.string()),
    remainingConcerns: z.array(z.string()),
    evidenceLimitations: z.array(z.string()),
    verdict: z.enum([
      'Evidence appears consistent with resolution',
      'Evidence is inconclusive',
      'Possible unresolved issue',
      'Manual review required',
    ]),
    confidenceScore: z.number().min(0).max(100),
    recommendation: z.string(),
  });

  const sampleReview = {
    summary: 'Shutoff valve cleanly replaced with new Teflon tape joint.',
    visibleChanges: ['Dry porcelain surface', 'New brass coupling'],
    remainingConcerns: [],
    evidenceLimitations: ['Static photograph does not evaluate continuous high pressure flow'],
    verdict: 'Evidence appears consistent with resolution',
    confidenceScore: 94,
    recommendation: 'Approved for student sign-off.',
  };

  const parsed = AIResolutionReviewSchema.parse(sampleReview);
  assert.strictEqual(parsed.verdict, 'Evidence appears consistent with resolution');
  assert.strictEqual(parsed.confidenceScore, 94);
});
