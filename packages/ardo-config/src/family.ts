/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 */

export type FamilyStatus = "stable" | "beta" | "alpha" | "early"

export interface FamilyTool {
  /** Package/repo name, e.g. "ferriki" */
  name: string
  /** One-line job description — the subheader under the tool name */
  job: string
  /** Terse job label for constrained family navigation surfaces */
  shortJob: string
  /** Which established API/contract it stays compatible with */
  compat?: string
  /** Proof sentence: verifiable facts, no marketing claims */
  proof: string
  /** Compact, verifiable evidence for the family overview */
  evidence: string
  /** Fallback version (plain semver). The site prefers the live registry value;
   *  this only renders when the build could not reach crates.io or npm. */
  version: string
  /** Maturity, shown as a stamp next to the version */
  status: FamilyStatus
  /** Registry where the package is published */
  registry: "crates.io" | "npm"
  /** GitHub repository URL */
  repo: string
  /** Docs/homepage site, once it exists */
  docs?: string
  /** True for the ferroni → ferriki → ferromark content pipeline (array order = chain order) */
  pipeline?: boolean
  /** Sub-family, e.g. "palamedes" for the i18n/language toolchain */
  subFamily?: string
}

export const FAMILY_SITE = "https://ferramenta.dev"

export const family: FamilyTool[] = [
  {
    name: "ferroni",
    job: "Oniguruma-compatible regex engine",
    shortJob: "regex engine",
    compat: "Oniguruma / vscode-oniguruma",
    proof:
      "Oniguruma made TextMate grammars portable across editors. ferroni keeps its behavior in pure Rust, removing the C toolchain from the regex engine.",
    evidence: "2,083 tests · 100% C parity",
    version: "1.3.0",
    status: "stable",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferroni",
    docs: "https://sebastian-software.github.io/ferroni/",
    pipeline: true,
  },
  {
    name: "ferriki",
    job: "Shiki-compatible syntax highlighting",
    shortJob: "syntax highlighting",
    compat: "Shiki",
    proof:
      "Shiki brought editor-grade highlighting to the web. ferriki keeps its familiar contract while moving the engine from JavaScript and WASM to native Rust.",
    evidence: "Mirrored Shiki test suite",
    version: "0.2.0",
    status: "alpha",
    registry: "npm",
    repo: "https://github.com/sebastian-software/ferriki",
    pipeline: true,
  },
  {
    name: "ferromark",
    job: "Markdown to HTML — CommonMark & GFM",
    shortJob: "markdown",
    compat: "CommonMark / GFM",
    proof:
      "CommonMark settled what Markdown means. ferromark carries that contract, plus GFM and sanitized output, into a Rust renderer built for speed.",
    evidence: "≈260–280 MiB/s · ahead of pulldown-cmark and md4c",
    version: "0.7.0",
    status: "beta",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferromark",
    docs: "https://sebastian-software.github.io/ferromark/",
    pipeline: true,
  },
  {
    name: "ferrolex",
    job: "Spell checking for text and code",
    shortJob: "spell checking",
    compat: "Hunspell",
    proof:
      "Hunspell set the dictionary standard. ferrolex reads those dictionaries while adding compiled dictionaries, deterministic suggestions, and code-aware checking.",
    evidence: "Hunspell oracle · deterministic suggestion scoring",
    version: "0.2.0",
    status: "alpha",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferrolex",
    subFamily: "palamedes",
  },
  {
    name: "ferrocat",
    job: "Translation catalog engine",
    shortJob: "translation catalogs",
    compat: "PO / ICU MessageFormat",
    proof:
      "gettext taught software to speak in catalogs. ferrocat carries that model into Git and AI workflows, where merges stay conflict-free and human corrections stay authoritative.",
    evidence: "Three-way merges · release audits · integrity lock",
    version: "3.4.2",
    status: "stable",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferrocat",
    docs: "https://ferrocat.dev",
    subFamily: "palamedes",
  },
  {
    name: "ferrovia",
    job: "SVGO-compatible SVG optimizer",
    shortJob: "svg optimizer",
    compat: "SVGO",
    proof:
      "SVGO set the standard for SVG optimization. ferrovia is rebuilding its plugin model in Rust, checked byte for byte as each piece lands.",
    evidence: "Byte-for-byte SVGO oracle · in progress",
    version: "0.1.0",
    status: "early",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferrovia",
  },
  {
    name: "ferralk",
    job: "Glob matching and parallel filesystem walking",
    shortJob: "glob matching",
    proof:
      "Every build tool pays for finding files before it does any work. ferralk keeps zlob's byte-first approach in pure Rust — no Zig, no C ABI — and holds its matcher and walker to a frozen zlob reference.",
    evidence: "Frozen zlob reference · ahead of globset and fast-glob",
    version: "0.5.2",
    status: "early",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferralk",
  },
  {
    name: "ferrugo",
    job: "PDF previews for untrusted files",
    shortJob: "pdf previews",
    proof:
      "PDF previews have traditionally meant embedding a browser-sized engine. ferrugo takes a narrower path: render untrusted files under explicit resource limits, without PDFium.",
    evidence: "Bounded memory and time · no PDFium",
    version: "0.5.0",
    status: "early",
    registry: "crates.io",
    repo: "https://github.com/sebastian-software/ferrugo",
  },
]

/** The three display groups of the overview page, in order. */
export function familyGroups() {
  const pipeline = family.filter((tool) => tool.pipeline)
  const language = family.filter((tool) => tool.subFamily === "palamedes")
  const workbench = family.filter((tool) => !tool.pipeline && tool.subFamily !== "palamedes")
  return { pipeline, language, workbench }
}
