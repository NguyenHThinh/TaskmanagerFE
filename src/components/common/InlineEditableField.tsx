"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

type InlineEditableFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  as?: "input" | "textarea";
  type?: "text" | "date";
  displayFormat?: (v: string) => string;
  className?: string;
  displayClassName?: string;
  maxLength?: number;
};

export const InlineEditableField = ({
  value,
  onChange,
  placeholder = "Nhấn để nhập...",
  as = "input",
  type = "text",
  displayFormat,
  className,
  displayClassName,
  maxLength,
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleClick = () => setIsEditing(true);

  const handleBlur = () => {
    const trimmed = editValue.trim();
    if (trimmed !== value) onChange(trimmed);
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && as === "input") {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setEditValue(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      maxLength,
      className: cn(
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        as === "textarea" && "min-h-[80px] resize-y",
        className,
      ),
    };

    if (as === "textarea") {
      return <textarea {...commonProps} placeholder={placeholder} rows={4} />;
    }

    if (type === "date") {
      return (
        <input
          {...commonProps}
          type="date"
          placeholder={placeholder}
          className={cn(commonProps.className, "h-9")}
        />
      );
    }

    return <Input {...commonProps} placeholder={placeholder} />;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={cn(
        "min-h-[2.25rem] cursor-text rounded-md px-3 py-2 text-sm transition hover:bg-muted/50",
        !value && "text-muted-foreground italic",
        displayClassName,
      )}
    >
      {(displayFormat && value ? displayFormat(value) : value) || placeholder}
    </div>
  );
};
