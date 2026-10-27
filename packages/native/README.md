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

## Initial rollout

Version 0.1.0 is not published yet. Consumers carry the identical packed toolkit
as `node/vendor/ferramenta-native-0.1.0-<digest>.tgz`, pinned by their package-manager
lockfiles. This bootstraps independently installable review branches without
paths to another repository or a nonexistent registry version. After publishing
0.1.0 from the Ferramenta release tag, replace the file specifier with the exact
registry version and regenerate each lockfile; remove its bootstrap archive.

Run `node --test packages/native/test/*.test.mjs` from the Ferramenta root.

The tooling has its own Release Please component and `ferramenta-native-v` tags.
Bootstrap the npm package and its Trusted Publisher for this repository's
`publish.yml` / `npm-release` environment before setting
`NATIVE_NPM_PUBLISH_ENABLED=true`. The initial packed development dependencies
are retained until their exact toolkit version exists in the registry.
