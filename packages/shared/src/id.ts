/** Generation d'identifiants (wrapper autour de l'API crypto standard). */
export function createId(): string {
  return crypto.randomUUID();
}
