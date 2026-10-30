# Ferromark documentation reference

An executable implementation of [the approved Rust starting-page design](../../designs/ferromark-start.html).
It consumes `FerraDocsLayout` from the family package and Ardo's v6 composition
APIs. The Ferramenta homepage also uses Ardo 6 and Ferra. This reference remains
excluded from the production build and marked `noindex`.

Run it with the repository's installed Ardo release:

```sh
pnpm docs:ferromark dev
pnpm docs:ferromark build
pnpm docs:ferromark preview
```

Open `/rust/getting-started/`. The runner copies the built family package into
the example's ignored `node_modules` and links the repository's installed Ardo
package. It refuses to replace an existing different Ardo install.
To try an upstream development build, set `ARDO_PACKAGE` to its absolute package
path. The runner leaves that checkout unchanged. Installing this isolated
project's dependencies also supports its ordinary `dev`, `build` and `preview`
scripts.

After preparing the reference with the runner, check its TypeScript and
type-aware lint separately from the repository root:

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
The index uses an ordinary Markdown link again. Both fixes ship in Ardo 6; neither behavior is patched through private Ardo APIs here. The HTML shell uses the current `colorScheme` and `icon` props.
