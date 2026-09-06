# Ferramenta

[![Powered by Sebastian Software](https://img.shields.io/badge/Powered%20by-Sebastian%20Software-00718d?style=flat-square)](https://oss.sebastian-software.com)
[![Deploy](https://github.com/sebastian-software/ferramenta/actions/workflows/deploy.yml/badge.svg)](https://github.com/sebastian-software/ferramenta/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**[ferramenta.dev](https://ferramenta.dev)** — the family site for the Ferramenta tools:
Rust-native developer tools by [Sebastian Software](https://oss.sebastian-software.com) that keep
the APIs the web ecosystem already knows.

_Ferramenta_ is Italian for "hardware store" — the shop full of iron tools.

<!-- ferramenta-family:start -->

## The Ferramenta family

This project is part of [Ferramenta](https://ferramenta.dev) — the family of Rust-native developer tools by [Sebastian Software](https://oss.sebastian-software.com) that keep the APIs the ecosystem already knows.

**The content pipeline**

| Tool                                                         | Job                                  |
| ------------------------------------------------------------ | ------------------------------------ |
| [ferroni](https://sebastian-software.github.io/ferroni/)     | Oniguruma-compatible regex engine    |
| [ferriki](https://github.com/sebastian-software/ferriki)     | Shiki-compatible syntax highlighting |
| [ferromark](https://sebastian-software.github.io/ferromark/) | Markdown to HTML — CommonMark & GFM  |

**The language workshop**

| Tool                                                       | Job                                              |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [ferrolex](https://github.com/sebastian-software/ferrolex) | Spell checking for text and code                 |
| [ferrocat](https://ferrocat.dev)                           | Translation catalog engine                       |
| [palamedes](https://palamedes.dev)                         | Internationalization for TypeScript applications |

**On the workbench**

| Tool                                                       | Job                                           |
| ---------------------------------------------------------- | --------------------------------------------- |
| [ferrovia](https://github.com/sebastian-software/ferrovia) | SVGO-compatible SVG optimizer                 |
| [ferralk](https://github.com/sebastian-software/ferralk)   | Glob matching and parallel filesystem walking |
| [ferrugo](https://github.com/sebastian-software/ferrugo)   | PDF previews for untrusted files              |

<!-- ferramenta-family:end -->

## This repository

The site is built with [Ardo](https://github.com/sebastian-software/ardo) and deployed to
GitHub Pages on every push to `main`. The family registry
([packages/family/src/family.ts](packages/family/src/family.ts)) is the single
source of truth for tool names, jobs, versions, and links; the approved design comp lives
in [design/comp/](design/comp/). Icon and font assets carry their own terms — see
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

Working on this repo (human or agent)? Start with [AGENTS.md](AGENTS.md); durable
decisions and their rationale live in [docs/adr/](docs/adr/README.md), the design system
in [DESIGN.md](DESIGN.md), and product truth in [PRODUCT.md](PRODUCT.md).

```sh
pnpm install
pnpm dev      # local dev server
pnpm build    # static build into build/client
```

The release model lives in
[`@sebastian-software/standards`](https://github.com/sebastian-software/standards/tree/main/reference/release-please);
[docs/release-please-product-releases.md](docs/release-please-product-releases.md)
is the pointer.

## License

[MIT](./LICENSE)

---

<!-- sebastian-software-branding:start -->

<p align="center">
  <a href="https://oss.sebastian-software.com">
    <img src="https://sebastian-brand.vercel.app/sebastian-software/logo-software.svg" alt="Sebastian Software" width="240" />
  </a>
</p>

<p align="center">
  <strong>Built by Sebastian Software</strong> — consulting for TypeScript, React &amp; Rust.<br />
  <a href="https://sebastian-software.de">Work with us</a> · <a href="https://oss.sebastian-software.com">More open source</a>
</p>

<p align="center">Copyright &copy; 2026 Sebastian Software GmbH</p>

<!-- sebastian-software-branding:end -->
