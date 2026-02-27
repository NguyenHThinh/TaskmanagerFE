"use client";

import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PROJECTS_QUERY_KEY } from "@/hooks/useProjects";
import { createProject } from "@/services/projectService";
import type { CreateProjectPayload, ProjectCategory } from "@/types/project";
import { ProjectBasicInfoSection } from "@/components/projects/sections/ProjectBasicInfoSection";
import { ProjectCategorySection } from "@/components/projects/sections/ProjectCategorySection";
import { ProjectDescriptionSection } from "@/components/projects/sections/ProjectDescriptionSection";
import { ProjectTimelineSection } from "@/components/projects/sections/ProjectTimelineSection";

type CreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const generateKey = (name: string): string => {
  return (
    name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 6) || ""
  );
};

const INITIAL_STATE = {
  name: "",
  key: "",
  keyEdited: false,
  description: "",
  category: "SOFTWARE" as ProjectCategory,
  startDate: "",
  endDate: "",
};

export const CreateProjectDialog = ({ open, onOpenChange }: CreateProjectDialogProps) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState(INITIAL_STATE.name);
  const [key, setKey] = useState(INITIAL_STATE.key);
  const [keyEdited, setKeyEdited] = useState(INITIAL_STATE.keyEdited);
  const [description, setDescription] = useState(INITIAL_STATE.description);
  const [category, setCategory] = useState<ProjectCategory>(INITIAL_STATE.category);
  const [startDate, setStartDate] = useState(INITIAL_STATE.startDate);
  const [endDate, setEndDate] = useState(INITIAL_STATE.endDate);

  const { mutateAsync, isPending, isError, error, reset } = useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      setName(INITIAL_STATE.name);
      setKey(INITIAL_STATE.key);
      setKeyEdited(INITIAL_STATE.keyEdited);
      setDescription(INITIAL_STATE.description);
      setCategory(INITIAL_STATE.category);
      setStartDate(INITIAL_STATE.startDate);
      setEndDate(INITIAL_STATE.endDate);
      reset();
    }
  }, [open, reset]);

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (!keyEdited) {
        setKey(generateKey(value));
      }
    },
    [keyEdited],
  );

  const handleKeyChange = useCallback((value: string) => {
    setKeyEdited(true);
    setKey(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateProjectPayload = {
      name: name.trim(),
      key,
      description: description.trim() || undefined,
      category,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    await mutateAsync(payload);
  };

  const isValid = name.trim().length > 0 && /^[A-Z0-9]{2,10}$/.test(key);
  const errorMessage = isError && error instanceof Error ? error.message : "Không thể tạo project";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-6xl flex flex-col overflow-hidden" showCloseButton>
        <DialogHeader>
          <DialogTitle>Tạo Project mới</DialogTitle>
          <DialogDescription>Project luôn là private. Chỉ thành viên được thêm vào mới có quyền truy cập.</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ProjectBasicInfoSection
              name={name}
              keyValue={key}
              onNameChange={handleNameChange}
              onKeyChange={handleKeyChange}
              className="col-span-2"
            />
            <ProjectTimelineSection
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              className="col-span-1"
              contentClassName="flex-col"
            />
          </div>
          <ProjectCategorySection category={category} onCategoryChange={setCategory} />
          <ProjectDescriptionSection
            description={description}
            onDescriptionChange={setDescription}
          />

          {isError ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? "Đang tạo..." : "Tạo Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
