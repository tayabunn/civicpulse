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
import { Download, ChevronLeft, ChevronRight, Eye, MapPin } from 'lucide-react';
import Link from 'next/link';

interface DataTableProps {
  issues: Issue[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: Issue) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function DataTable({
  issues,
  selectedIssueId,
  onSelectIssue,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `civicpulse-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col justify-between h-full">
      {/* Table header bar */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold font-display text-text-primary">
            Infrastructure Records
          </h3>
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-surface-secondary text-text-muted border border-border">
            {issues.length} displayed
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="text-xs gap-1.5"
          disabled={!issues.length}
        >
          <Download size={13} />
          Export CSV
        </Button>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-secondary text-[11px] font-mono uppercase text-text-muted border-b border-border">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Title & Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Reported</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted font-mono text-xs">
                  Loading records...
                </td>
              </tr>
            ) : issues.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-muted">
                  No issues found matching current criteria.
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
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-brand-cobalt">
                      {issue.trackingCode}
                    </td>
                    <td className="py-3 px-4 max-w-[240px]">
                      <p className="font-semibold text-text-primary truncate">{issue.title}</p>
                      <p className="text-xs text-text-muted truncate">{issue.address}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getCategoryBadgeClass(issue.category)}>
                        {getCategoryLabel(issue.category)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getPriorityBadgeClass(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusBadgeClass(issue.status)}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-text-muted whitespace-nowrap">
                      {formatDate(issue.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
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
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>
            Page <strong className="text-text-primary">{currentPage}</strong> of{' '}
            <strong className="text-text-primary">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft size={13} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
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
