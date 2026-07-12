# Release Please product guide refresh

## Context

Ferramenta's current product-release guide models a lockstep repository as one
Release Please `simple` component. It uses `version.txt`,
`[workspace.package].version`, inherited Cargo package versions, and typed
`extra-files` to copy the product version into Cargo and Node manifests.

The publishing-free Ferrocat follow-up exposed two problems with that model:

- Cargo does not regenerate `Cargo.lock` when Release Please only edits TOML
  values through `extra-files`.
- Release Please's Rust updater cannot update a virtual workspace root or
  member manifests that use `version.workspace = true`.

Ferrocat validated a cleaner boundary in
[sebastian-software/ferrocat#254](https://github.com/sebastian-software/ferrocat/pull/254):
one real Cargo package at the repository root, one configured Release Please
component with `release-type: rust`, concrete package versions, and explicit
`version + path` requirements for published internal dependencies. The
generated 2.3.0 candidate updated all six package versions, all published
internal dependency requirements, `Cargo.lock`, the root manifest entry, and
one product changelog. All CI checks passed and no release was published.

## Goals

- Keep one Release Please PR, product tag, and GitHub Release for repositories
  whose artifacts intentionally ship under one version.
- Replace the stale `simple` Cargo pattern with Release Please's native Rust
  workspace handling.
- Cover Rust-only, Node-only, and combined Rust/Node repositories without
  implying that one configuration fits every workspace shape.
- Keep publishing separate from version calculation and gate every publisher
  on the same plural `releases_created` output.
- Give maintainers copyable stencils plus a publishing-free validation flow.

## Non-goals

- Independently versioned packages or per-package changelogs.
- Hiding Release Please behind a generator, custom action, or cleanup script.
- Replacing registry-specific publish order, platform builds, or Trusted
  Publishing setup.
- Claiming that typed `extra-files` can maintain arbitrary Node dependency
  graphs or generated lockfiles.

## Considered approaches

### One decision guide with three stencils

Document one product boundary, then provide separate Rust-only, Node-only, and
Rust/Node configurations. This duplicates a small amount of JSON but keeps each
starting point explicit and copyable. This is the selected approach.

### One Rust-first stencil with optional blocks

This keeps the template count low, but readers must decide which fields to add
or remove. It also makes the Node-only case look secondary and increases the
chance of retaining an irrelevant updater.

### A generator or reusable release wrapper

This could create configuration from answers, but it adds another maintained
tool before the repository family has enough repeated shapes to justify it. It
would also make upstream Release Please behavior harder to inspect.

## Design

### Shared product boundary

Every variant configures exactly one manifest package at `.` and one root entry
in `.release-please-manifest.json`. The root path intentionally sees releasable
commits across the repository. Component tags stay enabled so the public tag is
`<product>-v<version>`.

The guide retains the boundary warning: use this only when every public
artifact ships together and shares one compatibility story. Repositories with
independent packages should keep separate components and accept separate
release records.

### Rust-only repositories

The repository root must be a real Cargo package, not only a virtual
`[workspace]`. The root package is the public umbrella crate or another genuine
product package; its source may remain in a nested directory through explicit
Cargo target paths.

The root and every workspace member use concrete `[package].version` strings.
Published internal dependencies use explicit `version` and `path` fields in the
manifest where they are consumed. Release Please can then update member
versions, dependency requirements, and `Cargo.lock` as one Rust release
candidate.

The Rust stencil uses `release-type: rust`, one root component, one product
changelog, and an optional migration SHA. It does not use `version.txt`,
`version.workspace = true`, or Cargo version `extra-files`.

### Node-only repositories

The root `package.json` is the product version source and the root component
uses `release-type: node`. Additional packages that always share the product
version are listed as typed JSON `extra-files` rather than Release Please
components.

Internal Node dependencies should use the package manager's workspace protocol,
such as `workspace:*`, when publication semantics allow it. Explicit local
SemVer ranges form a dependency graph that typed version fields alone cannot
maintain safely; those repositories should either enumerate the required
fields and prove the result or use normal Node package components with the
`node-workspace` plugin and accept component releases.

The guide treats lockfiles as package-manager-specific. A candidate is valid
only when the repository's normal lockfile-only install leaves no diff.

### Combined Rust and Node repositories

Rust is the release authority because the Rust strategy owns Cargo workspace
version propagation and `Cargo.lock`. The root is the real Cargo product
package and the single component uses `release-type: rust`.

Node package versions are typed JSON `extra-files` on that root component.
Node packages should use workspace-protocol references for local dependencies
where possible. The mixed stencil makes the optional Node paths obvious without
turning those packages into Release Please components.

This variant does not run both the Rust and Node strategies for one component;
Release Please selects one strategy per configured package. If the Node side
requires `node-workspace` graph updates or generated lockfile changes beyond
the documented declarative fields, the one-component mixed pattern is not a
safe fit without additional repository-owned automation.

### Templates

Replace the current generic stencil with:

- `templates/release-please/rust-product-release-config.json`
- `templates/release-please/node-product-release-config.json`
- `templates/release-please/rust-node-product-release-config.json`

The existing `product-release-config.json` is removed because its `simple`
strategy is the behavior being retired. The guide and README link to the
decision section rather than implying that the old generic file is universal.

### Release and publish flow

Release Please runs once. Rust, npm, native binary, and documentation publish
jobs depend on that job and use
`needs.release-please.outputs.releases_created == 'true'`. Registry-specific
jobs retain their existing publish order and Trusted Publishing credentials.

The migration flow stops after a publishing-free release PR proves the exact
candidate diff. It does not merge a disposable release PR or create and delete
test tags and GitHub Releases.

## Failure handling

The guide calls out these stop conditions:

- Release Please creates more than one candidate or manifest entry.
- A Cargo member version, published internal dependency requirement, or
  `Cargo.lock` stays at the previous version.
- Regenerating npm, pnpm, Yarn, or Cargo lockfiles changes the candidate.
- The published package set contains unintended repository files after moving
  a Cargo package to the root.
- A Node dependency graph needs updates that are not represented by the
  selected stencil.

When any condition occurs, maintainers keep publishing disabled and revise the
repository shape or select the multi-component workspace model. They do not
patch generated release branches with cleanup scripts.

## Validation

The documentation PR will verify:

- every JSON stencil parses with `jq empty`;
- links and file names in the guide match the repository;
- stale references to `version.txt`, `simple`, and inherited Cargo versions are
  removed from the recommended path;
- examples contain one configured root component and one manifest entry;
- Rust examples contain concrete package and dependency versions;
- Node and mixed examples identify the required lockfile no-diff check;
- `pnpm build` keeps the Ferramenta site green;
- `git diff --check` passes.

The guide will cite Ferrocat #254 as the publishing-free Rust workspace proof.
It will not claim that the native configuration created a real tag or release,
because the proof PR was intentionally not merged.
