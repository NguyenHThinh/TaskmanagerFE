import { http } from "@/lib/http";
import type { CreateTaskPayload, Task, TaskStatus } from "@/types/task";

type TaskQuery = {
  status?: TaskStatus;
  priority?: string;
  assigneeId?: string;
};

export const getTasks = async (projectId: string, query?: TaskQuery): Promise<Task[]> => {
  const response = await http.get<Task[]>(`/projects/${projectId}/tasks`, { params: query });
  return response.data;
};

export const createTask = async (projectId: string, payload: CreateTaskPayload): Promise<Task> => {
  const response = await http.post<Task>(`/projects/${projectId}/tasks`, payload);
  return response.data;
};

export const updateTask = async (taskId: string, payload: Partial<CreateTaskPayload>): Promise<Task> => {
  const response = await http.patch<Task>(`/tasks/${taskId}`, payload);
  return response.data;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<Task> => {
  return updateTask(taskId, { status });
};
