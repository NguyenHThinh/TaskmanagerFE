"use client";

import { Button } from "@/components/ui/button";

export const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 flex h-desktop-header-height items-center justify-between border-b border-border bg-background/95 px-6 py-2.5 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Task Management Workspace</h1>
        <p className="text-xs text-muted-foreground">Projects · Kanban · Tasks · Comments</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="hidden sm:inline-flex">
          Filters
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          NA
        </Button>
      </div>
    </header>
  );
};
