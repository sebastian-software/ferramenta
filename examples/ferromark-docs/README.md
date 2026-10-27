# Ferromark documentation reference

An executable implementation of [the approved Rust starting-page design](../../designs/ferromark-start.html).
It consumes `FerraDocsLayout` from the family package and Ardo's v6 composition
APIs. The existing Ferramenta site and Ferromark homepage retain their current
Ardo versions. This reference is excluded from the production build and marked
`noindex`.

Until Ardo 6 is published, point the runner at a built Ardo checkout containing
the composition APIs, MDX projection fixes and current JSX theme APIs:

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

The production checks use Ardo 4 and do not install this isolated project's
unreleased dependencies. After preparing the reference with the runner, check
its TypeScript and type-aware lint separately from the repository root:

```sh
pnpm exec tsc --noEmit -p examples/ferromark-docs/tsconfig.json
pnpm exec eslint --no-ignore examples/ferromark-docs/app/root.tsx examples/ferromark-docs/ardo.config.ts --max-warnings=0
```

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

The initial integration exposed two upstream bugs, now fixed in Ardo:
[internal Markdown links inside JSX broke LLM exports](https://github.com/sebastian-software/ardo/issues/421),
and [search excerpts included MDX syntax](https://github.com/sebastian-software/ardo/issues/422).
The index uses an ordinary Markdown link again. Use a checkout containing those
fixes when validating the reference; neither behavior is patched through private
Ardo APIs here. The HTML shell uses the current `colorScheme` and `icon` props.
