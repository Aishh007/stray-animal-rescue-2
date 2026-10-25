import { CaseStatus, PriorityLevel } from '../types';

export function formatTimeAgo(timestamp: number): string {
  const diffMs = Math.max(0, Date.now() - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return 'Just now';
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  if (diffHr < 24) {
    const remainingMins = diffMin % 60;
    return remainingMins > 0 ? `${diffHr}h ${remainingMins}m ago` : `${diffHr}h ago`;
  }
  if (diffDay === 1) {
    return 'Yesterday';
  }
  return `${diffDay}d ago`;
}

export function formatExactDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

export function getPriorityMeta(priority: PriorityLevel): {
  label: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  score: number;
} {
  switch (priority) {
    case 'Critical':
      return {
        label: 'Critical',
        badgeClass: 'text-red-700 bg-red-50 border-red-200',
        borderClass: 'border-red-200',
        bgLightClass: 'bg-red-50/40',
        score: 4,
      };
    case 'High':
      return {
        label: 'High',
        badgeClass: 'text-amber-800 bg-amber-50 border-amber-200',
        borderClass: 'border-amber-200',
        bgLightClass: 'bg-amber-50/40',
        score: 3,
      };
    case 'Medium':
      return {
        label: 'Medium',
        badgeClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        borderClass: 'border-emerald-200',
        bgLightClass: 'bg-emerald-50/40',
        score: 2,
      };
    case 'Low':
      return {
        label: 'Low',
        badgeClass: 'text-slate-700 bg-slate-50 border-slate-200',
        borderClass: 'border-slate-200',
        bgLightClass: 'bg-slate-50/40',
        score: 1,
      };
  }
}

export function getStatusMeta(status: CaseStatus): {
  label: string;
  colorClass: string;
  bgClass: string;
} {
  switch (status) {
    case 'Pending':
      return {
        label: 'Pending Assignment',
        colorClass: 'text-amber-700',
        bgClass: 'bg-amber-50 border-amber-200',
      };
    case 'Assigned':
      return {
        label: 'Assigned',
        colorClass: 'text-blue-700',
        bgClass: 'bg-blue-50 border-blue-200',
      };
    case 'In Progress':
      return {
        label: 'Rescue in Progress',
        colorClass: 'text-purple-700',
        bgClass: 'bg-purple-50 border-purple-200',
      };
    case 'Resolved':
      return {
        label: 'Resolved',
        colorClass: 'text-emerald-700',
        bgClass: 'bg-emerald-50 border-emerald-200',
      };
  }
}
