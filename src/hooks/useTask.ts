'use client';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { Task } from '@/types/task';

export function useTask(id: string) {
  return useQuery<Task, Error>({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
}

