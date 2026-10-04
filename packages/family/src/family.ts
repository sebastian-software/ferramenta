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

/** The package registries a member can be published on, keyed as the registry snapshot keys them. */
export type FamilyRegistry = "crates" | "npm";

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
      plannedRunsOn?: never;
    }
  | {
      /**
       * The family engines an application runs on, by `name`. An engine is
       * proven on its own, a product by what it runs on and its own evidence.
       * Each name must be a family member; [] means it is standalone.
       */
      runsOn: string[];
      /** Engines planned for an integration in progress, not current dependencies. */
      plannedRunsOn?: string[];
      succeeds?: never;
      buildsOn?: never;
    }
  | {
      /** The open standards or formats a new development builds on, e.g. "PO / ICU MessageFormat". */
      buildsOn: string;
      succeeds?: never;
      runsOn?: never;
      plannedRunsOn?: never;
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
  /**
   * The names a member is published under where they differ from `name`, by
   * registry: `{ npm: "@ferriki/core" }`. Every registry lookup (the stats
   * refresh, the live figures) asks for `packageName(tool, registry)`, which
   * falls back to `name`. Set one only where the registry's package provably
   * carries another name.
   */
  packages?: Partial<Record<FamilyRegistry, string>>;
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

export const FAMILY_SITE = "https://ferramenta.dev";

export const family: FamilyTool[] = [
  {
    name: "ferroni",
    what: "A regex engine",
    job: "Oniguruma-compatible regex engine",
    does: "Runs Oniguruma's regular expressions in Rust, lookbehind, backreferences, named groups and Unicode classes included, with the multi-pattern scanner that editors and highlighters drive built in.",
    audience:
      "For anyone who needs Oniguruma's syntax in Rust, from editors and highlighters to any search that leans on lookbehind or backreferences.",
    succeeds: "Oniguruma / vscode-oniguruma",
    proof:
      "Oniguruma is the regex engine behind PHP's mbstring, jq and every TextMate grammar, and its C project ended in April 2025. Ferroni continues the engine in memory-safe Rust, with the vscode-oniguruma scanner built in.",
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
    does: "Highlights code with the grammars and themes your editor uses, from Node.js, from Rust, or at build time in Vite.",
    audience: "For docs sites, blogs, component libraries, and build tools that render code.",
    succeeds: "Shiki",
    proof:
      "Shiki brought editor-grade highlighting to the web. Ferriki keeps its familiar HTML API and moves the engine to native Rust, without WebAssembly or regex translation, so Rust programs can use it directly and a Vite build can ship highlighted HTML instead of a highlighter.",
    evidence: "Mirrored Shiki test suite · ahead of Shiki in HTML throughput",
    version: "0.11.0",
    packages: { npm: "@ferriki/core" },
    status: "beta",
    uses: ["ferroni"],
    pairsWith: ["ferromark"],
    repo: "https://github.com/sebastian-software/ferriki",
    docs: "https://ferriki.dev",
  },
  {
    name: "ferromark",
    what: "A Markdown renderer",
    job: "Markdown to HTML, sanitized by default",
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
    does: "Write messages right where the interface is written, and let a native toolchain extract, validate, merge and compile them. Switch the locale and the copy, plurals, currency and dates change together, in Next.js, Vite, Remix, React Router, TanStack Start, Solid or Waku.",
    audience:
      "For TypeScript teams who want their translations in the repository, reviewed like code, with a build that stays fast.",
    proof:
      "Lingui and FormatJS taught JavaScript teams to write messages where the code is, not in a distant resource file. Palamedes keeps that authoring model and puts a Rust toolchain under it, so extraction, validation, merging and compilation run at native speed and the catalogs belong to the repository, not to a service.",
    evidence: "Checked-in end-to-end benchmark against Lingui",
    runsOn: ["ferrocat", "ferromark", "ferralk"],
    version: "1.25.0",
    status: "stable",
    role: "application",
    brand: { color: "#0e2a4d", onColor: "#f3eee4" },
    repo: "https://github.com/sebastian-software/palamedes",
    docs: "https://palamedes.dev",
  },
  {
    name: "dalo",
    what: "A skill manager for coding agents",
    job: "Your team's agent setup, versioned like code",
    does: "Keeps your team's skills, standing instructions and hooks in Git, resolves one approved set, and syncs it into the folders Claude Code, Codex and Cursor already read. Every skill passes a security preflight before it lands on a machine.",
    audience:
      "For engineers and team leads who run agents across several people and machines, and are done copying skill folders by hand.",
    proof:
      "Agent skills used to live wherever someone last pasted them. Dalo gives them the discipline of code: a source in Git, approvals, conflict handling, drift detection, and one deterministic sync a whole team can rely on.",
    evidence: "Git-backed sources · approvals · deterministic sync",
    runsOn: [],
    version: "0.17.0",
    status: "beta",
    role: "application",
    brand: { color: "#0b1733", onColor: "#eef1f8" },
    repo: "https://github.com/sebastian-software/dalo",
    docs: "https://dalo.sh",
  },
  {
    name: "ardo",
    what: "A documentation framework for React",
    job: "Documentation sites built with React",
    does: "Builds static documentation sites from Markdown and MDX with React components, navigation and search. A rebuild is underway to use Ferromark for Markdown rendering and Ferriki for syntax highlighting.",
    audience:
      "For teams who want documentation in their repository and a site they can customize with React.",
    proof:
      "Ardo brings Markdown, MDX and React together in a static documentation site. Its integration of Ferromark and Ferriki is in progress.",
    evidence: "Static documentation sites · React components · engine integration in progress",
    runsOn: [],
    plannedRunsOn: ["ferromark", "ferriki"],
    version: "4.2.0",
    status: "stable",
    role: "application",
    brand: { color: "#b72a6f", onColor: "#ffffff" },
    repo: "https://github.com/sebastian-software/ardo",
    docs: "https://ardo-docs.dev",
  },
];

/**
 * The workshop behind the family: where its code lives, and where the people
 * who build the engines can be hired. Every family site's footer carries the
 * consulting link, so it is a registry fact, not page copy.
 */
export const WORKSHOP = {
  name: "Sebastian Software",
  /** The legal entity behind the family, for the copyright line every footer carries. */
  company: "Sebastian Software GmbH",
  place: "Mainz, Germany",
  /** The imprint and privacy policy the law asks a site to link; the company site keeps them. */
  imprint: "https://sebastian-software.com/imprint",
  privacy: "https://sebastian-software.com/privacy-policy",
  source: "https://github.com/sebastian-software",
  openSource: "https://oss.sebastian-software.com",
  consulting: "https://sebastian-consulting.com",
} as const;

/**
 * What each maturity stamp promises, in one line. A site that shows a stamp
 * legend (`StampKey`) reads it from here, so a status means the same thing
 * everywhere.
 */
export const STATUS_MEANING: Record<FamilyStatus, string> = {
  stable: "Ready to adopt; its interface is settled.",
  beta: "Complete for its scope; details may still change.",
  alpha: "Usable to try; expect gaps and breaking changes.",
  early: "Taking shape; not yet something to depend on.",
};

/** Maturity order, most settled first. */
export const STATUS_ORDER: FamilyStatus[] = ["stable", "beta", "alpha", "early"];

/**
 * The name a member is published under on a registry: its `packages` override,
 * else its `name`. Every registry lookup goes through this, so a member whose
 * package carries another name ("@ferriki/core") is asked for under that name.
 */
export function packageName(tool: FamilyTool, registry: FamilyRegistry): string {
  return tool.packages?.[registry] ?? tool.name;
}

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

/**
 * What a member is, as a label without its article: "Regex engine" for the
 * `what` "A regex engine". A first word with a digit keeps its case ("i18n
 * toolchain").
 */
export function whatLabel(tool: FamilyTool): string {
  const label = tool.what.replace(/^An? /u, "");
  const [first = ""] = label.split(" ");
  return /\d/u.test(first) ? label : label.charAt(0).toUpperCase() + label.slice(1);
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

/** The engines planned for an application's integration, separate from its current dependencies. */
export function plannedRunsOnTools(tool: FamilyTool): FamilyTool[] {
  return (tool.plannedRunsOn ?? []).map((name) => member(name, `${tool.name} plans to run on`));
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
