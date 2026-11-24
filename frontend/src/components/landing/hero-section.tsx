'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-end text-white">
      {/* Background Police Assist in Snow Video with Fallback Poster */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.pexels.com/videos/30242881/pexels-photo-30242881.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="/police-assist-snow.mp4" type="video/mp4" />
        </video>

        {/* Website Brand Yellow (#FFD447) Overlay Layers with Reduced Radius */}
        {/* Radial gradient anchored at bottom-left with controlled compact radius */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#FFD447]/90 dark:from-[#0B0F17]/95 via-[#FFD447]/60 dark:via-[#0B0F17]/60 via-30% to-transparent to-60% transition-colors duration-300" />
        {/* Soft bottom edge blend */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFD447] dark:from-[#0B0F17] to-transparent transition-colors duration-300" />
      </div>

      {/* Hero Content - Left Aligned and Bottom Placed matching Verdona (80% Content Width) */}
      <div className="relative z-10 w-[80%] mx-auto pb-8 sm:pb-10 lg:pb-12 pt-32">
        <div className="max-w-3xl space-y-6 text-left">
          {/* Verdona-Style Social Proof Badge (Nested Pill with Avatars + Star Rating, Matching Reference) */}
          <div className="anim-hero-badge inline-flex items-center gap-3 p-1 pr-4 rounded-full bg-brand-midnight/90 backdrop-blur-md border border-brand-midnight/30 text-white shadow-xl">
            {/* Inner Pill: Avatars + Citizens count */}
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full pl-1 pr-3 py-1">
              <div className="flex -space-x-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/40">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Citizen"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/40">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Coordinator"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/40">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                    alt="Technician"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <span className="text-xs font-medium font-sans text-white">10k+ Citizens</span>
            </div>

            {/* Star Rating Segment without divider line matching Verdona */}
            <div className="flex items-center gap-1.5 text-xs text-white font-semibold pr-0.5">
              <Star size={13} className="fill-brand-yellow text-brand-yellow" />
              <span>4.9</span>
            </div>
          </div>

          {/* Verdona Grand Editorial Headline - Left Aligned */}
          <div className="overflow-hidden">
            <h1 className="anim-hero-title text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-semibold font-display tracking-tight text-brand-midnight dark:text-white leading-[1.08] text-left transition-colors duration-300">
              Start Caring For <br />
              Your Future{' '}
              <span className="font-serif italic font-normal text-[#315CFF] dark:text-[#6280FF]">
                Generations
              </span>
            </h1>
          </div>

          {/* Subtitle in clean Manrope - Left Aligned */}
          <p className="anim-hero-desc text-base sm:text-lg text-brand-midnight/85 dark:text-slate-200/90 max-w-xl leading-relaxed text-left font-normal font-sans transition-colors duration-300">
            A modern municipal platform built for communities of every scale — from neighborhood alleys
            to citywide public works operations.
          </p>

          {/* Action CTA Button - Left Aligned (Cobalt Blue #315CFF, Clean Pill without Icon) */}
          <div className="anim-hero-cta pt-2">
            <Link href="/citizen/create">
              <Button
                size="lg"
                className="bg-[#315CFF] text-white hover:bg-[#244BE0] font-semibold font-sans px-8 h-12 text-base rounded-full shadow-lg active:scale-[0.97] transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
