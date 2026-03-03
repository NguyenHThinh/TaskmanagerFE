import { PRIORITY_ORDER } from "@/constants/home";
import type { TaskWithProject } from "@/hooks/useAllProjectsTasks";
import type { Project } from "@/types/project";
import type { TaskPriority } from "@/types/task";

export const isDueToday = (dueDate: string | null | undefined): boolean => {
  if (!dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  const taskDate = dueDate.slice(0, 10);
  return today === taskDate;
};

export const isHighPriority = (priority: TaskPriority): boolean => {
  return priority === "HIGH" || priority === "URGENT";
};

export const formatDueDate = (dueDate: string | null | undefined): string => {
  if (!dueDate) return "-";
  return new Date(dueDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatProjectDate = (date: string | null | undefined): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getProjectProgress = (
  projectId: string,
  tasks: TaskWithProject[],
): number => {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const total = projectTasks.length;
  if (total === 0) return 0;

  const done = projectTasks.filter((task) => task.status === "DONE").length;
  return Math.round((done / total) * 100);
};

export const getHomeDashboardMetrics = (
  projects: Project[],
  tasks: TaskWithProject[],
) => {
  const tasksDueToday = tasks.filter((task) => isDueToday(task.dueDate));
  const highPriorityTasks = tasks
    .filter((task) => isHighPriority(task.priority))
    .sort(
      (a, b) =>
        PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
    );

  const activeProjectsCount = projects.filter(
    (project) => project.status === "ACTIVE",
  ).length;

  const now = new Date();
  const projectsThisMonth = projects.filter((project) => {
    const created = new Date(project.createdAt);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return {
    tasksDueToday,
    highPriorityTasks,
    activeProjectsCount,
    projectsThisMonth,
  };
};
