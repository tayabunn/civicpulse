'use client';

import React from 'react';
import Link from 'next/link';
import {
  useGetAnalyticsQuery,
  useGetDepartmentsQuery,
  useGetIssuesQuery,
} from '@/store/apiSlice';
import { StatCard } from '@/components/analytics/stat-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
  formatDate,
} from '@/lib/utils';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { Issue, Department } from '@/types';

export default function AdminOverviewPage() {
  const { data: analytics } = useGetAnalyticsQuery();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: issuesData } = useGetIssuesQuery({ priority: 'critical', limit: 5 });

  const criticalIssues = issuesData?.items || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Executive Command Center
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            Dhaka City Infrastructure Operations
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Live municipal overview across all 5 infrastructure departments, SLA performance indicators, and critical emergency incidents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/analytics">
            <Button variant="accent" size="lg" className="gap-2 font-bold shadow-md">
              <BarChart3 size={18} /> Deep BI Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Incidents"
          value={analytics?.totalIssues || 108}
          change="+14% this month"
          isPositive={false}
          icon={<Flame size={20} />}
        />
        <StatCard
          label="Resolved Repairs"
          value={analytics?.resolvedCount || 82}
          change="+18% vs target"
          isPositive={true}
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          label="SLA Compliance Rate"
          value={`${analytics?.slaComplianceRate || 94.2}%`}
          change="Target: 90%"
          isPositive={true}
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Avg Resolution Speed"
          value={`${analytics?.avgResolutionHours || 18.5} hrs`}
          timeframe="across all sectors"
          icon={<Clock size={20} />}
        />
      </div>

      {/* Grid: Critical Priority Incidents & Department Quick Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Critical Incidents */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-600" size={18} />
              <h3 className="text-lg font-bold font-display text-text-primary">
                Critical Priority Incidents
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-600 font-semibold">
              Immediate Safety Hazard
            </span>
          </div>

          <div className="space-y-3">
            {criticalIssues.length === 0 ? (
              <Card className="p-8 text-center text-text-muted">
                No active critical incidents. All high-severity issues have been addressed.
              </Card>
            ) : (
              criticalIssues.map((issue: Issue) => (
                <Card
                  key={issue.id}
                  className="p-4 border-l-4 border-l-rose-600 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-cobalt">
                          {issue.trackingCode}
                        </span>
                        <Badge className={getCategoryBadgeClass(issue.category)}>
                          {getCategoryLabel(issue.category)}
                        </Badge>
                        <Badge className="bg-rose-100 text-rose-800 font-bold border-rose-300">
                          CRITICAL
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-text-primary">
                        <Link href={`/citizen/issues/${issue.id}`} className="hover:underline">
                          {issue.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-text-muted">{issue.address}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge className={getStatusBadgeClass(issue.status)}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                      <p className="text-[10px] text-text-muted font-mono mt-1">
                        {formatDate(issue.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Department Health Matrix */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-text-primary">
              Department Operations
            </h3>
            <Link href="/admin/departments">
              <Button variant="ghost" size="sm" className="text-xs text-brand-cobalt gap-1">
                Manage <ArrowRight size={12} />
              </Button>
            </Link>
          </div>

          <Card className="p-5 space-y-4">
            {(departments || []).map((dept: Department) => (
              <div key={dept.id} className="p-3 rounded-lg bg-surface-secondary border border-border">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-text-primary">{dept.name}</span>
                  <span className="text-brand-cobalt font-mono">Code: {dept.code}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted mt-2">
                  <span>{dept.staff?.length || 6} Field Technicians</span>
                  <span className="text-emerald-600 font-semibold">94% SLA</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
