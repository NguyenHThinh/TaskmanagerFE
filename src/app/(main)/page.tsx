"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TaskTable } from "@/components/kanban/TaskTable";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import type { TaskPriority } from "@/types/task";
import { CustomSelecter } from "@/components/CustomSelecter";

export default function HomePage() {
  const { projects, firstProject, isLoading: isProjectsLoading, isError: isProjectsError } = useProjects();
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
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle>{activeProject?.name ?? "Task Management"}</CardTitle>
              <CardDescription>
                Jira-style board cho project. Đồng bộ theo API mới từ backend.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{tasks.length} tasks</Badge>
              <Badge variant="secondary">TODO {todoCount}</Badge>
              <Badge variant="secondary">IN PROGRESS {inProgressCount}</Badge>
              <Badge variant="secondary">DONE {doneCount}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={activeProjectId ?? ""}
              onChange={(event) => setSelectedProjectId(event.target.value || null)}
              disabled={isProjectsLoading || projects.length === 0}
            >
              {projects.length === 0 ? <option value="">Chưa có project</option> : null}
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.key} - {project.name}
                </option>
              ))}
            </select> */}
            
            <CustomSelecter 
              options={projects.map((project) => ({ label: project.key + " - " + project.name, value: project._id }))}
              onChange={(value) => setSelectedProjectId(value)}
              defaultValue={activeProjectId ?? ""}
              placeholder="Select a project"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              arrowClassName="size-4 absolute right-2 top-1/2 -translate-y-1/2 transition-transform"
              emptyText={projects.length === 0 ? "No projects" : undefined}
            />

            <Input
              placeholder="Nhập task mới..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            <Button onClick={() => void handleCreateTask()} disabled={!activeProjectId || isCreatingTask || !title.trim()}>
              {isCreatingTask ? "Đang tạo..." : "+ Tạo task"}
            </Button>
          </CardContent>
        </Card>

        {isProjectsError ? (
          <Card className="border-destructive">
            <CardContent className="px-4 py-6 text-sm text-destructive">
              Không thể tải projects. Kiểm tra đăng nhập và API /projects.
            </CardContent>
          </Card>
        ) : null}

        {!activeProjectId ? (
          <Card>
            <CardContent className="px-4 py-6 text-sm text-muted-foreground">
              Chưa có project để hiển thị board.
            </CardContent>
          </Card>
        ) : null}

        {activeProjectId && isLoading ? (
          <Card>
            <CardContent className="px-4 py-6 text-sm text-muted-foreground">Đang tải nhiệm vụ...</CardContent>
          </Card>
        ) : null}

        {activeProjectId && isError ? (
          <Card className="border-destructive">
            <CardContent className="px-4 py-6 text-sm text-destructive">{errorMessage}</CardContent>
          </Card>
        ) : null}

        {activeProjectId && !isLoading && !isError ? (
          <>
            <KanbanBoard tasks={tasks} onMoveTask={moveTask} isMovingTask={isMovingTask} />
            <TaskTable tasks={tasks} onMoveTask={moveTask} isMovingTask={isMovingTask} />
          </>
        ) : null}
      </div>

      <aside className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Project info</CardTitle>
            <CardDescription>Thông tin nhanh project hiện tại</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Key:</span> {activeProject?.key ?? "-"}</p>
            <p><span className="text-muted-foreground">Members:</span> {activeProject?.members.length ?? 0}</p>
            <p><span className="text-muted-foreground">Description:</span> {activeProject?.description || "No description"}</p>
          </CardContent>
        </Card>

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
}
