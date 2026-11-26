'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  useGetIssueByIdQuery,
  useSubmitFeedbackMutation,
  useUpdateIssueStatusMutation,
  useUpvoteIssueMutation,
} from '@/store/apiSlice';
import { BeforeAfterSlider } from '@/components/issues/before-after-slider';
import { useNotification } from '@/context/notification-context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Textarea, Select } from '@/components/ui/input';
import {
  getStatusBadgeClass,
  getStatusLabel,
  getPriorityBadgeClass,
  getPriorityLabel,
  getCategoryBadgeClass,
  getCategoryLabel,
  formatDate,
  formatCoords,
} from '@/lib/utils';
import {
  MapPin,
  CheckCircle2,
  Star,
  ChevronLeft,
  Camera,
  Clock,
  User,
  ArrowRight,
  ShieldAlert,
  Send,
  SlidersHorizontal,
  Printer,
  FileText,
} from 'lucide-react';
import { IssueActivity, IssuePriority, IssueStatus } from '@/types';

export default function IssueDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.ui.theme);
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    if (
      user &&
      user.role !== 'citizen' &&
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/citizen/issues/')
    ) {
      router.replace(`/issues/${id}`);
    }
  }, [user, id, router]);

  const { data: issue, isLoading, refetch } = useGetIssueByIdQuery(id as string);
  const [submitFeedback, { isLoading: isSubmittingFeedback }] = useSubmitFeedbackMutation();
  const [updateIssueStatus, { isLoading: isUpdatingStatus }] = useUpdateIssueStatusMutation();
  const [upvoteIssue, { isLoading: isUpvoting }] = useUpvoteIssueMutation();
  const [hasUpvoted, setHasUpvoted] = useState(false);

  // Feedback Modal State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // Triage state for Manager / Admin
  const [newStatus, setNewStatus] = useState<string>('');
  const [newPriority, setNewPriority] = useState<string>('');
  const [triageNotes, setTriageNotes] = useState<string>('');

  if (isLoading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-text-muted">
        Loading issue lifecycle history...
      </div>
    );
  }

  if (!issue) {
    return (
      <Card className="p-8 text-center text-text-muted">
        <p>Issue not found or database record unavailable.</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  const isStaffOrManager =
    user?.role === 'manager' || user?.role === 'admin' || user?.role === 'staff';

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedback({
        id: issue.id,
        rating,
        feedback: feedbackText,
      }).unwrap();
      notifySuccess('Thank you for rating this resolution!', 'Feedback Recorded');
      setIsFeedbackOpen(false);
      refetch();
    } catch {
      notifyError('Failed to record feedback. Please try again.', 'Error');
    }
  };

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus && !newPriority && !triageNotes) return;

    try {
      await updateIssueStatus({
        id: issue.id,
        status: newStatus || undefined,
        priority: newPriority || undefined,
        notes: triageNotes || undefined,
        userId: user?.id,
      }).unwrap();

      notifySuccess('Work order status updated successfully!', 'Triage Updated');
      setNewStatus('');
      setNewPriority('');
      setTriageNotes('');
      refetch();
    } catch (err: any) {
      notifyError(err?.data?.error || 'Failed to update work order.', 'Triage Error');
    }
  };

  const steps = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === issue.status);

  return (
    <div className="w-full space-y-6 transition-all duration-300">
      {/* Official Municipal Printable Header (PDF & Print View) */}
      <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-slate-600 block">
              GovTech Smart City Infrastructure Management
            </span>
            <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-black mt-0.5">
              Municipal Work Order & Incident Report
            </h1>
            <p className="text-xs font-mono text-slate-700 mt-0.5">
              Dhaka City Corporation • Central Dispatch & Triage Registry
            </p>
          </div>
          <div className="text-right font-mono text-xs space-y-0.5">
            <p className="font-bold text-sm text-black">{issue.trackingCode}</p>
            <p className="text-slate-600">Printed: {new Date().toLocaleDateString()}</p>
            <p className="text-slate-600">
              Status: {(getStatusLabel(issue.status) || issue.status || 'SUBMITTED').toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Top breadcrumb & tracking header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 !mt-0">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0 print:hidden"
          >
            <ChevronLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-brand-cobalt">
                {issue.trackingCode}
              </span>
              <Badge className={getPriorityBadgeClass(issue.priority)}>
                {getPriorityLabel(issue.priority)}
              </Badge>
              <Badge className={getCategoryBadgeClass(issue.category)}>
                {getCategoryLabel(issue.category)}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary mt-1">
              {issue.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={`text-sm px-3 py-1 ${getStatusBadgeClass(issue.status)}`}>
            {getStatusLabel(issue.status)}
          </Badge>

          {/* Community Confirmation (+1 Support) */}
          <Button
            type="button"
            variant={hasUpvoted ? 'primary' : 'outline'}
            size="sm"
            disabled={isUpvoting || hasUpvoted}
            onClick={async () => {
              try {
                await upvoteIssue(issue.id).unwrap();
              } catch {}
              setHasUpvoted(true);
              notifySuccess('Your confirmation was added to prioritize this repair.', 'Confirmed');
            }}
            className="gap-1.5 font-semibold text-xs h-8 print:hidden"
          >
            <CheckCircle2 size={13} />
            {hasUpvoted ? 'Confirmed (+1)' : 'I See This Too (+1)'}
          </Button>

          {/* Bonus Challenge 7: PDF Issue Report Print Trigger */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 font-bold text-xs h-8 print:hidden"
            title="Download or Print official PDF Report"
          >
            <Printer size={13} /> Export PDF Report
          </Button>

          {issue.status === 'resolved' && !issue.citizenRating && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsFeedbackOpen(true)}
              className="gap-1.5 font-bold shadow-sm print:hidden"
            >
              <Star size={14} /> Rate Resolution
            </Button>
          )}
        </div>
      </div>

      {/* Lifecycle Stepper Bar */}
      <Card className="p-4 sm:p-6 overflow-x-auto">
        <div className="flex items-center justify-between relative min-w-[450px]">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-secondary -translate-y-1/2 z-0" />
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-brand-cobalt text-white shadow-md'
                      : 'bg-surface-secondary text-text-muted border border-border'
                  }`}
                  style={
                    isCurrent
                      ? {
                          boxShadow:
                            theme === 'dark'
                              ? '0 0 0 2px #141B29, 0 0 0 6px #e2fa6b'
                              : '0 0 0 2px #FFFFFF, 0 0 0 6px #202B45',
                        }
                      : undefined
                  }
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent ? 'font-bold text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Details Grid: Left info & Photos / Right Audit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Issue Description, Coordinates & Resolution Proof */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <CardHeader className="p-0">
              <CardTitle>Incident Information</CardTitle>
            </CardHeader>

            <p className="text-sm text-text-primary leading-relaxed">{issue.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border text-xs">
              <div>
                <span className="text-text-muted block">Location / Address:</span>
                <span className="font-semibold text-text-primary">{issue.address}</span>
              </div>
              <div>
                <span className="text-text-muted block">GPS Coordinates:</span>
                <span className="font-mono text-brand-cobalt">
                  {formatCoords(issue.latitude, issue.longitude)}
                </span>
              </div>
            </div>

            {/* Interactive Before vs After Comparison Slider when both photos exist */}
            {issue.imageUrl && issue.resolutionImageUrl ? (
              <div className="pt-3 border-t border-border space-y-3">
                <span className="text-xs font-semibold text-[#315CFF] dark:text-[#6280FF] flex items-center gap-1.5">
                  <SlidersHorizontal size={14} /> Before &amp; After Repair Comparison
                </span>
                <BeforeAfterSlider
                  beforeUrl={issue.imageUrl}
                  afterUrl={issue.resolutionImageUrl}
                />
                {issue.resolutionNotes && (
                  <p className="text-xs text-text-muted italic bg-surface-secondary p-2.5 rounded-lg border border-border">
                    &ldquo;{issue.resolutionNotes}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Evidence Photos */}
                {issue.imageUrl && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                      <Camera size={14} /> Citizen Evidence Photograph
                    </span>
                    <div className="h-48 sm:h-64 rounded-xl overflow-hidden border border-border">
                      <img
                        src={issue.imageUrl}
                        alt="Citizen evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Repair Completion Proof (Field Staff Upload) */}
                {issue.resolutionImageUrl && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Field Crew Repair Proof Photograph
                    </span>
                    <div className="h-48 sm:h-64 rounded-xl overflow-hidden border-2 border-emerald-500">
                      <img
                        src={issue.resolutionImageUrl}
                        alt="Resolution evidence"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {issue.resolutionNotes && (
                      <p className="text-xs text-text-muted italic bg-surface-secondary p-2.5 rounded-lg border border-border">
                        &ldquo;{issue.resolutionNotes}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Citizen Feedback Showcase (if rated) */}
          {issue.citizenRating && (
            <Card className="p-5 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < (issue.citizenRating || 0) ? 'fill-amber-400' : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Citizen Rated: {issue.citizenRating}/5 Stars
                </span>
              </div>
              {issue.citizenFeedback && (
                <p className="text-xs text-emerald-900 dark:text-emerald-200 italic">
                  &ldquo;{issue.citizenFeedback}&rdquo;
                </p>
              )}
            </Card>
          )}

          {/* Manager & Staff Quick Triage Action Panel */}
          {isStaffOrManager && (
            <Card className="p-6 border-brand-cobalt/30 bg-surface print:hidden">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-5 h-5 text-brand-cobalt" />
                <h3 className="text-base font-bold font-display text-text-primary">
                  Triage & Dispatch Actions
                </h3>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Update work order lifecycle, escalate severity level, or record internal maintenance notes.
              </p>

              <form onSubmit={handleTriageSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Transition Status"
                    value={newStatus}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStatus(e.target.value)}
                    options={[
                      { label: `Keep current (${getStatusLabel(issue.status)})`, value: '' },
                      { label: 'Under Review', value: 'under_review' },
                      { label: 'Assigned', value: 'assigned' },
                      { label: 'In Progress', value: 'in_progress' },
                      { label: 'Resolved', value: 'resolved' },
                      { label: 'Closed', value: 'closed' },
                    ]}
                  />

                  <Select
                    label="Adjust Priority"
                    value={newPriority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewPriority(e.target.value)}
                    options={[
                      { label: `Keep current (${getPriorityLabel(issue.priority)})`, value: '' },
                      { label: 'Critical', value: 'critical' },
                      { label: 'High', value: 'high' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'Low', value: 'low' },
                    ]}
                  />
                </div>

                <Textarea
                  label="Dispatch / Resolution Notes"
                  placeholder="e.g. Dispatched asphalt patching crew #2 to site..."
                  value={triageNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTriageNotes(e.target.value)}
                  rows={2}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUpdatingStatus}
                  className="gap-1.5 font-bold"
                >
                  <Send size={13} /> Update Work Order
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Right Column (5 cols): Activity History Audit Trail */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Verified chronological audit trail</CardDescription>
            </CardHeader>

            <div className="relative pl-6 border-l-2 border-brand-cobalt/30 space-y-6">
              {issue.activities && issue.activities.length > 0 ? (
                issue.activities.map((act: IssueActivity) => (
                  <div key={act.id} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-cobalt border-2 border-surface group-hover:scale-125 transition-transform" />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-xs font-bold text-text-primary capitalize">
                          {act.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                          <Clock size={10} /> {formatDate(act.createdAt)}
                        </span>
                      </div>

                      {/* Actor Information */}
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <User size={11} className="text-brand-cobalt" />
                        <span className="font-medium text-text-primary">
                          {act.userName || 'System Auto-Dispatcher'}
                        </span>
                        {act.userRole && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-mono bg-surface-secondary border border-border">
                            {act.userRole}
                          </span>
                        )}
                      </div>

                      {/* Status Transition Pills */}
                      {(act.previousStatus || act.fromStatus) && (act.newStatus || act.toStatus) && (
                        <div className="flex items-center gap-1 text-[11px] pt-1">
                          <span className="font-mono text-text-muted line-through">
                            {getStatusLabel((act.previousStatus || act.fromStatus) as any)}
                          </span>
                          <ArrowRight size={10} className="text-brand-cobalt" />
                          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {getStatusLabel((act.newStatus || act.toStatus) as any)}
                          </span>
                        </div>
                      )}

                      {/* Triage / Activity Notes */}
                      {act.notes && (
                        <p className="text-xs text-text-muted mt-1.5 bg-surface-secondary p-2.5 rounded-lg border border-border leading-relaxed">
                          {act.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted">No activity records logged yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Official Municipal PDF Report Sign-Off Footer */}
      <div className="hidden print:block pt-8 mt-8 border-t-2 border-black text-xs font-mono">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="font-bold uppercase">Municipal Verification Certification</p>
            <p className="text-slate-600">Issued by CivicPulse GovTech Smart City Platform</p>
            <p className="text-slate-600">
              Department: {issue.department?.name || issue.departmentName || 'Central Municipal Dispatch'}
            </p>
          </div>
          <div className="text-center space-y-1">
            <div className="w-48 border-b border-black mb-1" />
            <p className="font-bold">Authorized Dispatch Officer</p>
            <p className="text-[10px] text-slate-500">Dhaka City Corporation</p>
          </div>
        </div>
      </div>

      {/* Citizen 5-Star Feedback Modal */}
      <Dialog
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        title="Rate Repair Resolution"
        description="Your feedback helps optimize department SLA and crew evaluations."
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-2">
              Satisfaction Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-125"
                >
                  <Star
                    className={
                      star <= rating
                        ? 'fill-brand-yellow text-brand-yellow'
                        : 'text-text-muted hover:text-brand-yellow'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Comments / Feedback"
            placeholder="Was the pothole sealed cleanly? Did the street light work properly tonight?"
            value={feedbackText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackText(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFeedbackOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              isLoading={isSubmittingFeedback}
              className="font-bold shadow-sm"
            >
              Submit Rating
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
