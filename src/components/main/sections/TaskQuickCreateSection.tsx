import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomSelecter } from "@/components/CustomSelecter";
import type { Project } from "@/types/project";
import type { TaskPriority } from "@/types/task";

type Props = {
  projects: Project[];
  activeProjectId: string | null;
  title: string;
  priority: TaskPriority;
  isCreatingTask: boolean;
  onProjectChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority) => void;
  onCreateTask: () => void;
};

export const TaskQuickCreateSection = ({
  projects,
  activeProjectId,
  title,
  priority,
  isCreatingTask,
  onProjectChange,
  onTitleChange,
  onPriorityChange,
  onCreateTask,
}: Props) => {
  return (
    <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <CustomSelecter
        options={projects.map((project) => ({ label: `${project.key} - ${project.name}`, value: project._id }))}
        onChange={onProjectChange}
        defaultValue={activeProjectId ?? ""}
        placeholder="Select a project"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        arrowClassName="size-4 absolute right-2 top-1/2 -translate-y-1/2 transition-transform"
        emptyText={projects.length === 0 ? "No projects" : undefined}
      />

      <Input placeholder="Nhập task mới..." value={title} onChange={(event) => onTitleChange(event.target.value)} />

      <select
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value as TaskPriority)}
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <Button onClick={onCreateTask} disabled={!activeProjectId || isCreatingTask || !title.trim()}>
        {isCreatingTask ? "Đang tạo..." : "+ Tạo task"}
      </Button>
    </CardContent>
  );
};
