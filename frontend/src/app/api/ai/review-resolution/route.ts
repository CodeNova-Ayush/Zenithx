import { NextRequest, NextResponse } from 'next/server';
import { reviewResolutionEvidence } from '@/lib/ai/resolution-review';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticket, resolutionPhotoBase64, technicianNotes } = body;

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket context is required' }, { status: 400 });
    }

    const result = await reviewResolutionEvidence({
      ticket,
      resolutionPhotoBase64,
      technicianNotes,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/review-resolution error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to review resolution evidence' },
      { status: 500 }
    );
  }
}
