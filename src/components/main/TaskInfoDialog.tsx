"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelecter } from "@/components/common/CustomSelecter";
import { InlineEditableField } from "@/components/common/InlineEditableField";
import { InlineEditableSelect } from "@/components/common/InlineEditableSelect";
import {
  TASK_TYPE_LABELS,
  TASK_TYPE_ICONS,
  TASK_TYPES,
  TASK_PRIORITIES,
  STATUS_OPTIONS,
  EST_OPTIONS,
  getTaskTypeIcon,
} from "@/constants/task";
import { ChevronDown, ChevronRight, Link2 } from "lucide-react";
import type { Project } from "@/types/project";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task";
import type { CreateTaskPayload } from "@/types/task";

const TASK_TYPE_OPTIONS = TASK_TYPES.map((value) => ({
  label: `${TASK_TYPE_ICONS[value]} ${TASK_TYPE_LABELS[value]}`,
  value,
}));

const formatDateInput = (d: string | null | undefined) =>
  d ? new Date(d).toISOString().slice(0, 10) : "";
const formatDateDisplay = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const formatEst = (mins: number | null | undefined) =>
  mins != null ? `${mins} phút` : "";

type TaskInfoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  defaultStatus: TaskStatus;
  project: Project | null;
  stories: Task[];
  subtasks: Task[];
  isCreating: boolean;
  isUpdating: boolean;
  onCreateTask: (payload: CreateTaskPayload) => Promise<void>;
  onUpdateTask: (taskId: string, payload: Partial<CreateTaskPayload>) => Promise<void>;
};

export const TaskInfoDialog = ({
  open,
  onOpenChange,
  task,
  defaultStatus,
  project,
  stories,
  subtasks,
  isCreating,
  isUpdating,
  onCreateTask,
  onUpdateTask,
}: TaskInfoDialogProps) => {
  const isCreateMode = !task;
  const [detailsOpen, setDetailsOpen] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>("TASK");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimateMinutes, setEstimateMinutes] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description ?? "");
        setType((task.type as TaskType) ?? "TASK");
        setStatus(task.status);
        setPriority(task.priority);
        setAssigneeId(task.assigneeId ?? "");
        setDueDate(formatDateInput(task.dueDate));
        setEstimateMinutes(task.estimateMinutes != null ? String(task.estimateMinutes) : "");
        setParentId(task.parentId ?? "");
      } else {
        setTitle("");
        setDescription("");
        setType("TASK");
        setStatus(defaultStatus);
        setPriority("MEDIUM");
        setAssigneeId("");
        setDueDate("");
        setEstimateMinutes("");
        setParentId("");
      }
    }
  }, [open, task, defaultStatus]);

  const handleTypeChange = (v: string) => {
    const newType = v as TaskType;
    setType(newType);
    if (newType === "STORY") setParentId("");
    if (task) void onUpdateTask(task._id, { type: newType, parentId: newType === "STORY" ? undefined : parentId || undefined });
  };

  const assigneeOptions = [
    { label: "Chưa phân công", value: "" },
    ...(project?.members ?? []).map((m) => ({
      label: `User ${String(m.userId).slice(-6)}`,
      value: m.userId,
    })),
  ];

  const storyOptions = [
    { label: "Không có", value: "" },
    ...stories.map((s) => ({ label: `${TASK_TYPE_ICONS.STORY} ${s.title}`, value: s._id })),
  ];

  const handleCreate = async () => {
    if (!title.trim()) return;
    await onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      status,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      estimateMinutes: estimateMinutes ? parseInt(estimateMinutes, 10) : undefined,
      parentId: parentId && type !== "STORY" ? parentId : undefined,
    });
    onOpenChange(false);
  };

  const handleFieldUpdate = (field: keyof CreateTaskPayload, value: unknown) => {
    if (!task) return;
    if (field === "title") setTitle(value as string);
    if (field === "description") setDescription((value as string) ?? "");
    if (field === "status") setStatus(value as TaskStatus);
    if (field === "priority") setPriority(value as TaskPriority);
    if (field === "assigneeId") setAssigneeId((value as string | undefined) ?? "");
    if (field === "dueDate") setDueDate((value as string) ?? "");
    if (field === "estimateMinutes") setEstimateMinutes(value != null ? String(value) : "");
    if (field === "parentId") setParentId((value as string) ?? "");
    void onUpdateTask(task._id, { [field]: value });
  };

  const taskKey = task && project ? `${project.key}-${task._id.slice(-6)}` : "";
  const parentStory = parentId ? stories.find((s) => s._id === parentId) : null;

  const renderBreadcrumb = () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{project?.name ?? "Project"}</span>
      <span>/</span>
      {isCreateMode ? (
        <span>Tạo task mới</span>
      ) : (
        <>
          <span className="flex items-center gap-1.5">
            <span aria-hidden>{getTaskTypeIcon(type)}</span>
            {taskKey}
          </span>
        </>
      )}
    </div>
  );

  const renderLeftContent = () => (
    <div className="flex flex-col gap-6">
      {renderBreadcrumb()}

      {/* Title */}
      <div>
        {isCreateMode ? (
          <Input
            placeholder="Nhập tiêu đề task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-0 px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
          />
        ) : (
          <InlineEditableField
            value={title}
            onChange={(v) => handleFieldUpdate("title", v)}
            placeholder="Nhấn để nhập tiêu đề"
            displayClassName="text-xl font-semibold"
          />
        )}
      </div>

      {/* Description */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Mô tả</h3>
        {isCreateMode ? (
          <textarea
            placeholder="Thêm mô tả..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            maxLength={5000}
          />
        ) : (
          <InlineEditableField
            value={description}
            onChange={(v) => handleFieldUpdate("description", v)}
            placeholder="Thêm mô tả..."
            as="textarea"
            maxLength={5000}
          />
        )}
      </section>

      {/* Subtasks (chỉ khi xem task) */}
      {!isCreateMode && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Subtasks</h3>
          {subtasks.length === 0 ? (
            <p className="rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
              Thêm subtask
            </p>
          ) : (
            <ul className="space-y-1">
              {subtasks.map((st) => (
                <li key={st._id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
                  <span>{getTaskTypeIcon(st.type)}</span>
                  <span>{st.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Linked work items (Parent story) */}
      {!isCreateMode && type !== "STORY" && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Linked work items</h3>
          {parentStory ? (
            <p className="flex items-center gap-2 text-sm">
              <Link2 className="size-4 text-muted-foreground" />
              {TASK_TYPE_ICONS.STORY} {parentStory.title}
            </p>
          ) : (
            <p className="rounded-md border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
              Thêm linked work item
            </p>
          )}
        </section>
      )}

      {/* Activity / Comments - tạm ẩn */}
    </div>
  );

  const renderDetailsSection = () => {
    const DetailRow = ({
      label,
      children,
    }: {
      label: string;
      children: React.ReactNode;
    }) => (
      <div className="flex items-center justify-between gap-2 py-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="min-w-0 flex-1 text-right">{children}</div>
      </div>
    );

    return (
      <>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Trạng thái</label>
          {isCreateMode ? (
            <CustomSelecter
              id="task-status"
              options={STATUS_OPTIONS}
              onChange={(v) => setStatus(v as TaskStatus)}
              defaultValue={status}
              className="h-9 w-full rounded-md border border-input bg-background px-2 pr-6 text-sm"
              emptyText="-"
            />
          ) : (
            <InlineEditableSelect
              value={status}
              onChange={(v) => handleFieldUpdate("status", v)}
              options={STATUS_OPTIONS}
              placeholder="Nhấn để chọn"
            />
          )}
        </div>

        <div className="border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex w-full items-center justify-between gap-2 py-1 text-sm font-semibold text-foreground"
          >
            <span>Details</span>
            {detailsOpen ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </button>

          {detailsOpen && (
            <div className="mt-2 space-y-0 divide-y divide-border/50">
              <DetailRow label="Assignee">
                {isCreateMode ? (
                  <CustomSelecter
                    id="task-assignee"
                    options={assigneeOptions}
                    onChange={setAssigneeId}
                    defaultValue={assigneeId}
                    placeholder="Chưa phân công"
                    className="h-8 min-w-[120px] rounded border-0 bg-transparent px-1 text-right text-sm"
                    emptyText="No members"
                  />
                ) : (
                  <InlineEditableSelect
                    value={assigneeId}
                    onChange={(v) => handleFieldUpdate("assigneeId", v)}
                    options={assigneeOptions}
                    placeholder="Chưa phân công"
                  />
                )}
              </DetailRow>
              <DetailRow label="Parent">
                {isCreateMode ? (
                  type !== "STORY" ? (
                    <CustomSelecter
                      id="task-parent"
                      options={storyOptions}
                      onChange={setParentId}
                      defaultValue={parentId}
                      placeholder="Không có"
                      className="h-8 min-w-[120px] rounded border-0 bg-transparent px-1 text-right text-sm"
                      emptyText="No stories"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )
                ) : (
                  type !== "STORY" ? (
                    <InlineEditableSelect
                      value={parentId}
                      onChange={(v) => handleFieldUpdate("parentId", v || undefined)}
                      options={storyOptions}
                      placeholder="Không có"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )
                )}
              </DetailRow>
              <DetailRow label="Due date">
                {isCreateMode ? (
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-8 border-0 bg-transparent px-1 text-right text-sm"
                  />
                ) : (
                  <InlineEditableField
                    value={dueDate}
                    onChange={(v) => handleFieldUpdate("dueDate", v || undefined)}
                    type="date"
                    displayFormat={formatDateDisplay}
                    placeholder="Không có"
                  />
                )}
              </DetailRow>
              <DetailRow label="EST">
                {isCreateMode ? (
                  <CustomSelecter
                    id="task-est"
                    options={EST_OPTIONS}
                    onChange={setEstimateMinutes}
                    defaultValue={estimateMinutes}
                    placeholder="Không ước tính"
                    className="h-8 min-w-[120px] rounded border-0 bg-transparent px-1 text-right text-sm"
                    emptyText="-"
                  />
                ) : (
                  <InlineEditableSelect
                    value={estimateMinutes}
                    onChange={(v) => handleFieldUpdate("estimateMinutes", v ? parseInt(v, 10) : undefined)}
                    options={EST_OPTIONS}
                    displayText={estimateMinutes ? formatEst(parseInt(estimateMinutes, 10)) : undefined}
                    placeholder="Không ước tính"
                  />
                )}
              </DetailRow>
              <DetailRow label="Loại">
                {isCreateMode ? (
                  <CustomSelecter
                    id="task-type"
                    options={TASK_TYPE_OPTIONS}
                    onChange={handleTypeChange}
                    defaultValue={type}
                    className="h-8 min-w-[120px] rounded border-0 bg-transparent px-1 text-right text-sm"
                    emptyText="No types"
                  />
                ) : (
                  <InlineEditableSelect
                    value={type}
                    onChange={handleTypeChange}
                    options={TASK_TYPE_OPTIONS}
                    placeholder="Chọn loại"
                  />
                )}
              </DetailRow>
              <DetailRow label="Ưu tiên">
                {isCreateMode ? (
                  <CustomSelecter
                    id="task-priority"
                    options={TASK_PRIORITIES.map((p) => ({ label: p.label, value: p.value }))}
                    onChange={(v) => setPriority(v as TaskPriority)}
                    defaultValue={priority}
                    className="h-8 min-w-[120px] rounded border-0 bg-transparent px-1 text-right text-sm"
                    emptyText="No priorities"
                  />
                ) : (
                  <InlineEditableSelect
                    value={priority}
                    onChange={(v) => handleFieldUpdate("priority", v)}
                    options={TASK_PRIORITIES.map((p) => ({ label: p.label, value: p.value }))}
                    placeholder="Chọn ưu tiên"
                  />
                )}
              </DetailRow>
              <DetailRow label="Reporter">
                <span className="text-muted-foreground">—</span>
              </DetailRow>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden p-0 sm:max-w-6xl" showCloseButton>
        <div className="flex flex-1 flex-col overflow-y-auto sm:flex-row">
          {/* Left: 60-65% */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 border-b border-border p-6 sm:border-b-0 sm:border-r sm:pr-8">
            {renderLeftContent()}
          </div>

          {/* Right: 35-40% */}
          <div className="w-full shrink-0 flex-col gap-4 border-t border-border bg-muted/20 p-6 sm:w-80 sm:border-t-0 sm:border-l-0">
            {renderDetailsSection()}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-border bg-background px-6 py-4">
          {isCreateMode ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={() => void handleCreate()} disabled={isCreating || !title.trim()}>
                {isCreating ? "Đang tạo..." : "Tạo task"}
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
