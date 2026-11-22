'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { hydrateAuth } from '../../store/authSlice';
import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/layout/header';
import { cn } from '../../lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    // 1. Strict authentication guard with local storage persistence check
    const storedUserStr = typeof window !== 'undefined' ? localStorage.getItem('civicpulse_user') : null;
    let currentUser = user;
    if (!currentUser && storedUserStr) {
      try {
        currentUser = JSON.parse(storedUserStr);
      } catch {}
    }

    if (!isAuthenticated && !currentUser) {
      router.replace('/login');
      return;
    }

    const role = currentUser?.role || 'citizen';

    // 2. Strict Role-Based Access Control (RBAC):
    // Only verified 'admin' can access /admin routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
      console.warn(`[RBAC] Access denied: User (${currentUser?.email}, role: ${role}) blocked from accessing ${pathname}`);
      router.replace('/citizen');
      return;
    }

    // Only 'manager' or 'admin' can access /manager routes
    if (pathname.startsWith('/manager') && role !== 'manager' && role !== 'admin') {
      console.warn(`[RBAC] Access denied: User (${currentUser?.email}, role: ${role}) blocked from accessing ${pathname}`);
      router.replace('/citizen');
      return;
    }

    // Only 'staff' or 'admin' can access /staff routes
    if (pathname.startsWith('/staff') && role !== 'staff' && role !== 'admin') {
      console.warn(`[RBAC] Access denied: User (${currentUser?.email}, role: ${role}) blocked from accessing ${pathname}`);
      router.replace('/citizen');
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, pathname, router]);

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
