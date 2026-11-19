'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, TaskFormData } from '@/lib/validators';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { CATEGORIES, PRIORITIES, STATUSES, CATEGORY_COLORS } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { getTodayISODate } from '@/lib/dateUtils';
import { Flame, Clock, Calendar, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskFormProps {
  initialData?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TaskForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
  submitLabel,
}: TaskFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'Strength',
      priority: initialData?.priority || 'Medium',
      status: initialData?.status || 'Todo',
      dueDate: initialData?.dueDate || getTodayISODate(),
      durationMinutes: initialData?.durationMinutes ?? 45,
      targetCalories: initialData?.targetCalories ?? 300,
    },
  });

  const selectedCategory = watch('category');
  const selectedPriority = watch('priority');
  const selectedStatus = watch('status');
  const descriptionValue = watch('description') || '';

  const onFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5" noValidate>
      {/* Title */}
      <Input
        label="Workout / Habit Title"
        placeholder="e.g. 5km Morning Run, Heavy Squats 5x5..."
        error={errors.title?.message}
        required
        {...register('title')}
      />

      {/* Category selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Fitness Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const colors = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setValue('category', cat, { shouldValidate: true })}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all duration-150',
                  isSelected
                    ? cn(colors.bg, colors.text, 'border-emerald-500 ring-2 ring-emerald-500/30 font-bold scale-[1.02]')
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                )}
              >
                <span
                  className="w-2 h-2 rounded-full mb-1"
                  style={{ backgroundColor: colors.accent }}
                />
                {cat}
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-xs font-medium text-red-500 mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Priority & Status Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Priority */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Priority <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => {
              const isSelected = selectedPriority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setValue('priority', p, { shouldValidate: true })}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-150',
                    isSelected
                      ? p === 'High'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500 ring-2 ring-red-500/30'
                        : p === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500 ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STATUSES.map((s) => {
              const isSelected = selectedStatus === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue('status', s, { shouldValidate: true })}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-150',
                    isSelected
                      ? s === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/30'
                        : s === 'In Progress'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500 ring-2 ring-slate-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Due Date & Duration & Calories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          type="date"
          label="Target Date"
          leftIcon={<Calendar className="w-4 h-4" />}
          error={errors.dueDate?.message}
          required
          {...register('dueDate')}
        />

        <Input
          type="number"
          label="Duration (min)"
          placeholder="45"
          leftIcon={<Clock className="w-4 h-4" />}
          error={errors.durationMinutes?.message}
          {...register('durationMinutes', { valueAsNumber: true })}
        />

        <Input
          type="number"
          label="Target Burn (kcal)"
          placeholder="350"
          leftIcon={<Flame className="w-4 h-4" />}
          error={errors.targetCalories?.message}
          {...register('targetCalories', { valueAsNumber: true })}
        />
      </div>

      {/* Description / Notes */}
      <Textarea
        label="Workout Notes & Routines"
        placeholder="Specific exercises, sets, weights, or nutrition targets..."
        rows={3}
        charCount={{ current: descriptionValue.length, max: 500 }}
        error={errors.description?.message}
        {...register('description')}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading} className="min-w-[130px]">
          {submitLabel || (isEditing ? 'Save Changes' : 'Schedule Workout')}
        </Button>
      </div>
    </form>
  );
}

