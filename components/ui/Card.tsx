import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
