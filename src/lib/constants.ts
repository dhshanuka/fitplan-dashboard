import { TaskCategory, TaskPriority, TaskStatus } from '@/types/task';

export const CATEGORIES: TaskCategory[] = [
  'Strength',
  'Cardio',
  'Yoga',
  'Nutrition',
  'Recovery',
  'Other',
];

export const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];

export const STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Completed'];

export const CATEGORY_COLORS: Record<TaskCategory, { bg: string; text: string; border: string; accent: string }> = {
  Strength: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/30',
    accent: '#f59e0b',
  },
  Cardio: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-500/30',
    accent: '#f43f5e',
  },
  Yoga: {
    bg: 'bg-violet-500/10 dark:bg-violet-500/20',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-500/30',
    accent: '#8b5cf6',
  },
  Nutrition: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    accent: '#10b981',
  },
  Recovery: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    text: 'text-cyan-700 dark:text-cyan-400',
    border: 'border-cyan-500/30',
    accent: '#06b6d4',
  },
  Other: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-500/30',
    accent: '#64748b',
  },
};

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string; dot: string }> = {
  Low: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  Medium: {
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    dot: 'bg-yellow-500',
  },
  High: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string; chart: string }> = {
  Todo: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
    chart: '#94a3b8',
  },
  'In Progress': {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    chart: '#f59e0b',
  },
  Completed: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    chart: '#10b981',
  },
};

export const DEFAULT_PAGE_SIZE = 8;
export const DEFAULT_MOCK_FAILURE_RATE = 0.1; // 10%

