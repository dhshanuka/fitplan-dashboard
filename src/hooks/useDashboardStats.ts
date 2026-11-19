'use client';

import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { DashboardStats } from '@/types/api';

export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats'],
    queryFn: () => taskService.getDashboardStats(),
    refetchInterval: 1000 * 60, // Refresh every minute
  });
}

