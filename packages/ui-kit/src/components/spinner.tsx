import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn.js";

export interface SpinnerProps {
  readonly className?: string;
  readonly size?: number;
  readonly label?: string;
}

/** Indicateur de chargement circulaire accessible. */
export function Spinner({ className, size = 16, label = "Chargement" }: SpinnerProps): JSX.Element {
  return (
    <Loader2
      size={size}
      role="status"
      aria-label={label}
      className={cn("animate-spin text-current", className)}
    />
  );
}
