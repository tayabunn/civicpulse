'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetIssuesQuery, useUpvoteIssueMutation } from '@/store/apiSlice';
import { Badge } from '@/components/ui/badge';
import { IssueMap } from '@/components/map/issue-map';
import { IssueProgressStepper } from '@/components/issues/issue-progress-stepper';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
  formatDate,
} from '@/lib/utils';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Check,
  Inbox,
  Lightbulb,
  AlertTriangle,
  Droplets,
  Construction,
  ThumbsUp,
  Award,
  BellRing,
} from 'lucide-react';
import { Issue } from '@/types';

const QUICK_TEMPLATES = [
  {
    label: 'Broken Streetlight',
    category: 'streetlight',
    priority: 'high',
    title: 'Faulty or unlit streetlight pole',
    icon: Lightbulb,
  },
  {
    label: 'Open Manhole',
    category: 'drainage',
    priority: 'critical',
    title: 'Uncovered or broken manhole hazard',
    icon: AlertTriangle,
  },
  {
    label: 'Road Pothole',
    category: 'road_damage',
    priority: 'high',
    title: 'Deep pothole causing traffic hazard',
    icon: Construction,
  },
  {
    label: 'Waterlogging',
    category: 'drainage',
    priority: 'high',
    title: 'Blocked drain & street waterlogging',
    icon: Droplets,
  },
];

const DHAKA_WARDS = [
  'All Dhaka',
  'Dhanmondi',
  'Mirpur',
  'Gulshan',
  'Banani',
  'Uttara',
  'Motijheel',
];

export default function CitizenDashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: issuesData, isLoading } = useGetIssuesQuery({ limit: 15 });
  const [upvoteIssue] = useUpvoteIssueMutation();

  const [selectedWard, setSelectedWard] = useState<string>('All Dhaka');
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});

  // Load saved ward preference & local upvote state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedWard = localStorage.getItem('civicpulse_citizen_ward');
      if (savedWard && DHAKA_WARDS.includes(savedWard)) {
        setSelectedWard(savedWard);
      }
      const savedUpvotes = localStorage.getItem('civicpulse_upvoted_issues');
      if (savedUpvotes) {
        setUpvotedIds(JSON.parse(savedUpvotes));
      }
    } catch {}
  }, []);

  const handleWardChange = (ward: string) => {
    setSelectedWard(ward);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('civicpulse_citizen_ward', ward);
      } catch {}
    }
  };

  const handleUpvote = async (issueId: string) => {
    if (upvotedIds[issueId]) return;
    const nextUpvoted = { ...upvotedIds, [issueId]: true };
    setUpvotedIds(nextUpvoted);
    setUpvoteCounts((prev) => ({ ...prev, [issueId]: (prev[issueId] || 0) + 1 }));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('civicpulse_upvoted_issues', JSON.stringify(nextUpvoted));
      } catch {}
    }
    try {
      const res = await upvoteIssue(issueId).unwrap();
      if (typeof res?.upvotes === 'number') {
        setUpvoteCounts((prev) => ({ ...prev, [issueId]: res.upvotes! }));
      }
    } catch {}
  };

  const issues = issuesData?.items || [];
  const userIssues = issues;
  const activeCount = userIssues.filter((i: Issue) => i.status !== 'resolved' && i.status !== 'closed').length;
  const resolvedCount = userIssues.filter((i: Issue) => i.status === 'resolved' || i.status === 'closed').length;

  // Neighborhood Alert filtering
  const wardAlerts = issues.filter((i: Issue) => {
    const isActive = i.status !== 'resolved' && i.status !== 'closed';
    if (!isActive) return false;
    if (selectedWard === 'All Dhaka') return i.priority === 'critical' || i.priority === 'high';
    return (
      i.address.toLowerCase().includes(selectedWard.toLowerCase()) ||
      i.title.toLowerCase().includes(selectedWard.toLowerCase())
    );
  });

  // Civic Impact & Guardian Tier calculation
  const totalConfirmations = Object.keys(upvotedIds).length;
  const impactScore = userIssues.length * 15 + resolvedCount * 25 + totalConfirmations * 5;
  const guardianTier =
    impactScore >= 150
      ? 'Civic Hero'
      : impactScore >= 75
      ? 'Neighborhood Guardian'
      : impactScore >= 20
      ? 'Active Watcher'
      : 'New Reporter';
  const nextMilestone = impactScore >= 150 ? 200 : impactScore >= 75 ? 150 : impactScore >= 20 ? 75 : 20;
  const tierProgress = Math.min(100, Math.round((impactScore / nextMilestone) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Neighborhood Safety Advisory Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center shrink-0">
            <BellRing size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#315CFF] dark:text-[#6280FF]">
                Neighborhood Alert
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2fa6b]" />
            </div>
            <p className="text-xs text-[#202B45] dark:text-slate-200 truncate">
              {wardAlerts.length > 0
                ? `${wardAlerts.length} active alert${wardAlerts.length > 1 ? 's' : ''} in ${selectedWard}: ${wardAlerts[0].title} (${wardAlerts[0].address})`
                : `No urgent municipal hazards reported in ${selectedWard} right now.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-[#606B7D] dark:text-slate-400">Ward:</span>
          <select
            value={selectedWard}
            onChange={(e) => handleWardChange(e.target.value)}
            aria-label="Select neighborhood ward"
            className="px-3 py-1.5 rounded-lg bg-[#F7F5EF] dark:bg-[#1B2435] border border-[#D5DAE3] dark:border-[#232F46] text-xs font-semibold text-[#202B45] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#315CFF]"
          >
            {DHAKA_WARDS.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Welcome & Quick Action Hero — Solid Colors, Homepage Editorial Aesthetic */}
      <div className="rounded-3xl bg-[#202B45] dark:bg-[#141B29] border border-[#34415B] dark:border-[#232F46] p-6 sm:p-8 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            {/* Homepage-style Pill Eyebrow with Soft Green Live Dot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#315CFF]/20 border border-[#315CFF]/50 text-[#91A5FF] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#e2fa6b]" />
              <span>Citizen Action Hub</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight">
              Welcome back,{' '}
              <span className="font-serif italic font-normal text-[#e2fa6b]">
                {user?.name || 'Citizen'}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Spot road damage, faulty streetlights, or drainage overflow? Report it in seconds to notify your municipal department and track live progress.
            </p>

            {/* Homepage AboutSection-style Checkmarks */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
              {[
                'GPS-Pinned Dispatch',
                'Real-Time Status Tracking',
                'Direct Municipal Triage',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-[#315CFF] text-white flex items-center justify-center shrink-0">
                    <Check size={10} className="stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solid Rounded-Full Action Pills */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link href="/citizen/reports">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 h-12 rounded-full border border-[#3C4962] dark:border-[#2B3852] bg-[#2B3852] dark:bg-[#1B2435] hover:border-[#6280FF] text-white text-sm font-semibold transition-colors"
              >
                <Inbox size={16} className="text-[#91A5FF]" />
                <span>My Reports</span>
              </button>
            </Link>
            <Link href="/citizen/create">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] text-sm font-bold shadow-sm transition-colors"
              >
                <PlusCircle size={18} />
                <span>Report New Issue</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 3. 1-Click Quick Emergency & Hazard Templates */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-3">
            1-Click Quick Report Templates
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              const href = `/citizen/create?category=${encodeURIComponent(
                tpl.category
              )}&priority=${encodeURIComponent(tpl.priority)}&title=${encodeURIComponent(
                tpl.title
              )}`;
              return (
                <Link
                  key={tpl.label}
                  href={href}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#2B3852] dark:bg-[#1B2435] border border-[#3C4962] dark:border-[#2B3852] hover:border-[#e2fa6b] text-xs font-semibold text-white transition-colors group"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#315CFF] text-white flex items-center justify-center shrink-0 group-hover:bg-[#e2fa6b] group-hover:text-[#202B45] transition-colors">
                    <Icon size={14} />
                  </span>
                  <span className="truncate">{tpl.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. KPI Metrics Strip + Civic Impact Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1: Active Issues */}
        <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-6 transition-colors hover:border-[#315CFF] dark:hover:border-[#6280FF]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#315CFF]/30 dark:border-[#6280FF]/35 text-[#315CFF] dark:text-[#6280FF] text-xs font-semibold">
              Active Issues
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center">
              <Clock size={19} />
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-2">
            <h3 className="text-5xl font-normal font-serif text-[#202B45] dark:text-white tracking-tight tabular-nums leading-none">
              {activeCount}
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#91A5FF] text-xs font-semibold">
              <ArrowUpRight size={13} /> {activeCount > 0 ? `${activeCount} in queue` : 'No active issues'}
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-[#606B7D] dark:text-slate-400">
            Active municipal issues currently in queue
          </p>
        </div>

        {/* Card 2: Resolved Repairs */}
        <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-6 transition-colors hover:border-[#315CFF] dark:hover:border-[#6280FF]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#315CFF]/30 dark:border-[#6280FF]/35 text-[#315CFF] dark:text-[#6280FF] text-xs font-semibold">
              Resolved Repairs
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#e2fa6b] text-[#202B45] flex items-center justify-center">
              <CheckCircle2 size={19} />
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-2">
            <h3 className="text-5xl font-normal font-serif text-[#202B45] dark:text-white tracking-tight tabular-nums leading-none">
              {resolvedCount}
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e2fa6b] text-[#202B45] text-xs font-bold">
              {resolvedCount > 0 ? 'Verified' : '0 completed'}
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-[#606B7D] dark:text-slate-400">
            Completed repairs verified across wards
          </p>
        </div>

        {/* Card 3: Average City Response */}
        <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-6 transition-colors hover:border-[#315CFF] dark:hover:border-[#6280FF]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-[#315CFF]/30 dark:border-[#6280FF]/35 text-[#315CFF] dark:text-[#6280FF] text-xs font-semibold">
              City Response
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center">
              <FileText size={19} />
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-2">
            <h3 className="text-5xl font-normal font-serif text-[#315CFF] dark:text-[#6280FF] tracking-tight tabular-nums leading-none">
              18.5 hrs
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F1F5] dark:bg-[#1B2435] text-[#4B5568] dark:text-slate-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2fa6b]" />
              All sectors
            </span>
          </div>
          <p className="mt-3 text-xs font-medium text-[#606B7D] dark:text-slate-400">
            Average dispatch turnaround time
          </p>
        </div>

        {/* Card 4: Civic Impact & Guardian Badge */}
        <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-6 transition-colors hover:border-[#315CFF] dark:hover:border-[#6280FF] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e2fa6b] text-[#202B45] text-xs font-bold">
              {guardianTier}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#315CFF] text-white flex items-center justify-center">
              <Award size={19} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-4xl font-normal font-serif text-[#202B45] dark:text-white tracking-tight tabular-nums leading-none">
                {impactScore} <span className="text-sm font-sans font-semibold text-[#606B7D] dark:text-slate-400">pts</span>
              </h3>
              <span className="text-[11px] font-mono text-[#315CFF] dark:text-[#6280FF] font-semibold">
                {tierProgress}% to next
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#F0F1F5] dark:bg-[#1B2435] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#315CFF] transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-[#606B7D] dark:text-slate-400">
            {resolvedCount} hazards resolved • {totalConfirmations} neighbor confirms
          </p>
        </div>
      </div>

      {/* 5. Main 2-Column Editorial Grid: Recent Reports (with Stepper & Upvote) + Live Incident Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Reports List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              Recent Infrastructure Reports
            </h3>
            <Link href="/citizen/reports">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#315CFF]/35 dark:border-[#6280FF]/40 text-xs font-semibold text-[#315CFF] dark:text-[#6280FF] hover:bg-[#315CFF] hover:text-white dark:hover:bg-[#315CFF] dark:hover:text-white transition-colors"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-10 text-center">
                <p className="text-xs font-mono text-[#606B7D] dark:text-slate-400">
                  Loading reports...
                </p>
              </div>
            ) : userIssues.length === 0 ? (
              <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-dashed border-[#AAB2BF] dark:border-[#364766] p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#6280FF] flex items-center justify-center mx-auto">
                  <FileText size={22} />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h4 className="text-base font-bold font-display text-[#202B45] dark:text-white">
                    No reports submitted yet
                  </h4>
                  <p className="text-xs text-[#606B7D] dark:text-slate-400 leading-relaxed">
                    Spot an infrastructure problem in your neighborhood? Use a Quick Template above or submit a new report.
                  </p>
                </div>
                <div>
                  <Link href="/citizen/create">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#315CFF] hover:bg-[#244BE0] text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      <PlusCircle size={15} />
                      <span>Report New Issue</span>
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              userIssues.slice(0, 4).map((issue: Issue) => {
                const isUpvoted = Boolean(upvotedIds[issue.id]);
                const extraCount = upvoteCounts[issue.id] || 0;
                return (
                  <div
                    key={issue.id}
                    className="rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-5 transition-all hover:border-[#315CFF] dark:hover:border-[#6280FF] hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#315CFF]/10 dark:bg-[#315CFF]/20 text-[#315CFF] dark:text-[#91A5FF]">
                            {issue.trackingCode}
                          </span>
                          <Badge className={getCategoryBadgeClass(issue.category)}>
                            {getCategoryLabel(issue.category)}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-[#202B45] dark:text-white hover:text-[#315CFF] dark:hover:text-[#6280FF] transition-colors line-clamp-1">
                          <Link href={`/citizen/issues/${issue.id}`}>{issue.title}</Link>
                        </h4>
                        <p className="text-xs text-[#606B7D] dark:text-slate-400 flex items-center gap-1.5">
                          <MapPin size={12} className="text-[#315CFF] dark:text-[#6280FF] shrink-0" />
                          <span className="truncate">{issue.address}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0 space-y-2 flex flex-col items-end">
                        <Badge className={getStatusBadgeClass(issue.status)}>
                          {getStatusLabel(issue.status)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpvote(issue.id)}
                            disabled={isUpvoted}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                              isUpvoted
                                ? 'bg-[#e2fa6b] text-[#202B45] cursor-default'
                                : 'bg-[#F0F1F5] dark:bg-[#1B2435] text-[#4B5568] dark:text-slate-300 hover:bg-[#315CFF] hover:text-white'
                            }`}
                            title="Confirm you also see this issue nearby"
                          >
                            <ThumbsUp size={11} />
                            <span>{isUpvoted ? 'Confirmed' : 'Confirm'}</span>
                            {(extraCount > 0 || isUpvoted) && (
                              <span className="font-mono">({Math.max(1, extraCount)})</span>
                            )}
                          </button>
                          <span className="text-[11px] text-[#606B7D] dark:text-slate-400 font-mono">
                            {formatDate(issue.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4-Step Live Progress Bar & SLA Countdown */}
                    <IssueProgressStepper
                      status={issue.status}
                      priority={issue.priority}
                      createdAt={issue.createdAt}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Live Map Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
              City Incident Radar
            </h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2fa6b] text-[#202B45] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#202B45]" />
              Live Geo-Pins
            </span>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-2.5 h-[420px] overflow-hidden shadow-sm">
            <IssueMap issues={issues.slice(0, 20)} zoom={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
