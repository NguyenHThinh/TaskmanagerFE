import type { TaskStatus, TaskType } from "@/types/task";

export const TASK_TYPES: readonly TaskType[] = [
  "STORY",
  "BUG",
  "TASK",
  "REQUEST",
  "FEATURE",
  "IMPROVEMENT",
];

export const TASK_TYPE_ICONS: Record<TaskType, string> = {
  STORY: "📖",
  BUG: "🐛",
  TASK: "📋",
  REQUEST: "📥",
  FEATURE: "✨",
  IMPROVEMENT: "🔧",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  STORY: "Story",
  BUG: "Bug",
  TASK: "Task",
  REQUEST: "Request",
  FEATURE: "Feature",
  IMPROVEMENT: "Cải tiến",
};

export const getTaskTypeIcon = (type?: TaskType | string | null): string => {
  if (!type || !(type in TASK_TYPE_ICONS)) {
    return TASK_TYPE_ICONS.TASK;
  }
  return TASK_TYPE_ICONS[type as TaskType];
};

export const TASK_PRIORITIES = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
] as const;

export const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: "Cần làm", value: "TODO" },
  { label: "Đang làm", value: "IN_PROGRESS" },
  { label: "Hoàn thành", value: "DONE" },
];

export const EST_OPTIONS = [
  { label: "Không ước tính", value: "" },
  { label: "15 phút", value: "15" },
  { label: "30 phút", value: "30" },
  { label: "1 giờ", value: "60" },
  { label: "2 giờ", value: "120" },
  { label: "4 giờ", value: "240" },
  { label: "1 ngày (8h)", value: "480" },
];
