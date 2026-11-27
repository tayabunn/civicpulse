'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const SWITCHBOARD_LINES = [
  {
    tag: 'LINE 1 • CALL',
    metric: '42',
    unit: 'sec • average time to answer',
    title: 'Call 333 / 16106',
    desc: 'Direct municipal helpline for urgent civic guidance.',
    featured: true,
  },
  {
    tag: 'LINE 2 • PORTAL',
    metric: '2',
    unit: 'min • GPS-pinned submission',
    title: 'Report Online',
    desc: 'Upload a photo and pin exact coordinates in seconds.',
    featured: false,
  },
  {
    tag: 'LINE 3 • WRITE',
    metric: '1',
    unit: 'day • one working day, at most',
    title: 'Write to Us',
    desc: 'support@civicpulse.gov.bd — answered by a real clerk.',
    featured: false,
  },
  {
    tag: 'LINE 4 • VISIT',
    metric: '9–5',
    unit: 'Sun–Thu • no appointment needed',
    title: 'City Hall Front Desk',
    desc: 'Nagar Bhaban, Gulistan, Dhaka 1000.',
    featured: false,
  },
];

const DEPARTMENT_LINES = [
  {
    num: '01 / 06',
    name: 'Roads & Highways (RHD)',
    scope: 'Potholes, asphalt resurfacing, speed breakers, culverts',
    phone: '+880 2-9556011',
    email: 'roads@civicpulse.gov.bd',
  },
  {
    num: '02 / 06',
    name: 'Water & Sewerage (WASA)',
    scope: 'Stormwater drains, waterlogging, burst mains, manholes',
    phone: '+880 2-9556014',
    email: 'water@civicpulse.gov.bd',
  },
  {
    num: '03 / 06',
    name: 'Electrical & Lighting',
    scope: 'Streetlight outages, high-mast poles, exposed wiring',
    phone: '+880 2-9556018',
    email: 'lighting@civicpulse.gov.bd',
  },
  {
    num: '04 / 06',
    name: 'Solid Waste Management',
    scope: 'Compactor schedules, secondary transfer bins, cleanup',
    phone: '+880 2-9556022',
    email: 'waste@civicpulse.gov.bd',
  },
  {
    num: '05 / 06',
    name: 'Parks & Footpaths',
    scope: 'Pedestrian walkways, overpass railings, public green spaces',
    phone: '+880 2-9556025',
    email: 'parks@civicpulse.gov.bd',
  },
  {
    num: '06 / 06',
    name: 'City Operations Desk',
    scope: 'SLA escalations, public advisories, executive feedback',
    phone: '+880 2-9556000',
    email: 'operations@civicpulse.gov.bd',
  },
];

const WALK_IN_OFFICES = [
  {
    code: 'OFFICE 01',
    name: 'Nagar Bhaban Civic Center',
    address: 'Fulbaria, Gulistan, Dhaka 1000',
    hours: 'Sun – Thu • 9:00 am – 5:00 pm',
    open: true,
  },
  {
    code: 'OFFICE 02',
    name: 'DNCC Gulshan Regional Hub',
    address: 'Plot 23–26, Road 46, Gulshan 2',
    hours: 'Sun – Thu • 9:00 am – 5:00 pm',
    open: true,
  },
  {
    code: 'OFFICE 03',
    name: 'Mohammadpur Ward 31 Desk',
    address: 'Asad Avenue, Town Hall, Dhaka 1207',
    hours: 'Sun – Thu • 9:00 am – 4:00 pm',
    open: true,
  },
];

export function ContactPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('Roads & Potholes');
  const [message, setMessage] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useGSAP(
    () => {
      if (typeof window === 'undefined') return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.contact-reveal', {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    const code = `CP-MSG-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(code);
    setName('');
    setContact('');
    setMessage('');
  };

  return (
    <div ref={containerRef} className="font-sans">
      {/* 1. FULL-BLEED CONTACT HERO (Matching /services, /features & /about) */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24 min-h-[640px] flex items-center border-b border-[#D5DAE3] dark:border-[#232F46]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/contact-hero-cityhall.jpg"
            alt="Municipal City Hall headquarters"
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
          <div className="contact-reveal lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#e2fa6b] text-[#202B45]">
              <Sparkles size={13} /> Civic Dispatch Desk • Lines Open
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#202B45] dark:text-white tracking-tight leading-[1.08]">
              One Number. <br />
              A Real{' '}
              <span className="font-serif italic font-normal text-[#315CFF] dark:text-[#6280FF]">
                Team.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#202B45]/90 dark:text-slate-200 max-w-xl leading-relaxed font-medium">
              Call, write, submit online, or walk in. Every civic inquiry receives a verified tracking number and a prompt municipal response.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a href="#contact-form">
                <Button className="rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white px-7 h-11 text-sm font-semibold shadow-lg">
                  Write to Us
                </Button>
              </a>
              <Link href="/citizen/help">
                <Button
                  variant="outline"
                  className="rounded-full bg-white/90 dark:bg-[#141B29]/90 border-[#D5DAE3] dark:border-[#232F46] text-[#202B45] dark:text-white px-6 h-11 text-sm font-semibold"
                >
                  Emergency Hotlines
                </Button>
              </Link>
            </div>
          </div>

          <div className="contact-reveal lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#141B29] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#315CFF] dark:text-[#6280FF] uppercase tracking-wider">
                  Municipal Headquarters
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2fa6b] text-[#202B45] font-bold">
                  OPEN 24/7 ONLINE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-sm">
                <div>
                  <span className="text-xs text-[#606B7D] dark:text-slate-400 block">Address</span>
                  <span className="font-semibold text-[#202B45] dark:text-white">
                    Nagar Bhaban, Gulistan, Dhaka
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#606B7D] dark:text-slate-400 block">Phone</span>
                  <span className="font-semibold text-[#202B45] dark:text-white">
                    +880 2-9556000
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#606B7D] dark:text-slate-400 block">Email</span>
                  <span className="font-semibold text-[#202B45] dark:text-white">
                    support@civicpulse.gov.bd
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#606B7D] dark:text-slate-400 block">Counter Hours</span>
                  <span className="font-semibold text-[#202B45] dark:text-white">
                    Sun–Thu • 9am – 5pm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SWITCHBOARD — FOUR LINES IN. PICK THE FASTEST. */}
      <section className="py-16 sm:py-20 bg-[#F7F5F0] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                Switchboard
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              Four Lines In. Pick the Fastest.
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              Every channel routes directly to the same municipal triage desk with a unified tracking number.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SWITCHBOARD_LINES.map((line) => (
              <div
                key={line.tag}
                className={`p-6 rounded-2xl flex flex-col justify-between space-y-6 ${
                  line.featured
                    ? 'bg-[#315CFF] text-white'
                    : 'bg-[#F7F5EF] dark:bg-[#141B29] text-[#202B45] dark:text-white'
                }`}
              >
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-80 block">
                    {line.tag}
                  </span>
                  <div>
                    <p
                      className={`text-4xl sm:text-5xl font-bold font-display ${
                        line.featured ? 'text-white' : 'text-[#315CFF] dark:text-[#6280FF]'
                      }`}
                    >
                      {line.metric}
                    </p>
                    <p className="text-xs opacity-80 mt-1">{line.unit}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-current/15 space-y-1">
                  <h3 className="text-base font-bold">{line.title}</h3>
                  <p className="text-xs opacity-85 leading-relaxed">{line.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEND A MESSAGE TO CITY HALL (INTERACTIVE FORM) */}
      <section id="contact-form" className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                Get in Touch
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              Send a Message to City Hall
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              Need more details, want to share feedback, or follow up on a municipal work order? Our desk responds promptly.
            </p>

            <div className="divide-y divide-[#D5DAE3] dark:divide-[#232F46]">
              {[
                { num: '01', text: 'You receive a case reference number immediately.' },
                { num: '02', text: 'A municipal coordinator reviews every inquiry — no bots.' },
                { num: '03', text: 'Guaranteed response within one working day.' },
              ].map((item) => (
                <div key={item.num} className="py-3.5 flex items-center gap-3.5">
                  <span className="text-xs font-mono font-bold text-[#315CFF] dark:text-[#6280FF]">
                    {item.num}
                  </span>
                  <span className="text-sm font-medium text-[#202B45] dark:text-slate-200">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141B29]">
              {submittedRef ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#e2fa6b] text-[#202B45] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-[#202B45] dark:text-white">
                    Message Delivered to City Desk
                  </h3>
                  <p className="text-sm text-[#4B5568] dark:text-slate-300 max-w-md mx-auto">
                    Your inquiry has been logged under reference{' '}
                    <span className="font-mono font-bold text-[#315CFF] dark:text-[#6280FF]">
                      {submittedRef}
                    </span>
                    . Expect a response within one working day.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSubmittedRef(null)}
                    className="rounded-lg"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold uppercase text-[#606B7D] dark:text-slate-400">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tayabunnesa"
                        required
                        className="w-full h-11 px-3.5 rounded-lg border border-[#D5DAE3] dark:border-[#232F46] bg-[#F7F5EF] dark:bg-[#0B0F17] text-sm text-[#202B45] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315CFF]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold uppercase text-[#606B7D] dark:text-slate-400">
                        Email or Phone *
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="name@gmail.com or +880 17..."
                        required
                        className="w-full h-11 px-3.5 rounded-lg border border-[#D5DAE3] dark:border-[#232F46] bg-[#F7F5EF] dark:bg-[#0B0F17] text-sm text-[#202B45] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315CFF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase text-[#606B7D] dark:text-slate-400">
                      Topic / Department
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D5DAE3] dark:border-[#232F46] bg-[#F7F5EF] dark:bg-[#0B0F17] text-sm text-[#202B45] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315CFF]"
                    >
                      <option value="Roads & Potholes">Roads &amp; Potholes</option>
                      <option value="Water & Drainage">Water &amp; Drainage</option>
                      <option value="Streetlights & Grid">Streetlights &amp; Grid</option>
                      <option value="Waste Management">Waste Management</option>
                      <option value="General City Inquiry">General City Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase text-[#606B7D] dark:text-slate-400">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what happened, the ward/street location, or how we can help..."
                      required
                      className="w-full p-3.5 rounded-lg border border-[#D5DAE3] dark:border-[#232F46] bg-[#F7F5EF] dark:bg-[#0B0F17] text-sm text-[#202B45] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315CFF]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto rounded-lg bg-[#315CFF] hover:bg-[#244BE0] text-white px-7 h-11 text-sm font-semibold gap-2"
                  >
                    <Send size={15} /> Send to City Hall
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. DIRECT LINES — ASK A DEPARTMENT DIRECTLY (6-CARD GRID) */}
      <section className="py-16 sm:py-20 bg-[#F7F5F0] dark:bg-[#0E1420] border-y border-[#D5DAE3] dark:border-[#232F46]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                Direct Lines
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              Ask a Department Directly
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              Desks answer Sun–Thu, 9:00 am – 5:00 pm. After hours, digital triage logs your ticket immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEPARTMENT_LINES.map((dept) => (
              <div
                key={dept.num}
                className="p-6 rounded-2xl bg-[#F7F5EF] dark:bg-[#141B29] space-y-4 transition-colors"
              >
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-[#606B7D] dark:text-slate-400">
                    {dept.num}
                  </span>
                  <h3 className="text-lg font-bold font-display text-[#315CFF] dark:text-[#6280FF]">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-[#4B5568] dark:text-slate-300 leading-relaxed">
                    {dept.scope}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D5DAE3] dark:border-[#232F46] space-y-1.5 text-xs">
                  <p className="font-mono font-semibold text-[#202B45] dark:text-white flex items-center gap-2">
                    <Phone size={13} className="text-[#315CFF]" /> {dept.phone}
                  </p>
                  <p className="font-mono text-[#4B5568] dark:text-slate-300 flex items-center gap-2">
                    <Mail size={13} className="text-[#315CFF]" /> {dept.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FIND US HERE — WALK-IN OFFICES & MAP */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                Walk-In Desks
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              Find Us Here
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              Visit any Dhaka municipal citizen desk in person or open the live geospatial incident map.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 space-y-4">
              {WALK_IN_OFFICES.map((office) => (
                <div
                  key={office.code}
                  className="p-5 rounded-2xl bg-white dark:bg-[#141B29] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#606B7D] dark:text-slate-400">
                      {office.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315CFF] dark:text-[#6280FF]">
                      <span className="w-2 h-2 rounded-full bg-[#e2fa6b] ring-1 ring-[#202B45]/20" />
                      Open Sun–Thu
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#202B45] dark:text-white">
                    {office.name}
                  </h3>
                  <p className="text-xs text-[#4B5568] dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#315CFF] shrink-0" /> {office.address}
                  </p>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#315CFF] shrink-0" /> {office.hours}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-white dark:bg-[#141B29] flex flex-col">
              <div className="relative flex-1 min-h-[320px]">
                <iframe
                  title="Dhaka Municipal Civic Center Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.3750%2C23.7150%2C90.4350%2C23.7650&layer=mapnik&marker=23.7260%2C90.4086"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                />
              </div>
              <div className="p-4 border-t border-[#D5DAE3] dark:border-[#232F46] flex items-center justify-between gap-4">
                <span className="text-xs text-[#606B7D] dark:text-slate-400">
                  Nagar Bhaban Civic Center • 23.7260° N, 90.4086° E
                </span>
                <Link
                  href="/citizen/map"
                  className="text-xs font-bold text-[#315CFF] dark:text-[#6280FF] inline-flex items-center gap-1 hover:underline shrink-0"
                >
                  Open Live Incident Map <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Emergency Hotlines Callout Card (inside Find Us Here section) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#202B45] dark:bg-[#141B29] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                Urgent Life-Safety Hazard? Call 999 Immediately.
              </h3>
              <p className="text-sm text-slate-300">
                For municipal infrastructure issues (potholes, streetlights, drainage), use CivicPulse 24/7 digital triage.
              </p>
            </div>
            <Link href="/citizen/help" className="shrink-0">
              <Button className="rounded-lg bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] font-bold gap-2">
                View Emergency Hotlines <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
