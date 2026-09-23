# Ferramenta — Design System

Ground truth: the built site ([app/styles/site.css](app/styles/site.css)) and the shared
chrome and landing kit it consumes ([packages/family/src/](packages/family/src),
[packages/family/styles/](packages/family/styles)). Approved comp:
[design/comp/entwurf-c.html](design/comp/entwurf-c.html) (direction "C · Schmiede", chosen from
three intensity drafts). This file describes the system as built; the tokens, the chrome, the
landing kit and the marks ship in `ferramenta-family`, so a sibling home page is built from the
same parts as this one instead of a copy of them.

## World in one sentence

A hardware store: a light brushed-steel shop floor between two dark iron bands, where the
family's tools hang as duotone metal badges on real hooks — poster-scale condensed type,
rust as the structural color, zero border-radius, chamfers instead of rounding.

## Color tokens (OKLCH, light / `.dark`)

Defined on `:root`, overridden on `:root.dark` (Ardo's `ArdoRootLayout` theme bootstrap
sets `.dark` on `<html>`; storage key `ardo-theme`).

| Token                                                                                 | Light               | Dark                      | Role                                                                          |
| ------------------------------------------------------------------------------------- | ------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `--bg`                                                                                | 0.975 0.005 80      | 0.195 0.008 48            | page ground (under brush texture)                                             |
| `--bg-dim`                                                                            | 0.945 0.008 78      | 0.23 0.011 48             | hover fills, board ground                                                     |
| `--ink` / `--ink-soft`                                                                | 0.21 / 0.42         | 0.94 / 0.71               | text                                                                          |
| `--rust` / `--rust-deep`                                                              | 0.5 0.132 38 / 0.41 | 0.69 0.14 45 / 0.6        | brand accent, primary action                                                  |
| `--ember`                                                                             | 0.68 0.175 52       | 0.75 0.16 55              | glow, iron-band headings                                                      |
| `--line` / `--line-heavy`                                                             | 0.86 / 0.28         | 0.31 / 0.85               | hairlines / heavy rules                                                       |
| `--iron`, `--iron-2`, `--iron-ink`, `--iron-soft`, `--iron-line`                      | dark band palette   | darker variants           | header, beliefs band, footer, flyout                                          |
| `--duo0…--duo2`, `--duoink`                                                           | tint ramp + outline | dark ramp + light outline | duotone marks; dark set also on iron contexts (header/footer lockups, flyout) |
| `--plate-rim-*`, `--plate-face-*`, `--plate-sheen`, `--plate-brush`, `--plate-shadow` | warm steel          | gunmetal                  | octagon plate material                                                        |
| `--hook-dark`, `--hook-light`, `--hook-hole`                                          | burnished           | bright metal              | pegboard hooks                                                                |
| `--paper`                                                                             | 0.985 0.004 85      | (unchanged)               | partner-logo carrier plates                                                   |
| `--code-keyword`, `--code-type`, `--code-function`, `--code-string`, `--code-comment` | one set, on iron    | (keyword follows ember)   | syntax colors in the code panel                                               |

Rules: rust is structural (rules, stamps, primary action), never a scattered accent.
Ember is reserved for glow and headings on iron. No grays for secondary text on colored
surfaces — tinted tokens only.

Shapes, textures and the rhythm are tokens too (`tokens.css`), so no file restates them:
`--texture-brush` (the fiber of the floor and every iron surface), `--texture-speckle` (rust
on a plate face), `--ground-vignette`, `--ember-glow`, `--octagon` (plate outline), `--chamfer`
(the primary action's corner), `--h2-size`, `--h3-size`, `--section-space`.

## Typography

- **Display**: Big Shoulders (variable, self-hosted `packages/family/fonts/big-shoulders.woff2`,
  weight 800, uppercase, `line-height 0.98`). All headings, tool names, buttons, board labels.
  H1 `clamp(var(--fam-title-min, 3.4rem), 9vw, 6rem)`; section H2 `--h2-size`
  (`clamp(2.3rem, 4.6vw, 3.4rem)`) with a 3px `--line-heavy` bottom rule.
- **H1 floor**: 3.4rem holds a ten-letter word ("ONIGURUMA,") on a 360px phone in Big
  Shoulders. A site whose headline starts with a longer word lowers the floor with
  `--fam-title-min` on `.fam-hero` — never below 2.5rem. The headline breaks a word rather than
  scroll the page (`overflow-wrap: break-word`), but that is the last line of defense, not a
  layout. The 36KB WOFF2 is preloaded from the root route and uses
  `font-display: block`: display copy waits briefly instead of rendering a fallback and swapping;
  body copy remains immediately visible in the system stack.
- **Body**: `system-ui` stack, 1.0625rem, line-height 1.6.
- **Mono**: system mono stack (`ui-monospace…`), only for measured values: versions,
  registries, partner URLs, the signature. Never as a "technical" costume.
- **No eyebrows or kickers.** A label above a heading that restates or teases it is out —
  headings carry their own weight, and on a sibling site the project lockup already says whose
  page it is. Mono uppercase _labels_ stay, where they name a measured or structural thing
  beside it: figure labels, assembly terminals, code captions, stamps, board and flyout group
  labels. The test: delete the label; if the heading still says everything, it was a kicker.

## Materials (the skeuomorphic layer)

All CSS/SVG, no image assets; every layer theme-aware:

1. **Body**: anisotropic brushed-metal noise (inline SVG `feTurbulence`,
   `baseFrequency 0.006 0.28`, `stitchTiles`, alpha 0.11) + soft edge vignette over `--bg`.
2. **Iron bands** (header, beliefs band, footer): same fiber texture over `--iron`.
3. **Octagon plates**: rim gradient + inset face (`::before`, same clip-path, inset 2px)
   carrying sheen (115°), rust-speckle noise (alpha 0.22), 1px brush lines, vertical face
   gradient; `drop-shadow` (offset+blur — never zero-offset halos).
4. **Hooks**: shared `#i-hook` symbol — wall-hole ellipse, wire with highlight edge, eyelet
   ring gripping the plate edge.
5. **Functional hardware**: slotted steel fasteners anchor the pegboard and the pipeline's
   chamfered metal chassis. The chassis uses the plate ramp and brush lines at panel scale.

Material is limited to the environment, project plates and hooks, and mechanically necessary
fasteners/chassis. Buttons, ledger rows, copy sections, and generic cards stay flat.

## The 28px module (pegboard)

The board renders the family's real groups (Pipeline 3 / Language 3 / Workbench 3), each
row headed by a stamped 28px-tall group label — label rows and 28px gaps keep every hook
hole on the wall grid (verified 0.0px offsets, desktop and mobile).

The board's hole grid is a 28px tile (`background-size: 28px 28px`, dots offset 14px).
Everything on the board is a multiple: padding 42px (desktop) / 14px (mobile), cells
112×140px, gaps 28px → every hook hole lands exactly on a wall hole (verified 0.0px
offsets, desktop and mobile). Change board geometry only in multiples of 28, keeping
padding ≡ 14 (mod 28).

## Iconography

- **Project marks**: duotone, 24-grid, derived from Streamline (Duotone set) — recolored to
  the `--duo*` ramp, caps/joins forced square/miter. One motif per tool (toolbox, anvil+hammer,
  flame, stamp, corner ruler, drawer cabinet, carving chisel, welding helmet, plus two drawn
  in-house: a horseshoe magnet for ferralk and type slugs in a composing stick for palamedes).
  Marks for tools that join later are appended to the
  sprite in the same construction: 24 grid, two fills plus a 1px outline, square caps. Sprite:
  [packages/family/src/mark-defs.ts](packages/family/src/mark-defs.ts), mounted once via `<MarkDefs/>`;
  class `mark`. **License**: Streamline property, not MIT — see THIRD-PARTY-NOTICES.md.
- **Chrome icons** (chevron, arrow, GitHub, hook, crate, adapter, external, package): line style,
  1.5/24, square caps, class `icon`. `external` marks a link that leaves the site, `package` a
  published package. These cover the family home pages, so they need no icon library:
  `lucide-react` is not used on a family surface. A docs sidebar that still needs more icons
  than the sprite has is a known exception until those icons are drawn here.
- Marks sit on `.markplate` octagons (clip-path `polygon(27% 0, 73% 0, 100% 27%, …)`);
  ledger rows use `.plate` (4.6rem), board 76px, flyout 38px.

## Components

- **SiteHeader**: sticky iron bar, 2px rust bottom rule; lockup (mark + uppercase wordmark),
  `<details>` Tools flyout (grouped Pipeline/Language/Workbench, mini-plates, short jobs), GitHub, `ArdoThemeToggle`. A skip link precedes the header.
  On a sibling site `lockup="project"` puts the project's own mark and wordmark in the brand
  slot — the same construction, so every lockup follows one rule — and the switcher becomes
  the way back to the family: its trigger shows the Ferramenta mark and name, small and soft,
  and the flyout opens with the family site. On a phone the lockup drops to 1.2rem and the
  family trigger to its mark.
- **Ledger rows** (`.row`): hairline-separated, grid `[num | plate | who | proof | meta | go]`;
  big display digits only where sequence is real (pipeline 1-2-3). Proof stays in the successor
  register, followed by compact `Contract` and `Evidence` facts from the registry;
  visible metadata is the live version, registry availability as icon-plus-label pairs
  (crate = Rust core on crates.io, adapter = TypeScript/Node package on npm, or "git only"),
  and maturity. Members with `role: "application"` (palamedes) are products the family
  carries, not libraries it publishes: they show no `Contract` fact — the engines they run on
  are named in `Evidence` — and no registry-availability pair, because the row leads to the
  product's own site rather than to a crate or an adapter. Download counts ride in the fact row; deeper evidence stays with each
  repository (owner boundary). Status stamps are tinted
  fills (`stable` = rust), versions in mono. ≤64rem stacks; ≤40rem drops the arrow column.
- **Pipeline assembly**: a flat dependency drawing above the pipeline ledger, using the existing
  project plates and line-style arrows to show the regex foundation → ferroni → ferriki →
  ferromark → Markdown application. It is horizontal on wide screens and vertical on narrow ones.
  A chamfered, four-screw steel chassis makes the chain feel like one assembled machine without
  turning its stages into separate cards. The nearby prose remains its complete text alternative.
- **Iron band** (beliefs): full-bleed, ember headings left / prose right, hairline rows.
- **Why section**: rust pull-quote (display) with an explicit `Written by` author block in the
  same column, plus prose and goal list (square rust bullets). User-approved addition on top of
  the comp.
- **Partners**: transparent SVG logos on `--paper` carrier plates with a 1px `--line` edge,
  mono link line, and hairline column divider.
- **Closing action**: a flat, ruled return to tool comparison before partner provenance; no new
  material carrier. It carries the family download tally — a mono number in running text,
  never a metric tile.
- **SiteFooter**: iron, lockup + registry-driven columns (Pipeline/Language/Workbench/Company).
- **Buttons**: `.fam-btn-primary` rust with a single chamfered corner (`--chamfer`), one per
  view; `.fam-btn-ghost` 1px heavy outline (iron line and ember on iron). Uppercase display type.

### The landing kit (`ferramenta-family/landing.css`)

The patterns above, plus the ones the sibling home pages grew, as shared components. Every class
is prefixed `fam-`; bare elements are only styled inside `.fam-page` and only through `:where()`,
so a host rule always wins over a kit default. A home page is `.fam-page` with these stacked:

| Component          | Pattern                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| `.fam-page`        | the shop floor: brushed texture, vignette, `--bg`; body type; `overflow-x: clip`                                |
| `ProjectHero`      | poster H1 left, a large mark plate right (or the host's `aside` — the pegboard), ember floor glow, install line |
| `Section`          | ruled H2, intro, optional provenance `note`; `layout="split"` puts the head beside the content                  |
| `IronBand`         | full-bleed iron under a rust rule; ember H3 rows on hairlines; an `.on-iron` context for marks                  |
| `PipelineAssembly` | the chassis on four `Fasteners`; stages link to their sites, `current` stamps this site's step                  |
| `EvidenceFigures`  | mono label, big rust display value, rust left rule, detail and raw measure                                      |
| `CodePanel`        | code on iron under a rust rule, mono caption, `--code-*` colors; scrolls in its own box                         |
| `Ledger` + `Stamp` | coverage rows: display name, status stamp, the sentence behind it                                               |
| `ClosingAction`    | flat, ruled return to the one action; copy and mono link line left, actions right                               |

- **Stamps**: a tinted `--bg-dim` fill with a `--line` hairline, mono uppercase; the settled state
  (`stable`, `covered`) is solid rust. One stamp for the family ledger, coverage ledgers and the
  current assembly step.
- **Evidence figures** show only numbers someone can reproduce; the section's `note` says where
  and when they were measured. Say what is not covered in the ledger as plainly as what is.
- **Code panel** is the iron surface at code scale, not a new material: flat `--iron`, no
  texture, no chamfer. It is focusable so its horizontal scroll is reachable by keyboard.

## Content rules

- The family registry ([packages/family/src/family.ts](packages/family/src/family.ts))
  is the single source of truth: names, jobs, proofs, versions, status, links, grouping.
- Proof column carries only verifiable facts (test counts, parity, benchmarks). No invented
  social proof, stars, or testimonials.
- Tool names are capitalized in prose (Ferroni, Ferrocat, Palamedes); code,
  data, URLs, package names, and crate names stay lowercase. CSS applies
  uppercase where the visual styling calls for it.

## Ardo integration notes

- Custom shell via `export const handle = { chrome: false }` on the route; header/footer are
  route-rendered components.
- `.ferramenta-site main { overflow: visible; padding: 0 }` — Ardo's docs scroll-container
  behavior is disabled for this single-page shell (body scrolls; sticky header works).
- The page ground is painted by `.fam-page`, not by `body`: Ardo's layout `<main>` paints its own
  background over the body, which hid the brushed floor and the warm `--bg` until the kit moved
  the ground onto the page element.
- Scoped reset `:where(.ferramenta-site) *` (margin 0, border-box) replaces the comp's global
  reset (Ardo ships no full preflight). It has zero specificity, so it never takes a tie from the
  kit, the chrome or site.css, whatever the load order.
- `ssr: { noExternal: ["lucide-react"] }` in vite.config — Ardo uses lucide internally; without
  bundling, worktree module resolution escapes to a second React copy during prerender.
- Favicons/social: generated by Ardo from `brand.logo` (baked-color toolbox SVGs in
  [app/assets/brand/](app/assets/brand)).

## Motion & accessibility

- One authored moment: board items shift to rust on hover (no positional lift — plates stay on their hooks); arrows slide 3-4px
  on row hover; assembly stage names turn rust. `prefers-reduced-motion` disables transitions globally.
- Focus: 2px `--focus` outline, offset 2px — rust on the light shop floor, ember on iron surfaces and in dark mode (≥3:1 everywhere). Contrast held in both themes (soft text ≥ 4.5:1).
- The page must never scroll horizontally; wide content scrolls in its own container.

## Sharing & minimum sizes

- Social card: `public/social.png` (1200×630), rendered headless from the world (iron ground,
  pegboard strip with the marks that existed when it was rendered); wired via Ardo `metadata` +
  route-level og/twitter tags. Re-render it when the board's line-up changes.
- Minimum UI text size on the page: 12px (0.75rem) — board/assembly sublabels, fact labels,
  stamps. Nothing below.
- Footer carries a one-line license note (site MIT; tool licenses live in their repositories).
