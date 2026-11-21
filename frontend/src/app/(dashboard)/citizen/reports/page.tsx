'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  formatDate,
} from '@/lib/utils';
import { PlusCircle, MapPin, ArrowRight } from 'lucide-react';
import { Issue } from '@/types';

export default function CitizenReportsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const { data: issuesData, isLoading } = useGetIssuesQuery({ limit: 50 });

  const allIssues = issuesData?.items || [];

  const filtered = allIssues.filter((issue: Issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      issue.address.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'active') {
      return issue.status !== 'resolved' && issue.status !== 'closed';
    }
    if (activeTab === 'resolved') {
      return issue.status === 'resolved' || issue.status === 'closed';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            My Incident Reports
          </h2>
          <p className="text-sm text-text-muted">
            Track and monitor resolution progress for issues you submitted to the city.
          </p>
        </div>
        <Link href="/citizen/create">
          <Button variant="accent" className="gap-2 font-bold shadow-sm">
            <PlusCircle size={16} /> Report Another Issue
          </Button>
        </Link>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'active', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search code, title, address..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full py-12 text-center text-xs font-mono text-text-muted">
            Loading your reports...
          </p>
        ) : filtered.length === 0 ? (
          <Card className="col-span-full p-12 text-center text-text-muted">
            No incident reports found matching your criteria.
          </Card>
        ) : (
          filtered.map((issue: Issue) => (
            <Card
              key={issue.id}
              className="flex flex-col justify-between p-5 transition-all hover:border-brand-cobalt hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-cobalt">
                    {issue.trackingCode}
                  </span>
                  <Badge className={getPriorityBadgeClass(issue.priority)}>
                    {getPriorityLabel(issue.priority)}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-bold text-base text-text-primary line-clamp-1">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-text-muted line-clamp-2 mt-1">{issue.description}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin size={13} className="shrink-0 text-brand-cobalt" />
                  <span className="truncate">{issue.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                <Badge className={getStatusBadgeClass(issue.status)}>
                  {getStatusLabel(issue.status)}
                </Badge>

                <Link href={`/citizen/issues/${issue.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 text-brand-cobalt">
                    Timeline <ArrowRight size={12} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
