'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Users, Globe } from 'lucide-react';
import { BrandLogo } from '../ui/brand-logo';

const SHOWCASE_SLIDES = [
  {
    image: '/about-gis-dispatch.jpg',
    stat1Value: '10k+',
    stat1Label: 'Active Community Citizens',
    stat2Value: '200+',
    stat2Label: 'Connected City Wards',
    quote:
      'Welcome to CivicPulse, a smart municipal platform built for citizens, engineers, and city teams to build safer urban neighborhoods.',
  },
  {
    image: '/about-road-works.jpg',
    stat1Value: '94.2%',
    stat1Label: 'SLA Repair Resolution',
    stat2Value: '< 18m',
    stat2Label: 'Emergency Triage Speed',
    quote:
      'From road potholes to faulty streetlights, every geo-pinned report goes directly to the responsible municipal crew in real time.',
  },
  {
    image: '/about-emergency-response.jpg',
    stat1Value: '24/7',
    stat1Label: 'Live City Monitoring',
    stat2Value: '99.8%',
    stat2Label: 'Sub-Meter GPS Accuracy',
    quote:
      'Transparent progress tracking, verified before-and-after repair proof, and community-driven priority dispatch across Dhaka.',
  },
];

export function AuthShowcasePanel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const current = SHOWCASE_SLIDES[activeSlide];

  return (
    <div className="relative h-full min-h-[480px] rounded-lg overflow-hidden bg-[#0B0F17] flex flex-col justify-between p-5 sm:p-6 select-none">
      {/* Background Image */}
      <Image
        src={current.image}
        alt="CivicPulse Smart City Infrastructure"
        fill
        className="object-cover transition-opacity duration-500 opacity-80"
        priority
      />
      {/* Solid dark tint for crisp contrast */}
      <div className="absolute inset-0 bg-[#0B0F17]/45" />

      {/* Top Row: Brand Logo pinned top-right matching reference */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#e2fa6b]" />
          CivicPulse Smart Grid
        </span>
        <BrandLogo size={32} className="text-white" />
      </div>

      {/* Bottom Floating Warm-White Stats Card + 3-Bar Indicator */}
      <div className="relative z-10 space-y-4 mt-auto">
        <div className="rounded-lg bg-[#F7F5EF] text-[#202B45] p-5 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#315CFF]/15 text-[#315CFF] flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold font-display leading-none text-[#202B45]">
                  {current.stat1Value}
                </p>
                <p className="text-[11px] font-medium text-[#606B7D] mt-1 leading-tight">
                  {current.stat1Label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e2fa6b] text-[#202B45] flex items-center justify-center shrink-0">
                <Globe size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold font-display leading-none text-[#202B45]">
                  {current.stat2Value}
                </p>
                <p className="text-[11px] font-medium text-[#606B7D] mt-1 leading-tight">
                  {current.stat2Label}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D5DAE3] my-3.5" />

          <p className="text-xs sm:text-[13px] text-[#4B5568] leading-relaxed">
            {current.quote}
          </p>
        </div>

        {/* 3-Bar Slide Indicator matching reference */}
        <div className="grid grid-cols-3 gap-2.5 px-1">
          {SHOWCASE_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Showcase slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all ${
                activeSlide === idx ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
