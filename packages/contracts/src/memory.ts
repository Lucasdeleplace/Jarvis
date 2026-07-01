/**
 * Contrat de la memoire persistante (court terme, long terme, semantique).
 */

import type { Id, IsoDateString } from "./common.js";

export type MemoryId = Id<"memory">;

export type MemoryKind = "short_term" | "long_term" | "semantic";

export interface MemoryRecord {
  readonly id: MemoryId;
  readonly kind: MemoryKind;
  readonly content: string;
  readonly createdAt: IsoDateString;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface MemoryStore {
  remember(record: Omit<MemoryRecord, "id" | "createdAt">): Promise<MemoryRecord>;
  recall(query: string, k: number): Promise<readonly MemoryRecord[]>;
  forget(id: MemoryId): Promise<void>;
}
