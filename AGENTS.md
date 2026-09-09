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
pnpm verify:package # installs ferramenta-family in a scratch project (npm tarball + tracked files at HEAD)
pnpm agent:check    # lint + format:check + typecheck + build + test — run this before pushing
pnpm stats:refresh  # re-fetch versions and download counts from crates.io/npm
```

`pnpm build` (TypeScript, prerender, Ardo's link check) is the main gate;
`pnpm test` adds the registry-ownership unit tests and the README family-block
contract. `.github/workflows/ci.yml` runs that gate on every pull
request, `.github/workflows/deploy.yml` deploys `main` to GitHub Pages.

## Map

| Path                                   | Owns                                                                                                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/routes/home.tsx`                  | The single page (custom shell: renders its own header/footer)                                                                                                                                                    |
| `app/styles/site.css`                  | The page styles, ported from the approved comp — everything the family site does not share                                                                                                                       |
| `packages/family/src/`                 | The shared chrome the site consumes like a sibling: `SiteHeader`, `SiteFooter`, `Mark`/`MarkDefs` (+ `mark-defs.ts`, the SVG sprite), `FamilyLinks`                                                              |
| `packages/family/styles/`              | `tokens.css`, `fonts.css`, `chrome.css`, `theme.css` — the CSS entry points a consumer imports                                                                                                                   |
| `scripts/verify-package-consumers.mjs` | Packs the package, installs it in a scratch project, imports both entries — the Git/npm consumer contract                                                                                                        |
| `scripts/refresh-registry-stats.mjs`   | Build-time fetch of versions + downloads → `app/data/registry-stats.json`                                                                                                                                        |
| `packages/family/`                     | `ferramenta-family` — the published package: registry, chrome components, marks, tokens, font. **`src/family.ts` is the single source of truth** for tool names, jobs, proofs, versions, status, links, grouping |
| `packages/family/bin/`                 | `ferramenta-readme` — renders the `ferramenta-family` README block for this repo and every sibling (see the package README)                                                                                      |
| `design/comp/`                         | Approved design comp (`entwurf-c.html`) + the fonts and logos it loads                                                                                                                                           |
| `design/archive/`                      | Decision residue: the Streamline icon shortlist. Nothing here is built or shipped                                                                                                                                |
| `docs/adr/`                            | Decision records — **read before changing direction**, they are constraints                                                                                                                                      |
| `PRODUCT.md` / `DESIGN.md`             | Product truth / design system (tokens, materials, module rules)                                                                                                                                                  |
| `THIRD-PARTY-NOTICES.md`               | Licensing: Streamline-derived icon SVGs are **not** MIT                                                                                                                                                          |
| `docs/superpowers/specs/`              | Historical task-scoped design specs (not ADRs)                                                                                                                                                                   |

## Rules

- The site consumes `ferramenta-family` the way a sibling site does: through
  the package name, never a relative path into `packages/family`. What the
  chrome renders changes in the package, not in `app/`.
- `packages/family/dist` is **committed** (ADR-0007): siblings install the
  package straight from Git, and pnpm 12 will not build a git dependency without
  a per-SHA allowlist entry. Rebuild it (`pnpm build:package`) and commit it in
  the same change as the source; CI fails on a stale `dist`, and
  `pnpm verify:package` proves the consumer path (`node
scripts/check-committed-dist.mjs` is the guard CI runs after the build).
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
- Use US English for code, comments, commits, documentation, and site copy.
  German design proper names and historical German working artifacts are
  intentional exceptions; see [design/comp/README.md](design/comp/README.md).
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
  cascade order. Margins in site.css that it must not eat need a selector that
  outranks it; the chrome's own margins (`.site-footer`) rely instead on
  root.tsx loading `chrome.css` after site.css.
- **`ssr: { noExternal: ["lucide-react"] }`** in vite.config: Ardo uses lucide
  internally; without bundling, prerender inside a git worktree resolves a
  second React copy from the parent checkout and crashes with a useContext
  error. Do not remove.
- `app/routes.ts` is auto-generated by Ardo — don't edit.
- The dev/preview/drafts server ports live in `.claude/launch.json` (gitignored).

---

<!-- sebastian-software-consumer-agents:start -->

# Standards-managed repo guardrails

- Do not hand-edit managed files or standards-owned marker sections.
- If `standards check` reports drift, run `standards apply` or update standards.
- The repository's own gate may omit `standards check`; CI can still fail on it.

Node repositories:

- Fix or format every file reported by `oxfmt` whenever practical.
- For generated files, prefer formatting in the generator step.
- If formatting is not viable, use repo-local `.prettierignore`.
- Never add repo-specific ignores to managed `.oxfmtrc.json`.

Rust repositories:

- Keep `cargo fmt --all --check` and
  `cargo clippy --workspace --all-targets --all-features -- -D warnings` green.
- Lint levels belong in `[workspace.lints]`, never in managed `rustfmt.toml`.
- `rust-version` in `Cargo.toml` is the only MSRV; every other mention is a
  derived copy.
- Record a cargo-deny finding as a narrow, commented exception in `deny.toml` —
  never by widening the org allow-list.

<!-- sebastian-software-consumer-agents:end -->
