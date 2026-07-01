import { lazy, Suspense, useMemo, useState } from "react";
import {
  CommandPalette,
  LayoutGrid,
  Monitor,
  Moon,
  Plus,
  Sparkles,
  Sun,
  useRegisterCommands,
  useTheme,
  useToast,
  type CommandAction,
} from "@jarvis/ui-kit";
import { ChatPage, useChatStore } from "@renderer/features/chat";

const IS_DEV = import.meta.env.DEV;

// Chargee en dynamique : exclue du bundle de production.
const Gallery = lazy(() =>
  import("@renderer/dev/gallery").then((module) => ({ default: module.Gallery })),
);

export function App(): JSX.Element {
  const { toast } = useToast();
  const { setTheme, toggleTheme } = useTheme();
  const createChat = useChatStore((state) => state.createChat);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const commands = useMemo<CommandAction[]>(() => {
    const actions: CommandAction[] = [
      {
        id: "chat.new",
        label: "Nouveau chat",
        group: "Conversation",
        icon: Plus,
        keywords: ["chat", "conversation", "nouveau", "new"],
        perform: () => createChat(),
      },
      {
        id: "theme.toggle",
        label: "Basculer le theme clair/sombre",
        group: "Apparence",
        icon: Sun,
        keywords: ["theme", "dark", "light", "sombre", "clair"],
        perform: toggleTheme,
      },
      {
        id: "theme.light",
        label: "Theme : Clair",
        group: "Apparence",
        icon: Sun,
        perform: () => setTheme("light"),
      },
      {
        id: "theme.dark",
        label: "Theme : Sombre",
        group: "Apparence",
        icon: Moon,
        perform: () => setTheme("dark"),
      },
      {
        id: "theme.system",
        label: "Theme : Systeme",
        group: "Apparence",
        icon: Monitor,
        perform: () => setTheme("system"),
      },
      {
        id: "ipc.ping",
        label: "Tester le pont IPC",
        group: "Systeme",
        icon: Sparkles,
        keywords: ["ping", "ipc", "test"],
        perform: () => {
          void window.jarvis.ping().then((value) =>
            toast({
              title: "Pont IPC operationnel",
              description: `Reponse du process principal : ${value}`,
              variant: "success",
            }),
          );
        },
      },
    ];

    if (IS_DEV) {
      actions.push({
        id: "dev.gallery",
        label: "Ouvrir la galerie de composants",
        group: "Developpement",
        icon: LayoutGrid,
        keywords: ["gallery", "galerie", "design system", "composants"],
        perform: () => setGalleryOpen(true),
      });
    }

    return actions;
  }, [createChat, setTheme, toggleTheme, toast]);

  useRegisterCommands(commands);

  if (IS_DEV && galleryOpen) {
    return (
      <Suspense fallback={<div className="h-full bg-background" />}>
        <Gallery onClose={() => setGalleryOpen(false)} />
      </Suspense>
    );
  }

  return (
    <div className="h-full">
      <CommandPalette />
      <ChatPage />
    </div>
  );
}
