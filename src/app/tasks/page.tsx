'use client';

import React, { useState, Suspense } from 'react';
import {
  LayoutList,
  LayoutGrid,
  Plus,
  Dumbbell,
  Sparkles,
} from 'lucide-react';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTasks } from '@/hooks/useTasks';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { Task } from '@/types/task';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Pagination } from '@/components/tasks/Pagination';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TableRowSkeleton, TaskCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

function TaskListingContent() {
  const {
    filters,
    setSearch,
    setStatus,
    setCategory,
    setPriority,
    setQuickFilter,
    setSort,
    setPage,
    resetFilters,
    hasActiveFilters,
  } = useTaskFilters();

  const { data, isLoading, isError, error, refetch } = useTasks(filters);
  const { updateTask, isUpdating, createTask, isCreating } = useTaskMutations();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const tasks = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Workouts & Habits
            </h1>
            {pagination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {pagination.totalItems} Total
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your exercise routines, recovery sessions, and daily health targets.
          </p>
        </div>

        {/* View Switcher & Create Action */}
        <div className="flex items-center gap-3">
          {/* Table / Cards Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={cn(
                'p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              aria-label="Cards view"
              className={cn(
                'p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Cards</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Workout
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <TaskFilters
        filters={filters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onPriorityChange={setPriority}
        onQuickFilterChange={setQuickFilter}
        onSortChange={setSort}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Task Listing View */}
      {isLoading ? (
        <div className="space-y-3">
          {viewMode === 'table' ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60">
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load workouts"
          message={error?.message || 'Failed to fetch workouts due to a network error.'}
          onRetry={() => refetch()}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No workouts found"
          description={
            hasActiveFilters
              ? 'No workouts matched your current search filters. Try clearing some filters.'
              : 'You have no workouts or healthy habits scheduled yet.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filters' : 'Add Your First Workout'}
          onAction={hasActiveFilters ? resetFilters : () => setIsCreateOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {/* Responsive rendering: table on desktop when table mode selected, cards on mobile */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-1 gap-3.5">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => setEditingTask(t)}
                />
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            {viewMode === 'table' ? (
              <TaskTable
                tasks={tasks}
                onEdit={(t) => setEditingTask(t)}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => setEditingTask(t)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.limit}
              onPageChange={setPage}
            />
          )}
        </div>
      )}

      {/* Edit Workout Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Workout / Habit"
        description="Update your workout parameters, notes, or schedule."
        size="lg"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={async (data) => {
              await updateTask({
                id: editingTask.id,
                data: {
                  title: data.title,
                  description: data.description || '',
                  category: data.category,
                  priority: data.priority,
                  status: data.status,
                  dueDate: data.dueDate,
                  durationMinutes: data.durationMinutes ?? null,
                  targetCalories: data.targetCalories ?? null,
                },
              });
              setEditingTask(null);
            }}
            isLoading={isUpdating}
            onCancel={() => setEditingTask(null)}
            submitLabel="Update Workout"
          />
        )}
      </Modal>

      {/* Create Workout Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Schedule New Workout"
        description="Add a new workout or wellness habit to your training schedule."
        size="lg"
      >
        <TaskForm
          onSubmit={async (data) => {
            await createTask({
              title: data.title,
              description: data.description || '',
              category: data.category,
              priority: data.priority,
              status: data.status,
              dueDate: data.dueDate,
              durationMinutes: data.durationMinutes ?? null,
              targetCalories: data.targetCalories ?? null,
            });
            setIsCreateOpen(false);
          }}
          isLoading={isCreating}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      }
    >
      <TaskListingContent />
    </Suspense>
  );
}

