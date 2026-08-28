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
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 select-none">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-9 w-full rounded-md border border-neutral-200 bg-white px-3 pr-8 text-sm text-neutral-900",
          "appearance-none cursor-pointer",
          "focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300",
          "hover:border-neutral-300",
          "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:opacity-60",
          "transition-colors"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
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
