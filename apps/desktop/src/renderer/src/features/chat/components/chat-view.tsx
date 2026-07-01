import { useEffect, useRef } from "react";
import {
  Button,
  Icon,
  Sparkles,
  Star,
  cn,
} from "@jarvis/ui-kit";
import { useChatStore } from "../store.js";
import { MessageItem } from "./message-item.js";
import { Composer } from "./composer.js";

const SUGGESTIONS: readonly string[] = [
  "Explique-moi une fonction TypeScript",
  "Donne-moi un exemple de code",
  "Qu'est-ce que Jarvis peut faire ?",
];

function EmptyState(): JSX.Element {
  const sendMessage = useChatStore((state) => state.sendMessage);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Icon icon={Sparkles} size="xl" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Comment puis-je vous aider ?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reponses simulees — aucun modele reel n'est encore connecte.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => void sendMessage(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ChatView(): JSX.Element {
  const chat = useChatStore(
    (state) => state.chats.find((item) => item.id === state.currentChatId) ?? null,
  );
  const toggleFavorite = useChatStore((state) => state.toggleFavorite);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chat?.messages]);

  const hasMessages = chat !== null && chat.messages.length > 0;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      {chat !== null ? (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <h1 className="truncate text-sm font-medium">{chat.title}</h1>
          <Button
            variant="ghost"
            size="icon"
            aria-label={chat.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={() => toggleFavorite(chat.id)}
          >
            <Icon
              icon={Star}
              size="sm"
              className={cn(chat.favorite ? "fill-warning text-warning" : "text-muted-foreground")}
            />
          </Button>
        </header>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {hasMessages ? (
          <div className="pb-4">
            {chat.messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={endRef} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <Composer />
    </div>
  );
}
