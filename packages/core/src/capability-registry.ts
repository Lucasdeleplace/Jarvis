import type { Capability, CapabilityId, CapabilityRegistry } from "@jarvis/contracts";

/**
 * Registre de capabilities en memoire (base structurelle, sans capability metier).
 * Les capacites concretes seront enregistrees ulterieurement par l'infrastructure.
 */
export class InMemoryCapabilityRegistry implements CapabilityRegistry {
  private readonly capabilities = new Map<string, Capability>();

  public register(capability: Capability): void {
    this.capabilities.set(capability.id, capability);
  }

  public get(id: CapabilityId): Capability | undefined {
    return this.capabilities.get(id);
  }

  public list(): readonly Capability[] {
    return [...this.capabilities.values()];
  }
}
