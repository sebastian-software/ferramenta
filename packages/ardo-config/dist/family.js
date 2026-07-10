/**
 * Single source of truth for the Ferramenta family.
 * Used by ferramenta.dev and the per-package docs sites for
 * cross-linking and consistent descriptions.
 */
export const FAMILY_SITE = "https://ferramenta.dev";
export const family = [
    {
        name: "ferroni",
        job: "Oniguruma-compatible regex engine",
        compat: "Oniguruma / vscode-oniguruma",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferroni",
        docs: "https://sebastian-software.github.io/ferroni/",
        pipeline: true,
    },
    {
        name: "ferriki",
        job: "Shiki-compatible syntax highlighting",
        compat: "Shiki",
        registry: "npm",
        repo: "https://github.com/sebastian-software/ferriki",
        pipeline: true,
    },
    {
        name: "ferromark",
        job: "CommonMark/GFM Markdown to HTML",
        compat: "CommonMark / GFM",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferromark",
        docs: "https://sebastian-software.github.io/ferromark/",
        pipeline: true,
    },
    {
        name: "ferrovia",
        job: "SVGO-compatible SVG optimizer",
        compat: "SVGO",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferrovia",
    },
    {
        name: "ferrocat",
        job: "Translation catalog engine",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferrocat",
        subFamily: "palamedes",
    },
    {
        name: "ferrolex",
        job: "Spell, dictionary, and brand validation",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferrolex",
        subFamily: "palamedes",
    },
    {
        name: "ferrugo",
        job: "Rust-native PDF previews",
        registry: "crates.io",
        repo: "https://github.com/sebastian-software/ferrugo",
    },
];
