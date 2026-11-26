'use client';

import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { IssuePriority, IssueStatus } from '@/types';

interface IssueProgressStepperProps {
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
}

const STEPS = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Review' },
  { key: 'in_progress', label: 'Crew Dispatched' },
  { key: 'resolved', label: 'Resolved' },
];

function getStepIndex(status: IssueStatus): number {
  switch (status) {
    case 'submitted':
      return 0;
    case 'under_review':
      return 1;
    case 'assigned':
    case 'in_progress':
      return 2;
    case 'resolved':
    case 'closed':
      return 3;
    default:
      return 0;
  }
}

function getSlaTargetHours(priority: IssuePriority): number {
  switch (priority) {
    case 'critical':
      return 12;
    case 'high':
      return 24;
    case 'medium':
      return 48;
    case 'low':
    default:
      return 96;
  }
}

export function IssueProgressStepper({
  status,
  priority,
  createdAt,
}: IssueProgressStepperProps) {
  const activeIdx = getStepIndex(status);
  const isCompletedAll = status === 'resolved' || status === 'closed';

  // Calculate SLA Countdown
  const targetHours = getSlaTargetHours(priority);
  const createdMs = new Date(createdAt).getTime();
  const dueMs = createdMs + targetHours * 60 * 60 * 1000;
  const remainingHours = Math.round((dueMs - Date.now()) / (1000 * 60 * 60));

  return (
    <div className="pt-3 mt-3 border-t border-[#E2E5ED] dark:border-[#232F46] space-y-2.5">
      {/* 4-Step Solid Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5">
        {STEPS.map((step, idx) => {
          const isDone = activeIdx > idx || isCompletedAll;
          const isCurrent = activeIdx === idx && !isCompletedAll;

          return (
            <div key={step.key} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  isDone
                    ? 'bg-[#315CFF]'
                    : isCurrent
                    ? 'bg-[#e2fa6b]'
                    : 'bg-[#E2E5ED] dark:bg-[#232F46]'
                }`}
              />
              <p
                className={`text-xs font-semibold truncate ${
                  isDone
                    ? 'text-[#315CFF] dark:text-[#6280FF]'
                    : isCurrent
                    ? 'text-[#202B45] dark:text-[#e2fa6b]'
                    : 'text-[#606B7D] dark:text-slate-500'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* SLA Countdown Pill */}
      <div className="flex items-center justify-between text-xs">
        {isCompletedAll ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            Resolution verified
          </span>
        ) : remainingHours > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-[#606B7D] dark:text-slate-400">
            <Clock size={13} className="text-[#315CFF] dark:text-[#6280FF]" />
            Est. SLA resolution in <strong className="text-[#202B45] dark:text-white">{remainingHours}h</strong>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
            <Clock size={13} />
            Escalated for priority review
          </span>
        )}
      </div>
    </div>
  );
}
