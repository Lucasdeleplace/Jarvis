import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly invalid?: boolean;
}

/** Zone de saisie multiligne. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-border bg-input px-3 py-2",
        "text-sm text-foreground outline-none transition-colors resize-y",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        "disabled:pointer-events-none disabled:opacity-60",
        invalid && "border-danger focus-visible:border-danger focus-visible:ring-danger/40",
        className,
      )}
      {...props}
    />
  );
});
