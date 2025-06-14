
'use client';

import Header from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, firebaseUser } = useAuth(); // Added firebaseUser
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If still loading auth state, or if on an auth page, don't redirect
    if (isLoading || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      return;
    }
    // If done loading and no Firebase user is authenticated, redirect to login
    if (!isLoading && !firebaseUser) {
      router.push('/login');
    }
    // If Firebase user exists but user profile (from Firestore) is null (could be during initial load after auth)
    // and still loading, we wait. If done loading and profile is still null, it might indicate an issue,
    // but onAuthStateChanged in useAuth should handle this by logging out if Firestore doc is missing.
    // So, the primary check is !firebaseUser for redirection.
  }, [firebaseUser, isLoading, router, pathname]);

  // Show loading indicator if auth state is loading OR if firebaseUser exists but profile (user) is still loading
  if (isLoading || (firebaseUser && !user && !pathname.startsWith('/login') && !pathname.startsWith('/signup'))) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted-foreground">Loading your TutorLink experience...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user (which implies no firebaseUser after effect runs), and not on auth pages,
  // this content shouldn't ideally be reached due to redirect, but as a fallback.
  if (!user && !isLoading && !pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
     // This state should be covered by the useEffect redirect.
     // If it's reached, it might be a flicker before redirect or an edge case.
     // Showing loader is consistent.
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-2xl px-4 py-8 md:px-8 bg-white text-zinc-900">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} TutorLink. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
