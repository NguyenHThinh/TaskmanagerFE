import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  projectName?: string;
  tasksCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
};

export const ProjectHeaderSection = ({ projectName, tasksCount, todoCount, inProgressCount, doneCount }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <CardTitle>{projectName ?? "Task Management"}</CardTitle>
          <CardDescription>Jira-style board cho project. Đồng bộ theo API mới từ backend.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{tasksCount} tasks</Badge>
          <Badge variant="secondary">TODO {todoCount}</Badge>
          <Badge variant="secondary">IN PROGRESS {inProgressCount}</Badge>
          <Badge variant="secondary">DONE {doneCount}</Badge>
        </div>
      </CardHeader>
    </Card>
  );
};
