'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { TESTIMONIAL } from './data';

interface TestimonialEntry {
  quote: string;
  author: string;
  role: string;
  organization: string;
  avatarUrl: string;
}

const TESTIMONIALS: TestimonialEntry[] = [
  TESTIMONIAL,
  {
    quote:
      'Automated 50-meter duplicate clustering cut dispatch noise by half. Our field crews arrive with exact GPS pins and resolve hazards before rush hour.',
    author: 'Nusrat Jahan',
    role: 'Senior Dispatch Operations Lead',
    organization: 'Dhaka North Utility Grid',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'Reporting a broken streetlight or waterlogged drain takes thirty seconds, and neighbors can follow every verification photo live until completion.',
    author: 'Tariqul Hasan',
    role: 'Neighborhood Safety Coordinator',
    organization: 'Uttara Sector 3 Civic Forum',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
  },
];

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Magnetic mouse parallax for oversized Instrument Serif index number
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const numberX = useTransform(x, [-220, 220], [-20, 20]);
  const numberY = useTransform(y, [-220, 220], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
  };

  const goNext = () => setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = TESTIMONIALS[activeIndex];
  const progressPercent = ((activeIndex + 1) / TESTIMONIALS.length) * 100;

  return (
    <section
      id="testimonials"
      className="relative pt-24 pb-28 lg:pt-32 lg:pb-36 bg-brand-warmWhite dark:bg-[#0B0F17] border-b border-brand-coolGray dark:border-white/10 overflow-hidden transition-colors duration-300 font-sans"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        className="anim-testimonial-card relative w-[84%] xl:w-[80%] max-w-6xl mx-auto"
      >
        {/* Oversized Instrument Serif Index Number with Magnetic Parallax */}
        <motion.div
          aria-hidden="true"
          className="hidden sm:block absolute -left-4 lg:-left-10 top-1/2 -translate-y-1/2 text-[14rem] md:text-[20rem] lg:text-[25rem] font-normal font-serif text-[#315CFF]/[0.06] dark:text-[#6280FF]/[0.08] select-none pointer-events-none leading-none tracking-tight"
          style={prefersReducedMotion ? undefined : { x: numberX, y: numberY }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, filter: 'blur(8px)' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Asymmetric Editorial Layout */}
        <div className="relative z-10 flex flex-col md:flex-row">
          {/* Left Column: Vertical Label & Animated Cobalt Progress Rail (Desktop) */}
          <div className="hidden md:flex flex-col items-center justify-center pr-10 lg:pr-16 border-r border-slate-200/90 dark:border-white/10 shrink-0">
            <motion.span
              className="text-xs font-sans font-semibold text-[#315CFF] dark:text-[#7D96FF] tracking-[0.2em] uppercase"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              Testimonials
            </motion.span>

            <div className="relative h-32 w-px bg-slate-200 dark:bg-slate-800 mt-8 overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 left-0 w-full bg-[#315CFF] dark:bg-brand-yellow origin-top"
                animate={{ height: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <span className="font-serif text-lg text-[#142038]/60 dark:text-slate-400 mt-4 tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="text-xs opacity-60">/{String(TESTIMONIALS.length).padStart(2, '0')}</span>
            </span>
          </div>

          {/* Mobile Header Bar */}
          <div className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-slate-200/90 dark:border-white/10">
            <span className="inline-flex items-center justify-center px-4 h-8 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 text-[#315CFF] dark:text-[#6280FF] text-sm font-sans font-medium">
              Testimonials
            </span>
            <span className="font-serif text-xl text-[#142038] dark:text-white tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="text-sm text-slate-400">/{String(TESTIMONIALS.length).padStart(2, '0')}</span>
            </span>
          </div>

          {/* Center / Main Editorial Content */}
          <div className="flex-1 md:pl-10 lg:pl-16 py-2 sm:py-6">
            {/* Organization Pill Badge matching What We Offer / Portals & Access */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="mb-7 sm:mb-8"
              >
                <span className="inline-flex items-center gap-2.5 px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-white/70 dark:bg-white/[0.04] text-[#315CFF] dark:text-[#7D96FF] text-sm sm:text-base font-sans font-medium transition-colors">
                  <span className="w-2 h-2 rounded-full bg-brand-yellow ring-2 ring-[#315CFF]/20 shrink-0" />
                  <span>{current.organization}</span>
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Kinetic Word-by-Word Quote in Instrument Serif Italic */}
            <div className="relative mb-10 sm:mb-12 min-h-[140px] sm:min-h-[168px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeIndex}
                  className="text-2xl sm:text-4xl lg:text-[42px] font-serif italic font-normal text-brand-midnight dark:text-white leading-[1.24] tracking-tight"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  &ldquo;
                  {current.quote.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.26em]"
                      variants={
                        prefersReducedMotion
                          ? {
                              hidden: { opacity: 0 },
                              visible: { opacity: 1, transition: { duration: 0.25 } },
                              exit: { opacity: 0, transition: { duration: 0.15 } },
                            }
                          : {
                              hidden: { opacity: 0, y: 18, rotateX: 75 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                rotateX: 0,
                                transition: {
                                  duration: 0.48,
                                  delay: i * 0.032,
                                  ease: [0.22, 1, 0.36, 1],
                                },
                              },
                              exit: {
                                opacity: 0,
                                y: -8,
                                transition: { duration: 0.18, delay: i * 0.01 },
                              },
                            }
                      }
                    >
                      {word}
                    </motion.span>
                  ))}
                  &rdquo;
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author Row & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  className="flex items-center gap-4"
                >
                  {/* Animated Accent Line */}
                  <motion.div
                    className="hidden sm:block w-8 h-0.5 bg-[#315CFF] dark:bg-brand-yellow rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    style={{ originX: 0 }}
                  />

                  {/* Author Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-yellow shadow-md ring-2 ring-[#315CFF]/15 shrink-0">
                    <Image
                      src={current.avatarUrl}
                      alt={current.author}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  {/* Author Name & Role in Manrope */}
                  <div>
                    <p className="text-base sm:text-lg font-bold font-display text-brand-midnight dark:text-white leading-tight">
                      {current.author}
                    </p>
                    <p className="text-xs sm:text-sm font-sans font-medium text-text-secondary dark:text-slate-300 mt-0.5">
                      {current.role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Navigation Buttons matching CivicPulse Pills */}
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  whileTap={{ scale: 0.94 }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-300/90 dark:border-white/15 bg-white dark:bg-[#141D2F] text-brand-midnight dark:text-white hover:bg-[#315CFF] hover:border-[#315CFF] hover:text-white dark:hover:bg-[#315CFF] dark:hover:border-[#315CFF] shadow-sm transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonial"
                  whileTap={{ scale: 0.94 }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-300/90 dark:border-white/15 bg-white dark:bg-[#141D2F] text-brand-midnight dark:text-white hover:bg-[#315CFF] hover:border-[#315CFF] hover:text-white dark:hover:bg-[#315CFF] dark:hover:border-[#315CFF] shadow-sm transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Municipal Organizations Ticker */}
      <div
        aria-hidden="true"
        className="mt-14 lg:mt-16 overflow-hidden opacity-[0.05] dark:opacity-[0.06] pointer-events-none select-none"
      >
        <motion.div
          className="flex whitespace-nowrap text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-brand-midnight dark:text-white"
          animate={prefersReducedMotion ? undefined : { x: [0, -1000] }}
          transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-6">
              {TESTIMONIALS.map((t) => t.organization).join(' • ')} •
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
