import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WHAT_WE_OFFER } from './data';
import { ArrowUpRight } from 'lucide-react';

export function WhatWeOffer() {
  return (
    <section id="services" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-brand-warmWhite border-b border-brand-coolGray">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading matching Verdona */}
        <div className="anim-offer-header text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-cobalt">
            Services & Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-midnight tracking-tight">
            What We Offer
          </h2>
          <p className="text-base text-[#4B5568] leading-relaxed">
            From damaged roads to overflowing drainage systems, report everyday problems affecting your
            neighborhood and bring them directly to the attention of municipal teams.
          </p>
        </div>

        {/* Verdona 3x2 Signature Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHAT_WE_OFFER.map((item) => (
            <Link
              key={item.id}
              href="/citizen/create"
              className="anim-offer-card group relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 active:scale-[0.98]"
            >
              {/* Full-Bleed Card Image */}
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-90"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Multi-Stop Dark Gradient Overlay for optimal text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/95 via-brand-midnight/50 to-brand-midnight/10 group-hover:via-brand-midnight/40 transition-colors" />

              {/* Top Row: Category Pill & Floating Arrow */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-mono font-bold uppercase tracking-wider border border-white/20">
                  {item.tag}
                </span>

                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-brand-midnight transition-colors duration-200">
                  <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Bottom Row: Title & Subtitle */}
              <div className="relative z-10 space-y-2">
                <div className="text-[11px] font-mono text-brand-yellow uppercase tracking-wider font-bold">
                  {item.category}
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white leading-snug group-hover:text-brand-yellow transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2 text-xs font-bold text-white/90 underline decoration-brand-yellow decoration-2 underline-offset-4 flex items-center gap-1">
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
