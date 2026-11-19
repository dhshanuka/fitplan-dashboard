import { Task, TaskCategory, TaskPriority, TaskStatus } from './task';

export type TaskSortBy = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';
export type QuickFilter = 'all' | 'overdue' | 'dueToday' | 'highPriority';

export interface TaskFilterParams {
  search?: string;
  status?: TaskStatus | 'All';
  category?: TaskCategory | 'All';
  priority?: TaskPriority | 'All';
  quickFilter?: QuickFilter;
  sortBy?: TaskSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface WeeklyConsistencyDay {
  day: string; // e.g. "Mon"
  date: string; // YYYY-MM-DD
  completed: number;
  total: number;
  isToday: boolean;
}

export interface StatusDistributionItem {
  name: TaskStatus;
  value: number;
  color: string;
}

export interface CategoryDistributionItem {
  category: TaskCategory;
  count: number;
  color: string;
}

export interface TrendDayItem {
  date: string;
  day: string;
  completed: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  currentStreakDays: number;
  weeklyConsistency: WeeklyConsistencyDay[];
  statusDistribution: StatusDistributionItem[];
  categoryDistribution: CategoryDistributionItem[];
  completionTrend: TrendDayItem[];
  dueSoon: Task[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

