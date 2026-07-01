import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Placeholder anime pendant le chargement des contenus. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-foreground/10 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
