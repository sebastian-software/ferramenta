# Ferromark documentation reference

An executable implementation of [the approved Rust starting-page design](../../designs/ferromark-start.html).
It consumes `FerraDocsLayout` from the family package and Ardo's v6 composition
APIs. The existing Ferramenta site and Ferromark homepage retain their current
Ardo versions. This reference is excluded from the production build and marked
`noindex`.

Until Ardo 6 is published, point the runner at a built Ardo checkout containing
the composition APIs (Ardo PR #417):

```sh
ARDO_PACKAGE=/absolute/path/to/ardo/packages/ardo pnpm docs:ferromark dev
ARDO_PACKAGE=/absolute/path/to/ardo/packages/ardo pnpm docs:ferromark build
ARDO_PACKAGE=/absolute/path/to/ardo/packages/ardo pnpm docs:ferromark preview
```

Open `/rust/getting-started/`. The runner copies the built family package into
the example's ignored `node_modules` and links the supplied Ardo package without
changing that checkout. It refuses to replace an existing different Ardo install.
After Ardo 6 is published, installing this isolated project's dependencies also
supports its ordinary `dev`, `build` and `preview` scripts.

The Markdown route supplies prose and worked examples. `ArdoRoot.components`
adds family components to the default set and replaces only the article wrapper.
The wrapper supplies `FerraDocsLayout` with the hero, product navigation and
`ArdoTOC source="dom"`. Its scoped outline discovers both component headings and
the Markdown “Continue” heading. The outline is populated after hydration;
component-title props are not build-time search metadata. Real prose remains
in Markdown for indexing.

Ardo owns the main landmark, search, keyboard shortcuts, modal focus handling
and mobile navigation. The package owns the reading layout and responsive
rhythm, with no Ardo dependency. Links to the remaining Ferromark documentation
use the live site; they are not empty local stubs.

Known Ardo integration gap: an internal Markdown link inside JSX, such as
`<section>…[Start](/rust/getting-started/)…</section>`, currently breaks the
`llms-full.txt` build. Ardo rewrites the destination with angle brackets, which
the subsequent MDX projection rejects. The reference index uses a native `<a>`
for that link. External Markdown links and the page's DOM outline work normally.

The built-in search finds Markdown prose, but its excerpts still include MDX
component tags, props and `export const handle`. Searching for `sanitize`
demonstrates this on the starting page. This needs an Ardo search-index fix
before production adoption; DOM heading discovery does not change the
build-time search projection. Neither gap is patched through private Ardo APIs
in this reference.
