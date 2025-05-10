'use client';

import Header from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-muted-foreground">Loading your MentorLink experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} MentorLink. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
}
