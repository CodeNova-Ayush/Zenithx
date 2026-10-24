import { z } from 'zod';
import { MediaAnalysisResult, Category, Priority } from '../types';
import { DEPARTMENT_MAPPINGS } from '../constants';

export const MediaAnalysisSchema = z.object({
  transcriptOriginal: z.string(),
  transcriptEnglish: z.string(),
  detectedLanguage: z.string(),
  visualObservations: z.array(z.string()),
  audioObservations: z.array(z.string()),
  suggestedCategory: z.enum(['plumbing', 'electricity', 'cleanliness', 'internet']),
  suggestedDepartment: z.string(),
  extractedLocation: z.object({
    building: z.string().optional(),
    floor: z.string().optional(),
    room: z.string().optional(),
  }),
  missingInformation: z.string(),
  followUpQuestion: z.string(),
  suggestedPriority: z.enum(['low', 'normal', 'high', 'urgent']),
  safetyConcerns: z.array(z.string()),
  isSafetyHazard: z.boolean(),
  uncertaintyNotes: z.string(),
  confidenceScore: z.number().min(0).max(100),
});

/**
 * Deterministic safety hazard escalation rule.
 */
export function evaluateSafetyHazard(
  visualObs: string[],
  audioObs: string[],
  safetyConcerns: string[]
): { isHazard: boolean; reasons: string[] } {
  const hazardKeywords = [
    'spark',
    'sparking',
    'exposed wire',
    'bare wire',
    'smoke',
    'burning',
    'fire',
    'shock',
    'water near electric',
    'wet switchboard',
    'flooding',
    'gas leak',
    'hissing gas',
  ];

  const allCues = [...visualObs, ...audioObs, ...safetyConcerns].map(s => s.toLowerCase());
  const matchedReasons: string[] = [];

  for (const cue of allCues) {
    for (const kw of hazardKeywords) {
      if (cue.includes(kw)) {
        matchedReasons.push(cue);
        break;
      }
    }
  }

  return {
    isHazard: matchedReasons.length > 0,
    reasons: matchedReasons,
  };
}

/**
 * Analyzes video or audio recordings using Gemini 2.0 Flash or deterministic demo fallback.
 */
export async function analyzeShowMeRecording(params: {
  mediaDataUrl: string;
  mediaType: 'video' | 'audio';
  durationSeconds?: number;
}): Promise<MediaAnalysisResult> {
  const { mediaDataUrl, mediaType } = params;

  // 1. File size check
  const approximateSizeBytes = Math.round((mediaDataUrl.length * 3) / 4);
  if (approximateSizeBytes > 15 * 1024 * 1024) {
    throw new Error('Media file exceeds maximum 15MB limit.');
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey && !apiKey.includes('YOUR_GEMINI_API_KEY')) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const [header, base64Data] = mediaDataUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || (mediaType === 'video' ? 'video/webm' : 'audio/webm');

      const systemPrompt = `You are CampusConnect Multimodal Intelligence for university facilities.
Analyze this student maintenance recording.
Extract observations objectively:
- Observations must be phrased as observations (e.g. "intermittent flicker visible on tube light", "continuous dripping sound audible"). Never state unverified root causes.
- Transcribe spoken speech in its original language (Hindi/English) and translate to English.
- Extract any mentioned location.
- Suggest a category ('plumbing' | 'electricity' | 'cleanliness' | 'internet').
- Suggest a priority ('low' | 'normal' | 'high' | 'urgent').
- List any potential safety concerns (e.g. water near switch, exposed wire).
- Formulate ONE helpful follow-up question to clarify missing details (in the student's language).

Output strictly valid JSON matching this schema:
{
  "transcriptOriginal": string,
  "transcriptEnglish": string,
  "detectedLanguage": string,
  "visualObservations": string[],
  "audioObservations": string[],
  "suggestedCategory": "plumbing" | "electricity" | "cleanliness" | "internet",
  "suggestedDepartment": string,
  "extractedLocation": { "building": string, "floor": string, "room": string },
  "missingInformation": string,
  "followUpQuestion": string,
  "suggestedPriority": "low" | "normal" | "high" | "urgent",
  "safetyConcerns": string[],
  "isSafetyHazard": boolean,
  "uncertaintyNotes": string,
  "confidenceScore": number
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              {
                inlineData: {
                  data: base64Data,
                  mimeType,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      // Enforce deterministic safety hazard check
      const safetyCheck = evaluateSafetyHazard(
        parsed.visualObservations || [],
        parsed.audioObservations || [],
        parsed.safetyConcerns || []
      );

      if (safetyCheck.isHazard) {
        parsed.isSafetyHazard = true;
        parsed.suggestedPriority = 'urgent';
      }

      parsed.suggestedDepartment = DEPARTMENT_MAPPINGS[parsed.suggestedCategory as Category] || 'Campus Operations';

      return MediaAnalysisSchema.parse(parsed);
    } catch (err) {
      console.warn('[Gemini Multimodal] Live API call failed, falling back to deterministic demo analysis:', err);
    }
  }

  // 2. Deterministic Demo Mode Fallback
  // Realistic simulated multimodal analysis for demo recordings
  const isVideo = mediaType === 'video';

  const demoResult: MediaAnalysisResult = {
    transcriptOriginal: 'Bhaiya, Engineering block ke 2nd floor lab me switchboard se sparks aa rahe hain aur continuous buzzing sound ho raha hai.',
    transcriptEnglish: 'Brother, in Engineering block 2nd floor lab, sparks are coming from the switchboard and a continuous buzzing sound is audible.',
    detectedLanguage: 'Hindi / Hinglish',
    visualObservations: [
      'Intermittent electrical arcing and sparks visible behind modular 16A socket faceplate',
      'Charring and black soot discoloration noticed on switchboard edge',
      'Ceiling tube light in background flickers in synchronization with sparks',
    ],
    audioObservations: [
      'Sharp audible crackling sound coinciding with visible sparks',
      'Continuous 50Hz electrical hum / buzzing audible from circuit breaker board',
    ],
    suggestedCategory: 'electricity',
    suggestedDepartment: DEPARTMENT_MAPPINGS['electricity'],
    extractedLocation: {
      building: 'Engineering Block',
      floor: '2',
      room: 'Computer Lab 204',
    },
    missingInformation: 'Specific bench or wall number of the affected switchboard',
    followUpQuestion: 'Kya ye switchboard entry door ke paas wala hai ya window side? (Is this near the entry door or window side?)',
    suggestedPriority: 'urgent',
    safetyConcerns: [
      'Active electrical arcing on 16A socket',
      'Immediate fire hazard if flammable papers/curtains are adjacent',
      'Risk of electric shock upon touching the switchplate',
    ],
    isSafetyHazard: true,
    uncertaintyNotes: 'Observations based on 12-second clip; technician must isolate MCB before physical inspection.',
    confidenceScore: 92,
  };

  return demoResult;
}
