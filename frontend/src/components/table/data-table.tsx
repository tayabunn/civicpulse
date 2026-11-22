'use client';

import React from 'react';
import { Issue } from '../../types';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
  formatDate,
} from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SearchX,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

interface DataTableProps {
  issues: Issue[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: Issue) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (column: string) => void;
  onClearFilters?: () => void;
}

export function DataTable({
  issues,
  selectedIssueId,
  onSelectIssue,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  sortColumn,
  sortOrder = 'desc',
  onSortChange,
  onClearFilters,
}: DataTableProps) {
  const exportToCSV = () => {
    if (!issues.length) return;
    const headers = ['Tracking Code', 'Title', 'Category', 'Priority', 'Status', 'Address', 'Date'];
    const rows = issues.map((i) => [
      i.trackingCode,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      i.priority,
      i.status,
      `"${i.address.replace(/"/g, '""')}"`,
      i.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `civicpulse-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 text-text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-brand-cobalt ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-cobalt ml-1 inline" />
    );
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col justify-between h-full min-h-[450px]">
      {/* Table Header Bar */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm sm:text-base font-bold font-display text-text-primary">
            Infrastructure Records
          </h3>
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-surface-secondary text-text-muted border border-border">
            {totalCount !== undefined ? `${totalCount} total` : `${issues.length} displayed`}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="text-xs gap-1.5 h-8"
          disabled={!issues.length}
        >
          <Download size={13} />
          Export CSV
        </Button>
      </div>

      {/* Main Container */}
      <div className="overflow-x-auto flex-1">
        {/* Desktop Table View */}
        <table className="w-full text-left text-sm hidden md:table">
          <thead className="bg-surface-secondary text-[11px] font-mono uppercase text-text-muted border-b border-border select-none">
            <tr>
              <th
                className={`py-3 px-4 ${onSortChange ? 'cursor-pointer hover:text-text-primary group' : ''}`}
                onClick={() => onSortChange && onSortChange('trackingCode')}
              >
                Code {onSortChange && renderSortIndicator('trackingCode')}
              </th>
              <th
                className={`py-3 px-4 ${onSortChange ? 'cursor-pointer hover:text-text-primary group' : ''}`}
                onClick={() => onSortChange && onSortChange('title')}
              >
                Title & Location {onSortChange && renderSortIndicator('title')}
              </th>
              <th
                className={`py-3 px-4 ${onSortChange ? 'cursor-pointer hover:text-text-primary group' : ''}`}
                onClick={() => onSortChange && onSortChange('category')}
              >
                Category {onSortChange && renderSortIndicator('category')}
              </th>
              <th
                className={`py-3 px-4 ${onSortChange ? 'cursor-pointer hover:text-text-primary group' : ''}`}
                onClick={() => onSortChange && onSortChange('priority')}
              >
                Priority {onSortChange && renderSortIndicator('priority')}
              </th>
              <th
                className={`py-3 px-4 ${onSortChange ? 'cursor-pointer hover:text-text-primary group' : ''}`}
                onClick={() => onSortChange && onSortChange('status')}
              >
                Status {onSortChange && renderSortIndicator('status')}
              </th>
              <th
                className={`py-3 px-4 ${onSortChange ? 'cursor-pointer hover:text-text-primary group' : ''}`}
                onClick={() => onSortChange && onSortChange('createdAt')}
              >
                Reported {onSortChange && renderSortIndicator('createdAt')}
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="animate-pulse">
                  <td className="py-3.5 px-4"><div className="h-4 w-20 bg-surface-secondary rounded" /></td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 w-44 bg-surface-secondary rounded mb-1.5" />
                    <div className="h-3 w-32 bg-surface-secondary/70 rounded" />
                  </td>
                  <td className="py-3.5 px-4"><div className="h-5 w-24 bg-surface-secondary rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-5 w-16 bg-surface-secondary rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-5 w-20 bg-surface-secondary rounded-full" /></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-24 bg-surface-secondary rounded" /></td>
                  <td className="py-3.5 px-4 text-right"><div className="h-8 w-16 bg-surface-secondary rounded ml-auto" /></td>
                </tr>
              ))
            ) : issues.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-text-muted mb-3">
                      <SearchX className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-text-primary mb-1">No Matching Records</h4>
                    <p className="text-xs text-text-muted mb-4">
                      No infrastructure issues matched your current search and filter selections.
                    </p>
                    {onClearFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-xs gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              issues.map((issue) => {
                const isSelected = issue.id === selectedIssueId;
                return (
                  <tr
                    key={issue.id}
                    onClick={() => onSelectIssue && onSelectIssue(issue)}
                    className={`cursor-pointer transition-colors hover:bg-surface-secondary/70 ${
                      isSelected ? 'bg-brand-cobalt/10 border-l-4 border-l-brand-cobalt' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-brand-cobalt">
                      {issue.trackingCode}
                    </td>
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="font-semibold text-text-primary truncate">{issue.title}</p>
                      <p className="text-xs text-text-muted truncate">{issue.address}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className={getCategoryBadgeClass(issue.category)}>
                        {getCategoryLabel(issue.category)}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className={getPriorityBadgeClass(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className={getStatusBadgeClass(issue.status)}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-text-muted whitespace-nowrap font-mono">
                      {formatDate(issue.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectIssue && onSelectIssue(issue)}
                          title="Pin on Map"
                          className="h-8 w-8 text-brand-cobalt hover:bg-brand-cobalt/10"
                        >
                          <MapPin size={14} />
                        </Button>
                        <Link href={`/citizen/issues/${issue.id}`}>
                          <Button variant="ghost" size="icon" title="View Details" className="h-8 w-8">
                            <Eye size={14} />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile Responsive Card View (Screen < 768px) */}
        <div className="md:hidden divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`mob-skel-${idx}`} className="p-4 space-y-2 animate-pulse">
                <div className="h-4 w-28 bg-surface-secondary rounded" />
                <div className="h-5 w-48 bg-surface-secondary rounded" />
                <div className="h-3 w-36 bg-surface-secondary/70 rounded" />
                <div className="flex gap-2 pt-1">
                  <div className="h-5 w-16 bg-surface-secondary rounded-full" />
                  <div className="h-5 w-16 bg-surface-secondary rounded-full" />
                </div>
              </div>
            ))
          ) : issues.length === 0 ? (
            <div className="p-8 text-center">
              <SearchX className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary">No Records Found</p>
              <p className="text-xs text-text-muted mt-1 mb-3">Adjust your filters to see results.</p>
              {onClearFilters && (
                <Button variant="outline" size="sm" onClick={onClearFilters} className="text-xs">
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={`mob-${issue.id}`}
                onClick={() => onSelectIssue && onSelectIssue(issue)}
                className="p-4 space-y-2 hover:bg-surface-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-cobalt">
                    {issue.trackingCode}
                  </span>
                  <span className="text-[11px] font-mono text-text-muted">
                    {formatDate(issue.createdAt)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary line-clamp-1">{issue.title}</h4>
                <p className="text-xs text-text-muted line-clamp-1">{issue.address}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className={getStatusBadgeClass(issue.status)}>
                      {getStatusLabel(issue.status)}
                    </Badge>
                    <Badge className={getPriorityBadgeClass(issue.priority)}>
                      {getPriorityLabel(issue.priority)}
                    </Badge>
                  </div>
                  <Link href={`/citizen/issues/${issue.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Eye size={12} /> View
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination & Page Size Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between flex-wrap gap-3 text-xs text-text-muted bg-surface">
        <div className="flex items-center gap-3">
          <span>
            Page <strong className="text-text-primary">{currentPage}</strong> of{' '}
            <strong className="text-text-primary">{Math.max(1, totalPages)}</strong>
          </span>

          {onPageSizeChange && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-border">
              <span className="text-[11px]">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-7 px-1.5 text-xs bg-surface-secondary rounded border border-border text-text-primary focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="h-8 text-xs gap-1"
          >
            <ChevronLeft size={13} /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="h-8 text-xs gap-1"
          >
            Next <ChevronRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
