'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/layout/header';
import { cn } from '../../lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Strict authentication guard: redirect to /login if not authenticated
    if (!isAuthenticated || !user) {
      router.replace('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [isAuthenticated, user, router]);

  // Prevent any dashboard rendering until authorization is verified
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-brand-cobalt border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-text-muted">
          Access Protected. Please Log In or Register to continue...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 flex flex-col min-h-screen ml-0',
          sidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[248px]'
        )}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
