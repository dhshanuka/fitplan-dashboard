import { apiClient } from '@/lib/apiClient';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { TaskFilterParams, PaginatedResponse, DashboardStats, ApiResponse } from '@/types/api';

const BASE_URL = '/api/tasks';

export const taskService = {
  /**
   * Fetch paginated & filtered list of tasks
   */
  async getTasks(params?: TaskFilterParams): Promise<PaginatedResponse<Task>> {
    const res = await apiClient.get<PaginatedResponse<Task> & { success: boolean }>(BASE_URL, {
      params: params as any,
    });
    return {
      data: res.data,
      pagination: res.pagination,
    };
  },

  /**
   * Fetch a single task by ID
   */
  async getTask(id: string): Promise<Task> {
    const res = await apiClient.get<ApiResponse<Task>>(`${BASE_URL}/${id}`);
    if (!res.data) throw new Error('Task not found');
    return res.data;
  },

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskInput): Promise<Task> {
    const res = await apiClient.post<ApiResponse<Task>>(BASE_URL, data);
    if (!res.data) throw new Error('Failed to create task');
    return res.data;
  },

  /**
   * Full update of a task
   */
  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const res = await apiClient.put<ApiResponse<Task>>(`${BASE_URL}/${id}`, data);
    if (!res.data) throw new Error('Failed to update task');
    return res.data;
  },

  /**
   * Partial update of a task (e.g. quick status toggle)
   */
  async patchTask(id: string, data: Partial<UpdateTaskInput>): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(`${BASE_URL}/${id}`, data);
    if (!res.data) throw new Error('Failed to patch task');
    return res.data;
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<Task> {
    const res = await apiClient.delete<ApiResponse<Task>>(`${BASE_URL}/${id}`);
    if (!res.data) throw new Error('Failed to delete task');
    return res.data;
  },

  /**
   * Restore a previously deleted task (Undo support)
   */
  async restoreTask(id: string): Promise<Task> {
    const res = await apiClient.post<ApiResponse<Task>>(`${BASE_URL}/restore`, { id });
    if (!res.data) throw new Error('Failed to restore task');
    return res.data;
  },

  /**
   * Fetch aggregate dashboard statistics & charts data
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
    if (!res.data) throw new Error('Failed to fetch dashboard metrics');
    return res.data;
  },

  /**
   * Fetch configuration (e.g. mock failure rate)
   */
  async getConfig(): Promise<{ mockFailureRate: number }> {
    const res = await apiClient.get<ApiResponse<{ mockFailureRate: number }>>('/api/config');
    return res.data || { mockFailureRate: 0.1 };
  },

  /**
   * Update configuration (e.g. mock failure rate or reset store)
   */
  async updateConfig(config: { mockFailureRate?: number; reset?: boolean }): Promise<{ mockFailureRate: number }> {
    const res = await apiClient.post<ApiResponse<{ mockFailureRate: number }>>('/api/config', config);
    return res.data || { mockFailureRate: 0.1 };
  },
};
