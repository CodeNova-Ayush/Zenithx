import { NextRequest, NextResponse } from 'next/server';
import { analyzeStudentComplaint } from '@/lib/ai/complaint-analysis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { complaintText, locationHint, imageBase64, imageMimeType } = body;

    if (!complaintText || typeof complaintText !== 'string') {
      return NextResponse.json({ error: 'Complaint text is required' }, { status: 400 });
    }

    const result = await analyzeStudentComplaint({
      complaintText,
      locationHint,
      imageBase64,
      imageMimeType,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/analyze-complaint error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze complaint' },
      { status: 500 }
    );
  }
}
