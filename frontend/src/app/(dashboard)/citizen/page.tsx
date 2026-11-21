'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/analytics/stat-card';
import { IssueMap } from '@/components/map/issue-map';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
  formatDate,
} from '@/lib/utils';
import { PlusCircle, FileText, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Issue } from '@/types';

export default function CitizenDashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: issuesData, isLoading } = useGetIssuesQuery({ limit: 10 });

  const issues = issuesData?.items || [];
  const userIssues = issues;
  const activeCount = userIssues.filter((i: Issue) => i.status !== 'resolved' && i.status !== 'closed').length;
  const resolvedCount = userIssues.filter((i: Issue) => i.status === 'resolved' || i.status === 'closed').length;

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Citizen Action Hub
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            Welcome back, {user?.name || 'Citizen'}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Spot road damage, faulty streetlights, or drainage overflow? Report it in seconds to notify your municipal department.
          </p>
        </div>
        <Link href="/citizen/create" className="shrink-0">
          <Button variant="accent" size="lg" className="gap-2 font-bold shadow-md">
            <PlusCircle size={18} />
            Report New Issue
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Municipal Issues"
          value={activeCount}
          change="+3 this week"
          isPositive={false}
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Resolved Repairs"
          value={resolvedCount}
          change="92% SLA"
          isPositive={true}
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          label="Average City Response"
          value="18.5 hrs"
          timeframe="across all sectors"
          icon={<FileText size={20} />}
        />
      </div>

      {/* Grid: Recent Reports & Live Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Reports List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-text-primary">
              Recent Infrastructure Reports
            </h3>
            <Link href="/citizen/reports">
              <Button variant="ghost" size="sm" className="text-xs text-brand-cobalt gap-1 font-semibold">
                View All <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <p className="text-xs font-mono text-text-muted py-8 text-center">Loading reports...</p>
            ) : userIssues.length === 0 ? (
              <Card className="p-8 text-center text-text-muted">
                No reports submitted yet. Spot an infrastructure problem? Click "Report New Issue"!
              </Card>
            ) : (
              userIssues.slice(0, 4).map((issue: Issue) => (
                <Card
                  key={issue.id}
                  className="p-4 transition-all hover:border-brand-cobalt hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-brand-cobalt">
                          {issue.trackingCode}
                        </span>
                        <Badge className={getCategoryBadgeClass(issue.category)}>
                          {getCategoryLabel(issue.category)}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-text-primary hover:text-brand-cobalt line-clamp-1">
                        <Link href={`/citizen/issues/${issue.id}`}>{issue.title}</Link>
                      </h4>
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin size={12} /> {issue.address}
                      </p>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <Badge className={getStatusBadgeClass(issue.status)}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                      <p className="text-[10px] text-text-muted font-mono">
                        {formatDate(issue.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Map Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-text-primary">
              City Incident Radar
            </h3>
            <span className="text-xs font-mono text-text-muted">Live Geo-Pins</span>
          </div>

          <Card className="p-2 h-[380px] overflow-hidden">
            <IssueMap issues={issues.slice(0, 20)} zoom={12} />
          </Card>
        </div>
      </div>
    </div>
  );
}
