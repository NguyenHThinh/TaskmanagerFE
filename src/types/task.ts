export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskType = "STORY" | "BUG" | "TASK" | "REQUEST" | "FEATURE" | "IMPROVEMENT";

export type Task = {
  _id: string;
  projectId: string;
  title: string;
  type?: TaskType;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
  estimateMinutes?: number | null;
  createdBy: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  type?: TaskType;
  parentId?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  estimateMinutes?: number;
};
