'use client';

import React from 'react';
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
  const { sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 flex flex-col min-h-screen',
          sidebarCollapsed ? 'ml-[76px]' : 'ml-[248px]'
        )}
      >
        <Header />
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
