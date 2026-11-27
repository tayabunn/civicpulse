'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setDemoPersona } from '../../store/authSlice';
import { ROLE_PLANS } from './data';
import { Button } from '../ui/button';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  HardHat,
  KeyRound,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const ROLE_ICONS = [Users, ClipboardList, HardHat, ShieldCheck];

const ACCESS_STEPS = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Citizens self-register with a mobile number, while municipal staff are invited by their department administrator.',
  },
  {
    num: '02',
    title: 'Verify your identity',
    desc: 'One-time codes and two-factor authentication protect every sign-in. Elevated roles require department approval.',
  },
  {
    num: '03',
    title: 'Enter your workspace',
    desc: 'The portal detects your role and opens only the dashboards, tools, and permissions assigned to you.',
  },
  {
    num: '04',
    title: 'Keep every action auditable',
    desc: 'Status changes, department handoffs, and photo proof are written to a permanent, tamper-evident audit trail.',
  },
];

const SECURITY_STANDARDS = [
  {
    icon: KeyRound,
    title: 'Role-based permissions',
    desc: 'Every account sees only the cases, crews, and budgets its role is cleared to manage.',
  },
  {
    icon: ShieldCheck,
    title: 'Two-factor sign-in',
    desc: 'OTP verification on every new device keeps citizen and staff accounts protected.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified field identity',
    desc: 'Contractor and crew accounts are tied to municipal credentials before work orders unlock.',
  },
  {
    icon: Clock,
    title: 'Always-on access',
    desc: 'Citizen reporting and manager triage stay online 24/7, even when ward counters are closed.',
  },
];

const PORTAL_BOARD = [
  {
    code: 'CP·01',
    portal: 'Citizens',
    bestFor: 'Reporting hazards, tracking repairs, rating closures',
    signIn: 'Public sign-up + OTP',
    availability: '24/7',
    online: true,
  },
  {
    code: 'CP·02',
    portal: 'Department Managers',
    bestFor: 'Triage queues, crew assignment, SLA escalation',
    signIn: 'Staff credentials + 2FA',
    availability: '24/7',
    online: true,
  },
  {
    code: 'CP·03',
    portal: 'Maintenance Staff',
    bestFor: 'Mobile work orders, navigation, before & after proof',
    signIn: 'Field login + 2FA',
    availability: '06:00 – 23:00',
    online: false,
  },
  {
    code: 'CP·04',
    portal: 'Administrators',
    bestFor: 'Citywide analytics, budgets, audit governance',
    signIn: 'Executive access + 2FA',
    availability: '24/7',
    online: true,
  },
];

const PORTAL_FAQS = [
  {
    q: 'Do I need a separate account for each portal?',
    a: 'No. One CivicPulse account carries your role, and the portal opens the workspace your permissions allow after sign-in.',
  },
  {
    q: 'How do municipal staff get access?',
    a: 'Department managers invite field crew by municipal email. City administrators approve elevated roles before the first sign-in.',
  },
  {
    q: 'Can my role change later?',
    a: 'Yes. Citizens can apply for staff access, and administrators can reassign roles without losing any linked case history.',
  },
  {
    q: 'What protects citizen and municipal data?',
    a: 'Two-factor sign-in, encrypted sessions, role-scoped data access, and immutable audit logs protect every record in the grid.',
  },
];

export function PortalsPageContent() {
  const dispatch = useDispatch();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="font-sans">
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24 min-h-[640px] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/contact-hero-cityhall.jpg"
            alt="Civic district headquarters where municipal portals are managed"
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
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#e2fa6b] text-[#202B45]">
              <Sparkles size={13} /> CivicPulse Portals • Secure Role Access
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#202B45] dark:text-white tracking-tight leading-[1.08]">
              Four Portals. <br />
              One Connected{' '}
              <span className="font-serif italic font-normal text-[#315CFF] dark:text-[#6280FF]">
                City.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#202B45]/90 dark:text-slate-200 max-w-xl leading-relaxed font-medium">
              Citizens report. Managers dispatch. Crews repair. Leaders govern. Sign in to the workspace built for your role, with one verified case history behind every action.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/citizen">
                <Button className="rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white px-7 h-11 text-sm font-semibold shadow-lg">
                  Open Citizen Portal
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full bg-white/90 dark:bg-[#141B29]/90 border-[#D5DAE3] dark:border-[#232F46] text-[#202B45] dark:text-white px-6 h-11 text-sm font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#141B29] space-y-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#315CFF] dark:text-[#6280FF] uppercase tracking-wider">
                  Secure Access Console
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2fa6b] text-[#202B45] font-bold">
                  LIVE GRID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-lg bg-[#F7F5EF] dark:bg-[#1B2435] border border-[#D5DAE3] dark:border-[#232F46]">
                  <p className="text-3xl font-bold font-display text-[#202B45] dark:text-white">
                    4
                  </p>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">
                    Role-Based Portals
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#F7F5EF] dark:bg-[#1B2435] border border-[#D5DAE3] dark:border-[#232F46]">
                  <p className="text-3xl font-bold font-display text-[#315CFF] dark:text-[#6280FF]">
                    2FA
                  </p>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 mt-0.5">
                    Every Sign-In
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-[#D5DAE3] dark:border-[#232F46] flex items-center justify-between text-xs text-[#606B7D] dark:text-slate-400">
                <span>One account • role-scoped permissions</span>
                <a href="#access-guide" className="font-semibold text-[#315CFF] dark:text-[#6280FF] hover:underline">
                  Access Guide →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portals" className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                Portals &amp; Access
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              Our Dedicated Portals
            </h2>
            <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
              One connected city, four dedicated operational workspaces. Pick the portal that matches your role and responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLE_PLANS.map((plan, index) => {
              const featured = Boolean(plan.popular);
              const Icon = ROLE_ICONS[index % ROLE_ICONS.length];
              const cardNumber = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={plan.role}
                  className={`group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                    featured
                      ? 'bg-[#315CFF] text-white shadow-[0_18px_40px_rgba(49,92,255,0.28)]'
                      : 'bg-white dark:bg-[#141B29] text-[#202B45] dark:text-white shadow-[0_8px_28px_rgba(20,32,56,0.06)] hover:shadow-[0_18px_40px_rgba(20,32,56,0.12)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-mono font-semibold ${
                          featured ? 'text-white/80' : 'text-[#606B7D] dark:text-slate-400'
                        }`}
                      >
                        <span className="tabular-nums">{cardNumber}</span>
                        <span className="opacity-40">•</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                          featured ? 'bg-white/15 text-white' : 'bg-[#e2fa6b] text-[#202B45]'
                        }`}>
                          {featured ? `Core ${plan.badge}` : plan.badge}
                        </span>
                      </div>
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          featured ? 'bg-white/15 text-white' : 'bg-[#315CFF]/10 text-[#315CFF] dark:text-[#6280FF]'
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold font-display tracking-tight leading-snug ${featured ? 'text-white' : 'text-[#202B45] dark:text-white'}`}>
                      {plan.title}
                    </h3>
                    <p className={`text-xs font-semibold mt-1 ${featured ? 'text-[#e2fa6b]' : 'text-[#315CFF] dark:text-[#6280FF]'}`}>
                      {plan.tagline}
                    </p>
                    <p className={`text-sm leading-relaxed mt-3 ${featured ? 'text-white/85' : 'text-[#4B5568] dark:text-slate-300'}`}>
                      {plan.description}
                    </p>

                    <div className={`text-xs font-mono font-bold uppercase tracking-wider mt-5 mb-3 ${featured ? 'text-white/90' : 'text-[#202B45] dark:text-white'}`}>
                      Included capabilities
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs leading-snug">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            featured ? 'bg-[#e2fa6b] text-[#202B45]' : 'bg-[#315CFF] text-white'
                          }`}>
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className={featured ? 'text-white/90' : 'text-[#4B5568] dark:text-slate-300'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={plan.href}
                    onClick={() => dispatch(setDemoPersona(plan.role))}
                    className="w-full block"
                  >
                    <Button
                      className={`w-full justify-between font-sans font-semibold text-xs rounded-full h-11 px-5 active:scale-[0.97] transition-all ${
                        featured
                          ? 'bg-[#e2fa6b] text-[#202B45] hover:bg-[#d5f055]'
                          : 'bg-[#202B45] text-white hover:bg-[#1e2f52]'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="access-guide" className="py-16 sm:py-20 bg-[#F7F5F0] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                  Access Guide
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
                From Sign-Up to Sign-Off
              </h2>
              <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
                Getting into the right workspace takes minutes, and every step is designed to protect public records.
              </p>
            </div>

            <div className="divide-y divide-[#D5DAE3] dark:divide-[#232F46]">
              {ACCESS_STEPS.map((step) => (
                <div key={step.num} className="py-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full border border-[#315CFF]/40 text-[#315CFF] dark:text-[#6280FF] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#202B45] dark:text-white">{step.title}</h3>
                    <p className="text-sm text-[#4B5568] dark:text-slate-300 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#202B45] dark:bg-[#141B29] text-white space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[#e2fa6b]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#e2fa6b]">
                    Access &amp; Security Standards
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2fa6b] text-[#202B45] text-[10px] font-mono font-bold">
                  2FA PROTECTED
                </span>
              </div>

              <div className="space-y-4">
                {SECURITY_STANDARDS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white/10 text-[#e2fa6b] flex items-center justify-center shrink-0">
                        <Icon size={15} />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Activity size={13} className="text-[#e2fa6b]" /> Grid status: operational
                </span>
                <Link href="/features" className="font-semibold text-[#e2fa6b] hover:underline">
                  Security details →
                </Link>
              </div>
            </div>

            <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#D5DAE3] dark:border-[#232F46] shadow-sm">
              <Image
                src="/about-gis-dispatch.jpg"
                alt="Municipal GIS dispatch map used across CivicPulse portals"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#202B45]/80 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs font-medium text-white flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#e2fa6b]" />
                  Every portal reads from the same live city grid
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#202B45] dark:bg-[#0B0F17] text-white">
        <div className="w-[80%] mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#e2fa6b]/45 bg-transparent text-[#e2fa6b] text-[16px] font-sans font-medium">
                The Board
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Portal Quick Reference
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Sign-in requirements, availability windows, and the daily work each portal is built to handle.
            </p>
          </div>

          <div className="rounded-2xl bg-[#182238] dark:bg-[#141B29] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-mono uppercase text-slate-400">
                    <th className="py-3.5 px-5">Code</th>
                    <th className="py-3.5 px-5">Portal</th>
                    <th className="py-3.5 px-5">Best For</th>
                    <th className="py-3.5 px-5">Sign-In</th>
                    <th className="py-3.5 px-5 text-right">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm">
                  {PORTAL_BOARD.map((row) => (
                    <tr key={row.code} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-400">{row.code}</td>
                      <td className="py-3.5 px-5 font-semibold text-white">{row.portal}</td>
                      <td className="py-3.5 px-5 text-slate-300">{row.bestFor}</td>
                      <td className="py-3.5 px-5 text-slate-300">{row.signIn}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold ${
                            row.online
                              ? 'bg-[#315CFF]/30 text-[#91A5FF] border border-[#315CFF]/50'
                              : 'bg-white/10 text-slate-200 border border-white/15'
                          }`}
                        >
                          {row.availability}
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

      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-14">
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div>
                <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium">
                  FAQs
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
                Portal Access Questions
              </h2>
              <p className="text-base sm:text-lg text-[#4B5568] dark:text-slate-300 leading-relaxed">
                Quick answers about accounts, roles, and protecting municipal records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PORTAL_FAQS.map((item, idx) => {
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
                      <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#315CFF]' : 'text-[#606B7D]'}`}
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

          <div className="p-8 sm:p-10 rounded-2xl bg-[#315CFF] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold font-display">
                Not sure which portal fits your role?
              </h3>
              <p className="text-sm text-white/85 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#e2fa6b]" />
                Our access desk will route you to the right workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white px-6 h-11 text-sm font-semibold"
                >
                  Talk to Support
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] px-6 h-11 text-sm font-bold">
                  Create Citizen Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
