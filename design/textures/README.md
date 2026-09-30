# Textures

The source of the three textures in `packages/family/textures/` (ADR-0008):
brushed steel for the plate, dark oak for the bench the plates lie on, rust for
the closing band.

| Master                       | Becomes      | Prompt                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `masters/steel-brushed.webp` | `steel.webp` | Brushed stainless steel sheet, horizontal grain, fine and even. Cool neutral silver, a soft broad highlight band across the middle. Clean, new, precise.                                                                                                         |
| `masters/oak-dark.webp`      | `oak.webp`   | A workbench top of dark smoked oak, oiled, matte. Wide planks running horizontally with fine, calm, straight grain; deep warm brown, almost espresso, with subtle lighter grain lines; a few faint tool marks. Quiet and even, low contrast, no knots, no gloss. |
| `masters/powdercoat.webp`    | `rust.webp`  | Powder-coated sheet metal in a deep rust orange. Fine, even orange-peel texture, satin finish. Uniform color, very subtle tonal variation.                                                                                                                       |

Shared rules for every image: a flat surface photographed head-on, filling the
whole frame edge to edge; even, soft daylight; no objects, no text, no letters,
no logos, no borders, no vignette, no perspective (for the oak also: no visible
plank ends). The masters were generated on 2026-09-30 with the Codex CLI image
tool.

```sh
sh design/textures/build-textures.sh
```

The script is the record of what each texture gives up to be a ground for
text: the steel loses its saturation and most of its contrast and takes a
little warmth, so it sits with the family's warm greys; the oak is pulled
almost halfway to a near-black brown; and the rust is darkened, desaturated and
mirrored into a seamless tile. Change a texture there, not in an image editor.

The first build used a plate of hot-rolled steel with mill scale as the dark
ground. It was replaced by the oak.
