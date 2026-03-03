"use client";

import { useQueries } from "@tanstack/react-query";

import { getTasks } from "@/services/taskService";
import { useProjects } from "@/hooks/useProjects";
import type { Task } from "@/types/task";

export type TaskWithProject = Task & { projectKey?: string; projectName?: string };

export const useAllProjectsTasks = () => {
  const { projects } = useProjects();

  const results = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["tasks", project._id],
      queryFn: () => getTasks(project._id),
    })),
  });

  const allTasks: TaskWithProject[] = results.flatMap((result, index) => {
    const project = projects[index];
    const tasks = (result.data ?? []) as Task[];
    return tasks.map((task) => ({
      ...task,
      projectKey: project?.key,
      projectName: project?.name,
    }));
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return {
    tasks: allTasks,
    isLoading,
    isError,
  };
};
