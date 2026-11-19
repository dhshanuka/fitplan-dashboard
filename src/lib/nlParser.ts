import { TaskCategory, TaskPriority } from '@/types/task';
import { getTodayISODate } from './dateUtils';

export interface ParsedTask {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  raw: string;
}

const CATEGORY_MAP: Record<string, TaskCategory> = {
  cardio: 'Cardio',
  run: 'Cardio',
  running: 'Cardio',
  sprint: 'Cardio',
  cycling: 'Cardio',
  bike: 'Cardio',
  swim: 'Cardio',
  swimming: 'Cardio',
  hiit: 'Cardio',

  strength: 'Strength',
  squat: 'Strength',
  bench: 'Strength',
  deadlift: 'Strength',
  lift: 'Strength',
  lifting: 'Strength',
  gym: 'Strength',
  weights: 'Strength',
  dumbbell: 'Strength',
  barbell: 'Strength',
  pullup: 'Strength',
  pushup: 'Strength',

  yoga: 'Yoga',
  vinyasa: 'Yoga',
  stretch: 'Yoga',
  stretching: 'Yoga',
  pilates: 'Yoga',
  flexibility: 'Yoga',

  nutrition: 'Nutrition',
  meal: 'Nutrition',
  food: 'Nutrition',
  protein: 'Nutrition',
  water: 'Nutrition',
  hydrate: 'Nutrition',
  macro: 'Nutrition',
  calories: 'Nutrition',

  recovery: 'Recovery',
  sauna: 'Recovery',
  sleep: 'Recovery',
  massage: 'Recovery',
  foam: 'Recovery',
  rest: 'Recovery',

  other: 'Other',
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getNextDayOfWeek(dayIndex: number): string {
  const now = new Date();
  const currentDay = now.getDay();
  let daysUntil = dayIndex - currentDay;
  if (daysUntil <= 0) {
    daysUntil += 7;
  }
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntil);
  return target.toISOString().split('T')[0];
}

export function parseQuickAdd(input: string): ParsedTask {
  if (!input || !input.trim()) {
    return {
      title: 'New Workout',
      category: 'Other',
      priority: 'Medium',
      dueDate: getTodayISODate(),
      raw: '',
    };
  }

  const raw = input.trim();
  let workingText = raw;

  // 1. Parse Category from hashtag (#cardio, #strength, etc.)
  let category: TaskCategory = 'Other';
  const hashtagMatch = workingText.match(/#([a-zA-Z0-9_-]+)/i);

  if (hashtagMatch) {
    const tag = hashtagMatch[1].toLowerCase();
    const mapped = CATEGORY_MAP[tag];
    if (mapped) {
      category = mapped;
    } else {
      const match = (['Strength', 'Cardio', 'Yoga', 'Nutrition', 'Recovery', 'Other'] as TaskCategory[]).find(
        (c) => c.toLowerCase() === tag
      );
      if (match) category = match;
    }
    // Remove hashtag from working text
    workingText = workingText.replace(hashtagMatch[0], ' ');
  }

  // 2. Parse Priority (!high, high, urgent, p1, !medium, medium, !low, low)
  let priority: TaskPriority = 'Medium';
  const priorityMatch = workingText.match(/(?:^|\s)(!high|\bhigh\b|\burgent\b|\bp1\b|!medium|\bmedium\b|\bmed\b|\bp2\b|!low|\blow\b|\bp3\b)(?:\s|$)/i);

  if (priorityMatch) {
    const token = priorityMatch[1].trim();
    const pStr = token.toLowerCase().replace('!', '');
    if (['high', 'urgent', 'p1'].includes(pStr)) {
      priority = 'High';
    } else if (['low', 'p3'].includes(pStr)) {
      priority = 'Low';
    } else {
      priority = 'Medium';
    }
    workingText = workingText.replace(priorityMatch[0], ' ');
  }

  // 3. Parse Due Date
  let dueDate = getTodayISODate();
  const dateRegex = /\b(today|tonight|tomorrow|tmrw|next week|next monday|next tuesday|next wednesday|next thursday|next friday|next saturday|next sunday|on monday|on tuesday|on wednesday|on thursday|on friday|on saturday|on sunday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  const dateMatch = workingText.match(dateRegex);

  if (dateMatch) {
    const dStr = dateMatch[1].toLowerCase().replace(/^on\s+/, '').replace(/^next\s+/, '');
    const now = new Date();

    if (dStr === 'today' || dStr === 'tonight') {
      dueDate = getTodayISODate();
    } else if (dStr === 'tomorrow' || dStr === 'tmrw') {
      const tmrw = new Date(now);
      tmrw.setDate(now.getDate() + 1);
      dueDate = tmrw.toISOString().split('T')[0];
    } else if (dateMatch[1].toLowerCase() === 'next week') {
      const nextWk = new Date(now);
      nextWk.setDate(now.getDate() + 7);
      dueDate = nextWk.toISOString().split('T')[0];
    } else {
      const dayIdx = DAY_NAMES.indexOf(dStr);
      if (dayIdx !== -1) {
        dueDate = getNextDayOfWeek(dayIdx);
      }
    }
    workingText = workingText.replace(dateMatch[0], ' ');
  }

  // 4. Keyword Fallback for Category if not specified via hashtag
  if (category === 'Other') {
    const lower = workingText.toLowerCase();
    for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
      if (new RegExp(`\\b${key}\\b`, 'i').test(lower)) {
        category = cat;
        break;
      }
    }
  }

  // 5. Clean Title
  const cleanTitle = workingText
    .replace(/[!#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const finalTitle = cleanTitle.length >= 3 ? cleanTitle : raw;

  return {
    title: finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1),
    category,
    priority,
    dueDate,
    raw,
  };
}