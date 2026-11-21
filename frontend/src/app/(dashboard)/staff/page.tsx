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
} from 'lucide-react';
import { MaintenanceTask, Issue } from '@/types';

export default function StaffTasksPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: tasks, isLoading, refetch } = useGetTasksQuery();
  const { data: issuesData } = useGetIssuesQuery({ limit: 100 });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateIssueStatus] = useUpdateIssueStatusMutation();

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

      {/* Task List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-12 text-xs font-mono text-text-muted">
            Loading assigned field work orders...
          </p>
        ) : !tasks || tasks.length === 0 ? (
          <Card className="p-8 text-center text-text-muted">
            No active work orders assigned to your queue today. Great job!
          </Card>
        ) : (
          tasks.map((task: MaintenanceTask) => {
            const issue = task.issue || allIssues.find((i: Issue) => i.id === task.issueId);
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            const mapsUrl = issue
              ? `https://www.google.com/maps/search/?api=1&query=${issue.latitude},${issue.longitude}`
              : '#';

            return (
              <Card
                key={task.id}
                className={`p-6 transition-all border-l-4 ${
                  isCompleted
                    ? 'border-l-emerald-500 opacity-80'
                    : isInProgress
                    ? 'border-l-brand-yellow'
                    : 'border-l-brand-cobalt'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
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
                      <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                        <Navigation size={13} /> Open in Maps <ExternalLink size={11} />
                      </Button>
                    </a>

                    {!isCompleted && !isInProgress && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartTask(task)}
                        className="w-full gap-1.5 text-xs font-bold"
                      >
                        <Play size={13} /> Start Work
                      </Button>
                    )}

                    {!isCompleted && isInProgress && (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setActiveTask(task)}
                        className="w-full gap-1.5 text-xs font-bold shadow-sm"
                      >
                        <CheckCircle2 size={13} /> Complete Repair
                      </Button>
                    )}

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Completion & Proof Photo Upload Modal */}
      <Dialog
        isOpen={!!activeTask}
        onClose={() => setActiveTask(null)}
        title="Complete Field Work Order"
        description="Provide repair notes and attach proof photography before marking resolved."
      >
        {activeTask && (
          <form onSubmit={handleCompleteTask} className="space-y-4">
            <Textarea
              label="Field Repair Execution Notes *"
              placeholder="e.g. Cleared blocked drainage line, replaced 15m underground wiring, tested voltage..."
              value={completionNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompletionNotes(e.target.value)}
              rows={3}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                Repair Completion Proof Photograph (URL) *
              </label>
              <Input
                placeholder="https://... photo url"
                value={completionPhotoUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompletionPhotoUrl(e.target.value)}
                required
              />
              {completionPhotoUrl && (
                <div className="mt-2 h-40 rounded-lg overflow-hidden border border-border">
                  <img
                    src={completionPhotoUrl}
                    alt="Proof preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

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
                variant="primary"
                isLoading={isSubmitting}
                className="font-bold shadow-sm"
              >
                Mark Resolved & Close Work Order
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
