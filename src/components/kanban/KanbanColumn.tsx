"use client";

import { Badge } from "@/components/ui/badge";
import type { Task, TaskStatus } from "@/types/task";

import { TaskCard } from "@/components/kanban/TaskCard";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDropTask: (status: TaskStatus) => void;
  onDragTask: (taskId: string) => void;
  isBusy?: boolean;
};

export const KanbanColumn = ({
  title,
  status,
  tasks,
  onDropTask,
  onDragTask,
  isBusy = false,
}: KanbanColumnProps) => {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropTask(status);
      }}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary">{columnTasks.length}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        {isBusy ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-4 py-2 text-center text-xs text-muted-foreground">
            Đang cập nhật...
          </div>
        ) : null}
        {columnTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center text-xs text-muted-foreground">
            Chưa có nhiệm vụ
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard key={task._id} task={task} onDragStart={onDragTask} />
          ))
        )}
      </div>
    </div>
  );
};


