/// <reference types="vite/client" />

import type { JarvisBridge } from "@jarvis/contracts";

declare global {
  interface Window {
    readonly jarvis: JarvisBridge;
  }
}

export {};
