/**
 * Contrats de l'orchestrateur d'agent et des evenements temps reel.
 */
import type { Id } from "./common.js";
import type { ChatMessage } from "./llm.js";
export type SessionId = Id<"session">;
export interface AgentSession {
    readonly id: SessionId;
    readonly messages: readonly ChatMessage[];
}
export type AgentEvent = {
    readonly type: "agent.thinking";
} | {
    readonly type: "agent.token";
    readonly token: string;
} | {
    readonly type: "agent.tool_call";
    readonly capabilityId: string;
} | {
    readonly type: "agent.done";
} | {
    readonly type: "agent.error";
    readonly message: string;
};
export interface Agent {
    send(sessionId: SessionId, message: string): AsyncIterable<AgentEvent>;
}
//# sourceMappingURL=agent.d.ts.map