# Image prompts

Material textures for the 2026-10 redesign comps, generated on 2026-09-30 with
the Codex CLI image tool (`codex exec -m gpt-6-sol`). The originals land here as
PNG and are not committed; the comps use the WebP conversions one level up. Each
WebP carries its prompt in a `.webp.json` sidecar.

Shared rules for every image: a flat surface photographed head-on, filling the
whole frame edge to edge; even, soft daylight; no objects, no text, no letters,
no logos, no borders, no vignette, no perspective.

## corten.png (landscape)

Weathering steel (Cor-Ten) facade panel after several years outdoors. Deep
orange-brown rust with darker umber patches, faint vertical rain streaks, fine
pitted grain. Rich and saturated but natural, matte.

## steel-brushed.png (landscape)

Brushed stainless steel sheet, horizontal grain, fine and even. Cool neutral
silver, a soft broad highlight band across the middle. Clean, new, precise.

## powdercoat.png (square)

Powder-coated sheet metal in a deep rust orange. Fine, even orange-peel
texture, satin finish. Uniform color, very subtle tonal variation.

## millscale.png (landscape)

Hot-rolled steel plate with mill scale. Blue-black to dark graphite, subtle
mottling, a few faint warm rust-brown blooms. Matte, dark, calm.

## panel-grey.png (square)

Powder-coated sheet steel in a light cool grey, the finish of a professional
workshop tool wall. Fine, even texture, satin. Uniform color, no holes, no
seams.

## concrete.png (landscape)

Fair-faced architectural concrete wall, very light cool grey, smooth, with only
faint cloudy tonal variation and a few tiny air pores. Calm and bright.

## icon-\<member\>.png (square, transparent, eight images)

One per engine plus the family: the motif of the member's mark as a rendered
object. The Ferroni icon was generated first, from text alone, and attached as
the style reference for the other seven. None of them was made from a
Streamline file.

A product icon: a realistic, richly detailed miniature object in a slight
three-quarter front view from a little above. Forged blackened steel with worn
bright edges and a few tool marks, brushed steel, warm oiled wood, and one
rust-orange or glowing orange-hot element as the single strong color. Soft
studio lighting, crisp highlights, only a faint contact shadow. Bold, simple
silhouette that stays recognizable at 32 pixels. Transparent background.

| Member     | Object                                                                                 |
| ---------- | -------------------------------------------------------------------------------------- |
| ferramenta | A blackened steel toolbox, handle on top, latch in front, lid in worn rust orange      |
| ferroni    | An anvil with a hammer across its top and a bar of orange-hot steel on its face        |
| ferriki    | A flame rising from a small forged steel fire pot filled with glowing coals            |
| ferromark  | A hand stamp with a turned wooden knob and a steel base whose face glows orange-hot    |
| ferrolex   | Three letterpress type sorts reading A, B, C, the middle one glowing orange-hot        |
| ferrocat   | A blackened steel cabinet with three drawers, fronts in worn rust orange               |
| ferralk    | A round workshop sieve, rim band in worn rust orange, steel parts falling in, grit out |
| ferrugo    | A blackened steel welding helmet whose viewing window reflects an orange glow          |

`process-icons.sh` turns them into `icon-*.webp` one level up.

## flat-\<member\>.png (square, transparent, eight images)

The flat twin of each rendered icon, generated with two images attached: the
rendered icon for the shape, and an accepted flat icon for the style (first the
toolbox, from the third round on the flame). The same object in the same view
and position; every area one uniform solid color; form shown through a lit, a
mid and a shaded plane per part with thin light edges between them; anything
that glows drawn as nested flat shapes. No gradients, textures or outlines.

`trace-flat.py` cleans each image (a small palette taken from the calm interior
of its areas, boundaries straightened by majority vote, specks removed) and
traces it into `icon-*-flat.svg` one level up. It needs a Python with `vtracer`,
`opencv-python-headless` and `numpy`.

Earlier rounds tried other treatments for the same motifs: a relief stamped
into steel, an enamel badge; for Ferrolex a try square, a steel-bound
dictionary and a loupe; for Ferralk a horseshoe magnet, a forged asterisk and
binoculars. All were set aside; their originals are not kept in the
repository.
