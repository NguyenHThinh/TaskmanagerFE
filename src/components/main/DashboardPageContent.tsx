"use client";

import { useMemo, useState } from "react";

import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TaskTable } from "@/components/kanban/TaskTable";
import { ProjectHeaderSection } from "@/components/main/sections/ProjectHeaderSection";
import { ProjectInfoSection } from "@/components/main/sections/ProjectInfoSection";
import { ProjectStateSection } from "@/components/main/sections/ProjectStateSection";
import { TaskQuickCreateSection } from "@/components/main/sections/TaskQuickCreateSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import type { TaskPriority } from "@/types/task";

export const DashboardPageContent = () => {
  const { projects, firstProject, isError: isProjectsError } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const activeProjectId = selectedProjectId ?? firstProject?._id ?? null;
  const activeProject = useMemo(
    () => projects.find((project) => project._id === activeProjectId) ?? firstProject ?? null,
    [projects, activeProjectId, firstProject],
  );

  const { tasks, isLoading, isError, error, moveTask, isMovingTask, createTask, isCreatingTask } =
    useTasks(activeProjectId);

  const todoCount = tasks.filter((task) => task.status === "TODO").length;
  const inProgressCount = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((task) => task.status === "DONE").length;

  const handleCreateTask = async () => {
    if (!activeProjectId || !title.trim()) return;

    await createTask({
      title: title.trim(),
      priority,
      status: "TODO",
    });

    setTitle("");
    setPriority("MEDIUM");
  };

  const errorMessage = isError && error instanceof Error ? error.message : "Không thể tải dữ liệu task";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-6">
        <ProjectHeaderSection
          projectName={activeProject?.name}
          tasksCount={tasks.length}
          todoCount={todoCount}
          inProgressCount={inProgressCount}
          doneCount={doneCount}
        />

        <Card>
          <TaskQuickCreateSection
            projects={projects}
            activeProjectId={activeProjectId}
            title={title}
            priority={priority}
            isCreatingTask={isCreatingTask}
            onProjectChange={(value) => setSelectedProjectId(value)}
            onTitleChange={setTitle}
            onPriorityChange={setPriority}
            onCreateTask={() => void handleCreateTask()}
          />
        </Card>

        <ProjectStateSection
          isProjectsError={isProjectsError}
          hasActiveProject={Boolean(activeProjectId)}
          isLoadingTasks={isLoading}
          isTasksError={isError}
          errorMessage={errorMessage}
        />

        {activeProjectId && !isLoading && !isError ? (
          <>
            <KanbanBoard tasks={tasks} onMoveTask={moveTask} isMovingTask={isMovingTask} />
            <TaskTable tasks={tasks} onMoveTask={moveTask} isMovingTask={isMovingTask} />
          </>
        ) : null}
      </div>

      <aside className="flex flex-col gap-4">
        <ProjectInfoSection project={activeProject} />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>- Kéo thả task để đổi trạng thái</p>
            <p>- Tạo task nhanh ở thanh đầu trang</p>
            <p>- Có thể lọc sâu hơn ở bước tiếp theo</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};
