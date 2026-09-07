# ADR-0007: The family package ships its build output in Git

- Status: accepted
- Date: 2026-09-06
- Amended: 2026-09-07 — the package name, see
  [Amendment 2026-09-07](#amendment-2026-09-07)

## Context

`@ferramenta/family` has no npm release yet — the `@ferramenta` scope does not
exist — so every sibling consumes it straight from Git:

```sh
pnpm add "github:sebastian-software/ferramenta#<sha>&path:/packages/family"
```

`packages/family/dist` was gitignored (repo hygiene, #25) and the package had no
build hook for that path, so the install produced a package whose every entry
point named a file that was not there: `import("@ferramenta/family")` and
`@ferramenta/family/registry` both failed with "Cannot find module .../dist".
The docs-site rollout (#17) is blocked on it.

The obvious fix — a `prepare` script, which package managers run for git-hosted
dependencies — does not survive contact with pnpm 12. Measured from a scratch
project (pnpm 12.3.4, Node 22.22):

- Without an allowlist entry the install fails with
  `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`.
- The entry the error asks for is keyed by the **full codeload URL including the
  pinned commit SHA**. `"@ferramenta/family": true` and a `*` in place of the
  SHA are both rejected. Every pin bump would therefore need a matching edit in
  every consumer's `pnpm-workspace.yaml`.
- Building also needs the package's devDependencies, and Ardo pulls esbuild,
  whose install script then fails the consumer's install with
  `ERR_PNPM_IGNORED_BUILDS` — a second allowlist, for a dependency the consumer
  never asked for.

## Decision

`packages/family/dist` is committed. The package keeps `prepublishOnly` for the
npm path and has **no** `prepare` script, so a git install runs no build and
needs no allowlist entry at all.

Two things keep that honest:

- **CI fails on stale output.** `pnpm build` regenerates `dist`; the next step,
  `node scripts/check-committed-dist.mjs`, fails on anything changed, added or
  removed in that directory — untracked files included, because a new source
  module builds a new output file that `git diff` alone would wave through. The
  guard has its own test on throwaway repositories.
- **CI proves the consumer routes.** `pnpm verify:package` installs the package
  into a scratch project twice — the packed npm tarball, and the files
  `git archive HEAD` carries, which is exactly what codeload serves for a pinned
  commit — and imports both entry points in a bare Node process. It cannot
  resolve `github:…#<sha>` for a commit that does not exist yet, so the pinned
  install itself is verified by hand once per pin bump, with the command in the
  package README.

The package also drops its Ardo dependency: `SiteHeader` takes the theme toggle
as a `themeToggle` slot instead of importing `ardo/ui`. That removes the esbuild
install script from a consumer's tree, and it lets both entry points load
outside a bundler — `ardo/ui` imports CSS and a `virtual:` module, so anything
that reaches it needs Vite. The family site passes `<ArdoThemeToggle />` into
the slot, and every Ardo sibling does the same one-liner.

## Consequences

- A change to `packages/family/src` is two files in the diff: the source and its
  build output. Reviewers read `src`; `dist` is generated, never hand-edited.
- Git consumers need no `allowBuilds` entry, no `onlyBuiltDependencies`, and no
  build step of their own. Pinning a commit SHA is the whole contract.
- The chrome no longer assembles the theme toggle for a site; a site that wants
  one passes it. Sites that are not on Ardo (dalo, palamedes per D6) can use the
  chrome without pulling Ardo in.
- Once `@ferramenta/family` is on npm, consumers move to a version range and
  this record can be revisited: the npm tarball carries `dist` either way, so
  the committed copy is only load-bearing for the Git path.

## Amendment 2026-09-07

The package this record calls `@ferramenta/family` is published as
**`ferramenta-family`**: the `@ferramenta` npm scope is not available and the
organization does not namespace its packages. The context above quotes the
failing imports under the old name; read them as `ferramenta-family` and
`ferramenta-family/registry`. The decision itself is untouched — `dist` stays
committed, there is still no `prepare` script, and the Git contract is still a
pinned commit SHA with `&path:/packages/family`. The last consequence now reads:
once `ferramenta-family` has an npm release, consumers move to a version range
and this record can be revisited.

## References

- [ADR-0001](0001-decentralized-homepages-with-shared-family-package.md) — the shared package this one keeps installable
- [packages/family/README.md](../../packages/family/README.md) — the consumer steps
- [scripts/verify-package-consumers.mjs](../../scripts/verify-package-consumers.mjs) — the check that proves them
- [scripts/check-committed-dist.mjs](../../scripts/check-committed-dist.mjs) — the guard that keeps the committed output current
