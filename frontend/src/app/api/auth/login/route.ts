import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, SESSION_COOKIE_NAME } from '@/lib/auth/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const { user, sessionToken } = await authenticateUser({ email, password });

    const response = NextResponse.json({ user, success: true });

    // Set secure HTTP-only session cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Authentication failed.' },
      { status: 401 }
    );
  }
}
