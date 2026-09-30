/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 *
 * The family has two tiers (ADR-0008). Engines are the Rust-native
 * infrastructure the family is about; they share the family's look.
 * Applications are products from the same workshop with a brand of their own;
 * the family carries them, it does not dress them.
 *
 * Every entry says what the member is before where it comes from: `what`,
 * then `does`, then `audience`. Lineage (`proof`) and the measured facts come
 * after. A stranger has to understand the thing first.
 */
export type FamilyStatus = "alpha" | "beta" | "early" | "stable";
/**
 * What a member is. Engines are reusable infrastructure; applications are
 * user-facing products. Their lineage records any engine dependencies.
 */
export type FamilyRole = "application" | "engine";
/**
 * What a member rests on: exactly one of these. A successor names the
 * implementation it succeeds, a new development the standards it builds on,
 * an application the engines it runs on (an empty list for a standalone app).
 * The type makes a member without one, or with two, a compile error.
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
     * Each name must be a family member; [] means it is standalone.
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
/**
 * An application's brand, as far as the family shows it: its logo (an icon
 * file of its own) and one color. Both appear on a light card, where a foreign
 * logo keeps its own colors.
 */
export type FamilyBrand = {
    /** The brand's main color: the rule above its card, and its action. */
    color: string;
    /** Text on that color. */
    onColor: string;
};
export type FamilyTool = {
    /** Package/repo name, e.g. "ferriki" */
    name: string;
    /**
     * What the member is, as a noun phrase a stranger understands: "A regex
     * engine". Sentence case, with its article, because pages list the engines
     * in a sentence; a label drops the article (`whatLabel`). The first thing
     * any surface says after the name.
     */
    what: string;
    /** One-line job description — the subheader under the tool name, the README tables */
    job: string;
    /** What it does, in one plain sentence. Results qualitatively, never with a figure. */
    does: string;
    /** Who reaches for it, as a sentence starting with "For". */
    audience: string;
    /**
     * Where it comes from, in the successor register (ADR-0004): honor the
     * original or the standard, state the succession, give the why. It is prose,
     * so a member's name is capitalized here ("Ferroni continues…"); `name`, URLs
     * and package names stay lowercase. Verifiable facts, no marketing claims.
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
    /** Maturity, shown as a stamp next to the name */
    status: FamilyStatus;
    /** Defaults to "engine" — applications set this explicitly. */
    role?: FamilyRole;
    /**
     * Family engines this engine is built on, by `name`: a dependency in its
     * code. Applications record theirs as `runsOn`, which is their lineage.
     */
    uses?: string[];
    /**
     * Family engines this one is commonly combined with, by `name`, with no
     * dependency either way. Declared on one side; both sides show it.
     */
    pairsWith?: string[];
    /**
     * An application's own color, for the one place the family shows its brand:
     * its card in the applications band. Engines have none; they wear the family's.
     */
    brand?: FamilyBrand;
    /** GitHub repository URL */
    repo: string;
    /** Docs/homepage site, once it exists */
    docs?: string;
} & FamilyLineage;
export declare const FAMILY_SITE = "https://ferramenta.dev";
export declare const family: FamilyTool[];
/**
 * The workshop behind the family: where its code lives, and where the people
 * who build the engines can be hired. Every family site's footer carries the
 * consulting link, so it is a registry fact, not page copy.
 */
export declare const WORKSHOP: {
    readonly name: "Sebastian Software";
    /** The legal entity behind the family, for the copyright line every footer carries. */
    readonly company: "Sebastian Software GmbH";
    readonly place: "Mainz, Germany";
    /** The imprint and privacy policy the law asks a site to link; the company site keeps them. */
    readonly imprint: "https://sebastian-software.com/imprint";
    readonly privacy: "https://sebastian-software.com/privacy-policy";
    readonly source: "https://github.com/sebastian-software";
    readonly openSource: "https://oss.sebastian-software.com";
    readonly consulting: "https://sebastian-consulting.com";
};
/**
 * What each maturity stamp promises, in one line. A site that shows a stamp
 * legend (`StampKey`) reads it from here, so a status means the same thing
 * everywhere.
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
/**
 * What a member is, as a label without its article: "Regex engine" for the
 * `what` "A regex engine". A first word with a digit keeps its case ("i18n
 * toolchain").
 */
export declare function whatLabel(tool: FamilyTool): string;
/** The members an application runs on. An unknown name is a registry error, not a silent gap. */
export declare function runsOnTools(tool: FamilyTool): FamilyTool[];
/** True for a member that succeeds an established implementation, false for a new development. */
export declare function isSuccessor(tool: FamilyTool): boolean;
/** True for members the family builds *with*, false for products it carries. */
export declare function isEngine(tool: FamilyTool): boolean;
/** Related tools in catalog order. Unknown project IDs are configuration errors. */
export declare function relatedTools(current?: string): FamilyTool[];
/**
 * The family's two tiers, in catalog order, without the current project: the
 * engines, and the applications the workshop also makes.
 */
export declare function familyTiers(current?: string): {
    engines: FamilyTool[];
    applications: FamilyTool[];
};
/**
 * How two members relate. `runs-on`: the other is in this member's code.
 * `carries`: this member is in the other's code. `pairs-with`: commonly
 * combined, no dependency either way.
 */
export type FamilyRelation = {
    kind: "carries" | "pairs-with" | "runs-on";
    tool: FamilyTool;
};
/**
 * Every relation a member has to the rest of the family, from both sides: what
 * it runs on, what runs on it, what it pairs with. Members are independent;
 * this is where two of them fit together, never a required chain.
 */
export declare function relationsOf(tool: FamilyTool): FamilyRelation[];
