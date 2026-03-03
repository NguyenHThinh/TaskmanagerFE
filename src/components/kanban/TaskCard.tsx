"use client";

import { cn } from "@/utils";
import type { Task, TaskPriority } from "@/types/task";
import type { ProjectCategory } from "@/types/project";
import { getTaskTypeIcon } from "@/constants/task";

type TaskCardProps = {
  task: Task;
  onDragStart: (taskId: string) => void;
  onClick?: () => void;
  labels?: string[];
  projectCategory?: ProjectCategory;
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: "Thấp", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  MEDIUM: { label: "TB", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  HIGH: { label: "Cao", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  URGENT: { label: "Khẩn", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const categoryToTags: Record<ProjectCategory, string[]> = {
  SOFTWARE: ["DEV", "QC"],
  DESIGN: ["DESIGN", "UI"],
  MARKETING: ["MARKETING"],
  HR: ["HR"],
  FINANCE: ["FINANCE"],
  OPERATIONS: ["QC", "OPS"],
  OTHER: ["TASK", "QC"],
};

const formatDueDate = (dueDate: string | null | undefined): string => {
  if (!dueDate) return "-";
  return new Date(dueDate).toLocaleDateString("vi-VN", { day: "2-digit", month: "short" });
};

const getInitials = (assigneeId: string | null | undefined): string => {
  if (!assigneeId) return "?";
  return assigneeId.slice(0, 2).toUpperCase();
};

export const TaskCard = ({ task, onDragStart, onClick, labels, projectCategory }: TaskCardProps) => {
  const priority = priorityConfig[task.priority];
  const displayLabels = labels ?? (projectCategory ? categoryToTags[projectCategory] : ["TASK"]);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task._id)}
      onClick={(e) => {
        if (onClick && !(e.target as HTMLElement).closest("button")) onClick();
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className="cursor-grab rounded-xl border border-border border-l-0 bg-card p-4 shadow-sm transition hover:bg-muted/30 active:cursor-grabbing"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {displayLabels.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium uppercase text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="shrink-0" aria-hidden>
            {getTaskTypeIcon(task.type)}
          </span>
          {task.title}
        </h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Assignee:</span>
            <span
              className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-foreground"
              title={task.assigneeId ?? "Chưa phân công"}
            >
              {getInitials(task.assigneeId)}
            </span>
            <span className="text-foreground">{task.assigneeId ? getInitials(task.assigneeId) : "—"}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Deadline:</span>{" "}
            <span className="text-foreground">{formatDueDate(task.dueDate)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Priority:</span>{" "}
            <span className={cn("rounded px-2 py-0.5 font-medium border", priority.className)}>
              {priority.label}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};


