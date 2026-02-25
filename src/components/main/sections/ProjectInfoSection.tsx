import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/project";

type Props = {
  project: Project | null;
};

export const ProjectInfoSection = ({ project }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Project info</CardTitle>
        <CardDescription>Thông tin nhanh project hiện tại</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Key:</span> {project?.key ?? "-"}
        </p>
        <p>
          <span className="text-muted-foreground">Members:</span> {project?.members.length ?? 0}
        </p>
        <p>
          <span className="text-muted-foreground">Description:</span> {project?.description || "No description"}
        </p>
      </CardContent>
    </Card>
  );
};
