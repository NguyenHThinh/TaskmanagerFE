"use client";

import { FolderKanban } from "lucide-react";

import SectionHeader from "@/components/common/SectionHeader";
import { useProjects } from "@/hooks/useProjects";
import { useAllProjectsTasks } from "@/hooks/useAllProjectsTasks";
import { ProjectsGrid } from "@/components/main/sections/ProjectsGrid";

export default function AllProjectsPage() {
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { tasks, isLoading: isLoadingTasks } = useAllProjectsTasks();

  return (
    <div className="space-y-6">
      <section>
        <SectionHeader
          icon={<FolderKanban className="size-5" />}
          title="Tất cả dự án"
        />
        {isLoadingProjects || isLoadingTasks ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
            Chưa có dự án nào.
          </div>
        ) : (
          <ProjectsGrid projects={projects} tasks={tasks} />
        )}
      </section>
    </div>
  );
}
