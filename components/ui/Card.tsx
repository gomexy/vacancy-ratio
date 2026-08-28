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
      className={cn("rounded-xl bg-white p-6", className)}
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {children}
    </div>
  );
}
