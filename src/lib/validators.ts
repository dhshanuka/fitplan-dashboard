import { z } from 'zod';

export const taskCategorySchema = z.enum([
  'Strength',
  'Cardio',
  'Yoga',
  'Nutrition',
  'Recovery',
  'Other',
], {
  errorMap: () => ({ message: 'Please select a valid fitness category' }),
});

export const taskPrioritySchema = z.enum(['Low', 'Medium', 'High'], {
  errorMap: () => ({ message: 'Please select a valid priority level' }),
});

export const taskStatusSchema = z.enum(['Todo', 'In Progress', 'Completed'], {
  errorMap: () => ({ message: 'Please select a valid status' }),
});

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title cannot exceed 100 characters' })
    .trim(),
  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  category: taskCategorySchema,
  priority: taskPrioritySchema,
  status: taskStatusSchema.default('Todo'),
  dueDate: z
    .string()
    .min(1, { message: 'Due date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Due date must be in YYYY-MM-DD format' }),
  durationMinutes: z
    .number({ invalid_type_error: 'Duration must be a number' })
    .int({ message: 'Duration must be a whole number' })
    .min(1, { message: 'Duration must be at least 1 minute' })
    .max(480, { message: 'Duration cannot exceed 480 minutes (8 hours)' })
    .optional()
    .nullable(),
  targetCalories: z
    .number({ invalid_type_error: 'Calories must be a number' })
    .int({ message: 'Calories must be a whole number' })
    .min(0, { message: 'Calories cannot be negative' })
    .max(10000, { message: 'Calories cannot exceed 10,000 kcal' })
    .optional()
    .nullable(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

