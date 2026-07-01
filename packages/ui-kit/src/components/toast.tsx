import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "../lib/cn.js";

export type ToastVariant = "default" | "success" | "warning" | "danger";

export interface ToastOptions {
  readonly title: string;
  readonly description?: string;
  readonly variant?: ToastVariant;
  readonly duration?: number;
}

interface ToastItem extends ToastOptions {
  readonly id: string;
}

interface ToastContextValue {
  toast(options: ToastOptions): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: "border-border",
  success: "border-success/40",
  warning: "border-warning/40",
  danger: "border-danger/40",
};

export function ToastProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions): void => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...options }]);
  }, []);

  const remove = useCallback((id: string): void => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            duration={item.duration ?? 5000}
            onOpenChange={(open) => {
              if (!open) remove(item.id);
            }}
            className={cn(
              "flex items-start gap-3 rounded-lg border bg-surface-raised p-4 shadow-lg",
              "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out",
              VARIANT_STYLES[item.variant ?? "default"],
            )}
          >
            <div className="flex-1">
              <ToastPrimitive.Title className="text-sm font-semibold text-foreground">
                {item.title}
              </ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close
              aria-label="Fermer"
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X size={14} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport
          className={cn(
            "fixed bottom-0 right-0 z-[100] m-0 flex w-full max-w-sm list-none flex-col gap-2 p-4 outline-none",
          )}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error("useToast doit etre utilise a l'interieur d'un <ToastProvider>.");
  }
  return context;
}
