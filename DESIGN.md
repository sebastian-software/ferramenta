---
name: Ferramenta
description: The family look of the Ferramenta engines — a catalog of riveted steel data plates on a light, cool ground with black-steel passages and one rust band.
colors:
  bg: "oklch(0.955 0.004 250)"
  bg-dim: "oklch(0.915 0.006 250)"
  ink: "oklch(0.21 0.012 250)"
  ink-soft: "oklch(0.4 0.014 250)"
  line: "oklch(0.82 0.008 250)"
  line-heavy: "oklch(0.21 0.012 250)"
  rust: "oklch(0.42 0.095 38)"
  rust-deep: "oklch(0.35 0.085 36)"
  on-rust: "oklch(0.99 0.003 80)"
  rust-fill: "oklch(0.42 0.095 38)"
  rust-fill-edge: "oklch(0.35 0.085 36)"
  rust-fill-ink: "#fff"
  rust-fill-soft: "oklch(0.92 0.02 60)"
  iron: "oklch(0.19 0.008 250)"
  iron-2: "oklch(0.26 0.01 250)"
  iron-ink: "oklch(0.96 0.004 250)"
  iron-soft: "oklch(0.78 0.008 250)"
  iron-line: "oklch(0.32 0.01 250)"
  ember: "oklch(0.72 0.11 50)"
  steel: "oklch(0.68 0.003 250)"
  steel-ink: "oklch(0.13 0.01 250)"
  rust-on-steel: "oklch(0.4 0.11 37)"
  inlay: "oklch(0.2 0.008 250)"
  inlay-ink: "oklch(0.95 0.004 250)"
  inlay-soft: "oklch(0.76 0.006 250)"
  inlay-line: "oklch(0.36 0.008 250)"
  code-type: "oklch(0.84 0.04 240)"
  code-function: "oklch(0.88 0.065 90)"
  code-string: "oklch(0.84 0.06 150)"
  code-comment: "oklch(0.68 0.01 250)"
  docs-dark-bg: "oklch(0.19 0.008 250)"
  docs-dark-bg-dim: "oklch(0.23 0.01 250)"
  docs-dark-ink: "oklch(0.95 0.004 250)"
  docs-dark-ink-soft: "oklch(0.76 0.008 250)"
  docs-dark-line: "oklch(0.32 0.01 250)"
  docs-dark-line-heavy: "oklch(0.88 0.006 250)"
  docs-dark-rust: "oklch(0.72 0.11 50)"
  docs-dark-rust-deep: "oklch(0.64 0.105 46)"
  docs-dark-on-rust: "oklch(0.17 0.01 250)"
typography:
  display:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "0.005em"
  display-name:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3.25rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "0.03em"
  headline:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.03em"
  what:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.01em"
  action:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
  label:
    fontFamily: "Barlow Condensed, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
  lede:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.0625rem, 1.5vw, 1.1875rem)"
    fontWeight: 500
    lineHeight: 1.55
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "ui-monospace, SF Mono, Cascadia Code, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  none: "0"
  rivet: "50%"
  chain-link: "0.3125rem"
spacing:
  section: "clamp(4.5rem, 9vw, 7.5rem)"
  wrap-max: "80rem"
  wrap-inline: "clamp(1rem, 4vw, 3rem)"
  plate-inset: "clamp(1.5rem, 4vw, 3.5rem)"
  rivet-inset: "0.75rem"
  bar-height: "4rem"
  target: "2.75rem"
components:
  plate:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.steel-ink}"
    rounded: "{rounded.none}"
    padding: "clamp(2.25rem, 4.5vw, 3.5rem) clamp(1.5rem, 4vw, 3.5rem)"
  hanging-tag-cell:
    backgroundColor: "{colors.inlay}"
    textColor: "{colors.inlay-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem 0.6875rem"
  button-primary:
    backgroundColor: "{colors.iron}"
    textColor: "{colors.iron-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.iron-2}"
  button-ghost:
    textColor: "{colors.steel-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "3.25rem"
  button-steel:
    backgroundColor: "{colors.steel}"
    textColor: "{colors.steel-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0 1.375rem"
    height: "3.25rem"
  install-inlay:
    backgroundColor: "{colors.inlay}"
    textColor: "{colors.inlay-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "0 1.125rem"
    height: "3.25rem"
  stamp:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.625rem 0.3125rem"
  stamp-solid:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.on-rust}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.625rem 0.3125rem"
  stamp-solid-on-material:
    backgroundColor: "{colors.rust-fill}"
    textColor: "{colors.rust-fill-ink}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.625rem 0.3125rem"
  stamp-on-plate:
    backgroundColor: "{colors.inlay}"
    textColor: "{colors.inlay-ink}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.625rem 0.3125rem"
  site-header:
    backgroundColor: "{colors.iron}"
    textColor: "{colors.iron-ink}"
    height: "4rem"
  black-steel-band:
    backgroundColor: "{colors.iron}"
    textColor: "{colors.iron-ink}"
    padding: "clamp(4.5rem, 9vw, 7.5rem) 0"
  rust-band:
    backgroundColor: "{colors.rust-fill}"
    textColor: "{colors.rust-fill-ink}"
    padding: "clamp(4.5rem, 9vw, 7.5rem) 0"
  code-panel:
    backgroundColor: "{colors.iron}"
    textColor: "{colors.iron-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
---

# Design System: Ferramenta

Ground truth is the shipped artifact: the tokens
([packages/family/styles/tokens.css](packages/family/styles/tokens.css)), the landing kit
([packages/family/styles/landing.css](packages/family/styles/landing.css)), the chrome
([packages/family/styles/chrome.css](packages/family/styles/chrome.css)), the components in
[packages/family/src/](packages/family/src), and the pages that stack them
([app/routes/home.tsx](app/routes/home.tsx), the kit at [app/routes/kit/](app/routes/kit)). The
decision behind it is [ADR-0008](docs/adr/0008-design-direction-typenschild.md); the icons are
[ADR-0009](docs/adr/0009-generated-member-icons.md). ADR-0003 and ADR-0005 are superseded. Every
value in the front matter is copied from `tokens.css` or from the rule that uses it; the front
matter is normative and the prose below only says where a token goes.

## Overview

**Creative North Star: "The Data Plate"**

Every machine carries a data plate that says what it is. The family site is the workshop's
catalog of such plates: one riveted sheet of brushed steel per engine, read before anything
else. The direction is named "Typenschild", German for that plate. A page is light and cool,
with deliberately dark passages in black steel, and it closes on one band of dark, oxidized
rust. Lettering is a condensed data-plate face; reading text is the system face. Each member is
one rendered object of forged steel with a single glowing or rust-orange element.

The system is dense where a plate would be dense (names, labels, measured facts) and quiet
everywhere else. Material gives the pull; restraint and plain language give the trust. It
refuses the SaaS hero-plus-feature-cards arrangement and the dark developer-tool default.

**Key Characteristics:**

- Three materials, one job each: brushed steel, black steel, rust. Everything else is flat.
- One prop: the riveted plate, with its measured facts on a tag hanging below it.
- One authored scheme on landing pages; no theme toggle there.
- Sharp corners; only rivets and chain links are round.
- What a thing is comes first; where it comes from comes second.
- Two tiers: engines in the family look, applications in one band in their own colors.

### Named Rules

**The Three Materials Rule.** Brushed steel is the plate: what a thing is, and the action.
Black steel is the first viewport, the chrome, and a page's dark bands. Rust is the closing
band, once per page. Everything else is flat. A new material, or a second prop beside the
plate, needs a decision record.

**The Say-What-It-Is-First Rule.** A plate carries the name, the plain "what", what it does,
and the action. Lineage and measured facts come second: on the hanging tag under a hero, or
last and quiet in a catalog row. This is a rule for structure, not only for copy.

**The One Scheme Rule.** A landing page is `.fam-page`, which pins the authored light values
whatever the visitor's theme. It has no theme toggle. Documentation follows the system scheme
(or the host's explicit `.light` / `.dark`), and keeps Ardo's layout and shapes; the family
adds its colors and its chrome, nothing more.

**The Two Tiers Rule.** Engines wear the family look. Applications appear in one band, each in
its own brand colors from the registry; the family carries them, it does not dress them.

**The Independent Members Rule.** No chain, no pipeline diagram, no entry point. Where two
members fit together, the row says so in one sentence. The family site states results
qualitatively and never repeats a figure; figures belong to each project's own page.

## Colors

A cool, near-neutral steel palette (hue 250 throughout) with exactly one color: rust, dark and
oxidized on the light ground, glowing as `ember` on black steel.

### Primary

- **Oxidized Rust** (`rust`, with `on-rust` as its text): the settled stamp's fill on the
  ground, the line icons that mark a relation, text selection, `accent-color`, the focus ring
  on the light ground. It follows the scheme on a docs page.
- **Rust Fill** (`rust-fill`, `rust-fill-edge`, `rust-fill-ink`, `rust-fill-soft`): rust as a
  surface, the same in every scheme. The closing band's base under its texture, its text and
  its softer paragraph; the settled stamp's fill, border and text when it sits on a plate or
  on black steel.
- **Deep Rust** (`rust-deep`): links in running text, the settled stamp's border, and display
  lettering on the light ground (the pull quote of the personal note).
- **Ember** (`ember`): rust as it glows on black steel. Links and link hovers on black steel,
  the rule over a principle there, the top edge of a flyout, the keyword in code, the focus
  ring on every dark surface.
- **Rust on Steel** (`rust-on-steel`): one word of the headline on a plate. Display lettering
  only; it reaches about 3.5:1 against the steel and is never used for small text.

### Neutral

- **Cool Ground** (`bg`) and **Dim Ground** (`bg-dim`): the page, and a section set apart from
  its neighbors (`tone="dim"`).
- **Ink** (`ink`) and **Soft Ink** (`ink-soft`): text and secondary text on the light ground.
- **Hairline** (`line`) and **Heavy Rule** (`line-heavy`): 1px row separators; the 3px rule
  over a principle.
- **Black Steel** (`iron`, `iron-2`, `iron-ink`, `iron-soft`, `iron-line`): the header, the
  footer, the hero ground, dark bands, flyouts and the code panel; the raised or hovered
  surface; text; secondary text; hairlines. The same in every scheme.
- **Plate Steel** (`steel`) and **Plate Ink** (`steel-ink`): the color under the steel texture
  for the moment before it loads, and the solid dark text on a plate.
- **Inlay** (`inlay`, `inlay-ink`, `inlay-soft`, `inlay-line`): the dark, flat ground small
  facts sit on when they are on or under a plate; its text, its labels, its cell dividers.
- **Code** (`code-type`, `code-function`, `code-string`, `code-comment`; the keyword is
  `ember`): one low-chroma set, because code always sits on black steel.
- **Docs, dark scheme** (`docs-dark-*`): the page-level tokens outside `.fam-page` when the
  system or host asks for dark. `--focus` becomes `ember` there. Black steel, the plate, the
  inlay and the rust fill do not change.

Application brand colors are not family tokens. They come from the registry
(`brand.ground`, `brand.ink`, `brand.accent`, `brand.logoGround`) and exist only inside the
applications band.

### Named Rules

**The Oxidized Rule.** Rust is dark and oxidized, never a saturated orange field. On the rust
band the type is plain and light; no display-lettering tricks on rust.

**The Solid Ink Rule.** Text on steel is `steel-ink`, solid. `rust-on-steel` is for display
lettering only.

**The One Color Rule.** Rust is the only hue the family owns. A second accent does not exist;
the saturated orange of the rendered icons belongs to the objects, not to the interface.

## Typography

**Display Font:** Barlow Condensed (self-hosted, weights 500, 600 and 700, Latin subset, SIL
OFL 1.1; falls back to the body stack)
**Body Font:** the system stack (`system-ui`, `-apple-system`, "Segoe UI", Roboto, sans-serif)
**Label/Mono Font:** the system mono (`ui-monospace`, "SF Mono", "Cascadia Code", Menlo,
Consolas)

**Character:** Barlow Condensed letters everything a plate would carry: names, headings,
labels, actions. Reading text stays in the system face and code in the system mono, so only
one font is bundled. The display face loads with `font-display: block`, and the 700 weight is
preloaded from the root route.

### Hierarchy

- **Display** (700, `clamp(2.5rem, 6vw, 4.75rem)`, line-height 0.96, uppercase): the family's
  headline on the hero plate. A project's own name, which has a "what" line under it, is
  larger (`clamp(3.25rem, 8vw, 6rem)`, tracking 0.03em).
- **What** (600, `clamp(1.5rem, 3vw, 2.25rem)`, line-height 1.1, sentence case): what the thing
  is, directly under its name.
- **Headline** (700, `clamp(2.25rem, 4.6vw, 3.5rem)`, line-height 1, uppercase): a section's
  `h2`. No rule under it.
- **Title** (700, 1.625rem from `--h3-size`, line-height 1.05, tracking 0.03em, uppercase): a
  principle, a heading inside a run sample's output; a name on a catalog plate runs `clamp(1.75rem, 7vw, 2.125rem)` at tracking 0.035em.
- **Lede** (system, 500, `clamp(1.0625rem, 1.5vw, 1.1875rem)`, line-height 1.55, max 58ch): the
  paragraph on the plate.
- **Body** (system, 400, 1.0625rem, line-height 1.6; measures of 58 to 62ch): reading text. A
  section intro is 1.125rem in soft ink.
- **Action** (700, 1.125rem, tracking 0.1em, uppercase): buttons and the catalog's go-link.
- **Label** (600, 0.75rem to 0.875rem, tracking 0.14 to 0.16em, uppercase): a fact's label, a
  stamp (700, 0.8125rem), a flyout group, a footer column head.
- **Mono** (system mono, 0.8125rem to 0.9375rem): code, commands, file names, a release
  number (tabular figures, so a live value never shifts the line).

The smallest type on a family page is 0.75rem (12px), and only as a label on an inlay or on
the flat ground.

### Named Rules

**The Inlay Rule.** Small type never sits on brushed steel or on rust: a texture's streaks cut
into it. On or under a plate it goes on the dark inlay or on the hanging tag: fact labels, the
install command, an outlined stamp, what a figure was measured on. As built, nothing below
1.0625rem sits directly on either material. Black steel is a different case, not an exception:
its texture is pulled to a near-flat dark ground (it nets #15171A against the chrome's
#111417), so light text reads on it as on the flat chrome. Soft text holds about 9:1 there and
better than 8:1 on the texture's lightest patch; full ink holds about 16:1. A dark band may
carry a section note or the stamp legend at 0.9375rem.

**The Plate Lettering Rule.** Display type is uppercase and is for what a plate would carry.
Two things keep their own case: the "what" line, and an identifier (a file name, a command).
An application's name is set in the body face, because it is not the family's brand.

## Layout

A page is `.fam-page` with full-bleed bands stacked inside it; each band holds one `.wrap`
(max 80rem, inline padding `clamp(1rem, 4vw, 3rem)`). The rhythm between sections is one token,
`clamp(4.5rem, 9vw, 7.5rem)`; two neighbors on the same ground are parted by one step, not two
(the second drops its top padding).

The family page's order, as built: hero plate on black steel, the engine catalog on the light
ground, the applications band on black steel, what earns a rating (principles and the stamp
legend), the personal note on the dim ground, the rust band, the black-steel footer.

- **Hero.** One plate; copy left, the rendered icon right (14 to 18rem) from 64rem up; on a
  phone the icon moves above the copy (8 to 11rem). The tag hangs from the plate's lower left.
- **Catalog row.** Below 64rem the name plate stacks over the copy; from 64rem a 24rem plate
  column sits beside it with a 3.5rem gap. The facts share one set of columns down the page.
- **Split section.** Heading column beside content (1fr / 1.6fr), stacking below 64rem.
- **Breakpoints in use:** 22rem, 30rem, 46rem, 48rem, 54rem, 60rem, 64rem. 64rem is the main
  one: below it columns stack and a docs section menu appears in the bar.

The page never scrolls sideways (`overflow-x: clip` on `.fam-page`); wide content scrolls in
its own box. Interactive targets are at least 44px tall in the bar and the link lines.

### Named Rules

**The Light-After-Hero Rule.** Do not pair a black-steel band directly under the hero when a
light section can go there. The kit parts two dark passages with an `iron-line` hairline, which
makes the pairing possible, not preferable.

**The Load Order Rule.** `tokens.css`, `fonts.css`, `theme.css` (then the optional
`docs.css`), `landing.css`, the site's own stylesheet, `chrome.css` last. The site adjusts the
kit on equal specificity; the chrome wins its ties. Every landing class is prefixed `fam-`;
bare elements are styled only inside `.fam-page` and through `:where()`, so a host rule always
wins. The chrome's unprefixed class names (`site-header`, `bar`, `wrap`, `lockup`, `flyout`,
`icon`, and the rest listed in the header of `chrome.css`) are part of the package contract.
See the Gotchas in [AGENTS.md](AGENTS.md).

## Elevation & Depth

Depth belongs to the materials. The flat parts of a page (sections, rows, ledgers, the
application cards, the code panel) carry no shadow and are parted by hairlines and ground
changes. A plate is a physical sheet: a lit top and left edge, a shaded bottom and right edge,
and a short cast shadow beneath it. An inlay is pressed into the steel. A flyout floats under
the bar.

### Shadow Vocabulary

- **Plate** (`inset 0 1px 0 rgb(255 255 255 / 0.55), inset 1px 0 0 rgb(255 255 255 / 0.25), inset 0 -1px 0 rgb(0 0 0 / 0.45), inset -1px 0 0 rgb(0 0 0 / 0.25), 0 1px 2px rgb(0 0 0 / 0.4), 0 18px 28px -18px rgb(0 0 0 / 0.55)`):
  every plate, large or small.
- **Rivet** (`0 1px 1px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(0 0 0 / 0.28)`): the four corner
  rivets, 0.75rem across, 0.75rem in from each edge.
- **Inlay** (`inset 0 2px 4px rgb(0 0 0 / 0.6)`, plus `0 1px 0 rgb(255 255 255 / 0.3)` for the
  install line): small facts pressed into a plate.
- **Object on a plate** (`drop-shadow(0 1px 1px rgb(0 0 0 / 0.5)) drop-shadow(0 8px 8px rgb(0 0 0 / 0.28))`):
  a rendered icon standing on steel. Flat icons cast none.
- **Primary action** (`inset 0 1px 0 rgb(255 255 255 / 0.14), 0 10px 16px -10px rgb(0 0 0 / 0.7)`):
  the black-steel button on a plate.
- **Flyout** (`0 18px 44px -16px oklch(0.1 0.01 250 / 0.7)`): the switcher and the section
  menu, tied to the bar by a 2px `ember` top edge.

### Motion

- **The one light.** A single reflection crosses every plate and follows the pointer
  (`--fam-sheen`, a soft-light gradient; `background-position` eases over 0.9s with
  `cubic-bezier(0.16, 1, 0.3, 1)`).
- **The tag settles.** The hanging tag sways once on load (2.6s, from 0.9deg to rest) and then
  hangs still.
- **Small responses.** An action's arrow slides 4px (0.25s); link and bar colors change over
  0.2s; a chevron flips when its menu opens.
- **Reduced motion.** The light stays where it is, the tag does not sway, transitions are off.

### Named Rules

**The One Light Rule.** There is one moving reflection for all plates on a page, mounted once
by the hero. No second ambient animation.

**The Material-Only Depth Rule.** A shadow means steel. A flat surface never takes one to look
like a card.

## Shapes

Corners are sharp: every surface, button, stamp, panel and tile has a zero radius. Line icons
are drawn with square caps and miter joins at a 1.5 stroke on a 24 grid. Borders are hairlines
(1px), the heavy rule over a principle (3px), and the engraved outline of a ghost action or an
outlined stamp (1.5px).

**The Round-in-the-World Rule.** Only what is round in the world is round: rivets (50%) and
the links of the tag's chain (0.3125rem on a 0.625rem link). One further curve is allowed and
is not the family's own: the disc under another brand's round emblem in the applications band.

Documentation pages keep Ardo's own shapes, including its rounded code blocks and callouts.
That is the docs shell's form, not the family's, and it does not travel to landing pages.

## Components

Everything below ships in `ferramenta-family` and is shown live in the kit (`/kit`). A home
page is these components stacked inside one `.fam-page`.

### The plate (`Plate`, `Rivets`, `HangingTag`, `PlateLight`)

The family's one prop: a sheet of brushed steel (`steel.webp` over `steel`), riveted at its
four corners, that says what a thing is. It appears as the hero plate, the name plate of a
catalog row, and the small plate of an evidence figure; a steel tile (3px padding) under a
flat icon on black steel is the same material at icon scale. The hanging tag is a narrow plate
frame on two chain links holding inlay cells: label over value, two columns on a phone, one
row from 64rem. A plate that names nothing is not a plate; do not use it as a generic card.

### Buttons

- **Shape:** sharp, 3.25rem tall, 1.375rem inline padding, action type.
- **Primary** (`fam-btn-primary`): black steel on a plate or on the light ground; one per
  view. Hover lifts to `iron-2`.
- **Steel** (`fam-btn-steel`, and the primary on black steel): a polished piece of the plate's
  own steel (the texture under a white veil) with `steel-ink` text. The one action on the rust
  band and on black steel.
- **Ghost** (`fam-btn-ghost`): a 1.5px engraved outline in the surface's own ink; hover tints
  the ground 10% black (12% white on black steel).
- **Install line** (`fam-install`): a command in mono on an inlay, beside the actions.
- **Focus:** a 2px outline, 3px offset: rust on the light ground, `steel-ink` on a plate,
  `ember` on black steel, `rust-fill-ink` on the rust band.

### Stamps and the stamp legend (`Stamp`, `StampKey`)

A rating lettered like a plate: display 700 at 0.8125rem, tracking 0.16em, uppercase, 1.5px
outline in the current ink. The settled state (`stable`, `covered`) is filled with rust: `rust`
on the ground, the scheme-independent `rust-fill` set on a plate or on black steel. On a
plate an outlined stamp becomes an inlay, because it is small type. The legend sets each stamp
beside the one line it promises, from the registry.

### The engine catalog (`EngineCatalog`)

One hairline-separated row per engine. The name plate carries the rendered icon, the name
(the link, stretched over the whole plate), the plain "what", and the stamp. Beside it, in
this order: what it does (largest, in ink), for whom, its lineage sentence, its relations as
one-line sentences with a small adapter icon in rust, then the measured facts last and quiet
(labels in the label style, the release in tabular mono), then the go-link in action type.

### The applications band (`ApplicationsBand`)

A black-steel band of flat cards, each in its application's own ground, ink and accent with a
1px inset edge of the accent at 55%. The name is set in the body face. An application that
runs on family engines leads (wider column) and lists them as chips: a flat icon on a steel
tile, name and job on an inlay; its action is filled with its accent. One that stands alone
says so in a sentence and takes an outlined action.

### Sections, principles, bands (`Section`, `Principles`, `IronBand`)

A section is a headline, an optional intro and note, and content on the light or the dim
ground. Principles sit side by side (two columns from 48rem, three or four from 64rem), each
under a 3px heavy rule; on black steel the rule is `ember`. An iron band is a full-bleed
black-steel passage (`black-steel.webp` over `iron`); everything inside takes the on-iron
colors.

### The rust band (`WorkWithUs`)

The band a family page closes on: `rust.webp` tiled at 600px over `rust-fill`, a headline
in `rust-fill-ink` and one sentence in `rust-fill-soft`, both plain light type, a short ruled list of offers in display type, and one
steel action to the consulting site. No form. Once per page.

### Evidence, code, ledger, closing (`EvidenceFigures`, `CodePanel`, `RunSample`, `Ledger`, `ClosingAction`)

For a member's own page. An evidence figure is a small plate: the figure large
(`clamp(3rem, 6vw, 4.5rem)`), its label under it, and what it was measured on in an inlay; the
family site never shows one. The code panel is flat black steel, without texture: a mono
caption over a hairline, code at 0.875rem, scrolling in its own focusable box. A run sample
sets the input panel, an arrow in rust, and the tool's real output on a ruled sheet of the
page ground; below 54rem the input folds into a bar. A ledger is hairline rows of name, stamp
and sentence. The closing action is flat: headline, copy, one action, a mono link line.

### Navigation (`SiteHeader`, `ToolSwitcher`, `SiteMenu`, `SiteFooter`, `FamilyLinks`)

- **Header:** a sticky black-steel bar, 4rem tall, flat (no texture), with a 1px `iron-line`
  bottom edge. The lockup is a flat icon on a steel tile and the uppercase wordmark (1.5rem,
  tracking 0.08em). A site's own links are label-style display type in `iron-soft`, turning
  `iron-ink` on hover or when current. On a phone the links give way first; one may be kept.
- **Switcher:** a flyout of black steel listing the engines, then the applications, each tier
  under a label; every entry is a tile icon, name and short job; hover is `iron-2` with
  `ember` text. On a member's site the trigger shows the family's name inside a hairline and
  the flyout opens with the way back to the family. Below 46rem it spans the viewport.
- **Footer:** flat black steel. Lockup and one sentence, then the engines, the applications,
  and "Work with us" in display type with jobs in soft body text; a legal line over a hairline.
- **Docs shell** (`docs.css`): Ardo's documentation layout under the family bar, in the family's
  colors (`theme.css`), with a theme toggle in the bar. The toggle exists only there.

### Icons (`Icon`, `Mark`)

Each member is one object in two forms ([design/icons/README.md](design/icons/README.md)). The
rendered form goes on a plate (`hero` at full size, `rendered` for a catalog row). The flat
form takes every small place and always sits on a steel tile when the ground is black steel.
All flat icons are drawn from one 16-color palette
([packages/family/icons/palette.json](packages/family/icons/palette.json)). Applications keep
their own logos. The chrome's line icons (chevron, arrow, GitHub, crate, adapter, external,
package) come from one SVG sprite. The textures' sources and what each gave up to be a ground
for text are in [design/textures/README.md](design/textures/README.md).

**The 24 Pixel Rule.** A member's icon is never shown below 24px. Rendered on plates, flat in
small places.

## Do's and Don'ts

### Do:

- **Do** open a page with one plate on black steel: name, the plain "what", what it does, the
  action; hang the measured facts below it on the tag.
- **Do** keep the three materials to their jobs: brushed steel for plates, black steel for the
  first viewport, the chrome and dark bands, rust for the closing band, once.
- **Do** put small type on an inlay or on the tag whenever it would otherwise sit on brushed
  steel or on rust, and set text on steel in solid `steel-ink`.
- **Do** build landing pages inside `.fam-page`, in the one authored scheme, with stylesheets
  in the documented load order and classes in the `fam-` namespace.
- **Do** follow a hero with a light section.
- **Do** show engines in the family look and applications in one band in their own colors.
- **Do** use the rendered icon on a plate and the flat icon in small places, on a steel tile
  when the ground is black steel.
- **Do** state what is proven in words on the family site, and leave figures to each project's
  own page.
- **Do** say how two members fit together in one sentence in the row.
- **Do** honor reduced motion: the light stands still and the tag does not sway.

### Don't:

- **Don't** add a material or a second prop without a decision record.
- **Don't** use a plate for something that names nothing; it is not a generic card.
- **Don't** set small type on brushed steel or on rust, and don't use `rust-on-steel` below display size.
- **Don't** make rust a saturated orange field, repeat the rust band on a page, or set
  display-lettering tricks on rust.
- **Don't** round a corner. Only rivets and chain links are round, plus the disc under another
  brand's round emblem.
- **Don't** put a theme toggle on a landing page, or restyle documentation beyond the family's
  colors and chrome.
- **Don't** show a member's icon below 24px, or recolor a flat icon outside the shared palette.
- **Don't** draw the members as a chain or a pipeline, or imply an entry point.
- **Don't** repeat a factor, timing, percentage or test count on the family site.
- **Don't** dress an application in the family look, or an engine in a brand of its own.
- **Don't** pair a black-steel band directly under the hero when a light section can go there.
