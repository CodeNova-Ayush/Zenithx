import React, { Suspense } from 'react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Sign Up — CampusConnect AI Operations',
  description: 'Create your authenticated CampusConnect student profile.',
};

export default function SignUpPage() {
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
            <UserCheck className="w-3.5 h-3.5 text-forest" />
            <span>STUDENT REGISTRATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-ink tracking-tight leading-[1.15]">
            Register your verified student identity.
          </h1>

          <p className="text-sm sm:text-base text-muted-ink leading-relaxed max-w-lg">
            All public accounts default securely to the <strong>Student</strong> role. Connect your university email to report maintenance issues, submit voice & video observations, and track institutional accountability.
          </p>

          <div className="p-5 rounded-xl border border-border-subtle bg-paper/60 space-y-3">
            <div className="flex items-center gap-2 text-forest font-medium text-xs font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>SECURITY & ROLE POLICY</span>
            </div>
            <p className="text-xs text-muted-ink leading-relaxed">
              Staff and administrative privileges are strictly governed by campus operations directorate authorization. Staff credentials cannot be claimed through open registration.
            </p>
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
                <span className="text-xs font-mono text-muted-ink">Loading registration...</span>
              </div>
            }>
              {isClerkConfigured ? (
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
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
                    <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">Demo Registration</span>
                  </div>
                  <div className="p-4 rounded-xl bg-ivory border border-border-subtle text-xs space-y-2">
                    <p className="font-semibold text-ink">Clerk Integration Mode</p>
                    <p className="text-muted-ink leading-relaxed">
                      To complete account creation with live SMS/email OTP or OAuth, connect your Clerk publishable key for app <code>app_3L7XtzGjCoAeeiA8Wx7bFbkJ4TF</code>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/student"
                      className="block w-full text-center py-2.5 px-4 rounded-lg bg-forest text-ivory text-xs font-medium hover:bg-forest/90 transition-colors shadow-sm"
                    >
                      Continue to Student Portal (Demo)
                    </Link>
                  </div>
                </div>
              )}
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-muted-ink">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-forest hover:underline font-medium">
              Sign in here
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
