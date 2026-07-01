import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn.js";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Element decoratif place avant le champ (ex. icone de recherche). */
  readonly leadingAddon?: ReactNode;
  readonly trailingAddon?: ReactNode;
  readonly invalid?: boolean;
}

/** Champ de saisie texte, avec addons optionnels. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leadingAddon, trailingAddon, invalid, disabled, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border bg-input px-3",
        "border-border transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40",
        invalid && "border-danger focus-within:border-danger focus-within:ring-danger/40",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {leadingAddon ? <span className="text-muted-foreground">{leadingAddon}</span> : null}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid}
        className={cn(
          "w-full bg-transparent text-sm text-foreground outline-none",
          "placeholder:text-muted-foreground",
        )}
        {...props}
      />
      {trailingAddon ? <span className="text-muted-foreground">{trailingAddon}</span> : null}
    </div>
  );
});
