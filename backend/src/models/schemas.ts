import { z } from 'zod';

export const AIComplaintAnalysisSchema = z.object({
  summary: z.string().describe('Short actionable 1-line description of the issue'),
  category: z.enum(['plumbing', 'electricity', 'cleanliness', 'internet']).describe('Detected category'),
  department: z.string().describe('Responsible campus operations department'),
  issue_details: z.string().describe('Detailed breakdown of the observed problem'),
  location: z.object({
    building: z.string().nullable().describe('Extracted building name if mentioned'),
    floor: z.string().nullable().describe('Extracted floor number or level if mentioned'),
    room: z.string().nullable().describe('Extracted room, bathroom, or specific area name'),
    area: z.string().nullable().describe('Specific landmark or area description')
  }),
  missing_information: z.array(z.string()).describe('List of critical missing details needed to dispatch maintenance'),
  follow_up_question: z.string().nullable().describe('Polite, single targeted question to ask student for missing info, in the language of the complaint'),
  suggested_priority: z.enum(['low', 'normal', 'high', 'urgent']).describe('Suggested priority based on risk and severity'),
  image_observations: z.array(z.string()).describe('Visual observations from provided image'),
  safety_concerns: z.array(z.string()).describe('Immediate hazards or safety risks observed'),
  confidence: z.number().min(0).max(1).describe('Model confidence score between 0 and 1')
});

export type AIComplaintAnalysis = z.infer<typeof AIComplaintAnalysisSchema>;

export const AIResolutionReviewSchema = z.object({
  summary: z.string().describe('Executive summary of the visible repair work'),
  visibleChanges: z.array(z.string()).describe('Specific visual changes between original issue and post-fix photograph'),
  remainingConcerns: z.array(z.string()).describe('Unresolved problems, visible debris, or potential quality defects'),
  evidenceLimitations: z.array(z.string()).describe('Technical limits of photo evaluation'),
  verdict: z.enum([
    'Evidence appears consistent with resolution',
    'Evidence is inconclusive',
    'Possible unresolved issue',
    'Manual review required'
  ]),
  confidenceScore: z.number().min(0).max(100),
  recommendation: z.string()
});

export type AIResolutionReview = z.infer<typeof AIResolutionReviewSchema>;

export const AICampusBrainResponseSchema = z.object({
  answer: z.string(),
  supportingMetrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    trend: z.string().optional()
  })),
  relatedTicketNumbers: z.array(z.string()),
  suggestedAction: z.string(),
  dataLimitations: z.string().optional()
});

export type AICampusBrainResponse = z.infer<typeof AICampusBrainResponseSchema>;
