import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import {
  Button,
  Icon,
  Paperclip,
  Send,
  Square,
  Textarea,
  X,
  cn,
} from "@jarvis/ui-kit";
import type { Attachment } from "../types.js";
import { useChatStore } from "../store.js";

const MAX_IMAGE_PREVIEW_BYTES = 1.5 * 1024 * 1024;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Lecture impossible"));
    reader.readAsDataURL(file);
  });
}

export function Composer(): JSX.Element {
  const sendMessage = useChatStore((state) => state.sendMessage);
  const stopStreaming = useChatStore((state) => state.stopStreaming);
  const isStreaming = useChatStore((state) => {
    const chat = state.chats.find((item) => item.id === state.currentChatId);
    return chat?.messages.some((message) => message.streaming) ?? false;
  });

  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = (): void => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`;
  };

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (!files) return;
    const next: Attachment[] = [];
    for (const file of Array.from(files)) {
      const base: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
      };
      if (file.type.startsWith("image/") && file.size <= MAX_IMAGE_PREVIEW_BYTES) {
        try {
          next.push({ ...base, dataUrl: await readAsDataUrl(file) });
          continue;
        } catch {
          /* ignore, on garde les metadonnees */
        }
      }
      next.push(base);
    }
    setAttachments((current) => [...current, ...next]);
    event.target.value = "";
  };

  const submit = (): void => {
    if (isStreaming) return;
    if (text.trim().length === 0 && attachments.length === 0) return;
    void sendMessage(text, attachments);
    setText("");
    setAttachments([]);
    requestAnimationFrame(resize);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <div className="mx-auto max-w-3xl">
        {attachments.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 rounded-md border border-border bg-surface-raised py-1 pl-2 pr-1 text-xs"
              >
                <span className="max-w-[10rem] truncate">{attachment.name}</span>
                <button
                  type="button"
                  aria-label="Retirer la piece jointe"
                  className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id),
                    )
                  }
                >
                  <Icon icon={X} size="xs" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            "flex items-end gap-2 rounded-xl border border-border bg-surface p-2",
            "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => void handleFiles(event)}
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Joindre un fichier"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon icon={Paperclip} size="sm" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              resize();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Envoyer un message... (Entree pour envoyer, Maj+Entree pour un saut de ligne)"
            className="max-h-[200px] min-h-[40px] resize-none border-0 bg-transparent px-1 py-2 focus-visible:ring-0"
          />

          {isStreaming ? (
            <Button variant="danger" size="icon" aria-label="Arreter" onClick={() => stopStreaming()}>
              <Icon icon={Square} size="sm" />
            </Button>
          ) : (
            <Button
              size="icon"
              aria-label="Envoyer"
              disabled={text.trim().length === 0 && attachments.length === 0}
              onClick={submit}
            >
              <Icon icon={Send} size="sm" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
