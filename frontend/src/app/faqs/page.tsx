'use client';

import React from 'react';
import { Navbar } from '../../components/landing/navbar';
import { FAQSection } from '../../components/landing/faq-section';
import { Footer } from '../../components/landing/footer';

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] dark:bg-[#0B0F17] text-brand-midnight dark:text-white">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
