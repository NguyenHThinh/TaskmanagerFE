import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { AVATAR_COLORS } from "@/constants/home";
import type { TaskWithProject } from "@/hooks/useAllProjectsTasks";
import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatProjectDate, getProjectProgress } from "@/utils/home";

type ProjectsGridProps = {
  projects: Project[];
  tasks: TaskWithProject[];
};

export const ProjectsGrid = ({ projects, tasks }: ProjectsGridProps) => {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {projects.map((project) => {
        const progress = getProjectProgress(project._id, tasks);

        return (
          <Card key={project._id} className="overflow-hidden p-0">
            <CardContent className="p-0">
              <Link
                href={`/project/${project._id}`}
                className="flex h-full flex-col justify-between gap-3 p-4 transition hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((member, index) => (
                        <span
                          key={member.userId}
                          className={`flex size-8 items-center justify-center rounded-full border-2 border-card text-xs font-medium text-foreground ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
                          title={member.userId}
                        >
                          {String(member.userId).slice(-2).toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {formatProjectDate(project.endDate)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Badge variant="secondary" className="text-xs">
                      {progress}%
                    </Badge>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
