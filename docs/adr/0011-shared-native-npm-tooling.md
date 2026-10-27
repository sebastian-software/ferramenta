# ADR-0011: Shared native npm tooling with independent engine distributions

- Status: accepted
- Date: 2026-10-27
- Updated: 2026-10-27

## Context

Ferromark and Ferriki maintain overlapping native Node.js build, loader,
platform-package and publication logic. Ferrigura already has a reusable Rust
engine and N-API binding but needs an independently installable npm product.

## Decision

Ferramenta owns `packages/native` (`ferramenta-native`) as a separate development
package. It owns one target table, standalone runtime generation, napi-rs build
arguments, platform manifests, archive and consumer checks, source/digest-bound
artifacts, release metadata validation, exact-commit CI gates, npm publication
ordering and public release verification.
It has no dependency on the family website package or any engine.

Each product keeps its public API, native binding, assets, licenses, functional
tests, release version and registry permissions. Product-specific preparation
runs around the same build driver. Generated runtime copies ship with each
facade; consumers need no tooling dependency. Engine instances are not shared
between independently compiled addons. Applications compose their Node APIs.

Products install the private tooling package from `packages/native` through a
pnpm Git dependency pinned to a full Ferramenta commit SHA. The lockfile records
the resolved source and integrity. Updating the helper needs a Git commit and
dependency update, not a toolkit registry release. Installation requires no
submodule setup or build hooks; the package contains ready-to-run JavaScript.

The same dependency ships composite GitHub Actions for native builds and the
complete native npm release lifecycle. Product workflows bootstrap
pnpm and Node before calling the installed action. There is one shared source
pin for scripts and CI steps, with no separately versioned reusable workflow.
Product-specific preparation, PGO training and functional tests remain in the
engine repositories. Historical release retries may retain their setup when the
tag predates the shared package. Product configuration declares file budgets,
required CI jobs, versioned Cargo files and optional adapter packages. Functional
probes remain product-owned; their common execution harness is shared. A bounded
legacy recovery policy retains existing Ferromark releases while new releases
require source-pinned npm provenance.

The toolkit has no Release Please component or npm publish job. Its initial
`0.1.0` registry release remains historical; current consumers use Git. Product
registry releases and permissions are unchanged.

## Consequences

Platform packaging has one maintained implementation while engines retain
independent installation and release schedules. Updates are adopted explicitly.
Native-to-JavaScript callback costs and JSX integration are separate from this
packaging decision; this change makes no performance claim.

## History

- 2026-10-27: Use a commit-pinned pnpm Git dependency and package-local CI action
  to avoid toolkit releases and additional contributor setup.

- 2026-10-27: Move package checks and the native npm CI/release lifecycle into the same Git dependency; keep product policy in configuration and preserve historical recovery.
