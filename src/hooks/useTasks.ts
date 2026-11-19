'use client';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { TaskFilterParams, PaginatedResponse } from '@/types/api';
import { Task } from '@/types/task';

export function useTasks(params: TaskFilterParams = {}) {
  return useQuery<PaginatedResponse<Task>, Error>({
    queryKey: ['tasks', params],
    queryFn: () => taskService.getTasks(params),
    placeholderData: (previousData) => previousData,
  });
}

