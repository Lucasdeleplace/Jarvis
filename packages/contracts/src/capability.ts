/**
 * Une "capability" est une unite d'action de l'agent (lancer une app,
 * chercher un fichier, controler l'ecran...). Meme contrat pour le natif
 * et pour les plugins.
 */

import type { Id, Result } from "./common.js";

export type CapabilityId = Id<"capability">;

export interface CapabilityContext {
  readonly sessionId: string;
  readonly signal?: AbortSignal;
}

export interface Capability<TInput = unknown, TOutput = unknown> {
  readonly id: CapabilityId;
  readonly name: string;
  readonly description: string;
  readonly requiredPermissions: readonly string[];
  execute(input: TInput, ctx: CapabilityContext): Promise<Result<TOutput>>;
}

export interface CapabilityRegistry {
  register(capability: Capability): void;
  get(id: CapabilityId): Capability | undefined;
  list(): readonly Capability[];
}
