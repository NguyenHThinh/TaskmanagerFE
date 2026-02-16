"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

type TaskTableProps = {
  tasks: Task[];
  onMoveTask: (input: { taskId: string; nextStatus: TaskStatus }) => Promise<unknown>;
  isMovingTask?: boolean;
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

const statusList: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const TaskTable = ({ tasks, onMoveTask, isMovingTask = false }: TaskTableProps) => {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const handleDropToStatus = async (nextStatus: TaskStatus): Promise<void> => {
    if (!draggingTaskId) {
      return;
    }

    const currentTask = tasks.find((task) => task._id === draggingTaskId);
    if (!currentTask || currentTask.status === nextStatus) {
      setDraggingTaskId(null);
      return;
    }

    await onMoveTask({ taskId: draggingTaskId, nextStatus });
    setDraggingTaskId(null);
  };

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Task table</h3>
          <p className="text-sm text-muted-foreground">Kéo task và thả vào trạng thái ở bên phải như Jira.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusList.map((status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void handleDropToStatus(status);
              }}
            >
              {statusLabels[status]}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ưu tiên</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Hạn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {tasks.map((task) => (
              <tr
                key={task._id}
                draggable
                onDragStart={() => setDraggingTaskId(task._id)}
                className="cursor-grab transition hover:bg-muted/30 active:cursor-grabbing"
              >
                <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{statusLabels[task.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{priorityLabels[task.priority]}</td>
                <td className="px-4 py-3 text-muted-foreground">{task.assigneeId ?? "Chưa phân công"}</td>
                <td className="px-4 py-3 text-muted-foreground">{task.dueDate ?? "Chưa có hạn"}</td>
              </tr>
            ))}
            {tasks.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>
                  Chưa có task nào
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {isMovingTask ? (
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">Đang đồng bộ trạng thái...</div>
      ) : null}
    </section>
  );
};

