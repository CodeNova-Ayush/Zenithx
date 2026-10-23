import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/auth/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const result = requestPasswordReset(email);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process request.' }, { status: 500 });
  }
}
