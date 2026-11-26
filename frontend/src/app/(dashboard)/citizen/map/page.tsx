'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { IssueMap } from '@/components/map/issue-map';
import { PlusCircle, MapPin, Layers } from 'lucide-react';
import { Issue, IssueCategory } from '@/types';

const CATEGORIES: { value: 'all' | IssueCategory; label: string }[] = [
  { value: 'all', label: 'All Sectors' },
  { value: 'road_damage', label: 'Road Damage' },
  { value: 'streetlight', label: 'Streetlights' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'footpath', label: 'Footpath' },
  { value: 'waste_management', label: 'Waste' },
  { value: 'public_infrastructure', label: 'Public Infra' },
];

export default function CitizenCityMapPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | IssueCategory>('all');
  const [onlyActive, setOnlyActive] = useState<boolean>(true);
  const { data: issuesData, isLoading } = useGetIssuesQuery({ limit: 100 });

  const allIssues = issuesData?.items || [];
  const filteredIssues = allIssues.filter((issue: Issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (onlyActive && (issue.status === 'resolved' || issue.status === 'closed')) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
            Live City Incident Map
          </h2>
          <p className="text-base text-[#606B7D] dark:text-slate-400">
            Explore real-time municipal infrastructure issues pinned across Dhaka wards.
          </p>
        </div>

        <Link href="/citizen/create">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-full bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] text-sm font-bold shadow-sm transition-colors"
          >
            <PlusCircle size={16} />
            <span>Pin New Issue</span>
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-[#315CFF] text-white'
                  : 'bg-[#F0F1F5] dark:bg-[#1B2435] text-[#4B5568] dark:text-slate-300 hover:bg-[#E2E5ED] dark:hover:bg-[#232F46]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setOnlyActive(!onlyActive)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              onlyActive
                ? 'bg-[#e2fa6b] border-[#e2fa6b] text-[#202B45]'
                : 'bg-transparent border-[#D5DAE3] dark:border-[#232F46] text-[#606B7D] dark:text-slate-400'
            }`}
          >
            <Layers size={13} />
            <span>{onlyActive ? 'Active Only' : 'All Statuses'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#315CFF] dark:text-[#6280FF]">
            <MapPin size={14} />
            {isLoading ? '...' : `${filteredIssues.length} pins`}
          </span>
        </div>
      </div>

      {/* Full Interactive Map */}
      <div className="rounded-3xl bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] p-3 h-[560px] overflow-hidden shadow-sm">
        <IssueMap issues={filteredIssues} zoom={12} />
      </div>
    </div>
  );
}
