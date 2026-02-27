import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomSelecter } from "@/components/common/CustomSelecter";
import type { Project } from "@/types/project";
import type { TaskPriority } from "@/types/task";
import { TASK_PRIORITIES } from "@/constants/tasks";

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
        id="project-selecter"
        options={projects.map((project) => ({ label: `${project.key} - ${project.name}`, value: project._id }))}
        onChange={onProjectChange}
        defaultValue={activeProjectId ?? ""}
        placeholder="Select a project"
        emptyText={projects.length === 0 ? "No projects" : undefined}
      />

      <Input placeholder="Nhập task mới..." value={title} onChange={(event) => onTitleChange(event.target.value)} />

      <CustomSelecter
        id="priority-selecter"
        options={TASK_PRIORITIES.map((priority) => ({ label: priority.label, value: priority.value }))}
        onChange={(value) => onPriorityChange(value as TaskPriority)}
        defaultValue={priority ?? ""}
        className="h-10 leading-10 w-max rounded-md border border-input bg-background px-3 pr-6 text-sm"
        emptyText={TASK_PRIORITIES.length === 0 ? "No priorities" : undefined}
      />

      <Button onClick={onCreateTask} disabled={!activeProjectId || isCreatingTask || !title.trim()}>
        {isCreatingTask ? "Đang tạo..." : "+ Tạo task"}
      </Button>
    </CardContent>
  );
};
