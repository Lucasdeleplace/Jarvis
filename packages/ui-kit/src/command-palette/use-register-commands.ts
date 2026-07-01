import { useEffect } from "react";
import { useCommandPalette } from "./command-palette-context.js";
import type { CommandAction } from "./types.js";

/**
 * Enregistre des commandes dans la palette pour la duree de vie du composant.
 * Memoiser `actions` (useMemo) pour eviter les re-enregistrements inutiles.
 *
 * @example
 * const actions = useMemo<CommandAction[]>(() => [...], [deps]);
 * useRegisterCommands(actions);
 */
export function useRegisterCommands(actions: readonly CommandAction[]): void {
  const { register } = useCommandPalette();
  useEffect(() => register(actions), [register, actions]);
}
