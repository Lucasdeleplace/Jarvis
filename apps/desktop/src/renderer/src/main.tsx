import React from "react";
import ReactDOM from "react-dom/client";
import {
  CommandPaletteProvider,
  ThemeProvider,
  ToastProvider,
  TooltipProvider,
} from "@jarvis/ui-kit";
import { App } from "@renderer/App";
import "@jarvis/ui-kit/styles.css";
import "@renderer/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Element racine #root introuvable.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider delayDuration={200}>
        <ToastProvider>
          <CommandPaletteProvider>
            <App />
          </CommandPaletteProvider>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
