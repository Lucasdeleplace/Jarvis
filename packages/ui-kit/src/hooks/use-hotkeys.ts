import { useEffect } from "react";

/** Indique si la plateforme courante est macOS (pour Cmd vs Ctrl). */
export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const source = navigator.userAgent || navigator.platform || "";
  return /mac|iphone|ipad|ipod/i.test(source);
}

/** Retourne le libelle de la touche de modification principale ("⌘" ou "Ctrl"). */
export function modKeyLabel(): string {
  return isMac() ? "⌘" : "Ctrl";
}

export interface HotkeyOptions {
  /** Desactive l'ecoute quand false. Par defaut : true. */
  readonly enabled?: boolean;
  /** Empeche le comportement par defaut du navigateur. Par defaut : true. */
  readonly preventDefault?: boolean;
  /** Cible d'ecoute. Par defaut : document. */
  readonly target?: Document | HTMLElement | null;
}

interface ParsedCombo {
  readonly key: string;
  readonly mod: boolean;
  readonly ctrl: boolean;
  readonly meta: boolean;
  readonly shift: boolean;
  readonly alt: boolean;
}

function parseCombo(combo: string): ParsedCombo {
  const parts = combo.toLowerCase().split("+").map((part) => part.trim());
  return {
    key: parts[parts.length - 1] ?? "",
    mod: parts.includes("mod"),
    ctrl: parts.includes("ctrl"),
    meta: parts.includes("meta"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
  };
}

function matches(event: KeyboardEvent, combo: ParsedCombo): boolean {
  if (event.key.toLowerCase() !== combo.key) return false;

  const modActive = isMac() ? event.metaKey : event.ctrlKey;
  if (combo.mod && !modActive) return false;

  if (combo.ctrl && !event.ctrlKey) return false;
  if (combo.meta && !event.metaKey) return false;
  if (event.shiftKey !== combo.shift) return false;
  if (event.altKey !== combo.alt) return false;

  return true;
}

/**
 * Lie un raccourci clavier a un gestionnaire.
 * Le jeton "mod" correspond a Cmd sur macOS et Ctrl ailleurs.
 *
 * @example useHotkey("mod+k", () => setOpen(true));
 */
export function useHotkey(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
): void {
  const { enabled = true, preventDefault = true, target } = options;

  useEffect(() => {
    if (!enabled) return;
    const node = target ?? (typeof document !== "undefined" ? document : null);
    if (node === null) return;

    const parsed = parseCombo(combo);
    const listener = (event: Event): void => {
      const keyboardEvent = event as KeyboardEvent;
      if (matches(keyboardEvent, parsed)) {
        if (preventDefault) keyboardEvent.preventDefault();
        handler(keyboardEvent);
      }
    };

    node.addEventListener("keydown", listener);
    return () => node.removeEventListener("keydown", listener);
  }, [combo, handler, enabled, preventDefault, target]);
}
