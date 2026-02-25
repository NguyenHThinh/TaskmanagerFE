import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export type CustomSelecterProps = {
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
}

export const CustomSelecter = ({ options, onChange, defaultValue, placeholder, className, arrowClassName, emptyText }: CustomSelecterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {emptyText && options.length === 0 && <p className={cn("w-max", className)}>{emptyText}</p>}
            {options.length > 0 && (
                <select
                    value={defaultValue ?? ""}
                    onChange={(e) => { onChange(e.target.value); setIsOpen(false); }}
                    aria-placeholder={placeholder || "Select an option"}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className={cn("appearance-none", className)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            )}
            {options.length > 0 && <ChevronDownIcon className={cn("size-4 absolute right-2 top-1/2 -translate-y-1/2 transition-transform", arrowClassName, isOpen ? "rotate-180" : "")} />}
        </div>
    )
}