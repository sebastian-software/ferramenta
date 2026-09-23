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
    /** Terse job label for constrained family navigation surfaces. Sentence case: acronyms keep their capitals. */
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
/** One end of the content pipeline: a stamped label and what enters or leaves. */
export type PipelineEnd = {
    label: string;
    text: string;
};
/**
 * The content pipeline beyond its members: what goes in, what comes out, and
 * the sentence that reads the whole assembly for a screen reader. The stages
 * themselves are the `pipeline` group, in array order.
 */
export declare const PIPELINE: {
    input: PipelineEnd;
    output: PipelineEnd;
    description: string;
};
/**
 * What each maturity stamp promises, in one line. The stamp legend on every
 * family site reads from here, so a status means the same thing everywhere.
 */
export declare const STATUS_MEANING: Record<FamilyStatus, string>;
/** Maturity order, most settled first. */
export declare const STATUS_ORDER: FamilyStatus[];
/** True for members the family builds *with*, false for products it carries. */
export declare function isEngine(tool: FamilyTool): boolean;
/**
 * The most mature member of a group: best status by `STATUS_ORDER`, and on a
 * tie the first in registry order. The honest place to start in that group.
 */
export declare function leadTool(tools: FamilyTool[]): FamilyTool | undefined;
/** The three display groups of the overview page, in order. */
export declare function familyGroups(current?: string): {
    pipeline: FamilyTool[];
    language: FamilyTool[];
    workbench: FamilyTool[];
};
/** Related tools in catalog order. Unknown project IDs are configuration errors. */
export declare function relatedTools(current?: string): FamilyTool[];
