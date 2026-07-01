import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useHotkey } from "../hooks/use-hotkeys.js";
import type { CommandAction } from "./types.js";

interface CommandPaletteContextValue {
  readonly open: boolean;
  setOpen(open: boolean): void;
  toggle(): void;
  /** Toutes les actions enregistrees, dans l'ordre d'enregistrement. */
  readonly actions: readonly CommandAction[];
  /**
   * Enregistre un lot d'actions et renvoie une fonction de desinscription.
   * A appeler dans un effet pour brancher dynamiquement de nouvelles commandes.
   */
  register(actions: readonly CommandAction[]): () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export interface CommandPaletteProviderProps {
  readonly children: ReactNode;
  /** Raccourci d'ouverture/fermeture. Defaut : "mod+k". */
  readonly hotkey?: string;
  /** Desactive le raccourci global (ex. pour le gerer soi-meme). */
  readonly disableHotkey?: boolean;
}

/**
 * Fournit l'etat de la palette et un registre de commandes extensible.
 * Le raccourci global (Cmd/Ctrl + K par defaut) bascule l'ouverture.
 */
export function CommandPaletteProvider({
  children,
  hotkey = "mod+k",
  disableHotkey = false,
}: CommandPaletteProviderProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [registry, setRegistry] = useState<ReadonlyMap<number, readonly CommandAction[]>>(
    () => new Map(),
  );
  const nextKey = useRef(0);

  const toggle = useCallback(() => setOpen((value) => !value), []);

  const register = useCallback((actions: readonly CommandAction[]): (() => void) => {
    const key = nextKey.current++;
    setRegistry((current) => {
      const next = new Map(current);
      next.set(key, actions);
      return next;
    });
    return () => {
      setRegistry((current) => {
        const next = new Map(current);
        next.delete(key);
        return next;
      });
    };
  }, []);

  const actions = useMemo<readonly CommandAction[]>(
    () => [...registry.values()].flat(),
    [registry],
  );

  useHotkey(hotkey, toggle, { enabled: !disableHotkey });

  const value = useMemo<CommandPaletteContextValue>(
    () => ({ open, setOpen, toggle, actions, register }),
    [open, toggle, actions, register],
  );

  return (
    <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);
  if (context === null) {
    throw new Error(
      "useCommandPalette doit etre utilise a l'interieur d'un <CommandPaletteProvider>.",
    );
  }
  return context;
}
