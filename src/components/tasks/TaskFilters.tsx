'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, RotateCcw, Filter, ArrowUpDown, AlertCircle, Clock, Flame } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { TaskFilterParams, QuickFilter, TaskSortBy, SortOrder } from '@/types/api';
import { CATEGORIES, PRIORITIES, STATUSES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface TaskFiltersProps {
  filters: TaskFilterParams;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TaskStatus | 'All') => void;
  onCategoryChange: (category: TaskCategory | 'All') => void;
  onPriorityChange: (priority: TaskPriority | 'All') => void;
  onQuickFilterChange: (quick: QuickFilter) => void;
  onSortChange: (sortBy: TaskSortBy, sortOrder?: SortOrder) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function TaskFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  onQuickFilterChange,
  onSortChange,
  onReset,
  hasActiveFilters,
}: TaskFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchValue, 350);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, filters.search, onSearchChange]);

  // Keep local search input in sync if filters.search is changed externally (e.g. reset)
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  return (
    <div className="space-y-4">
      {/* Top Filter Bar: Search + Sort + Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search workouts, exercises, or habits..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 pl-10 pr-9 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onSearchChange('');
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <select
              value={`${filters.sortBy || 'dueDate'}-${filters.sortOrder || 'asc'}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-') as [TaskSortBy, SortOrder];
                onSortChange(sb, so);
              }}
              aria-label="Sort workouts"
              className="appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 pl-9 pr-8 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="dueDate-asc">Due Date (Earliest first)</option>
              <option value="dueDate-desc">Due Date (Latest first)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="createdAt-desc">Created (Newest first)</option>
              <option value="createdAt-asc">Created (Oldest first)</option>
              <option value="title-asc">Title (A to Z)</option>
              <option value="title-desc">Title (Z to A)</option>
            </select>
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-10 text-xs text-red-500 hover:text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Quick Filters:
        </span>

        <button
          type="button"
          onClick={() => onQuickFilterChange('overdue')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
            filters.quickFilter === 'overdue'
              ? 'bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/50 ring-2 ring-red-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-red-300 dark:hover:border-red-900/40'
          )}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          Overdue
        </button>

        <button
          type="button"
          onClick={() => onQuickFilterChange('dueToday')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
            filters.quickFilter === 'dueToday'
              ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/50 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-amber-300 dark:hover:border-amber-900/40'
          )}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Due Today
        </button>

        <button
          type="button"
          onClick={() => onQuickFilterChange('highPriority')}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
            filters.quickFilter === 'highPriority'
              ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/50 ring-2 ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-rose-900/40'
          )}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          High Priority
        </button>
      </div>

      {/* Category & Status & Priority Pill Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Category */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onCategoryChange(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Status
          </label>
          <select
            value={filters.status || 'All'}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Priority
          </label>
          <select
            value={filters.priority || 'All'}
            onChange={(e) => onPriorityChange(e.target.value as any)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

