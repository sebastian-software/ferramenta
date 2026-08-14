/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 */
export type FamilyStatus = "stable" | "beta" | "alpha" | "early";
export interface FamilyTool {
    /** Package/repo name, e.g. "ferriki" */
    name: string;
    /** One-line job description — the subheader under the tool name */
    job: string;
    /** Terse job label for constrained family navigation surfaces */
    shortJob: string;
    /** Which established API/contract it stays compatible with */
    compat?: string;
    /** Proof sentence: verifiable facts, no marketing claims */
    proof: string;
    /** Compact, verifiable evidence for the family overview */
    evidence: string;
    /** Latest released version (plain semver, no "v" prefix) */
    version: string;
    /** Maturity, shown as a stamp next to the version */
    status: FamilyStatus;
    /** Registry where the package is published */
    registry: "crates.io" | "npm";
    /** Human-readable registry availability, e.g. "crates.io + npm"; empty = not yet published */
    registries?: string;
    /** GitHub repository URL */
    repo: string;
    /** Docs/homepage site, once it exists */
    docs?: string;
    /** True for the ferroni → ferriki → ferromark content pipeline (array order = chain order) */
    pipeline?: boolean;
    /** Sub-family, e.g. "palamedes" for the i18n/language toolchain */
    subFamily?: string;
}
export declare const FAMILY_SITE = "https://ferramenta.dev";
export declare const family: FamilyTool[];
/** The three display groups of the overview page, in order. */
export declare function familyGroups(): {
    pipeline: FamilyTool[];
    language: FamilyTool[];
    workbench: FamilyTool[];
};
