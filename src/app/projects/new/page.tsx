"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createProject, getProjects } from "@/services/projectService";
import { PROJECTS_QUERY_KEY } from "@/hooks/useProjects";
import { useAuthStore } from "@/store/authStore";
import type { ProjectCategory, CreateProjectPayload } from "@/types/project";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const CATEGORY_OPTIONS: { value: ProjectCategory; label: string; icon: string }[] = [
  { value: "SOFTWARE", label: "Phần mềm", icon: "💻" },
  { value: "MARKETING", label: "Marketing", icon: "📢" },
  { value: "DESIGN", label: "Thiết kế", icon: "🎨" },
  { value: "HR", label: "Nhân sự", icon: "👥" },
  { value: "FINANCE", label: "Tài chính", icon: "💰" },
  { value: "OPERATIONS", label: "Vận hành", icon: "⚙️" },
  { value: "OTHER", label: "Khác", icon: "📋" },
];

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

export default function NewProjectPage() {
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
            // ignore, handled below
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

  if (isCheckingAccess) {
    return <div className="px-6 py-10 text-sm text-muted-foreground">Đang kiểm tra truy cập...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Tạo Project mới</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Project luôn là private. Chỉ thành viên được thêm vào mới có quyền truy cập.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thông tin cơ bản</CardTitle>
            <CardDescription>Tên và mã định danh cho project</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">Tên project *</Label>
              <Input
                id="project-name"
                placeholder="Ví dụ: Website Redesign"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                maxLength={120}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="project-key">Mã project (KEY) *</Label>
              <Input
                id="project-key"
                placeholder="Ví dụ: WR"
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                maxLength={10}
                required
              />
              <p className="text-xs text-muted-foreground">
                2-10 ký tự viết hoa (A-Z, 0-9). Dùng làm prefix cho mã task (VD: WR-1, WR-2).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Phân loại</CardTitle>
            <CardDescription>Chọn loại project phù hợp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategory(opt.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                    category === opt.value
                      ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Mô tả</CardTitle>
            <CardDescription>Giải thích ngắn gọn về project</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              id="project-description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Mô tả mục tiêu, phạm vi của project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thời gian</CardTitle>
            <CardDescription>Ngày bắt đầu và kết thúc (tuỳ chọn)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="start-date">Ngày bắt đầu</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="end-date">Ngày kết thúc</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </CardContent>
        </Card>

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
}
