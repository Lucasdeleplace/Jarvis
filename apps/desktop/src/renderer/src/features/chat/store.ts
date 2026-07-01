import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Attachment, Chat, Message } from "./types.js";
import { simulateResponse, streamText } from "./simulate.js";

/** Controleurs d'annulation par message en cours de streaming (non serialise). */
const controllers = new Map<string, AbortController>();

function createId(): string {
  return crypto.randomUUID();
}

function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length === 0) return "Nouveau chat";
  return clean.length > 40 ? `${clean.slice(0, 40)}...` : clean;
}

interface ChatState {
  readonly chats: readonly Chat[];
  readonly currentChatId: string | null;
  readonly search: string;

  createChat(): string;
  deleteChat(id: string): void;
  renameChat(id: string, title: string): void;
  toggleFavorite(id: string): void;
  selectChat(id: string): void;
  setSearch(query: string): void;

  sendMessage(text: string, attachments?: readonly Attachment[]): Promise<void>;
  regenerate(messageId: string): Promise<void>;
  stopStreaming(messageId?: string): void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      const patchChat = (chatId: string, updater: (chat: Chat) => Chat): void => {
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === chatId ? updater(chat) : chat)),
        }));
      };

      const patchMessage = (
        chatId: string,
        messageId: string,
        updater: (message: Message) => Message,
      ): void => {
        patchChat(chatId, (chat) => ({
          ...chat,
          messages: chat.messages.map((message) =>
            message.id === messageId ? updater(message) : message,
          ),
        }));
      };

      const runStream = async (
        chatId: string,
        messageId: string,
        prompt: string,
      ): Promise<void> => {
        const controller = new AbortController();
        controllers.set(messageId, controller);
        const full = simulateResponse(prompt);
        try {
          await streamText(
            full,
            (chunk) =>
              patchMessage(chatId, messageId, (message) => ({
                ...message,
                content: message.content + chunk,
              })),
            controller.signal,
          );
        } finally {
          controllers.delete(messageId);
          patchMessage(chatId, messageId, (message) => ({ ...message, streaming: false }));
          patchChat(chatId, (chat) => ({ ...chat, updatedAt: Date.now() }));
        }
      };

      return {
        chats: [],
        currentChatId: null,
        search: "",

        createChat(): string {
          const id = createId();
          const now = Date.now();
          const chat: Chat = {
            id,
            title: "Nouveau chat",
            createdAt: now,
            updatedAt: now,
            favorite: false,
            messages: [],
          };
          set((state) => ({ chats: [chat, ...state.chats], currentChatId: id }));
          return id;
        },

        deleteChat(id: string): void {
          set((state) => {
            const chats = state.chats.filter((chat) => chat.id !== id);
            const currentChatId =
              state.currentChatId === id ? (chats[0]?.id ?? null) : state.currentChatId;
            return { chats, currentChatId };
          });
        },

        renameChat(id: string, title: string): void {
          const clean = title.trim();
          if (clean.length === 0) return;
          patchChat(id, (chat) => ({ ...chat, title: clean }));
        },

        toggleFavorite(id: string): void {
          patchChat(id, (chat) => ({ ...chat, favorite: !chat.favorite }));
        },

        selectChat(id: string): void {
          set({ currentChatId: id });
        },

        setSearch(query: string): void {
          set({ search: query });
        },

        async sendMessage(text: string, attachments?: readonly Attachment[]): Promise<void> {
          const clean = text.trim();
          if (clean.length === 0 && (attachments?.length ?? 0) === 0) return;

          let chatId = get().currentChatId;
          if (chatId === null || !get().chats.some((chat) => chat.id === chatId)) {
            chatId = get().createChat();
          }

          const now = Date.now();
          const userMessage: Message = {
            id: createId(),
            role: "user",
            content: clean,
            createdAt: now,
            attachments: attachments && attachments.length > 0 ? attachments : undefined,
          };

          patchChat(chatId, (chat) => ({
            ...chat,
            title: chat.messages.length === 0 ? deriveTitle(clean) : chat.title,
            updatedAt: now,
            messages: [...chat.messages, userMessage],
          }));

          const assistantId = createId();
          const assistantMessage: Message = {
            id: assistantId,
            role: "assistant",
            content: "",
            createdAt: Date.now(),
            streaming: true,
          };
          patchChat(chatId, (chat) => ({
            ...chat,
            messages: [...chat.messages, assistantMessage],
          }));

          await runStream(chatId, assistantId, clean);
        },

        async regenerate(messageId: string): Promise<void> {
          const chatId = get().currentChatId;
          if (chatId === null) return;
          const chat = get().chats.find((item) => item.id === chatId);
          if (!chat) return;

          const index = chat.messages.findIndex((message) => message.id === messageId);
          if (index < 0) return;

          // Retrouve le dernier message utilisateur precedent comme invite.
          let prompt = "";
          for (let i = index - 1; i >= 0; i -= 1) {
            const candidate = chat.messages[i];
            if (candidate && candidate.role === "user") {
              prompt = candidate.content;
              break;
            }
          }

          patchMessage(chatId, messageId, (message) => ({
            ...message,
            content: "",
            streaming: true,
          }));

          await runStream(chatId, messageId, prompt);
        },

        stopStreaming(messageId?: string): void {
          if (messageId !== undefined) {
            controllers.get(messageId)?.abort();
            return;
          }
          for (const controller of controllers.values()) {
            controller.abort();
          }
        },
      };
    },
    {
      name: "jarvis-chat",
      partialize: (state) => ({
        chats: state.chats.map((chat) => ({
          ...chat,
          messages: chat.messages.map((message) => ({ ...message, streaming: false })),
        })),
        currentChatId: state.currentChatId,
      }),
    },
  ),
);
