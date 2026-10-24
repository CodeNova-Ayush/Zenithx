import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/auth(.*)',
  '/api/webhooks(.*)',
  '/images(.*)',
  '/favicon.ico',
]);

const isStaffRoute = createRouteMatcher([
  '/staff(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // If Clerk keys are missing in local dev or demo mode is on, allow access gracefully
  const hasClerkKey = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY')
  );

  if (!hasClerkKey || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return NextResponse.next();
  }

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check role for staff/admin routes
  if (isStaffRoute(req)) {
    const userRole = (sessionClaims?.publicMetadata as any)?.role || 'student';
    if (userRole !== 'staff' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/student', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
