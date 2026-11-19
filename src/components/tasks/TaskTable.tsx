'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  PlayCircle,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { CategoryBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatRelativeDueDate, formatDate } from '@/lib/dateUtils';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { cn } from '@/lib/utils';

export interface TaskTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
}

export function TaskTable({ tasks, onEdit }: TaskTableProps) {
  const { updateStatus, deleteTask, isDeleting } = useTaskMutations();

  const handleCycleStatus = (task: Task) => {
    const cycleMap: Record<TaskStatus, TaskStatus> = {
      Todo: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Todo',
    };
    updateStatus({ id: task.id, status: cycleMap[task.status] });
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200/80 dark:border-slate-800/80">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 w-12 text-center">
                Status
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[240px]">
                Workout / Habit
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[120px]">
                Category
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[100px]">
                Priority
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[150px]">
                Target Date
              </th>
              <th scope="col" className="py-3.5 px-4 min-w-[130px]">
                Metrics
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right min-w-[110px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {tasks.map((task) => {
              const relative = formatRelativeDueDate(task.dueDate, task.status);

              return (
                <tr
                  key={task.id}
                  className={cn(
                    'group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40',
                    task.status === 'Completed' && 'opacity-80 bg-slate-50/30 dark:bg-slate-900/20'
                  )}
                >
                  {/* Status Toggle Cell */}
                  <td className="py-4 pl-6 pr-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(task)}
                      title={`Status: ${task.status}. Click to cycle.`}
                      className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {task.status === 'Completed' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      )}
                      {task.status === 'In Progress' && (
                        <PlayCircle className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" />
                      )}
                      {task.status === 'Todo' && (
                        <Circle className="w-5 h-5 text-slate-400 group-hover:text-slate-500" />
                      )}
                    </button>
                  </td>

                  {/* Title & Notes Cell */}
                  <td className="py-4 px-4">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors block leading-snug"
                    >
                      <span className={cn(task.status === 'Completed' && 'line-through text-slate-400 dark:text-slate-500')}>
                        {task.title}
                      </span>
                    </Link>
                    {task.description && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <CategoryBadge category={task.category} size="sm" />
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4">
                    <PriorityBadge priority={task.priority} size="sm" />
                  </td>

                  {/* Due Date & Overdue Indicator */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-200">
                        {formatDate(task.dueDate)}
                      </div>
                      <div
                        className={cn(
                          'text-[11px] font-semibold flex items-center gap-1',
                          relative.isOverdue
                            ? 'text-red-500 dark:text-red-400 font-bold'
                            : relative.isToday
                            ? 'text-amber-500 dark:text-amber-400 font-bold'
                            : 'text-slate-400'
                        )}
                      >
                        <Calendar className="w-3 h-3" />
                        {relative.text}
                      </div>
                    </div>
                  </td>

                  {/* Metrics: Duration & Calories */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 text-xs">
                      {task.durationMinutes ? (
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {task.durationMinutes}m
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}

                      {task.targetCalories ? (
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          {task.targetCalories} kcal
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Action Menu */}
                  <td className="py-4 pl-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(task)}
                          aria-label={`Edit ${task.title}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        disabled={isDeleting}
                        aria-label={`Delete ${task.title}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/tasks/${task.id}`}
                        aria-label={`View ${task.title} details`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

