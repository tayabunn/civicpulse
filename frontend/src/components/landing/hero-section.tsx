'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { HERO_STATS } from './data';
import { ArrowRight, Compass, Radio, MapPin, Clock, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-brand-warmWhite">
      <div className="max-w-7xl mx-auto">
        {/* Top Live Municipal Status Badge */}
        <div className="text-center mb-6">
          <div className="anim-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-midnight text-brand-yellow text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>A smarter way to care for your city • Connected to Neon Cloud PostgreSQL</span>
          </div>
        </div>

        {/* Verdona-Style Grand Editorial Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="anim-hero-title text-4xl sm:text-5xl lg:text-6xl font-black font-display text-brand-midnight tracking-tight leading-[1.12]">
            Start Caring For Your <br className="hidden sm:inline" />
            <span className="text-brand-cobalt underline decoration-brand-yellow decoration-4 underline-offset-8">
              Future Generations.
            </span>
          </h1>

          <p className="anim-hero-desc text-base sm:text-lg lg:text-xl text-[#4B5568] max-w-2xl mx-auto leading-relaxed">
            Every street tells a story. Report infrastructure issues, track verified repairs in real time,
            and help build a safer, cleaner, and more connected community.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/citizen/create" className="anim-hero-cta">
              <Button
                size="lg"
                className="gap-2 bg-brand-midnight text-brand-yellow hover:bg-slate-800 font-bold px-8 h-12 text-base rounded-full shadow-md active:scale-[0.97] transition-all"
              >
                <span>Report an Issue</span>
                <ArrowRight size={18} />
              </Button>
            </Link>

            <a href="#services" className="anim-hero-cta">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-bold px-7 border-slate-300 text-brand-midnight hover:bg-slate-100 h-12 text-base rounded-full active:scale-[0.97] transition-all"
              >
                <Compass size={18} className="text-brand-cobalt" />
                <span>Explore City Services</span>
              </Button>
            </a>
          </div>

          <p className="anim-hero-desc text-xs font-mono text-text-muted uppercase tracking-wider pt-1">
            Report responsibly • Stay informed • Make an impact
          </p>
        </div>

        {/* Verdona 3-Stat Strip */}
        <div className="anim-hero-stats-strip mt-12 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 border border-brand-coolGray bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
          {HERO_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`anim-hero-stat text-center py-2 ${
                idx !== HERO_STATS.length - 1 ? 'sm:border-r border-slate-100' : ''
              }`}
            >
              <div className="text-3xl sm:text-4xl font-extrabold font-display text-brand-midnight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-brand-cobalt uppercase tracking-wider mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] font-mono text-text-muted mt-0.5">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Verdona Hero Visual Frame: Large 3xl rounded imagery with floating telemetry badges */}
        <div className="anim-hero-frame mt-12 relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[16/9] sm:aspect-[21/9]">
            {/* Background City Image */}
            <Image
              src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80"
              alt="Smart City Infrastructure Metropolis"
              fill
              priority
              className="object-cover opacity-80"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/95 via-brand-midnight/40 to-transparent" />

            {/* Top Bar inside hero preview */}
            <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-xs font-mono text-white/90">
              <div className="inline-flex items-center gap-2 bg-brand-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <Radio size={14} className="text-emerald-400 animate-pulse" />
                <span>Dhaka Municipal Grid • Live Telemetry</span>
              </div>
              <div className="hidden sm:inline-block bg-brand-midnight/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                23.8103° N, 90.4125° E
              </div>
            </div>

            {/* Bottom floating telemetry cards inside visual */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Telemetry Card 1 */}
              <div className="anim-float-card-1 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-bold text-brand-cobalt bg-blue-50 px-2 py-0.5 rounded">#CP-1024</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock size={11} /> 25m ago
                  </span>
                </div>
                <h4 className="font-bold text-xs text-brand-midnight line-clamp-1">
                  Road Cavity near Central Avenue
                </h4>
                <p className="text-[11px] text-text-muted flex items-center gap-1 mt-1">
                  <MapPin size={11} className="text-brand-cobalt shrink-0" />
                  <span className="truncate">Sector 3, Uttara, Dhaka</span>
                </p>
              </div>

              {/* Telemetry Card 2 */}
              <div className="anim-float-card-2 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-lg transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">#CP-1048</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">In Progress</span>
                </div>
                <h4 className="font-bold text-xs text-brand-midnight line-clamp-1">
                  Streetlight pole restoration
                </h4>
                <p className="text-[11px] text-text-muted flex items-center gap-1 mt-1">
                  <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                  <span className="truncate">Field Crew #03 Dispatched</span>
                </p>
              </div>

              {/* Telemetry Card 3 (hidden on small screens) */}
              <div className="anim-float-card-3 hidden lg:block bg-brand-midnight/90 text-white backdrop-blur-md rounded-2xl p-3.5 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-brand-yellow font-bold uppercase">Citywide SLA</span>
                  <span className="text-emerald-400 font-bold">94.2%</span>
                </div>
                <h4 className="font-bold text-xs text-white">Target SLA &lt; 24h Met</h4>
                <p className="text-[11px] text-slate-300 mt-1 truncate">
                  30 wards actively monitored
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
