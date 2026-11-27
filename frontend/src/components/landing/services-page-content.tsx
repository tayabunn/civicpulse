'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileCheck2,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  Lightbulb,
  Droplets,
  Trash2,
  Building2,
} from 'lucide-react';
import { Button } from '../ui/button';

const SERVICE_CARDS = [
  {
    tag: 'ROADS & TRAFFIC',
    title: 'Road & Pothole Repair',
    desc: 'Report damaged asphalt, sinkholes, or hazardous intersections with sub-meter GPS pinning.',
    image: '/about-road-works.jpg',
    href: '/citizen/create?category=road_damage',
    icon: Wrench,
  },
  {
    tag: 'PUBLIC SAFETY',
    title: 'Streetlight & Grid Outages',
    desc: 'Flag flickering high-mast lamps, dark alleys, and damaged electrical poles for rapid dispatch.',
    image: '/about-emergency-response.jpg',
    href: '/citizen/create?category=streetlight',
    icon: Lightbulb,
  },
  {
    tag: 'UTILITIES & DRAINAGE',
    title: 'Drainage & Waterlogging',
    desc: 'Submit clogged stormwater drains, broken culverts, or monsoon waterlogging alerts.',
    image: '/about-gis-dispatch.jpg',
    href: '/citizen/create?category=drainage',
    icon: Droplets,
  },
  {
    tag: 'SANITATION',
    title: 'Solid Waste & Collection',
    desc: 'Request missed compactor pickups, overflowing secondary bins, or illegal dumping cleanup.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80',
    href: '/citizen/create?category=waste_management',
    icon: Trash2,
  },
  {
    tag: 'INFRASTRUCTURE',
    title: 'Footpaths & Overpasses',
    desc: 'Report broken pedestrian railings, damaged walkways, and public park safety hazards.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    href: '/citizen/create?category=footpath',
    icon: Building2,
  },
  {
    tag: 'TRANSPARENCY',
    title: 'Live City Map & Audits',
    desc: 'Explore real-time ward repair progress, SLA turnaround metrics, and verified photo proof.',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80',
    href: '/citizen/map',
    icon: MapPin,
  },
];

const COUNTERS = [
  {
    num: '01 / 04',
    title: 'Report',
    subtitle: "Tell us what's broken. We'll route it.",
    theme: 'bg-[#202B45] text-white border-[#34415B]',
    linkClass: 'text-slate-200 hover:text-[#e2fa6b] border-white/15',
    items: [
      { label: 'Pothole & road damage', href: '/citizen/create?category=road_damage' },
      { label: 'Streetlight outage', href: '/citizen/create?category=streetlight' },
      { label: 'Blocked drainage', href: '/citizen/create?category=drainage' },
      { label: 'Missed waste pickup', href: '/citizen/create?category=waste_management' },
    ],
  },
  {
    num: '02 / 04',
    title: 'Track',
    subtitle: 'Follow live crew dispatch and repair SLA.',
    theme: 'bg-[#315CFF] text-white border-[#244BE0]',
    linkClass: 'text-white/95 hover:text-[#e2fa6b] border-white/20',
    items: [
      { label: 'My incident reports', href: '/citizen/reports' },
      { label: 'Live city incident map', href: '/citizen/map' },
      { label: 'Neighborhood alerts', href: '/citizen/alerts' },
      { label: 'Before & after proof', href: '/features' },
    ],
  },
  {
    num: '03 / 04',
    title: 'Access',
    subtitle: 'Role-based portals for municipal teams.',
    theme: 'bg-white dark:bg-[#141B29] text-[#202B45] dark:text-white border-[#D5DAE3] dark:border-[#232F46]',
    linkClass: 'text-[#315CFF] dark:text-[#6280FF] hover:underline border-[#E2E5ED] dark:border-[#232F46]',
    items: [
      { label: 'Citizen reporting hub', href: '/portals' },
      { label: 'Department manager triage', href: '/portals' },
      { label: 'Field crew work orders', href: '/portals' },
      { label: 'Executive city analytics', href: '/portals' },
    ],
  },
  {
    num: '04 / 04',
    title: 'Find',
    subtitle: 'Hotlines, civic records, and ward help.',
    theme: 'bg-[#F0F1F5] dark:bg-[#1B2435] text-[#202B45] dark:text-white border-[#D5DAE3] dark:border-[#232F46]',
    linkClass: 'text-[#202B45] dark:text-slate-200 hover:text-[#315CFF] border-[#D5DAE3] dark:border-[#2A3750]',
    items: [
      { label: '24/7 emergency hotlines', href: '/citizen/help' },
      { label: 'Civic impact & rewards', href: '/citizen/impact' },
      { label: 'Common FAQs', href: '/faqs' },
      { label: 'Contact dispatch desk', href: '/contact' },
    ],
  },
];

const COUNTER_BOARD = [
  { code: 'A01', service: 'Report a road pothole or sinkhole', takes: '2 min', costs: 'Free', where: 'ONLINE' },
  { code: 'A02', service: 'Flag non-functioning streetlight', takes: '2 min', costs: 'Free', where: 'ONLINE' },
  { code: 'A03', service: 'Request stormwater drain clearing', takes: '3 min', costs: 'Free', where: 'ONLINE' },
  { code: 'B01', service: 'Schedule missed waste compactor', takes: '2 min', costs: 'Free', where: 'ONLINE' },
  { code: 'B02', service: 'Duplicate proximity radar check (50m)', takes: 'Instant', costs: 'Free', where: 'ONLINE' },
  { code: 'C01', service: 'Verify field repair with photo proof', takes: '24h SLA', costs: 'Free', where: 'ONLINE' },
  { code: 'D01', service: 'In-person ward inspection appeal', takes: '15 min', costs: 'Free', where: 'IN PERSON' },
];

const REVIEWS = [
  {
    quote:
      'When a deep pothole opened near Asad Avenue before the monsoon, I pinned it on CivicPulse with a photo. Within 18 hours the Roads crew patched it and uploaded verified before-and-after proof.',
    author: 'Tanima Chowdhury',
    role: 'Mohammadpur Resident • Ward 31',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    quote:
      'Having one unified board for streetlights, drainage, and waste requests eliminated endless phone calls. Neighborhood alerts keep our entire block informed in real time.',
    author: 'Rafiqul Islam',
    role: 'Dhanmondi Community Lead • Ward 15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    quote:
      'As a municipal operations coordinator, automatic 50-meter duplicate detection and instant SLA escalation cut our triage backlog in half across all zones.',
    author: 'Nusrat Jahan',
    role: 'Urban Infrastructure Analyst • DNCC',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Sarah Rahman',
    role: 'City Operations Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Tariq Rahman',
    role: 'Roads & Highways Manager',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Kamal Hossain',
    role: 'Lead Field Electrician',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Farhana Ahmed',
    role: 'Citizen Relations Coordinator',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
  },
];

const SERVICE_FAQS = [
  {
    q: 'How quickly are reported municipal issues triaged?',
    a: 'Critical hazards like open manholes or downed power lines enter an immediate 12-hour SLA window, while standard repairs are triaged within 24–48 hours.',
  },
  {
    q: 'What happens if a neighbor already reported the same issue?',
    a: 'CivicPulse automatically runs a 50-meter geospatial duplicate radar check and lets you upvote ("I See This Too") to boost priority instead of creating duplicate tickets.',
  },
  {
    q: 'Do I need an account to check citywide service status?',
    a: 'You can browse public service boards here anytime, and creating a free Citizen Portal account lets you submit GPS-pinned reports, get live 2FA alerts, and rate completed repairs.',
  },
  {
    q: 'How do I verify that a repair was actually completed?',
    a: 'Field technicians must upload geo-stamped completion photos before closing any work order, which you can inspect side-by-side in the Before & After Comparison slider.',
  },
];

export function ServicesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewIndex, setReviewIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [phone, setPhone] = useState('');
  const [callbackSent, setCallbackSent] = useState(false);

  const filteredServices = SERVICE_CARDS.filter(
    (s) =>
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeReview = REVIEWS[reviewIndex];

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setCallbackSent(true);
    setPhone('');
    setTimeout(() => setCallbackSent(false), 5000);
  };

  return (
    <div className="font-sans">
      {/* 1. HERO BANNER + LIVE DISPATCH TICKET (Homepage-style Video Background) */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24 min-h-[640px] flex items-center border-b border-[#D5DAE3] dark:border-[#232F46]">
        {/* Background Aerial City Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/services-hero-city.jpg"
            alt="Aerial view of city infrastructure and roads"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover scale-105"
          />

          {/* Readability scrim + Brand Yellow (#e2fa6b) / Dark (#0B0F17) Overlays matching Homepage Hero */}
          <div className="absolute inset-0 bg-[#F7F5EF]/55 dark:bg-[#0B0F17]/65 backdrop-blur-[1px] transition-colors duration-300" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#e2fa6b]/90 dark:from-[#0B0F17]/95 via-[#e2fa6b]/55 dark:via-[#0B0F17]/60 via-35% to-transparent to-70% transition-colors duration-300" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#e2fa6b] dark:from-[#0B0F17] to-transparent transition-colors duration-300" />
        </div>

        <div className="relative z-10 w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#e2fa6b] text-[#202B45]">
               Municipal Services • 24/7 Digital Grid
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#202B45] dark:text-white tracking-tight leading-[1.08]">
              Our Services, <br />
              Your City&apos;s{' '}
              <span className="font-serif italic font-normal text-[#315CFF] dark:text-[#6280FF]">
                Safety.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#202B45]/90 dark:text-slate-200 max-w-xl leading-relaxed font-medium">
              Every municipal service in one transparent portal — report hazards in seconds,
              track live crew dispatch, and inspect verified repair proof across Dhaka.
            </p>

            {/* Quick Service Search */}
            <div className="max-w-lg space-y-3">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] shadow-sm">
                <Search size={18} className="text-[#606B7D] ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Try "pothole", "streetlight", or "drainage"...'
                  className="flex-1 bg-transparent text-sm text-[#202B45] dark:text-white placeholder:text-[#606B7D] focus:outline-none py-2"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-[#606B7D] hover:text-[#202B45] dark:hover:text-white px-2"
                  >
                    Clear
                  </button>
                )}
                <a href="#services-grid">
                  <Button size="sm" className="rounded-lg bg-[#315CFF] hover:bg-[#244BE0] text-white px-4">
                    Search
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#606B7D] dark:text-slate-400 font-medium">Popular:</span>
                {['Pothole', 'Streetlight', 'Drainage', 'Waste'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] text-[#202B45] dark:text-slate-200 hover:border-[#315CFF] transition-colors font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Service Ticket + Field Photo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  NOW SERVING
                </span>
                <span className="text-[#606B7D] dark:text-slate-400">GRID NO. 0140</span>
              </div>

              <div className="text-4xl sm:text-5xl font-bold font-display text-[#315CFF] dark:text-[#6280FF] tracking-tight">
                CP·140
              </div>

              <div className="pt-3 border-t border-dashed border-[#D5DAE3] dark:border-[#232F46] flex items-center justify-between text-sm">
                <span className="text-[#606B7D] dark:text-slate-400">Average triage wait:</span>
                <span className="font-bold text-[#202B45] dark:text-white">4 min</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#606B7D] dark:text-slate-400">
                <span>Dhaka Smart Grid • Counter Open 24/7</span>
                <Link href="/citizen/create" className="font-semibold text-[#315CFF] hover:underline">
                  Report Now →
                </Link>
              </div>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden border border-[#D5DAE3] dark:border-[#232F46] shadow-md">
              <Image
                src="/about-road-works.jpg"
                alt="Municipal field crew in action"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#202B45]/80 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs font-medium text-white">
                  Verified municipal dispatch teams across 30+ city wards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CITY SERVICES MADE SIMPLE (6-CARD GRID) */}
      <section id="services-grid" className="py-16 sm:py-20 bg-white dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                Services
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              City Services, Made Simple
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              From emergency response to everyday public infrastructure, explore dedicated municipal services built for fast, transparent citywide action.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#4B5568] dark:text-slate-300 pt-2">
              <span className="inline-flex items-center gap-1.5">
                <Check size={15} className="text-[#315CFF]" /> Community Engagement
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={15} className="text-[#315CFF]" /> Fast Emergency Response
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={15} className="text-[#315CFF]" /> SLA Verified Repairs
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group rounded-2xl bg-[#F7F5EF] dark:bg-[#141B29] overflow-hidden flex flex-col justify-between transition-colors"
                >
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#e2fa6b] text-[#202B45] text-[11px] font-mono font-bold">
                        {service.tag}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-[#315CFF]/10 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#202B45] dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#4B5568] dark:text-slate-300 leading-relaxed">
                      {service.desc}
                    </p>
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#315CFF] dark:text-[#6280FF] pt-1 group-hover:gap-2.5 transition-all"
                    >
                      Explore More <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FOUR COUNTERS. PICK YOURS. */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                Pick a Counter
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              Four Counters. Pick Yours.
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Choose whether you want to report a new hazard, track an ongoing repair, access your role portal, or find ward hotlines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COUNTERS.map((counter) => (
              <div
                key={counter.title}
                className={`rounded-2xl p-6 flex flex-col justify-between space-y-6 ${counter.theme}`}
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono opacity-75">{counter.num}</span>
                  <h3 className="text-2xl font-bold font-display">{counter.title}</h3>
                  <p className="text-sm opacity-85 leading-relaxed">{counter.subtitle}</p>
                </div>

                <div className="divide-y divide-current/10">
                  {counter.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`py-2.5 flex items-center justify-between text-sm font-medium transition-colors ${counter.linkClass}`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} className="shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TODAY AT THE COUNTER (SLA & TURNAROUND TABLE) */}
      <section className="py-16 sm:py-20 bg-[#202B45] dark:bg-[#0E1420] text-white">
        <div className="w-[80%] mx-auto space-y-8">
          <div className="text-center max-w-4xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#e2fa6b]/45 bg-transparent text-[#e2fa6b] text-[16px] font-sans font-medium transition-colors">
                The Board
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight transition-colors">
              Today at the Counter
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Live turnaround estimates, service fees, and digital availability across all active municipal desks.
            </p>
          </div>

          <div className="rounded-2xl bg-[#182238] dark:bg-[#141B29] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-mono uppercase text-slate-400">
                    <th className="py-3.5 px-5">Code</th>
                    <th className="py-3.5 px-5">Service</th>
                    <th className="py-3.5 px-5">Takes</th>
                    <th className="py-3.5 px-5">Costs</th>
                    <th className="py-3.5 px-5 text-right">Where</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {COUNTER_BOARD.map((row) => (
                    <tr key={row.code} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-400">{row.code}</td>
                      <td className="py-3.5 px-5 font-semibold text-white">{row.service}</td>
                      <td className="py-3.5 px-5 text-slate-300">{row.takes}</td>
                      <td className="py-3.5 px-5 text-slate-300">{row.costs}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold ${
                            row.where === 'ONLINE'
                              ? 'bg-[#315CFF]/30 text-[#91A5FF] border border-[#315CFF]/50'
                              : 'bg-white/10 text-slate-200 border border-white/15'
                          }`}
                        >
                          {row.where}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEFORE YOU COME IN PERSON & COUNTER HOURS */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                In-Person Desk
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              Before You Come In Person
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Most ward office visits take one trip when you bring these four items. No appointment needed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-[#F7F5EF] dark:bg-[#141B29] divide-y divide-[#D5DAE3] dark:divide-[#232F46]">
              {[
                { title: 'National ID / Photo ID', desc: 'NID, passport, or government-issued photo identification.' },
                { title: 'Proof of Ward Address', desc: 'Utility bill or lease showing your Dhaka ward sector.' },
                { title: 'Your Tracking Code', desc: 'The CP-code from your confirmation email or portal.' },
                { title: 'Supporting Photo Evidence', desc: 'Geo-tagged photos or inspection notes for faster review.' },
              ].map((item) => (
                <div key={item.title} className="p-4 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#315CFF] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202B45] dark:text-white">{item.title}</h4>
                    <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F5EF] dark:bg-[#141B29] space-y-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#606B7D] dark:text-slate-400">
                  Civic Center • Nagar Bhaban &amp; DNCC
                </span>
                <h3 className="text-2xl font-bold font-display text-[#315CFF] dark:text-[#6280FF] mt-1">
                  Counter hours
                </h3>
              </div>

              <div className="divide-y divide-[#D5DAE3] dark:divide-[#232F46] text-sm">
                {[
                  { day: 'Sun – Thu', hours: '9:00 am – 5:00 pm' },
                  { day: 'Friday', hours: 'Closed (Online 24/7)' },
                  { day: 'Saturday', hours: '10:00 am – 2:00 pm (Emergency Desk)' },
                  { day: 'Online Portal', hours: 'Open 24 hours / 7 days' },
                ].map((row) => (
                  <div key={row.day} className="py-3 flex items-center justify-between">
                    <span className="font-semibold text-[#202B45] dark:text-white">{row.day}</span>
                    <span className="text-[#4B5568] dark:text-slate-300 font-mono text-xs flex items-center gap-1.5">
                      <Clock size={13} className="text-[#315CFF]" /> {row.hours}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#606B7D] dark:text-slate-400">
                In-person ticket desk closes 30 minutes prior to counter closing. Digital reports are triaged continuously.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* 6. CITIZEN REVIEWS & DEDICATED TEAM */}
      <section className="py-16 sm:py-20 bg-[#0B0F17] text-white">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#e2fa6b]/45 bg-transparent text-[#e2fa6b] text-[16px] font-sans font-medium transition-colors">
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight transition-colors">
              Citizen Reviews
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Verified stories from Dhaka residents and municipal coordinators using CivicPulse every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={activeReview.avatar}
                  alt={activeReview.author}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7 space-y-6">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                &ldquo;{activeReview.quote}&rdquo;
              </p>
            <div>
              <p className="font-bold text-white">{activeReview.author}</p>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{activeReview.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous review"
                onClick={() => setReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)}
                className="w-10 h-10 rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white flex items-center justify-center transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next review"
                onClick={() => setReviewIndex((prev) => (prev + 1) % REVIEWS.length)}
                className="w-10 h-10 rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white flex items-center justify-center transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Dedicated Team Members */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                Our Team
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              Our Dedicated Team Members
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Meet the municipal managers, engineers, and citizen coordinators keeping Dhaka&apos;s infrastructure running safely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl bg-white dark:bg-[#141B29] overflow-hidden"
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
                <div className="p-4 text-center">
                  <h3 className="font-bold text-[#202B45] dark:text-white">{member.name}</h3>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMON QUESTIONS + NEED HELP CALLBACK */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F17] border-t border-[#D5DAE3] dark:border-[#232F46]">
        <div className="w-[80%] mx-auto space-y-14">
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                  FAQs
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
                Common Questions
              </h2>
              <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
                Quick answers about SLA turnaround times, duplicate detection, and verified field repair proof.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICE_FAQS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-xl bg-[#F7F5EF] dark:bg-[#141B29] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 font-semibold text-sm text-[#202B45] dark:text-white"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#315CFF]' : ''}`}
                      />
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

          {/* Need Help Callback Pill */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#F7F5EF] dark:bg-[#141B29] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#202B45] dark:text-white">
                Need help? Fill the form and we will contact you.
              </h3>
              <p className="text-sm text-[#606B7D] dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Direct callback from CivicPulse Municipal Dispatch Support.
              </p>
            </div>

            {callbackSent ? (
              <div className="px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} /> Callback requested! Our desk will reach out shortly.
              </div>
            ) : (
              <form
                onSubmit={handleCallbackSubmit}
                className="flex items-center gap-2 p-1.5 rounded-full bg-white dark:bg-[#0B0F17] border border-[#D5DAE3] dark:border-[#232F46] w-full lg:w-auto lg:min-w-[360px]"
              >
                <Phone size={16} className="text-[#606B7D] ml-3 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (+880 17...)"
                  required
                  className="flex-1 bg-transparent text-sm text-[#202B45] dark:text-white placeholder:text-[#606B7D] focus:outline-none px-2 py-2"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white px-5 h-10"
                >
                  Submit
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
