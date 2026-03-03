"use client";

import { cn } from "@/utils";
import { TaskCard } from "@/components/kanban/TaskCard";
import type { ProjectCategory } from "@/types/project";
import type { Task, TaskStatus } from "@/types/task";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  dotColor?: string;
  tasks: Task[];
  projectCategory?: ProjectCategory;
  onDropTask: (status: TaskStatus) => void;
  onDragTask: (taskId: string) => void;
  onAddTaskClick?: (status: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
  isBusy?: boolean;
};

export const KanbanColumn = ({
  title,
  status,
  dotColor = "bg-muted-foreground",
  tasks,
  projectCategory,
  onDropTask,
  onDragTask,
  onAddTaskClick,
  onTaskClick,
  isBusy = false,
}: KanbanColumnProps) => {
  const columnTasks = tasks.filter((task) => task.status === status);

  const addTaskArea = (
    <button
      type="button"
      onClick={() => onAddTaskClick?.(status)}
      className="flex min-h-[80px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center text-xs text-muted-foreground transition hover:border-primary/50 hover:bg-muted/50 hover:text-foreground"
    >
      <span className="text-base">+</span>
      <span>Thêm task</span>
    </button>
  );

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropTask(status);
      }}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 shrink-0 rounded-full", dotColor)} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {columnTasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        {isBusy ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-4 py-2 text-center text-xs text-muted-foreground">
            Đang cập nhật...
          </div>
        ) : null}
        {columnTasks.length === 0 ? (
          addTaskArea
        ) : (
          <>
            {columnTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              projectCategory={projectCategory}
              onDragStart={onDragTask}
              onClick={onTaskClick ? () => onTaskClick(task) : undefined}
            />
            ))}
            {addTaskArea}
          </>
        )}
      </div>
    </div>
  );
};


