"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";

/**
 * AppDialogContext - Quản lý dialog chung cho app.
 *
 * - Chỉ 1 dialog active tại 1 thời điểm: mở dialog mới → dialog cũ tự đóng
 * - Thêm dialog mới: thêm case trong renderDialog() + (tuỳ chọn) tạo useXxxDialog()
 *
 * @example
 * // Thêm dialog "edit-project":
 * // 1. case "edit-project": return <EditProjectDialog {...props} />;
 * // 2. export const useEditProjectDialog = () => ({ open: () => open("edit-project") });
 */
export type AppDialogKey = "create-project" | string;

type AppDialogContextValue = {
  open: (key: AppDialogKey) => void;
  close: () => void;
  activeDialog: AppDialogKey | null;
};

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

function renderDialog(
  key: AppDialogKey,
  props: { open: boolean; onOpenChange: (open: boolean) => void },
): ReactNode {
  switch (key) {
    case "create-project":
      return <CreateProjectDialog {...props} />;
    default:
      return null;
  }
}

export const AppDialogProvider = ({ children }: { children: ReactNode }) => {
  const [activeDialog, setActiveDialog] = useState<AppDialogKey | null>(null);

  const open = useCallback((key: AppDialogKey) => {
    setActiveDialog(key);
  }, []);

  const close = useCallback(() => {
    setActiveDialog(null);
  }, []);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) setActiveDialog(null);
  }, []);

  return (
    <AppDialogContext.Provider value={{ open, close, activeDialog }}>
      {children}
      {activeDialog &&
        renderDialog(activeDialog, {
          open: true,
          onOpenChange: handleOpenChange,
        })}
    </AppDialogContext.Provider>
  );
};

export const useAppDialog = (): AppDialogContextValue => {
  const ctx = useContext(AppDialogContext);
  if (!ctx) {
    throw new Error("useAppDialog must be used within AppDialogProvider");
  }
  return ctx;
};

/** Hook tiện ích cho CreateProjectDialog. Mở dialog mới sẽ đóng dialog hiện tại. */
export const useCreateProjectDialog = () => {
  const { open } = useAppDialog();
  return { open: () => open("create-project") };
};
