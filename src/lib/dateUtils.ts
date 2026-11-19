import { TaskStatus } from '@/types/task';

/**
 * Format YYYY-MM-DD or ISO string into human readable format, e.g. "Nov 19, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format relative date (e.g. "Overdue by 2 days", "Due today", "Due tomorrow", "In 3 days")
 */
export function formatRelativeDueDate(dueDateStr: string, status?: TaskStatus): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dueDateStr) return { text: '', isOverdue: false, isToday: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dueDateStr.includes('T') ? dueDateStr : `${dueDateStr}T00:00:00`);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: 'Due today', isOverdue: false, isToday: true };
  }

  if (diffDays === 1) {
    return { text: 'Due tomorrow', isOverdue: false, isToday: false };
  }

  if (diffDays === -1) {
    const isOver = status !== 'Completed';
    return { text: isOver ? 'Overdue by 1 day' : 'Yesterday', isOverdue: isOver, isToday: false };
  }

  if (diffDays < -1) {
    const daysAgo = Math.abs(diffDays);
    const isOver = status !== 'Completed';
    return {
      text: isOver ? `Overdue by ${daysAgo} days` : `${daysAgo} days ago`,
      isOverdue: isOver,
      isToday: false,
    };
  }

  return {
    text: `Due in ${diffDays} days`,
    isOverdue: false,
    isToday: false,
  };
}

export function isOverdue(dueDateStr: string, status?: TaskStatus): boolean {
  if (!dueDateStr || status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dueDateStr.includes('T') ? dueDateStr : `${dueDateStr}T00:00:00`);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate.getTime() < today.getTime();
}

export function isDueToday(dueDateStr: string): boolean {
  if (!dueDateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dueDateStr.includes('T') ? dueDateStr : `${dueDateStr}T00:00:00`);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate.getTime() === today.getTime();
}

export function isDueWithinDays(dueDateStr: string, days: number): boolean {
  if (!dueDateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dueDateStr.includes('T') ? dueDateStr : `${dueDateStr}T00:00:00`);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}

export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeISODate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

