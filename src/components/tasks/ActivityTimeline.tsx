import React from 'react';
import { ActivityLog } from '@/types/task';
import { PlusCircle, RefreshCw, Edit3, RotateCcw, Clock } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

export function ActivityTimeline({ logs = [] }: { logs?: ActivityLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-400">
        No recorded status changes yet.
      </div>
    );
  }

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);
    } catch {
      return ts;
    }
  };

  const getLogIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'CREATED':
        return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case 'STATUS_CHANGED':
        return <RefreshCw className="w-4 h-4 text-amber-500" />;
      case 'RESTORED':
        return <RotateCcw className="w-4 h-4 text-blue-500" />;
      case 'UPDATED':
      default:
        return <Edit3 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {logs.map((log) => (
        <div key={log.id} className="relative group">
          {/* Timeline node icon */}
          <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {getLogIcon(log.type)}
                {log.message}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(log.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

