# ferramenta-family

The [Ferramenta](https://ferramenta.dev) family in one package: the registry
every site reads its facts from, Monografie — the page system of the family
site, the engine homepages and their documentation — the members' marks,
instruments and favicons, and the Markdown frames for the members' READMEs.

Every part of Monografie is on show at
[ferramenta.dev/kit](https://ferramenta.dev/kit/), rendered from this package
with an invented tool, homepage and documentation.

> **3.0 is a breaking release** (ADR-0012): it removes the original entry and
> the Ferra entry, so Monografie is the one page system. See
> [Moving from 2.x](#moving-from-2x). ferramenta.dev consumes the package
> through `workspace:*`; sibling sites use a versioned npm dependency and pin a
> Git commit only when testing unreleased source.

## Native Markdown theme

Give your Rust project's README a compact family footer, with the Ferramenta
icon and descriptions of the other tools. Install mdtheme using its
[project setup guide](https://github.com/sebastian-software/mdtheme/blob/main/docs/project-tools.md),
then add this to `mdtheme.yaml`:

```yaml
themes:
  - git: https://github.com/sebastian-software/sebastian-theme.git
    ref: main
    path: markdown
  - git: https://github.com/sebastian-software/ferramenta.git
    ref: main
    path: packages/family/markdown/ferromark
```

Replace `ferromark` with your catalog ID. That directory excludes the current
project from its related links. Explicit selection also works in Cargo
workspaces and repositories whose directory name differs from the crate name.
Use a tag or commit instead of `main` to pin the theme. Git access is required;
Node and theme dependencies are not required in the consuming Rust project.

Keep project prose in `README.md.src`, then run `mise run readme:write` and
`mise run readme:check`. Remove any old `ferramenta-family` block from the
source during migration. Include company branding once, through the outer
Sebastian theme; migrate standards-owned branding through standards rather
than editing its markers manually.

The central catalog includes family engines and applications. It supplies all
names, descriptions, and links. Maintainers run `pnpm theme:write` after edits;
`pnpm theme:check` checks the committed files in CI. Both commands reject
unexpected output directories; review and remove obsolete generated files
manually when removing a catalog member. The generator never deletes them. Markdown frame files are
included in the published family package too.

The pages read the same registry: Monografie's catalog, applications and
footer, and a site that keeps a chrome of its own renders its list from
`ferramenta-family/registry` (`relatedTools`, `toolHref`), as palamedes.dev
does. An unknown family ID fails instead of silently including an incorrect
link.

### What a sibling README carries

The frame is the family's part of a README; the rest is the project's, with a
few shared rules so the family reads as one:

- The tool's name is capitalized in prose (Ferroni, Ferrocat) and lowercase in
  code, URLs, package and crate names, at the start of a sentence too.
- The line under the H1 is the registry's `job` for that tool, word for word,
  and the same sentence goes into the Cargo or npm description. Speed,
  compatibility and test claims do not go into the tagline.
- Where the tool comes from is told in ADR-0004's register: honor the original,
  state the succession, give the why.
- Badges point at current evidence (registry version, docs, CI, license, MSRV).
  No static badges for test totals or compatibility percentages, and no
  invented social proof; figures live in an evidence section with a link to
  what produced them.
- The family footer comes last, before the standards-owned company footer.

## Requirements

|         |                                                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| React   | `>=19.0.0 <20.0.0` (peer)                                                                                                            |
| Ardo    | not required; `monografie-ardo.css` fits Monografie to an Ardo 6 documentation site                                                  |
| Node    | `>=20.11.0`                                                                                                                          |
| Theme   | one authored light scheme; an Ardo site sets `colorScheme="light"` on `ArdoRootLayout`                                               |
| Bundler | for Monografie, anything that resolves package exports and imports CSS (Vite, as Ardo uses). `ferramenta-family/registry` needs none |

## Install

```sh
# Use the published semver release:
pnpm add ferramenta-family@^2.0.0

# To test an unreleased source snapshot from Git:
pnpm add "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/family"
```

That is the whole Git contract: **no `allowBuilds` entry, no
`onlyBuiltDependencies`, no build step of your own.** The package ships its
`dist/` in Git and runs no `prepare` script, because pnpm 12 refuses a
git-hosted package's build unless the consumer allow-lists it by a key that
contains the pinned SHA — which would break on every pin bump (ADR-0007).

What keeps that honest: `pnpm verify:package` installs the package into a
scratch project twice — the packed npm tarball, and the files `git archive HEAD`
carries, which is what codeload serves for a pinned commit — and imports its
entry points in a bare Node process. CI runs it on every commit. It cannot
resolve `github:…#<sha>` for a commit that does not exist yet, so the pinned
install itself is checked by hand once per pin bump:

```sh
cd "$(mktemp -d)" && echo '{"name":"pin-check","private":true,"type":"module"}' > package.json
pnpm add "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/family" react react-dom
node -e 'import("ferramenta-family/monografie").then((m) => console.log(typeof m.MonoHeader))'
```

Two things to know:

- **The `&path:` part is required.** Without it you install the site, not the
  package.
- **Pin a commit SHA, not `main`,** so a CI run resolves the same code twice.
  Bump the pin when the registry changes.

## Monografie

`ferramenta-family/monografie` is the page system of the family site, the
engine homepages and their documentation (ADR-0012): the steel header, the
instrument as the opening plate, one reading column with margin notes, facing
sheets for real output, term lists, proofs, cards, a comparison chart and the
closing. Its classes and tokens are scoped to `.mono`, `.mono-header`,
`.mono-footer` and, on an Ardo site, `.mono-ardo`.

The entry also exports what such a page needs from the rest of the package, so
a site imports from one place: `Mark` and `MarkDefs` (the line-icon sprite the
documentation navigation uses), `RegistryFacts` and `useToolFacts` (live
release facts), `IDENTITIES` and `hasIdentity` (the members with a mark and an
instrument), and the comparison types `Contender`, `ComparisonRow`,
`ComparisonCell`, `ComparisonMark`, `ComparisonTableProps`, `MeasuredProps` and
`MeasuredRow`. The root entry keeps exporting these too.

```tsx
import {
  MonoFooter,
  MonoHeader,
  MonoOpening,
  MonoPage,
  MonoSection,
} from "ferramenta-family/monografie";
import "ferramenta-family/monografie.css";

<MonoPage>
  <MonoHeader product="ferroni" home="/" release={version} links={[<a href="/guide/">Guide</a>]} />
  <main>
    <MonoOpening product="ferroni" instrumentLabel="…" kicker="…" title="…" standfirst="…" actions={…} />
    <MonoSection title="…">…</MonoSection>
  </main>
  <MonoFooter product="ferroni" home="/" />
</MonoPage>;
```

Reading text uses the system UI font; Source Serif 4 Subhead ships for
headings. Rust appears only on the primary action (`MonoAction primary`) and
the engine's own bar (`own` on a `MonoBarChart` row). Each site keeps its
specimens and the scripts that produce their real output. The kit renders every
part at [ferramenta.dev/kit](https://ferramenta.dev/kit/), with an invented
tool.

The family site uses three more parts that read the registry:
`MonoEngineCatalog` (every engine on its own plate), `MonoApplications` (light
cards under each application's own logo) and `MonoWorkshop` (the workshop's
two brands). On the family site itself, pass `familyHref={null}` to
`MonoHeader`.

### Documentation pages

An engine's guides use the same entry (ADR-0012): a reading layout between the
site's navigation and the page outline, the tables, code sheets and worked
examples that stand in it, and the Ardo integration. Load both documentation
stylesheets after `monografie.css`, and put the classes on Ardo's shell:

```tsx
import {
  MonoGuideNavigation,
  MonoHeader,
  MonoPage,
  MonoReadingLayout,
  MonoReadingTable,
  MonoSectionRail,
} from "ferramenta-family/monografie";
import "ferramenta-family/monografie.css";
import "ferramenta-family/monografie-docs.css";
import "ferramenta-family/monografie-ardo.css";

<ArdoRootLayout className="mono-ardo" colorScheme="light">…</ArdoRootLayout>;

<MonoPage className="mono-docs">
  <ArdoRoot
    className="mono-ardo-shell"
    scrollMode="document"
    header={<MonoHeader … actions={<DocsActions />} />}
    sidebar={false}
    footer={false}
    components={{ table: MonoReadingTable, wrapper: Article }}
  />
  <MonoFooter product="ferroni" home="/" />
</MonoPage>;

// Article: <MonoReadingLayout navigation={<><MonoSectionRail>…</MonoSectionRail>
//   <MonoGuideNavigation>…</MonoGuideNavigation></>} outline={<ArdoTOC source="dom" … />}>
```

`monografie-ardo.css` maps Ardo's tokens onto Monografie's, sets Ardo's
highlighted code, outline, search and mobile menu in its look, and carries the
shell fixes each site used to repeat: no padding for a fixed header, `main` is
not a scroll container, anchors clear the 60px sticky header, and with
documentation navigation on the page the Monografie menu button steps aside
below 961px for Ardo's menu. Its rules stand on `.mono-ardo`, `.mono-docs` and
`.mono-ardo-shell`; those of `monografie-docs.css` on `.mono` and `mono-`
classes. The kit renders a sample page at
[ferramenta.dev/kit/docs](https://ferramenta.dev/kit/docs/).

Where the documentation navigation stands beside the text (from 961px), Ardo's
menu button steps aside, and just above that width the header's spacing
tightens, so six links, the release, the family link and search keep one row.
Code that scrolls sideways in the reading column, a `MonoCard` or a `MonoSheet`
takes a tab stop, so a keyboard can scroll it. A `MonoReadingTable` without an
`aria-label` is named after its caption or the heading it stands under,
numbered where two share one, so several tables on a page stay distinct
regions.

## Moving from 2.x

3.0 removes the two earlier visual systems: the original entry (the chrome,
the landing kit, `tokens.css`, `fonts.css`, `theme.css`, `landing.css`,
`chrome.css`, `docs.css`, the Barlow faces, the member icons and the old
textures) and the Ferra entry (`ferramenta-family/ferra`, `ferra.css`,
`ferra-ardo.css`, `ferra-tokens.css`, `ferra-fonts.css`, every `Ferra*`
component). The registry, the README frames, the marks, instruments and
favicons under `ferra-assets/*`, and the application logos under `icons/*`
stay. Moving a site's documentation from the Ferra reading layout is a
rename: the reading components take the props of their Ferra counterparts. The
homepage parts in the last rows have props of their own.

| Ferra                                                                            | Monografie                                                                   |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `ferramenta-family/ferra.css`                                                    | `ferramenta-family/monografie-docs.css`, after `monografie.css`              |
| `ferramenta-family/ferra-ardo.css`                                               | `ferramenta-family/monografie-ardo.css`                                      |
| `ArdoRootLayout className="ferra-tokens ferra-ardo"`                             | `ArdoRootLayout className="mono-ardo" colorScheme="light"`                   |
| `<FerraPage className="ferra-site …">`                                           | `<MonoPage className="mono-docs …">`                                         |
| `ArdoRoot className="ferra-ardo-shell"`                                          | `ArdoRoot className="mono-ardo-shell"`                                       |
| `FerraReadingLayout`, `FerraGuideNavigation`, `FerraSectionRail`                 | `MonoReadingLayout`, `MonoGuideNavigation`, `MonoSectionRail`                |
| `FerraReadingTable`, `FerraTableViewport`, `FerraTable`                          | `MonoReadingTable`, `MonoTableViewport`, `MonoTable`                         |
| `FerraBenchmarkTable`, `FerraComparisonTable`, `FerraMeasured`, `FerraBars`      | `MonoBenchmarkTable`, `MonoComparisonTable`, `MonoMeasured`, `MonoBars`      |
| `FerraCode`, `FerraRenderedCode`, `FerraCodePair`, `FerraDiagram`                | `MonoCode`, `MonoRenderedCode`, `MonoCodePair`, `MonoDiagram`                |
| `FerraExample`, `FerraToggle`, `FerraSelect`, `FerraTabs`, `FerraSteps`          | `MonoExample`, `MonoToggle`, `MonoSelect`, `MonoTabs`, `MonoSteps`           |
| `FerraChoices`, `FerraFeatureGrid`, `FerraColumns`, `FerraMedia`, `FerraArticle` | `MonoChoices`, `MonoFeatureGrid`, `MonoColumns`, `MonoMedia`, `MonoArticle`  |
| `FerraAction` (primary unless told otherwise)                                    | `MonoAction variant="primary"` (secondary unless told)                       |
| `ferra-reading-navigation`, `ferra-reading-outline`, `ferra-prose`               | `mono-reading-navigation`, `mono-reading-outline`, `mono-prose`              |
| `ferra-benchmark-name`, `-detail`, `-source`, `-conformance`, `-reference`       | `mono-benchmark-name`, `-detail`, `-source`, `-conformance`, `-reference`    |
| `ferra-table` (the table `FerraTable` renders)                                   | `mono-data-table`                                                            |
| `FerraHeader`, `FerraFooter`, `FerraHero`, `FerraSection`                        | `MonoHeader`, `MonoFooter`, `MonoOpening`, `MonoSection`                     |
| `FerraEngineCatalog`, `FerraApplications`, `FerraWorkshop`                       | `MonoEngineCatalog`, `MonoApplications`, `MonoWorkshop`                      |
| `Mark`, `MarkDefs`, `RegistryFacts`, `ComparisonRow` from `ferramenta-family`    | the same names from `ferramenta-family/monografie` (the root still has them) |

Beyond the rename, a site deletes its local shell fixes (the
`padding-block-start`, `scroll-padding-top`, sticky `top` and menu-button rules
in its own stylesheet) and stops importing `ferra.css` and `ferra-ardo.css`.
`MonoBars` sets the highlighted bar in the instrument's rust, as `MonoBarChart`
does. A site on the original chrome (`SiteHeader`, `SiteFooter`, the landing
kit) moves to `MonoHeader`, `MonoFooter` and the Monografie parts; the 2.x
README in Git history documents what it used.

## Entry points

| Import                                  | What it is                                                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `ferramenta-family/registry`            | The registry, data only: no React, loads in any Node process                                                |
| `ferramenta-family/monografie`          | The Monografie components, plus the sprite, the live registry facts and the comparison types                |
| `ferramenta-family`                     | The registry, the live registry facts, the sprite and the comparison types, for sites that import the root  |
| `ferramenta-family/monografie.css`      | The page system: tokens, faces, header, sections, specimens, footer; imports `ferra-assets.css`             |
| `ferramenta-family/monografie-docs.css` | The reading layout and its parts, after `monografie.css`                                                    |
| `ferramenta-family/monografie-ardo.css` | Ardo's tokens, code, outline, search and mobile menu in Monografie's look, last                             |
| `ferramenta-family/ferra-assets/*`      | The members' marks, instruments, favicons and Apple touch icons, the workshop logos, the surfaces and faces |
| `ferramenta-family/icons/*`             | The applications' own logos (`ardo.svg`, `dalo.svg`, `palamedes.svg`)                                       |

The stylesheets point at files in the package, so your bundler has to resolve
`url()` in CSS from `node_modules`; Vite does. The files are exported too, for a
favicon or an `<img>`:

```tsx
import favicon from "ferramenta-family/ferra-assets/ferroni/favicon.ico?url";
import ardoLogo from "ferramenta-family/icons/ardo.svg?url";
```

## The registry

`family`, `familyTiers()`, `relationsOf()`, `WORKSHOP`, `FAMILY_SITE` and
`isEngine()` come from `src/family.ts` — the single source of truth for names,
what each member is and does, proofs, versions, status, relations and links
(ADR-0001). Read facts from it; never hardcode them.

Every entry says what the member is before where it comes from: `what` ("A
regex engine"), `does` (one plain sentence), `audience` ("For …"), then `proof`
(its lineage, in ADR-0004's register) and `evidence`. Two tiers: engines, and
applications (`role: "application"`, with their own `brand`). Relations are
facts, never a chain: `uses` (an engine built on another), `pairsWith` (commonly
combined, no dependency either way), `runsOn` (an application's engines). An
application integrating engines records them in `plannedRunsOn` until the
integration ships; `relationsOf()` includes only current dependencies. A member
whose package carries another name on a registry says so in `packages`
(`{ npm: "@ferriki/core" }`); `packageName(tool, "crates" | "npm")` returns that
name, else `name`, and every registry lookup goes through it.

More helpers: `STATUS_MEANING` and `STATUS_ORDER` (what each status promises,
most settled first), `isSuccessor(tool)`, `displayName(tool)` (the name as prose
writes it), `whatLabel(tool)` (what a member is, without its article: "Regex
engine"), `runsOnTools(tool)` and `plannedRunsOnTools(tool)` (an unknown name
throws), and `toolHref(tool)` / `leadsToRepo(tool)` (where a member's links
lead).

```ts
import { family, familyTiers } from "ferramenta-family/registry"; // data only
import { MonoEngineCatalog, RegistryFacts } from "ferramenta-family/monografie"; // with React
```

`RegistryFacts` (`snapshot?`, `snapshotGeneratedAt?`, `metrics?`, `endpoints?`,
`children`) provides live release facts; components read them with
`useToolFacts(tool)`. It uses `fetchFamilyFacts` / `useFamilyFacts`: one request
to the metrics service first, then direct registry requests only for sources it
did not answer. `fetchFamilyMetrics` reads just that service;
`fetchLiveRegistry` asks crates.io and npm directly, keyed by package name.
`toolFacts`, `liveRequestFor`, `REGISTRY_ENDPOINTS` and `relatedTools` are
exported from the root entry too.

## Publishing

Releases run through release-please (`release-please-config.json` at the
repository root, `release-type: node`, one product version) and
`.github/workflows/publish.yml`, which publishes this package with npm Trusted
Publishing (OIDC) and `--provenance`. No npm token is stored anywhere.

The first versioned release was `ferramenta-family@1.2.0`. Every release uses
the same release-please tag and GitHub Actions OIDC flow.

Release notes are kept in the repository's
[generated changelog](https://github.com/sebastian-software/ferramenta/blob/main/CHANGELOG.md).
Release Please updates it from Conventional Commits, so this package does not
need a separately maintained changelog. Mark breaking changes to public exports
or props with `!` so Release Please records the breaking change and applies the
corresponding SemVer bump.

The package is unscoped because the `@ferramenta` npm scope is not available and
the organization does not namespace its packages.

## Licensing

The code is MIT, and so are the members' marks, instruments and surfaces and
the line icons: they were made for this family (ADR-0010, ADR-0012). The
Source Serif faces are under the SIL Open Font License, and the workshop's and
the applications' logos belong to their owners; see [NOTICE.md](NOTICE.md).
