'use client';

import React, { useState } from 'react';
import { useGetIssuesQuery } from '@/store/apiSlice';
import { DataTable } from '@/components/table/data-table';
import { FilterToolbar } from '@/components/table/filter-toolbar';
import { IssueFilters } from '@/types';

export default function ManagerIssuesPage() {
  const [filters, setFilters] = useState<IssueFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: issuesData, isLoading } = useGetIssuesQuery(filters);

  const handleFilterChange = (newFilters: Partial<IssueFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleSortChange = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

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

      <FilterToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isLoading={isLoading}
        totalResults={issuesData?.total}
      />

      <div className="min-h-[500px]">
        <DataTable
          issues={issuesData?.items || []}
          currentPage={issuesData?.page || 1}
          totalPages={issuesData?.totalPages || 1}
          totalCount={issuesData?.total}
          pageSize={filters.limit || 10}
          onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, limit: size, page: 1 }))}
          sortColumn={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          onClearFilters={handleReset}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
