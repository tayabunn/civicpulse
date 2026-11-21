'use client';

import React, { useState } from 'react';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { DataTable } from '@/components/table/data-table';
import { Select } from '@/components/ui/input';

export default function ManagerIssuesPage() {
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: issuesData, isLoading } = useGetIssuesQuery({
    status: status || undefined,
    priority: priority || undefined,
    page,
    limit: 15,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
          Department Issue Triage Queue
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Review, filter, and dispatch incoming city work orders across municipal infrastructure sectors.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface border border-border">
        <Select
          label="Filter Status"
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          options={[
            { label: 'All Lifecycle Statuses', value: '' },
            { label: 'Submitted (New)', value: 'submitted' },
            { label: 'Under Review', value: 'under_review' },
            { label: 'Assigned', value: 'assigned' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved', value: 'resolved' },
            { label: 'Closed', value: 'closed' },
          ]}
        />

        <Select
          label="Filter Priority"
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setPriority(e.target.value);
            setPage(1);
          }}
          options={[
            { label: 'All Priorities', value: '' },
            { label: 'Critical', value: 'critical' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
        />
      </div>

      {/* Table */}
      <div className="h-[600px]">
        <DataTable
          issues={issuesData?.items || []}
          currentPage={issuesData?.page || 1}
          totalPages={issuesData?.totalPages || 1}
          onPageChange={(p: number) => setPage(p)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
