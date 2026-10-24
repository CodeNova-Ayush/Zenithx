'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AuthRedirectPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.replace('/sign-in');
      return;
    }

    const role = (user.publicMetadata?.role as string) || 'student';
    if (role === 'staff' || role === 'admin') {
      router.replace('/staff');
    } else {
      router.replace('/student');
    }
  }, [user, isLoaded, router]);

  return (
    <div className="min-h-screen paper-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-2xl bg-paper border border-border-subtle shadow-sm flex flex-col items-center space-y-4 max-w-sm">
        <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
        <h2 className="font-serif text-lg font-bold text-ink">Verifying credentials...</h2>
        <p className="text-xs text-muted-ink">
          Connecting to Campus Operations Directorate and routing to your workspace.
        </p>
      </div>
    </div>
  );
}
