"use client";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function Select({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select…",
  className,
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900",
          "focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200",
          "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400",
          "transition-colors"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
