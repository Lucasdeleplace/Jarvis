import { useMemo, useState, type KeyboardEvent } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Input,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  StarOff,
  ThemeToggle,
  Trash2,
  cn,
} from "@jarvis/ui-kit";
import type { Chat } from "../types.js";
import { useChatStore } from "../store.js";

function matchesSearch(chat: Chat, query: string): boolean {
  if (query.length === 0) return true;
  const needle = query.toLowerCase();
  if (chat.title.toLowerCase().includes(needle)) return true;
  return chat.messages.some((message) => message.content.toLowerCase().includes(needle));
}

interface ChatRowProps {
  readonly chat: Chat;
  readonly active: boolean;
}

function ChatRow({ chat, active }: ChatRowProps): JSX.Element {
  const selectChat = useChatStore((state) => state.selectChat);
  const renameChat = useChatStore((state) => state.renameChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const toggleFavorite = useChatStore((state) => state.toggleFavorite);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chat.title);

  const commit = (): void => {
    renameChat(chat.id, draft);
    setEditing(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    } else if (event.key === "Escape") {
      setDraft(chat.title);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="px-1 py-0.5">
        <Input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          className="h-8"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors",
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
      )}
    >
      <button
        type="button"
        onClick={() => selectChat(chat.id)}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        {chat.favorite ? (
          <Icon icon={Star} size="xs" className="shrink-0 fill-warning text-warning" />
        ) : null}
        <span className="truncate text-sm">{chat.title}</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Options du chat"
            className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
          >
            <Icon icon={MoreHorizontal} size="xs" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Icon icon={Pencil} size="xs" />
            Renommer
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toggleFavorite(chat.id)}>
            <Icon icon={chat.favorite ? StarOff : Star} size="xs" />
            {chat.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => deleteChat(chat.id)}
            className="text-danger focus:bg-danger/10 focus:text-danger"
          >
            <Icon icon={Trash2} size="xs" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SectionLabel({ children }: { readonly children: string }): JSX.Element {
  return (
    <div className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}

export function ChatSidebar(): JSX.Element {
  const chats = useChatStore((state) => state.chats);
  const currentChatId = useChatStore((state) => state.currentChatId);
  const search = useChatStore((state) => state.search);
  const setSearch = useChatStore((state) => state.setSearch);
  const createChat = useChatStore((state) => state.createChat);

  const { favorites, others } = useMemo(() => {
    const filtered = chats
      .filter((chat) => matchesSearch(chat, search.trim()))
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return {
      favorites: filtered.filter((chat) => chat.favorite),
      others: filtered.filter((chat) => !chat.favorite),
    };
  }, [chats, search]);

  const isEmpty = favorites.length === 0 && others.length === 0;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between px-3 py-3">
        <span className="text-sm font-semibold">
          Jarvis <span className="text-primary">Chat</span>
        </span>
        <Button size="sm" onClick={() => createChat()} leftIcon={<Icon icon={Plus} size="xs" />}>
          Nouveau
        </Button>
      </div>

      <div className="px-3 pb-2">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher..."
          leadingAddon={<Icon icon={Search} size="sm" />}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {isEmpty ? (
          <p className="px-2 py-8 text-center text-sm text-muted-foreground">
            {search.trim().length > 0 ? "Aucun resultat." : "Aucune conversation."}
          </p>
        ) : (
          <>
            {favorites.length > 0 ? (
              <>
                <SectionLabel>Favoris</SectionLabel>
                {favorites.map((chat) => (
                  <ChatRow key={chat.id} chat={chat} active={chat.id === currentChatId} />
                ))}
              </>
            ) : null}
            {others.length > 0 ? (
              <>
                <SectionLabel>Historique</SectionLabel>
                {others.map((chat) => (
                  <ChatRow key={chat.id} chat={chat} active={chat.id === currentChatId} />
                ))}
              </>
            ) : null}
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
