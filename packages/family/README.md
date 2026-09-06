# @ferramenta/family

The [Ferramenta](https://ferramenta.dev) family in one package: the registry
every site reads its facts from, the shared chrome (header with the tool
switcher, footer), the project marks, the design tokens, and the display face.

> **Status:** consumed by ferramenta.dev through `workspace:*`. Not on npm yet —
> the `@ferramenta` scope has to be created first (see
> [Publishing](#publishing)). Until then siblings pin a commit SHA from Git.

## Requirements

|         |                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------- |
| React   | `>=19.0.0 <20.0.0` (peer)                                                                      |
| Ardo    | `>=4.2.0` (peer) — the floor every family site is moving to                                    |
| Node    | >= 22.13 for the `ferramenta-readme` generator; the components have no Node floor of their own |
| Bundler | anything that resolves package exports and imports CSS (Vite, as Ardo uses)                    |

## Install

```sh
pnpm add @ferramenta/family        # once the scope exists
pnpm add github:sebastian-software/ferramenta#<commit-sha>&path:/packages/family
```

## The chrome

```tsx
import { MarkDefs, SiteFooter, SiteHeader } from "@ferramenta/family";

import "@ferramenta/family/tokens.css";
import "@ferramenta/family/fonts.css";
import "@ferramenta/family/theme.css";
import "./your-site.css";
// Last: the chrome has to win the ties a site-wide reset would otherwise take.
import "@ferramenta/family/chrome.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarkDefs />
      <SiteHeader current="ferroni" />
      <main>{children}</main>
      <SiteFooter current="ferroni" />
    </>
  );
}
```

- **`MarkDefs`** mounts the SVG sprite once per page. Without it every mark is
  empty: `Mark` only references symbols.
- **`SiteHeader`** — `current?: string`. Name the family member this site
  belongs to and the switcher marks that entry `aria-current="page"`, while the
  lockup links to ferramenta.dev instead of this site's root. Leave it out on
  the family site itself. The theme toggle is Ardo's `ArdoThemeToggle`.
- **`SiteFooter`** — `current?: string` (de-emphasizes the site's own entry),
  `line?: "family" | "company"`, `legal?: ReactNode`. `line="company"` drops the
  family columns and keeps the company links: it is for the tools that share the
  workshop but not the engines (dalo, agent-bridge — decision D2 of the 2026-09
  family audit).
- **`Mark`** — `name` (a symbol without the `i-` prefix, e.g. `ferroni`,
  `arrow`, `chev`), `className` (default `mark`; chrome icons use `icon`),
  `size`.
- **`FamilyLinks`** — the one-line variant for a site that keeps its own chrome
  (palamedes, per decision D6): `current`, `label`, `className`.

## CSS entry points

| Import                          | What it is                                                                 | Safe to load anywhere?                                  |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------- |
| `@ferramenta/family/tokens.css` | The OKLCH design tokens on `:root` and `:root.dark`                        | Yes — variables only, nothing paints                    |
| `@ferramenta/family/fonts.css`  | `@font-face` for Big Shoulders plus the bundled WOFF2                      | Yes — optional; the chrome falls back to the body stack |
| `@ferramenta/family/theme.css`  | Maps the tokens onto Ardo's `--ardo-color-brand*` and styles `FamilyLinks` | Yes                                                     |
| `@ferramenta/family/chrome.css` | The header, footer, marks, plates and hooks                                | Load it **after** your own stylesheet                   |

`chrome.css` needs `tokens.css`: every color, plate and hook value is a token.
It goes last, after the site's own stylesheet, so a site-wide reset cannot take
the selector ties from the chrome — which also means it wins those ties. It owns
these class names: `site-header`, `site-footer`, `bar`, `wrap`, `lockup`,
`switcher`, `flyout`, `flygroup`, `ghlink`, `foot`, `foot-gap`, `foot-legal`,
`mark`, `markplate`, `hook`, `fastener`, `icon`. A site that needs one of them
for its own elements should scope or rename it.

The font file is also exported directly, for a preload link:

```tsx
import bigShoulders from "@ferramenta/family/fonts/big-shoulders.woff2?url";
```

## The registry

`family`, `familyGroups()`, `FAMILY_SITE` and `isEngine()` come from
`src/family.ts` — the single source of truth for names, jobs, proofs, versions,
status, links and grouping (ADR-0001). Read facts from it; never hardcode them.

Two entry points, because the chrome needs a bundler and the registry does not:

```ts
import { family, familyGroups } from "@ferramenta/family/registry"; // data only
import { family, SiteHeader } from "@ferramenta/family"; // data plus the chrome
```

The root entry pulls in `SiteHeader`, which imports `ardo/ui` — a bundler-only
module (it imports CSS and a `virtual:` config). A Node script, a build step or
a site that renders its own chrome imports `@ferramenta/family/registry`: same
data, no React and no Ardo.

## The README family block

`ferramenta-readme` renders the block every sibling README carries, straight
from the registry — so a job string, a new member or a moved docs URL changes in
`src/family.ts` and every repository follows on its next run instead of being
hand-copied out of date.

```sh
ferramenta-readme --current ferrocat                    # print the block
ferramenta-readme --current ferrocat --variant registry # the two-line flavor
ferramenta-readme --current ferrocat --write README.md  # insert or update it
ferramenta-readme --current ferrocat --check README.md  # exits 1 on drift
```

- **`--variant github`** (default) is the full block: one sentence linking
  [ferramenta.dev](https://ferramenta.dev), then a table per group — the content
  pipeline, the language workshop, the workbench — with applications listed
  beside the engines.
- **`--variant registry`** is two plain-Markdown lines with no HTML and no
  tables, for the README that crates.io and npm render.
- **`--current <name>`** bolds that tool in the `github` tables, and names it in
  the `registry` lead line while leaving it out of its own sibling list.
- **`--write`** replaces an existing block wherever it sits, and otherwise
  inserts it above the standards-owned `sebastian-software-branding` section
  (the company footer, applied by `@sebastian-software/standards`), or at the
  end when there is none. This tool never renders that footer.
- **`--check`** compares content, not whitespace: Markdown formatters pad table
  cells and add blank lines around HTML comments, and the family repositories do
  not all run the same formatter, so only a real difference is drift. Wire it
  into CI next to the repository's other README contract checks.

### Running it from a sibling repository

The `@ferramenta` npm scope does not exist yet, so consume the package straight
from Git. `pnpm dlx` accepts a ref and a subdirectory:

```sh
pnpm dlx "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/family" \
  --current ferrocat --write README.md
```

Three things to know:

- **The `&path:` part is required.** Without it pnpm installs the site, not the
  package, and there is no `ferramenta-readme` binary to run.
- **Pin a commit SHA, not `main`.** A branch ref works, but a CI job that
  resolves `main` re-runs against whatever landed since — the README block it
  blesses today is not the one it blessed yesterday. Bump the pin when the
  registry changes; the block is generated, so the diff shows exactly what
  moved.
- **Node >= 22.13 is the floor.** The generator reads `src/family.ts`, the
  declared source of truth, so an edit to the registry is picked up without a
  build. Node itself refuses to strip types from a file under `node_modules`,
  which is where an installed package lives, so the generator strips them with
  `module.stripTypeScriptTypes` (Node >= 22.13) and imports the JavaScript
  through a `data:` URL. In a checkout — this repository, or a `git clone` —
  Node strips the types on import instead (>= 22.18).

On older Node, build the package first and run it from the checkout; the
generator falls back to `dist/family.js`:

```sh
git clone --depth 1 https://github.com/sebastian-software/ferramenta.git
pnpm --dir ferramenta/packages/family install
pnpm --dir ferramenta/packages/family build
node ferramenta/packages/family/bin/family-readme.mjs --current ferrocat --write README.md
```

## Publishing

Releases run through release-please (`release-please-config.json` at the
repository root, `release-type: node`, one product version) and
`.github/workflows/publish.yml`, which publishes this package with npm Trusted
Publishing (OIDC) and `--provenance`. No npm token is stored anywhere.

**Owner actions, still open:**

1. Create the `@ferramenta` scope on npmjs.com.
2. Configure Trusted Publishing for `@ferramenta/family`, bound to
   `sebastian-software/ferramenta` and `.github/workflows/publish.yml`.
3. Set the repository variable `FERRAMENTA_NPM_SCOPE_READY` to `true`.

Until step 3 the publish job stops at its first step with that message, so a
release cannot half-publish quietly.

## Licensing

The code is MIT. The bundled marks are Streamline-derived and the font is under
the SIL Open Font License — both carry their own terms in
[NOTICE.md](NOTICE.md). Keep the sprite under 100 icons (ADR-0002); a test in
this package fails if it grows past that.
