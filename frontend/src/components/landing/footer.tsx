'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '../ui/brand-logo';
import { ArrowUpRight, ShieldCheck, Radio } from 'lucide-react';

const MARQUEE_ITEMS = [
  '24/7 Dispatch',
  'Sub-Meter GPS',
  '50m Radar',
  'Instant Triage',
  'Live Telemetry',
  'Photo Verification',
  'SLA Audited',
  'Smart City Grid',
  'Rapid Field Crew',
];

export function Footer() {
  return (
    <footer className="bg-[#0B1221] text-white overflow-hidden font-sans">
      {/* 1. Cinematic Top Action Banner matching footer.mp4 */}
      <div className="relative overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center py-20 lg:py-24">
        {/* Background Video / Poster */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/about-gis-dispatch.jpg"
            className="w-full h-full object-cover"
          >
            <source src="/footer-dam.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221]/90 via-[#142038]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/20 to-[#0B1221]/30" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 w-[80%] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold font-display text-white tracking-tight leading-[1.08]">
              Start Improving Your <br />
              City{' '}
              <span className="font-serif italic font-normal text-[#e2fa6b]">
                Today
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-sans font-normal">
              Turn neighborhood civic reports into verified municipal action. Whether it&apos;s damaged
              roads, broken streetlights, or drainage blockages, our dispatch teams are ready to respond.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/citizen/create"
              className="group relative inline-flex items-center rounded-full h-12 p-1 ps-6 pe-14 bg-[#e2fa6b] text-[#142038] shadow-xl overflow-hidden cursor-pointer transition-all duration-500 hover:ps-14 hover:pe-6 w-fit active:scale-[0.98]"
            >
              <span className="relative z-10 text-sm font-sans font-semibold tracking-tight transition-all duration-500">
                Report Issue
              </span>
              <div className="absolute right-1 w-10 h-10 bg-[#142038] text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Continuous Electric Lime Marquee Ribbon matching footer.mp4 */}
      <div className="bg-[#e2fa6b] text-[#142038] py-3 sm:py-3.5 border-y border-[#142038]/10 overflow-hidden select-none">
        <div className="animate-marquee motion-reduce:[animation:none] items-center">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <span className="text-sm sm:text-base font-semibold font-display tracking-tight px-5 sm:px-7">
                {item}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#142038] shrink-0" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Footer Navigation & Brand Columns */}
      <div className="w-[80%] mx-auto pt-16 pb-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-14 border-b border-white/10">
          {/* Left Column: Brand Logo & Short Editorial Summary */}
          <div className="max-w-xs space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <BrandLogo size={28} className="text-[#305dff] group-hover:scale-105 transition-transform" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                CivicPulse
              </span>
            </Link>
            <p className="text-sm font-sans text-slate-400 leading-relaxed font-normal">
              Delivering real-time municipal telemetry and rapid urban infrastructure resolution built for
              accountability and safer city living.
            </p>
          </div>

          {/* Right Columns: Main Pages & Portals */}
          <div className="flex flex-wrap gap-14 sm:gap-24">
            <div className="space-y-3.5">
              <h5 className="font-sans text-sm font-semibold text-white tracking-tight">
                Main Pages
              </h5>
              <ul className="space-y-2.5 text-sm font-sans text-slate-400">
                <li>
                  <a href="/" className="hover:text-[#e2fa6b] transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#e2fa6b] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-[#e2fa6b] transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#e2fa6b] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#portals" className="hover:text-[#e2fa6b] transition-colors">
                    Portals
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#e2fa6b] transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h5 className="font-sans text-sm font-semibold text-white tracking-tight">
                Portals
              </h5>
              <ul className="space-y-2.5 text-sm font-sans text-slate-400">
                <li>
                  <Link href="/citizen" className="hover:text-[#e2fa6b] transition-colors">
                    Citizen Portal
                  </Link>
                </li>
                <li>
                  <Link href="/manager" className="hover:text-[#e2fa6b] transition-colors">
                    Dispatch Hub
                  </Link>
                </li>
                <li>
                  <Link href="/staff" className="hover:text-[#e2fa6b] transition-colors">
                    Field Orders
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#e2fa6b] transition-colors">
                    Admin BI
                  </Link>
                </li>
                <li>
                  <Link href="/citizen/create" className="hover:text-[#e2fa6b] transition-colors">
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Copyright, Square Social Buttons & Built-With Credit Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-sans text-slate-400">
            © 2026 CivicPulse. All rights reserved.
          </p>

          {/* 4 Square Icon Buttons matching footer.mp4 hover lime state */}
          <div className="flex items-center gap-2.5">
            <a
              href="#contact"
              aria-label="CivicPulse on X"
              className="w-9 h-9 rounded-lg bg-white text-[#142038] hover:bg-[#e2fa6b] transition-colors flex items-center justify-center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#services"
              aria-label="CivicPulse on Instagram"
              className="w-9 h-9 rounded-lg bg-white text-[#142038] hover:bg-[#e2fa6b] transition-colors flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#portals"
              aria-label="CivicPulse on LinkedIn"
              className="w-9 h-9 rounded-lg bg-white text-[#142038] hover:bg-[#e2fa6b] transition-colors flex items-center justify-center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
              </svg>
            </a>
            <a
              href="#telemetry"
              aria-label="CivicPulse Live Broadcast"
              className="w-9 h-9 rounded-lg bg-white text-[#142038] hover:bg-[#e2fa6b] transition-colors flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
              </svg>
            </a>
          </div>

          {/* 2 Compact Credit Badges matching footer.mp4 */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/10">
              <span className="w-6 h-6 rounded-md bg-[#e2fa6b] text-[#142038] flex items-center justify-center shrink-0">
                <ShieldCheck size={14} />
              </span>
              <div className="leading-tight">
                <span className="block text-[10px] font-sans text-slate-400">System Design</span>
                <span className="block text-xs font-sans font-semibold text-white">Signal City</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/10">
              <span className="w-6 h-6 rounded-md bg-[#305dff] text-white flex items-center justify-center shrink-0">
                <Radio size={14} />
              </span>
              <div className="leading-tight">
                <span className="block text-[10px] font-sans text-slate-400">Powered by</span>
                <span className="block text-xs font-sans font-semibold text-white">CivicGrid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Giant Subtle Full-Width Watermark Wordmark matching footer.mp4 */}
      <div
        aria-hidden="true"
        className="w-full overflow-hidden pt-2 pb-1 select-none pointer-events-none"
      >
        <div className="text-[16vw] font-bold font-display leading-[0.82] tracking-tighter text-white/[0.03] text-center -mb-3 sm:-mb-6">
          CivicPulse
        </div>
      </div>
    </footer>
  );
}
