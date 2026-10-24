import { NextRequest, NextResponse } from 'next/server';
import { processStudentAssistantQuery } from '@/lib/services/student-assistant';
import { AssistantQueryContext } from '@/lib/types';

// Simple in-memory rate limiter: max 30 requests per minute per identifier
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= 30) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local-client';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before sending more questions.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { query, language, studentId, studentName, studentBuilding, studentFloor, studentRoom } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    const context: AssistantQueryContext = {
      studentId: studentId || 'student-demo',
      studentName: studentName || 'Student Resident',
      studentBuilding: studentBuilding || 'Tagore Hostel (Block C)',
      studentFloor: studentFloor || 2,
      studentRoom: studentRoom || '204',
      preferredLanguage: language === 'hi' ? 'hi' : 'en',
    };

    const response = await processStudentAssistantQuery(query, context);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in /api/assistant/ask:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process student assistant query' },
      { status: 500 }
    );
  }
}
