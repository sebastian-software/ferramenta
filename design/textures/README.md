# Textures

The source of the three textures in `packages/family/textures/` (ADR-0008):
brushed steel for the plate, black steel for the first viewport and the dark
bands, rust for the closing band.

| Master                       | Becomes            | Prompt                                                                                                                                                   |
| ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `masters/steel-brushed.webp` | `steel.webp`       | Brushed stainless steel sheet, horizontal grain, fine and even. Cool neutral silver, a soft broad highlight band across the middle. Clean, new, precise. |
| `masters/millscale.webp`     | `black-steel.webp` | Hot-rolled steel plate with mill scale. Blue-black to dark graphite, subtle mottling, a few faint warm rust-brown blooms. Matte, dark, calm.             |
| `masters/powdercoat.webp`    | `rust.webp`        | Powder-coated sheet metal in a deep rust orange. Fine, even orange-peel texture, satin finish. Uniform color, very subtle tonal variation.               |

Shared rules for every image: a flat surface photographed head-on, filling the
whole frame edge to edge; even, soft daylight; no objects, no text, no letters,
no logos, no borders, no vignette, no perspective. The masters were generated on
2026-09-30 with the Codex CLI image tool.

```sh
sh design/textures/build-textures.sh
```

The script is the record of what each texture gives up to be a ground for
text: the steel loses its saturation and most of its contrast, the mill scale is
pulled almost to the chrome's near-black, and the rust is darkened,
desaturated and mirrored into a seamless tile. Change a texture there, not in
an image editor.
