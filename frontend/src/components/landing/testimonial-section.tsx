'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIAL } from './data';

export function TestimonialSection() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-brand-warmWhite border-b border-brand-coolGray">
      <div className="anim-testimonial-card max-w-4xl mx-auto text-center space-y-8">
        {/* Pill Badge matching Verdona */}
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full border border-slate-300 text-brand-midnight text-xs font-mono font-bold uppercase tracking-wider bg-white/70">
            Testimonials
          </span>
        </div>

        {/* Large Quote in Instrument Serif Italic */}
        <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-normal text-brand-midnight leading-relaxed max-w-3xl mx-auto">
          "{TESTIMONIAL.quote}"
        </blockquote>

        {/* 3 Circular Avatars (Center active) */}
        <div className="flex items-center justify-center gap-4 pt-4">
          {/* Avatar 1 */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm opacity-60 hover:opacity-100 transition-opacity">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
              alt="Citizen Reviewer"
              fill
              className="object-cover"
            />
          </div>

          {/* Active Center Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-yellow shadow-lg ring-4 ring-brand-yellow/20 scale-105">
            <Image
              src={TESTIMONIAL.avatarUrl}
              alt={TESTIMONIAL.author}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          {/* Avatar 3 */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm opacity-60 hover:opacity-100 transition-opacity">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
              alt="Department Dispatcher"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Author & Role in clean Manrope */}
        <div className="space-y-1">
          <div className="font-display font-bold text-base text-brand-midnight">
            {TESTIMONIAL.author}
          </div>
          <div className="text-xs text-text-secondary font-medium">
            {TESTIMONIAL.role} • {TESTIMONIAL.organization}
          </div>
        </div>
      </div>
    </section>
  );
}
