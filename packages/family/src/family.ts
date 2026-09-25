/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 *
 * Membership rule (ADR-0001 amendment, 2026-09-25): a member is a family
 * engine, a product built on family engines, or a selected standalone
 * Rust-native application. Common ownership alone does not grant membership.
 */

export type FamilyStatus = "alpha" | "beta" | "early" | "stable";

/** Display group on the overview page, the header flyout, and the footer. */
export type FamilyGroup = "language" | "pipeline" | "workbench";

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

export type FamilyTool = {
  /** Package/repo name, e.g. "ferriki" */
  name: string;
  /** One-line job description — the subheader under the tool name */
  job: string;
  /**
   * Terse job label for constrained family navigation surfaces. Sentence case
   * ("Regex engine"); acronyms keep their capitals ("SVG") and a lowercase
   * term of art its lowercase ("i18n toolchain").
   */
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
  /** Defaults to "engine" — applications set this explicitly. */
  role?: FamilyRole;
  /** Sprite symbol override for members without an individual project mark. */
  mark?: string;
  /** GitHub repository URL */
  repo: string;
  /** Docs/homepage site, once it exists */
  docs?: string;
} & FamilyLineage;

export const FAMILY_SITE = "https://ferramenta.dev";

export const family: FamilyTool[] = [
  {
    name: "ferroni",
    job: "Oniguruma, continued in Rust",
    shortJob: "Regex engine",
    succeeds: "Oniguruma / vscode-oniguruma",
    proof:
      "Oniguruma made TextMate grammars portable across editors, and its C project ended in April 2025. Ferroni continues the engine in memory-safe Rust, with the vscode-oniguruma scanner built in.",
    evidence: "Oniguruma compatibility oracle",
    version: "1.4.2",
    status: "stable",
    group: "pipeline",
    repo: "https://github.com/sebastian-software/ferroni",
    docs: "https://sebastian-software.github.io/ferroni/",
  },
  {
    name: "ferriki",
    job: "Shiki-compatible syntax highlighting",
    shortJob: "Syntax highlighting",
    succeeds: "Shiki",
    proof:
      "Shiki brought editor-grade highlighting to the web. Ferriki keeps its familiar contract while moving the engine from JavaScript and WASM to native Rust.",
    evidence: "Mirrored Shiki test suite",
    version: "0.3.0",
    status: "alpha",
    group: "pipeline",
    repo: "https://github.com/sebastian-software/ferriki",
  },
  {
    name: "ferromark",
    job: "Markdown to HTML, sanitized by default",
    shortJob: "Markdown to HTML",
    buildsOn: "CommonMark / GFM",
    proof:
      "CommonMark settled what Markdown means. Ferromark carries that contract, plus GFM and sanitized output, into a Rust renderer built for speed.",
    evidence: "CommonMark & GFM conformance",
    version: "2.1.1",
    status: "stable",
    group: "pipeline",
    repo: "https://github.com/sebastian-software/ferromark",
    docs: "https://sebastian-software.github.io/ferromark/",
  },
  {
    name: "ferrolex",
    job: "Spell checking for text and code",
    shortJob: "Spell checking",
    succeeds: "Hunspell",
    proof:
      "Hunspell set the dictionary standard. Ferrolex reads those dictionaries while adding compiled dictionaries, deterministic suggestions, and code-aware checking.",
    evidence: "Hunspell oracle · deterministic suggestion scoring",
    version: "0.4.0",
    status: "alpha",
    group: "language",
    repo: "https://github.com/sebastian-software/ferrolex",
  },
  {
    name: "ferrocat",
    job: "Translation catalog engine",
    shortJob: "Translation catalogs",
    buildsOn: "PO / ICU MessageFormat",
    proof:
      "gettext taught software to speak in catalogs. Ferrocat carries that model into Git and AI workflows, where merges stay conflict-free and human corrections stay authoritative.",
    evidence: "Upstream-derived conformance cases · ahead of GNU msgmerge and common PO libraries",
    version: "3.4.2",
    status: "stable",
    group: "language",
    repo: "https://github.com/sebastian-software/ferrocat",
    docs: "https://ferrocat.dev",
  },
  {
    name: "palamedes",
    job: "Internationalization for TypeScript applications",
    shortJob: "i18n toolchain",
    proof:
      "Lingui and FormatJS taught JavaScript teams to write messages where the code is, not in a distant resource file. Palamedes keeps that authoring model and moves extraction, validation, merging, and compilation onto a native toolchain, so the catalogs stay owned by the repository instead of by a service.",
    evidence: "Checked-in end-to-end benchmark against Lingui",
    runsOn: ["ferrocat", "ferromark", "ferralk"],
    version: "1.25.0",
    status: "stable",
    group: "language",
    role: "application",
    repo: "https://github.com/sebastian-software/palamedes",
    docs: "https://palamedes.dev",
  },
  {
    name: "ferralk",
    job: "Glob matching and parallel filesystem walking",
    shortJob: "Glob matching",
    buildsOn: "Glob syntax / .gitignore rules",
    proof:
      "Every build tool pays for finding files before it does any work. Ferralk keeps zlob's byte-first approach in pure Rust, without Zig or a C ABI, and holds its matcher and walker to a frozen zlob reference.",
    evidence: "Frozen zlob reference · ahead of globset and fast-glob",
    version: "0.12.0",
    status: "early",
    group: "workbench",
    repo: "https://github.com/sebastian-software/ferralk",
  },
  {
    name: "ferrugo",
    job: "PDF previews for untrusted files",
    shortJob: "PDF previews",
    buildsOn: "PDF (ISO 32000)",
    proof:
      "PDF previews have traditionally meant embedding a browser-sized engine. Ferrugo takes a narrower path: render untrusted files under explicit resource limits, without PDFium.",
    evidence: "Bounded memory and time · no PDFium",
    version: "0.5.0",
    status: "early",
    group: "workbench",
    repo: "https://github.com/sebastian-software/ferrugo",
  },
  {
    name: "dalo",
    job: "Team agent skills, versioned and synced as code",
    shortJob: "Agent skills",
    proof:
      "Dalo keeps team skills in Git, resolves an approved set, and links those skills into the folders supported agents already read.",
    evidence: "Git-backed sources · approvals · deterministic sync",
    runsOn: [],
    version: "0.17.0",
    status: "beta",
    group: "workbench",
    role: "application",
    mark: "ferramenta",
    repo: "https://github.com/sebastian-software/dalo",
    docs: "https://dalo.sh",
  },
  {
    name: "cuttledoc",
    job: "Local-first speech transcription",
    shortJob: "Speech transcription",
    proof:
      "Cuttledoc brings transcription to a reusable Rust library and native CLI, with on-device processing first and hosted backends available by explicit choice.",
    evidence: "On-device transcription · reusable Rust library · native CLI",
    runsOn: [],
    version: "2.0.0",
    status: "beta",
    group: "workbench",
    role: "application",
    mark: "ferramenta",
    repo: "https://github.com/sebastian-software/cuttledoc",
  },
];

/** One end of the content pipeline: a stamped label and what enters or leaves. */
export type PipelineEnd = { label: string; text: string };

/**
 * The content pipeline beyond its members: what goes in, what comes out, and
 * the sentence that reads the whole assembly for a screen reader. The stages
 * themselves are the `pipeline` group, in array order.
 */
export const PIPELINE: { input: PipelineEnd; output: PipelineEnd; description: string } = {
  input: { label: "Input", text: "Markdown with code" },
  output: { label: "Output", text: "Highlighted HTML" },
  description:
    "The content pipeline: Markdown with code goes in. Ferroni runs the regular expressions of the TextMate grammars for Ferriki, Ferriki highlights the code, and Ferromark renders the whole document to HTML.",
};

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

/** The members an application runs on. An unknown name is a registry error, not a silent gap. */
export function runsOnTools(tool: FamilyTool): FamilyTool[] {
  return (tool.runsOn ?? []).map((name) => {
    const member = family.find((candidate) => candidate.name === name);
    if (member === undefined) throw new Error(`${tool.name} runs on unknown member: ${name}`);
    return member;
  });
}

/** True for a member that succeeds an established implementation, false for a new development. */
export function isSuccessor(tool: FamilyTool): boolean {
  return tool.succeeds !== undefined;
}

/** True for members the family builds *with*, false for products it carries. */
export function isEngine(tool: FamilyTool) {
  return (tool.role ?? "engine") === "engine";
}

/**
 * Members in the order of their short jobs, A to Z: an index to look a job up
 * in. Every member works on its own, so the index ranks none of them; it only
 * answers "which tool does this".
 */
export function byJob(tools: FamilyTool[] = family): FamilyTool[] {
  return [...tools].sort((a, b) =>
    a.shortJob.localeCompare(b.shortJob, "en", { sensitivity: "base" }),
  );
}

/** The three display groups of the overview page, in order. */
export function familyGroups(current?: string) {
  const tools = relatedTools(current);
  return {
    pipeline: tools.filter((tool) => tool.group === "pipeline"),
    language: tools.filter((tool) => tool.group === "language"),
    workbench: tools.filter((tool) => tool.group === "workbench"),
  };
}

/** Related tools in catalog order. Unknown project IDs are configuration errors. */
export function relatedTools(current?: string): FamilyTool[] {
  if (current !== undefined && !family.some((tool) => tool.name === current)) {
    throw new Error(`Unknown Ferramenta project: ${current}`);
  }
  return family.filter((tool) => tool.name !== current);
}
