import {
  Button,
  FileText,
  Icon,
  RefreshCw,
  Sparkles,
  Square,
  User,
  cn,
} from "@jarvis/ui-kit";
import type { Attachment, Message } from "../types.js";
import { useChatStore } from "../store.js";
import { Markdown } from "./markdown.js";
import { CopyButton } from "./copy-button.js";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function AttachmentChip({ attachment }: { readonly attachment: Attachment }): JSX.Element {
  if (attachment.mime.startsWith("image/") && attachment.dataUrl) {
    return (
      <img
        src={attachment.dataUrl}
        alt={attachment.name}
        className="h-24 w-24 rounded-lg border border-border object-cover"
      />
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2">
      <Icon icon={FileText} size="sm" className="text-muted-foreground" />
      <div className="min-w-0">
        <div className="truncate text-xs font-medium">{attachment.name}</div>
        <div className="text-[0.7rem] text-muted-foreground">{formatBytes(attachment.size)}</div>
      </div>
    </div>
  );
}

export function MessageItem({ message }: { readonly message: Message }): JSX.Element {
  const regenerate = useChatStore((state) => state.regenerate);
  const stopStreaming = useChatStore((state) => state.stopStreaming);
  const isAssistant = message.role === "assistant";
  const isEmpty = message.content.length === 0;

  return (
    <div className={cn("group px-4 py-5", isAssistant && "bg-surface/40")}>
      <div className="mx-auto flex max-w-3xl gap-4">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isAssistant ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon icon={isAssistant ? Sparkles : User} size="sm" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-semibold text-muted-foreground">
            {isAssistant ? "Jarvis" : "Vous"}
          </div>

          {message.attachments && message.attachments.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <AttachmentChip key={attachment.id} attachment={attachment} />
              ))}
            </div>
          ) : null}

          {isAssistant ? (
            isEmpty && message.streaming ? (
              <div className="flex items-center gap-1 py-1 text-muted-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
              </div>
            ) : (
              <div className="text-foreground">
                <Markdown content={message.content} />
                {message.streaming ? (
                  <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-primary" />
                ) : null}
              </div>
            )
          ) : (
            <div className="whitespace-pre-wrap break-words text-sm text-foreground">
              {message.content}
            </div>
          )}

          <div
            className={cn(
              "mt-2 flex items-center gap-1 transition-opacity",
              message.streaming ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            {!isEmpty ? <CopyButton text={message.content} label="Copier" /> : null}
            {isAssistant && message.streaming ? (
              <Button variant="ghost" size="sm" onClick={() => stopStreaming(message.id)}>
                <Icon icon={Square} size="xs" />
                <span>Arreter</span>
              </Button>
            ) : null}
            {isAssistant && !message.streaming ? (
              <Button variant="ghost" size="sm" onClick={() => void regenerate(message.id)}>
                <Icon icon={RefreshCw} size="xs" />
                <span>Regenerer</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
