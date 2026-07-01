import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "../theme/theme-provider.js";
import { cn } from "../lib/cn.js";

const OPTIONS: ReadonlyArray<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
  { value: "system", label: "Systeme", icon: Monitor },
];

/** Selecteur segmente de theme (clair / sombre / systeme). */
export function ThemeToggle({ className }: { readonly className?: string }): JSX.Element {
  const { theme, setTheme } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-raised p-0.5",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, icon: Glyph }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            theme === value
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Glyph size={15} />
        </button>
      ))}
    </div>
  );
}
