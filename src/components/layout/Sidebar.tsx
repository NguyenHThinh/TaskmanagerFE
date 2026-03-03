"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FolderKanban,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/sidebarContext";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/utils";

const SIDEBAR_WIDTH_OPEN = "w-72";
const SIDEBAR_WIDTH_CLOSED = "w-16";
const PROJECTS_LIMIT = 4;

export const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const { projects } = useProjects();
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const displayProjects = projects.slice(0, PROJECTS_LIMIT);

  return (
    <aside
      className={cn(
        "hidden min-h-screen flex-col gap-6 border-r border-border bg-card px-4 py-8 shadow-xl transition-[width] duration-200 lg:flex",
        isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED
      )}
    >
      <div className="flex h-desktop-header-height items-center justify-between gap-2">
        {isOpen ? (
          <>
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-foreground"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
                TM
              </span>
              <span className="truncate">Task Manager</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsOpen(false)}
              aria-label="Thu gọn sidebar"
            >
              <PanelLeftClose className="size-5" />
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
              aria-label="Task Manager"
            >
              TM
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsOpen(true)}
              aria-label="Mở rộng sidebar"
            >
              <PanelLeft className="size-5" />
            </Button>
          </>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {isOpen ? (
          <>
            <button
              type="button"
              onClick={() => setProjectsExpanded((p) => !p)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="size-4 shrink-0" />
                Dự án
              </span>
              {projectsExpanded ? (
                <ChevronDown className="size-4 shrink-0" />
              ) : (
                <ChevronRight className="size-4 shrink-0" />
              )}
            </button>

            {projectsExpanded && (
              <div className="ml-6 flex flex-col gap-0.5 border-l border-border pl-3">
                {displayProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/project/${project._id}`}
                    className="rounded-md px-2 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="line-clamp-1">{project.name}</span>
                  </Link>
                ))}
                <Link
                  href="/projects"
                  className="rounded-md px-2 py-2 text-sm font-medium text-primary transition hover:bg-accent hover:text-accent-foreground"
                >
                  Xem tất cả dự án
                </Link>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/projects"
            className="flex size-9 items-center justify-center rounded-lg text-foreground transition hover:bg-accent hover:text-accent-foreground"
            title="Dự án"
          >
            <FolderKanban className="size-4" />
          </Link>
        )}
      </nav>

      <div className="mt-auto rounded-xl border border-border bg-muted/50 p-3">
        {isOpen ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              MVP Status
            </p>
            <p className="mt-1 text-xs font-semibold text-foreground">
              Projects / Tasks / Comments API
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Frontend synced with backend MVP
            </p>
          </>
        ) : (
          <p className="text-center text-xs font-semibold text-muted-foreground">
            MVP
          </p>
        )}
      </div>
    </aside>
  );
};
