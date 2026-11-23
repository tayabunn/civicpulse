'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Compass, Radio, MapPin, Clock, ShieldCheck, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center pt-20 pb-24 px-4 sm:px-6 lg:px-8 bg-brand-midnight text-white">
      {/* Background City Image with Dark Vignette & Warm Depth matching Verdona */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=85"
          alt="Smart City Night Grid"
          fill
          priority
          className="object-cover object-center opacity-40 scale-105"
          sizes="100vw"
        />
        {/* Multi-stop atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/70 to-brand-midnight/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-brand-midnight/60 to-brand-midnight" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Verdona-Style Social Proof Badge (Avatars + Star Rating) */}
        <div className="anim-hero-badge inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xl mb-8">
          <div className="flex -space-x-2">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-brand-midnight">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Citizen"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-brand-midnight">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Coordinator"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-brand-midnight">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
                alt="Technician"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <span className="text-xs font-medium text-white/90">10k+ Citizens</span>

          <div className="flex items-center gap-1 text-xs text-brand-yellow font-bold pl-1 border-l border-white/20">
            <Star size={13} className="fill-brand-yellow text-brand-yellow" />
            <span>4.9</span>
          </div>
        </div>

        {/* Verdona Grand Editorial Headline with Manrope + Instrument Serif Italic */}
        <div className="overflow-hidden mb-4">
          <h1 className="anim-hero-title text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold font-display tracking-tight text-white leading-[1.08] max-w-4xl">
            Start Caring For Your Future{' '}
            <span className="font-serif italic font-normal text-brand-yellow block sm:inline">
              Generations
            </span>
          </h1>
        </div>

        {/* Subtitle in clean Manrope */}
        <p className="anim-hero-desc text-base sm:text-lg lg:text-xl text-slate-200/90 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          A modern municipal platform built for communities of every scale — from neighborhood alleys
          to citywide public works operations.
        </p>

        {/* Action CTAs: Signal Yellow Pill + Glass Pill */}
        <div className="anim-hero-cta flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/citizen/create">
            <Button
              size="lg"
              className="gap-2 bg-brand-yellow text-brand-midnight hover:bg-yellow-400 font-bold px-8 h-12 text-sm sm:text-base rounded-full shadow-lg active:scale-[0.97] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Button>
          </Link>

          <a href="#about">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 font-semibold px-7 border-white/25 text-white hover:bg-white/10 h-12 text-sm sm:text-base rounded-full backdrop-blur-md active:scale-[0.97] transition-all bg-white/5"
            >
              <Compass size={16} className="text-brand-yellow" />
              <span>Explore Platform</span>
            </Button>
          </a>
        </div>

        {/* Floating Telemetry Strip matching Verdona preview cards */}
        <div className="anim-hero-frame w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {/* Telemetry Card 1 */}
          <div className="anim-float-card-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-xl transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="font-bold text-brand-yellow bg-brand-yellow/15 px-2 py-0.5 rounded">#CP-1024</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Clock size={11} /> 25m ago
              </span>
            </div>
            <h4 className="font-bold text-sm text-white line-clamp-1">
              Road Cavity near Central Ave
            </h4>
            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-brand-yellow shrink-0" />
              <span className="truncate">Sector 3, Uttara Grid</span>
            </p>
          </div>

          {/* Telemetry Card 2 */}
          <div className="anim-float-card-2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-xl transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="font-bold text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded">In Progress</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Radio size={11} className="text-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <h4 className="font-bold text-sm text-white line-clamp-1">
              Streetlight pole restoration
            </h4>
            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-1">
              <ShieldCheck size={11} className="text-emerald-400 shrink-0" />
              <span className="truncate">Field Crew #03 Dispatched</span>
            </p>
          </div>

          {/* Telemetry Card 3 */}
          <div className="anim-float-card-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-xl transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="text-brand-yellow font-bold uppercase text-[10px] tracking-wider">Citywide SLA</span>
              <span className="text-emerald-400 font-bold font-mono">94.2%</span>
            </div>
            <h4 className="font-bold text-sm text-white">Target &lt; 24h Met</h4>
            <p className="text-[11px] text-slate-300 mt-1 truncate">
              30 ward zones actively monitored
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
