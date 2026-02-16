"use client";

import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  onDragStart: (taskId: string) => void;
};

const priorityLabelMap: Record<Task["priority"], string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

export const TaskCard = ({ task, onDragStart }: TaskCardProps) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task._id)}
      className="cursor-grab rounded-xl border border-border bg-card p-4 shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
        <Badge variant="secondary">{priorityLabelMap[task.priority]}</Badge>
      </div>
      {task.description ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{task.description}</p>
      ) : null}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{task.assigneeId ?? "Chưa phân công"}</span>
        <span>{task.dueDate ?? "Chưa có hạn"}</span>
      </div>
    </div>
  );
};


