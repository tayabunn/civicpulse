'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
  useUpdateIssueStatusMutation,
  useGetIssuesQuery,
} from '@/store/apiSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input, Textarea } from '@/components/ui/input';
import {
  getPriorityBadgeClass,
  getPriorityLabel,
  formatCoords,
} from '@/lib/utils';
import {
  Navigation,
  CheckCircle2,
  Play,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Clock,
  BellRing,
  Filter,
} from 'lucide-react';
import { MaintenanceTask, Issue } from '@/types';

const SLA_HOURS: Record<string, number> = {
  critical: 24,
  high: 48,
  medium: 96,
  low: 168,
};

export default function StaffTasksPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: tasks, isLoading, refetch } = useGetTasksQuery();
  const { data: issuesData } = useGetIssuesQuery({ limit: 100 });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateIssueStatus] = useUpdateIssueStatusMutation();

  const [remindersOnly, setRemindersOnly] = useState(false);

  // Completion Modal State
  const [activeTask, setActiveTask] = useState<MaintenanceTask | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionPhotoUrl, setCompletionPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Match tasks with issues
  const allIssues = issuesData?.items || [];

  const handleStartTask = async (task: MaintenanceTask) => {
    try {
      await updateTaskStatus({
        id: task.id,
        status: 'in_progress',
        notes: 'Field crew arrived on site and commenced repairs.',
      }).unwrap();

      await updateIssueStatus({
        id: task.issueId,
        status: 'in_progress',
        notes: `Repair commenced by technician ${user?.name || 'Field Crew'}.`,
      }).unwrap();

      refetch();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to start task');
    }
  };

  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setIsSubmitting(true);
    try {
      await updateTaskStatus({
        id: activeTask.id,
        status: 'completed',
        notes: completionNotes || 'Field repairs executed and tested.',
        completionPhotoUrl,
      }).unwrap();

      await updateIssueStatus({
        id: activeTask.issueId,
        status: 'resolved',
        notes: `Field repair successfully completed: ${completionNotes}`,
      }).unwrap();

      setActiveTask(null);
      refetch();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to resolve work order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to compute SLA reminder stats
  const getSlaStatus = (task: MaintenanceTask, issue?: Issue) => {
    if (task.status === 'completed') return null;

    const assignedDate = new Date(task.assignedAt || task.createdAt);
    const priority = issue?.priority || 'medium';
    const slaLimitHours = SLA_HOURS[priority] || 96;
    const deadline = new Date(assignedDate.getTime() + slaLimitHours * 60 * 60 * 1000);
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    const isOverdue = hoursRemaining < 0;
    const isApproaching = hoursRemaining >= 0 && hoursRemaining <= 12;

    return {
      hoursRemaining: Math.round(hoursRemaining),
      isOverdue,
      isApproaching,
      slaLimitHours,
    };
  };

  const taskList = tasks || [];
  const urgentCount = taskList.filter((t) => {
    const issue = t.issue || allIssues.find((i: Issue) => i.id === t.issueId);
    const sla = getSlaStatus(t, issue);
    return sla && (sla.isOverdue || sla.isApproaching);
  }).length;

  const filteredTasks = taskList.filter((t) => {
    if (!remindersOnly) return true;
    const issue = t.issue || allIssues.find((i: Issue) => i.id === t.issueId);
    const sla = getSlaStatus(t, issue);
    return sla && (sla.isOverdue || sla.isApproaching);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-brand-midnight text-white shadow-lg">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-bold">
            Field Technician Board
          </span>
          <h2 className="text-2xl font-bold font-display text-white mt-1">
            Active Work Orders: {user?.name || 'Kamal Hossain'}
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Mobile dispatch board for on-site municipal maintenance, repair execution, and completion proof uploads.
          </p>
        </div>
      </div>

      {/* Bonus Challenge 6: Automated Maintenance Reminders Alert Banner */}
      {urgentCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-5 h-5 text-amber-500 animate-bounce" />
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                Automated Maintenance Reminders ({urgentCount} Urgent)
              </h4>
              <p className="text-xs text-text-muted">
                Work orders approaching SLA deadline or requiring immediate field dispatch.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRemindersOnly(!remindersOnly)}
            className={`text-xs gap-1.5 h-8 font-mono ${
              remindersOnly ? 'border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300' : ''
            }`}
          >
            <Filter size={12} />
            {remindersOnly ? 'Show All Work Orders' : 'Filter Urgent Only'}
          </Button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-12 text-xs font-mono text-text-muted">
            Loading assigned field work orders...
          </p>
        ) : filteredTasks.length === 0 ? (
          <Card className="p-8 text-center text-text-muted">
            {remindersOnly
              ? 'No urgent maintenance reminders at this time. All orders on schedule.'
              : 'No active work orders assigned to your queue today. Great job!'}
          </Card>
        ) : (
          filteredTasks.map((task: MaintenanceTask) => {
            const issue = task.issue || allIssues.find((i: Issue) => i.id === task.issueId);
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';
            const sla = getSlaStatus(task, issue);

            const mapsUrl = issue
              ? `https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`
              : '#';

            return (
              <Card
                key={task.id}
                className={`p-6 transition-all border-l-4 ${
                  isCompleted
                    ? 'border-l-emerald-500 opacity-80'
                    : sla?.isOverdue
                    ? 'border-l-rose-500 ring-1 ring-rose-500/30'
                    : sla?.isApproaching
                    ? 'border-l-amber-500'
                    : isInProgress
                    ? 'border-l-brand-yellow'
                    : 'border-l-brand-cobalt'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand-cobalt">
                        {issue?.trackingCode || 'WO-#' + task.id.slice(0, 8)}
                      </span>
                      {issue && (
                        <Badge className={getPriorityBadgeClass(issue.priority)}>
                          {getPriorityLabel(issue.priority)}
                        </Badge>
                      )}
                      <Badge
                        className={
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800'
                            : isInProgress
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-blue-50 text-blue-800'
                        }
                      >
                        {task.status.toUpperCase()}
                      </Badge>

                      {/* Automated SLA Reminder Badge */}
                      {sla?.isOverdue && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle size={11} /> OVERDUE ({Math.abs(sla.hoursRemaining)}h)
                        </span>
                      )}
                      {sla?.isApproaching && !sla.isOverdue && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Clock size={11} /> SLA Reminder: {sla.hoursRemaining}h left
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold font-display text-text-primary">
                      {issue?.title || 'Municipal Infrastructure Work Order'}
                    </h3>

                    {issue && (
                      <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                        {issue.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-text-muted">
                      {issue && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-brand-cobalt shrink-0" />
                          <span className="font-medium">{issue.address}</span>
                        </div>
                      )}
                      {issue && (
                        <div className="flex items-center gap-1.5 font-mono text-brand-cobalt">
                          <span>{formatCoords(issue.latitude, issue.longitude)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                        <Navigation size={13} /> Open GPS Navigation
                      </Button>
                    </a>

                    {!isCompleted && !isInProgress && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartTask(task)}
                        className="w-full text-xs gap-1.5 font-bold"
                      >
                        <Play size={13} /> Start Repairs
                      </Button>
                    )}

                    {!isCompleted && isInProgress && (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setActiveTask(task)}
                        className="w-full text-xs gap-1.5 font-bold shadow-sm"
                      >
                        <CheckCircle2 size={13} /> Complete & Upload Proof
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Completion Modal */}
      {activeTask && (
        <Dialog
          isOpen={true}
          onClose={() => setActiveTask(null)}
          title="Complete Work Order & Upload Proof"
          description="Submit photographic proof and field notes to close out this maintenance order."
        >
          <form onSubmit={handleCompleteTask} className="space-y-4">
            <Textarea
              label="Field Maintenance Notes *"
              placeholder="e.g. Cleared 15kg asphalt debris, compacted 4-inch hot-mix asphalt, leveled flush with street surface."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={3}
              required
            />

            <Input
              label="Completion Photograph Proof (URL or Demo)"
              placeholder="https://... completion photo"
              value={completionPhotoUrl}
              onChange={(e) => setCompletionPhotoUrl(e.target.value)}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTask(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                isLoading={isSubmitting}
                className="font-bold shadow-sm"
              >
                Submit Resolution
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
