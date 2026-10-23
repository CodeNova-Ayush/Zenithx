import { NextRequest, NextResponse } from 'next/server';
import { registerUser, SESSION_COOKIE_NAME } from '@/lib/auth/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const { user, sessionToken } = await registerUser({ name, email, password });

    const response = NextResponse.json({ user, success: true });

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
      { error: error?.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
