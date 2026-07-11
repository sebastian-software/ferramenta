# One product release with Release Please

Use this pattern when a repository ships several artifacts that always share
one public version: for example a Rust workspace, a CLI, and an npm wrapper.

It keeps Release Please. The change is the release boundary: model the whole
repository as one product component instead of modeling each publishable crate
as a component.

## What this gives you

- One Release Please PR for one product version.
- One product tag and one GitHub release per version.
- A shared version written to Cargo and optional Node metadata in that PR.
- Publishing jobs that all start from the same `releases_created` signal.

This is a better fit than `linked-versions` when the GitHub release itself is
the product release. Linked versions keep package components and therefore
still create a tag and release for every component.

## Choose the right boundary

Use a single product component only when all public artifacts intentionally
release together. Do not use it for independently versioned libraries or when
their changelogs and compatibility promises need separate release history.

The source tree can still contain many Cargo packages. Their publish order,
package names, and registry access are independent of the Release Please
component count.

## Set up a shared Cargo version

Keep the canonical Rust version at the workspace root:

```toml
[workspace.package]
version = "2.2.0"

[workspace.dependencies]
ferrocat-po = { version = "2.2.0", path = "crates/ferrocat-po" }
```

Every workspace package then inherits it:

```toml
[package]
version.workspace = true

[dependencies]
ferrocat-po.workspace = true
```

Centralize internal version requirements too. A Release Please PR should not
need to touch every member manifest just to keep internal dependency ranges in
sync.

`version.txt` is a small, explicit product-version source for the `simple`
Release Please strategy. Release Please updates it and the configured extra
files atomically.

## Configure one product component

Start with [the product config stencil](../templates/release-please/product-release-config.json)
and replace the placeholders. The important parts are:

```json
{
  "release-type": "simple",
  "include-component-in-tag": true,
  "last-release-sha": "<commit-for-the-current-product-release>",
  "packages": {
    ".": {
      "component": "my-product",
      "version-file": "version.txt",
      "extra-files": [
        {
          "type": "toml",
          "path": "Cargo.toml",
          "jsonpath": "$.workspace.package.version"
        }
      ]
    }
  }
}
```

Add typed `extra-files` for every other public version source, such as an npm
`package.json`. Keep `.release-please-manifest.json` to one root entry:

```json
{ ".": "2.2.0" }
```

`last-release-sha` is required for an existing repository migrating to this
model. Point it at the commit for the current product release so the first
product changelog starts there instead of collecting the whole repository
history. New repositories do not need it.

## Publish from the one release signal

Run Release Please once and make every publish job depend on its plural
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
    # Publish crates in their dependency order.

  publish-npm:
    needs: release-please
    if: ${{ needs.release-please.outputs.releases_created == 'true' }}
    # Build and publish the npm package.
```

Use `releases_created`, not the singular `release_created`: the plural output
works for both root and nested manifests. Keep platform builds, crate ordering,
and trusted publishing setup in their existing jobs; this pattern only changes
the release trigger and version source.

Ferramenta's reusable workflows are useful once the release boundary is set:

- [`release-rust.yml`](../.github/workflows/release-rust.yml) for one crate.
- [`release-node-native.yml`](../.github/workflows/release-node-native.yml)
  for native npm packages.

For a multi-crate Rust product, keep its dependency-aware publish sequence in
the caller workflow and gate the sequence on the same single release signal.

## Migrate safely

1. Record the commit behind the latest product release tag.
2. Create a temporary branch with publishing removed and an isolated workflow
   trigger.
3. Confirm that Release Please opens one PR and changes only the central
   version sources.
4. Merge that temporary PR and confirm exactly one test tag and GitHub release
   are created.
5. Remove the test release, tag, and branch. Then make the production change
   in a normal reviewed PR.

The Ferrocat spike validated this exact flow: one release PR updated the root
Cargo version, `version.txt`, the manifest, and the product changelog; merging
it created one tag and one GitHub release without publishing a package.

## Avoid cleanup scripts

Do not create component releases and delete them after the fact. That leaves
release metadata, tags, and consumers out of sync. Make the product component
the source of truth from the start.
