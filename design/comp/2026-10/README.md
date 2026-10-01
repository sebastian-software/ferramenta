# Direction comps, October 2026

The approved comps of the redesign of ferramenta.dev and the `ferramenta-family`
theme, direction "Typenschild": a precision-tool catalog in black steel, brushed
steel plates and oxidized rust as the one color, with the riveted plate and its
facts on a hanging tag as the one prop. They answer one brief: iron, rust and
craft, robust but professional, one authored color scheme (light with
deliberately dark sections, no theme toggle).

| File                     | What it shows                                 |
| ------------------------ | --------------------------------------------- |
| `typenschild-home.html`  | The family page                               |
| `typenschild-tool.html`  | A tool page (Ferroni)                         |
| `typenschild-icons.html` | Every member's icon at every size, both forms |
| `typenschild.css`        | The direction's stylesheet, on `base.css`     |

## View

```sh
python3 -m http.server 4180 --directory design/comp/2026-10
```

Then open <http://localhost:4180/typenschild-home.html>.

## What they are

Static pages, kept as they were reviewed. They were rendered on 2026-09-30 by a
small generator from the family registry of that day; the generator is not
kept, because the registry and the package's sprite have moved on since and it
could no longer reproduce them. The HTML, the stylesheet and the assets are the
record.

- The plain-language lines per engine, the relations ("runs on", "pairs with")
  and the page copy were the comps' proposal. They have since moved into the
  registry (`what`, `does`, `audience`, `uses`, `pairsWith`).
- Display faces load from Google Fonts here. The site self-hosts Barlow
  Condensed.

## Rounds

Round 1 (2026-09-30) showed three directions: Typenschild, "Cor-Ten"
(architecture in weathering steel on fair-faced concrete, a slab with lettering
cut through) and "Schattenwand" (the shadow board of a workshop, a perforated
board with its pegs). Cor-Ten and Schattenwand were set aside there; their comps
and textures were removed from the tree on 2026-09-30 and are in Git history
before the tag `design-residue-2026-09-30`. Typenschild went on: a quieter
palette on a graphite ground, and a plate that says what the thing is before
where it comes from, with the description and the action on the plate and the
facts on a tag below it.

The comps stay as they were approved. The built system moved on in two places
(ADR-0008, ADR-0009): the graphite ground became dark oak with warm greys
around it, and the flat twin of each icon was dropped for the rendered picture
at a small size.

## Images

The material textures in `assets/` (`steel-dark.webp`, `millscale.webp`,
`rust-dark-tile.webp`) were generated with the Codex CLI image tool on
2026-09-30; each WebP carries its prompt in a `.webp.json` sidecar, and the
prompts are collected in `assets/gen/prompts.md`. `*-tile.webp` files are
mirror-tiled versions of their sources, so they repeat without a seam;
`steel-dark.webp` and `rust-dark-tile.webp` are darkened, flattened derivatives
of the brushed-steel and powder-coat originals. `assets/palamedes.svg` and
`assets/dalo.svg` are the applications' own logos, copied from their
repositories.

Each member has one icon in two forms here. `assets/icon-<member>.webp` is a
rendered object for the plates; `assets/icon-<member>-flat.svg` is the flat
twin the built system later dropped. `typenschild-icons.html` shows all of them
at every size. They were generated from a description of each motif. The
masters and the scripts that build the shipped icons live in
[design/icons/](../../icons/README.md), the textures' in
[design/textures/](../../textures/README.md).

## What became of it

Typenschild is the family's direction ([ADR-0008](../../../docs/adr/0008-design-direction-typenschild.md));
the generated icons replaced the Streamline-derived marks everywhere
([ADR-0009](../../../docs/adr/0009-generated-member-icons.md)). The live system
is [DESIGN.md](../../../DESIGN.md), and every component is on show in the kit
at `/kit`.
