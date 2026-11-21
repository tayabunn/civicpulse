'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetIssueByIdQuery,
  useSubmitFeedbackMutation,
} from '@/store/apiSlice';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/input';
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
} from 'lucide-react';
import { IssueActivity } from '@/types';

export default function IssueDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: issue, isLoading, refetch } = useGetIssueByIdQuery(id as string);
  const [submitFeedback, { isLoading: isSubmittingFeedback }] = useSubmitFeedbackMutation();

  // Feedback Modal State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedback({
        id: issue.id,
        rating,
        feedback: feedbackText,
      }).unwrap();
      setIsFeedbackOpen(false);
      refetch();
    } catch {
      alert('Failed to submit feedback.');
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top breadcrumb & tracking header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="h-8 w-8 p-0">
            <ChevronLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
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
            <h2 className="text-2xl font-bold font-display text-text-primary mt-1">
              {issue.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`text-sm px-3 py-1 ${getStatusBadgeClass(issue.status)}`}>
            {getStatusLabel(issue.status)}
          </Badge>
          {issue.status === 'resolved' && !issue.citizenRating && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsFeedbackOpen(true)}
              className="gap-1.5 font-bold shadow-sm"
            >
              <Star size={14} /> Rate Resolution
            </Button>
          )}
        </div>
      </div>

      {/* Lifecycle Stepper Bar */}
      <Card className="p-6">
        <div className="flex items-center justify-between relative">
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
                  } ${isCurrent ? 'ring-4 ring-brand-yellow ring-offset-2' : ''}`}
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

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border text-xs">
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

            {/* Evidence Photos */}
            {issue.imageUrl && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Camera size={14} /> Citizen Evidence Photograph
                </span>
                <div className="h-48 rounded-xl overflow-hidden border border-border">
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
                <div className="h-48 rounded-xl overflow-hidden border-2 border-emerald-500">
                  <img
                    src={issue.resolutionImageUrl}
                    alt="Resolution evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
                {issue.resolutionNotes && (
                  <p className="text-xs text-text-muted italic bg-surface-secondary p-2.5 rounded-lg border border-border">
                    " {issue.resolutionNotes} "
                  </p>
                )}
              </div>
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
                      className={i < (issue.citizenRating || 0) ? 'fill-amber-400' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Citizen Rated: {issue.citizenRating}/5 Stars
                </span>
              </div>
              {issue.citizenFeedback && (
                <p className="text-xs text-emerald-900 dark:text-emerald-200 italic">
                  "{issue.citizenFeedback}"
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Right Column (5 cols): Immutable Audit Trail */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Immutable Activity Audit</CardTitle>
              <CardDescription>Verified cryptographic history of transitions</CardDescription>
            </CardHeader>

            <div className="relative pl-6 border-l-2 border-brand-cobalt/30 space-y-6">
              {issue.activities && issue.activities.length > 0 ? (
                issue.activities.map((act: IssueActivity) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-cobalt border-2 border-surface" />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-primary capitalize">
                          {act.action.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">
                          {formatDate(act.createdAt)}
                        </span>
                      </div>
                      {act.notes && (
                        <p className="text-xs text-text-muted mt-1 bg-surface-secondary p-2 rounded border border-border">
                          {act.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted">No activity records yet.</p>
              )}
            </div>
          </Card>
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
