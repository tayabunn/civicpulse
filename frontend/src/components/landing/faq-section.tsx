'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, X, ChevronDown } from 'lucide-react';

type FAQCategory = 'All' | 'Reporting' | 'Dispatch' | 'Tracking' | 'Governance';

interface FAQItem {
  id: string;
  category: Exclude<FAQCategory, 'All'>;
  question: string;
  answer: string;
  image: string;
  caption: string;
}

const CATEGORIES: FAQCategory[] = ['All', 'Reporting', 'Dispatch', 'Tracking', 'Governance'];

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Reporting',
    question: 'What municipal issues does CivicPulse cover?',
    answer:
      'CivicPulse covers damaged roads, broken footpaths and sidewalks, streetlighting outages, monsoon waterlogging and drainage blockages, uncollected domestic and commercial waste, and public park amenities.',
    image: '/about-road-works.jpg',
    caption: 'Municipal Civil & Road Infrastructure',
  },
  {
    id: 'faq-2',
    category: 'Reporting',
    question: 'How does the duplicate detection radar work?',
    answer:
      'When you submit an issue, our automated Haversine radar calculates spatial proximity against active unresolved reports. If an issue is within 50 meters in the same category, you are alerted to upvote instead of creating duplicate tickets.',
    image: '/about-gis-dispatch.jpg',
    caption: '50m Automated Geospatial Proximity Radar',
  },
  {
    id: 'faq-3',
    category: 'Tracking',
    question: 'Can citizens track repair progress in real time?',
    answer:
      'Yes. Every submitted incident generates a tracking ID (e.g., #CP-1024) with a live 6-stage telemetry timeline: Submitted → Verified → Assigned → In Progress → Photo Verified → Resolved.',
    image: '/about-emergency-response.jpg',
    caption: '6-Stage Real-Time Telemetry Timeline',
  },
  {
    id: 'faq-4',
    category: 'Dispatch',
    question: 'How do department managers assign work orders?',
    answer:
      'Department managers access the dedicated Dispatch Hub to review incident severity, check on-duty field crew capacity, and dispatch work orders with turn-by-turn navigation coordinates to technician mobile devices.',
    image: '/about-gis-dispatch.jpg',
    caption: 'Department Dispatch & Field Crew Routing',
  },
  {
    id: 'faq-5',
    category: 'Governance',
    question: 'How does city leadership monitor department performance?',
    answer:
      'The Administrator Portal aggregates real-time Ward-by-Ward SLA completion rates, department response heatmaps, and citizen satisfaction ratings to guide seasonal municipal budget allocation.',
    image: '/about-road-works.jpg',
    caption: 'Citywide SLA Scorecards & Ward Heatmaps',
  },
  {
    id: 'faq-6',
    category: 'Tracking',
    question: 'How are field repairs verified before closing a ticket?',
    answer:
      'Maintenance technicians upload geotagged before-and-after repair photos directly from the field app, allowing dispatchers and citizens to verify physical completion prior to case closure.',
    image: '/about-emergency-response.jpg',
    caption: 'Geotagged Before & After Photo Audit',
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus FAQ search, Escape to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const triggers = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]'));
    const currentIndex = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1 || !triggers.length) return;
    e.preventDefault();
    const nextIndex =
      e.key === 'ArrowDown' ? (currentIndex + 1) % triggers.length : (currentIndex - 1 + triggers.length) % triggers.length;
    triggers[nextIndex]?.focus();
  };

  return (
    <section id="faqs" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#305dff] text-white font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 1st Image Header: Texts & Design Style Unchanged */}
        <div className="anim-faq-header text-center max-w-3xl mx-auto space-y-2 mb-12 lg:mb-14">
          <div>
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-white/35 bg-white/10 text-white text-base font-sans font-medium transition-colors">
              FAQs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight transition-colors">
            Still Have Questions?
          </h2>
          <p className="text-base sm:text-lg text-blue-50 leading-relaxed font-sans font-normal transition-colors">
            Everything you need to know about reporting civic incidents, tracking department progress, and
            empowering your community.
          </p>
        </div>

        {/* 2nd Image Area: Redesigned Unified Interactive FAQ Container (matching faq.mp4) */}
        <div className="anim-faq-list rounded-[28px] bg-white dark:bg-[#141D2F] text-[#142038] dark:text-white p-5 sm:p-8 shadow-[0_24px_64px_-16px_rgba(12,24,72,0.32)] border border-white/20 dark:border-white/10 transition-colors">
          {/* Search Bar with ⌘K Shortcut & Clear Button */}
          <div className="relative mb-5">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search FAQ questions"
              className="w-full h-12 pl-11 pr-14 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-[#F7F5EF]/60 dark:bg-[#1B2435]/80 text-sm sm:text-[15px] font-sans text-[#142038] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#315CFF] dark:focus:border-[#7D96FF] transition-colors"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-sans font-medium text-slate-400 dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Animated Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4" role="tablist" aria-label="FAQ categories">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenId(null);
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-sans font-medium transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? 'text-white dark:text-[#142038]'
                      : 'bg-slate-100/90 dark:bg-white/[0.06] text-[#142038]/75 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.12]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="faq-active-category-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-[#142038] dark:bg-white z-0"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Question Count */}
          <div className="text-xs font-sans font-medium text-slate-400 dark:text-slate-400 pb-3 border-b border-slate-200/80 dark:border-white/10">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
          </div>

          {/* Accordion List with Smooth Layout & Answer+Visual Transitions */}
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm font-sans text-text-secondary dark:text-slate-400">
                No matching questions found for &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#142038] dark:bg-[#315CFF] text-white text-xs font-sans font-medium hover:opacity-90 transition-opacity"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80 dark:divide-white/10" onKeyDown={handleListKeyDown}>
              <AnimatePresence initial={false}>
                {filteredFaqs.map((item) => {
                  const isOpen = openId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout={!prefersReducedMotion}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        data-faq-trigger=""
                        onClick={() => toggle(item.id)}
                        aria-expanded={isOpen}
                        className="w-full text-left py-4 sm:py-5 px-1 flex items-center justify-between gap-4 group focus:outline-none cursor-pointer"
                      >
                        <span
                          className={`text-sm sm:text-base font-semibold font-display tracking-tight leading-snug transition-colors duration-200 ${
                            isOpen
                              ? 'text-[#315CFF] dark:text-brand-yellow'
                              : 'text-[#142038] dark:text-white group-hover:text-[#315CFF] dark:group-hover:text-brand-yellow'
                          }`}
                        >
                          {item.question}
                        </span>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.07] text-[11px] font-sans font-medium text-slate-500 dark:text-slate-300">
                            {item.category}
                          </span>
                          <motion.span
                            animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                              isOpen
                                ? 'bg-[#315CFF]/10 text-[#315CFF] dark:bg-brand-yellow/15 dark:text-brand-yellow'
                                : 'text-slate-400 dark:text-slate-400 group-hover:text-[#142038] dark:group-hover:text-white'
                            }`}
                          >
                            <ChevronDown size={17} />
                          </motion.span>
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="faq-answer"
                            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
                              opacity: { duration: 0.24, ease: 'easeOut' },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-1 pb-6 space-y-4">
                              <p className="text-sm text-[#4B5568] dark:text-slate-300 leading-relaxed font-sans">
                                {item.answer}
                              </p>

                              {/* Visual Preview Card matching faq.mp4 expanded media panel */}
                              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-white/10">
                                <Image
                                  src={item.image}
                                  alt={item.caption}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, 720px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#142038]/85 via-[#142038]/20 to-transparent" />
                                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-2 text-white">
                                  <span className="text-xs font-sans font-medium text-white/95">
                                    {item.caption}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-sans font-medium text-brand-yellow border border-white/15">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
