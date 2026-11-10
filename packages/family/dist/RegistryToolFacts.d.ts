import type { FamilyTool } from "./family.js";
import type { LiveRegistryFacts, RegistryStat } from "./LiveRegistry.js";
/** What a page shows about a member's releases. */
export type ToolFacts = {
    /** Live when the registries answered, else the snapshot, else the registry entry's fallback. */
    version: string;
    /** All-time crates.io downloads; 0 when the member has no crate. */
    crateDownloads: number;
    onCrates: boolean;
    /** Has a TypeScript/Node adapter on npm. */
    adapter: boolean;
};
/** True when a member has a real TypeScript/Node adapter on npm, not just a held name. */
export declare function hasAdapter(stat: null | RegistryStat | undefined): stat is {
    npm: NonNullable<RegistryStat["npm"]>;
} & RegistryStat;
/**
 * Facts for one member. Unpublished names never acquire a release or download
 * count from a same-named package in a stale snapshot or metrics response.
 */
export declare function toolFacts(tool: FamilyTool, snapshotStat: null | RegistryStat | undefined, live?: LiveRegistryFacts): ToolFacts;
