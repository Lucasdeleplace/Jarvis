import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS, type AppInfo, type JarvisBridge } from "@jarvis/contracts";

/**
 * Pont securise expose au renderer. Seules ces methodes sont accessibles
 * depuis React : le renderer n'a jamais d'acces direct a Node/OS.
 */
const bridge: JarvisBridge = {
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke(IPC_CHANNELS.getAppInfo),
  ping: (): Promise<"pong"> => ipcRenderer.invoke(IPC_CHANNELS.ping),
};

contextBridge.exposeInMainWorld("jarvis", bridge);
