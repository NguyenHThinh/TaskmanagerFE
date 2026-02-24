"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AccessChecking } from "@/components/common/AccessChecking";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PROJECTS_QUERY_KEY } from "@/hooks/useProjects";
import { createProject, getProjects } from "@/services/projectService";
import { useAuthStore } from "@/store/authStore";
import type { CreateProjectPayload, ProjectCategory } from "@/types/project";
import { ProjectBasicInfoSection } from "@/components/projects/sections/ProjectBasicInfoSection";
import { ProjectCategorySection } from "@/components/projects/sections/ProjectCategorySection";
import { ProjectDescriptionSection } from "@/components/projects/sections/ProjectDescriptionSection";
import { ProjectTimelineSection } from "@/components/projects/sections/ProjectTimelineSection";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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

export const NewProjectPageContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [keyEdited, setKeyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("SOFTWARE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });

  useEffect(() => {
    let isMounted = true;

    const guard = async () => {
      try {
        let token = accessToken;

        if (!token) {
          try {
            const refreshResponse = await axios.post<{ data?: { accessToken?: string } }>(
              `${API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true },
            );
            const refreshedToken = refreshResponse.data?.data?.accessToken;
            if (refreshedToken) {
              token = refreshedToken;
              setAccessToken(refreshedToken);
            }
          } catch {
            // ignore
          }
        }

        if (!token) {
          clearAccessToken();
          if (isMounted) router.replace("/login");
          return;
        }

        const projects = await getProjects();
        if (projects.length > 0 && isMounted) {
          router.replace("/");
          return;
        }
      } catch {
        clearAccessToken();
        if (isMounted) router.replace("/login");
        return;
      } finally {
        if (isMounted) setIsCheckingAccess(false);
      }
    };

    void guard();

    return () => {
      isMounted = false;
    };
  }, [accessToken, clearAccessToken, router, setAccessToken]);

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
    router.push("/");
  };

  const isValid = name.trim().length > 0 && /^[A-Z0-9]{2,10}$/.test(key);
  const errorMessage = isError && error instanceof Error ? error.message : "Không thể tạo project";

  if (isCheckingAccess) return <AccessChecking />;

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Tạo Project mới</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Project luôn là private. Chỉ thành viên được thêm vào mới có quyền truy cập.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <ProjectBasicInfoSection name={name} keyValue={key} onNameChange={handleNameChange} onKeyChange={handleKeyChange} />
        <ProjectCategorySection category={category} onCategoryChange={setCategory} />
        <ProjectDescriptionSection description={description} onDescriptionChange={setDescription} />
        <ProjectTimelineSection
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {isError ? (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Huỷ
          </Button>
          <Button type="submit" disabled={isPending || !isValid}>
            {isPending ? "Đang tạo..." : "Tạo Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};
