# Member icons

The source of every icon in `packages/family/icons/`. Each member has one
object in two forms (ADR-0009): a rendered object for plates, and its flat
twin, the same object in the same view in a few solid colors, for every small
place.

| Path                       | What it is                                                                       |
| -------------------------- | -------------------------------------------------------------------------------- |
| `masters/<name>.webp`      | The rendered master, as generated, on a transparent ground                       |
| `masters/<name>-flat.webp` | The flat master, as generated (lossless)                                         |
| `build-icons.sh`           | Masters → `<name>.webp` (640px) and `<name>-256.webp`, trimmed and centered      |
| `trace-flat.py`            | Flat masters → `<name>-flat.svg` and `<name>-flat.webp` (96px), on the palette   |
| `kit-sample/`              | The masters of the kit's invented sample tool; its files go to `app/assets/kit/` |

The masters are the only source the shipped files can be rebuilt from. They
were generated on 2026-09-30 with the Codex CLI image tool. Every raster, master
or shipped, carries its prompt and derivation in a `.webp.json` sidecar beside
it (`impeccable embed-prompt`); a new or replaced raster gets one too.

## Rebuild

```sh
sh design/icons/build-icons.sh
python design/icons/trace-flat.py            # needs opencv-python-headless, numpy, vtracer
```

`build-icons.sh` also copies the family's flat toolbox to
`app/assets/brand/logo-light.svg` and `logo-dark.svg`: the favicon source, and
the image every README's family block loads from `main`.

For an icon that is not a family member's, point both scripts somewhere else:

```sh
ICON_MASTERS=design/icons/kit-sample ICON_OUT=app/assets/kit sh design/icons/build-icons.sh
ICON_MASTERS=design/icons/kit-sample ICON_OUT=app/assets/kit python design/icons/trace-flat.py
```

## A new member's icon

1. Pick one object from the workshop that says what the member does, distinct
   in silhouette from the ones below.
2. Generate the rendered master with the prompt below and an accepted icon
   attached as the style reference (the anvil was the first; every other icon
   was made with it attached).
3. Generate the flat master with the rendered master and an accepted flat icon
   attached (the flame is the reference from the third round on).
4. Save both under `masters/`, run the two scripts, and add the three
   `.fam-icon[data-icon="<name>"]` rules to
   `packages/family/styles/chrome.css`.
5. Look at it on the kit's icon sheet (`/kit#icons`) at every size. It has to
   hold at 24 pixels; nothing in the family shows an icon smaller.

`trace-flat.py` maps a new icon onto the family's palette
(`packages/family/icons/palette.json`). `--derive N` measures a fresh palette
from all flat masters and rewrites that file; do that only when the family's
colors are meant to change.

## The rendered prompt

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

The kit's sample tool (`kit-sample/ferrometro`): a vernier caliper, its jaws
closed on a short bar of orange-hot steel.

## The flat prompt

The same object in the same view and position as the attached rendering, in
the drawing style of the attached flat icon. Every area one uniform solid
color; form shown through a lit, a mid and a shaded plane per part, with thin
light edges between them; anything that glows drawn as nested flat shapes. No
gradients, textures or outlines. Transparent background.

A generated "flat" image is not flat: its areas carry faint mottling and every
edge is a band of in-between colors. `trace-flat.py` cleans each image before
tracing it (a small palette taken from the calm interior of its areas,
boundaries straightened by majority vote, specks removed, whole areas moved
onto the family palette); its header explains each step.

## What was tried and set aside

A relief stamped into steel and an enamel badge, as treatments for the same
motifs. For Ferrolex a try square, a steel-bound dictionary and a loupe; for
Ferralk a horseshoe magnet, a forged asterisk and binoculars. Their originals
are not kept.
