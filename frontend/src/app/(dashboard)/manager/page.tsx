'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetIssuesQuery,
  useGetDepartmentsQuery,
  useGetTasksQuery,
  useUpdateIssueStatusMutation,
  useAssignTaskMutation,
} from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/analytics/stat-card';
import { Dialog } from '@/components/ui/dialog';
import { Select, Textarea } from '@/components/ui/input';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
} from '@/lib/utils';
import {
  Clock,
  HardHat,
  CheckCircle2,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Issue, Department, User } from '@/types';

export default function ManagerDashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: issuesData, isLoading: isIssuesLoading } = useGetIssuesQuery({ limit: 50 });
  const { data: departments } = useGetDepartmentsQuery();
  const { data: tasks } = useGetTasksQuery();

  const [updateStatus] = useUpdateIssueStatusMutation();
  const [assignTask] = useAssignTaskMutation();

  // Triage Dialog State
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [triageNotes, setTriageNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issues = issuesData?.items || [];
  const pendingTriage = issues.filter(
    (i: Issue) => i.status === 'submitted' || i.status === 'under_review'
  );
  const inProgressIssues = issues.filter((i: Issue) => i.status === 'in_progress');
  const resolvedIssues = issues.filter((i: Issue) => i.status === 'resolved');

  // Find department staff members
  const currentDept = departments?.find((d: Department) => d.id === user?.departmentId) || departments?.[0];
  const staffMembers = currentDept?.staff || [];

  const handleOpenTriage = (issue: Issue) => {
    setSelectedIssue(issue);
    setSelectedStaffId(staffMembers[0]?.id || '');
    setTriageNotes('');
  };

  const handleConfirmTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setIsSubmitting(true);
    try {
      if (selectedStaffId) {
        await assignTask({
          issueId: selectedIssue.id,
          staffId: selectedStaffId,
          notes: triageNotes || 'Field inspection assigned by department manager.',
        }).unwrap();
      }
      await updateStatus({
        id: selectedIssue.id,
        status: 'assigned',
        notes: `Assigned to maintenance crew. ${triageNotes}`,
      }).unwrap();

      setSelectedIssue(null);
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to triage issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Department Triage & Dispatch
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mt-1">
            {currentDept ? currentDept.name : 'Infrastructure Maintenance'} Operations
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Review incoming citizen reports, allocate repair work orders to available crews, and monitor SLA compliance.
          </p>
        </div>
        <Link href="/manager/issues">
          <Button variant="accent" size="lg" className="gap-2 font-bold shadow-md">
            <HardHat size={18} /> Open Full Triage Queue
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Pending Triage"
          value={pendingTriage.length}
          change="Requires action"
          isPositive={false}
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Active Work Orders"
          value={inProgressIssues.length}
          change="In field repair"
          isPositive={true}
          icon={<HardHat size={20} />}
        />
        <StatCard
          label="Resolved Repairs"
          value={resolvedIssues.length}
          change="94.2% SLA"
          isPositive={true}
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          label="Crew Members"
          value={staffMembers.length || 6}
          change="All active"
          isPositive={true}
          icon={<Users size={20} />}
        />
      </div>

      {/* Grid: Pending Triage Queue & Crew Workload Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Urgent Triage Queue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-text-primary">
              Incidents Awaiting Department Triage
            </h3>
            <span className="text-xs font-mono text-text-muted">
              {pendingTriage.length} unassigned
            </span>
          </div>

          <div className="space-y-3">
            {isIssuesLoading ? (
              <p className="text-xs font-mono text-text-muted py-8 text-center">Loading queue...</p>
            ) : pendingTriage.length === 0 ? (
              <Card className="p-8 text-center text-text-muted">
                All department incidents have been triaged! No pending issues.
              </Card>
            ) : (
              pendingTriage.slice(0, 5).map((issue: Issue) => (
                <Card
                  key={issue.id}
                  className="p-4 transition-all hover:border-brand-cobalt hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-cobalt">
                          {issue.trackingCode}
                        </span>
                        <Badge className={getPriorityBadgeClass(issue.priority)}>
                          {getPriorityLabel(issue.priority)}
                        </Badge>
                        <Badge className={getCategoryBadgeClass(issue.category)}>
                          {getCategoryLabel(issue.category)}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-text-primary">
                        <Link href={`/citizen/issues/${issue.id}`} className="hover:underline">
                          {issue.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-text-muted line-clamp-1">{issue.address}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handleOpenTriage(issue)}
                        className="text-xs font-bold shadow-sm"
                      >
                        Triage & Assign
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Crew Workload Meters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-text-primary">
              Field Crew Workload
            </h3>
            <Link href="/manager/team">
              <Button variant="ghost" size="sm" className="text-xs text-brand-cobalt gap-1">
                View Roster <ArrowRight size={12} />
              </Button>
            </Link>
          </div>

          <Card className="p-5 space-y-4">
            {staffMembers.length === 0 ? (
              <p className="text-xs text-text-muted">No staff loaded for department.</p>
            ) : (
              staffMembers.slice(0, 5).map((staff: User, idx: number) => {
                const activeTasks = (idx * 2 + 1) % 4;
                const capacity = 5;
                const percentage = (activeTasks / capacity) * 100;

                return (
                  <div key={staff.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">{staff.name}</span>
                      <span className="font-mono text-text-muted">
                        {activeTasks} / {capacity} tasks
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage > 70 ? '#A1262D' : percentage > 40 ? '#D6A900' : '#24613B',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>

      {/* Triage Modal */}
      <Dialog
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        title="Triage & Assign Maintenance Task"
        description="Verify issue severity, link maintenance staff, and update lifecycle state to Assigned."
      >
        {selectedIssue && (
          <form onSubmit={handleConfirmTriage} className="space-y-4">
            <div className="p-3 rounded-lg bg-surface-secondary border border-border text-xs space-y-1">
              <p className="font-bold text-text-primary">
                {selectedIssue.trackingCode}: {selectedIssue.title}
              </p>
              <p className="text-text-muted">{selectedIssue.address}</p>
            </div>

            <Select
              label="Assign Maintenance Staff Member *"
              options={
                staffMembers.map((s: User) => ({
                  label: `${s.name} (${s.email})`,
                  value: s.id,
                })) || []
              }
              value={selectedStaffId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStaffId(e.target.value)}
              required
            />

            <Textarea
              label="Work Order Instructions & Dispatch Notes"
              placeholder="e.g. Bring asphalt seal truck, block right lane, expedite repair within 24h..."
              value={triageNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTriageNotes(e.target.value)}
              rows={3}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedIssue(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="font-bold shadow-sm"
              >
                Confirm & Dispatch Task
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
