# One product release with Release Please

Use this pattern when a repository ships several artifacts that intentionally
share one public version. The repository might contain several Rust crates,
several npm packages, or both. Release Please still sees one product component,
so each version gets one release PR, one tag, and one GitHub Release.

This is a release-boundary decision, not a publishing shortcut. Crates and npm
packages keep their own names, registry permissions, build steps, and publish
order.

## Pick the repository shape first

| Repository | Release authority | Start with |
| --- | --- | --- |
| Rust workspace | A real Cargo package at the repository root | [`rust-product-release-config.json`](../templates/release-please/rust-product-release-config.json) |
| Node workspace | The root `package.json` | [`node-product-release-config.json`](../templates/release-please/node-product-release-config.json) |
| Rust workspace plus Node packages | The real root Cargo package; Node versions follow it | [`rust-node-product-release-config.json`](../templates/release-please/rust-node-product-release-config.json) |

The root path `.` is deliberate. Release Please considers releasable commits
across the repository and writes one root entry to
`.release-please-manifest.json`:

```json
{ ".": "2.2.0" }
```

Use separate components instead when packages can release independently, need
separate changelogs, or make different compatibility promises. The
`linked-versions` plugin can align versions across components, but those
components still keep their own release records and tags.

## Rust: make the root a real package

Release Please's Rust strategy needs a concrete `[package].version`. A virtual
workspace root with only `[workspace]` is not enough, and inherited
`version.workspace = true` values cannot be rewritten as package versions.

Make the public umbrella crate, CLI, or another genuine product package the
root package. Its Rust source can stay in a nested directory:

```toml
[package]
name = "my-product"
version = "2.2.0"
edition = "2024"

[lib]
path = "crates/my-product/src/lib.rs"

[workspace]
members = [
  "crates/my-product-core",
  "crates/my-product-cli",
]
```

Every workspace member also uses a concrete version:

```toml
[package]
name = "my-product-core"
version = "2.2.0"
```

Published internal dependencies need both `version` and `path` where they are
consumed:

```toml
[dependencies]
my-product-core = { version = "2.2.0", path = "crates/my-product-core" }
```

That gives the Rust updater enough information to change every package version,
published internal requirement, and `Cargo.lock` in the same release candidate.
Workspace inheritance is still useful for edition, license, repository, lints,
and external dependencies; avoid it specifically for package versions and
published internal version requirements.

A package at the repository root can otherwise include far more files than the
old nested package. Add a narrow Cargo `include` list and compare
`cargo package --list` before and after the move.

The Rust configuration is one native component:

```json
{
  "release-type": "rust",
  "include-component-in-tag": true,
  "packages": {
    ".": {
      "component": "my-product",
      "changelog-path": "CHANGELOG.md"
    }
  }
}
```

Do not add `version.txt`, Cargo version `extra-files`, or a workflow step that
regenerates `Cargo.lock` after Release Please. If the native release candidate
does not contain the lockfile update, the repository shape is not ready for
this pattern.

## Node: use the root package as the product version

For a Node-only repository, the root `package.json` is the product version
source and the component uses `release-type: node`. Release Please updates the
root Node metadata through its native Node strategy.

Additional packages that always ship with the product can be typed JSON
`extra-files` instead of additional components:

```json
{
  "release-type": "node",
  "packages": {
    ".": {
      "component": "my-product",
      "extra-files": [
        {
          "type": "json",
          "path": "packages/my-product-cli/package.json",
          "jsonpath": "$.version"
        }
      ]
    }
  }
}
```

Prefer workspace-protocol dependencies such as `workspace:*` between local
packages when the package manager's pack/publish behavior fits the repository.
Typed version fields do not maintain an arbitrary dependency graph. If local
packages use explicit SemVer ranges, either enumerate and prove every required
field or configure normal Node components with the `node-workspace` plugin and
accept component release records.

Lockfiles are package-manager-specific. On the generated candidate, run the
repository's normal lockfile-only install and require a clean diff. For example:

```sh
pnpm install --lockfile-only
git diff --exit-code
```

For npm, use the repository's equivalent `npm install --package-lock-only`
check. A dirty lockfile means the stencil is incomplete.

## Rust and Node: let Rust own the release

A configured package has one Release Please strategy, not both Rust and Node.
For a combined repository, use the native Rust root because Cargo package
versions, internal requirements, and `Cargo.lock` need workspace-aware updates.
Then add the Node package versions as typed JSON `extra-files`:

```json
{
  "release-type": "rust",
  "include-component-in-tag": true,
  "packages": {
    ".": {
      "component": "my-product",
      "changelog-path": "CHANGELOG.md",
      "extra-files": [
        {
          "type": "json",
          "path": "package.json",
          "jsonpath": "$.version"
        },
        {
          "type": "json",
          "path": "packages/my-product/package.json",
          "jsonpath": "$.version"
        }
      ]
    }
  }
}
```

Use workspace-protocol references on the Node side where possible, and run both
the Cargo locked checks and the Node lockfile no-diff check on the generated
candidate. If the Node side needs `node-workspace` graph updates, the
one-component mixed pattern is not a safe fit without repository-owned
automation.

## Set the migration boundary

An existing repository needs a full `last-release-sha` in the top-level config.
Point it at the commit behind the current product release so the first new
changelog starts there instead of collecting the full repository history:

```json
{
  "last-release-sha": "<full-commit-for-the-current-product-release>"
}
```

New repositories do not need this field. Remove it after a good product release
has established the new history; Release Please otherwise continues to treat it
as an explicit override.

## Publish from the one release signal

Run Release Please once and make every publisher depend on its plural
`releases_created` output:

```yaml
jobs:
  release-please:
    runs-on: ubuntu-latest
    outputs:
      releases_created: ${{ steps.release.outputs.releases_created }}
    steps:
      - id: release
        uses: googleapis/release-please-action@v5
        with:
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json

  publish-rust:
    needs: release-please
    if: ${{ needs.release-please.outputs.releases_created == 'true' }}
    # Publish crates in dependency order.

  publish-npm:
    needs: release-please
    if: ${{ needs.release-please.outputs.releases_created == 'true' }}
    # Build and publish npm packages.
```

Use `releases_created`, not the singular `release_created`. Keep platform
builds, dependency-aware crate ordering, and Trusted Publishing in their
existing jobs.

Ferramenta's reusable workflows remain useful for their narrower shapes:

- [`release-rust.yml`](../.github/workflows/release-rust.yml) publishes one
  crate.
- [`release-node-native.yml`](../.github/workflows/release-node-native.yml)
  builds and publishes a native npm package.

A multi-crate or combined product usually keeps its publish sequence in the
caller workflow while reusing the same release signal.

## Prove the candidate without publishing

1. Start from the commit behind the latest product release and add the matching
   `last-release-sha`.
2. Push the new configuration to an isolated target branch. Do not enable any
   publish job for that branch.
3. Run Release Please against that target branch and confirm it opens exactly
   one release PR.
4. Inspect the full diff. Check every package version, internal version
   requirement, lockfile, manifest entry, and product changelog.
5. Run normal CI, package-list checks, and lockfile no-diff checks on the
   generated PR.
6. Close the test PR and delete its generated branch. Move the validated config
   through a normal reviewed PR.

Do not merge a disposable release PR just to create and delete a test tag. The
candidate diff and CI prove the versioning path without adding release history.

[Ferrocat's publishing-free 2.3.0 candidate](https://github.com/sebastian-software/ferrocat/pull/254)
validated the Rust path: one release PR updated six package versions, all
published internal dependency requirements, `Cargo.lock`, one manifest entry,
and one product changelog. All checks passed, and no tag, GitHub Release, or
crate was published.

## Stop when the shape does not match

Keep publishing disabled if any of these are true:

- Release Please creates more than one candidate or manifest entry.
- A package version, internal requirement, or lockfile remains stale.
- Regenerating a lockfile changes the candidate.
- Moving the Cargo package to the root changes its published file set
  unexpectedly.
- The Node dependency graph needs updates that the selected stencil does not
  represent.

Fix the repository shape or use ordinary multi-component workspace releases.
Do not create component releases and clean them up afterward, and do not patch
generated release branches with version-sync scripts.
