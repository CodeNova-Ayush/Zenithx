import { NextRequest, NextResponse } from 'next/server';
import { queryCampusBrain } from '@/lib/ai/campus-brain';
import { INITIAL_TICKETS } from '@/lib/data/initial-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, tickets } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    // Use passed tickets or fallback to initial seed tickets
    const targetTickets = Array.isArray(tickets) && tickets.length > 0 ? tickets : INITIAL_TICKETS;

    const result = await queryCampusBrain(query, targetTickets);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/campus-brain error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to query Campus Brain' },
      { status: 500 }
    );
  }
}
