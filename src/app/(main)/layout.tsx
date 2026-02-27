import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { AppDialogProvider } from "@/contexts/AppDialogContext";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppDialogProvider>
      <AppShell>{children}</AppShell>
    </AppDialogProvider>
  );
}
