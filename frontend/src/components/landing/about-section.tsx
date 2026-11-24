'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Check, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { PartnersTicker } from './partners-ticker';

const SLIDES = [
  {
    image: '/about-road-works.jpg',
    title: 'On-Ground Road & Civil Works',
    tag: 'Rapid Field Crew',
  },
  {
    image: '/about-emergency-response.jpg',
    title: 'Emergency Response & Safety',
    tag: 'Municipal Patrol',
  },
  {
    image: '/about-gis-dispatch.jpg',
    title: 'Central GIS Dispatch Operations',
    tag: 'City Command',
  },
];

/**
 * Verdona-Style Dynamic Number Count-Up Effect on Scroll
 * Decelerates smoothly with easeOutExpo curve matching Verdona Framer animation.
 */
interface CountUpNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatComma?: boolean;
}

function CountUpNumber({
  value,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatComma = false,
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Graceful fallback for SSR and non-browser test runners
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setDisplayValue(value);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Verdona / Framer signature easeOutExpo curve
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = ease * value;
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [value, duration]);

  const formattedNumber =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : formatComma
      ? Math.round(displayValue).toLocaleString()
      : Math.round(displayValue).toString();

  return (
    <span ref={ref} className="inline-block tabular-nums transition-opacity duration-300">
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="about"
      className="py-20 lg:py-28 bg-brand-warmWhite dark:bg-[#0B0F17] transition-colors duration-300 font-sans"
    >
      <div className="w-[80%] mx-auto">
        {/* Main 2-Column Split Grid - items-stretch guarantees equal column height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch mb-16">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Dedicated Mission, Checklist & Action Button */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 lg:border-r border-slate-200/90 dark:border-slate-800/90 lg:pr-12 xl:pr-16 flex flex-col justify-between space-y-7">
            <div className="space-y-6">
              {/* Category Pill Badge (Increased height + Transparent fill) */}
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-16px font-sans font-medium transition-colors">
                  About Us
                </span>
              </div>

              {/* Authoritative Core Headline (Manrope Font with increased line spacing) */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold font-sans tracking-tight text-brand-midnight dark:text-white leading-[1.32] sm:leading-[1.3] transition-colors">
                We are dedicated to protecting and serving our community with integrity, professionalism,
                and commitment.
              </h2>

              {/* Editorial Narrative Paragraph (Manrope Font) */}
              <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
                CivicPulse is a modern municipal infrastructure partner helping city authorities manage urban
                grids sustainably, accelerate emergency repair turnarounds, and build resilient operations
                for the long term.
              </p>

              {/* Checkmark Feature List (Manrope Font) */}
              <div className="space-y-3 pt-1">
                {[
                  'Fast Emergency & Hazard Response',
                  'Transparent Community Engagement',
                  'Sub-Meter Infrastructure Accountability',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center shrink-0">
                      <Check size={13} className="stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-brand-midnight dark:text-slate-100 font-sans transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button & Navigation Link pinned at the bottom line */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="#contact">
                <Button
                  size="lg"
                  className="bg-[#315CFF] text-white hover:bg-[#244BE0] active:scale-[0.98] font-semibold font-sans px-8 h-12 text-base rounded-full shadow-md transition-all"
                >
                  Contact us
                </Button>
              </Link>
              <Link
                href="#services"
                className="text-sm font-semibold font-sans text-brand-midnight dark:text-slate-200 hover:text-[#315CFF] dark:hover:text-brand-yellow transition-colors inline-flex items-center gap-1.5 px-3 py-2"
              >
                Explore Services
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Operational Narrative, Hero 200+, Metrics & Duo */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-7">
            <div className="space-y-6">
              {/* Top Operational Context (Manrope Font) */}
              <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
                Our municipal crews and dispatchers work around the clock to safeguard city grids, deliver
                fast emergency response, and build a safer community for all.
              </p>

              {/* Giant 200+ Metric Display with Verdona Count-Up Animation */}
              <div className="pt-0.5">
                <div className="text-8xl sm:text-9xl lg:text-[116px] font-normal font-serif text-[#315CFF] leading-none tracking-tight">
                  <CountUpNumber value={200} suffix="+" duration={1900} />
                </div>
                <p className="text-xs sm:text-sm font-sans font-semibold uppercase tracking-wider text-text-muted dark:text-slate-400 mt-2.5">
                  Municipal Wards & Active Infrastructure Zones Connected
                </p>
              </div>

              {/* Supporting Operational Metrics Strip with Verdona Count-Up Animation */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-slate-200/90 dark:border-slate-800/90 py-5 transition-colors">
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-normal font-serif text-brand-midnight dark:text-white leading-none">
                    <CountUpNumber value={94.2} decimals={1} suffix="%" duration={1800} />
                  </div>
                  <div className="text-sm sm:text-base font-bold font-sans text-[#315CFF] mt-1.5 leading-tight">
                    SLA Resolution
                  </div>
                  <div className="text-xs sm:text-sm font-sans font-medium text-text-muted dark:text-slate-400 leading-snug">
                    Within 24 hours
                  </div>
                </div>
                <div className="space-y-1 border-x border-slate-200/80 dark:border-slate-800/80 px-2.5 sm:px-4">
                  <div className="text-3xl sm:text-4xl font-normal font-serif text-brand-midnight dark:text-white leading-none">
                    <CountUpNumber value={18} prefix="< " suffix="m" duration={1800} />
                  </div>
                  <div className="text-sm sm:text-base font-bold font-sans text-[#315CFF] mt-1.5 leading-tight">
                    Fast Dispatch
                  </div>
                  <div className="text-xs sm:text-sm font-sans font-medium text-text-muted dark:text-slate-400 leading-snug">
                    Emergency triage
                  </div>
                </div>
                <div className="space-y-1 pl-1.5 sm:pl-3">
                  <div className="text-3xl sm:text-4xl font-normal font-serif text-brand-midnight dark:text-white leading-none">
                    <CountUpNumber value={99.8} decimals={1} suffix="%" duration={1800} />
                  </div>
                  <div className="text-sm sm:text-base font-bold font-sans text-[#315CFF] mt-1.5 leading-tight">
                    GPS Accuracy
                  </div>
                  <div className="text-xs sm:text-sm font-sans font-medium text-text-muted dark:text-slate-400 leading-snug">
                    Sub-meter verified
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Visual Duo: Slider Photo Card + Dark Metric Card pinned at bottom line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 mt-auto">
              {/* Photo Card with Pagination Dots */}
              <div className="relative rounded-3xl overflow-hidden h-[220px] sm:h-[245px] shadow-md border-2 border-white dark:border-slate-800 bg-slate-900 group">
                <Image
                  src={SLIDES[activeSlide].image}
                  alt={SLIDES[activeSlide].title}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

                {/* Photo Caption Tag (Dark High-Contrast Badge) */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white border border-white/20 shadow-md">
                    {SLIDES[activeSlide].tag}
                  </span>
                </div>

                <div className="absolute bottom-7 left-3.5 right-3.5 text-white">
                  <p className="text-xs sm:text-sm font-semibold font-sans leading-tight line-clamp-1">
                    {SLIDES[activeSlide].title}
                  </p>
                </div>

                {/* 3 Pagination Dots */}
                <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === idx
                          ? 'w-6 bg-brand-yellow'
                          : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dark Metric Card with Verdona Count-Up Animation */}
              <div className="rounded-3xl p-5 h-[220px] sm:h-[245px] bg-brand-midnight dark:bg-[#151D2A] text-white flex flex-col justify-between shadow-xl border border-white/10 relative overflow-hidden group">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-brand-yellow">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <Activity size={11} className="animate-pulse" />
                    <span>Live Audit</span>
                  </div>
                </div>

                {/* Main Hero Stat: 5,000+ with Verdona Count-Up (Instrument Serif) & Description (Manrope) */}
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl lg:text-[42px] font-normal font-serif tracking-tight text-white leading-none">
                    <CountUpNumber value={5000} formatComma={true} suffix="+" duration={2100} />
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-snug line-clamp-2">
                    Emergency calls & civic issues handled every month.
                  </p>
                </div>

                {/* Verified Footer Bar (Manrope Font) */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-sans text-brand-yellow/90">
                  <span className="font-medium">Photo Verified</span>
                  <span className="font-bold text-white">100% Audited</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM: "Our Trusted Partners" Logo Strip (Manrope Font) */}
        {/* ======================================================== */}
        <div className="pt-10 transition-colors">
          <PartnersTicker />
        </div>
      </div>
    </section>
  );
}
