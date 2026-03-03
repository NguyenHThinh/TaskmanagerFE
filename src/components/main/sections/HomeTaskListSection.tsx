import Link from "next/link";
import type { ReactNode } from "react";

import SectionHeader from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTaskTypeIcon } from "@/constants/task";
import { PRIORITY_LABELS } from "@/constants/home";
import type { TaskWithProject } from "@/hooks/useAllProjectsTasks";
import { formatDueDate } from "@/utils/home";

type HomeTaskListSectionProps = {
  title: string;
  icon: ReactNode;
  tasks: TaskWithProject[];
  isLoading: boolean;
  emptyMessage: string;
};

export const HomeTaskListSection = ({
  title,
  icon,
  tasks,
  isLoading,
  emptyMessage,
}: HomeTaskListSectionProps) => {
  return (
    <section>
      <SectionHeader icon={icon} title={title} className="mb-4" />
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Đang tải...
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {tasks.map((task) => (
                <li key={task._id}>
                  <Link
                    href={`/project/${task.projectId}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-muted/50"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                      <span className="shrink-0" aria-hidden>
                        {getTaskTypeIcon(task.type)}
                      </span>
                      <span className="truncate">{task.title}</span>
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      {task.projectKey ? (
                        <Badge variant="outline" className="text-xs">
                          {task.projectKey}
                        </Badge>
                      ) : null}
                      <Badge variant="secondary" className="text-xs">
                        {PRIORITY_LABELS[task.priority]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDueDate(task.dueDate)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
