# Ferramenta

[![Powered by Sebastian Software](https://img.shields.io/badge/Powered%20by-Sebastian%20Software-00718d?style=flat-square)](https://oss.sebastian-software.com)
[![Deploy](https://github.com/sebastian-software/ferramenta/actions/workflows/deploy.yml/badge.svg)](https://github.com/sebastian-software/ferramenta/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**[ferramenta.dev](https://ferramenta.dev)** — the family site for the Ferramenta tools:
Rust-native developer tools by [Sebastian Software](https://oss.sebastian-software.com) that keep
the APIs the web ecosystem already knows.

*Ferramenta* is Italian for "hardware store" — the shop full of iron tools.

## The family

The content pipeline:

| Tool | Job | Compatible with | Registry |
| --- | --- | --- | --- |
| [ferroni](https://github.com/sebastian-software/ferroni) | Regex engine | Oniguruma / vscode-oniguruma | crates.io |
| [ferriki](https://github.com/sebastian-software/ferriki) | Syntax highlighting | Shiki | npm |
| [ferromark](https://github.com/sebastian-software/ferromark) | Markdown → HTML | CommonMark / GFM | crates.io |

More tools in the store:

| Tool | Job |
| --- | --- |
| [ferrovia](https://github.com/sebastian-software/ferrovia) | SVGO-compatible SVG optimizer |
| [ferrocat](https://github.com/sebastian-software/ferrocat) | Translation catalog engine (PO, FCL, ICU MessageFormat) |
| [ferrolex](https://github.com/sebastian-software/ferrolex) | Spell, dictionary, and brand validation |
| [ferrugo](https://github.com/sebastian-software/ferrugo) | Rust-native PDF previews |

## This repository

The site is built with [Ardo](https://github.com/sebastian-software/ardo) and deployed to
GitHub Pages on every push to `main`.

```sh
pnpm install
pnpm dev      # local dev server
pnpm build    # static build into build/client
```

Release automation conventions are documented in
[One product release with Release Please](docs/release-please-product-releases.md).

## License

[MIT](./LICENSE)
