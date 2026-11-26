'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import {
  ScrollText,
  Download,
  Search,
  ShieldCheck,
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  action: 'STATUS_CHANGE' | 'BUDGET_APPROVAL' | 'ADVISORY_BROADCAST' | 'USER_ROLE_UPDATE';
  target: string;
  details: string;
}

const AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'AUD-9042',
    timestamp: '2026-11-26 19:14:22',
    actor: 'Sarah Rahman',
    role: 'ADMIN',
    action: 'ADVISORY_BROADCAST',
    target: 'Ward 24 — Mirpur 10',
    details: 'Published scheduled WASA water main maintenance notice (ADV-104).',
  },
  {
    id: 'AUD-9041',
    timestamp: '2026-11-26 16:40:05',
    actor: 'Tariq Rahman',
    role: 'MANAGER',
    action: 'STATUS_CHANGE',
    target: 'CP-A0000035',
    details: 'Verified priority as LOW and assigned to Roads & Highways crew.',
  },
  {
    id: 'AUD-9040',
    timestamp: '2026-11-25 14:12:49',
    actor: 'Sarah Rahman',
    role: 'ADMIN',
    action: 'BUDGET_APPROVAL',
    target: 'BDG-2026-02',
    details: 'Approved ৳36.00 Lakh stormwater drainage desilting tranche.',
  },
  {
    id: 'AUD-9039',
    timestamp: '2026-11-25 11:05:18',
    actor: 'Habibur Rahman',
    role: 'STAFF',
    action: 'STATUS_CHANGE',
    target: 'CP-A0000035',
    details: 'Uploaded field repair photo and marked work order Resolved.',
  },
  {
    id: 'AUD-9038',
    timestamp: '2026-11-24 09:51:30',
    actor: 'Sarah Rahman',
    role: 'ADMIN',
    action: 'USER_ROLE_UPDATE',
    target: 'kamrul.elec@civicpulse.gov.bd',
    details: 'Elevated account to Department Manager (Electrical & Lighting).',
  },
];

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter((entry) => {
      const matchesAction = actionFilter === 'ALL' || entry.action === actionFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        entry.actor.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q) ||
        entry.details.toLowerCase().includes(q);
      return matchesAction && matchesSearch;
    });
  }, [search, actionFilter]);

  const handleExportCsv = () => {
    const header = 'ID,Timestamp,Actor,Role,Action,Target,Details\n';
    const rows = filtered
      .map(
        (e) =>
          `"${e.id}","${e.timestamp}","${e.actor}","${e.role}","${e.action}","${e.target}","${e.details}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'civicpulse-audit-logs.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Audit & Compliance Logs
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Immutable governance trail of administrative actions, status transitions, and fiscal approvals.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5 rounded-lg">
          <Download size={14} /> Export Audit CSV
        </Button>
      </div>

      <Card className="p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor, issue ID, ward, or event details..."
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-56">
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Event Types' },
                { value: 'STATUS_CHANGE', label: 'Status Transitions' },
                { value: 'BUDGET_APPROVAL', label: 'Budget Approvals' },
                { value: 'ADVISORY_BROADCAST', label: 'Advisory Broadcasts' },
                { value: 'USER_ROLE_UPDATE', label: 'Role Updates' },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-lg">
        <div className="px-5 py-3.5 border-b border-border bg-surface-secondary/50 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-text-muted flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Tamper-evident chronological governance log ({filtered.length} entries)
          </span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((entry) => (
            <div key={entry.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-secondary/30 transition-colors">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-text-muted">{entry.id}</span>
                  <Badge
                    variant="pill"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {entry.action.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-[11px] font-mono">
                    {entry.role}
                  </Badge>
                  <span className="text-xs font-semibold text-text-primary">{entry.actor}</span>
                </div>
                <p className="text-sm text-text-secondary">
                  <span className="font-mono text-xs text-[#315CFF] dark:text-[#6280FF] mr-1.5">
                    [{entry.target}]
                  </span>
                  {entry.details}
                </p>
              </div>
              <span className="text-xs font-mono text-text-muted shrink-0 flex items-center gap-1.5">
                <ScrollText size={13} /> {entry.timestamp}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
