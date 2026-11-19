import { describe, it, expect } from 'vitest';
import { taskFormSchema } from '../validators';

describe('Task Form Zod Validator', () => {
  const validData = {
    title: '5km Morning Run',
    description: 'Interval running with 90s jog rests',
    category: 'Cardio' as const,
    priority: 'High' as const,
    status: 'Todo' as const,
    dueDate: '2026-11-20',
    durationMinutes: 45,
    targetCalories: 350,
  };

  it('passes validation for valid task input', () => {
    const result = taskFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects titles shorter than 3 characters', () => {
    const result = taskFormSchema.safeParse({ ...validData, title: 'Hi' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 3 characters');
    }
  });

  it('rejects titles exceeding 100 characters', () => {
    const longTitle = 'A'.repeat(101);
    const result = taskFormSchema.safeParse({ ...validData, title: longTitle });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('cannot exceed 100 characters');
    }
  });

  it('rejects invalid due date formats', () => {
    const result = taskFormSchema.safeParse({ ...validData, dueDate: '20-11-2026' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('YYYY-MM-DD');
    }
  });

  it('rejects duration minutes less than 1 or exceeding 480', () => {
    const zeroResult = taskFormSchema.safeParse({ ...validData, durationMinutes: 0 });
    expect(zeroResult.success).toBe(false);

    const excessiveResult = taskFormSchema.safeParse({ ...validData, durationMinutes: 500 });
    expect(excessiveResult.success).toBe(false);
  });

  it('rejects negative target calories', () => {
    const result = taskFormSchema.safeParse({ ...validData, targetCalories: -50 });
    expect(result.success).toBe(false);
  });

  it('allows optional description to be empty or omitted', () => {
    const result = taskFormSchema.safeParse({ ...validData, description: '' });
    expect(result.success).toBe(true);
  });
});

