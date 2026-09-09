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

The former reusable workflows under `.github/workflows/` were retired after
ferroni moved to its own `publish.yml`; no repository currently consumes them.
New release workflows follow the standards release model as its templates and
composites evolve ([standards#64](https://github.com/sebastian-software/standards/issues/64)).
