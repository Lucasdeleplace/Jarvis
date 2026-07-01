/**
 * Contrats des canaux IPC entre le process main (Node) et le renderer (React).
 * Le renderer n'accede jamais directement a Node/OS : tout passe par cette API.
 */
export const IPC_CHANNELS = {
    getAppInfo: "app:get-info",
    ping: "app:ping",
};
//# sourceMappingURL=ipc.js.map