import { type ReactNode } from "react";
import { type FamilyTool } from "./family.js";
import { type RegistryEndpoints, type RegistrySnapshot, type ToolFacts } from "./LiveRegistry.js";
export type RegistryFactsProps = {
    /**
     * The build-time snapshot. Without one every member shows its registry
     * fallback version and nothing is fetched: there is no verified package to ask for.
     */
    snapshot?: RegistrySnapshot;
    /** Where the live figures come from; defaults to the public registries. */
    endpoints?: RegistryEndpoints;
    children: ReactNode;
};
/**
 * Provides registry figures to the tool ledger, the board and the download
 * tally below it: the snapshot during prerender, live values after hydration.
 */
export declare function RegistryFacts({ children, endpoints, snapshot }: RegistryFactsProps): import("react").JSX.Element;
/** A member's facts inside `RegistryFacts`; the fallback version outside it. */
export declare function useToolFacts(tool: FamilyTool): ToolFacts;
/** A count in the page's tabular mono, formatted the same on server and client. */
export declare function Count({ value }: {
    value: number;
}): import("react").JSX.Element;
/** All-time crates.io downloads across the family's published crates, live once they answer. */
export declare function FamilyDownloads(): import("react").JSX.Element;
