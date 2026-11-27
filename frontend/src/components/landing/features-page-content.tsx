'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  MapPin,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';

const CAPABILITY_PILLS = [
  {
    id: 'radar',
    label: '50m Duplicate Radar',
    metric: '50m',
    title: 'Geospatial Proximity Detection',
    desc: 'Automatically scans active reports within 50 meters using Haversine coordinates to prevent duplicate tickets and merge community upvotes.',
  },
  {
    id: 'sla',
    label: 'Automated SLA Engine',
    metric: '94.2%',
    title: 'Real-Time Turnaround Enforcement',
    desc: 'Every issue gets an automated 12h–72h SLA clock based on severity, triggering executive escalations before deadlines are breached.',
  },
  {
    id: 'proof',
    label: 'Before & After Proof',
    metric: '100%',
    title: 'Photo-Verified Repair Closure',
    desc: 'Field crews cannot close a work order without uploading geo-stamped completion photography compared side-by-side with the original report.',
  },
  {
    id: 'bi',
    label: 'Executive BI & Budget',
    metric: '4 Portals',
    title: 'Citywide Telemetry & Spending Ledger',
    desc: 'Unified analytics, department rankings, contractor scorecards, and ward-level budget tracking in one governance hub.',
  },
];

const CORE_CAPABILITIES = [
  {
    tag: 'GEOSPATIAL',
    title: '50m Duplicate Proximity Radar',
    desc: 'Automatically detects existing nearby reports in the same category and lets neighbors upvote ("I See This Too") instead of flooding queues.',
    icon: Radar,
    href: '/citizen/create',
  },
  {
    tag: 'MAPPING',
    title: 'Sub-Meter GPS & Live City Map',
    desc: 'Pinpoint potholes, dark alleys, or open manholes on an interactive Dhaka map with real-time severity markers and ward filtering.',
    icon: MapPin,
    href: '/citizen/map',
  },
  {
    tag: 'AUTOMATION',
    title: 'Automated SLA & Escalations',
    desc: 'Priority-based turnaround targets (12h Critical, 24h High, 48h Medium) with live overdue alerts for managers and city admins.',
    icon: Clock,
    href: '/portals',
  },
  {
    tag: 'VERIFICATION',
    title: 'Before & After Photo Slider',
    desc: 'Inspect repaired infrastructure with an interactive comparison slider between citizen evidence and crew completion photos.',
    icon: SlidersHorizontal,
    href: '/citizen/reports',
  },
  {
    tag: 'REAL-TIME',
    title: 'Role-Scoped Live Notifications',
    desc: 'Instant database-backed alerts tailored to Citizens, Field Staff, Managers, and Admins with direct one-click issue navigation.',
    icon: BellRing,
    href: '/login',
  },
  {
    tag: 'GOVERNANCE',
    title: 'Budget, Vendors & Audit Ledger',
    desc: 'Track ward repair budgets, contractor SLA ratings, and tamper-evident activity logs with one-click CSV and PDF exports.',
    icon: Wallet,
    href: '/portals',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    status: 'Submitted',
    actor: 'Citizen Portal',
    sla: 'Instant (< 1 min)',
    summary: 'Citizen captures photo, pins GPS coordinates, and submits. 50m radar checks for duplicates and assigns a CP tracking code.',
    outputs: ['Auto-routed to matching department', 'CP tracking ID issued', 'Live notification dispatched'],
  },
  {
    step: '02',
    status: 'Under Review',
    actor: 'Department Manager',
    sla: 'Within 2 hrs',
    summary: 'Department manager reviews severity, verifies location accuracy, and confirms priority tier (Critical, High, Medium, or Low).',
    outputs: ['Priority & SLA clock locked', 'Duplicate check verified', 'Audit trail entry recorded'],
  },
  {
    step: '03',
    status: 'Assigned',
    actor: 'Department Manager',
    sla: 'Within 4 hrs',
    summary: 'Manager dispatches the work order to an available field technician or licensed municipal contractor with GPS directions.',
    outputs: ['Work order pushed to Staff board', 'Technician notified in real time', 'SLA countdown active'],
  },
  {
    step: '04',
    status: 'In Progress',
    actor: 'Field Maintenance Crew',
    sla: '12–48 hrs target',
    summary: 'Field crew navigates to the site, executes the physical repair, and logs field notes directly from their mobile dispatch board.',
    outputs: ['On-site status visible to citizens', 'Overdue reminder guards active', 'Crew workload updated'],
  },
  {
    step: '05',
    status: 'Resolved',
    actor: 'Crew + Citizen Rating',
    sla: 'Verified Closure',
    summary: 'Technician uploads geo-stamped completion photo proof. Citizens inspect Before & After slider, export PDF report, and rate the repair.',
    outputs: ['Before & After slider unlocked', 'CSAT rating recorded', 'Department SLA score updated'],
  },
];

const SECURITY_CARDS = [
  {
    title: '2FA Email & Trusted Devices',
    desc: '6-digit email security verification with optional 30-day trusted browser persistence for municipal staff and citizens.',
    icon: Lock,
  },
  {
    title: 'Strict 4-Role RBAC',
    desc: 'Isolated route and API guards for Citizen, Department Manager, Maintenance Staff, and City Admin personas.',
    icon: Users,
  },
  {
    title: 'Tamper-Evident Audit Trail',
    desc: 'Every status change, priority adjustment, budget allocation, and advisory broadcast is logged with actor and timestamp.',
    icon: ShieldCheck,
  },
  {
    title: 'Official PDF & CSV Exports',
    desc: 'Generate printable incident PDF dossiers and downloadable CSV ledgers for municipal review and public transparency.',
    icon: FileText,
  },
];

const COMPARISON_ROWS = [
  {
    capability: 'Issue Submission & Location',
    traditional: 'Manual phone call or paper form; vague street descriptions',
    civicpulse: 'Sub-meter GPS pin, photo upload, and instant CP tracking ID',
  },
  {
    capability: 'Duplicate Handling',
    traditional: 'Multiple tickets created for the same pothole or outage',
    civicpulse: 'Automatic 50m proximity radar merges reports via upvotes',
  },
  {
    capability: 'Progress Visibility',
    traditional: 'No status updates unless citizen calls the office again',
    civicpulse: 'Live 5-step timeline + real-time role-scoped notifications',
  },
  {
    capability: 'Repair Verification',
    traditional: 'Closed verbally with no visual evidence of completion',
    civicpulse: 'Mandatory completion photo + interactive Before & After slider',
  },
  {
    capability: 'SLA & Accountability',
    traditional: 'No automated escalation when repairs stall for weeks',
    civicpulse: '12h–72h SLA timers, breach queue, and immutable audit logs',
  },
  {
    capability: 'Budget & Vendor Oversight',
    traditional: 'Disconnected spreadsheets across departments',
    civicpulse: 'Unified ward budget ledger & contractor SLA scorecards',
  },
];

const FEATURE_FAQS = [
  {
    q: 'How does the 50-meter duplicate radar work?',
    a: 'When you select a category and pin a location on the report map, CivicPulse calculates Haversine distance against active reports within 50 meters and lets you upvote the existing ticket instead of duplicating work.',
  },
  {
    q: 'Can citizens see real-time updates without refreshing?',
    a: 'Yes. The notification bell polls real database activity every 30 seconds and links you straight to the updated issue timeline.',
  },
  {
    q: 'Are all four role portals included in one platform?',
    a: 'Yes. Citizen, Department Manager, Field Maintenance Staff, and City Admin each get a purpose-built workspace powered by the same live PostgreSQL backend.',
  },
  {
    q: 'Can reports and analytics be exported for official records?',
    a: 'Every issue detail page supports printable PDF dossier export, and Admin Budget & Audit pages support one-click CSV downloads.',
  },
];

export function FeaturesPageContent() {
  const [activePillId, setActivePillId] = useState('radar');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activePill = CAPABILITY_PILLS.find((p) => p.id === activePillId) || CAPABILITY_PILLS[0];
  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  return (
    <div className="font-sans">
      {/* 1. HERO BANNER + INTERACTIVE CAPABILITY PREVIEW */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24 min-h-[640px] flex items-center border-b border-[#D5DAE3] dark:border-[#232F46]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/about-gis-dispatch.jpg"
            alt="CivicPulse GIS infrastructure dispatch command"
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
             Platform Architecture • Built for Scale
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-[#202B45] dark:text-white tracking-tight leading-[1.08]">
              Smart City{' '}
              <span className="font-serif italic font-normal text-[#315CFF] dark:text-[#6280FF]">
                Features
              </span>{' '}
              <br />
              Built for Real Action.
            </h1>

            <p className="text-base sm:text-lg text-[#202B45]/90 dark:text-slate-200 max-w-xl leading-relaxed font-medium">
              From 50-meter geospatial duplicate detection to photo-verified repair closure and executive BI — explore every capability powering CivicPulse.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/citizen/create">
                <Button className="rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white px-7 h-11 text-sm font-semibold shadow-lg">
                  Try Live Portal
                </Button>
              </Link>
              <Link href="/citizen/map">
                <Button
                  variant="outline"
                  className="rounded-full bg-white/90 dark:bg-[#141B29]/90 border-[#D5DAE3] dark:border-[#232F46] text-[#202B45] dark:text-white px-6 h-11 text-sm font-semibold"
                >
                  Explore City Map
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Capability Switcher Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141B29] space-y-5">
              <div className="flex flex-wrap gap-2">
                {CAPABILITY_PILLS.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setActivePillId(pill.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activePillId === pill.id
                        ? 'bg-[#315CFF] text-white'
                        : 'bg-[#F0F1F5] dark:bg-[#1B2435] text-[#4B5568] dark:text-slate-300 hover:text-[#202B45] dark:hover:text-white'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[#D5DAE3] dark:border-[#232F46] space-y-2">
                <span className="text-4xl font-bold font-display text-[#315CFF] dark:text-[#6280FF]">
                  {activePill.metric}
                </span>
                <h3 className="text-lg font-bold text-[#202B45] dark:text-white">
                  {activePill.title}
                </h3>
                <p className="text-sm text-[#4B5568] dark:text-slate-300 leading-relaxed">
                  {activePill.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PLATFORM CAPABILITIES (6-CARD GRID) */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#0E1420]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                Capabilities
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              Core Platform Features
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Every module is engineered to eliminate reporting friction, speed up field dispatch, and prove municipal accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group p-6 rounded-2xl bg-[#F7F5EF] dark:bg-[#141B29] transition-colors flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-[#e2fa6b] text-[#202B45] text-[11px] font-mono font-bold">
                        {cap.tag}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-[#315CFF]/10 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-display text-[#202B45] dark:text-white">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-[#4B5568] dark:text-slate-300 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>

                  <Link
                    href={cap.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#315CFF] dark:text-[#6280FF] group-hover:gap-2.5 transition-all"
                  >
                    Explore Feature <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW A REPORT MOVES (INTERACTIVE 5-STEP WORKFLOW) */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                Workflow
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              How a Report Moves
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Select any lifecycle stage below to see who acts, what SLA applies, and how transparency is maintained.
            </p>
          </div>

          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {WORKFLOW_STEPS.map((item, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={item.status}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#202B45] dark:bg-[#315CFF] text-white border-[#202B45] dark:border-[#315CFF] shadow-md'
                      : 'bg-white dark:bg-[#141B29] text-[#202B45] dark:text-slate-200 border-[#D5DAE3] dark:border-[#232F46] hover:border-[#315CFF]'
                  }`}
                >
                  <span className="text-[11px] font-mono opacity-75 block">STEP {item.step}</span>
                  <span className="text-sm font-bold block mt-0.5">{item.status}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Detail Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141B29] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-[#e2fa6b] text-[#202B45] text-xs font-mono font-bold">
                  {activeStep.actor}
                </span>
                <span className="text-xs font-mono text-[#606B7D] dark:text-slate-400">
                  Target Window: {activeStep.sla}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#202B45] dark:text-white">
                Stage {activeStep.step}: {activeStep.status}
              </h3>
              <p className="text-sm sm:text-base text-[#4B5568] dark:text-slate-300 leading-relaxed">
                {activeStep.summary}
              </p>
            </div>

            <div className="lg:col-span-5 space-y-2.5 bg-[#F7F5EF] dark:bg-[#0B0F17] p-5 rounded-xl border border-[#D5DAE3] dark:border-[#232F46]">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#315CFF] dark:text-[#6280FF]">
                Automated System Outputs
              </p>
              {activeStep.outputs.map((out) => (
                <div key={out} className="flex items-center gap-2 text-sm text-[#202B45] dark:text-slate-200">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECURITY, GOVERNANCE & ARCHITECTURE (DARK SECTION) */}
      <section className="py-16 sm:py-20 bg-[#202B45] dark:bg-[#0E1420] text-white">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#e2fa6b]/45 bg-transparent text-[#e2fa6b] text-[16px] font-sans font-medium transition-colors">
                Security &amp; Governance
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight transition-colors">
              Enterprise-Grade Civic Trust
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Built with strict role-based access control, 2FA verification, and immutable governance logging.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECURITY_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="p-6 rounded-2xl bg-[#182238] dark:bg-[#141B29] space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#e2fa6b] text-[#202B45] flex items-center justify-center">
                    <Icon size={19} />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">{card.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TRADITIONAL 311 VS CIVICPULSE COMPARISON */}
      <section className="py-16 sm:py-20 bg-[#F7F5EF] dark:bg-[#0B0F17]">
        <div className="w-[80%] mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                Comparison
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              Traditional Hotlines vs CivicPulse
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              See how modern geospatial triage outperforms legacy phone logs and disconnected municipal spreadsheets.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#141B29] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D5DAE3] dark:border-[#232F46] bg-[#F0F1F5] dark:bg-[#1B2435] text-xs font-mono uppercase text-[#606B7D] dark:text-slate-400">
                    <th className="py-4 px-5">Capability</th>
                    <th className="py-4 px-5">Traditional 311 / Paper</th>
                    <th className="py-4 px-5 text-[#315CFF] dark:text-[#6280FF]">CivicPulse Smart Grid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D5DAE3] dark:divide-[#232F46] text-sm">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.capability} className="hover:bg-[#F7F5EF]/60 dark:hover:bg-[#1B2435]/40">
                      <td className="py-4 px-5 font-bold text-[#202B45] dark:text-white">
                        {row.capability}
                      </td>
                      <td className="py-4 px-5 text-[#606B7D] dark:text-slate-400">
                        <span className="inline-flex items-start gap-2">
                          <X size={15} className="text-rose-500 shrink-0 mt-0.5" />
                          {row.traditional}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-medium text-[#202B45] dark:text-slate-100">
                        <span className="inline-flex items-start gap-2">
                          <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          {row.civicpulse}
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

      {/* 7. FEATURE FAQS & CTA */}
      <section className="py-16 sm:py-20 bg-white dark:bg-[#0E1420] border-t border-[#D5DAE3] dark:border-[#232F46]">
        <div className="w-[80%] mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
            <div>
              <span className="inline-flex items-center justify-center px-5 h-9 rounded-full border border-[#315CFF]/35 dark:border-[#315CFF]/45 bg-transparent text-[#315CFF] dark:text-[#6280FF] text-[16px] font-sans font-medium transition-colors">
                FAQs
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-midnight dark:text-white tracking-tight transition-colors">
              Feature Questions
            </h2>
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-300 leading-relaxed font-sans font-normal transition-colors">
              Everything you need to know about duplicate radar, live alerts, and role-based access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURE_FAQS.map((item, idx) => {
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
      </section>
    </div>
  );
}
