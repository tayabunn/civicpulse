'use client';

import React, { useState } from 'react';
import { DebouncedSearchInput } from '../ui/debounced-search-input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { IssueFilters } from '@/types';

interface FilterToolbarProps {
  filters: IssueFilters;
  onFilterChange: (newFilters: Partial<IssueFilters>) => void;
  onReset: () => void;
  isLoading?: boolean;
  totalResults?: number;
}

export function FilterToolbar({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
  totalResults,
}: FilterToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate count of active filters (excluding default page/limit)
  const activeCount = [
    filters.search,
    filters.status,
    filters.priority,
    filters.category,
    filters.startDate,
    filters.endDate,
    filters.sortBy && filters.sortBy !== 'createdAt' ? filters.sortBy : undefined,
  ].filter(Boolean).length;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-3 shadow-sm transition-all">
      {/* Primary Row: Search Bar + Filter Count + Advanced Toggle + Reset */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1">
          <DebouncedSearchInput
            value={filters.search || ''}
            onChange={(search) => onFilterChange({ search, page: 1 })}
            isLoading={isLoading}
            placeholder="Search by code, title, address, or keyword..."
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          {totalResults !== undefined && (
            <span className="text-xs font-mono text-text-muted px-2.5 py-1.5 rounded-lg bg-surface-secondary border border-border">
              {totalResults} record{totalResults === 1 ? '' : 's'}
            </span>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`gap-1.5 text-xs font-medium ${
              showAdvanced || activeCount > 0
                ? 'border-brand-cobalt text-brand-cobalt bg-brand-cobalt/5'
                : ''
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeCount > 0 && (
              <Badge className="bg-brand-cobalt text-white ml-1 px-1.5 py-0.2 text-[10px] font-bold">
                {activeCount}
              </Badge>
            )}
            {showAdvanced ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </Button>

          {activeCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1 text-xs text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filter Drawer (Expandable) */}
      {showAdvanced && (
        <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value || undefined, page: 1 })}
              className="w-full h-9 px-2.5 text-xs bg-surface-secondary rounded-lg border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-cobalt"
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ priority: e.target.value || undefined, page: 1 })}
              className="w-full h-9 px-2.5 text-xs bg-surface-secondary rounded-lg border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-cobalt"
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ category: e.target.value || undefined, page: 1 })}
              className="w-full h-9 px-2.5 text-xs bg-surface-secondary rounded-lg border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-cobalt"
            >
              <option value="">All Categories</option>
              <option value="road_transport">Road & Transport</option>
              <option value="water_sewage">Water & Sewage</option>
              <option value="electricity_lighting">Electrical & Lighting</option>
              <option value="waste_management">Waste Management</option>
              <option value="parks_public_spaces">Parks & Public Spaces</option>
              <option value="public_safety">Public Safety</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Sort By & Order */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-text-muted mb-1">
              Sort Order
            </label>
            <div className="flex gap-1.5">
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => onFilterChange({ sortBy: e.target.value, page: 1 })}
                className="flex-1 h-9 px-2 text-xs bg-surface-secondary rounded-lg border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-cobalt"
              >
                <option value="createdAt">Date Reported</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onFilterChange({
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                    page: 1,
                  })
                }
                title={filters.sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                className="h-9 px-2.5 text-xs font-mono"
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                {filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}
              </Button>
            </div>
          </div>

          {/* Start Date */}
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-mono uppercase text-text-muted mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value || undefined, page: 1 })}
              className="w-full h-9 px-2.5 text-xs bg-surface-secondary rounded-lg border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-cobalt"
            />
          </div>

          {/* End Date */}
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-mono uppercase text-text-muted mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ endDate: e.target.value || undefined, page: 1 })}
              className="w-full h-9 px-2.5 text-xs bg-surface-secondary rounded-lg border border-border text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-cobalt"
            />
          </div>
        </div>
      )}
    </div>
  );
}
