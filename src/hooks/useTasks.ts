"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createTask, getTasks, updateTaskStatus } from "@/services/taskService";
import type { CreateTaskPayload, Task, TaskStatus } from "@/types/task";

const tasksQueryKey = (projectId: string) => ["tasks", projectId];

type MoveTaskInput = {
  taskId: string;
  nextStatus: TaskStatus;
};

type MoveTaskContext = {
  previousTasks: Task[];
};

export const useTasks = (projectId: string | null) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: projectId ? tasksQueryKey(projectId) : ["tasks", "empty"],
    queryFn: () => getTasks(projectId as string),
    enabled: Boolean(projectId),
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, nextStatus }: MoveTaskInput) => updateTaskStatus(taskId, nextStatus),
    onMutate: async ({ taskId, nextStatus }): Promise<MoveTaskContext> => {
      if (!projectId) {
        return { previousTasks: [] };
      }

      await queryClient.cancelQueries({ queryKey: tasksQueryKey(projectId) });

      const previousTasks = queryClient.getQueryData<Task[]>(tasksQueryKey(projectId)) ?? [];
      const optimisticTasks = previousTasks.map((task) =>
        task._id === taskId ? { ...task, status: nextStatus } : task,
      );

      queryClient.setQueryData(tasksQueryKey(projectId), optimisticTasks);

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (!projectId || !context) {
        return;
      }

      queryClient.setQueryData(tasksQueryKey(projectId), context.previousTasks);
    },
    onSettled: () => {
      if (!projectId) return;
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey(projectId) });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(projectId as string, payload),
    onSuccess: () => {
      if (!projectId) return;
      void queryClient.invalidateQueries({ queryKey: tasksQueryKey(projectId) });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    moveTask: moveTaskMutation.mutateAsync,
    isMovingTask: moveTaskMutation.isPending,
    createTask: createTaskMutation.mutateAsync,
    isCreatingTask: createTaskMutation.isPending,
  };
};
