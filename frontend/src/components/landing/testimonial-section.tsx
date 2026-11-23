import React from 'react';
import Image from 'next/image';
import { TESTIMONIAL } from './data';
import { Quote } from 'lucide-react';

export function TestimonialSection() {
  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-brand-midnight text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cobalt/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

      <div className="anim-testimonial-card max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-brand-yellow mb-2">
          <Quote size={28} />
        </div>

        <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-snug tracking-tight text-white max-w-3xl mx-auto">
          "{TESTIMONIAL.quote}"
        </blockquote>

        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-yellow shadow-md">
            <Image
              src={TESTIMONIAL.avatarUrl}
              alt={TESTIMONIAL.author}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div>
            <div className="font-display font-bold text-base text-white">{TESTIMONIAL.author}</div>
            <div className="text-xs text-brand-yellow font-mono">{TESTIMONIAL.role}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{TESTIMONIAL.organization}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
