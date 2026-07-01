export type MessageRole = "user" | "assistant";

export interface Attachment {
  readonly id: string;
  readonly name: string;
  readonly mime: string;
  readonly size: number;
  /** Data URL pour les apercus d'images (limite en taille). */
  readonly dataUrl?: string;
}

export interface Message {
  readonly id: string;
  readonly role: MessageRole;
  content: string;
  readonly createdAt: number;
  readonly attachments?: readonly Attachment[];
  /** Vrai tant que la reponse est en cours de streaming. */
  streaming?: boolean;
}

export interface Chat {
  readonly id: string;
  title: string;
  readonly createdAt: number;
  updatedAt: number;
  favorite: boolean;
  messages: Message[];
}
