'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import {
  setFilters,
  clearFilters,
  setSelectedIssueId,
  setViewMode,
} from '@/store/explorerSlice';
import { useGetIssuesQuery, useGetSavedViewsQuery, useCreateSavedViewMutation } from '@/store/apiSlice';
import { DataTable } from '@/components/table/data-table';
import { IssueMap } from '@/components/map/issue-map';
import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  Compass,
  RotateCcw,
  Layout,
  Map,
  Table as TableIcon,
  Bookmark,
} from 'lucide-react';
import { Issue } from '@/types';

export default function ExplorerPage() {
  const dispatch = useDispatch();
  const { activeFilters, selectedIssueId, viewMode } = useSelector(
    (state: RootState) => state.explorer
  );

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const { data: issuesData, isLoading } = useGetIssuesQuery({
    ...activeFilters,
    search: searchInput || undefined,
    page,
    limit: 15,
  });

  const { data: savedViews } = useGetSavedViewsQuery();
  const [createSavedView] = useCreateSavedViewMutation();

  const issues = issuesData?.items || [];
  const selectedIssue = issues.find((i: Issue) => i.id === selectedIssueId);

  const handleSelectIssue = (issue: Issue) => {
    dispatch(setSelectedIssueId(issue.id));
  };

  const handleResetFilters = () => {
    dispatch(clearFilters());
    setSearchInput('');
    setPage(1);
  };

  const handleSaveViewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    try {
      await createSavedView({
        name: newViewName.trim(),
        filters: activeFilters,
      }).unwrap();
      setIsSaveViewOpen(false);
      setNewViewName('');
      alert('Saved view preset created!');
    } catch {
      alert('Failed to save view preset.');
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="text-brand-cobalt" size={22} />
            <h2 className="text-2xl font-bold font-display text-text-primary tracking-tight">
              DataScope Explorer
            </h2>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Geospatial intelligence suite with coordinated synchronized map and tabular incident grid.
          </p>
        </div>

        {/* View Mode Toggle & Preset Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg bg-surface border border-border">
            <button
              onClick={() => dispatch(setViewMode('split'))}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold transition-colors ${
                viewMode === 'split'
                  ? 'bg-brand-midnight text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Split View (Table + Map)"
            >
              <Layout size={14} /> Split
            </button>
            <button
              onClick={() => dispatch(setViewMode('table'))}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand-midnight text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Table Only"
            >
              <TableIcon size={14} /> Table
            </button>
            <button
              onClick={() => dispatch(setViewMode('map'))}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold transition-colors ${
                viewMode === 'map'
                  ? 'bg-brand-midnight text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Map Only"
            >
              <Map size={14} /> Map
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSaveViewOpen(true)}
            className="text-xs gap-1.5"
          >
            <Bookmark size={13} /> Save View
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-surface border border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
        <Input
          placeholder="Search by keyword, code, street..."
          value={searchInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          className="h-10 text-xs"
        />

        <Select
          value={activeFilters.category || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            dispatch(setFilters({ category: e.target.value || undefined }));
            setPage(1);
          }}
          options={[
            { label: 'All Sectors / Categories', value: '' },
            { label: 'Road Damage', value: 'road_damage' },
            { label: 'Streetlight', value: 'streetlight' },
            { label: 'Drainage & Sewage', value: 'drainage' },
            { label: 'Footpath & Walkway', value: 'footpath' },
            { label: 'Waste Management', value: 'waste_management' },
            { label: 'Public Infrastructure', value: 'public_infrastructure' },
          ]}
          className="h-10 text-xs"
        />

        <Select
          value={activeFilters.status || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            dispatch(setFilters({ status: e.target.value || undefined }));
            setPage(1);
          }}
          options={[
            { label: 'All Lifecycle Statuses', value: '' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Under Review', value: 'under_review' },
            { label: 'Assigned', value: 'assigned' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved', value: 'resolved' },
            { label: 'Closed', value: 'closed' },
          ]}
          className="h-10 text-xs"
        />

        <Select
          value={activeFilters.priority || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            dispatch(setFilters({ priority: e.target.value || undefined }));
            setPage(1);
          }}
          options={[
            { label: 'All Priorities', value: '' },
            { label: 'Critical', value: 'critical' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
          className="h-10 text-xs"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetFilters}
          className="h-10 text-xs gap-1.5"
        >
          <RotateCcw size={13} /> Reset Filters
        </Button>
      </div>

      {/* Synchronized Explorer Work Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        {/* Table Panel */}
        {(viewMode === 'split' || viewMode === 'table') && (
          <div
            className={`h-full overflow-hidden transition-all duration-300 ${
              viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}
          >
            <DataTable
              issues={issues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={handleSelectIssue}
              currentPage={issuesData?.page || 1}
              totalPages={issuesData?.totalPages || 1}
              onPageChange={(p: number) => setPage(p)}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Map Panel */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`h-full min-h-[400px] rounded-xl overflow-hidden border border-border shadow-sm transition-all duration-300 ${
              viewMode === 'split' ? 'lg:col-span-5' : 'lg:col-span-12'
            }`}
          >
            <IssueMap
              issues={issues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={handleSelectIssue}
              center={
                selectedIssue
                  ? [selectedIssue.latitude, selectedIssue.longitude]
                  : [23.8103, 90.4125]
              }
              zoom={selectedIssue ? 15 : 12}
            />
          </div>
        )}
      </div>

      {/* Save View Modal */}
      <Dialog
        isOpen={isSaveViewOpen}
        onClose={() => setIsSaveViewOpen(false)}
        title="Save Current Filter Preset"
        description="Preserve active sector, priority, and status filter combinations."
      >
        <form onSubmit={handleSaveViewSubmit} className="space-y-4">
          <Input
            label="Preset Name *"
            placeholder="e.g. Critical Road Hazards in Dhanmondi"
            value={newViewName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewViewName(e.target.value)}
            required
          />

          <div className="p-3 rounded-lg bg-surface-secondary border border-border text-xs space-y-1 font-mono">
            <span className="text-text-muted">Preset Filters:</span>
            <pre className="text-[11px] overflow-x-auto text-text-primary">
              {JSON.stringify(activeFilters, null, 2)}
            </pre>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSaveViewOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="font-bold shadow-sm">
              Save View Preset
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
