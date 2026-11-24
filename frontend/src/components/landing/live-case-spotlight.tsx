'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/button';
import { MapPin, Clock, Building2, Check, ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const TIMELINE_STEPS = [
  {
    step: '01',
    status: 'Submitted',
    detail: 'Citizen reported pothole via smartphone with photo and sub-meter GPS pin.',
    time: '10:15 AM',
    progress: 17,
  },
  {
    step: '02',
    status: 'Under Review',
    detail: 'Roads & Highways Department verified report, confirmed no duplicates in 50m radius.',
    time: '10:40 AM',
    progress: 34,
  },
  {
    step: '03',
    status: 'Assigned',
    detail: 'Work order dispatched to Mobile Maintenance Crew #03 with asphalt equipment.',
    time: '11:15 AM',
    progress: 52,
  },
  {
    step: '04',
    status: 'In Progress',
    detail: 'Field crew arrived at Central Avenue coordinates. Surface milling underway.',
    time: '01:30 PM',
    progress: 68,
  },
  {
    step: '05',
    status: 'Resolved',
    detail: 'Post-repair photo evidence uploaded and verified by department manager.',
    time: 'Est. in 2h',
    progress: 86,
  },
  {
    step: '06',
    status: 'Closed',
    detail: 'Citizen notified on mobile and 5-star resolution feedback recorded.',
    time: 'Pending',
    progress: 100,
  },
];

export function LiveCaseSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);
  const isSyncingScrollRef = useRef(false);
  const syncTimerRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const currentStep = TIMELINE_STEPS[activeIndex];
  const progressRatio = (activeIndex + 1) / TIMELINE_STEPS.length;

  const { contextSafe } = useGSAP(
    () => {
      const animateStepVisuals = (idx: number, immediate = false) => {
        const nextRatio = (idx + 1) / TIMELINE_STEPS.length;
        const nextProgress = TIMELINE_STEPS[idx].progress / 100;
        const duration = immediate ? 0 : 0.45;

        gsap.to('.spotlight-rail-fill', {
          scaleY: nextRatio,
          duration,
          ease: 'power3.out',
          transformOrigin: 'top center',
          overwrite: 'auto',
        });

        gsap.to('.spotlight-meter-fill', {
          scaleX: nextProgress,
          duration,
          ease: 'power3.out',
          transformOrigin: 'left center',
          overwrite: 'auto',
        });

        if (!immediate) {
          gsap.fromTo(
            `.spotlight-node-${idx}`,
            { scale: 0.988 },
            { scale: 1, duration: 0.28, ease: 'back.out(2)', overwrite: 'auto' }
          );
        }
      };

      const mm = gsap.matchMedia();
      let reduceMotion = false;

      mm.add('(prefers-reduced-motion: reduce)', () => {
        reduceMotion = true;
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Header entrance on scroll
        gsap.from('.spotlight-header-item', {
          y: 26,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 86%',
            once: true,
          },
        });

        // 2. Main bento cards entrance before pin locks
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.spotlight-grid',
            start: 'top 84%',
            once: true,
          },
        });

        entranceTl
          .from('.spotlight-dossier', {
            y: 34,
            scale: 0.97,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          })
          .from(
            '.spotlight-timeline-card',
            {
              y: 34,
              opacity: 0,
              duration: 0.7,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
            '-=0.5'
          )
          .from(
            '.spotlight-node',
            {
              x: -16,
              opacity: 0,
              duration: 0.4,
              stagger: 0.06,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
            },
            '-=0.5'
          );
      });

      // 3. Scroll-driven step progression (forward completes tasks 01 -> 06, backward reverses 06 -> 01)
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: () => {
          const el = sectionRef.current;
          if (!el) return 'top top';
          return el.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom';
        },
        end: '+=1200',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (isSyncingScrollRef.current) return;
          const nextIdx = Math.min(
            TIMELINE_STEPS.length - 1,
            Math.max(0, Math.floor(self.progress * TIMELINE_STEPS.length))
          );
          if (nextIdx !== activeIndexRef.current) {
            activeIndexRef.current = nextIdx;
            setActiveIndex(nextIdx);
            animateStepVisuals(nextIdx, reduceMotion);
          }
        },
      });

      scrollTriggerRef.current = st;

      return () => {
        if (syncTimerRef.current !== null) {
          window.clearTimeout(syncTimerRef.current);
        }
        scrollTriggerRef.current = null;
      };
    },
    { scope: sectionRef }
  );

  // Manual click handler: jumps immediately to the selected step and syncs ScrollTrigger position when pinned
  const handleSelectStep = contextSafe((idx: number) => {
    activeIndexRef.current = idx;
    setActiveIndex(idx);

    const nextRatio = (idx + 1) / TIMELINE_STEPS.length;
    const nextProgress = TIMELINE_STEPS[idx].progress / 100;

    gsap.to('.spotlight-rail-fill', {
      scaleY: nextRatio,
      duration: 0.45,
      ease: 'power3.out',
      transformOrigin: 'top center',
      overwrite: 'auto',
    });

    gsap.to('.spotlight-meter-fill', {
      scaleX: nextProgress,
      duration: 0.45,
      ease: 'power3.out',
      transformOrigin: 'left center',
      overwrite: 'auto',
    });

    gsap.fromTo(
      `.spotlight-node-${idx}`,
      { scale: 0.988 },
      { scale: 1, duration: 0.28, ease: 'back.out(2)', overwrite: 'auto' }
    );

    const st = scrollTriggerRef.current;
    if (st && st.isActive) {
      const targetProgress = (idx + 0.5) / TIMELINE_STEPS.length;
      const targetScrollY = st.start + (st.end - st.start) * targetProgress;

      isSyncingScrollRef.current = true;
      window.scrollTo({ top: targetScrollY, behavior: 'instant' as ScrollBehavior });

      if (syncTimerRef.current !== null) {
        window.clearTimeout(syncTimerRef.current);
      }
      syncTimerRef.current = window.setTimeout(() => {
        isSyncingScrollRef.current = false;
      }, 60);
    }
  });

  return (
    <section
      ref={sectionRef}
      id="telemetry"
      className="pt-24 pb-14 lg:pt-28 lg:pb-16 bg-white dark:bg-[#0B0F17] border-b border-brand-coolGray dark:border-white/10 transition-colors duration-300 font-sans"
    >
      <div className="w-[80%] mx-auto">
        {/* Section Header matching What We Offer & Our Dedicated Portals */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-10 lg:mb-12">
          <div className="spotlight-header-item">
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-base font-sans font-medium transition-colors">
              Real-Time Resolution Flow
            </span>
          </div>
          <h2 className="spotlight-header-item text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
            Know Where Every Report Stands
          </h2>
          <p className="spotlight-header-item text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
            Complete transparency from initial report submission to asphalt compaction. No hidden paperwork,
            no lost reports.
          </p>
        </div>

        {/* 2-Column Minimal Interactive Bento Layout */}
        <div className="spotlight-grid max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT COLUMN: Minimal Dark Case Card */}
          <div className="spotlight-dossier lg:col-span-5 rounded-[28px] bg-gradient-to-br from-[#1C2742] via-[#151F36] to-[#0E1629] text-white p-8 sm:p-9 flex flex-col justify-between shadow-[0_22px_50px_-16px_rgba(20,32,56,0.35)]">
            <div className="space-y-6">
              {/* Minimal Eyebrow */}
              <div className="flex items-center justify-between gap-2 text-sm font-sans font-medium text-white/75">
                <div className="flex items-center gap-2">
                  <span className="font-sans tabular-nums text-xs font-semibold text-white/65">#CP-1024</span>
                  <span className="opacity-40">•</span>
                  <span>Active Incident</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-brand-yellow">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
                  {currentStep.status}
                </span>
              </div>

              {/* Focal Title */}
              <h3 className="text-2xl sm:text-[30px] font-semibold font-display text-white tracking-tight leading-[1.18]">
                Deep road cavity near road crossing
              </h3>

              {/* Open Minimal Metadata */}
              <div className="space-y-2.5 text-sm font-sans text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-brand-yellow/85 shrink-0" />
                  <span>Sector 3, Uttara, Dhaka</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 size={15} className="text-brand-yellow/85 shrink-0" />
                  <span>Roads &amp; Highways • Crew #03</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-brand-yellow/85 shrink-0" />
                  <span>Updated {currentStep.time}</span>
                </div>
              </div>
            </div>

            {/* Clean Progress Metric & Pill CTA */}
            <div className="pt-8 space-y-6">
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-sans font-medium text-white/65">
                    Resolution progress • Stage {currentStep.step} of 06
                  </span>
                  <span className="text-4xl font-normal font-serif text-brand-yellow leading-none tabular-nums">
                    {currentStep.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="spotlight-meter-fill h-full w-full rounded-full bg-brand-yellow"
                    style={{ transform: `scaleX(${currentStep.progress / 100})`, transformOrigin: 'left center' }}
                  />
                </div>
              </div>

              <Link href="/citizen/create" className="block">
                <Button className="w-full justify-between font-sans font-medium text-sm rounded-full h-11 px-6 bg-[#315CFF] hover:bg-[#244BE0] text-white active:scale-[0.98] transition-all">
                  <span>Report Incident Nearby</span>
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Minimal Soft Lime Timeline Card (#e2fa6b) */}
          <div className="spotlight-timeline-card lg:col-span-7 rounded-[28px] bg-[#e2fa6b] dark:bg-[#141D2F] p-8 sm:p-9 flex flex-col justify-between transition-colors shadow-[0_12px_36px_rgba(20,32,56,0.08)]">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <div>
                <h4 className="text-xl sm:text-2xl font-medium font-display text-[#142038] dark:text-white tracking-tight">
                  Live Resolution Timeline
                </h4>
                <p className="text-xs sm:text-sm font-sans text-[#2D3816]/80 dark:text-slate-400 mt-1">
                  Scroll or click any stage to track workflow progress
                </p>
              </div>
              <span className="font-serif text-2xl text-[#142038] dark:text-white leading-none tabular-nums">
                {currentStep.step}
                <span className="text-base text-[#142038]/45 dark:text-slate-500">/06</span>
              </span>
            </div>

            {/* Open Minimal Timeline Steps */}
            <div className="relative pt-1 space-y-1.5">
              {/* Hairline Track & GSAP Animated Fill Rail */}
              <div
                aria-hidden="true"
                className="absolute left-[25px] top-[28px] bottom-[34px] w-0.5 bg-[#142038]/15 dark:bg-slate-700/70 rounded-full"
              >
                <div
                  className="spotlight-rail-fill w-full h-full bg-[#142038] dark:bg-[#315CFF] rounded-full"
                  style={{ transform: `scaleY(${progressRatio})`, transformOrigin: 'top center' }}
                />
              </div>

              {TIMELINE_STEPS.map((item, idx) => {
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => handleSelectStep(idx)}
                    className={`spotlight-node spotlight-node-${idx} w-full text-left flex items-start gap-4 relative rounded-2xl px-3 py-2.5 transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#142038]/[0.08] dark:bg-white/[0.06]'
                        : 'hover:bg-[#142038]/[0.04] dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Minimal Circle Node */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-sans tabular-nums text-[11px] font-semibold shrink-0 mt-0.5 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#142038] dark:bg-emerald-500 text-[#e2fa6b] dark:text-white'
                          : isActive
                          ? 'bg-[#142038] dark:bg-[#315CFF] text-[#e2fa6b] dark:text-white ring-4 ring-[#142038]/15 dark:ring-[#315CFF]/30'
                          : 'bg-[#e2fa6b] dark:bg-slate-800 text-[#142038]/45 dark:text-slate-500 border border-[#142038]/20 dark:border-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check size={13} strokeWidth={2.75} /> : item.step}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <span
                          className={`text-sm sm:text-[15px] font-semibold font-display transition-colors ${
                            isActive
                              ? 'text-[#142038] dark:text-brand-yellow'
                              : isCompleted
                              ? 'text-[#142038] dark:text-slate-100'
                              : 'text-[#142038]/50 dark:text-slate-500'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span
                          className={`text-xs font-sans shrink-0 ${
                            isActive
                              ? 'font-semibold text-[#142038] dark:text-brand-yellow'
                              : 'text-[#2D3816]/60 dark:text-slate-500'
                          }`}
                        >
                          {item.time}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-[13px] font-sans leading-relaxed transition-colors ${
                          isActive || isCompleted
                            ? 'text-[#2D3816]/85 dark:text-slate-300'
                            : 'text-[#2D3816]/50 dark:text-slate-500'
                        }`}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
