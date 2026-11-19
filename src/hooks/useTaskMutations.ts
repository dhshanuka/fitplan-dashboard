'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { CreateTaskInput, UpdateTaskInput, Task, TaskStatus } from '@/types/task';
import { useToast } from '@/components/providers/ToastProvider';
import { PaginatedResponse } from '@/types/api';

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Create Task
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(`"${newTask.title}" added to schedule!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create task');
    },
  });

  // Update Task
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(`Updated "${updatedTask.title}"`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update task');
    },
  });

  // Restore Task (for Undo)
  const restoreMutation = useMutation({
    mutationFn: (id: string) => taskService.restoreTask(id),
    onSuccess: (restoredTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(`Restored "${restoredTask.title}"`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to restore task');
    },
  });

  // Delete Task with OPTIMISTIC UPDATE + UNDO TOAST
  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onMutate: async (id: string) => {
      // Cancel outgoing queries for tasks
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous tasks data
      const previousQueries = queryClient.getQueriesData<PaginatedResponse<Task>>({ queryKey: ['tasks'] });

      // Optimistically remove from all cached task lists
      queryClient.setQueriesData<PaginatedResponse<Task>>({ queryKey: ['tasks'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((t) => t.id !== id),
          pagination: {
            ...old.pagination,
            totalItems: Math.max(0, old.pagination.totalItems - 1),
          },
        };
      });

      return { previousQueries, deletedId: id };
    },
    onSuccess: (deletedTask) => {
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      // Present non-blocking UNDO toast
      toast.undo(
        `Deleted "${deletedTask.title}"`,
        () => {
          restoreMutation.mutate(deletedTask.id);
        },
        { duration: 7000 }
      );
    },
    onError: (err: any, id: string, context: any) => {
      // Rollback cache
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, oldData]: [any, any]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      toast.error(err.message || 'Failed to delete task. Changes rolled back.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Quick Status Toggle with OPTIMISTIC UPDATE
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.patchTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', id] });

      const previousTasks = queryClient.getQueriesData<PaginatedResponse<Task>>({ queryKey: ['tasks'] });
      const previousSingle = queryClient.getQueryData<Task>(['task', id]);

      // Optimistically update in list cache
      queryClient.setQueriesData<PaginatedResponse<Task>>({ queryKey: ['tasks'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((t) => (t.id === id ? { ...t, status } : t)),
        };
      });

      // Optimistically update in single item cache
      if (previousSingle) {
        queryClient.setQueryData<Task>(['task', id], {
          ...previousSingle,
          status,
        });
      }

      return { previousTasks, previousSingle, id };
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(`"${updatedTask.title}" marked as ${updatedTask.status}`);
    },
    onError: (err: any, variables, context) => {
      // Rollback
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, oldData]: [any, any]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(['task', context.id], context.previousSingle);
      }
      toast.error(err.message || 'Status change failed. Rolled back.');
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });

  return {
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    updateStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,

    restoreTask: restoreMutation.mutateAsync,
    isRestoring: restoreMutation.isPending,
  };
}

