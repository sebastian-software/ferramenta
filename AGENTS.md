# AGENTS.md

Guidance for coding agents working in this repository. Humans welcome too.

## What this is

The family site for the Ferramenta tools — **ferramenta.dev** — plus the shared
workspace package that will style every sibling project site. Rust-native
developer tools by Sebastian Software; this repo itself is TypeScript/React.

## Commands

```sh
pnpm install        # pnpm 11 workspace; `prepare` builds the workspace package
pnpm dev            # dev server on :5173
pnpm build          # builds the workspace package (tsc), then the site (prerender to build/client)
pnpm preview        # serves the production build on :4173
pnpm lint           # oxlint, then type-aware eslint (eslint-config-setup)
pnpm format         # oxfmt --write .   (pnpm format:check in CI)
pnpm typecheck      # react-router typegen && tsc --noEmit
pnpm test           # node --test plus the README family-block contract
pnpm agent:check    # lint + format:check + typecheck + build + test — run this before pushing
pnpm stats:refresh  # re-fetch versions and download counts from crates.io/npm
```

`pnpm build` (TypeScript, prerender, Ardo's link check) is the main gate;
`pnpm test` adds the registry-ownership unit tests and the README family-block
contract. `.github/workflows/ci.yml` runs that gate on every pull
request, `.github/workflows/deploy.yml` deploys `main` to GitHub Pages.

## Map

| Path                                 | Owns                                                                                                                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/routes/home.tsx`                | The single page (custom shell: renders its own header/footer)                                                                                                              |
| `app/components/`                    | `SiteHeader`, `SiteFooter`, `Marks` (+ `mark-defs.ts`, auto-extracted SVG sprite)                                                                                          |
| `app/styles/site.css`                | The whole visual system, ported from the approved comp                                                                                                                     |
| `scripts/refresh-registry-stats.mjs` | Build-time fetch of versions + downloads → `app/data/registry-stats.json`                                                                                                  |
| `packages/ardo-config/`              | `@ferramenta/ardo-config` → future `@ferramenta/family`. **`src/family.ts` is the single source of truth** for tool names, jobs, proofs, versions, status, links, grouping |
| `packages/ardo-config/bin/`          | `ferramenta-readme` — renders the `ferramenta-family` README block for this repo and every sibling (see the package README)                                                |
| `design/comp/`                       | Approved design comp (`entwurf-c.html`) + the fonts and logos it loads                                                                                                     |
| `design/archive/`                    | Decision residue: the Streamline icon shortlist. Nothing here is built or shipped                                                                                          |
| `docs/adr/`                          | Decision records — **read before changing direction**, they are constraints                                                                                                |
| `PRODUCT.md` / `DESIGN.md`           | Product truth / design system (tokens, materials, module rules)                                                                                                            |
| `THIRD-PARTY-NOTICES.md`             | Licensing: Streamline-derived icon SVGs are **not** MIT                                                                                                                    |
| `docs/superpowers/specs/`            | Historical task-scoped design specs (not ADRs)                                                                                                                             |

## Rules

- Tool facts (names, jobs, proofs, links) come from `family.ts` — never hardcode
  them in components. Update the registry, everything re-renders. That includes
  the README family block: it is generated (`pnpm readme:write`) and checked
  (`pnpm readme:check`, part of `pnpm test`), never hand-edited between the
  `<!-- ferramenta-family -->` markers.
- Versions and download counts are **live** (ADR-0006): `pnpm stats:refresh`
  writes `app/data/registry-stats.json` from crates.io and npm, and a nightly
  workflow keeps it current. The `version` in `family.ts` is only the offline
  fallback, and evidence strings must never repeat a version number.
- Site copy follows the successor register (ADR-0004): honor the original →
  state the succession → give the why. No API-method names or spec dumps on the
  overview page. Only verifiable claims; no invented social proof.
- Design changes respect DESIGN.md and ADR-0003: material lives only on body
  texture, octagon plates, and hooks; board geometry moves in 28px-module steps
  (padding ≡ 14 mod 28); zero border-radius.
- Streamline-derived SVGs: keep any repo under 100 icons, keep attribution and
  the ownership carve-out intact (ADR-0002).
- Code style is whatever `oxfmt` produces — run `pnpm format`, never hand-tune
  formatting. Conventional commits; releases via release-please.
- This repository is onboarded to
  [`@sebastian-software/standards`](https://github.com/sebastian-software/standards)
  (`.repometa.json`). `.oxfmtrc.json` is **managed**: never hand-edit it, and
  never add repo-specific ignores there. `eslint.config.ts`, `oxlint.config.ts`,
  `cspell.json` and `.github/workflows/ci.yml` are seeded — repo-specific
  overrides on top of them are fine and carry a comment saying why. CI runs
  `standards check`, so managed drift fails the build.
- Site content is English. Tool names are lowercase in code and data; uppercase
  is applied by CSS.

## Gotchas (hard-won)

- **Custom shell**: the route exports `handle = { chrome: false }` to disable
  Ardo's default header/footer. Without it you get a double header.
- **Ardo layout quirks**: `.ferramenta-site main` gets `overflow: visible` and
  `padding: 0` overrides in site.css — Ardo's docs-style scroll container and
  fixed-header spacing otherwise break the sticky header and full-bleed bands.
- **The scoped reset** (`.ferramenta-site * { margin: 0 … }`) must stay the
  first rule block of site.css — later rules of equal specificity depend on
  cascade order. Element-selector margins it must not eat get a class selector
  (see `footer.site-footer`).
- **`ssr: { noExternal: ["lucide-react"] }`** in vite.config: Ardo uses lucide
  internally; without bundling, prerender inside a git worktree resolves a
  second React copy from the parent checkout and crashes with a useContext
  error. Do not remove.
- `app/routes.ts` is auto-generated by Ardo — don't edit.
- The dev/preview/drafts server ports live in `.claude/launch.json` (gitignored).
