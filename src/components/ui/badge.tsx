import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-fg/20 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-fg/90",
        className,
      )}
    >
      {children}
    </span>
  );
}
