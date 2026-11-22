import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { StoreProvider } from '../store/provider';
import { ThemeProvider } from '../components/layout/theme-provider';
import { AuthSync } from '../components/layout/auth-sync';
import { NotificationProvider } from '../context/notification-context';
import { ToastContainer } from '../components/ui/toast-container';

export const metadata: Metadata = {
  title: 'CivicPulse — Smart City Infrastructure Management Platform',
  description: 'Enterprise GovTech platform for municipal issue tracking, department triage, and field maintenance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-text-primary antialiased selection:bg-brand-yellow selection:text-brand-midnight">
        <StoreProvider>
          <ThemeProvider>
            <NotificationProvider>
              <Suspense fallback={null}>
                <AuthSync />
              </Suspense>
              {children}
              <ToastContainer />
            </NotificationProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
