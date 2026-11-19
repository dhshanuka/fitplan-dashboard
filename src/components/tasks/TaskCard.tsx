'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  Flame,
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { CategoryBadge, PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { formatRelativeDueDate, formatDate } from '@/lib/dateUtils';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { cn } from '@/lib/utils';

export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  className?: string;
}

export function TaskCard({ task, onEdit, className }: TaskCardProps) {
  const { updateStatus, deleteTask, isDeleting } = useTaskMutations();
  const relative = formatRelativeDueDate(task.dueDate, task.status);

  // Cycle status: Todo -> In Progress -> Completed -> Todo
  const handleCycleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cycleMap: Record<TaskStatus, TaskStatus> = {
      Todo: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Todo',
    };

    updateStatus({ id: task.id, status: cycleMap[task.status] });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(task);
  };

  return (
    <div
      className={cn(
        'group relative rounded-2xl border p-5 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4',
        relative.isOverdue
          ? 'border-red-300 dark:border-red-900/60 bg-red-50/20 dark:bg-red-950/10'
          : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700',
        task.status === 'Completed' && 'opacity-85',
        className
      )}
    >
      {/* Top Header: Categories, Priority, Relative Due Date */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <CategoryBadge category={task.category} size="sm" />
            <PriorityBadge priority={task.priority} size="sm" />
          </div>

          <span
            className={cn(
              'text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1',
              relative.isOverdue
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 font-bold animate-pulse'
                : relative.isToday
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            )}
          >
            <Calendar className="w-3 h-3" />
            {relative.text}
          </span>
        </div>

        {/* Title and Notes */}
        <div>
          <Link
            href={`/tasks/${task.id}`}
            className="group-hover:text-emerald-500 transition-colors inline-block focus:outline-none focus-visible:underline"
          >
            <h4
              className={cn(
                'text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug',
                task.status === 'Completed' && 'line-through text-slate-500 dark:text-slate-400'
              )}
            >
              {task.title}
            </h4>
          </Link>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Metrics & Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Metrics Chips */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {task.durationMinutes ? (
            <span className="flex items-center gap-1" title="Duration">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {task.durationMinutes}m
            </span>
          ) : null}

          {task.targetCalories ? (
            <span className="flex items-center gap-1" title="Target Calorie Burn">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {task.targetCalories} kcal
            </span>
          ) : null}
        </div>

        {/* Status Quick-Cycle Button + Action Menu */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCycleStatus}
            title={`Current: ${task.status}. Click to change.`}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border',
              task.status === 'Completed' &&
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
              task.status === 'In Progress' &&
                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
              task.status === 'Todo' &&
                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            {task.status === 'In Progress' && <PlayCircle className="w-3.5 h-3.5 text-amber-500" />}
            {task.status === 'Todo' && <Circle className="w-3.5 h-3.5 text-slate-400" />}
            <span>{task.status}</span>
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              aria-label="Edit workout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete workout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <Link
            href={`/tasks/${task.id}`}
            aria-label="View workout details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

