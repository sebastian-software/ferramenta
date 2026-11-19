import type { FamilyMetrics, LiveRegistryFacts, RegistrySnapshot } from "./LiveRegistry.js";
/** Merge GitHub observations independently of the registry snapshot's age. */
export declare function mergeReleaseFacts(base: Record<string, LiveRegistryFacts>, metrics: FamilyMetrics | null, snapshot: RegistrySnapshot, generatedAt: string | undefined): Record<string, LiveRegistryFacts>;
