"use client";

import { useState, useEffect, useRef } from "react";
import { CustomSelecter } from "@/components/common/CustomSelecter";
import { cn } from "@/utils";

type Option = { label: string; value: string };

type InlineEditableSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  displayText?: string;
  className?: string;
  selectClassName?: string;
};

export const InlineEditableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Nhấn để chọn...",
  displayText,
  className,
  selectClassName,
}: InlineEditableSelectProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  const resolvedDisplay =
    displayText ?? (options.find((o) => o.value === value)?.label ?? (value || placeholder));

  const handleClick = () => setIsEditing(true);

  const handleChange = (v: string) => {
    onChange(v);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div ref={containerRef} className={cn("w-full", selectClassName)} onClick={(e) => e.stopPropagation()}>
        <CustomSelecter
          id={`inline-select-${Math.random().toString(36).slice(2)}`}
          options={options}
          onChange={handleChange}
          defaultValue={value}
          placeholder={placeholder}
          className={cn("h-9 w-full rounded-md border border-input bg-background px-2 pr-6 text-sm", selectClassName)}
          emptyText="-"
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={cn(
        "min-h-[2.25rem] cursor-pointer rounded-md px-3 py-2 text-sm transition hover:bg-muted/50",
        !value && !displayText && "text-muted-foreground italic",
        className,
      )}
    >
      {resolvedDisplay}
    </div>
  );
};
