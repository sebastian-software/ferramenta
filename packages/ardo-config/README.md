# @ferramenta/ardo-config

Shared [Ardo](https://github.com/sebastian-software/ardo) configuration for the
[Ferramenta](https://ferramenta.dev) sites: one theme, one project registry,
and cross-site navigation.

> **Status:** consumed via `workspace:*` by ferramenta.dev. npm publishing
> under the `@ferramenta` scope is prepared but pending scope creation.

## Usage in an Ardo site

```sh
pnpm add @ferramenta/ardo-config
```

In `app/root.tsx`:

```tsx
import { FamilyLinks } from "@ferramenta/ardo-config";
import "@ferramenta/ardo-config/theme.css";

// inside the Ardo footer (or anywhere in the chrome):
<ArdoFooter
  copyright="..."
  // ...
>
  <FamilyLinks current="ferriki" />
</ArdoFooter>;
```

- `theme.css` applies the family brand (amber/copper) to all Ardo chrome
  via the `--ardo-color-brand*` variables and styles the `FamilyLinks` nav.
- `FamilyLinks` renders links to every family member; pass `current` to
  de-emphasize the site's own entry.
- `family` / `FAMILY_SITE` export the raw data when you need custom layout.

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
pnpm dlx "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/ardo-config" \
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
pnpm --dir ferramenta/packages/ardo-config install
pnpm --dir ferramenta/packages/ardo-config build
node ferramenta/packages/ardo-config/bin/family-readme.mjs --current ferrocat --write README.md
```
