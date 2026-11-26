'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/analytics/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/input';
import {
  ShieldAlert,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  BellRing,
} from 'lucide-react';

export default function AdminSlaEscalationsPage() {
  const { data: issuesData, isLoading } = useGetIssuesQuery({ limit: 40 });
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [escalatedIds, setEscalatedIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  const openIssues = useMemo(() => {
    const raw = issuesData?.items || [];
    return raw
      .filter((issue: any) => issue.status !== 'resolved' && issue.status !== 'closed')
      .filter((issue: any) => priorityFilter === 'ALL' || issue.priority === priorityFilter)
      .map((issue: any) => {
        const createdAt = new Date(issue.createdAt).getTime();
        const ageHours = Math.max(1, Math.round((Date.now() - createdAt) / (1000 * 60 * 60)));
        const slaTargetHours =
          issue.priority === 'critical'
            ? 12
            : issue.priority === 'high'
            ? 24
            : issue.priority === 'medium'
            ? 48
            : 72;
        const breached = ageHours > slaTargetHours;
        return { ...issue, ageHours, slaTargetHours, breached };
      })
      .sort((a: any, b: any) => Number(b.breached) - Number(a.breached) || b.ageHours - a.ageHours);
  }, [issuesData, priorityFilter]);

  const breachedCount = openIssues.filter((i: any) => i.breached).length;
  const criticalCount = openIssues.filter((i: any) => i.priority === 'critical' || i.priority === 'high').length;

  const handleEscalate = (issue: any) => {
    setEscalatedIds((prev) => ({ ...prev, [issue.id]: true }));
    setToast(`Escalation notice dispatched to department head for "${issue.title}".`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Ward SLA & Escalation Queue
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Monitor overdue municipal tickets, SLA breach risks, and dispatch immediate executive escalations.
          </p>
        </div>
        <div className="w-full sm:w-52">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'critical', label: 'Critical Only' },
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' },
            ]}
          />
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
          <BellRing size={16} className="shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Active Queue"
          value={openIssues.length}
          change="Open municipal incidents"
          isPositive={true}
          icon={<Clock size={20} />}
        />
        <StatCard
          label="SLA Breached"
          value={breachedCount}
          change="Exceeded target turnaround"
          isPositive={breachedCount === 0}
          icon={<ShieldAlert size={20} />}
        />
        <StatCard
          label="High / Critical"
          value={criticalCount}
          change="Priority 12–24h SLA window"
          isPositive={false}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      <Card className="overflow-hidden rounded-lg">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-text-muted">Loading live SLA queue...</div>
        ) : openIssues.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 size={28} className="mx-auto text-emerald-500" />
            <p className="text-base font-semibold text-text-primary">All caught up</p>
            <p className="text-sm text-text-muted">No open issues match this priority filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {openIssues.map((issue: any) => {
              const isEscalated = escalatedIds[issue.id];
              return (
                <div
                  key={issue.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-secondary/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="pill"
                        className={
                          issue.breached
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }
                      >
                        {issue.breached ? 'SLA Breached' : 'Within SLA'}
                      </Badge>
                      <Badge variant="outline" className="uppercase font-mono text-[11px]">
                        {issue.priority}
                      </Badge>
                      <span className="text-xs font-mono text-text-muted">
                        Elapsed: {issue.ageHours}h / Target: {issue.slaTargetHours}h
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">{issue.title}</h3>
                    <p className="text-sm text-text-muted">
                      {issue.address || 'Dhaka Metropolitan Area'} • Status:{' '}
                      <span className="capitalize font-medium text-text-secondary">
                        {String(issue.status).replace('_', ' ')}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={isEscalated ? 'outline' : 'primary'}
                      disabled={isEscalated}
                      onClick={() => handleEscalate(issue)}
                      className="rounded-lg gap-1.5"
                    >
                      <BellRing size={14} />
                      {isEscalated ? 'Escalated' : 'Escalate Now'}
                    </Button>
                    <Link href={`/citizen/issues/${issue.id}`}>
                      <Button size="sm" variant="outline" className="rounded-lg gap-1">
                        Inspect <ArrowUpRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
