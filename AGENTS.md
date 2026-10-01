# AGENTS.md

Guidance for coding agents working in this repository. Humans welcome too.

## What this is

The family site for the Ferramenta engines — **ferramenta.dev** — plus the
shared workspace package that styles every sibling project site, and the kit
(`/kit`) that shows every piece of it. Rust-native engines by Sebastian
Software; this repo itself is TypeScript/React.

## Commands

```sh
pnpm install        # pnpm 11 workspace; `prepare` builds the workspace package
pnpm dev            # dev server on :5173
pnpm build          # builds the workspace package and site, then checks rendered page links
pnpm preview        # serves the production build on :4173
pnpm lint           # oxlint, then type-aware eslint (eslint-config-setup)
pnpm format         # oxfmt --write .   (pnpm format:check in CI)
pnpm typecheck      # react-router typegen && tsc --noEmit
pnpm test           # node --test, the README contracts, the Markdown link check (lychee, via mise) and the theme check
pnpm readme:write   # README.md is generated: edit README.md.src, then this (mise install --locked once, first)
pnpm verify:package # installs ferramenta-family in a scratch project (npm tarball + tracked files at HEAD)
pnpm agent:check    # lint + format:check + typecheck + build + test — run this before pushing
pnpm review         # a real browser over the build (needs CHROME=<chromium>): every page at eight widths, flyouts, keyboard order, motion; captures in .impeccable/review/
pnpm stats:refresh  # re-fetch versions and download counts from crates.io/npm
```

`pnpm build` (TypeScript, prerender, Ardo's content link check, the sitemap
prune that takes the `noindex` kit out, and the rendered page-fragment check) is
the main gate;
`pnpm test` adds the registry-ownership unit tests and the README family-block
contract. `.github/workflows/ci.yml` runs that gate on every pull
request, `.github/workflows/deploy.yml` deploys `main` to GitHub Pages.

## Map

| Path                                   | Owns                                                                                                                                                                                                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/root.tsx`                         | The shell of every page: the family header and footer (outside `ArdoRoot`), the direction contract, the kit's `noindex`, and the docs shell for the sample documentation                                                                                                                                        |
| `app/routes/home.tsx`                  | The family page, composed from the package's landing kit: hero plate, engine catalog, applications band, principles, the personal note with the workshop's logos, work with us                                                                                                                                  |
| `app/routes/kit/`, `app/kit/`          | The design library at `/kit` (public, `noindex`): tokens, materials, icons, chrome and landing kit rendered from the package, plus a sample tool page and sample docs for an invented tool (`app/kit/sample.ts`)                                                                                                |
| `app/styles/site.css`, `kit.css`       | Only what the family site does not share: the personal note, Ardo shell fixes; the kit's specimen frames and the sample tool's icon                                                                                                                                                                             |
| `packages/family/src/`                 | The shared chrome the site consumes like a sibling: `SiteHeader`, `SiteFooter`, `ToolSwitcher`, `SiteMenu`, `Icon`, `Mark`/`MarkDefs` (the line-icon sprite) — and the landing kit (`ProjectHero`, `Plate`, `EngineCatalog`, `ApplicationsBand`, `Principles`, `ComparisonTable`, `Relations`, `WorkWithUs`, …) |
| `packages/family/styles/`              | `tokens.css`, `fonts.css`, `theme.css`, `landing.css`, `chrome.css` — the CSS entry points a consumer imports, in that order with the site's own stylesheet before `chrome.css` — and the optional `docs.css` for an Ardo docs layout                                                                           |
| `packages/family/icons/`, `textures/`  | The member icons (one rendered picture at 640, 256 and 96px) and the three textures (steel, oak, rust). Built from `design/icons/` and `design/textures/`; never edited by hand                                                                                                                                 |
| `design/icons/`, `design/textures/`    | Masters, prompts and build scripts for the icons and textures (ADR-0009). A new member's icon starts here                                                                                                                                                                                                       |
| `scripts/verify-package-consumers.mjs` | Packs the package, installs it in a scratch project, imports both entries — the Git/npm consumer contract                                                                                                                                                                                                       |
| `scripts/refresh-registry-stats.mjs`   | Build-time fetch of versions + downloads → `app/data/registry-stats.json`                                                                                                                                                                                                                                       |
| `scripts/render-pipeline-sample.mjs`   | Runs Ferromark + Ferriki on the sample and writes `app/data/pipeline-sample.json` (needs `FERROMARK=` and `FERRIKI=` package paths); never hand-edit the output. The kit shows it as the `RunSample` specimen                                                                                                   |
| `design/social/card.html`              | The social card as a page; `public/social.png` is a browser screenshot of it (the command is in the file's head). Update its strip when the line-up changes                                                                                                                                                     |
| `scripts/review-site.mjs`              | `pnpm review`: drives a headless Chromium over the build, checks layout at eight widths, the flyouts, the keyboard order and motion, and writes captures to `.impeccable/review/` (not in CI; run it before a design change is called done)                                                                     |
| `scripts/prune-sitemap.mjs`            | Removes the `noindex` kit from the built sitemap (a `.tsx` route cannot opt out through frontmatter)                                                                                                                                                                                                            |
| `packages/family/`                     | `ferramenta-family` — the published package: registry, chrome, landing kit, icons, tokens, textures, font. **`src/family.ts` is the single source of truth** for names, what each member is and does, proofs, status, relations, links                                                                          |
| `design/comp/2026-10/`                 | The approved comps of the redesign (`typenschild-*.html`, ADR-0008). The earlier directions and comps are in Git history before the tag `design-residue-2026-09-30`                                                                                                                                             |
| `docs/adr/`                            | Decision records — **read before changing direction**, they are constraints                                                                                                                                                                                                                                     |
| `PRODUCT.md` / `DESIGN.md`             | Product truth / design system (tokens, materials, component rules)                                                                                                                                                                                                                                              |
| `THIRD-PARTY-NOTICES.md`               | Licensing: the font and the foreign logos                                                                                                                                                                                                                                                                       |

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
- Tool facts (names, what a member is and does, proofs, relations, links) come
  from `family.ts` — never hardcode them in components or page copy. Update the
  registry, everything re-renders. That includes the README family block of
  every sibling and of this repository: the mdtheme frames in
  `packages/family/markdown/` are generated (`pnpm theme:write`) and checked
  (`pnpm theme:check`, part of `pnpm test`), never hand-edited; this
  repository's README takes its own frame (`markdown/ferramenta/`) through
  `mdtheme.yaml`.
- Registry facts are **live** (ADR-0006): the Pages deploy runs
  `pnpm stats:refresh` before every build and nightly on a schedule, without
  committing anything, and the page updates versions and downloads live in the
  browser (`RegistryFacts`, from the package). The
  committed `app/data/registry-stats.json` is only the fallback snapshot for
  local and CI builds, and the `version` in `family.ts` the last resort.
  Evidence strings must never repeat a version number.
- Say what it is first (ADR-0008, ADR-0004): every surface names a thing in
  plain words (`what`), then what it does and for whom (`does`, `audience`),
  and only then where it comes from. Assume the reader does not know the
  field's history. Lineage keeps ADR-0004's register: successors honor the
  original → state the succession → give the why; new developments honor the
  standard they build on → state what they do differently → give the why. The
  registry marks each member with `succeeds`, `buildsOn` or `runsOn`.
- Two tiers (ADR-0001, amended 2026-09-30): the engines wear the family look;
  the applications (Palamedes, Dalo) are shown in one band, each on a light
  card under its own logo (`brand` in the registry), and keep their own sites.
- A foreign logo (an application's, Sebastian Software's, Sebastian
  Consulting's) stands on a light ground in its own colors: never on steel,
  oak or rust, never recolored. The switcher's applications tier is light for
  that reason.
- Quotes from outside voices (`Voices`) are verbatim, short, attributed and
  linked to their source, and they speak about the material, never about the
  family. No invented social proof.
- Claim results on the family site qualitatively, never with a figure: "among
  the fastest", "ahead of globset", "a larger test suite" are fine; factors,
  timings, percentages and test counts are not — they pretend to a precision
  that goes stale here and belong in each project's repository (a test
  enforces it on `evidence` and `proof`). No API-method names or spec dumps on the
  overview page. Only verifiable claims; no invented social proof.
- Design changes respect DESIGN.md and ADR-0008: three materials with one job
  each (brushed steel for plates, dark oak under them in the first viewport
  and the dark bands, rust for the closing band); everything else flat, the
  dark iron chrome included; small type never on steel or rust (it goes on an
  inlay); sharp corners except rivets and chain links; one authored scheme on
  landing pages, no theme toggle there. A new material or a second prop needs
  a decision record.
- Colors come from two ramps in `tokens.css`, `--iron-50…950` (warm greys) and
  `--rust-100…900`. Components take roles (`--bg`, `--ink`, `--rust`,
  `--steel`, …), never a step, and a new color is a step or a role there, not
  a literal in a stylesheet.
- Icons (ADR-0009): a member's icon is one rendered picture at three sizes,
  built from `design/icons/`. There is no flat or vector form. Never show one
  below 24px, never edit a shipped icon file by
  hand, and give every new raster its provenance sidecar (`impeccable
embed-prompt`).
- A design change is checked at every width, not at one: `pnpm build` then
  `CHROME=… pnpm review`. It fails on sideways scroll, a bar that does not fit,
  text leaving its plate, a flyout that leaves the viewport or does not close,
  a broken keyboard order, and motion that ignores the visitor's preference.
- A component change shows up in the kit: add or update its specimen in
  `app/kit/` in the same change. The kit's sample pages are about an invented
  tool on purpose; never put a real member's figures there.
- A pattern two members' sites need goes into the package, not into each
  site's stylesheet ("Patterns the sites share" in the package README). Shared
  components that may stand in documentation (`ComparisonTable`,
  `ComparisonBars`, `Measured`) use role tokens only, so they follow the docs
  scheme, and two-class selectors, so a host's bare `table` and `ul` rules do
  not outrank them.
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
- Site content is English. Tool names are lowercase in code and identifiers
  (`name`, `runsOn`, URLs, packages) and capitalized in prose — page copy and
  the registry's prose fields (`proof`, `PIPELINE.description`) alike; uppercase
  display is applied by CSS.
- Members are independent: nobody needs another member beside the one they
  came for. Copy never implies an entry point or a required chain, and no
  surface draws the members as a pipeline. Where two fit together, the registry
  says how (`uses`, `pairsWith`, `runsOn`) and the catalog repeats it in one
  sentence.

## Gotchas (hard-won)

- **Custom shell**: `root.tsx` exports `handle = { chrome: false }`, which
  disables Ardo's default header/footer on every route. Without it you get a
  double header. The family header and footer render in `root.tsx`, outside
  `ArdoRoot`, so they are real landmarks; a route renders only its content.
- **Landing routes are bare**: a `.tsx` route exports
  `handle = { layout: "bare" }` and wraps its content in `.fam-page`.
  Documentation routes (`.mdx`) keep Ardo's layout and must not sit inside
  `.fam-page`: it pins the light scheme, and docs follow the system's.
- **The page ground is `.fam-page`**, not `body`: Ardo's layout `<main>` paints
  its own background. The wrapper is in each landing route, as on a sibling's
  site, not in `root.tsx`.
- **Ardo layout quirks**: `.ferramenta-site main` gets `overflow: visible` and
  `padding: 0` overrides in site.css — Ardo's docs-style scroll container and
  fixed-header spacing otherwise break the sticky header and full-bleed bands.
  The docs sample uses Ardo's own layout class instead, inside
  `.fam-docs-shell` (`docs.css`), which hands the scrolling back to the page.
- **The scoped reset** (`:where(.ferramenta-site) *`) has zero specificity on
  purpose: it may never take a tie from the landing kit, the chrome or site.css.
  Do not "fix" it back to `.ferramenta-site *`, which outranked every
  single-class margin loaded before it.
- **Load order** (root.tsx): tokens, fonts, theme, docs, `landing.css`,
  site.css, kit.css, `chrome.css`. site.css adjusts the kit on equal
  specificity; the chrome wins its ties. A pattern a sibling could use goes into
  `landing.css`, not site.css.
- **Icons are CSS background images** (`.fam-icon[data-icon="…"]` in
  chrome.css), so the consumer's bundler resolves the files. A member without
  its three rules shows a blank tile; a test checks every registry member.
- **`ssr: { noExternal: ["lucide-react"] }`** in vite.config: Ardo uses lucide
  internally; without bundling, prerender inside a git worktree resolves a
  second React copy from the parent checkout and crashes with a useContext
  error. Do not remove.
- **`vite preview` and a path without its trailing slash**: `/kit/tool` is
  answered with the home page's prerendered HTML until the client router takes
  over. GitHub Pages redirects to `/kit/tool/`; when capturing screenshots
  locally, use the trailing slash.
- `app/routes.ts` is auto-generated by Ardo — don't edit.
- The dev/preview/comps server ports live in `.claude/launch.json` (gitignored).

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
