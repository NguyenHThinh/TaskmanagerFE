import { FolderKanban, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskWithProject } from "@/hooks/useAllProjectsTasks";
import type { Project } from "@/types/project";
import SectionHeader from "@/components/common/SectionHeader";
import { ProjectsGrid } from "./ProjectsGrid";

type HomeProjectsSectionProps = {
  projects: Project[];
  tasks: TaskWithProject[];
  isLoadingProjects: boolean;
  onCreateProject: () => void;
};

export const HomeProjectsSection = ({
  projects,
  tasks,
  isLoadingProjects,
  onCreateProject,
}: HomeProjectsSectionProps) => {
  return (
    <section>
      <SectionHeader
        icon={<FolderKanban className="size-5" />}
        title="Dự án của tôi"
        rightContent={
          <Button onClick={onCreateProject} size="sm" className="gap-1">
            <Plus className="size-4" /> Tạo project
          </Button>
        }
      />
      {isLoadingProjects ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          Đang tải...
        </div>
      ) : projects.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
            <p className="text-sm text-muted-foreground">
              Chưa có project nào. Tạo project đầu tiên để bắt đầu.
            </p>
            <Button onClick={onCreateProject}>Tạo project</Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectsGrid projects={projects} tasks={tasks} />
      )}
    </section>
  );
};
