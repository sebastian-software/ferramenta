/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking and consistent descriptions.
 */
export interface FamilyTool {
    /** Package/repo name, e.g. "ferriki" */
    name: string;
    /** One-line job description */
    job: string;
    /** Which established API/contract it stays compatible with */
    compat?: string;
    /** Registry where the package is published */
    registry: "crates.io" | "npm";
    /** GitHub repository URL */
    repo: string;
    /** Docs site, once it exists */
    docs?: string;
    /** True for the ferroni → ferriki → ferromark content pipeline */
    pipeline?: boolean;
    /** Sub-family, e.g. "palamedes" for the i18n toolchain */
    subFamily?: string;
}
export declare const FAMILY_SITE = "https://ferramenta.dev";
export declare const family: FamilyTool[];
