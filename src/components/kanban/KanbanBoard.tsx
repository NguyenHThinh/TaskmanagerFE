"use client";

import { useState } from "react";

import type { Task } from "@/types/task";
import type { TaskStatus } from "@/types/task";

import { KanbanColumn } from "@/components/kanban/KanbanColumn";

type KanbanBoardProps = {
  tasks: Task[];
  onMoveTask: (input: { taskId: string; nextStatus: TaskStatus }) => Promise<unknown>;
  isMovingTask?: boolean;
};

export const KanbanBoard = ({ tasks, onMoveTask, isMovingTask = false }: KanbanBoardProps) => {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const handleDropTask = async (nextStatus: TaskStatus): Promise<void> => {
    if (!draggingTaskId) {
      return;
    }

    const targetTask = tasks.find((task) => task._id === draggingTaskId);
    if (!targetTask || targetTask.status === nextStatus) {
      setDraggingTaskId(null);
      return;
    }

    await onMoveTask({ taskId: draggingTaskId, nextStatus });
    setDraggingTaskId(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KanbanColumn
        title="TODO"
        status="TODO"
        tasks={tasks}
        onDropTask={handleDropTask}
        onDragTask={setDraggingTaskId}
        isBusy={isMovingTask}
      />
      <KanbanColumn
        title="IN PROGRESS"
        status="IN_PROGRESS"
        tasks={tasks}
        onDropTask={handleDropTask}
        onDragTask={setDraggingTaskId}
        isBusy={isMovingTask}
      />
      <KanbanColumn
        title="DONE"
        status="DONE"
        tasks={tasks}
        onDropTask={handleDropTask}
        onDragTask={setDraggingTaskId}
        isBusy={isMovingTask}
      />
    </div>
  );
};


