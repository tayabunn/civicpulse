'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What municipal issues does CivicPulse cover?',
    answer:
      'CivicPulse covers damaged roads, broken footpaths and sidewalks, streetlighting outages, monsoon waterlogging and drainage blockages, uncollected domestic and commercial waste, and public park amenities.',
  },
  {
    id: 'faq-2',
    question: 'How does the duplicate detection radar work?',
    answer:
      'When you submit an issue, our automated Haversine radar calculates spatial proximity against active unresolved reports. If an issue is within 50 meters in the same category, you are alerted to upvote instead of creating duplicate tickets.',
  },
  {
    id: 'faq-3',
    question: 'Can citizens track repair progress in real time?',
    answer:
      'Yes. Every submitted incident generates a tracking ID (e.g., #CP-1024) with a live 6-stage telemetry timeline: Submitted → Verified → Assigned → In Progress → Photo Verified → Resolved.',
  },
  {
    id: 'faq-4',
    question: 'How do department managers assign work orders?',
    answer:
      'Department managers access the dedicated Dispatch Hub to review incident severity, check on-duty field crew capacity, and dispatch work orders with turn-by-turn navigation coordinates to technician mobile devices.',
  },
  {
    id: 'faq-5',
    question: 'How does city leadership monitor department performance?',
    answer:
      'The Administrator Portal aggregates real-time Ward-by-Ward SLA completion rates, department response heatmaps, and citizen satisfaction ratings to guide seasonal municipal budget allocation.',
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-midnight text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header matching Verdona */}
        <div className="anim-faq-header text-center space-y-4 mb-16">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full border border-white/20 text-white/90 text-xs font-mono font-bold uppercase tracking-wider bg-white/10">
              FAQs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Still Have Questions?
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about reporting civic incidents, tracking department progress, and
            empowering your community.
          </p>
        </div>

        {/* Accordion Stack matching Verdona's white pill cards in dark section */}
        <div className="space-y-4 anim-faq-list">
          {FAQS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1B2435] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700/80"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 text-brand-midnight dark:text-white hover:text-brand-cobalt dark:hover:text-brand-yellow transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold font-display tracking-tight leading-snug">
                    {item.question}
                  </span>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-midnight dark:text-white transition-transform">
                    {isOpen ? <X size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm text-[#4B5568] dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/80 pt-4 animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
