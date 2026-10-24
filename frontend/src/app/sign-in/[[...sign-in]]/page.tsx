import React, { Suspense } from 'react';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { ShieldCheck, Sparkles, Building2, Radio } from 'lucide-react';

export const metadata = {
  title: 'Sign In — CampusConnect AI Operations',
  description: 'Access the CampusConnect operations platform for students, staff, and administration.',
};

export default function SignInPage() {
  const isClerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY')
  );

  return (
    <div className="min-h-screen paper-canvas flex flex-col justify-between selection:bg-sand selection:text-ink">
      {/* Editorial Header */}
      <header className="border-b border-border-subtle bg-paper/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-forest text-ivory flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              CC
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-ink tracking-tight">CampusConnect</span>
              <span className="text-[10px] font-mono tracking-widest text-muted-ink uppercase">Operations Intelligence</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-ink font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CAMPUS GRID ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        {/* Left Editorial Narrative */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-subtle bg-paper text-xs font-mono text-muted-ink self-start">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>SECURE UNIVERSITY CREDENTIALS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-ink tracking-tight leading-[1.15]">
            Unified access to campus infrastructure & operations.
          </h1>

          <p className="text-sm sm:text-base text-muted-ink leading-relaxed max-w-lg">
            Sign in with your university identity to report maintenance issues, track real-time resolution SLAs, or coordinate engineering dispatch across campus facilities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
            <div className="p-4 rounded-xl border border-border-subtle bg-paper/60 space-y-1">
              <div className="flex items-center gap-2 text-forest font-medium text-xs font-mono">
                <Building2 className="w-4 h-4" />
                <span>STUDENT PORTAL</span>
              </div>
              <p className="text-xs text-muted-ink">
                Voice & video reporting, instant biometric verification, and personal fix tracking.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-paper/60 space-y-1">
              <div className="flex items-center gap-2 text-forest font-medium text-xs font-mono">
                <Radio className="w-4 h-4" />
                <span>STAFF DISPATCH</span>
              </div>
              <p className="text-xs text-muted-ink">
                Outage Detective cluster reasoning and Repair Copilot precedent retrieval.
              </p>
            </div>
          </div>
        </div>

        {/* Fine Editorial Divider on Desktop */}
        <div className="hidden lg:block w-px self-stretch bg-border-subtle" />

        {/* Right Clerk Form / Fallback */}
        <div className="w-full lg:w-1/2 max-w-md flex flex-col items-center">
          <div className="w-full bg-paper border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-sm">
            <Suspense fallback={
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-6 h-6 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-muted-ink">Loading authentication...</span>
              </div>
            }>
              {isClerkConfigured ? (
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  forceRedirectUrl="/auth/redirect"
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'shadow-none bg-transparent p-0 w-full',
                      headerTitle: 'text-ink font-serif text-2xl font-bold tracking-tight',
                      headerSubtitle: 'text-muted-ink text-xs',
                      formButtonPrimary: 'bg-forest hover:bg-forest/90 text-ivory text-xs font-medium py-2.5 rounded-lg transition-all shadow-none',
                      socialButtonsBlockButton: 'border-border-subtle hover:bg-ivory text-ink text-xs font-medium py-2 rounded-lg',
                      formFieldInput: 'bg-ivory/50 border-border-subtle text-ink rounded-lg focus:ring-1 focus:ring-forest focus:border-forest text-xs',
                      formFieldLabel: 'text-ink font-mono text-xs uppercase tracking-wider',
                      footerActionLink: 'text-forest hover:text-forest/80 font-medium text-xs underline-offset-4',
                      dividerLine: 'bg-border-subtle',
                      dividerText: 'text-muted-ink text-[11px] font-mono',
                    },
                    variables: {
                      colorPrimary: '#35483A',
                      colorBackground: '#FCFAF6',
                      colorForeground: '#24251F',
                      colorMutedForeground: '#77766E',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--font-sans)',
                    }
                  }}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
                    <Sparkles className="w-4 h-4 text-amber" />
                    <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">Demo & Local Authentication</span>
                  </div>
                  <div className="p-4 rounded-xl bg-ivory border border-border-subtle text-xs space-y-2">
                    <p className="font-semibold text-ink">Clerk Application Selected: app_3L7XtzGjCoAeeiA8Wx7bFbkJ4TF</p>
                    <p className="text-muted-ink leading-relaxed">
                      To activate live Clerk authentication, provide your publishable and secret keys in your environment variables.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-mono text-muted-ink uppercase tracking-wider">Instant Demo Access</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Link
                        href="/student"
                        className="w-full text-center py-2.5 px-4 rounded-lg bg-forest text-ivory text-xs font-medium hover:bg-forest/90 transition-colors shadow-sm"
                      >
                        Enter as Student (Ananya Roy)
                      </Link>
                      <Link
                        href="/staff"
                        className="w-full text-center py-2.5 px-4 rounded-lg border border-border-strong bg-paper text-ink text-xs font-medium hover:bg-ivory transition-colors"
                      >
                        Enter as Staff Engineer (Rajesh Sharma)
                      </Link>
                      <Link
                        href="/staff/incidents"
                        className="w-full text-center py-2.5 px-4 rounded-lg border border-border-subtle bg-paper text-muted-ink hover:text-ink text-xs font-mono transition-colors"
                      >
                        Open Outage Detective Queue
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-muted-ink">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-forest hover:underline font-medium">
              Create student account
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-paper/60 px-6 py-4 text-center text-xs text-muted-ink font-mono">
        CampusConnect v2.0 • AI-Powered Campus Operations Intelligence
      </footer>
    </div>
  );
}
