"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCreateProjectDialog } from "@/contexts/AppDialogContext";
import { LAYOUT_NAVIGATION } from "@/constants/layout";

export const Sidebar = () => {
  const { open: openCreateProject } = useCreateProjectDialog();

  return (
    <aside className="hidden min-h-screen w-72 flex-col gap-8 border-r border-border bg-card px-6 py-8 shadow-xl lg:flex">
      <div className="h-desktop-header-height" />

      <Button onClick={openCreateProject} className="w-full justify-start gap-2" variant="default">
        <Plus className="size-4" />
        Tạo project
      </Button>

      <nav className="flex flex-col gap-2">
        {LAYOUT_NAVIGATION.map((item: { label: string; href: string }) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-xl border border-border bg-muted/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">MVP Status</p>
        <p className="mt-1 text-sm font-semibold text-foreground">Projects / Tasks / Comments API</p>
        <p className="mt-2 text-xs text-muted-foreground">Frontend synced with backend MVP endpoints</p>
      </div>
    </aside>
  );
};
