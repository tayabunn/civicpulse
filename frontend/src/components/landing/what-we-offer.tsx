'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WHAT_WE_OFFER } from './data';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function WhatWeOffer() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const section = sectionRef.current;

      const getScrollDistance = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };

      // Horizontal translation tween for cards track (right to left)
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none', // Critical for 1:1 smooth scroll tracking
      });

      // Pin section and scrub horizontally on vertical scroll
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollDistance() + 350}`,
        pin: true,
        scrub: 1.2, // Silky smooth interpolation
        anticipatePin: 1,
        animation: horizontalTween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
          }
          if (counterRef.current) {
            const currentIdx = Math.min(
              WHAT_WE_OFFER.length,
              Math.max(1, Math.round(self.progress * (WHAT_WE_OFFER.length - 1)) + 1)
            );
            counterRef.current.textContent = `0${currentIdx} / 0${WHAT_WE_OFFER.length}`;
          }
        },
      });

      // Refresh positions once DOM and images settle
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      return () => {
        clearTimeout(refreshTimer);
        st.kill();
        horizontalTween.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-14 bg-brand-warmWhite dark:bg-[#0B0F17] overflow-hidden font-sans border-b border-brand-coolGray dark:border-white/10 transition-colors duration-300"
    >
      {/* Section Header matching About Us style & CivicPulse identity */}
      <div className="w-[80%] mx-auto mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="anim-offer-header space-y-3 max-w-2xl">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-sm font-sans font-normal transition-colors">
                Services
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              What We Offer
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              From damaged roads to overflowing drainage systems, report everyday problems affecting your
              neighborhood and bring them directly to the attention of municipal teams.
            </p>
          </div>

          {/* Interactive Scroll Guide & Live Progress Indicator */}
          <div className="hidden sm:flex flex-col items-end gap-2.5 shrink-0 pb-1">
            <div className="flex items-center gap-3">
              <span ref={counterRef} className="text-xs font-mono font-bold text-[#315CFF] dark:text-[#6280FF]">
                01 / 0{WHAT_WE_OFFER.length}
              </span>
              <span className="text-xs font-mono font-semibold text-text-muted dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Scroll to explore</span>
                <span className="inline-block animate-pulse">→</span>
              </span>
            </div>
            <div className="w-44 h-1.5 rounded-full bg-slate-200/90 dark:bg-slate-800 overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-[#315CFF] rounded-full transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Cards Track (GSAP Smooth Scroll on Scroll) */}
      <div className="w-full overflow-hidden py-2 select-none">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 items-stretch flex-nowrap pl-4 sm:pl-8 lg:pl-[10%] pr-4 sm:pr-8 lg:pr-[10%] will-change-transform"
        >
          {WHAT_WE_OFFER.map((item) => (
            <Link
              key={item.id}
              href="/citizen/create"
              className="group relative rounded-3xl overflow-hidden w-[290px] sm:w-[350px] md:w-[380px] lg:w-[410px] shrink-0 h-[340px] sm:h-[370px] lg:h-[390px] bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 active:scale-[0.98]"
            >
              {/* Full-Bleed Card Image */}
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90"
                sizes="(max-width: 768px) 300px, 420px"
              />

              {/* Multi-Stop Dark Gradient Overlay for optimal text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/95 via-brand-midnight/50 to-brand-midnight/10 group-hover:via-brand-midnight/40 transition-colors" />

              {/* Top Row: Category Pill & Floating Arrow */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-mono font-bold uppercase tracking-wider border border-white/20">
                  {item.tag}
                </span>

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#315CFF] group-hover:text-white transition-colors duration-200">
                  <ArrowUpRight size={17} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Bottom Row: Title & Subtitle */}
              <div className="relative z-10 space-y-1.5">
                <div className="text-[10px] sm:text-[11px] font-mono text-[#6280FF] uppercase tracking-wider font-bold">
                  {item.category}
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white leading-snug group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-1.5 text-xs font-bold text-white/90 underline decoration-[#315CFF] decoration-2 underline-offset-4 flex items-center gap-1 group-hover:text-blue-200 transition-colors">
                  <span>Report in this category →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
