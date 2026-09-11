/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 *
 * Membership rule (ADR-0001 amendment, 2026-09-06): a member is a family
 * engine, or a product built on family engines. Developer tools that share
 * neither — dalo, agent-bridge — belong to the company line, not here.
 */
export const FAMILY_SITE = "https://ferramenta.dev";
export const family = [
    {
        name: "ferroni",
        job: "Oniguruma-compatible regex engine",
        shortJob: "regex engine",
        compat: "Oniguruma / vscode-oniguruma",
        proof: "Oniguruma made TextMate grammars portable across editors. ferroni keeps its behavior in pure Rust, removing the C toolchain from the regex engine.",
        evidence: "Oniguruma compatibility oracle",
        version: "1.3.2",
        status: "stable",
        group: "pipeline",
        repo: "https://github.com/sebastian-software/ferroni",
        docs: "https://sebastian-software.github.io/ferroni/",
    },
    {
        name: "ferriki",
        job: "Shiki-compatible syntax highlighting",
        shortJob: "syntax highlighting",
        compat: "Shiki",
        proof: "Shiki brought editor-grade highlighting to the web. ferriki keeps its familiar contract while moving the engine from JavaScript and WASM to native Rust.",
        evidence: "Mirrored Shiki test suite",
        version: "0.2.0",
        status: "alpha",
        group: "pipeline",
        repo: "https://github.com/sebastian-software/ferriki",
    },
    {
        name: "ferromark",
        job: "Markdown to HTML with a secure default and every GFM extension included.",
        shortJob: "markdown",
        compat: "CommonMark / GFM",
        proof: "CommonMark settled what Markdown means. ferromark carries that contract, plus GFM and sanitized output, into a Rust renderer built for speed.",
        evidence: "CommonMark & GFM conformance",
        version: "0.7.0",
        status: "beta",
        group: "pipeline",
        repo: "https://github.com/sebastian-software/ferromark",
        docs: "https://sebastian-software.github.io/ferromark/",
    },
    {
        name: "ferrolex",
        job: "Spell checking for text and code",
        shortJob: "spell checking",
        compat: "Hunspell",
        proof: "Hunspell set the dictionary standard. ferrolex reads those dictionaries while adding compiled dictionaries, deterministic suggestions, and code-aware checking.",
        evidence: "Hunspell oracle · deterministic suggestion scoring",
        version: "0.2.0",
        status: "alpha",
        group: "language",
        repo: "https://github.com/sebastian-software/ferrolex",
    },
    {
        name: "ferrocat",
        job: "Translation catalog engine",
        shortJob: "translation catalogs",
        compat: "PO / ICU MessageFormat",
        proof: "gettext taught software to speak in catalogs. ferrocat carries that model into Git and AI workflows, where merges stay conflict-free and human corrections stay authoritative.",
        evidence: "Three-way merges · release audits · integrity lock",
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
        proof: "Lingui and FormatJS taught JavaScript teams to write messages where the code is, not in a distant resource file. Palamedes keeps that authoring model and moves extraction, validation, merging, and compilation onto a native toolchain, so the catalogs stay owned by the repository instead of by a service.",
        evidence: "Built on ferrocat, ferromark, and ferralk",
        version: "1.23.0",
        status: "stable",
        group: "language",
        role: "application",
        repo: "https://github.com/sebastian-software/palamedes",
        docs: "https://palamedes.dev",
    },
    {
        name: "ferrovia",
        job: "SVGO-compatible SVG optimizer",
        shortJob: "svg optimizer",
        compat: "SVGO",
        proof: "SVGO set the standard for SVG optimization. ferrovia is rebuilding its plugin model in Rust, checked byte for byte as each piece lands.",
        evidence: "Byte-for-byte SVGO oracle · in progress",
        version: "0.1.0",
        status: "early",
        group: "workbench",
        repo: "https://github.com/sebastian-software/ferrovia",
    },
    {
        name: "ferralk",
        job: "Glob matching and parallel filesystem walking",
        shortJob: "glob matching",
        proof: "Every build tool pays for finding files before it does any work. ferralk keeps zlob's byte-first approach in pure Rust — no Zig, no C ABI — and holds its matcher and walker to a frozen zlob reference.",
        evidence: "Frozen zlob reference · ahead of globset and fast-glob",
        version: "0.12.0",
        status: "early",
        group: "workbench",
        repo: "https://github.com/sebastian-software/ferralk",
    },
    {
        name: "ferrugo",
        job: "PDF previews for untrusted files",
        shortJob: "pdf previews",
        proof: "PDF previews have traditionally meant embedding a browser-sized engine. ferrugo takes a narrower path: render untrusted files under explicit resource limits, without PDFium.",
        evidence: "Bounded memory and time · no PDFium",
        version: "0.5.0",
        status: "early",
        group: "workbench",
        repo: "https://github.com/sebastian-software/ferrugo",
    },
];
/** True for members the family builds *with*, false for products it carries. */
export function isEngine(tool) {
    return (tool.role ?? "engine") === "engine";
}
/** The three display groups of the overview page, in order. */
export function familyGroups(current) {
    const tools = relatedTools(current);
    return {
        pipeline: tools.filter((tool) => tool.group === "pipeline"),
        language: tools.filter((tool) => tool.group === "language"),
        workbench: tools.filter((tool) => tool.group === "workbench"),
    };
}
/** Related tools in catalog order. Unknown project IDs are configuration errors. */
export function relatedTools(current) {
    if (current !== undefined && !family.some((tool) => tool.name === current)) {
        throw new Error(`Unknown Ferramenta project: ${current}`);
    }
    return family.filter((tool) => tool.name !== current);
}
