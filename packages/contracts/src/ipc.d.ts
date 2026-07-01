/**
 * Contrats des canaux IPC entre le process main (Node) et le renderer (React).
 * Le renderer n'accede jamais directement a Node/OS : tout passe par cette API.
 */
export interface AppInfo {
    readonly name: string;
    readonly version: string;
    readonly platform: string;
}
export declare const IPC_CHANNELS: {
    readonly getAppInfo: "app:get-info";
    readonly ping: "app:ping";
};
export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
/** API exposee au renderer via le contextBridge du preload. */
export interface JarvisBridge {
    getAppInfo(): Promise<AppInfo>;
    ping(): Promise<"pong">;
}
//# sourceMappingURL=ipc.d.ts.map