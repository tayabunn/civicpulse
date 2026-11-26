'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterToolbar } from '@/components/table/filter-toolbar';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
  formatDate,
} from '@/lib/utils';
import { PlusCircle, MapPin, ArrowRight, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { IssueFilters } from '@/types';

export default function CitizenReportsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [filters, setFilters] = useState<IssueFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Calculate status parameter based on tab + filter toolbar
  let effectiveStatus = filters.status;
  if (!effectiveStatus) {
    if (activeTab === 'resolved') effectiveStatus = 'resolved';
  }

  const queryParams: IssueFilters = {
    ...filters,
    status: effectiveStatus,
  };

  const { data: issuesData, isLoading } = useGetIssuesQuery(queryParams);

  const handleFilterChange = (newFilters: Partial<IssueFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setActiveTab('all');
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const issues = (issuesData?.items || []).filter((issue) => {
    if (activeTab === 'active') {
      return issue.status !== 'resolved' && issue.status !== 'closed';
    }
    return true;
  });

  const totalPages = issuesData?.totalPages || 1;
  const currentPage = issuesData?.page || 1;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#202B45] dark:text-white tracking-tight">
            My Incident Reports
          </h2>
          <p className="text-base text-[#606B7D] dark:text-slate-400">
            Track and monitor resolution progress for public infrastructure issues reported to the city.
          </p>
        </div>
        <Link href="/citizen/create">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-full bg-[#e2fa6b] hover:bg-[#d5f055] text-[#202B45] text-sm font-bold shadow-sm transition-colors"
          >
            <PlusCircle size={16} /> Report Another Issue
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#141B29] border border-[#D5DAE3] dark:border-[#232F46] w-fit">
        {(['all', 'active', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              activeTab === tab
                ? 'bg-[#315CFF] text-white shadow-sm'
                : 'text-[#4B5568] dark:text-slate-300 hover:bg-[#F0F1F5] dark:hover:bg-[#1B2435]'
            }`}
          >
            {tab === 'all' ? 'All Reports' : tab === 'active' ? 'Active Issues' : 'Resolved'}
          </button>
        ))}
      </div>

      {/* Filter Toolbar with debounced search, date bounds, priority, sort */}
      <FilterToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isLoading={isLoading}
        totalResults={issuesData?.total}
      />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={`card-skel-${idx}`} className="p-5 space-y-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="h-4 w-24 bg-surface-secondary rounded" />
                <div className="h-5 w-16 bg-surface-secondary rounded-full" />
              </div>
              <div className="h-5 w-44 bg-surface-secondary rounded" />
              <div className="h-3 w-56 bg-surface-secondary/70 rounded" />
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <div className="h-4 w-20 bg-surface-secondary rounded" />
                <div className="h-7 w-20 bg-surface-secondary rounded" />
              </div>
            </Card>
          ))
        ) : issues.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-[#141B29] border border-dashed border-[#AAB2BF] dark:border-[#364766]">
            <div className="w-12 h-12 rounded-2xl bg-[#315CFF]/10 dark:bg-[#315CFF]/20 border border-[#315CFF]/25 flex items-center justify-center text-[#315CFF] dark:text-[#6280FF] mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#202B45] dark:text-white mb-1">No Incident Reports Found</h4>
            <p className="text-xs text-[#606B7D] dark:text-slate-400 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any incident reports matching your selected criteria and filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs rounded-full px-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          issues.map((issue) => (
            <Card
              key={issue.id}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-[#141B29] border-[#D5DAE3] dark:border-[#232F46] hover:shadow-sm transition-all hover:border-[#315CFF] dark:hover:border-[#6280FF] group overflow-hidden p-0"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#315CFF] dark:text-[#91A5FF] bg-[#315CFF]/10 dark:bg-[#315CFF]/20 px-2.5 py-0.5 rounded-full">
                    {issue.trackingCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={getPriorityBadgeClass(issue.priority)}>
                      {getPriorityLabel(issue.priority)}
                    </Badge>
                    <Badge className={getStatusBadgeClass(issue.status)}>
                      {getStatusLabel(issue.status)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#202B45] dark:text-white group-hover:text-[#315CFF] dark:hover:text-[#6280FF] transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-[#606B7D] dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-[#606B7D] dark:text-slate-400">
                  <MapPin size={14} className="shrink-0 text-[#315CFF] dark:text-[#6280FF]" />
                  <span className="truncate">{issue.address}</span>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-[#F7F5EF] dark:bg-[#1B2435] border-t border-[#D5DAE3] dark:border-[#232F46] flex items-center justify-between text-sm">
                <span className="font-mono text-xs text-[#606B7D] dark:text-slate-400">{formatDate(issue.createdAt)}</span>
                <Link
                  href={`/citizen/issues/${issue.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#315CFF] dark:text-[#6280FF] hover:underline"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border text-xs text-text-muted">
          <span>
            Page <strong className="text-text-primary">{currentPage}</strong> of{' '}
            <strong className="text-text-primary">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setFilters((prev) => ({ ...prev, page: currentPage - 1 }))}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft size={13} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setFilters((prev) => ({ ...prev, page: currentPage + 1 }))}
              className="h-8 text-xs gap-1"
            >
              Next <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
