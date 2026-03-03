"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/types/task";
import type { TaskStatus } from "@/types/task";
import type { ProjectCategory } from "@/types/project";

import { KanbanColumn } from "@/components/kanban/KanbanColumn";

const COLUMN_CONFIG: { status: TaskStatus; title: string; dotColor: string }[] = [
  { status: "TODO", title: "CẦN LÀM", dotColor: "bg-emerald-500" },
  { status: "IN_PROGRESS", title: "ĐANG LÀM", dotColor: "bg-blue-500" },
  { status: "DONE", title: "HOÀN THÀNH", dotColor: "bg-teal-500" },
];

type KanbanBoardProps = {
  tasks: Task[];
  onMoveTask: (input: { taskId: string; nextStatus: TaskStatus }) => Promise<unknown>;
  onAddTaskClick?: (status: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
  isMovingTask?: boolean;
  projectCategory?: ProjectCategory;
};

export const KanbanBoard = ({
  tasks,
  onMoveTask,
  onAddTaskClick,
  onTaskClick,
  isMovingTask = false,
  projectCategory,
}: KanbanBoardProps) => {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const handleDropTask = async (nextStatus: TaskStatus): Promise<void> => {
    if (!draggingTaskId) return;
    const targetTask = tasks.find((task) => task._id === draggingTaskId);
    if (!targetTask || targetTask.status === nextStatus) {
      setDraggingTaskId(null);
      return;
    }
    await onMoveTask({ taskId: draggingTaskId, nextStatus });
    setDraggingTaskId(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMN_CONFIG.map(({ status, title, dotColor }) => (
            <KanbanColumn
              key={status}
              title={title}
              status={status}
              dotColor={dotColor}
              tasks={tasks}
              projectCategory={projectCategory}
              onDropTask={handleDropTask}
              onDragTask={setDraggingTaskId}
              onAddTaskClick={onAddTaskClick}
              onTaskClick={onTaskClick}
              isBusy={isMovingTask}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


