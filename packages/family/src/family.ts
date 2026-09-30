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
export type FamilyLineage =
  | {
      /**
       * The established implementation a successor succeeds and stays compatible
       * with, e.g. "Oniguruma / vscode-oniguruma".
       */
      succeeds: string;
      buildsOn?: never;
      runsOn?: never;
    }
  | {
      /**
       * The family engines an application runs on, by `name`. An engine is
       * proven on its own, a product by what it runs on and its own evidence.
       * Each name must be a family member; [] means it is standalone.
       */
      runsOn: string[];
      succeeds?: never;
      buildsOn?: never;
    }
  | {
      /** The open standards or formats a new development builds on, e.g. "PO / ICU MessageFormat". */
      buildsOn: string;
      succeeds?: never;
      runsOn?: never;
    };

/** An application's brand colors, as CSS color values. */
export type FamilyBrand = {
  /** The surface its logo and name sit on. */
  ground: string;
  /** Text on that surface. */
  ink: string;
  /** Its signal color: the job line, the action. */
  accent: string;
  /**
   * A light ground for a logo that was drawn for one and would lose its dark
   * parts on `ground`. Leave it out for a logo that brings its own.
   */
  logoGround?: string;
  /**
   * The shape of that ground: a square tile (the default), or a disc for an
   * emblem that is round itself.
   */
  logoShape?: "disc" | "tile";
};

export type FamilyTool = {
  /** Package/repo name, e.g. "ferriki" */
  name: string;
  /**
   * What the member is, as a noun phrase a stranger understands: "A regex
   * engine". Sentence case; an engine's starts with its article, because pages
   * list the engines in a sentence. The first thing any surface says after the
   * name.
   */
  what: string;
  /** One-line job description — the subheader under the tool name, the README tables */
  job: string;
  /**
   * Terse job label for constrained family navigation surfaces. Sentence case
   * ("Regex engine"); acronyms keep their capitals ("PDF") and a lowercase
   * term of art its lowercase ("i18n toolchain").
   */
  shortJob: string;
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
   * An application's own colors, for the one place the family shows it in its
   * own brand: the applications band. Engines have none; they wear the family's.
   */
  brand?: FamilyBrand;
  /** GitHub repository URL */
  repo: string;
  /** Docs/homepage site, once it exists */
  docs?: string;
} & FamilyLineage;

export const FAMILY_SITE = "https://ferramenta.dev";

export const family: FamilyTool[] = [
  {
    name: "ferroni",
    what: "A regex engine",
    job: "Oniguruma-compatible regex engine",
    shortJob: "Regex engine",
    does: "Runs the regular expressions that TextMate grammars are written in, with the scanner editors and highlighters drive built in.",
    audience: "For anyone who tokenizes code the way an editor does.",
    succeeds: "Oniguruma / vscode-oniguruma",
    proof:
      "Oniguruma made TextMate grammars portable across editors, and its C project ended in April 2025. Ferroni continues the engine in memory-safe Rust, with the vscode-oniguruma scanner built in.",
    evidence: "Oniguruma compatibility oracle",
    version: "1.4.2",
    status: "stable",
    repo: "https://github.com/sebastian-software/ferroni",
    docs: "https://ferroni.dev",
  },
  {
    name: "ferriki",
    what: "A syntax highlighter",
    job: "Shiki-compatible syntax highlighting",
    shortJob: "Syntax highlighting",
    does: "Highlights code with the grammars and themes your editor uses.",
    audience: "For docs sites, blogs, and build tools that render code.",
    succeeds: "Shiki",
    proof:
      "Shiki brought editor-grade highlighting to the web. Ferriki keeps its familiar contract while moving the engine from JavaScript and WASM to native Rust.",
    evidence: "Mirrored Shiki test suite",
    version: "0.3.0",
    status: "alpha",
    uses: ["ferroni"],
    pairsWith: ["ferromark"],
    repo: "https://github.com/sebastian-software/ferriki",
    docs: "https://ferriki.dev",
  },
  {
    name: "ferromark",
    what: "A Markdown renderer",
    job: "Markdown to HTML, sanitized by default",
    shortJob: "Markdown to HTML",
    does: "Turns Markdown into HTML, sanitized by default, and is among the fastest engines for the job.",
    audience: "For static sites, docs pipelines, and any app that renders what people write.",
    buildsOn: "CommonMark / GFM",
    proof:
      "CommonMark settled what Markdown means. Ferromark carries that contract, plus GFM and sanitized output, into a Rust renderer built for speed.",
    evidence: "CommonMark & GFM conformance",
    version: "2.1.1",
    status: "stable",
    repo: "https://github.com/sebastian-software/ferromark",
    docs: "https://ferromark.dev",
  },
  {
    name: "ferrolex",
    what: "A spell checker",
    job: "Spell checking for text and code",
    shortJob: "Spell checking",
    does: "Checks spelling in prose and in code, and gives the same suggestions every time.",
    audience: "For editors, linters, and CI checks.",
    succeeds: "Hunspell",
    proof:
      "Hunspell set the dictionary standard. Ferrolex reads those dictionaries while adding compiled dictionaries, deterministic suggestions, and code-aware checking.",
    evidence: "Hunspell oracle · deterministic suggestion scoring",
    version: "0.4.0",
    status: "alpha",
    repo: "https://github.com/sebastian-software/ferrolex",
  },
  {
    name: "ferrocat",
    what: "A translation catalog engine",
    job: "Translation catalog engine",
    shortJob: "Translation catalogs",
    does: "Reads, merges, and compiles translation catalogs.",
    audience: "For teams whose translations live in the repository.",
    buildsOn: "PO / ICU MessageFormat",
    proof:
      "gettext taught software to speak in catalogs. Ferrocat carries that model into Git and AI workflows, where merges stay conflict-free and human corrections stay authoritative.",
    evidence: "Upstream-derived conformance cases · ahead of GNU msgmerge and common PO libraries",
    version: "3.4.2",
    status: "stable",
    repo: "https://github.com/sebastian-software/ferrocat",
    docs: "https://ferrocat.dev",
  },
  {
    name: "ferralk",
    what: "A glob matcher and file walker",
    job: "Glob matching and parallel filesystem walking",
    shortJob: "Glob matching",
    does: "Matches glob patterns and walks file trees in parallel, ahead of globset and fast-glob.",
    audience: "For build tools, linters, and anything that starts with a file list.",
    buildsOn: "Glob syntax / .gitignore rules",
    proof:
      "Every build tool pays for finding files before it does any work. Ferralk keeps zlob's byte-first approach in pure Rust, without Zig or a C ABI, and holds its matcher and walker to a frozen zlob reference.",
    evidence: "Frozen zlob reference · ahead of globset and fast-glob",
    version: "1.0.0",
    status: "stable",
    repo: "https://github.com/sebastian-software/ferralk",
  },
  {
    name: "ferrugo",
    what: "A PDF preview renderer",
    job: "PDF previews for untrusted files",
    shortJob: "PDF previews",
    does: "Renders previews of PDF files you have no reason to trust.",
    audience: "For upload pipelines and document viewers.",
    buildsOn: "PDF (ISO 32000)",
    proof:
      "PDF previews have traditionally meant embedding a browser-sized engine. Ferrugo takes a narrower path: render untrusted files under explicit resource limits, without PDFium.",
    evidence: "Bounded memory and time · no PDFium",
    version: "0.5.0",
    status: "early",
    repo: "https://github.com/sebastian-software/ferrugo",
  },
  {
    name: "palamedes",
    what: "An i18n toolchain for TypeScript apps",
    job: "Internationalization for TypeScript applications",
    shortJob: "i18n toolchain",
    does: "Keeps messages where the interface is written, and moves extraction, validation, merging, and compilation onto a native toolchain.",
    audience: "For TypeScript teams whose catalogs belong to the repository, not to a service.",
    proof:
      "Lingui and FormatJS taught JavaScript teams to write messages where the code is, not in a distant resource file. Palamedes keeps that authoring model and moves extraction, validation, merging, and compilation onto a native toolchain, so the catalogs stay owned by the repository instead of by a service.",
    evidence: "Checked-in end-to-end benchmark against Lingui",
    runsOn: ["ferrocat", "ferromark", "ferralk"],
    version: "1.25.0",
    status: "stable",
    role: "application",
    brand: {
      ground: "#0e2a4d",
      ink: "#f3eee4",
      accent: "#c99a55",
      logoGround: "#f6f1e7",
      logoShape: "disc",
    },
    repo: "https://github.com/sebastian-software/palamedes",
    docs: "https://palamedes.dev",
  },
  {
    name: "dalo",
    what: "Agent skills for teams, kept as code",
    job: "Team agent skills, versioned and synced as code",
    shortJob: "Agent skills",
    does: "Keeps team skills in Git, resolves an approved set, and links them into the folders your agents already read.",
    audience: "For teams that share agent skills and want them reviewed like code.",
    proof:
      "Dalo keeps team skills in Git, resolves an approved set, and links those skills into the folders supported agents already read.",
    evidence: "Git-backed sources · approvals · deterministic sync",
    runsOn: [],
    version: "0.17.0",
    status: "beta",
    role: "application",
    brand: { ground: "#0b1733", ink: "#eef1f8", accent: "#ff9d78", logoGround: "#fff" },
    repo: "https://github.com/sebastian-software/dalo",
    docs: "https://dalo.sh",
  },
];

/**
 * The workshop behind the family: where its code lives, and where the people
 * who build the engines can be hired. Every family site's footer carries the
 * consulting link, so it is a registry fact, not page copy.
 */
export const WORKSHOP = {
  name: "Sebastian Software",
  source: "https://github.com/sebastian-software",
  openSource: "https://oss.sebastian-software.com",
  consulting: "https://sebastian-consulting.com",
} as const;

/**
 * What each maturity stamp promises, in one line. The stamp legend on every
 * family site reads from here, so a status means the same thing everywhere.
 */
export const STATUS_MEANING: Record<FamilyStatus, string> = {
  stable: "Ready to adopt; its interface is settled.",
  beta: "Complete for its scope; details may still change.",
  alpha: "Usable to try; expect gaps and breaking changes.",
  early: "Taking shape; not yet something to depend on.",
};

/** Maturity order, most settled first. */
export const STATUS_ORDER: FamilyStatus[] = ["stable", "beta", "alpha", "early"];

/** Where a member's links lead: its own site once it exists, its repository until then. */
export function toolHref(tool: FamilyTool): string {
  return tool.docs ?? tool.repo;
}

/**
 * True when a member's links lead to its repository rather than a site. Every
 * surface that links a member says so, visibly or to assistive technology, so
 * nobody expecting documentation lands on GitHub unannounced.
 */
export function leadsToRepo(tool: FamilyTool): boolean {
  return tool.docs === undefined;
}

/**
 * A member's name as prose writes it: "Ferroni", not "ferroni". The registry
 * keeps names lowercase (they are package names); copy capitalizes them, and
 * a stylesheet's `text-transform` cannot, because the first word of a line
 * may run on from a label before it.
 */
export function displayName(tool: FamilyTool | string): string {
  const name = typeof tool === "string" ? tool : tool.name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** A member by name. An unknown name is a registry error, not a silent gap. */
function member(name: string, context: string): FamilyTool {
  const found = family.find((candidate) => candidate.name === name);
  if (found === undefined) throw new Error(`${context} unknown member: ${name}`);
  return found;
}

/** The members an application runs on. An unknown name is a registry error, not a silent gap. */
export function runsOnTools(tool: FamilyTool): FamilyTool[] {
  return (tool.runsOn ?? []).map((name) => member(name, `${tool.name} runs on`));
}

/** True for a member that succeeds an established implementation, false for a new development. */
export function isSuccessor(tool: FamilyTool): boolean {
  return tool.succeeds !== undefined;
}

/** True for members the family builds *with*, false for products it carries. */
export function isEngine(tool: FamilyTool) {
  return (tool.role ?? "engine") === "engine";
}

/** Related tools in catalog order. Unknown project IDs are configuration errors. */
export function relatedTools(current?: string): FamilyTool[] {
  if (current !== undefined && !family.some((tool) => tool.name === current)) {
    throw new Error(`Unknown Ferramenta project: ${current}`);
  }
  return family.filter((tool) => tool.name !== current);
}

/**
 * The family's two tiers, in catalog order, without the current project: the
 * engines, and the applications the workshop also makes.
 */
export function familyTiers(current?: string) {
  const tools = relatedTools(current);
  return {
    engines: tools.filter((tool) => isEngine(tool)),
    applications: tools.filter((tool) => !isEngine(tool)),
  };
}

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
export function relationsOf(tool: FamilyTool): FamilyRelation[] {
  const dependencies = (candidate: FamilyTool) => [
    ...(candidate.uses ?? []),
    ...(candidate.runsOn ?? []),
  ];
  const runsOn = dependencies(tool).map((name) => member(name, `${tool.name} runs on`));
  const carries = family.filter((candidate) => dependencies(candidate).includes(tool.name));
  const pairs = family.filter(
    (candidate) =>
      candidate.name !== tool.name &&
      ((tool.pairsWith ?? []).includes(candidate.name) ||
        (candidate.pairsWith ?? []).includes(tool.name)),
  );
  return [
    ...runsOn.map((other) => ({ kind: "runs-on" as const, tool: other })),
    ...pairs.map((other) => ({ kind: "pairs-with" as const, tool: other })),
    ...carries.map((other) => ({ kind: "carries" as const, tool: other })),
  ];
}
