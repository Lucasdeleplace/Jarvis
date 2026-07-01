import { ChatSidebar } from "./chat-sidebar.js";
import { ChatView } from "./chat-view.js";

/** Systeme de conversation complet : historique + conversation active. */
export function ChatPage(): JSX.Element {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChatSidebar />
      <ChatView />
    </div>
  );
}
