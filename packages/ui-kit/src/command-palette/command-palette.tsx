import { useMemo } from "react";
import { CornerDownLeft } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/command.js";
import { Kbd } from "../components/kbd.js";
import { Icon } from "../icons/icon.js";
import { cn } from "../lib/cn.js";
import { useCommandPalette } from "./command-palette-context.js";
import type { CommandAction } from "./types.js";

const DEFAULT_GROUP = "Commandes";

export interface CommandPaletteProps {
  /** Commandes statiques additionnelles, fusionnees avec le registre. */
  readonly actions?: readonly CommandAction[];
  readonly placeholder?: string;
  readonly emptyMessage?: string;
}

function groupActions(
  actions: readonly CommandAction[],
): ReadonlyArray<readonly [string, readonly CommandAction[]]> {
  const groups = new Map<string, CommandAction[]>();
  for (const action of actions) {
    const key = action.group ?? DEFAULT_GROUP;
    const bucket = groups.get(key);
    if (bucket) bucket.push(action);
    else groups.set(key, [action]);
  }
  return [...groups.entries()];
}

/**
 * Palette de commandes modale, inspiree de Raycast et de VS Code.
 * Rendue une seule fois pres de la racine ; alimentee par le registre
 * du CommandPaletteProvider et/ou par la prop `actions`.
 */
export function CommandPalette({
  actions = [],
  placeholder = "Rechercher une commande...",
  emptyMessage = "Aucun resultat.",
}: CommandPaletteProps): JSX.Element {
  const { open, setOpen, actions: registered } = useCommandPalette();

  const grouped = useMemo(
    () => groupActions([...registered, ...actions]),
    [registered, actions],
  );

  const run = (action: CommandAction): void => {
    if (action.disabled) return;
    setOpen(false);
    void action.perform();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        {grouped.map(([group, groupActionsList]) => (
          <CommandGroup key={group} heading={group}>
            {groupActionsList.map((action) => (
              <CommandItem
                key={action.id}
                value={`${action.label} ${(action.keywords ?? []).join(" ")}`}
                disabled={action.disabled}
                onSelect={() => run(action)}
              >
                {action.icon ? (
                  <Icon icon={action.icon} size="sm" className="text-muted-foreground" />
                ) : null}
                <span className="flex-1 truncate">{action.label}</span>
                {action.shortcut ? (
                  <span className="flex items-center gap-1">
                    {action.shortcut.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </span>
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      <CommandPaletteFooter />
    </CommandDialog>
  );
}

function CommandPaletteFooter(): JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-t border-border px-4 py-2",
        "text-xs text-muted-foreground",
      )}
    >
      <span className="font-medium">Jarvis</span>
      <span className="flex items-center gap-1">
        Selectionner
        <Kbd>
          <CornerDownLeft size={11} />
        </Kbd>
      </span>
    </div>
  );
}
