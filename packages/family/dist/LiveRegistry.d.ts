import { type FamilyTool } from "./family.js";
/** Where the figures come from. Swap in a caching mirror without touching a component. */
export type RegistryEndpoints = {
    /** crates.io API root: `GET {crates}/crates?ids[]=a&ids[]=b` */
    crates: string;
    /** npm registry root: `GET {npmRegistry}/<name>/latest` */
    npmRegistry: string;
    /** npm downloads API root: `GET {npmDownloads}/point/last-month/a,b` */
    npmDownloads: string;
};
export declare const REGISTRY_ENDPOINTS: RegistryEndpoints;
/** The packages to look up. Pass only names the build verified as the family's own. */
export type LiveRegistryRequest = {
    crates: string[];
    npm: string[];
};
export type LiveRegistryFacts = {
    crates?: {
        version: string;
        downloads: number;
    };
    npm?: {
        version: string;
        lastMonth: number;
    };
    /** The repository's latest GitHub release: the version of a tool that ships from Git only. */
    release?: {
        version: string;
    };
};
/**
 * Fetches the current figures for the requested packages. Resolves with
 * whatever answered; a registry that did not answer simply leaves its
 * packages out, so the caller keeps the values it already shows.
 */
export declare function fetchLiveRegistry(request: LiveRegistryRequest, endpoints?: RegistryEndpoints): Promise<Record<string, LiveRegistryFacts>>;
/** One member in a build-time snapshot, as `ferramenta.dev`'s stats script writes it. */
export type RegistryStat = {
    crates: {
        version: string;
        downloads: number;
    } | null;
    /** `placeholder` marks a name held on npm with nothing behind it yet. */
    npm: {
        version: string;
        lastMonth: number;
        placeholder?: boolean;
    } | null;
    /** The repository's latest GitHub release, when it has one. */
    release?: {
        version: string;
    } | null;
};
/**
 * The build-time snapshot, keyed by member name. Only packages the build
 * verified as the family's own belong in it: the live request is derived from
 * it, so a same-named package someone else published never reaches the page.
 */
export type RegistrySnapshot = Record<string, null | RegistryStat | undefined>;
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
/**
 * The packages worth asking for live: every verified crate, and npm only for a
 * member without one — the crate's version is the one shown, so asking npm for
 * it too would be a request whose answer never reaches the page.
 */
export declare function liveRequestFor(snapshot: RegistrySnapshot): LiveRegistryRequest;
/**
 * The facts for one member, from a snapshot and whatever answered live. With
 * a snapshot entry, live values only refresh what the build verified; without
 * one, the live facts stand on their own (the metrics service filters by owner).
 */
export declare function toolFacts(tool: FamilyTool, snapshotStat: null | RegistryStat | undefined, live?: LiveRegistryFacts): ToolFacts;
export declare const METRICS_URL = "https://metrics.sebastian-software.com/v1/metrics.json";
export type FamilyMetrics = {
    /** Generation time lets snapshot-backed pages reject an older cached response. */
    generatedAt?: string;
    facts: Record<string, LiveRegistryFacts>;
    /** Which registries the service answered for; the rest need a direct request. */
    answered: {
        crates: boolean;
        npm: boolean;
    };
};
/** The family's facts from the metrics document, or null when it did not answer usefully. */
export declare function fetchFamilyMetrics(url?: string): Promise<FamilyMetrics | null>;
export type FamilyFactsOptions = {
    /** The metrics document; `false` skips it and asks the registries directly. */
    metrics?: false | string;
    /** Ignore metrics older than the build-time snapshot. */
    snapshotGeneratedAt?: string;
    /** The registries asked directly for what the metrics service did not answer. */
    endpoints?: RegistryEndpoints;
};
/**
 * Live facts for the family: the metrics service first; for a registry it did
 * not answer (down, or not deployed yet), the registries directly, for the
 * packages the snapshot verified. Whatever answers nowhere keeps its build value.
 */
export declare function fetchFamilyFacts(snapshot: RegistrySnapshot, { endpoints, metrics, snapshotGeneratedAt, }?: FamilyFactsOptions): Promise<Record<string, LiveRegistryFacts>>;
/** `fetchFamilyFacts` after hydration: empty during prerender and until something answers. */
export declare function useFamilyFacts(snapshot: RegistrySnapshot, options?: FamilyFactsOptions): Record<string, LiveRegistryFacts>;
/**
 * The live figures for a page, after hydration. Returns an empty map during
 * prerender and until the registries answer, so a component renders its
 * build-time value first and swaps in the live one when it arrives.
 */
export declare function useLiveRegistry(request: LiveRegistryRequest, endpoints?: RegistryEndpoints): Record<string, LiveRegistryFacts>;
