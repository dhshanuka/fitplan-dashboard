'use client';

import React from 'react';
import Link from 'next/link';
import { Task } from '@/types/task';
import { CategoryBadge } from '@/components/ui/Badge';
import { formatRelativeDueDate } from '@/lib/dateUtils';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { CheckCircle2, Circle, ArrowRight, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DueSoonListProps {
  tasks: Task[];
  className?: string;
}

export function DueSoonList({ tasks, className }: DueSoonListProps) {
  const { updateStatus } = useTaskMutations();

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Due Soon & Up Next
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Upcoming workouts requiring your focus
          </p>
        </div>
        <Link
          href="/tasks"
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No upcoming tasks due soon. Good job staying ahead!
          </div>
        ) : (
          tasks.map((task) => {
            const relative = formatRelativeDueDate(task.dueDate, task.status);

            return (
              <div
                key={task.id}
                className="py-3 flex items-center justify-between gap-3 group first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => updateStatus({ id: task.id, status: 'Completed' })}
                    title="Mark as completed"
                    className="p-1 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                  >
                    <Circle className="w-4 h-4 hover:fill-emerald-500/20" />
                  </button>

                  <div className="min-w-0">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors truncate block"
                    >
                      {task.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryBadge category={task.category} size="sm" />
                      <span
                        className={cn(
                          'text-[10px] font-semibold flex items-center gap-0.5',
                          relative.isOverdue
                            ? 'text-red-500 font-bold'
                            : relative.isToday
                            ? 'text-amber-500 font-bold'
                            : 'text-slate-400'
                        )}
                      >
                        <Calendar className="w-2.5 h-2.5" />
                        {relative.text}
                      </span>
                    </div>
                  </div>
                </div>

                {task.durationMinutes ? (
                  <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.durationMinutes}m
                  </span>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

