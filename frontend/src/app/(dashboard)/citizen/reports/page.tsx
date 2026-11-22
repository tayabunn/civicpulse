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
        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            My Incident Reports
          </h2>
          <p className="text-sm text-text-muted">
            Track and monitor resolution progress for public infrastructure issues reported to the city.
          </p>
        </div>
        <Link href="/citizen/create">
          <Button variant="accent" className="gap-2 font-bold shadow-sm">
            <PlusCircle size={16} /> Report Another Issue
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border w-fit">
        {(['all', 'active', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-brand-midnight text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface-secondary'
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
          <div className="col-span-full p-12 text-center rounded-xl bg-surface border border-border">
            <div className="w-12 h-12 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-text-muted mx-auto mb-3">
              <SearchX className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mb-1">No Incident Reports Found</h4>
            <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
              We couldn&apos;t find any incident reports matching your selected criteria and filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
              Clear Filters
            </Button>
          </div>
        ) : (
          issues.map((issue) => (
            <Card
              key={issue.id}
              className="flex flex-col justify-between hover:shadow-md transition-all hover:border-brand-cobalt/40 group overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand-cobalt bg-brand-cobalt/10 px-2 py-0.5 rounded">
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
                  <h3 className="font-bold text-base text-text-primary group-hover:text-brand-cobalt transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin size={13} className="shrink-0 text-brand-cobalt" />
                  <span className="truncate">{issue.address}</span>
                </div>
              </div>

              <div className="px-5 py-3 bg-surface-secondary/50 border-t border-border flex items-center justify-between text-xs">
                <span className="font-mono text-text-muted">{formatDate(issue.createdAt)}</span>
                <Link
                  href={`/citizen/issues/${issue.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-brand-cobalt hover:underline"
                >
                  View Details <ArrowRight size={13} />
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
