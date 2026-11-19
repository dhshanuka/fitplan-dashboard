'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Clock,
  Flame,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  PlayCircle,
  History,
  Info,
} from 'lucide-react';
import { useTask } from '@/hooks/useTask';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { CategoryBadge, PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { ActivityTimeline } from '@/components/tasks/ActivityTimeline';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatRelativeDueDate } from '@/lib/dateUtils';
import { TaskStatus } from '@/types/task';
import { STATUSES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: task, isLoading, isError, error, refetch } = useTask(id);
  const { updateStatus, updateTask, deleteTask, isUpdating, isDeleting } = useTaskMutations();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-14 w-3/4 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-60 rounded-2xl" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState
          title="Workout Not Found"
          message={error?.message || 'The requested workout could not be found or failed to load.'}
          onRetry={() => refetch()}
        />
        <div className="text-center mt-4">
          <Link href="/tasks">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Return to Workouts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relative = formatRelativeDueDate(task.dueDate, task.status);

  const handleDelete = async () => {
    await deleteTask(task.id);
    router.push('/tasks');
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      updateStatus({ id: task.id, status: newStatus });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back to list navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to all workouts
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="gap-1.5 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={task.category} size="md" />
          <PriorityBadge priority={task.priority} size="md" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {task.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Added on {formatDate(task.createdAt)} • Last updated on {formatDate(task.updatedAt)}
          </p>
        </div>

        {/* Quick Status Switcher */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Status
          </label>
          <div className="grid grid-cols-3 gap-2.5 max-w-md">
            {STATUSES.map((s) => {
              const isActive = task.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusChange(s)}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-150',
                    isActive
                      ? s === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/30 font-bold'
                        : s === 'In Progress'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500 ring-2 ring-amber-500/30 font-bold'
                        : 'bg-slate-500/15 text-slate-800 dark:text-slate-200 border-slate-500 ring-2 ring-slate-500/30 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-500 hover:border-slate-300'
                  )}
                >
                  {s === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  {s === 'In Progress' && <PlayCircle className="w-3.5 h-3.5 text-amber-500" />}
                  {s === 'Todo' && <Circle className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Due Date Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Target Date</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatDate(task.dueDate)}</p>
          <p
            className={cn(
              'text-xs font-semibold',
              relative.isOverdue
                ? 'text-red-500 font-bold'
                : relative.isToday
                ? 'text-amber-500 font-bold'
                : 'text-slate-400'
            )}
          >
            {relative.text}
          </p>
        </div>

        {/* Duration Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {task.durationMinutes ? `${task.durationMinutes} Minutes` : 'Not specified'}
          </p>
          <p className="text-xs text-slate-400">Planned workout duration</p>
        </div>

        {/* Target Calories Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Target Burn</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {task.targetCalories ? `${task.targetCalories} kcal` : 'Not specified'}
          </p>
          <p className="text-xs text-slate-400">Estimated energy expenditure</p>
        </div>
      </div>

      {/* Notes / Description */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-500" />
          Workout Notes & Instructions
        </h3>
        {task.description ? (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 font-sans">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">No additional notes provided for this routine.</p>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-500" />
          Activity & Status History
        </h3>
        <ActivityTimeline logs={task.activityTimeline} />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Workout / Habit"
        description="Update your workout parameters, notes, or schedule."
        size="lg"
      >
        <TaskForm
          initialData={task}
          onSubmit={async (formData) => {
            await updateTask({
              id: task.id,
              data: {
                title: formData.title,
                description: formData.description || '',
                category: formData.category,
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate,
                durationMinutes: formData.durationMinutes ?? null,
                targetCalories: formData.targetCalories ?? null,
              },
            });
            setIsEditModalOpen(false);
          }}
          isLoading={isUpdating}
          onCancel={() => setIsEditModalOpen(false)}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  );
}

