# Third-Party Notices — ferramenta-family

The source code of this package is MIT licensed (see the repository
[LICENSE](https://github.com/sebastian-software/ferramenta/blob/main/LICENSE)).
So are the member icons in `icons/`, the textures in `textures/`, and the line
icons in `src/mark-defs.ts`: they were made for this family (ADR-0009). The
following bundled assets carry their own terms.

The original rendered identities, instruments and textures in `ferra/` were
also made for this family and are MIT licensed (ADR-0010). Their wordmarks are
rendered images or real page text; the package includes no Helvetica font file.
The separately identified workshop logos below retain their own ownership.

## Sebastian Software and Sebastian Consulting logos

`ferra/brands/sebastian-software.svg` and `sebastian-consulting.svg` are
copied unchanged from this repository's original `app/assets/logos/` files.
They identify Sebastian Software GmbH and Sebastian Consulting. All rights
in these marks remain with their owners; the package's MIT license does not
grant trademark rights. Preserve their original colors on a flat light ground.

## IBM Plex Sans (Ferra heading font)

`ferra/fonts/ibm-plex-sans-600.woff2` is IBM Plex Sans Semibold by IBM,
licensed under the SIL Open Font License 1.1. The unchanged license text ships
as `ferra/fonts/OFL-IBM-Plex.txt`. Its pinned upstream source and hashes
are recorded in `ferra/fonts/manifest.json`. The Ferra stylesheet
serves the font locally; body text uses the system UI stack.

## Barlow Condensed (font)

`fonts/barlow-condensed-500.woff2`, `-600.woff2` and `-700.woff2` are weights of
the typeface [Barlow Condensed](https://github.com/jpt/barlow) by The Barlow
Project Authors, licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/); the license text
ships as `fonts/OFL-Barlow.txt`. Loading `ferramenta-family/fonts.css` is
optional; the chrome falls back to the body stack without it.

## Logos of other projects

`icons/palamedes.svg`, `icons/dalo.svg` and `icons/ardo.svg` are the logos of the Palamedes,
Dalo and Ardo projects. They are shown to identify those projects in the family's
navigation and belong to them. The GitHub mark in the sprite is GitHub's.

The Ardo logo is copied unchanged from
[its documentation site source](https://github.com/sebastian-software/ardo/blob/main/docs/app/assets/logo.svg).
