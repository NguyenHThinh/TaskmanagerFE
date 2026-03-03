"use client";

import { useMemo, useState } from "react";

import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TaskTable } from "@/components/kanban/TaskTable";
import { ProjectHeaderSection } from "@/components/main/sections/ProjectHeaderSection";
import { ProjectStateSection } from "@/components/main/sections/ProjectStateSection";
import { TaskInfoDialog } from "@/components/main/TaskInfoDialog";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import type { CreateTaskPayload, Task } from "@/types/task";

type ProjectDetailPageContentProps = {
  projectId: string;
};

export const ProjectDetailPageContent = ({ projectId }: ProjectDetailPageContentProps) => {
  const { projects, isError: isProjectsError } = useProjects();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");

  const activeProject = useMemo(
    () => projects.find((p) => p._id === projectId) ?? null,
    [projects, projectId],
  );

  const {
    tasks,
    isLoading,
    isError,
    error,
    moveTask,
    isMovingTask,
    createTask,
    isCreatingTask,
    updateTask,
    isUpdatingTask,
  } = useTasks(projectId);

  const stories = useMemo(
    () => tasks.filter((t) => t.type === "STORY"),
    [tasks],
  );

  const subtasks = useMemo(
    () => (selectedTask ? tasks.filter((t) => t.parentId === selectedTask._id) : []),
    [tasks, selectedTask],
  );

  const todoCount = tasks.filter((task) => task.status === "TODO").length;
  const inProgressCount = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((task) => task.status === "DONE").length;

  const handleAddTaskClick = (status: "TODO" | "IN_PROGRESS" | "DONE") => {
    setSelectedTask(null);
    setCreateDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await createTask({
      title: payload.title,
      description: payload.description,
      type: payload.type ?? "TASK",
      status: payload.status ?? "TODO",
      priority: payload.priority ?? "MEDIUM",
      assigneeId: payload.assigneeId,
      dueDate: payload.dueDate,
      estimateMinutes: payload.estimateMinutes,
      parentId: payload.parentId,
    });
    setDialogOpen(false);
  };

  const handleUpdateTask = async (taskId: string, payload: Partial<CreateTaskPayload>) => {
    await updateTask({ taskId, payload });
  };

  const errorMessage = isError && error instanceof Error ? error.message : "Không thể tải dữ liệu task";

  if (!activeProject && !isProjectsError && projects.length > 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Project không tồn tại hoặc bạn không có quyền truy cập.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-6">

        <ProjectHeaderSection
          projectName={activeProject?.name}
          tasksCount={tasks.length}
          todoCount={todoCount}
          inProgressCount={inProgressCount}
          doneCount={doneCount}
        />

        <ProjectStateSection
          isProjectsError={isProjectsError}
          hasActiveProject={Boolean(activeProject)}
          isLoadingTasks={isLoading}
          isTasksError={isError}
          errorMessage={errorMessage}
        />

        {!isLoading && !isError ? (
          <>
            <KanbanBoard
              tasks={tasks}
              onMoveTask={moveTask}
              onAddTaskClick={handleAddTaskClick}
              onTaskClick={handleTaskClick}
              isMovingTask={isMovingTask}
              projectCategory={activeProject?.category}
            />
            <TaskTable
              tasks={tasks}
              onMoveTask={moveTask}
              onTaskClick={handleTaskClick}
              isMovingTask={isMovingTask}
            />
          </>
        ) : null}
      </div>

      <TaskInfoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        defaultStatus={createDefaultStatus}
        project={activeProject}
        stories={stories}
        subtasks={subtasks}
        isCreating={isCreatingTask}
        isUpdating={isUpdatingTask}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};
