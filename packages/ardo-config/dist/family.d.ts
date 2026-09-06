/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 *
 * Membership rule (ADR-0001 amendment, 2026-09-06): a member is a family
 * engine, or a product built on family engines. Developer tools that share
 * neither — dalo, agent-bridge — belong to the company line, not here.
 */
export type FamilyStatus = "alpha" | "beta" | "early" | "stable";
/** Display group on the overview page, the header flyout, and the footer. */
export type FamilyGroup = "language" | "pipeline" | "workbench";
/**
 * What a member is. Engines are libraries that succeed an established
 * implementation; applications are products the family's engines carry.
 */
export type FamilyRole = "application" | "engine";
export type FamilyTool = {
    /** Package/repo name, e.g. "ferriki" */
    name: string;
    /** One-line job description — the subheader under the tool name */
    job: string;
    /** Terse job label for constrained family navigation surfaces */
    shortJob: string;
    /** Which established API/contract it stays compatible with (engines only) */
    compat?: string;
    /** Proof sentence: verifiable facts, no marketing claims */
    proof: string;
    /** Compact, verifiable evidence for the family overview */
    evidence: string;
    /**
     * Fallback version (plain semver). The site prefers the live registry value;
     * this only renders when the build could not reach crates.io or npm.
     */
    version: string;
    /** Maturity, shown as a stamp next to the version */
    status: FamilyStatus;
    /** Display group. Within "pipeline", array order is chain order. */
    group: FamilyGroup;
    /** Defaults to "engine" — only products built on the engines set this. */
    role?: FamilyRole;
    /** GitHub repository URL */
    repo: string;
    /** Docs/homepage site, once it exists */
    docs?: string;
};
export declare const FAMILY_SITE = "https://ferramenta.dev";
export declare const family: FamilyTool[];
/** True for members the family builds *with*, false for products it carries. */
export declare function isEngine(tool: FamilyTool): boolean;
/** The three display groups of the overview page, in order. */
export declare function familyGroups(): {
    pipeline: FamilyTool[];
    language: FamilyTool[];
    workbench: FamilyTool[];
};
