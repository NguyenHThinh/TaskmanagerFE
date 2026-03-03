import type { TaskPriority } from "@/types/task";

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "TB",
  HIGH: "Cao",
  URGENT: "Khẩn",
};

export const PRIORITY_ORDER: TaskPriority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

export const AVATAR_COLORS = [
  "bg-red-500/30",
  "bg-violet-500/30",
  "bg-teal-500/30",
  "bg-blue-500/30",
];
