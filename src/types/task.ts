export type TaskCategory =
  | 'Strength'
  | 'Cardio'
  | 'Yoga'
  | 'Nutrition'
  | 'Recovery'
  | 'Other';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface ActivityLog {
  id: string;
  taskId: string;
  type: 'CREATED' | 'STATUS_CHANGED' | 'UPDATED' | 'RESTORED';
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
  timestamp: string; // ISO 8601
  message: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  durationMinutes?: number | null;
  targetCalories?: number | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  activityTimeline?: ActivityLog[];
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'activityTimeline'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;