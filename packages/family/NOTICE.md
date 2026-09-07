# Third-Party Notices — ferramenta-family

The source code of this package is MIT licensed (see the repository
[LICENSE](https://github.com/sebastian-software/ferramenta/blob/main/LICENSE)).
The following bundled assets carry their own terms and are **not** covered by
the MIT license.

## Streamline icons

Most Ferramenta project marks in `src/mark-defs.ts` (toolbox, anvil, flame,
stamp, corner ruler, drawer cabinet, carving chisel, welding helmet) are derived
from icons by [Streamline](https://streamlinehq.com) (Duotone and Ultimate
sets), adapted in color and detail, and used under a Streamline license.

These icon assets remain the property of Streamline Design Inc. and may be used
only in the context of the Ferramenta open-source projects. They may not be
extracted, redistributed, or reused as standalone assets. Fewer than 100
Streamline-derived icons are used per project — a test in this package fails if
the sprite grows past that line.

The ferralk mark (horseshoe magnet) and the palamedes mark (type slugs in a
composing stick) are our own drawings in the same construction and carry no
Streamline claim; they are covered by the MIT license.

## Big Shoulders (font)

`fonts/big-shoulders.woff2` is the typeface
[Big Shoulders](https://fonts.google.com/specimen/Big+Shoulders), licensed under
the [SIL Open Font License 1.1](https://openfontlicense.org/). Loading
`ferramenta-family/fonts.css` is optional; the chrome falls back to the body
stack without it.
