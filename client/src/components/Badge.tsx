import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = (val: string) => {
    switch (val?.toUpperCase()) {
      case 'COMPLETED':
      case 'REVIEWED':
      case 'PRODUCTION':
      case 'ACTIVE':
      case 'SUCCESS':
      case 'READY':
      case 'HIGH CONFIDENCE':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80';
      case 'PROCESSING':
      case 'VALIDATION':
      case 'GENERATING':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/80';
      case 'PENDING':
      case 'QUEUED':
      case 'WARNING':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80';
      case 'REQUIRES_FURTHER_REVIEW':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/80';
      case 'EXPERIMENTAL':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/80';
      case 'FAILED':
      case 'FAILURE':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80';
      case 'ARCHIVED':
      case 'INACTIVE':
        return 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const formattedText = status?.replace(/_/g, ' ') || 'UNKNOWN';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${getBadgeStyle(
        status
      )} ${className}`}
    >
      {formattedText}
    </span>
  );
};
