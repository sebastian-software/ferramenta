/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking, consistent descriptions, and the shared header/footer.
 */
export const FAMILY_SITE = "https://ferramenta.dev";
export const family = [
    {
        name: "ferroni",
        job: "Oniguruma-compatible regex engine",
        compat: "Oniguruma / vscode-oniguruma",
        proof: "Oniguruma has powered TextMate grammars and half the editors you know. ferroni keeps its entire feature class and exact behavior — rebuilt in pure Rust: no C toolchain, faster in the hot path, proven against Oniguruma's own tests.",
        version: "1.3.0",
        status: "stable",
        registry: "crates.io",
        registries: "crates.io",
        repo: "https://github.com/sebastian-software/ferroni",
        docs: "https://sebastian-software.github.io/ferroni/",
        pipeline: true,
    },
    {
        name: "ferriki",
        job: "Shiki-compatible syntax highlighting",
        compat: "Shiki",
        proof: "Shiki brought editor-grade highlighting to everyone. ferriki keeps the API Shiki got right and swaps the JS-and-WASM engine underneath for native Rust — same tokens, same themes, verified against Shiki's own test suite.",
        version: "0.2.0",
        status: "alpha",
        registry: "npm",
        repo: "https://github.com/sebastian-software/ferriki",
        pipeline: true,
    },
    {
        name: "ferromark",
        job: "Markdown to HTML — CommonMark & GFM",
        compat: "CommonMark / GFM",
        proof: "CommonMark settled what Markdown means. ferromark renders every last rule of it — plus all of GFM, sanitized by default — and does it ahead of pulldown-cmark and md4c, the fastest parsers before it.",
        version: "0.7.0",
        status: "beta",
        registry: "crates.io",
        registries: "crates.io + npm",
        repo: "https://github.com/sebastian-software/ferromark",
        docs: "https://sebastian-software.github.io/ferromark/",
        pipeline: true,
    },
    {
        name: "ferrolex",
        job: "Spell checking for text and code",
        compat: "Hunspell",
        proof: "Hunspell has spell-checked the world's software for decades. ferrolex speaks its dictionaries fluently — and adds what a modern engine owes you: compiled dictionaries, deterministic suggestions, code-aware checking, scored openly against Hunspell itself.",
        version: "0.2.0",
        status: "alpha",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferrolex",
        subFamily: "palamedes",
    },
    {
        name: "ferrocat",
        job: "Translation catalog engine",
        compat: "PO / ICU MessageFormat",
        proof: "gettext taught software to speak in catalogs. ferrocat brings the catalog into the git-and-AI era: merges that don't conflict, releases that audit themselves, and human corrections no machine translation can overwrite.",
        version: "3.4.2",
        status: "stable",
        registry: "crates.io",
        registries: "crates.io",
        repo: "https://github.com/sebastian-software/ferrocat",
        docs: "https://ferrocat.dev",
        subFamily: "palamedes",
    },
    {
        name: "ferrovia",
        job: "SVGO-compatible SVG optimizer",
        compat: "SVGO",
        proof: "SVGO is the standard for SVG optimization. ferrovia is its Rust successor in progress — plugin by plugin, verified byte for byte against the original, so compatible means identical.",
        version: "0.1.0",
        status: "early",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferrovia",
    },
    {
        name: "ferrugo",
        job: "PDF previews for untrusted files",
        proof: "PDF previews used to mean embedding a browser-sized engine. ferrugo renders untrusted files inside hard limits — bounded memory, bounded time, no PDFium — built for servers that can't afford surprises.",
        version: "0.5.0",
        status: "early",
        registry: "crates.io",
        registries: "crates.io",
        repo: "https://github.com/sebastian-software/ferrugo",
    },
];
/** The three display groups of the overview page, in order. */
export function familyGroups() {
    const pipeline = family.filter((tool) => tool.pipeline);
    const language = family.filter((tool) => tool.subFamily === "palamedes");
    const workbench = family.filter((tool) => !tool.pipeline && tool.subFamily !== "palamedes");
    return { pipeline, language, workbench };
}
