import { Task, CreateTaskInput, UpdateTaskInput, ActivityLog, TaskStatus } from '@/types/task';
import { TaskFilterParams, PaginatedResponse, DashboardStats, WeeklyConsistencyDay } from '@/types/api';
import { isOverdue, isDueToday } from './dateUtils';
import { STATUS_COLORS, CATEGORY_COLORS, DEFAULT_PAGE_SIZE, DEFAULT_MOCK_FAILURE_RATE } from './constants';
import seedData from '@/data/seedTasks.json';

interface GlobalStore {
  tasks: Task[];
  deletedTasks: Map<string, Task>;
  mockFailureRate: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __fitplanStore: GlobalStore | undefined;
}

function initStore(): GlobalStore {
  const envFailureRate = process.env.MOCK_FAILURE_RATE
    ? parseFloat(process.env.MOCK_FAILURE_RATE)
    : process.env.NEXT_PUBLIC_MOCK_FAILURE_RATE
    ? parseFloat(process.env.NEXT_PUBLIC_MOCK_FAILURE_RATE)
    : DEFAULT_MOCK_FAILURE_RATE;

  return {
    tasks: JSON.parse(JSON.stringify(seedData)) as Task[],
    deletedTasks: new Map<string, Task>(),
    mockFailureRate: isNaN(envFailureRate) ? DEFAULT_MOCK_FAILURE_RATE : envFailureRate,
  };
}

const store: GlobalStore = global.__fitplanStore ?? (global.__fitplanStore = initStore());

export async function simulateLatency(min = 300, max = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function simulateFailure(headerOverride?: string | null): void {
  // If explicitly overridden by request header
  if (headerOverride === 'true') {
    throw new Error('Simulated network error: Request deliberately failed via header override.');
  }
  if (headerOverride === 'false') {
    return;
  }

  const rate = store.mockFailureRate;
  if (rate > 0 && Math.random() < rate) {
    throw new Error(`Simulated network failure (${Math.round(rate * 100)}% failure rate active). Please retry.`);
  }
}

export function setMockFailureRate(rate: number): void {
  store.mockFailureRate = Math.max(0, Math.min(1, rate));
}

export function getMockFailureRate(): number {
  return store.mockFailureRate;
}

export function getTasks(params: TaskFilterParams = {}): PaginatedResponse<Task> {
  let list = [...store.tasks];

  // 1. Text Search (title and description)
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  // 2. Status Filter
  if (params.status && params.status !== 'All') {
    list = list.filter((t) => t.status === params.status);
  }

  // 3. Category Filter
  if (params.category && params.category !== 'All') {
    list = list.filter((t) => t.category === params.category);
  }

  // 4. Priority Filter
  if (params.priority && params.priority !== 'All') {
    list = list.filter((t) => t.priority === params.priority);
  }

  // 5. Quick Filter Chips
  if (params.quickFilter && params.quickFilter !== 'all') {
    if (params.quickFilter === 'overdue') {
      list = list.filter((t) => isOverdue(t.dueDate, t.status));
    } else if (params.quickFilter === 'dueToday') {
      list = list.filter((t) => isDueToday(t.dueDate));
    } else if (params.quickFilter === 'highPriority') {
      list = list.filter((t) => t.priority === 'High');
    }
  }

  // 6. Sorting
  const sortBy = params.sortBy || 'dueDate';
  const sortOrder = params.sortOrder || 'asc';
  const dir = sortOrder === 'asc' ? 1 : -1;

  const priorityWeight = { High: 3, Medium: 2, Low: 1 };

  list.sort((a, b) => {
    if (sortBy === 'priority') {
      return (priorityWeight[a.priority] - priorityWeight[b.priority]) * dir;
    }
    if (sortBy === 'dueDate') {
      return a.dueDate.localeCompare(b.dueDate) * dir;
    }
    if (sortBy === 'createdAt') {
      return a.createdAt.localeCompare(b.createdAt) * dir;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title) * dir;
    }
    return 0;
  });

  // 7. Pagination
  const totalItems = list.length;
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || DEFAULT_PAGE_SIZE);
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedTasks = list.slice(startIndex, startIndex + limit);

  return {
    data: paginatedTasks,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export function getTaskById(id: string): Task | null {
  const task = store.tasks.find((t) => t.id === id);
  return task ? JSON.parse(JSON.stringify(task)) : null;
}

export function createTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString();
  const id = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const initialLog: ActivityLog = {
    id: `act-${Date.now()}`,
    taskId: id,
    type: 'CREATED',
    timestamp: now,
    message: 'Task created',
  };

  const newTask: Task = {
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
    activityTimeline: [initialLog],
  };

  store.tasks.unshift(newTask);
  return newTask;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | null {
  const index = store.tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = store.tasks[index];
  const now = new Date().toISOString();
  const updatedLogs = [...(existing.activityTimeline || [])];

  // Log status change if status changed
  if (input.status && input.status !== existing.status) {
    updatedLogs.unshift({
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      taskId: id,
      type: 'STATUS_CHANGED',
      fromStatus: existing.status,
      toStatus: input.status,
      timestamp: now,
      message: `Status updated from "${existing.status}" to "${input.status}"`,
    });
  } else {
    updatedLogs.unshift({
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      taskId: id,
      type: 'UPDATED',
      timestamp: now,
      message: 'Task details updated',
    });
  }

  const updatedTask: Task = {
    ...existing,
    ...input,
    updatedAt: now,
    activityTimeline: updatedLogs,
  };

  store.tasks[index] = updatedTask;
  return updatedTask;
}

export function deleteTask(id: string): { success: boolean; deletedTask: Task | null } {
  const index = store.tasks.findIndex((t) => t.id === id);
  if (index === -1) return { success: false, deletedTask: null };

  const [removed] = store.tasks.splice(index, 1);
  store.deletedTasks.set(id, removed);
  return { success: true, deletedTask: removed };
}

export function restoreTask(id: string): Task | null {
  const task = store.deletedTasks.get(id);
  if (!task) return null;

  store.deletedTasks.delete(id);
  const now = new Date().toISOString();

  const restoredTask: Task = {
    ...task,
    updatedAt: now,
    activityTimeline: [
      {
        id: `act-${Date.now()}`,
        taskId: id,
        type: 'RESTORED',
        timestamp: now,
        message: 'Task restored via undo',
      },
      ...(task.activityTimeline || []),
    ],
  };

  store.tasks.unshift(restoredTask);
  return restoredTask;
}

export function getDashboardStats(): DashboardStats {
  const tasks = store.tasks;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status distribution for donut chart
  const statusDistribution = [
    { name: 'Completed' as TaskStatus, value: completedTasks, color: STATUS_COLORS.Completed.chart },
    { name: 'In Progress' as TaskStatus, value: inProgressTasks, color: STATUS_COLORS['In Progress'].chart },
    { name: 'Todo' as TaskStatus, value: totalTasks - completedTasks - inProgressTasks, color: STATUS_COLORS.Todo.chart },
  ];

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  for (const t of tasks) {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  }
  const categoryDistribution = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat as any,
    count,
    color: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS]?.accent || '#64748b',
  }));

  // 7-day completion trend (last 7 days up to today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completionTrend = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = dayNames[d.getDay()];

    const count = tasks.filter((t) => {
      if (t.status !== 'Completed') return false;
      const completedOn = t.updatedAt ? t.updatedAt.split('T')[0] : t.dueDate;
      return completedOn === dateStr;
    }).length;

    completionTrend.push({
      date: dateStr,
      day: dayName,
      completed: count,
    });
  }

  // Weekly consistency for current week (Mon to Sun)
  const currentDay = today.getDay(); // 0 is Sun, 1 is Mon
  const distanceToMonday = (currentDay + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const weeklyConsistency: WeeklyConsistencyDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];
    const isTodayDate = d.getTime() === today.getTime();

    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
    const dayCompleted = dayTasks.filter((t) => t.status === 'Completed').length;

    weeklyConsistency.push({
      day: dayLabel,
      date: dateStr,
      completed: dayCompleted,
      total: dayTasks.length,
      isToday: isTodayDate,
    });
  }

  // Streak counter: continuous consecutive days in the past with at least 1 completed task
  let currentStreakDays = 0;
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const checkDateStr = checkDate.toISOString().split('T')[0];

    const hasCompleted = tasks.some((t) => {
      if (t.status !== 'Completed') return false;
      const compDate = t.updatedAt ? t.updatedAt.split('T')[0] : t.dueDate;
      return compDate === checkDateStr;
    });

    if (hasCompleted) {
      currentStreakDays++;
    } else {
      // If today has no completed task yet, don't break streak if yesterday had one
      if (i === 0) continue;
      break;
    }
  }

  // Due soon list (up to 5 upcoming tasks sorted by due date)
  const dueSoon = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    completionRate,
    currentStreakDays: Math.max(1, currentStreakDays), // minimum 1 day streak
    weeklyConsistency,
    statusDistribution,
    categoryDistribution,
    completionTrend,
    dueSoon,
  };
}

export function resetStore(): void {
  store.tasks = JSON.parse(JSON.stringify(seedData)) as Task[];
  store.deletedTasks.clear();
}

