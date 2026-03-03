"use client";

import { AlertTriangle, Calendar } from "lucide-react";

import { useCreateProjectDialog } from "@/contexts/AppDialogContext";
import { useAllProjectsTasks } from "@/hooks/useAllProjectsTasks";
import { useProjects } from "@/hooks/useProjects";
import { getHomeDashboardMetrics } from "@/utils/home";
import OverviewStatCard from "../common/OverviewStatCard";
import { HomeProjectsSection } from "./sections/HomeProjectsSection";
import { HomeTaskListSection } from "./sections/HomeTaskListSection";

export const HomePageContent = () => {
  const { open: openCreateProject } = useCreateProjectDialog();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { tasks, isLoading: isLoadingTasks } = useAllProjectsTasks();

  const {
    tasksDueToday,
    highPriorityTasks,
    activeProjectsCount,
    projectsThisMonth,
  } = getHomeDashboardMetrics(projects, tasks);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý dự án và nhiệm vụ của bạn
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStatCard
          label="DỰ ÁN ĐANG CHẠY"
          value={activeProjectsCount}
          subtext={
            projectsThisMonth > 0
              ? `+${projectsThisMonth} tháng này`
              : undefined
          }
        />
        <OverviewStatCard label="TỔNG TASK" value={tasks.length} />
        <OverviewStatCard label="HẠN HÔM NAY" value={tasksDueToday.length} />
        <OverviewStatCard
          label="ƯU TIÊN CAO"
          value={highPriorityTasks.length}
        />
      </section>

      <HomeProjectsSection
        projects={projects}
        tasks={tasks}
        isLoadingProjects={isLoadingProjects}
        onCreateProject={openCreateProject}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <HomeTaskListSection
          title="Hạn hôm nay"
          icon={<Calendar className="size-5" />}
          tasks={tasksDueToday}
          isLoading={isLoadingTasks}
          emptyMessage="Không có task nào hết hạn hôm nay"
        />
        <HomeTaskListSection
          title="Ưu tiên cao"
          icon={<AlertTriangle className="size-5" />}
          tasks={highPriorityTasks}
          isLoading={isLoadingTasks}
          emptyMessage="Không có task ưu tiên cao"
        />
      </div>
    </div>
  );
};
