import { Card, CardContent } from "@/components/ui/card";

type Props = {
  isProjectsError: boolean;
  hasActiveProject: boolean;
  isLoadingTasks: boolean;
  isTasksError: boolean;
  errorMessage: string;
};

export const ProjectStateSection = ({
  isProjectsError,
  hasActiveProject,
  isLoadingTasks,
  isTasksError,
  errorMessage,
}: Props) => {
  if (isProjectsError) {
    return (
      <Card className="border-destructive">
        <CardContent className="px-4 py-6 text-sm text-destructive">
          Không thể tải projects. Kiểm tra đăng nhập và API /projects.
        </CardContent>
      </Card>
    );
  }

  if (!hasActiveProject) {
    return (
      <Card>
        <CardContent className="px-4 py-6 text-sm text-muted-foreground">Chưa có project để hiển thị board.</CardContent>
      </Card>
    );
  }

  if (isLoadingTasks) {
    return (
      <Card>
        <CardContent className="px-4 py-6 text-sm text-muted-foreground">Đang tải nhiệm vụ...</CardContent>
      </Card>
    );
  }

  if (isTasksError) {
    return (
      <Card className="border-destructive">
        <CardContent className="px-4 py-6 text-sm text-destructive">{errorMessage}</CardContent>
      </Card>
    );
  }

  return null;
};
