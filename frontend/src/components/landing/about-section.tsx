'use client';

import React from 'react';
import Image from 'next/image';
import { HERO_STATS } from './data';
import { PartnersTicker } from './partners-ticker';

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-brand-warmWhite border-b border-brand-coolGray">
      <div className="max-w-7xl mx-auto">
        {/* Verdona 2-Column About Us Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          {/* Left Column: Rounded Vertical Photo */}
          <div className="lg:col-span-5 anim-about-img">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white bg-slate-900 group">
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80"
                alt="Municipal Infrastructure Field Engineer"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-yellow font-bold block mb-1">
                  On-Ground Operations
                </span>
                <p className="text-sm font-semibold leading-snug text-white/95">
                  Dhaka Municipal Maintenance & Civil Engineering Division
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pill Badge, 3 Stats & Large Editorial Text */}
          <div className="lg:col-span-7 space-y-8 anim-about-content">
            {/* Pill Badge */}
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full border border-slate-300 text-brand-midnight text-xs font-mono font-bold uppercase tracking-wider bg-white/70">
                About Us
              </span>
            </div>

            {/* 3 Stats Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 border-b border-slate-200/90 pb-8">
              {HERO_STATS.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-brand-midnight tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-brand-cobalt">
                    {stat.label}
                  </div>
                  <div className="text-[11px] font-mono text-text-muted hidden sm:block">
                    {stat.sublabel}
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Statement */}
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl lg:text-[28px] font-normal leading-relaxed text-brand-midnight tracking-tight">
                CivicPulse is a modern civic infrastructure partner helping municipalities manage city
                grids more sustainably, accelerate repair turnarounds, and build resilient operations for the
                long term.
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                From sub-meter GPS duplicate detection to real-time mobile work orders and city leadership
                scorecards, our end-to-end platform unifies citizens, dispatchers, and field technicians into one
                accountable workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Verdona "Our Trusted Partners" Logo Strip */}
        <div className="pt-8 border-t border-slate-200/80">
          <div className="text-center mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted">
              Our Trusted Municipal Partners
            </span>
          </div>
          <PartnersTicker />
        </div>
      </div>
    </section>
  );
}
