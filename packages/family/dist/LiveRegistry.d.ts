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
};
/**
 * Fetches the current figures for the requested packages. Resolves with
 * whatever answered; a registry that did not answer simply leaves its
 * packages out, so the caller keeps the values it already shows.
 */
export declare function fetchLiveRegistry(request: LiveRegistryRequest, endpoints?: RegistryEndpoints): Promise<Record<string, LiveRegistryFacts>>;
/**
 * The live figures for a page, after hydration. Returns an empty map during
 * prerender and until the registries answer, so a component renders its
 * build-time value first and swaps in the live one when it arrives.
 */
export declare function useLiveRegistry(request: LiveRegistryRequest, endpoints?: RegistryEndpoints): Record<string, LiveRegistryFacts>;
