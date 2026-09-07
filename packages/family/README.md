# @ferramenta/family

The [Ferramenta](https://ferramenta.dev) family in one package: the registry
every site reads its facts from, the shared chrome (header with the tool
switcher, footer), the project marks, the design tokens, and the display face.

> **Status:** consumed by ferramenta.dev through `workspace:*`. Not on npm yet —
> the `@ferramenta` scope has to be created first (see
> [Publishing](#publishing)). Until then siblings pin a commit SHA from Git.

## Requirements

|         |                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| React   | `>=19.0.0 <20.0.0` (peer)                                                                                                             |
| Ardo    | not required — an Ardo site passes `<ArdoThemeToggle />` into the header's `themeToggle` slot (the family sites are on the 4.2 floor) |
| Node    | >= 22.13 for the `ferramenta-readme` generator; the components have no Node floor of their own                                        |
| Bundler | for the chrome, anything that resolves package exports and imports CSS (Vite, as Ardo uses). `@ferramenta/family/registry` needs none |

## Install

```sh
# Once the @ferramenta scope exists:
pnpm add @ferramenta/family

# Until then — from Git, pinned to a commit SHA:
pnpm add "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/family"
```

That is the whole Git contract: **no `allowBuilds` entry, no
`onlyBuiltDependencies`, no build step of your own.** The package ships its
`dist/` in Git and runs no `prepare` script, because pnpm 12 refuses a
git-hosted package's build unless the consumer allow-lists it by a key that
contains the pinned SHA — which would break on every pin bump (ADR-0007).

What keeps that honest: `pnpm verify:package` installs the package into a
scratch project twice — the packed npm tarball, and the files `git archive HEAD`
carries, which is what codeload serves for a pinned commit — and imports both
entry points in a bare Node process. CI runs it on every commit. It cannot
resolve `github:…#<sha>` for a commit that does not exist yet, so the pinned
install itself is checked by hand once per pin bump:

```sh
cd "$(mktemp -d)" && echo '{"name":"pin-check","private":true,"type":"module"}' > package.json
pnpm add "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/family" react react-dom
node -e 'import("@ferramenta/family").then((m) => console.log(typeof m.SiteHeader))'
```

Two things to know:

- **The `&path:` part is required.** Without it you install the site, not the
  package.
- **Pin a commit SHA, not `main`,** so a CI run resolves the same code twice.
  Bump the pin when the registry changes.

## The chrome

```tsx
import { MarkDefs, SiteFooter, SiteHeader } from "@ferramenta/family";
import { ArdoThemeToggle } from "ardo/ui";

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
      <SiteHeader current="ferroni" themeToggle={<ArdoThemeToggle />} />
      <main>{children}</main>
      <SiteFooter current="ferroni" />
    </>
  );
}
```

- **`MarkDefs`** mounts the SVG sprite once per page. Without it every mark is
  empty: `Mark` only references symbols.
- **`SiteHeader`** — `current?: string`, `themeToggle?: ReactNode`,
  `actions?: ReactNode`, `nav?: ReactNode`, `as?: "header" | "div"`. Name the
  family member this site
  belongs to and the switcher marks that entry `aria-current="page"`, while the
  lockup links to ferramenta.dev instead of this site's root; leave it out on
  the family site itself. `themeToggle` is a slot at the end of the bar: an Ardo
  site passes `<ArdoThemeToggle />`, a site on something else passes its own
  control or nothing. The package does not import `ardo/ui` — that module only
  loads inside a bundler, and the theme switch belongs to the site's framework
  (ADR-0007). `actions` and `nav` are two more slots — the first just before
  the theme toggle for a docs site's search or section menu, the second between
  the lockup and the family navigation for a site's own navigation. Both take
  the site's own elements.
- **`SiteFooter`** — `current?: string` (de-emphasizes the site's own entry),
  `line?: "family" | "company"`, `legal?: ReactNode`, `as?: "footer" | "div"`.
  `line="company"` drops the family columns and keeps the company links: it is
  for the tools that share the workshop but not the engines (dalo, agent-bridge
  — decision D2 of the 2026-09 family audit).
- **`as`** on either one swaps the landmark element for a `div` with the same
  classes, for a host that already provides the landmark — see
  [Ardo docs sites](#ardo-docs-sites).
- **`ToolSwitcher`** — the switcher on its own, for a site whose framework owns
  the header. Same section.
- **`Mark`** — `name` (a symbol without the `i-` prefix, e.g. `ferroni`,
  `arrow`, `chev`), `className` (default `mark`; chrome icons use `icon`),
  `size`. On the page material it needs no more than `tokens.css`. On an iron
  surface of the host's own, put it inside an element with `class="on-iron"`:
  that carries the four duotone variables the marks read, the same set the
  header, footer and flyout use in both themes.
- **`FamilyLinks`** — the one-line variant for a site that keeps its own chrome
  (palamedes, per decision D6): `current`, `label`, `className`.

## Ardo docs sites

There are two ways in, and they differ in how much of the family chrome the
site ends up wearing.

### The whole chrome, outside `ArdoRoot` (preferred)

Ardo reads `handle = { chrome: false }` from every route match and then renders
neither its own header nor its own footer. The family header and footer go
outside `ArdoRoot`, in the site's own root component, and Ardo's sidebar rail
and generated navigation are untouched — that switch does not cover them.

```tsx
import { MarkDefs, SiteFooter, SiteHeader } from "@ferramenta/family";
import { ArdoRoot, ArdoSearch, ArdoSidebar, ArdoThemeToggle } from "ardo/ui";
import config from "virtual:ardo/config";

/* Read from every route match; no route below may override it. */
export const handle = { chrome: false };

export default function Root() {
  return (
    <>
      <MarkDefs />
      <SiteHeader current="ferrocat" actions={<ArdoSearch />} themeToggle={<ArdoThemeToggle />} />
      {/* The wrapper the site's stylesheet hangs the shell overrides off. */}
      <div className="docs-shell">
        <ArdoRoot config={config}>
          <ArdoSidebar>{/* … */}</ArdoSidebar>
        </ArdoRoot>
      </div>
      <SiteFooter current="ferrocat" legal={<>…</>} />
    </>
  );
}
```

Two things the site has to add for this to hold together:

- **Hand the scrolling back to the document.** Ardo's docs layout is an
  application shell: a fixed header, a `100vh` frame that never scrolls, and an
  inner `<main>` that does. A footer placed below that frame is unreachable. The
  wrapper class above is the hook for the overrides that fix it — `height: auto`
  and `overflow: visible` on the frame, `overflow: visible` on `#main-content`,
  and `position: sticky` with `top: var(--ardo-layout-headerHeight)` on
  `.ardo-sidebar` and the table of contents, which relied on the inner scroll
  container. Ardo's layout class names are hashed, so use its stable hooks
  (`#main-content`, `.ardo-sidebar`) or a direct-child path.
- **Set `--ardo-layout-headerHeight: 4rem`** on `:root`. Ardo derives its sticky
  offsets and the table-of-contents height from it, and `.bar` — the family
  header — is `4rem`. Without it every Ardo measurement is off by the
  difference.

`ArdoSearch` reads its index from a virtual module and falls back to the default
labels, so it works outside `ArdoRoot`'s provider. Ferrocat's
`docs/app/root.tsx` and `docs/app/styles/site.css` are the worked example.

- **`actions`** is the slot for the controls a docs site keeps in the bar —
  search, a section menu — rendered just before `themeToggle`. **`nav`** is a
  second slot, between the lockup and the family navigation, for a site's own
  navigation. Both take the site's own elements; the family chrome styles
  neither.

### The two pieces that fit inside `ArdoRoot` (fallback)

When a site cannot give up Ardo's own header — its navigation, search and
sidebar drawer are Ardo's, and `ArdoRoot` matches its chrome slots by component
identity (`child.type === ArdoHeader`), so anything else passed as a child
becomes the page _content_ — it takes the two pieces that do fit: the switcher
inside `ArdoHeaderActions`, and the family footer inside `ArdoFooter`. The site
keeps Ardo's header look; only the switcher and the footer are the family's.

```tsx
import { MarkDefs, SiteFooter, ToolSwitcher } from "@ferramenta/family";
import { ArdoFooter, ArdoHeaderActions, ArdoRoot } from "ardo/ui";

export default function Root() {
  return (
    <ArdoRoot>
      <MarkDefs />
      <ArdoHeaderActions>
        <ToolSwitcher current="ferroni" />
      </ArdoHeaderActions>
      <ArdoFooter>
        <SiteFooter as="div" current="ferroni" legal={<>…</>} />
      </ArdoFooter>
    </ArdoRoot>
  );
}
```

- **`ToolSwitcher`** — `current?: string`, `label?: ReactNode` (the trigger's
  text, default `Tools`), `align?: "end" | "start"`, `className?: string`. It is
  the same component `SiteHeader` renders, and it is self-contained: it carries
  its own duotone variables, and the flyout hangs from the trigger rather than
  from an assumed header height, so a host bar of any height works. It still
  needs `MarkDefs` on the page. Use `align="start"` when the trigger sits near
  the left edge, where the default right-aligned flyout would run off-screen.
  Narrow viewports are handled in `chrome.css`: below `46rem` the flyout stops
  hanging off the trigger and spans the viewport under it, dropping to one
  column when two no longer fit, so a consumer does not restate those rules. It
  assumes the trigger's bar does not scroll out from under an open flyout, which
  holds for the sticky and fixed headers this sits in.
- **`as="div"`** on `SiteFooter` (and on `SiteHeader`) renders the chrome
  without its landmark element. `ArdoFooter` is already a `<footer>`, so the
  default would nest one inside the other and give the page two `contentinfo`
  landmarks. The CSS is keyed on the `site-footer` / `site-header` classes, not
  on the element, so nothing else changes.

### CSS load order on an Ardo site

The order in [The chrome](#the-chrome) still holds — `tokens.css`, `fonts.css`,
`theme.css`, the site's own stylesheet, `chrome.css` last — but on an Ardo site
"last" does not settle every tie. Ardo re-emits `ardo/ui/styles.css` inside its
own route chunk, which the browser loads _after_ the root stylesheet, so ties
between `chrome.css` and Ardo on equal specificity go to Ardo. An integration
override that has to beat an Ardo rule needs one element selector more than the
rule it replaces — `footer.ardo-footer` rather than `.ardo-footer`. Ardo also
paints every `<a>` in its brand color; `chrome.css` already claims its own
anchors back (the lockup, the GitHub link, the flyout entries and the footer
columns), but it deliberately leaves the `actions` and `nav` slots alone, so
whatever a site puts there keeps Ardo's colors — and needs its own rule if it
wants the iron ink instead. Ferroni's and ferrocat's `docs/app/…/site.css` are
the worked examples.

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
`switcher`, `switcher-start`, `flyout`, `flygroup`, `ghlink`, `on-iron`,
`foot`, `foot-gap`, `foot-legal`, `mark`, `markplate`, `hook`, `fastener`,
`icon`. A site that needs one of them for its own elements should scope or
rename it.

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

The root entry pulls in React, and the chrome it renders wants a bundler for the
CSS entry points. A Node script, a build step or a site that renders its own
chrome imports `@ferramenta/family/registry`: same data, no React. Neither entry
imports `ardo/ui` — that module only loads inside a bundler, so Ardo reaches the
chrome through slots (`themeToggle`, `nav`) instead.

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
