import { describe, it, expect } from 'vitest';
import { parseQuickAdd } from '../nlParser';
import { getTodayISODate } from '../dateUtils';

describe('Natural Language Quick-Add Parser', () => {
  it('parses title, category hashtag, priority and relative date correctly', () => {
    const parsed = parseQuickAdd('Run 5km tomorrow high #cardio');
    expect(parsed.title).toBe('Run 5km');
    expect(parsed.category).toBe('Cardio');
    expect(parsed.priority).toBe('High');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    expect(parsed.dueDate).toBe(tomorrowStr);
  });

  it('parses exclamation mark priority and category', () => {
    const parsed = parseQuickAdd('Meal prep sunday !high #nutrition');
    expect(parsed.title).toBe('Meal prep');
    expect(parsed.category).toBe('Nutrition');
    expect(parsed.priority).toBe('High');
  });

  it('parses keyword-based category fallback when hashtag is omitted', () => {
    const parsed = parseQuickAdd('Heavy barbell squats today low');
    expect(parsed.title).toBe('Heavy barbell squats');
    expect(parsed.category).toBe('Strength');
    expect(parsed.priority).toBe('Low');
    expect(parsed.dueDate).toBe(getTodayISODate());
  });

  it('parses yoga routines with relative days', () => {
    const parsed = parseQuickAdd('Vinyasa flow next week #yoga');
    expect(parsed.title).toBe('Vinyasa flow');
    expect(parsed.category).toBe('Yoga');
    expect(parsed.priority).toBe('Medium');

    const nextWk = new Date();
    nextWk.setDate(nextWk.getDate() + 7);
    expect(parsed.dueDate).toBe(nextWk.toISOString().split('T')[0]);
  });

  it('handles empty or whitespace input safely', () => {
    const parsed = parseQuickAdd('   ');
    expect(parsed.title).toBe('New Workout');
    expect(parsed.category).toBe('Other');
    expect(parsed.priority).toBe('Medium');
    expect(parsed.dueDate).toBe(getTodayISODate());
  });
});

