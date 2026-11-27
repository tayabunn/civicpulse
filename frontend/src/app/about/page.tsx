'use client';

import React from 'react';
import { Navbar } from '../../components/landing/navbar';
import { AboutPageContent } from '../../components/landing/about-page-content';
import { Footer } from '../../components/landing/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] dark:bg-[#0B0F17] text-brand-midnight dark:text-white">
      <Navbar />
      <main>
        <AboutPageContent />
      </main>
      <Footer />
    </div>
  );
}
