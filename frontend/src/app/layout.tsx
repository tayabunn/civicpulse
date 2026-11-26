import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Manrope, Instrument_Serif } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
});
import { StoreProvider } from '../store/provider';
import { ThemeProvider } from '../components/layout/theme-provider';
import { AuthSync } from '../components/layout/auth-sync';
import { NotificationProvider } from '../context/notification-context';
import { ToastContainer } from '../components/ui/toast-container';
import { SmartPreloader } from '../components/ui/smart-preloader';

export const metadata: Metadata = {
  title: 'CivicPulse — Smart City Infrastructure Management Platform',
  description: 'Enterprise GovTech platform for municipal issue tracking, department triage, and field maintenance.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-background text-text-primary font-sans antialiased selection:bg-brand-yellow selection:text-brand-midnight">
        <StoreProvider>
          <ThemeProvider>
            <SmartPreloader />
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
