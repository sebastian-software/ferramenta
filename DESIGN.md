---
name: Ferramenta
description: Monografie, the one page system of the family site, the engine homepages and their documentation.
colors:
  paper: "#f6f5f2"
  sheet: "#fcfbf9"
  ink: "#26231f"
  ink-2: "#57534c"
  ink-3: "#6d6961"
  steel: "#c9c6bf"
  steel-2: "#a9a59d"
  steel-3: "#8d897f"
  oxide: "#7a3a22"
  oxide-2: "#8e4a2c"
  oxide-wash: "#f3e9e3"
  code-highlight: "#f8f2ee"
  hair: "rgba(38, 35, 31, 0.16)"
  hair-2: "rgba(38, 35, 31, 0.09)"
typography:
  display:
    fontFamily: "Source Serif 4 Subhead, Georgia, serif"
    fontSize: "clamp(36px, 3.2vw + 12px, 58px)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  display-second:
    fontFamily: "Source Serif 4 Subhead, Georgia, serif"
    fontSize: "clamp(20px, 1vw + 14px, 28px)"
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.3
  headline:
    fontFamily: "Source Serif 4 Subhead, Georgia, serif"
    fontSize: "clamp(28px, 1.6vw + 16px, 38px)"
    fontWeight: 600
    lineHeight: 1.14
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Source Serif 4 Subhead, Georgia, serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
  standfirst:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.62
  docs-body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.68
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
layout:
  column: "600px"
  wide: "1040px"
  full: "1240px"
  docs-column: "680px"
  header-height: "60px"
  menu-breakpoint: "960px"
  notes-breakpoint: "1180px"
---

# Design System: Ferramenta

Monografie ([ADR-0012](docs/adr/0012-monografie-engine-pages.md)) is the one page system of
ferramenta.dev, every engine homepage and the engines' documentation. Ground truth is the
shipped artifact: the stylesheets
([monografie.css](packages/family/styles/monografie.css),
[monografie-docs.css](packages/family/styles/monografie-docs.css),
[monografie-ardo.css](packages/family/styles/monografie-ardo.css)), the components in
[packages/family/src/](packages/family/src) (`Mono*.tsx`), and the pages that stack them
([app/routes/home.tsx](app/routes/home.tsx) and the kit at [app/routes/kit/](app/routes/kit)).
The members' marks and instruments come from [design/ferra/](design/ferra/README.md)
([ADR-0010](docs/adr/0010-ferra-design-system.md) for their making). The front matter copies
the `--mono-` tokens; the prose says where each goes.

## Overview

**Creative North Star: "The monograph"**

A page reads like a well-made monograph about one instrument. The member's instrument stands
centered on open paper as the opening plate; one reading column follows, narrow enough for
comfortable lines, with notes in the margins beside the passage they explain. Specimens of
real output widen the column; the navigation runs along the top in the instrument's own
brushed steel. The serif speaks for the brand; the visitor's system face carries the reading.

**Key Characteristics:**

- One authored light scheme, homepages and documentation alike; no theme toggle.
- One reading column (600px at 19px on homepages, 680px at 18px in documentation) that widens
  to 1040px for specimens and 1240px for full-width drawings.
- Two textures, each with one job: the steel band of the navigation, and the rust patina on
  the primary action and the engine's own bar. Nothing else is textured.
- Every demo shows real output of the published package; every comparison names the two to
  four best-known alternatives and links the full field.
- What a thing is comes first; where it comes from comes second.
- Two tiers: engines on their instruments, applications on light cards under their own logos.

## Colors

All colors are tokens on `.mono`, `.mono-header`, `.mono-footer` and `.mono-ardo`; a new color
is a token there, not a literal in a site's stylesheet.

- **Paper** (`--mono-paper`) is the ground of every page. **Sheet** (`--mono-sheet`) lifts code,
  examples, diagrams and facing specimens a step above it.
- **Ink** in three steps: `--mono-ink` for text and headings, `--mono-ink-2` for standfirsts
  and second lines, `--mono-ink-3` for captions, labels and metadata. All three hold 4.5:1 on
  paper and sheet.
- **Steel** in three steps for rules, tracks and quiet controls; the header's band is the
  rendered steel itself (`--mono-steel-band`).
- **Oxide** (`--mono-oxide`, `--mono-oxide-2` on hover) for links, focus rings, the current
  page and the primary action under its rust patina. **Oxide wash** marks a selected row or
  tab; **code highlight** (`--mono-code-highlight`) is the lighter wash behind a highlighted
  code line, so every GitHub Light token stays above 4.5:1 on it.
- **Hairlines** (`--mono-hair`, `--mono-hair-2`) divide; they never box.

## Typography

- **Source Serif 4 Subhead**, bundled under the OFL: Semibold for headings and the product
  name, Italic for the second headline line and the colophon. Headings wrap balanced and break
  a word only when it is wider than the column.
- **System UI** for reading text, standfirsts, navigation and labels.
- **System monospace** for code, figures in margin notes, release tags and file names.
- No third-party font service is contacted; faces load with `font-display: swap`.

## Layout

- The reading column is centered; margin notes stand beside their passage from 1181px and move
  into the text below.
- The header is 60px, sticky and spans the window on every page, so it does not move between a
  homepage and its documentation. Its links lead to pages, never to anchors on the homepage, and
  fold into a menu below 961px; GitHub is its mark at the end of the row, beside search. Just
  above 961px the header's spacing tightens so the links, the release, the family link, search
  and GitHub keep one row.
- Documentation takes Ardo's layout: Ardo's sidebar on the window's left edge, with one tab per
  section along its outer edge, the outline on the right edge, the article centered between
  them; prose keeps 680px at 18px. The panels keep Ardo's widths up to 1280px and grow by up to
  80px and 60px toward 1600px. Both side panels stay in view under the header. Below
  1024px the sidebar folds into Ardo's menu, which then also carries the header's links, and
  the Monografie menu steps aside.
- Paired specimens stack on narrow screens; on phones a comparison chart puts each name above
  its bar.

## Elevation, shape and motion

- Sheets carry a hairline ring and one soft shadow; nothing floats higher.
- Corners are 2px at most; the instruments bring their own rounded machining.
- Engraved hairlines (`MonoEngraving`) divide sections, one of five lines in oxide.
- Motion is small and optional: a comparison chart grows its bars once when it comes into
  view. Under `prefers-reduced-motion` every transition and animation is off.

## Components

The kit at `/kit/` renders every part with an invented tool; `/kit/docs/` is a sample
documentation page in an engine site's shell.

- **Chrome:** `MonoPage`, `MonoHeader` (product, links, release, the family link, host
  actions such as search), `MonoFooter`.
- **Homepage parts:** `MonoOpening` (the instrument as plate, kicker, two-line title,
  standfirst, actions, facts), `MonoSection`, `MonoPassage` with notes, `MonoLeadIn`,
  `MonoWide`, `MonoFacing` and `MonoSheet`, `MonoTerms`, `MonoProofs`, `MonoCards` and
  `MonoCard`, `MonoBarChart` with `MonoSegmented` and `MonoTableView`, `MonoColophon`,
  `MonoClosing`, `MonoAction`, `MonoEngraving`.
- **Family overview:** `MonoEngineCatalog` (every engine on its own plate, in editorial order,
  with live release facts and relations), `MonoApplications` (light cards under each
  application's own logo), `MonoWorkshop` (the workshop's two brands, unchanged).
- **Documentation:** `MonoArdoSite` (Ardo's sidebar, section tabs and outline; from
  `ferramenta-family/ardo`), `MonoReadingLayout`, `MonoSectionRail`, `MonoGuideNavigation`,
  `MonoReadingTable` (named after its caption or heading), `MonoTable`, `MonoBenchmarkTable`,
  `MonoComparisonTable`, `MonoMeasured`, `MonoBars`, `MonoCode`, `MonoRenderedCode`,
  `MonoCodePair`, `MonoDiagram`, `MonoExample`, `MonoToggle`, `MonoSelect`, `MonoTabs`,
  `MonoSteps`, `MonoChoices`, `MonoFeatureGrid`, `MonoColumns`, `MonoMedia`, `MonoArticle`.
- **Identity:** the `.ferra-mark`, `.ferra-instrument` and `.ferra-workshop-logo` pictures,
  placed by `ferra-assets.css`; the line icons of `Mark` and `MarkDefs`.

## Do's and Don'ts

### Do:

- **Do** open a member's page with its instrument, centered, and say what the thing is before
  where it comes from.
- **Do** keep reading text in one column and put asides in margin notes.
- **Do** show real output of the published package in specimens, produced by the site's own
  scripts.
- **Do** keep rust to the primary action and the engine's own bar.
- **Do** keep the rows where the project is behind in a comparison, say every mark in words,
  and put a `MonoMeasured` under every measurement.
- **Do** make anything that scrolls sideways reachable by keyboard, and give every region a
  name of its own.
- **Do** show applications on light cards under their own logos, in their own colors.
- **Do** put a pattern two members' sites need into the package, with a specimen in the kit.

### Don't:

- **Don't** add a texture, a material or a second accent color without a decision record.
- **Don't** draw annotation arrows, numbered balloons or invented mappings onto a specimen.
- **Don't** repeat a factor, timing, percentage or test count on the family site.
- **Don't** draw the members as a chain or a pipeline, or imply an entry point.
- **Don't** put a foreign logo on steel or rust, and don't recolor it.
- **Don't** put a theme toggle on a page.
- **Don't** use a real member's figures or a real contender's name in a kit specimen.
- **Don't** invent stars, counts, testimonials or press.
