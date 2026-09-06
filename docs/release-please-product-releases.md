# One product release with Release Please

**Moved.** The release model for the family — one product version across a Rust
core, its npm adapter, and mixed products — is now owned org-wide by
`@sebastian-software/standards` (decision D8 of
[#6](https://github.com/sebastian-software/ferramenta/issues/6)):

**<https://github.com/sebastian-software/standards/tree/main/reference/release-please>**

That directory holds the current configuration templates
(`rust-product-release-config.json`, `node-product-release-config.json`,
`rust-node-product-release-config.json`) and the reasoning behind them. The
guide that used to live here linked to templates in `docs/templates/` that this
repository never had, so it pointed at nothing while claiming to be the source
of truth.

The reusable workflows under `.github/workflows/` stay for now — ferroni still
consumes one. They are retired once the standards release composites land
([standards#64](https://github.com/sebastian-software/standards/issues/64)).
