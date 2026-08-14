# Ferramenta — Design System

Ground truth: the built site ([app/styles/site.css](app/styles/site.css), components in
[app/components/](app/components)). Approved comp: [design/comp/entwurf-c.html](design/comp/entwurf-c.html)
(direction "C · Schmiede", chosen from three intensity drafts). This file describes the system
as built; extraction into `@ferramenta/family` follows this document.

## World in one sentence

A hardware store: a light brushed-steel shop floor between two dark iron bands, where the
family's tools hang as duotone metal badges on real hooks — poster-scale condensed type,
rust as the structural color, zero border-radius, chamfers instead of rounding.

## Color tokens (OKLCH, light / `.dark`)

Defined on `:root`, overridden on `:root.dark` (Ardo's `ArdoRootLayout` theme bootstrap
sets `.dark` on `<html>`; storage key `ardo-theme`).

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | 0.975 0.005 80 | 0.195 0.008 48 | page ground (under brush texture) |
| `--bg-dim` | 0.945 0.008 78 | 0.23 0.011 48 | hover fills, board ground |
| `--ink` / `--ink-soft` | 0.21 / 0.42 | 0.94 / 0.71 | text |
| `--rust` / `--rust-deep` | 0.5 0.132 38 / 0.41 | 0.69 0.14 45 / 0.6 | brand accent, primary action |
| `--ember` | 0.68 0.175 52 | 0.75 0.16 55 | glow, iron-band headings |
| `--line` / `--line-heavy` | 0.86 / 0.28 | 0.31 / 0.85 | hairlines / heavy rules |
| `--iron`, `--iron-2`, `--iron-ink`, `--iron-soft`, `--iron-line` | dark band palette | darker variants | header, beliefs band, footer, flyout |
| `--duo0…--duo2`, `--duoink` | tint ramp + outline | dark ramp + light outline | duotone marks; dark set also on iron contexts (header/footer lockups, flyout) |
| `--plate-rim-*`, `--plate-face-*`, `--plate-sheen`, `--plate-brush`, `--plate-shadow` | warm steel | gunmetal | octagon plate material |
| `--hook-dark`, `--hook-light`, `--hook-hole` | burnished | bright metal | pegboard hooks |
| `--paper` | 0.985 0.004 85 | (unchanged) | partner-logo carrier plates |

Rules: rust is structural (rules, stamps, primary action), never a scattered accent.
Ember is reserved for glow and headings on iron. No grays for secondary text on colored
surfaces — tinted tokens only.

## Typography

- **Display**: Big Shoulders (variable, self-hosted `app/assets/fonts/big-shoulders.woff2`,
  weight 800, uppercase, `line-height 0.98`). All headings, tool names, buttons, board labels.
  H1 `clamp(3.4rem, 9vw, 6rem)`; section H2 `clamp(2.3rem, 4.6vw, 3.4rem)` with a 3px
  `--line-heavy` bottom rule.
- **Body**: `system-ui` stack, 1.0625rem, line-height 1.6.
- **Mono**: system mono stack (`ui-monospace…`), only for measured values: versions,
  registries, partner URLs, the signature. Never as a "technical" costume.
- No eyebrows/kickers. Headings carry their own weight.

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

The plates and hooks are the only "physical" objects; everything else stays flat. Do not
extend the material to buttons or cards.

## The 28px module (pegboard)

The board's hole grid is a 28px tile (`background-size: 28px 28px`, dots offset 14px).
Everything on the board is a multiple: padding 42px (desktop) / 14px (mobile), cells
112×140px, gaps 28px → every hook hole lands exactly on a wall hole (verified 0.0px
offsets, desktop and mobile). Change board geometry only in multiples of 28, keeping
padding ≡ 14 (mod 28).

## Iconography

- **Project marks**: duotone, 24-grid, derived from Streamline (Duotone set) — recolored to
  the `--duo*` ramp, caps/joins forced square/miter. One motif per tool (toolbox, anvil+hammer,
  flame, stamp, corner ruler, drawer cabinet, carving chisel, welding helmet). Sprite:
  [app/components/mark-defs.ts](app/components/mark-defs.ts), mounted once via `<MarkDefs/>`;
  class `mark`. **License**: Streamline property, not MIT — see THIRD-PARTY-NOTICES.md.
- **Chrome icons** (chevron, arrow, GitHub, hook): line style, 1.5/24, square caps, class `icon`.
- Marks sit on `.markplate` octagons (clip-path `polygon(27% 0, 73% 0, 100% 27%, …)`);
  ledger rows use `.plate` (4.6rem), board 76px, flyout 38px.

## Components

- **SiteHeader**: sticky iron bar, 2px rust bottom rule; lockup (mark + uppercase wordmark),
  `<details>` Tools flyout (7 tools, mini-plates, short jobs), GitHub, `ArdoThemeToggle`.
- **Ledger rows** (`.row`): hairline-separated, grid `[num | plate | who | proof | meta | go]`;
  big display digits only where sequence is real (pipeline 1-2-3); status stamps are tinted
  fills (`stable` = rust), versions in mono. ≤64rem stacks; ≤40rem drops the arrow column.
- **Iron band** (beliefs): full-bleed, ember headings left / prose right, hairline rows.
- **Why section**: rust pull-quote (display) + prose + goal list (square rust bullets) +
  mono signature. User-approved addition on top of the comp.
- **Partners**: logos on `--paper` carrier plates, mono link line, hairline column divider.
- **SiteFooter**: iron, lockup + registry-driven columns (Pipeline/Language/Workbench/Company).
- **Buttons**: `.btn.primary` rust with single chamfered corner (`.chamfer` clip-path);
  `.btn.ghost` 1px heavy outline. Uppercase display type.

## Content rules

- The family registry ([packages/ardo-config/src/family.ts](packages/ardo-config/src/family.ts))
  is the single source of truth: names, jobs, proofs, versions, status, links, grouping.
- Proof column carries only verifiable facts (test counts, parity, benchmarks). No invented
  social proof, stars, or testimonials.
- Tool names always lowercase in code/data; uppercase is applied by CSS.

## Ardo integration notes

- Custom shell via `export const handle = { chrome: false }` on the route; header/footer are
  route-rendered components.
- `.ferramenta-site main { overflow: visible; padding: 0 }` — Ardo's docs scroll-container
  behavior is disabled for this single-page shell (body scrolls; sticky header works).
- Scoped reset `.ferramenta-site * { margin: 0; box-sizing: border-box }` replaces the comp's
  global reset (Ardo ships no full preflight); it must stay first in the cascade.
- `ssr: { noExternal: ["lucide-react"] }` in vite.config — Ardo uses lucide internally; without
  bundling, worktree module resolution escapes to a second React copy during prerender.
- Favicons/social: generated by Ardo from `brand.logo` (baked-color toolbox SVGs in
  [app/assets/brand/](app/assets/brand)).

## Motion & accessibility

- One authored moment: board items lift 2px on hover (color shift to rust); arrows slide 3-4px
  on row hover. `prefers-reduced-motion` disables transitions globally.
- Focus: 2px `--ember` outline, offset 2px. Contrast held in both themes (soft text ≥ 4.5:1).
- The page must never scroll horizontally; wide content scrolls in its own container.
