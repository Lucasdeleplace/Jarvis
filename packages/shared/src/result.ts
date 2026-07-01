import type { Result } from "@jarvis/contracts";

/** Construit un resultat de succes. */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/** Construit un resultat d'erreur. */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/** Type guard : le resultat est-il un succes ? */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}
