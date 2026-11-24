import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WHAT_WE_OFFER } from './data';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';

export function WhatWeOffer() {
  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-24 bg-brand-warmWhite dark:bg-[#0B0F17] transition-colors duration-300 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="w-[80%] mx-auto">
        {/* Section Heading matching Verdona */}
        <div className="anim-offer-header text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div>
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-16px font-sans font-medium transition-colors">
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
      </div>

      {/* 1-Line Horizontal Cards Track */}
      <div className="w-full overflow-hidden">
        <div
          id="services-track"
          className="flex flex-nowrap gap-6 sm:gap-8 pl-[10vw] pr-[10vw] will-change-transform"
        >
          {WHAT_WE_OFFER.map((item) => (
            <Link
              key={item.id}
              href="/citizen/create"
              className="anim-offer-card group relative rounded-3xl overflow-hidden w-[310px] sm:w-[350px] md:w-[380px] lg:w-[420px] aspect-[4/3.3] shrink-0 bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 active:scale-[0.98]"
            >
              {/* Full-Bleed Card Image */}
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90"
                sizes="(max-width: 768px) 320px, 420px"
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

      {/* Centered "More Services" Action Button (Exact same style and font size as Navbar Log In) */}
      <div className="w-full flex justify-center items-center mt-10 sm:mt-12">
        <Link href="/citizen/create">
          <Button
            size="sm"
            className="font-medium font-sans bg-[#315CFF] text-white hover:bg-[#244BE0] active:scale-[0.98] transition-all rounded-full px-6 h-11 text-base shadow-md"
          >
            More Services
          </Button>
        </Link>
      </div>
    </section>
  );
}
