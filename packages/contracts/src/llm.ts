/**
 * Abstraction du fournisseur de modele de langage (Ollama aujourd'hui,
 * autres moteurs demain). Aucune implementation ici.
 */

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  readonly role: ChatRole;
  readonly content: string;
}

export interface LlmModelInfo {
  readonly id: string;
  readonly contextLength: number;
  readonly supportsVision: boolean;
  readonly supportsTools: boolean;
}

export interface ChatOptions {
  readonly model?: string;
  readonly temperature?: number;
  readonly signal?: AbortSignal;
}

export interface LlmProvider {
  readonly name: string;
  chat(messages: readonly ChatMessage[], options?: ChatOptions): AsyncIterable<string>;
  embed(text: string): Promise<readonly number[]>;
  listModels(): Promise<readonly LlmModelInfo[]>;
}
