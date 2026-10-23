import { getGeminiClient, GEMINI_MODEL, isGeminiConfigured } from './gemini';
import { AIResolutionReview, AIResolutionReviewSchema } from './schemas';
import { Ticket } from '../types';

export async function reviewResolutionEvidence(params: {
  ticket: Ticket;
  resolutionPhotoBase64?: string;
  technicianNotes?: string;
}): Promise<{ assessment: AIResolutionReview; isDemoMode: boolean }> {
  const { ticket, resolutionPhotoBase64, technicianNotes } = params;

  if (isGeminiConfigured) {
    try {
      const client = getGeminiClient();
      if (client) {
        const contents: any[] = [];
        
        const prompt = `
You are the Proof-of-Fix Verification Intelligence for CampusConnect.
Evaluate whether a technician's repair evidence photograph and notes adequately resolve the original campus maintenance ticket.

Original Ticket:
- Ticket: ${ticket.ticketNumber}
- Category: ${ticket.category}
- Title: ${ticket.title}
- Original Complaint: ${ticket.originalDescription}
- Location: ${ticket.building}, Floor ${ticket.floor || 'N/A'}, Room: ${ticket.room || 'N/A'}
- Technician Notes: ${technicianNotes || 'None provided'}

Analyze the image carefully.
Allowed verdicts:
- "Evidence appears consistent with resolution" (clear visible correction, clean area)
- "Evidence is inconclusive" (photo blurry, wrong angle, cannot ascertain internal functioning)
- "Possible unresolved issue" (residual water, still leaking, wires dangling, debris left behind)
- "Manual review required" (high risk or ambiguous)

Return valid JSON conforming to the requested schema.
`;
        contents.push({ text: prompt });

        if (resolutionPhotoBase64) {
          contents.push({
            inlineData: {
              data: resolutionPhotoBase64.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: 'image/jpeg',
            }
          });
        }

        const response = await client.models.generateContent({
          model: GEMINI_MODEL,
          contents,
          config: {
            responseMimeType: 'application/json',
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          const validated = AIResolutionReviewSchema.parse(parsed);
          return { assessment: validated, isDemoMode: false };
        }
      }
    } catch (e) {
      console.warn('Gemini resolution review fallback activated', e);
    }
  }

  // Deterministic Fallback
  const fallback = generateDeterministicResolutionAssessment(ticket, technicianNotes);
  return { assessment: fallback, isDemoMode: true };
}

function generateDeterministicResolutionAssessment(ticket: Ticket, notes?: string): AIResolutionReview {
  const category = ticket.category;
  
  if (category === 'plumbing') {
    return {
      summary: 'Replacement of sealing gasket and flex-coupling valve verified. Dry floor surface observed with no visible active pooling.',
      visibleChanges: [
        'Clean dry porcelain basin underside',
        'New brass shutoff valve installed and tightened',
        'Floor dried and moisture barrier wiped down'
      ],
      remainingConcerns: [],
      evidenceLimitations: [
        'Static photograph cannot measure dynamic water pressure over long run; student confirmation recommended.'
      ],
      verdict: 'Evidence appears consistent with resolution',
      confidenceScore: 92,
      recommendation: 'Approved for student sign-off and closure.'
    };
  }

  if (category === 'electricity') {
    return {
      summary: 'Circuit junction re-insulated, burnt contactor replaced, breaker reset under nominal amperage load.',
      visibleChanges: [
        'Terminal enclosure closed and secured with safety latch',
        'Replacement contactor relay cleanly mounted',
        'No visible scorch marks or loose conductors'
      ],
      remainingConcerns: [],
      evidenceLimitations: [
        'Thermal infrared thermography not included in visual camera capture.'
      ],
      verdict: 'Evidence appears consistent with resolution',
      confidenceScore: 89,
      recommendation: 'Mark resolved and monitor during high lab load period.'
    };
  }

  if (category === 'cleanliness') {
    return {
      summary: 'Waste receptacle emptied, area sanitized with disinfectant solution, new heavy-duty liner installed.',
      visibleChanges: [
        'Receptacle clean with taut new liner',
        'Surrounding ground swept and litter-free',
        'Sanitation log tag updated'
      ],
      remainingConcerns: [],
      evidenceLimitations: ['Microbial surface cleanliness requires physical swab verification.'],
      verdict: 'Evidence appears consistent with resolution',
      confidenceScore: 96,
      recommendation: 'Ready for student sign-off.'
    };
  }

  return {
    summary: 'Network transceiver firmware reloaded and Ethernet patch cable re-seated with solid gigabit link synchronization.',
    visibleChanges: [
      'Status LED indicator transitioned to solid operational green',
      'Cable cable-tied and strain-relieved'
    ],
    remainingConcerns: [],
    evidenceLimitations: ['RF coverage contours and signal-to-noise ratio must be confirmed by telemetry polling.'],
    verdict: 'Evidence appears consistent with resolution',
    confidenceScore: 91,
    recommendation: 'Resolved. Ready for student verification.'
  };
}
