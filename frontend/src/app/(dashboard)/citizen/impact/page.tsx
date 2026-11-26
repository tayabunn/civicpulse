'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { Award, CheckCircle2, ShieldCheck, Star, Zap, ArrowRight } from 'lucide-react';
import { Issue } from '@/types';

export default function CivicImpactPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: issuesData } = useGetIssuesQuery({ limit: 50 });
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('civicpulse_upvoted_issues');
      if (saved) {
        setConfirmations(Object.keys(JSON.parse(saved)).length);
      }
    } catch {}
  }, []);

  const issues = issuesData?.items || [];
  const resolvedIssues = issues.filter(
    (i: Issue) => i.status === 'resolved' || i.status === 'closed'
  );

  const impactScore = issues.length * 15 + resolvedIssues.length * 25 + confirmations * 5;
  const guardianTier =
    impactScore >= 150
      ? 'Civic Hero'
      : impactScore >= 75
      ? 'Neighborhood Guardian'
      : impactScore >= 20
      ? 'Active Watcher'
      : 'New Reporter';

  const badges = [
    {
      name: 'First Signal',
      desc: 'Submitted your first municipal infrastructure report.',
      unlocked: issues.length >= 1,
      icon: Zap,
      points: '15 pts',
    },
    {
      name: 'Active Watcher',
      desc: 'Reached 20+ Civic Impact points helping the city.',
      unlocked: impactScore >= 20,
      icon: Star,
      points: '20 pts',
    },
    {
      name: 'Neighborhood Guardian',
      desc: 'Reached 75+ points with verified community repairs.',
      unlocked: impactScore >= 75,
      icon: ShieldCheck,
      points: '75 pts',
    },
    {
      name: 'Civic Hero',
      desc: 'Top-tier contributor with 150+ Civic Impact points.',
      unlocked: impactScore >= 150,
      icon: Award,
      points: '150 pts',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#202B45] dark:bg-[#141B29] border border-[#34415B] dark:border-[#232F46] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e2fa6b] text-[#202B45] text-xs font-bold">
            <Award size={14} /> {guardianTier}
          </span>
          <h2 className="text-3xl font-bold font-display">
            Civic Impact &amp;{' '}
            <span className="font-serif italic font-normal text-[#e2fa6b]">Recognition</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Every report and neighborhood confirmation helps Dhaka crews prioritize critical infrastructure repairs faster.
          </p>
        </div>

        <div className="rounded-2xl bg-[#2B3852] dark:bg-[#1B2435] border border-[#3C4962] dark:border-[#232F46] px-6 py-4 text-center shrink-0">
          <p className="text-[11px] font-mono uppercase text-slate-300">Total Impact Score</p>
          <p className="text-5xl font-serif font-normal text-[#e2fa6b] mt-1 tabular-nums">
            {impactScore}
          </p>
          <p className="text-[11px] text-slate-300 mt-1">{user?.name || 'Citizen'}</p>
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-display text-[#202B45] dark:text-white">
          Milestone Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.name}
                className={`rounded-2xl p-5 border transition-colors ${
                  b.unlocked
                    ? 'bg-white dark:bg-[#141B29] border-[#315CFF] dark:border-[#6280FF]'
                    : 'bg-[#F0F1F5] dark:bg-[#0E1420] border-[#D5DAE3] dark:border-[#232F46] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      b.unlocked
                        ? 'bg-[#315CFF] text-white'
                        : 'bg-[#D5DAE3] dark:bg-[#1B2435] text-[#606B7D]'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      b.unlocked
                        ? 'bg-[#e2fa6b] text-[#202B45]'
                        : 'bg-[#D5DAE3] dark:bg-[#1B2435] text-[#606B7D]'
                    }`}
                  >
                    {b.unlocked ? 'Unlocked' : b.points}
                  </span>
                </div>
                <h4 className="font-bold text-base text-[#202B45] dark:text-white mt-4">
                  {b.name}
                </h4>
                <p className="text-sm text-[#606B7D] dark:text-slate-400 mt-1.5 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolved Hazards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-display text-[#202B45] dark:text-white">
            Verified City Repairs ({resolvedIssues.length})
          </h3>
          <Link
            href="/citizen/reports"
            className="text-xs font-semibold text-[#315CFF] dark:text-[#6280FF] inline-flex items-center gap-1 hover:underline"
          >
            All Reports <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resolvedIssues.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-8 text-center text-xs text-[#606B7D] dark:text-slate-400">
              Resolved reports will appear here as city crews complete repairs.
            </div>
          ) : (
            resolvedIssues.slice(0, 6).map((issue: Issue) => (
              <Link
                key={issue.id}
                href={`/citizen/issues/${issue.id}`}
                className="rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-4 flex items-center justify-between gap-3 hover:border-[#315CFF] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#e2fa6b] text-[#202B45] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#202B45] dark:text-white truncate">
                      {issue.title}
                    </p>
                    <p className="text-xs text-[#606B7D] dark:text-slate-400 truncate">
                      {issue.address}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#315CFF] dark:text-[#6280FF] shrink-0">
                  +25 pts
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
