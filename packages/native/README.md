# ferramenta-native

Shared native Node.js packaging for the Ferramenta engines. The package owns
platform metadata, a generated standalone loader, the napi-rs build driver,
platform manifests, glibc checks, packed-consumer checks, and source-pinned npm
publication recovery. It has no React or engine dependency.

Each product supplies `native-npm.config.mjs`: its package paths, existing npm
names, binary filename pattern, licenses, and workspace dependency policy.
`generatePackages` and `generateRuntime` write the reviewed consumer artifacts;
`--check` callers compare them byte for byte. The generated runtime travels with
the product, so end users do not install this development dependency.

`runBuild` uses one `pnpm exec napi build` path with locked Cargo dependencies.
GNU Linux uses napi-rs's glibc 2.17 toolchain; musl uses cargo-zigbuild. Products
prepare their own assets before the build and may supply a trained PGO environment.
`stageAddon` associates the output with a supported target and copies its types
and license files. Diagnostic builds use isolated directories.

`verifyPackedConsumer` installs the actual main/platform tarballs into a scratch
project with install scripts disabled, runs a product smoke probe, then removes
the binary and proves that loading fails. `createNpmPublisher` reuses an existing
version only when npm provenance identifies the configured repository, workflow,
release commit, and tarball digest. Each product retains its release gate and
OIDC permissions; this package does not publish on installation.

## Install and update

This is a private development package installed directly from Git. It has no
registry release cycle. Add it to the product's Node workspace (or its pnpm
catalog) with a full Ferramenta commit SHA:

```json
{
  "devDependencies": {
    "ferramenta-native": "github:sebastian-software/ferramenta#<commit-sha>&path:/packages/native"
  }
}
```

Run `pnpm install` and commit the manifest and lockfile. A normal or frozen
installation fetches the helper sources automatically; contributors need no
submodule, sibling checkout, build approval or release credentials. This package
has no dependencies or install hooks and does not build the Ferramenta website.
To adopt a fix, change the commit SHA and regenerate the lockfile. The generated
runtime and platform files are still reviewed in each product's pull request.

The previously published `0.1.0` npm archive remains historical. Current Git
consumers do not use it, and this package has no Release Please component or npm
publish job. Product packages retain their independent registry releases.

## Shared CI build

After installing Node workspace dependencies, call the composite action from
the same Git package:

```yaml
- name: Build native addon
  uses: ./node/node_modules/ferramenta-native/actions/build-native
  with:
    target: ${{ matrix.target }}
    libc: ${{ matrix.libc }}
  env:
    EXAMPLE_RUST_TARGET: ${{ matrix.target }}
```

The action sets up Rust, the target, and Zig/cargo-zigbuild for musl, then runs
the product's `pnpm build:native` command. The caller can select the Rust
toolchain and extra components, workspace path, and build command. Asset
preparation, PGO training, platform checks, functional tests, artifacts and
release permissions remain explicit in the product. For Ferromark, pass
`rust-components: llvm-tools` and retain `FERROMARK_PGO` from its native matrix.

GitHub must read the product's workflow before dependencies are installed, so
runner selection and the initial checkout/pnpm/Node setup remain in that
workflow. Shared actions and JavaScript use one Git pin from the dependency;
there is no separately versioned reusable workflow. Historical release retries
can retain their original setup when the release predates this dependency.

Run `node --test packages/native/test/*.test.mjs` from the Ferramenta root.
