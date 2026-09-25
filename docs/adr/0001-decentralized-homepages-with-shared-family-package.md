# ADR-0001: Decentralized project homepages with one shared family package

- Status: accepted
- Date: 2026-08-14
- Updated: 2026-09-25
- Deciders: Sebastian Werner
- Amended: 2026-09-06 — membership rule and corrected repository count, see
  [Amendment 2026-09-06](#amendment-2026-09-06)
- Amended: 2026-09-07 — the package name, see
  [Amendment 2026-09-07](#amendment-2026-09-07)
- Amended: 2026-09-25 — standalone applications and independent site design, see
  [Amendment 2026-09-25](#amendment-2026-09-25)

## Context

At the time this decision was first written, the Ferramenta family spanned
eight repositories (ferramenta plus seven tools). The original rollout expected
every tool to adopt an identical header, navigation, footer, and visual
language. ferrocat already ran its own Ardo docs site on ferrocat.dev;
ferromark carried a `homepage/` folder. An earlier attempt started with a shared
config package before any visual language existed and was judged "built the
wrong way around".

## Decision

Each project site lives with its project and owns its visual identity and
layout. The ferramenta repository hosts the family overview and the optional
shared package (today `ferramenta-family`), which ships **finished components**
(header with family switcher, footer, project marks, and landing components)
plus tokens — not tokens alone. A site may consume selected parts as a versioned
npm dependency or use a separate design. The family registry
(`packages/family/src/family.ts`) is the single source of truth for member
names, jobs, proofs, lineage, status, marks, and outbound links.

Design work precedes extraction: the reference implementation on ferramenta.dev
defines the system; the package is extracted from it, never the other way
around.

## Native Markdown themes

The same catalog now produces committed `header.md` and `footer.md` files in
`packages/family/markdown/<project>/`. Native mdtheme consumers select their
canonical catalog ID through this path, independently of their CLI version.
Git refs may be branches (including `main`), tags, or commits. No JavaScript,
package installation, or template execution runs in Rust consumers.

The shared selector excludes the current project and rejects unknown IDs.
Every related link has a visible catalog description. The catalog remains the
membership authority, including applications such as Palamedes; names are not
filtered by a `fer` prefix. Overview pages omit the current ID to list everyone.

The producer regenerates every frame after catalog changes and CI checks for
stale output. Git attributes enforce LF across platforms. The React components
share catalog selection with Markdown, while their rendering stays independent.
The compact footer includes the family icon and “More from Ferramenta”.

Existing marker-based README consumers remain supported. A project migrating
to mdtheme removes its old family marker block from the authored source and
composes the company theme outside the family theme. Company branding remains
owned by its existing provider; never render two competing company footers.

## Decision drivers

- Content (features, versions, examples) lives next to the code it describes
  and updates with releases.
- Optional, versioned consumption avoids a forced design rollout across sibling repos.
- Ardo's architecture treats custom header/footer components as a first-class
  extension point.
- The failed first attempt showed that extracting shared assets before the
  design exists produces the wrong abstractions.

## Considered options

### Chosen: per-repo sites + versioned shared package

Keeps repos autonomous, makes design updates explicit per repo, and matches the
existing precedent (ferrocat.dev, ferromark `homepage/`).

### Rejected: central monorepo hosting all homepages

Couples deployments, moves content away from the code it documents, and turns
every site change into a ferramenta-repo change.

## Consequences

- Design updates reach sibling repos only via version bumps — intentional, no
  silent drift, but rollout is manual per repo.
- The family overview links outward to each member's own homepage or repository;
  it does not require family members to share a layout.

## Amendment 2026-09-06

This is a living decision record. Updates describe the current contract; Git
history preserves earlier decisions.

**Membership rule (historical; superseded by the 2026-09-25 amendment).** A
member of the Ferramenta family was a family engine, or a product built on
family engines. The 2026-09-25 amendment adds a narrow path for selected
standalone Rust-native applications.

**Count at that point.** Before ferrovia retired and before the standalone-app
amendment, the family spanned nine repositories: ferramenta plus eight tools —
seven engines (ferroni, ferriki, ferromark, ferrolex, ferrocat, ferralk,
ferrugo) and one application (palamedes, built on ferrocat, ferromark, and
ferralk). The earlier "eight repositories" line was already one short after
ferralk joined.

**Retired.** ferrovia, the SVGO-compatible SVG optimizer, left the family on
2026-09-24 and its repository is archived. SVG optimization is not a focus area
for the family, and a Rust optimizer already exists elsewhere. A retired member
leaves the registry, its mark leaves the sprite, and its generated Markdown
frame is removed; the design comps keep it as history.

**Roles at that point.** `role: "application"` marked a member the family
carries rather than one the family builds with. Palamedes carries no
compatibility contract of its own, so the overview renders no `Contract` fact
and names the engines it runs on. Standalone applications are covered by the
2026-09-25 amendment.

## Amendment 2026-09-07

The package this record calls `@ferramenta/family` is published as
**`ferramenta-family`**. The `@ferramenta` npm scope is not available, and the
organization does not namespace its packages, so the name is unscoped; the name
is reserved on npm. Nothing about the decision changes — one shared package,
extracted from the reference implementation, consumed by every sibling site. The
import specifiers move with the name: `ferramenta-family`,
`ferramenta-family/registry`, `ferramenta-family/chrome.css` and the other CSS
entry points. The `ferramenta-readme` binary and the `<!-- ferramenta-family -->`
README markers keep their spelling.

## Amendment 2026-09-25

**Selected standalone applications.** Family membership is not limited to
engines and applications built on those engines. A selected standalone
Rust-native application can join when its product approach fits the workshop;
common ownership alone remains insufficient. Dalo (team agent skills) and
Cuttledoc (local-first speech transcription) join as standalone applications.
Their catalog entries link outward to their own sites or repositories, and do
not imply a dependency on a family engine.

**Independent project identity.** Every project owns its visual identity and
site layout. The family overview presents members at equal rank and links to
their sites or repositories. The shared `ferramenta-family` package remains an
optional source of reusable chrome and landing components; Palamedes already
demonstrates that a project site can use a separate design. README and generated
Markdown links remain outbound catalog surfaces.

**Current count.** The family now has ten tool members in eleven repositories
including ferramenta: seven engines and three applications (Palamedes, Dalo,
and Cuttledoc). Ferrovia remains retired and outside the count.

## Validation and review triggers

Revisit when a second, non-Ardo consumer of the shared assets appears (would
justify splitting brand assets from Ardo glue), or when per-repo version bumps
prove too costly in practice.

## References

- [PRODUCT.md](../../PRODUCT.md) — product truth including rollout plan
- [docs/superpowers/specs/2026-07-11-ardo-config-package-design.md](../superpowers/specs/2026-07-11-ardo-config-package-design.md) — earlier package rename decision
- [packages/family/src/family.ts](../../packages/family/src/family.ts) — the registry this ADR declares canonical

## Repository adoption

Updated: 2026-09-14

This repository uses native mdtheme to compose its committed root README from
`README.md.src` and Sebastian-Theme. The project introduction and setup come
first; the company badge joins the project badges and the logo stays in the
footer. Existing project badge links remain authored content.

The CLI and theme are independently pinned by the project. CI checks generated
output without writing it. Contributors regenerate and commit the output;
pre-push validation never stages or commits. This avoids copied branding and
keeps consumers independent of Node tooling solely for README generation.
The tradeoff is a contributor tool installation and Git access during checks.

This is a living decision. Update this record when the ownership or composition
contract changes; configuration files own exact versions and revisions.
See [the contributor workflow](../readme-theme.md).

The family site's own root README keeps the catalog overview as project content.
Its marker generator now writes `README.md.src` before mdtheme adds Sebastian
branding. It does not consume a sibling frame or duplicate the family footer.
