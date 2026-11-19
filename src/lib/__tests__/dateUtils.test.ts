import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRelativeDueDate,
  isOverdue,
  isDueToday,
  getTodayISODate,
} from '../dateUtils';

describe('Date Utilities', () => {
  it('formats dates consistently', () => {
    expect(formatDate('2026-11-19')).toBe('Nov 19, 2026');
  });

  it('identifies today correctly', () => {
    const today = getTodayISODate();
    expect(isDueToday(today)).toBe(true);
    expect(isOverdue(today, 'Todo')).toBe(false);

    const relative = formatRelativeDueDate(today, 'Todo');
    expect(relative.isToday).toBe(true);
    expect(relative.text).toBe('Due today');
  });

  it('identifies overdue tasks unless completed', () => {
    const pastDate = '2026-11-10';
    expect(isOverdue(pastDate, 'Todo')).toBe(true);
    expect(isOverdue(pastDate, 'In Progress')).toBe(true);
    // If completed, not marked overdue
    expect(isOverdue(pastDate, 'Completed')).toBe(false);

    const relative = formatRelativeDueDate(pastDate, 'Todo');
    expect(relative.isOverdue).toBe(true);
    expect(relative.text).toContain('Overdue by');
  });

  it('identifies tomorrow as due tomorrow', () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const tmrw = now.toISOString().split('T')[0];

    const relative = formatRelativeDueDate(tmrw, 'Todo');
    expect(relative.text).toBe('Due tomorrow');
    expect(relative.isOverdue).toBe(false);
  });
});

