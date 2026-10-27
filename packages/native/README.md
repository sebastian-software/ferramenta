# ferramenta-native

Shared native Node.js build and release tooling for the Ferramenta engines.
Products provide `native-npm.config.mjs`; this private development package owns
the implementation. It has no engine or website dependency and requires no install-time build.
`cross-spawn` owns Windows command-shim argument handling, including spaces in
archive and checkout paths.

## Install and update

Install the ready-to-run package through a full Ferramenta Git commit:

```json
{
  "devDependencies": {
    "ferramenta-native": "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/native"
  }
}
```

Commit the manifest and pnpm lockfile. Contributors run their normal frozen
install; no submodule, sibling checkout, toolkit release, or build approval is
needed. Scripts and Actions come from that one dependency pin. The historical
`0.1.0` npm release is no longer used by these consumers.

## Product configuration

The configuration names the facade and platform directories, existing npm names,
binary filenames, licenses and dependency policy. Its optional sections declare:

- `pack`: required, allowed and forbidden files, plus the unpacked-size budget and optional `platformRequired` files.
- `consumer`: a native smoke probe, installed-package tests and product assertions.
- `release`: repository, tag prefix, Cargo version files, exact dependency pins,
  required CI jobs, additional npm packages and product asset checks.

Product probes assert APIs, grammars, Vite behavior or rendering output. The
shared harness owns temporary directories, packing, installation, subprocesses,
cleanup and the missing-binary control. Generated runtime copies ship with the
facade so end users never install this tooling package.

## Commands

Run from the product's Node workspace. Each command reads
`native-npm.config.mjs`; `--config` selects another reviewed configuration.

| Command                                                     | Contract                                                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `ferramenta-native generate [--check]`                      | Generate or check platform manifests and the standalone runtime                                                      |
| `ferramenta-native matrix`                                  | Emit the shared build matrix with product additions                                                                  |
| `ferramenta-native platform <id>`                           | Check version, binary, licenses and the glibc floor                                                                  |
| `ferramenta-native pack [--all-targets]`                    | Pack with pnpm and inspect the actual archives and content budgets                                                   |
| `ferramenta-native consumer [--directory artifacts]`        | Install real facade/sidecar archives offline, run product probes, then remove the binary and require loading to fail |
| `ferramenta-native metadata [--metadata-only --tag v1.2.3]` | Validate configured Cargo/npm versions and dependency pins                                                           |
| `ferramenta-native stage <id>`                              | Bind a native artifact to its checked-out commit and SHA-256 digest                                                  |
| `ferramenta-native restore`                                 | Validate the complete artifact set before promoting any binary                                                       |
| `ferramenta-native source resolve\|verify\|ci`              | Resolve tags and require successful push/main CI for the exact source commit                                         |
| `ferramenta-native publish --directory artifacts`           | Publish the validated archives in sidecar, facade, then adapter order                                                |
| `ferramenta-native verify-public`                           | Observe versions, provenance and dist-tags, verify source attestations, and exercise public installations            |

Release commands use `NATIVE_SOURCE_SHA`, `NATIVE_RELEASE_TAG` and the GitHub
workflow environment. Publishing requires an explicit command with npm OIDC
permissions; installation never publishes anything. Registry observation allows
propagation delays, checks packages concurrently, and reports a failed publisher
once. Public install failures retain bounded, credential-redacted diagnostics.

New publication recovery accepts existing versions only when their npm
provenance matches the repository, workflow, release commit and tarball digest.
A configured version cutoff preserves Ferromark's older main-dispatched retry
contract; it cannot enable that weaker historical path for subsequent releases.
New retries dispatch from the exact release tag to bind npm provenance to it.

## Shared Actions

After the initial checkout and pnpm/Node setup, install workspace dependencies
and use the package-local Actions:

```yaml
- uses: ./node/node_modules/ferramenta-native/actions/build-native
  with:
    target: ${{ matrix.target }}
    libc: ${{ matrix.libc }}
    platform-id: ${{ matrix.id }}
    source-sha: ${{ github.sha }}
    test-command: ${{ matrix.native && 'pnpm test' || '' }}
```

`build-native` sets Rust and Zig/cargo-zigbuild, builds and verifies the addon,
runs configured product tests, and uploads a source/digest receipt when given a
source SHA. PGO remains opt-in through the product build environment; callers
can request `llvm-tools` and retain target-specific training exclusions.

`release-native` downloads the complete artifact set, verifies all receipts,
runs product preparation, validates metadata, packs all packages, exercises the
host and Alpine musl archives, and optionally publishes and verifies npm. Its
`publish` input defaults to `false`, so CI rehearses the same path without
registry writes. `prepare-command` handles product assets and adapter checks.

Workflows retain job dependencies, runner selection, initial tool setup,
permissions and release approval policy. Historical retries load tooling and
configuration from the immutable workflow checkout and rebase package paths to
the immutable release source. There is no separately versioned reusable workflow.

Run `node --test packages/native/test/*.test.mjs` from the Ferramenta root.
