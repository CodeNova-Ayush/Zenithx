import { NextRequest, NextResponse } from 'next/server';
import { recordThumbsDownFeedback } from '@/lib/data/campus-knowledge-base';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, topic, feedback, notes } = body;

    if (!feedback || (feedback !== 'helpful' && feedback !== 'unhelpful')) {
      return NextResponse.json({ error: 'Valid feedback (helpful/unhelpful) required.' }, { status: 400 });
    }

    if (feedback === 'unhelpful') {
      recordThumbsDownFeedback(topic || query || 'General Assistant Feedback', query || '');
    }

    return NextResponse.json({ success: true, message: 'Feedback recorded successfully.' });
  } catch (error: any) {
    console.error('Error in /api/assistant/feedback:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to record feedback' },
      { status: 500 }
    );
  }
}
