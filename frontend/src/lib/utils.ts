import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCoords(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return map[status] || status;
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'submitted':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    case 'under_review':
      return 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200 border-amber-200 dark:border-amber-800';
    case 'assigned':
      return 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200 border-blue-200 dark:border-blue-800';
    case 'in_progress':
      return 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200 border-teal-200 dark:border-teal-800';
    case 'resolved':
      return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
    case 'closed':
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
  }
}

export function getPriorityLabel(priority: string): string {
  const map: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return map[priority] || priority;
}

export function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'low':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    case 'medium':
      return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'high':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'critical':
      return 'bg-brand-midnight text-white dark:bg-rose-600 dark:text-white font-semibold border-brand-midnight shadow-sm';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    road_damage: 'Road Damage',
    streetlight: 'Streetlight',
    drainage: 'Drainage & Sewage',
    footpath: 'Footpath & Walkway',
    waste_management: 'Waste Management',
    public_infrastructure: 'Public Infrastructure',
  };
  return map[category] || category.replace('_', ' ');
}

export function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'road_damage':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200';
    case 'streetlight':
      return 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200';
    case 'drainage':
      return 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-200';
    case 'footpath':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200';
    case 'waste_management':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200';
    case 'public_infrastructure':
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200';
  }
}
