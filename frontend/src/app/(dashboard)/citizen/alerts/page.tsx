'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGetIssuesQuery, useUpvoteIssueMutation } from '@/store/apiSlice';
import { Badge } from '@/components/ui/badge';
import { IssueProgressStepper } from '@/components/issues/issue-progress-stepper';
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  getStatusBadgeClass,
  getStatusLabel,
  formatDate,
} from '@/lib/utils';
import { BellRing, MapPin, ThumbsUp, ArrowRight, ShieldAlert } from 'lucide-react';
import { Issue } from '@/types';

const DHAKA_WARDS = [
  'All Dhaka',
  'Dhanmondi',
  'Mirpur',
  'Gulshan',
  'Banani',
  'Uttara',
  'Motijheel',
];

export default function NeighborhoodAlertsPage() {
  const [selectedWard, setSelectedWard] = useState<string>('All Dhaka');
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const { data: issuesData, isLoading } = useGetIssuesQuery({ limit: 50 });
  const [upvoteIssue] = useUpvoteIssueMutation();

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

  const handleWardSelect = (ward: string) => {
    setSelectedWard(ward);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('civicpulse_citizen_ward', ward);
      } catch {}
    }
  };

  const handleUpvote = async (issueId: string) => {
    if (upvotedIds[issueId]) return;
    const next = { ...upvotedIds, [issueId]: true };
    setUpvotedIds(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('civicpulse_upvoted_issues', JSON.stringify(next));
      } catch {}
    }
    try {
      await upvoteIssue(issueId).unwrap();
    } catch {}
  };

  const issues = issuesData?.items || [];
  const alerts = issues.filter((issue: Issue) => {
    const isActive = issue.status !== 'resolved' && issue.status !== 'closed';
    if (!isActive) return false;
    if (selectedWard === 'All Dhaka') return true;
    return (
      issue.address.toLowerCase().includes(selectedWard.toLowerCase()) ||
      issue.title.toLowerCase().includes(selectedWard.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
            Neighborhood Alerts
          </h2>
          <p className="text-sm text-[#606B7D] dark:text-slate-400">
            Live safety advisories, roadwork notices, and active hazards in your area.
          </p>
        </div>

        {/* Ward Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {DHAKA_WARDS.map((ward) => (
            <button
              key={ward}
              type="button"
              onClick={() => handleWardSelect(ward)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedWard === ward
                  ? 'bg-[#315CFF] text-white'
                  : 'bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] text-[#4B5568] dark:text-slate-300 hover:border-[#315CFF]'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="rounded-3xl bg-[#202B45] dark:bg-[#141B29] border border-[#34415B] dark:border-[#232F46] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#315CFF] text-white flex items-center justify-center shrink-0">
            <BellRing size={22} />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#e2fa6b] font-semibold">
              Active Ward Feed • {selectedWard}
            </span>
            <h3 className="text-xl font-bold font-display mt-0.5">
              {alerts.length} Active Municipal Notice{alerts.length === 1 ? '' : 's'}
            </h3>
          </div>
        </div>
        <Link href="/citizen/create">
          <button
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] text-xs font-bold transition-colors"
          >
            Report Hazard in {selectedWard}
          </button>
        </Link>
      </div>

      {/* Alerts List */}
      {isLoading ? (
        <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-12 text-center text-xs font-mono text-[#606B7D]">
          Loading neighborhood advisories...
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-dashed border-[#AAB2BF] dark:border-[#364766] p-12 text-center space-y-2">
          <ShieldAlert size={28} className="mx-auto text-[#315CFF] dark:text-[#6280FF]" />
          <h4 className="text-base font-bold text-[#202B45] dark:text-white">
            All Clear in {selectedWard}
          </h4>
          <p className="text-xs text-[#606B7D] dark:text-slate-400">
            No active infrastructure hazards or repair disruptions reported for this ward.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {alerts.map((issue: Issue) => {
            const isUpvoted = Boolean(upvotedIds[issue.id]);
            return (
              <div
                key={issue.id}
                className="rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-5 flex flex-col justify-between hover:border-[#315CFF] dark:hover:border-[#6280FF] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#315CFF]/10 text-[#315CFF] dark:text-[#91A5FF]">
                        {issue.trackingCode}
                      </span>
                      <Badge className={getPriorityBadgeClass(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>
                    </div>
                    <Badge className={getStatusBadgeClass(issue.status)}>
                      {getStatusLabel(issue.status)}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-base text-[#202B45] dark:text-white">
                    <Link href={`/citizen/issues/${issue.id}`} className="hover:text-[#315CFF]">
                      {issue.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-[#606B7D] dark:text-slate-400 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs text-[#606B7D] dark:text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={12} className="text-[#315CFF] shrink-0" />
                      {issue.address}
                    </span>
                    <span className="font-mono text-[11px] shrink-0">
                      {formatDate(issue.createdAt)}
                    </span>
                  </div>
                </div>

                <IssueProgressStepper
                  status={issue.status}
                  priority={issue.priority}
                  createdAt={issue.createdAt}
                />

                <div className="pt-3 mt-3 border-t border-[#E2E5ED] dark:border-[#232F46] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleUpvote(issue.id)}
                    disabled={isUpvoted}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      isUpvoted
                        ? 'bg-[#e2fa6b] text-[#202B45]'
                        : 'bg-[#F0F1F5] dark:bg-[#1B2435] text-[#4B5568] dark:text-slate-300 hover:bg-[#315CFF] hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={12} />
                    <span>{isUpvoted ? 'Confirmed (+1)' : 'I See This Too'}</span>
                  </button>

                  <Link
                    href={`/citizen/issues/${issue.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#315CFF] dark:text-[#6280FF] hover:underline"
                  >
                    View Timeline <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
