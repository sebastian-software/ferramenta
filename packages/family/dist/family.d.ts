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
/**
 * What a member rests on: exactly one of these. A successor names the
 * implementation it succeeds, a new development the standards it builds on,
 * an application the engines it runs on. The type makes a member without one,
 * or with two, a compile error.
 */
export type FamilyLineage = {
    /**
     * The established implementation a successor succeeds and stays compatible
     * with, e.g. "Oniguruma / vscode-oniguruma".
     */
    succeeds: string;
    buildsOn?: never;
    runsOn?: never;
} | {
    /**
     * The family engines an application runs on, by `name`. An engine is
     * proven on its own, a product by what it runs on and its own evidence.
     * Each name must be a family member.
     */
    runsOn: string[];
    succeeds?: never;
    buildsOn?: never;
} | {
    /** The open standards or formats a new development builds on, e.g. "PO / ICU MessageFormat". */
    buildsOn: string;
    succeeds?: never;
    runsOn?: never;
};
export type FamilyTool = {
    /** Package/repo name, e.g. "ferriki" */
    name: string;
    /** One-line job description — the subheader under the tool name */
    job: string;
    /** Terse job label for constrained family navigation surfaces. Sentence case: acronyms keep their capitals. */
    shortJob: string;
    /**
     * Proof sentence: verifiable facts, no marketing claims. It is prose, so a
     * member's name is capitalized here ("Ferroni continues…"); `name`, URLs and
     * package names stay lowercase.
     */
    proof: string;
    /**
     * The evidence behind the tool: an oracle, a conformance suite, a design
     * property, and qualitative results ("ahead of globset", "among the fastest").
     * Never a figure — no factors, timings, percentages or test counts: those go
     * stale here, and live in the tool's own repository where they stay current.
     */
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
} & FamilyLineage;
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
/** Where a member's links lead: its own site once it exists, its repository until then. */
export declare function toolHref(tool: FamilyTool): string;
/**
 * True when a member's links lead to its repository rather than a site. Every
 * surface that links a member says so, visibly or to assistive technology, so
 * nobody expecting documentation lands on GitHub unannounced.
 */
export declare function leadsToRepo(tool: FamilyTool): boolean;
/**
 * A member's name as prose writes it: "Ferroni", not "ferroni". The registry
 * keeps names lowercase (they are package names); copy capitalizes them, and
 * a stylesheet's `text-transform` cannot, because the first word of a line
 * may run on from a label before it.
 */
export declare function displayName(tool: FamilyTool | string): string;
/** The members an application runs on. An unknown name is a registry error, not a silent gap. */
export declare function runsOnTools(tool: FamilyTool): FamilyTool[];
/** True for a member that succeeds an established implementation, false for a new development. */
export declare function isSuccessor(tool: FamilyTool): boolean;
/** True for members the family builds *with*, false for products it carries. */
export declare function isEngine(tool: FamilyTool): boolean;
/**
 * Members in the order of their short jobs, A to Z: an index to look a job up
 * in. Every member works on its own, so the index ranks none of them; it only
 * answers "which tool does this".
 */
export declare function byJob(tools?: FamilyTool[]): FamilyTool[];
/** The three display groups of the overview page, in order. */
export declare function familyGroups(current?: string): {
    pipeline: FamilyTool[];
    language: FamilyTool[];
    workbench: FamilyTool[];
};
/** Related tools in catalog order. Unknown project IDs are configuration errors. */
export declare function relatedTools(current?: string): FamilyTool[];
