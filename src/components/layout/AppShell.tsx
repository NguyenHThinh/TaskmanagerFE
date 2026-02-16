"use client";

import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SidebarProvider } from "@/contexts/sidebarContext";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <SidebarProvider defaultOpen>
        <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};




