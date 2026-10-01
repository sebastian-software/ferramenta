import { type ReactNode } from "react";
import type { FamilyTool } from "./family.js";
import { type RegistryEndpoints, type RegistrySnapshot, type ToolFacts } from "./LiveRegistry.js";
export type RegistryFactsProps = {
    /**
     * The build-time snapshot, prerendered before anything live answers. Optional:
     * without one the page renders the registry's fallback versions first, then
     * whatever the metrics service answers.
     */
    snapshot?: RegistrySnapshot;
    /** Snapshot generation time; older metrics responses are ignored. */
    snapshotGeneratedAt?: string;
    /** The metrics document (`METRICS_URL` by default); `false` asks the registries directly. */
    metrics?: false | string;
    /** The registries asked directly for what the metrics service did not answer. */
    endpoints?: RegistryEndpoints;
    children: ReactNode;
};
/**
 * Provides registry figures to everything below it that shows a release: the
 * snapshot during prerender, live values after hydration.
 */
export declare function RegistryFacts({ children, endpoints, metrics, snapshot, snapshotGeneratedAt, }: RegistryFactsProps): import("react").JSX.Element;
/** A member's facts inside `RegistryFacts`; the fallback version outside it. */
export declare function useToolFacts(tool: FamilyTool): ToolFacts;
