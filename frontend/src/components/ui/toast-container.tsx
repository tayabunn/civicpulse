'use client';

import React from 'react';
import { useNotification, ToastMessage, NotificationType } from '@/context/notification-context';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  info: <Info className="w-5 h-5 text-brand-cobalt shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
};

const BORDER_COLORS: Record<NotificationType, string> = {
  success: 'border-l-4 border-l-emerald-500',
  error: 'border-l-4 border-l-rose-500',
  info: 'border-l-4 border-l-brand-cobalt',
  warning: 'border-l-4 border-l-amber-500',
};

const PROGRESS_COLORS: Record<NotificationType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-brand-cobalt',
  warning: 'bg-amber-500',
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const duration = toast.duration || 4000;

  return (
    <div
      role="alert"
      className={`relative overflow-hidden rounded-xl bg-surface border border-border shadow-xl p-4 flex items-start gap-3 transition-all transform animate-slideUp max-w-sm w-full pointer-events-auto ${BORDER_COLORS[toast.type]}`}
    >
      {ICONS[toast.type]}
      <div className="flex-1 min-w-0 pr-2">
        {toast.title && (
          <h5 className="text-xs font-bold font-display text-text-primary mb-0.5 truncate">
            {toast.title}
          </h5>
        )}
        <p className="text-xs text-text-secondary leading-relaxed break-words">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss toast"
        className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Auto-dismiss progress countdown line */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-secondary overflow-hidden">
          <div
            className={`h-full ${PROGRESS_COLORS[toast.type]} origin-left animate-shrink`}
            style={{
              animationDuration: `${duration}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
            }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
