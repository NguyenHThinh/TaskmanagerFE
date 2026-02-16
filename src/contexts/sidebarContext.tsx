"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
};

type SidebarProviderProps = {
  children: ReactNode;
  defaultOpen?: boolean;
};

export const SidebarProvider = ({ children, defaultOpen = true }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};
