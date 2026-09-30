# Direction comps, October 2026

Three directions for the redesign of ferramenta.dev and the `ferramenta-family`
theme, each shown as the family page and as a tool page (Ferroni). They answer
one brief: iron, rust and craft, robust but professional, one authored color
scheme (light with deliberately dark sections, no theme toggle).

| Direction        | World                                                                                     | The one prop                                  |
| ---------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1 · Typenschild  | Precision-tool catalog: black steel, brushed steel plates, oxidized rust as the one color | The riveted plate, its facts on a hanging tag |
| 2 · Cor-Ten      | Architecture in weathering steel on fair-faced concrete                                   | The slab with lettering cut through           |
| 3 · Schattenwand | The shadow board of a professional workshop                                               | The perforated board with its pegs            |

`Typenschild`, `Cor-Ten` and `Schattenwand` are names in the design vocabulary,
like the earlier `Schmiede`.

## View

```sh
python3 -m http.server 4180 --directory design/comp/2026-10
```

Then open <http://localhost:4180/>. The switch in the lower right corner moves
between the directions and their two pages; it belongs to no design.

## What they are

Static pages, kept as they were reviewed. They were rendered on 2026-09-30 by a
small generator from the family registry of that day; the generator is not
kept, because the registry and the package's sprite have moved on since and it
could no longer reproduce them. The HTML, the stylesheets and the assets are
the record.

- The plain-language lines per engine, the relations ("runs on", "pairs with")
  and the page copy were the comps' proposal. They have since moved into the
  registry (`what`, `does`, `audience`, `uses`, `pairsWith`).
- Display faces load from Google Fonts here. The site self-hosts Barlow
  Condensed.

## Rounds

Round 1 (2026-09-30) showed all three. Cor-Ten and Schattenwand were set aside
there and stay as they were. Typenschild went on: a quieter palette on a
graphite ground, and a plate that says what the thing is before where it comes
from, with the description and the action on the plate and the facts on a tag
below it.

## Images

The material textures in `assets/` were generated with the Codex CLI image tool
on 2026-09-30; each WebP carries its prompt in a `.webp.json` sidecar, and the
prompts are collected in `assets/gen/prompts.md`. The `*-tile.webp` files are
mirror-tiled versions of their sources, so they repeat without a seam.
`steel-dark.webp` and `rust-dark-tile.webp` are darkened, flattened derivatives
of the brushed-steel and powder-coat originals. `assets/palamedes.svg` and
`assets/dalo.svg` are the applications' own logos, copied from their
repositories.

Each member has one icon in two forms. `assets/icon-<member>.webp` is a
rendered object for the plates; `assets/icon-<member>-flat.svg` is its flat
twin. `typenschild-icons.html` shows all of them at every size. They were
generated from a description of each motif, not from the Streamline files. The
masters and the scripts that build the shipped icons now live in
[design/icons/](../../icons/README.md), the textures' in
[design/textures/](../../textures/README.md).

The vector marks the Cor-Ten and Schattenwand comps still show are
Streamline-derived and not MIT; see
[THIRD-PARTY-NOTICES.md](../../../THIRD-PARTY-NOTICES.md).

## What became of it

Typenschild is the family's direction ([ADR-0008](../../../docs/adr/0008-design-direction-typenschild.md));
the generated icons replaced the Streamline-derived marks everywhere
([ADR-0009](../../../docs/adr/0009-generated-member-icons.md)). The live system
is [DESIGN.md](../../../DESIGN.md), and every component is on show in the kit
at `/kit`.
