/* eslint-disable max-lines -- Keep canonical member facts, editorial copy and sources in the same registry. */
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

export type FamilyEditorialNote = { title: string; body: string; href: string };

export type FamilyEditorial = {
  /** Presentation order, never a required adoption sequence. */
  order: number;
  navigation: string;
  subtitle: string;
  introduction: string;
  notes: [FamilyEditorialNote, ...FamilyEditorialNote[]];
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
  /** Overview copy and source-backed aspects, shared by editorial consumers. */
  editorial?: FamilyEditorial;
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
    editorial: {
      order: 1,
      navigation: "Regular expressions",
      subtitle: "Oniguruma-compatible regular expressions in Rust.",
      introduction:
        "Use lookbehind, backreferences and Unicode matching in native Rust. Ferroni also provides the multi-pattern scanner used by editors and highlighters. Its compatibility work stays tied to the original engine.",
      notes: [
        {
          title: "Why the inside looks familiar",
          body: "Ferroni initially follows the original engine’s modules and control flow closely. A failing test can lead directly to the corresponding C implementation. An idiomatic Rust API surrounds that familiar core.",
          href: "https://github.com/sebastian-software/ferroni/blob/b63b80c6b5694cf4301cf550b5ad2f8bf44a979a/docs/app/routes/adr/001-one-to-one-parity-with-c-original.mdx",
        },
        {
          title: "A scanner for the next layer",
          body: "A highlighter repeatedly asks which of several patterns matches next. Ferroni includes that scanning model, with editor-friendly text offsets. Ferriki uses it underneath its TextMate tokenizer.",
          href: "https://github.com/sebastian-software/ferroni/blob/b63b80c6b5694cf4301cf550b5ad2f8bf44a979a/README.md",
        },
      ],
    },
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
    editorial: {
      order: 3,
      navigation: "Syntax highlighting",
      subtitle: "TextMate highlighting for Rust, Node and your build.",
      introduction:
        "Highlight code with the TextMate grammars and themes you already know. Ferriki runs in Rust and offers familiar Shiki-style HTML calls for Node. Standard language packages include prepared static patterns and scanners, with source fallback when needed.",
      notes: [
        {
          title: "Work that arrives already done",
          body: "A new highlighting process can reuse static regex programs and scanners prepared with the language package. Patterns that depend on captured text still resolve locally. The preparation moves earlier; the grammar keeps its behavior.",
          href: "https://github.com/sebastian-software/ferriki/blob/51b49975dead9851a8a6bb62a498f00c4926109d/README.md",
        },
        {
          title: "The grammar engine comes with it",
          body: "Shiki-style HTML calls are only the outer layer. Ferriki also implements TextMate tokenization, including embedded languages and grammar injections. Its behavior is checked against both Shiki and vscode-textmate.",
          href: "https://github.com/sebastian-software/ferriki/blob/929cc22c2b1d2aec073fd1b7686ac870bda6afcc/README.md",
        },
      ],
    },
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
    editorial: {
      order: 4,
      navigation: "Markdown rendering",
      subtitle: "CommonMark and GFM, rendered in Rust.",
      introduction:
        "Turn CommonMark and GitHub Flavored Markdown into HTML, sanitized by default. Ferromark also supports opt-in publishing features for richer documents. Its conformance tests and compatibility notes keep the rendering contract open to inspection.",
      notes: [
        {
          title: "Check the output before the stopwatch",
          body: "Ferromark’s container-parser decision compares document structure, source locations and HTML before timing a candidate optimization. A behavior change needs its own explanation and tests. It cannot quietly arrive as the price of going faster.",
          href: "https://github.com/sebastian-software/ferromark/blob/6ee1647d8ffcb1b7469ae26120daa1d829af5675/docs/arch/ADR-0021-source-preserving-container-parsing.md",
        },
        {
          title: "Punctuation belongs to the language",
          body: "Quotes, ellipses and spacing follow different conventions in different languages. Ferromark adds selected typography features familiar from Remark plugins through an optional native pass. The application chooses the language, and code stays literal.",
          href: "https://github.com/sebastian-software/ferromark/blob/87d45adfa783c054d01d8d357b33e11460fcb319/docs/typography.md",
        },
      ],
    },
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
    editorial: {
      order: 5,
      navigation: "Spell checking",
      subtitle: "Hunspell dictionaries, with a Rust engine.",
      introduction:
        "Check words and produce deterministic suggestions with existing Hunspell dictionaries. Ferrolex implements the engine in Rust without linking the native Hunspell library. Format-aware applications choose the text to check; the project documents its compatibility boundaries.",
      notes: [
        {
          title: "A feature we chose to remove",
          body: "Ferrolex began adding parser-backed source analysis, then removed that responsibility. Languages and document formats already have tools that understand their syntax. The spell-checking engine stays focused on dictionaries, recognition and suggestions.",
          href: "https://github.com/sebastian-software/ferrolex/blob/e5850998d654ff8fd1b15d061fd95bf4bfc1da9c/docs/adr/0009-language-aware-source-analysis.md",
        },
        {
          title: "A dictionary you can ship",
          body: "Hunspell dictionaries can be compiled into a standalone native artifact that retains the supported affix rules. An application can ship that artifact without its original dictionary pair. Validation checks the compiled format before use.",
          href: "https://github.com/sebastian-software/ferrolex/blob/7c045ca09c4f5bc8f441b346a7b782439c3e8610/README.md",
        },
      ],
    },
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
    editorial: {
      order: 2,
      navigation: "Translation catalogs",
      subtitle: "Translation catalogs for Git and application tooling.",
      introduction:
        "Keep translations in PO, ICU MessageFormat or FCL catalogs. Ferrocat handles updates, review, validation and compilation. Machine-managed values carry a fingerprint so later human edits can be recognized.",
      notes: [
        {
          title: "The correction matters",
          body: "Automation writes a translation. A person improves it. The stored fingerprint no longer matches, leaving evidence of that intervention for the next review or translation run.",
          href: "https://github.com/sebastian-software/ferrocat/blob/6c8e160fe27f5239e02b003fe0ea83c7e91a34d1/docs/app/routes/architecture/adr/0022-machine-managed-value-integrity-and-ai-provenance.mdx",
        },
        {
          title: "One translation, one line",
          body: "FCL means Ferrocat Catalog Lines: a machine-written format for ICU messages. Each entry occupies one deterministically ordered line, so Git can merge unrelated translation edits without splitting an entry. PO remains the choice when external translator tools need it.",
          href: "https://github.com/sebastian-software/ferrocat/blob/6c8e160fe27f5239e02b003fe0ea83c7e91a34d1/docs/fcl-format.md",
        },
      ],
    },
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
    editorial: {
      order: 6,
      navigation: "Files and glob patterns",
      subtitle: "Glob matching and parallel filesystem walking.",
      introduction:
        "Find files with glob patterns and parallel filesystem walking. Ferralk keeps matching byte-based and preserves native path data. Its recorded reference cases make the chosen matching behavior reviewable.",
      notes: [
        {
          title: "A file name is not always a string",
          body: "Real filesystems allow names that ordinary Unicode text cannot represent faithfully. Replacing those bytes can make different names look identical. Ferralk keeps the native path data intact rather than using a lossy conversion for matching.",
          href: "https://github.com/sebastian-software/ferralk/blob/018aafe71b90f4ab0a21cd64c10a9804a2fa4b5b/docs/adr/0005-byte-matching-wtf8-on-windows.md",
        },
        {
          title: "Keep the reference, replace the runtime",
          body: "Ferralk draws on zlob’s matcher and walker semantics, with a frozen reference to check them against. The implementation runs in Rust without Zig or a C ABI. Its ignore-rule checks also compare behavior with Git itself.",
          href: "https://github.com/sebastian-software/ferralk/blob/018aafe71b90f4ab0a21cd64c10a9804a2fa4b5b/README.md",
        },
      ],
    },
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
    docs: "https://ferralk.dev",
  },
  {
    name: "ferrugo",
    editorial: {
      order: 7,
      navigation: "PDF previews",
      subtitle: "Bounded PDF previews for server-side workflows.",
      introduction:
        "Render bounded previews of untrusted PDFs in Rust, without a PDFium runtime. Ferrugo focuses on server-side document intake and automation. Its documented resource budgets and unsupported outcomes make that scope explicit.",
      notes: [
        {
          title: "A budget has a scope",
          body: "Ferrugo checks limits within parsing and rendering, including image resources and raster work. Those checks have a defined job. Process isolation and operating-system resource limits are separate concerns when an application contains untrusted documents.",
          href: "https://github.com/sebastian-software/ferrugo/blob/445227a1d3a9d0a7bbe1491240b2839886f3dcbd/docs/decisions/0007-server-side-rust-native-runtime-scope.md",
        },
        {
          title: "A preview has a narrower job",
          body: "Ferrugo targets document intake and thumbnails rather than every PDF viewing feature. Unsupported features have explicit outcomes, and visual-fidelity gaps remain documented. Other renderers serve as comparison references during development.",
          href: "https://github.com/sebastian-software/ferrugo/blob/445227a1d3a9d0a7bbe1491240b2839886f3dcbd/README.md",
        },
      ],
    },
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
    name: "ferrolink",
    editorial: {
      order: 8,
      navigation: "Static-site link checks",
      subtitle: "Links, assets and anchors checked against the finished build.",
      introduction:
        "Check links, assets and anchors in the HTML your build actually produced. Ferrolink works directly on the output directory, without a server or network. It accounts for static-host paths and deployment metadata before the files go online.",
      notes: [
        {
          title: "A release check became a tool",
          body: "Ferrolink was built to gate Ardo documentation releases and deployments. Checking the finished directory catches problems that source links alone cannot reveal. The same check works on the output of other static site generators.",
          href: "https://github.com/sebastian-software/ferrolink/blob/f76b38fe9717220866c45f331e9b95a797b5d005/README.md",
        },
        {
          title: "Small engines, one useful check",
          body: "Ferralk finds the files; Ferroni scans the relevant HTML tags and attributes. Ferrolink combines those focused engines into a finished-build check. You install the tool; its native parts come with it.",
          href: "https://github.com/sebastian-software/ferrolink/blob/f76b38fe9717220866c45f331e9b95a797b5d005/README.md",
        },
      ],
    },
    what: "A link checker for static sites",
    job: "Links, anchors and assets checked against the finished build",
    does: "Checks page links, asset references and anchors in static HTML builds, without a server or network requests.",
    audience: "For documentation sites, static site generators, and CI deployment checks.",
    buildsOn: "HTML references / static-host URL resolution",
    proof:
      "HTML connects pages through links and anchors. Ferrolink checks those references against the finished build using browser-style URL resolution and static-host file routing, including deployment paths and redirect destinations.",
    evidence: "Cross-page anchors · deployment-path and redirect checks",
    version: "0.2.1",
    status: "early",
    uses: ["ferralk", "ferroni"],
    repo: "https://github.com/sebastian-software/ferrolink",
  },
  {
    name: "ferrigura",
    editorial: {
      order: 9,
      navigation: "Mermaid diagrams",
      subtitle: "Mermaid diagrams to SVG, without a browser.",
      introduction:
        "Render diagram text as SVG in Rust. Ferrigura measures labels with bundled fonts and embeds the glyphs a diagram uses. The labels remain text, keeping the words selectable.",
      notes: [
        {
          title: "A font is part of the geometry",
          body: "Change a label’s font and its width can change too. Ferrigura measures with the same fonts it embeds, keeping the line breaks and surrounding shapes tied to the typography.",
          href: "https://github.com/sebastian-software/ferrigura/blob/bb1212aea864108322add8d65c8b28310a53cf71/docs/decisions/0010-text-measurement-and-fonts.md",
        },
        {
          title: "Diagrams for the documentation build",
          body: "Ardo is a planned consumer of Ferrigura alongside its native Markdown and highlighting engines. The Ferromark adapter already renders Mermaid fences to SVG in custom builds. That adapter is optional and is not included in the standard npm addon.",
          href: "https://github.com/sebastian-software/ferromark/blob/6ee1647d8ffcb1b7469ae26120daa1d829af5675/docs/ferrigura.md",
        },
      ],
    },
    what: "A diagram renderer",
    job: "Mermaid diagrams to SVG without a browser",
    does: "Renders Mermaid diagram text as SVG in Rust, with embedded fonts and no browser.",
    audience:
      "For documentation sites, build tools, and applications that render diagrams on a server.",
    succeeds: "Mermaid",
    proof:
      "Mermaid brought diagrams into plain text. Ferrigura carries its rendering into Rust, checking parser behavior and SVG geometry against the original while removing the browser dependency.",
    evidence: "Mermaid parser oracle · SVG geometry checked in Chromium",
    version: "0.3.0",
    status: "early",
    repo: "https://github.com/sebastian-software/ferrigura",
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
    does: "Builds static documentation sites from Markdown and MDX with React components, navigation and search, using Ferromark for Markdown rendering and Ferriki for syntax highlighting.",
    audience:
      "For teams who want documentation in their repository and a site they can customize with React.",
    proof:
      "Ardo brings Markdown, MDX and React together in a static documentation site, with Ferromark rendering the documents and Ferriki highlighting their code.",
    evidence: "Static documentation sites · React components · native Markdown and highlighting",
    runsOn: ["ferromark", "ferriki", "ferrolink"],
    plannedRunsOn: ["ferrigura"],
    version: "6.0.0",
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

/** Shared cross-references; each name keeps its original logo and destination. */
export const WORKSHOP_REFERENCES = [
  {
    id: "software",
    name: "Sebastian Software",
    href: WORKSHOP.openSource,
    description:
      "Production-grade open-source projects across several languages: the wider workshop this family comes from.",
    action: "Explore the open-source projects",
  },
  {
    id: "consulting",
    name: "Sebastian Consulting",
    href: WORKSHOP.consulting,
    description:
      "The people behind the engines, for hire: integration, support, and long-term maintenance.",
    action: "Work with the team",
  },
] as const;

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
