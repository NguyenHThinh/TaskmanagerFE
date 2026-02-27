import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export type CustomSelecterProps = {
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  arrowClassName?: string;
  emptyText?: string;
};

export const CustomSelecter = ({
  id,
  options,
  onChange,
  defaultValue,
  placeholder,
  className,
  arrowClassName,
  emptyText,
}: CustomSelecterProps) => {
  return (
    <div className="relative">
      {emptyText && options.length === 0 && (
        <p
          className={cn(
            "w-max h-10 flex items-center justify-center rounded-md border border-input bg-background px-3 text-sm cursor-pointer",
            className,
          )}
        >
          {emptyText}
        </p>
      )}

      {options.length > 0 && (
        <select
          id={id}
          value={defaultValue ?? ""}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          aria-placeholder={placeholder || "Select an option"}
          className={cn(
            "appearance-none px-2.5 pr-6 h-10 rounded-md border border-input bg-background text-sm cursor-pointer",
            className,
          )}
        >
          {options.map((option) => (
            <option
              id={`${id}-option-${option.value}`}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      {options.length > 0 && (
        <ChevronDownIcon
          className={cn(
            "size-4 absolute right-2 top-1/2 -translate-y-1/2 transition-transform pointer-events-none",
            arrowClassName,
          )}
        />
      )}
    </div>
  );
};
