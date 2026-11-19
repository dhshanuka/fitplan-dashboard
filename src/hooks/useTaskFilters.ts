'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { TaskFilterParams, QuickFilter, TaskSortBy, SortOrder } from '@/types/api';
import { TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

export function useTaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current state from URL search params
  const filters: TaskFilterParams = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      status: (searchParams.get('status') as TaskStatus | 'All') || 'All',
      category: (searchParams.get('category') as TaskCategory | 'All') || 'All',
      priority: (searchParams.get('priority') as TaskPriority | 'All') || 'All',
      quickFilter: (searchParams.get('quickFilter') as QuickFilter) || 'all',
      sortBy: (searchParams.get('sortBy') as TaskSortBy) || 'dueDate',
      sortOrder: (searchParams.get('sortOrder') as SortOrder) || 'asc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : DEFAULT_PAGE_SIZE,
    };
  }, [searchParams]);

  // Push new params to URL
  const updateUrl = useCallback(
    (newParams: Record<string, string | number | undefined | null>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '' || val === 'All' || val === 'all') {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      const queryString = current.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateUrl({ search: search || undefined, page: 1 });
    },
    [updateUrl]
  );

  const setStatus = useCallback(
    (status: TaskStatus | 'All') => {
      updateUrl({ status, page: 1 });
    },
    [updateUrl]
  );

  const setCategory = useCallback(
    (category: TaskCategory | 'All') => {
      updateUrl({ category, page: 1 });
    },
    [updateUrl]
  );

  const setPriority = useCallback(
    (priority: TaskPriority | 'All') => {
      updateUrl({ priority, page: 1 });
    },
    [updateUrl]
  );

  const setQuickFilter = useCallback(
    (quickFilter: QuickFilter) => {
      // Toggle if already selected
      const next = filters.quickFilter === quickFilter ? 'all' : quickFilter;
      updateUrl({ quickFilter: next, page: 1 });
    },
    [filters.quickFilter, updateUrl]
  );

  const setSort = useCallback(
    (sortBy: TaskSortBy, sortOrder?: SortOrder) => {
      const currentOrder = filters.sortOrder || 'asc';
      const nextOrder = sortOrder || (filters.sortBy === sortBy ? (currentOrder === 'asc' ? 'desc' : 'asc') : 'asc');
      updateUrl({ sortBy, sortOrder: nextOrder, page: 1 });
    },
    [filters.sortBy, filters.sortOrder, updateUrl]
  );

  const setPage = useCallback(
    (page: number) => {
      updateUrl({ page });
    },
    [updateUrl]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.status && filters.status !== 'All') ||
      (filters.category && filters.category !== 'All') ||
      (filters.priority && filters.priority !== 'All') ||
      (filters.quickFilter && filters.quickFilter !== 'all')
  );

  return {
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
  };
}

