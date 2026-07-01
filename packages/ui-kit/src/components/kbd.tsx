import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export type KbdProps = HTMLAttributes<HTMLElement>;

/** Represente une touche ou un raccourci clavier (style Raycast/Linear). */
export function Kbd({ className, ...props }: KbdProps): JSX.Element {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded",
        "border border-border bg-surface-raised px-1.5",
        "font-mono text-[0.7rem] font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
