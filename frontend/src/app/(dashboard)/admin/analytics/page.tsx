'use client';

import React, { useState } from 'react';
import {
  useGetAnalyticsQuery,
  useGetDepartmentsQuery,
} from '@/store/apiSlice';
import { StatCard } from '@/components/analytics/stat-card';
import { TrendChart } from '@/components/analytics/trend-chart';
import { CategoryChart } from '@/components/analytics/category-chart';
import { SLAScorecard } from '@/components/analytics/sla-scorecard';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Filter,
  BarChart2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading, isError, refetch } = useGetAnalyticsQuery();
  const { data: departments } = useGetDepartmentsQuery();

  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '6m' | '1y'>('6m');
  const [selectedSeries, setSelectedSeries] = useState<'all' | 'submitted' | 'resolved'>('all');

  // Multi-timeframe trend sets
  const trendDatasets: Record<string, { month: string; submitted: number; resolved: number }[]> = {
    '30d': [
      { month: 'Week 1', submitted: 22, resolved: 20 },
      { month: 'Week 2', submitted: 28, resolved: 25 },
      { month: 'Week 3', submitted: 31, resolved: 29 },
      { month: 'Week 4', submitted: 27, resolved: 25 },
    ],
    '90d': [
      { month: 'Sep', submitted: 84, resolved: 78 },
      { month: 'Oct', submitted: 96, resolved: 90 },
      { month: 'Nov', submitted: 108, resolved: 99 },
    ],
    '6m': analytics?.monthlyTrends?.length
      ? analytics.monthlyTrends
      : [
          { month: 'Jun', submitted: 42, resolved: 38 },
          { month: 'Jul', submitted: 58, resolved: 51 },
          { month: 'Aug', submitted: 71, resolved: 65 },
          { month: 'Sep', submitted: 84, resolved: 78 },
          { month: 'Oct', submitted: 96, resolved: 90 },
          { month: 'Nov', submitted: 108, resolved: 99 },
        ],
    '1y': [
      { month: 'Dec', submitted: 35, resolved: 30 },
      { month: 'Jan', submitted: 39, resolved: 36 },
      { month: 'Feb', submitted: 45, resolved: 40 },
      { month: 'Mar', submitted: 52, resolved: 47 },
      { month: 'Apr', submitted: 48, resolved: 46 },
      { month: 'May', submitted: 54, resolved: 50 },
      { month: 'Jun', submitted: 42, resolved: 38 },
      { month: 'Jul', submitted: 58, resolved: 51 },
      { month: 'Aug', submitted: 71, resolved: 65 },
      { month: 'Sep', submitted: 84, resolved: 78 },
      { month: 'Oct', submitted: 96, resolved: 90 },
      { month: 'Nov', submitted: 108, resolved: 99 },
    ],
  };

  const monthlyTrends = trendDatasets[timeframe].map((item) => ({
    month: item.month,
    submitted: selectedSeries === 'resolved' ? 0 : item.submitted,
    resolved: selectedSeries === 'submitted' ? 0 : item.resolved,
  }));

  const categoryBreakdown = analytics?.categoryBreakdown?.length
    ? analytics.categoryBreakdown
    : [
        { category: 'road_damage', count: 32 },
        { category: 'drainage', count: 24 },
        { category: 'streetlight', count: 18 },
        { category: 'waste_management', count: 15 },
        { category: 'footpath', count: 12 },
        { category: 'public_infrastructure', count: 7 },
      ];

  if (isError) {
    return (
      <Card className="p-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-text-primary">Failed to Load City Analytics</h3>
        <p className="text-xs text-text-muted">
          Could not retrieve telemetry from the analytics aggregator service.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-1.5">
          <RefreshCw size={13} /> Retry Analytics Query
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Interactive Timeframe Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Executive BI Analytics & City Operations
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Real-time incident metrics, multi-sector resolution trends, and department SLA compliance.
          </p>
        </div>

        {/* Timeframe Selector Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border self-start sm:self-auto">
          <span className="text-[11px] font-mono text-text-muted px-2 hidden sm:inline flex items-center gap-1">
            <Calendar size={11} /> Range:
          </span>
          {(
            [
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
              { id: '6m', label: '6M' },
              { id: '1y', label: '1Y' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                timeframe === t.id
                  ? 'bg-brand-midnight text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metric KPI Cards with Skeleton Loading State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={`kpi-skel-${idx}`} className="p-5 space-y-3 animate-pulse">
              <div className="h-4 w-28 bg-surface-secondary rounded" />
              <div className="h-8 w-20 bg-surface-secondary rounded" />
              <div className="h-3 w-36 bg-surface-secondary/70 rounded" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              label="Total Municipal Incidents"
              value={analytics?.totalIssues || 108}
              change="+12% year-over-year"
              isPositive={false}
              icon={<Flame size={20} />}
            />
            <StatCard
              label="Resolved Repairs"
              value={analytics?.resolvedCount || 82}
              change="76% completion rate"
              isPositive={true}
              icon={<CheckCircle2 size={20} />}
            />
            <StatCard
              label="City SLA Compliance"
              value={`${analytics?.slaComplianceRate || 94.2}%`}
              change="Goal: 90% target"
              isPositive={true}
              icon={<Clock size={20} />}
            />
            <StatCard
              label="Avg Resolution Speed"
              value={`${analytics?.avgResolutionHours || 18.5} hrs`}
              timeframe="median dispatch-to-fix"
              icon={<Clock size={20} />}
            />
          </>
        )}
      </div>

      {/* Interactive Controls Bar for Charts */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-cobalt" />
          <span className="text-xs font-bold text-text-primary">Trajectory Filter:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { id: 'all', label: 'All Series' },
              { id: 'submitted', label: 'Submitted Only' },
              { id: 'resolved', label: 'Resolved Only' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSeries(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSeries === s.id
                  ? 'bg-brand-cobalt text-white shadow-sm font-semibold'
                  : 'bg-surface-secondary text-text-muted hover:text-text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Trajectory & Sector Bar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChart data={monthlyTrends} />
        <CategoryChart data={categoryBreakdown} />
      </div>

      {/* Department SLA Scorecard */}
      <div>
        <SLAScorecard
          departments={departments || []}
          overallSLA={analytics?.slaComplianceRate || 94.2}
          avgHours={analytics?.avgResolutionHours || 18.5}
        />
      </div>
    </div>
  );
}
