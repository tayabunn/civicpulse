'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Check,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const TIMELINE_MILESTONES = [
  {
    year: '2022',
    title: 'Neighborhood Pilot Launched',
    desc: 'CivicPulse began as a ward-level digital reporting pilot in Mohammadpur and Dhanmondi, replacing paper complaint registers with GPS-pinned submissions.',
    image: '/about-road-works.jpg',
  },
  {
    year: '2023',
    title: 'Multi-Department Dispatch Grid',
    desc: 'Connected Roads & Highways, WASA Drainage, and Electrical Lighting into one unified triage console with automated category routing.',
    image: '/about-gis-dispatch.jpg',
  },
  {
    year: '2024',
    title: '50m Duplicate Radar & Photo Proof',
    desc: 'Introduced Haversine proximity detection to merge duplicate reports and mandated Before & After field photography before closing work orders.',
    image: '/about-emergency-response.jpg',
  },
  {
    year: '2025',
    title: 'Executive BI & SLA Enforcement',
    desc: 'Rolled out citywide 12h–72h SLA timers, ward budget ledgers, and contractor performance scorecards across 30+ municipal clusters.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
  },
  {
    year: '2026',
    title: 'Dhaka Smart Grid v2.0',
    desc: 'Serving 10,000+ active citizens with 2FA-secured portals, live public advisories, and a 94.2% verified SLA resolution rate.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1000&q=80',
  },
];

const MISSION_CARDS = [
  {
    title: 'Protect & Serve',
    desc: 'We prioritize public safety by triaging hazardous potholes, open manholes, and dark streets within strict 12–24 hour SLA windows.',
    image: '/about-emergency-response.jpg',
  },
  {
    title: 'Community Trust',
    desc: 'Through transparent status timelines and verified Before & After repair photography, we build lasting trust between citizens and city teams.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Promote Accountability',
    desc: 'Every status change, department handoff, and budget allocation is recorded in an immutable audit trail accessible for executive review.',
    image: '/about-gis-dispatch.jpg',
  },
  {
    title: 'Uphold Integrity',
    desc: 'Our municipal teams and licensed contractors are measured on on-time SLA delivery and citizen satisfaction ratings.',
    image: '/about-road-works.jpg',
  },
];

const CORE_VALUES = [
  {
    num: '1',
    title: 'Integrity',
    desc: 'We uphold honesty, verifiable photo proof, and fiscal transparency across every municipal work order.',
  },
  {
    num: '2',
    title: 'Service',
    desc: 'Committed to responding swiftly to neighborhood reports with measurable turnaround standards.',
  },
  {
    num: '3',
    title: 'Respect',
    desc: 'Treating every resident and ward community with fairness, dignity, and clear communication.',
  },
  {
    num: '4',
    title: 'Community',
    desc: 'Building safer urban neighborhoods through active citizen participation and shared civic pride.',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Sarah Rahman',
    role: 'City Operations Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tariq Rahman',
    role: 'Roads & Highways Manager',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kamal Hossain',
    role: 'Lead Field Electrician',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Farhana Ahmed',
    role: 'Citizen Relations Coordinator',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
];

const ABOUT_FAQS = [
  {
    q: 'What municipal services does CivicPulse coordinate?',
    a: 'CivicPulse coordinates road & pothole repairs, streetlight outages, stormwater drainage clearing, solid waste pickups, and public infrastructure safety across Dhaka wards.',
  },
  {
    q: 'How does CivicPulse ensure transparency in repairs?',
    a: 'Every work order has a live 5-step timeline, immutable audit history, and mandatory geo-stamped Before & After photo verification before closure.',
  },
  {
    q: 'Who can access the four role-based portals?',
    a: 'Any resident can register for the Citizen Portal, while verified Department Managers, Field Maintenance Crew, and City Administrators sign in with 2FA-protected municipal credentials.',
  },
  {
    q: 'How are urgent public safety hazards prioritized?',
    a: 'Critical hazards such as open manholes or downed power poles enter a 12-hour SLA queue and trigger immediate escalation alerts to department heads.',
  },
];

export function AboutPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeYearIndex, setActiveYearIndex] = useState(4);
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const activeMilestone = TIMELINE_MILESTONES[activeYearIndex];

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.about-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="font-sans">
      {/* 1. FULL-BLEED ABOUT HERO (Matching /services & /features Hero Style) */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24 min-h-[640px] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/about-hero-campus.jpg"
            alt="Aerial view of civic district and municipal campus"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-[#F7F5EF]/60 dark:bg-[#0B0F17]/70 backdrop-blur-[1px] transition-colors duration-300" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#e2fa6b]/90 dark:from-[#0B0F17]/95 via-[#e2fa6b]/55 dark:via-[#0B0F17]/60 via-35% to-transparent to-70% transition-colors duration-300" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#e2fa6b] dark:from-[#0B0F17] to-transparent transition-colors duration-300" />
        </div>

        <div className="relative z-10 w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="about-reveal lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#e2fa6b] text-[#202B45]">
              <Sparkles size={13} /> CivicPulse Smart Grid • About Us
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#202B45] dark:text-white tracking-tight leading-[1.08]">
              Building Safer, <br />
              Connected{' '}
              <span className="font-serif italic font-normal text-[#315CFF] dark:text-[#6280FF]">
                Communities.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#202B45]/90 dark:text-slate-200 max-w-xl leading-relaxed font-medium">
              Discover our city&apos;s vision, municipal operations, and commitment to turning every resident&apos;s report into verified neighborhood action.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/portals">
                <Button className="rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white px-7 h-11 text-sm font-semibold shadow-lg">
                  Explore Portals
                </Button>
              </Link>
              <Link href="/citizen/create">
                <Button
                  variant="outline"
                  className="rounded-full bg-white/90 dark:bg-[#141B29]/90 border-[#D5DAE3] dark:border-[#232F46] text-[#202B45] dark:text-white px-6 h-11 text-sm font-semibold"
                >
                  Report an Issue
                </Button>
              </Link>
            </div>
          </div>

          <div className="about-reveal lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-lg bg-white dark:bg-[#141B29] space-y-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#315CFF] dark:text-[#6280FF] uppercase tracking-wider">
                  Citywide Impact
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2fa6b] text-[#202B45] font-bold">
                  LIVE GRID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-lg bg-[#F7F5EF] dark:bg-[#1B2435] border border-[#D5DAE3] dark:border-[#232F46]">
                  <p className="text-3xl font-bold font-display text-[#202B45] dark:text-white">
                    10k+
                  </p>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">
                    Active Citizens
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#F7F5EF] dark:bg-[#1B2435] border border-[#D5DAE3] dark:border-[#232F46]">
                  <p className="text-3xl font-bold font-display text-[#315CFF] dark:text-[#6280FF]">
                    94.2%
                  </p>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">
                    SLA Compliance
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-[#D5DAE3] dark:border-[#232F46] flex items-center justify-between text-xs text-[#606B7D] dark:text-slate-400">
                <span>Serving 30+ Dhaka Municipal Wards</span>
                <Link href="/services" className="font-semibold text-[#315CFF] dark:text-[#6280FF] hover:underline">
                  View Services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US / VISION COLLAGE + 3-COLUMN STATS */}
      <section className="py-12 sm:py-16 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Photo & Stat Collage */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-12 gap-4 items-stretch">
                <div className="col-span-6 relative h-52 sm:h-60 rounded-lg overflow-hidden border border-[#D5DAE3] dark:border-[#232F46] shadow-sm">
                  <Image
                    src="/about-road-works.jpg"
                    alt="Municipal road maintenance crew"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-6 rounded-lg bg-[#202B45] dark:bg-[#141B29] p-5 flex flex-col justify-between text-white">
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                    ].map((src, i) => (
                      <div key={i} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#202B45]">
                        <Image src={src} alt="Citizen" fill sizes="32px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold font-display text-[#e2fa6b]">
                      10,000+
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Active citizens &amp; municipal operators connected across Dhaka.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-48 sm:h-56 rounded-lg overflow-hidden border border-[#D5DAE3] dark:border-[#232F46] shadow-sm">
                <Image
                  src="/about-gis-dispatch.jpg"
                  alt="GIS dispatch operations center"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Vision & Pillars */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                  Our Vision
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight leading-[1.12]">
                Committed to safer streets through integrity and swift action.
              </h2>
              <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
                We envision a connected city where residents feel heard, municipal teams operate with real-time precision, and every public repair is backed by visible proof.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Community Engagement & Inclusivity',
                  'Sustainable Urban Infrastructure',
                  'Real-Time Triage Accountability',
                  'Safe & Resilient Neighborhoods',
                ].map((pillar) => (
                  <div
                    key={pillar}
                    className="flex items-center gap-2.5 p-3 rounded-md bg-white dark:bg-[#141B29]"
                  >
                    <span className="w-6 h-6 rounded-md bg-[#315CFF] text-white flex items-center justify-center shrink-0">
                      <Check size={14} />
                    </span>
                    <span className="text-sm font-semibold text-[#202B45] dark:text-white">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3-Column Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="sm:text-left">
              <p className="text-4xl sm:text-5xl font-bold font-display text-[#202B45] dark:text-white">
                108+
              </p>
              <p className="text-sm text-[#4B5568] dark:text-slate-400 mt-1">
                Verified municipal incident reports tracked across Dhaka wards.
              </p>
            </div>
            <div className="sm:text-left">
              <p className="text-4xl sm:text-5xl font-bold font-display text-[#315CFF] dark:text-[#6280FF]">
                94.2%
              </p>
              <p className="text-sm text-[#4B5568] dark:text-slate-400 mt-1">
                Citywide SLA compliance rate with photo-verified field closure.
              </p>
            </div>
            <div className="sm:text-left">
              <p className="text-4xl sm:text-5xl font-bold font-display text-[#202B45] dark:text-white">
                30+
              </p>
              <p className="text-sm text-[#4B5568] dark:text-slate-400 mt-1">
                Connected municipal clusters served 24/7 by digital triage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR EVOLUTION TIMELINE (YEAR PILLS) */}
      <section className="py-16 sm:py-20 bg-[#F7F5F0] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                Our Journey
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              How CivicPulse Evolved
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              Explore the milestones that transformed neighborhood issue reporting into Dhaka&apos;s unified infrastructure grid.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative h-72 sm:h-80 rounded-lg overflow-hidden border border-[#D5DAE3] dark:border-[#232F46] shadow-md">
              <Image
                src={activeMilestone.image}
                alt={activeMilestone.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 rounded-lg bg-[#F7F5EF] dark:bg-[#141B29] space-y-6">
              <div className="flex flex-wrap gap-2">
                {TIMELINE_MILESTONES.map((m, idx) => (
                  <button
                    key={m.year}
                    type="button"
                    onClick={() => setActiveYearIndex(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-colors ${
                      activeYearIndex === idx
                        ? 'bg-[#e2fa6b] text-[#202B45] border border-[#202B45]/20 shadow-sm'
                        : 'bg-white dark:bg-[#1B2435] text-[#4B5568] dark:text-slate-300 border border-[#D5DAE3] dark:border-[#232F46] hover:border-[#315CFF]'
                    }`}
                  >
                    {m.year}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-2xl font-bold font-display text-[#202B45] dark:text-white">
                  {activeMilestone.title}
                </h3>
                <p className="text-sm sm:text-base text-[#4B5568] dark:text-slate-300 leading-relaxed">
                  {activeMilestone.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR MISSION (DARK MIDNIGHT 4-CARD SECTION) */}
      <section className="py-16 sm:py-20 bg-[#202B45] dark:bg-[#0B0F17] text-white">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#e2fa6b]/45 bg-transparent text-[#e2fa6b] text-[16px] font-sans font-medium">
                Our Mission
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Making City Governance Open &amp; Simple
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Four foundational commitments that guide every department manager, field engineer, and dispatch desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSION_CARDS.map((card) => (
              <div
                key={card.title}
                className="p-5 sm:p-6 rounded-lg bg-[#182238] dark:bg-[#141B29] grid grid-cols-1 sm:grid-cols-12 gap-5 items-center"
              >
                <div className="sm:col-span-7 space-y-2">
                  <h3 className="text-xl font-bold font-display text-white">{card.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{card.desc}</p>
                </div>
                <div className="sm:col-span-5 relative h-36 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR VALUES (NUMBERED 1-4 + EDITORIAL PHOTO) */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                  Our Values
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
                Values That Guide Us
              </h2>
              <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
                Integrity drives us to uphold honesty and measurable accountability in every civic action.
              </p>
            </div>

            <div className="divide-y divide-[#D5DAE3] dark:divide-[#232F46]">
              {CORE_VALUES.map((val) => (
                <div key={val.num} className="py-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full border border-[#315CFF]/40 text-[#315CFF] dark:text-[#6280FF] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {val.num}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#202B45] dark:text-white">{val.title}</h3>
                    <p className="text-sm text-[#4B5568] dark:text-slate-300 mt-0.5">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-80 sm:h-[420px] rounded-lg overflow-hidden border border-[#D5DAE3] dark:border-[#232F46] shadow-lg">
              <Image
                src="/about-emergency-response.jpg"
                alt="Municipal field response values in action"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP MESSAGE & IMPACT HIGHLIGHT CARD */}
      <section className="py-16 sm:py-20 bg-[#F7F5F0] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
              Leadership Note
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              A Message From City Operations
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              &ldquo;Welcome to CivicPulse. Our commitment is straightforward: every pothole, streetlight fault, and drainage blockage reported by a citizen deserves transparent tracking, rapid field dispatch, and verified proof of completion.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D5DAE3] dark:border-[#232F46]">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Sarah Rahman"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-[#202B45] dark:text-white">Sarah Rahman</p>
                <p className="text-xs text-[#606B7D] dark:text-slate-400">City Operations Director • CivicPulse</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-7 rounded-lg bg-[#315CFF] text-white space-y-5">
              <div className="border-l-2 border-[#e2fa6b] pl-4">
                <p className="text-4xl font-bold font-display">94.2%</p>
                <p className="text-xs text-white/85">SLA Repair Compliance</p>
              </div>
              <div className="border-l-2 border-[#e2fa6b] pl-4">
                <p className="text-4xl font-bold font-display">18.5 hrs</p>
                <p className="text-xs text-white/85">Average Dispatch Turnaround</p>
              </div>
              <div className="border-l-2 border-[#e2fa6b] pl-4">
                <p className="text-4xl font-bold font-display">30+ Wards</p>
                <p className="text-xs text-white/85">Connected Across Dhaka</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#F7F5EF] dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46]">
              <p className="text-sm font-semibold text-[#202B45] dark:text-white">
                We believe an engaged community is a stronger city.
              </p>
              <Link href="/citizen/create" className="shrink-0">
                <Button size="sm" className="rounded-lg bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] font-bold">
                  Get Involved
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEDICATED TEAM & COMMON QUESTIONS */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-16">
          {/* Team */}
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                  Our Team
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
                Dedicated Municipal Professionals
              </h2>
              <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
                Meet the operations directors, department managers, and field leads serving our neighborhoods.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="rounded-lg bg-white dark:bg-[#141B29] overflow-hidden"
                >
                  <div className="relative h-60 w-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#202B45] dark:text-white">{member.name}</h3>
                      <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">{member.role}</p>
                    </div>
                    <Link
                      href="/contact"
                      aria-label={`Contact ${member.name}`}
                      className="w-8 h-8 rounded-full bg-[#315CFF] text-white flex items-center justify-center shrink-0 hover:bg-[#244BE0] transition-colors"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-8 pt-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                  FAQs
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
                Residents Frequently Ask
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ABOUT_FAQS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-lg bg-white dark:bg-[#141B29] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 font-semibold text-sm"
                    >
                      <span className={isOpen ? 'text-[#315CFF] dark:text-[#6280FF]' : 'text-[#202B45] dark:text-white'}>
                        {item.q}
                      </span>
                      {isOpen ? (
                        <X size={16} className="shrink-0 text-[#315CFF]" />
                      ) : (
                        <Plus size={16} className="shrink-0 text-[#606B7D]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-[#4B5568] dark:text-slate-300 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
