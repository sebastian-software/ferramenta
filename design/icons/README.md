# Member icons

The source of every icon in `packages/family/icons/`. Each member has one
object (ADR-0009), shown as a rendered picture at three sizes: on a hero plate,
on a catalog plate, and small in the chrome.

| Path                  | What it is                                                                        |
| --------------------- | --------------------------------------------------------------------------------- |
| `masters/<name>.webp` | The master, as generated, on a transparent ground                                 |
| `build-icons.sh`      | Masters → `<name>.webp` (640px), `-256.webp` and `-96.webp`, trimmed and centered |
| `kit-sample/`         | The master of the kit's invented sample tool; its files go to `app/assets/kit/`   |

The masters are the only source the shipped files can be rebuilt from. They
were generated on 2026-09-30 with the Codex CLI image tool. Every raster, master
or shipped, carries its prompt and derivation in a `.webp.json` sidecar beside
it (`impeccable embed-prompt`); a new or replaced raster gets one too.

## Rebuild

```sh
sh design/icons/build-icons.sh
```

The script also writes the site's brand mark, `app/assets/brand/logo-light.svg`
and `logo-dark.svg`: the favicon source, and the image every README's family
block loads from `main`. Both want an SVG at that path, so the mark is the
rendered toolbox at 144px inside an SVG frame. It is a picture, not a drawing;
a mark that scales cleanly is open (ADR-0009).

For an icon that is not a family member's, point the script somewhere else:

```sh
ICON_MASTERS=design/icons/kit-sample ICON_OUT=app/assets/kit sh design/icons/build-icons.sh
```

## A new member's icon

1. Pick one object from the workshop that says what the member does, distinct
   in silhouette from the ones below.
2. Generate the master with the prompt below and an accepted icon attached as
   the style reference (the anvil was the first; every other icon was made with
   it attached).
3. Save it under `masters/`, run the script, give the master and the shipped
   files their provenance sidecars, and add the three
   `.fam-icon[data-icon="<name>"]` rules to
   `packages/family/styles/chrome.css`.
4. Look at it on the kit's icon sheet (`/kit#icons`) at every size. It has to
   hold at 24 pixels; nothing in the family shows an icon smaller.

## The prompt

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

## What was tried and set aside

A flat twin of every object, for small places: a second generated master,
redrawn as an SVG of under 5 KB on a shared palette. At that size the redraws
were too crude to stand beside the rendered objects, and they were dropped for
the rendered picture at a small size (ADR-0009). A vector mark, if one is ever
wanted, starts from a new drawing.

A relief stamped into steel and an enamel badge, as treatments for the same
motifs. For Ferrolex a try square, a steel-bound dictionary and a loupe; for
Ferralk a horseshoe magnet, a forged asterisk and binoculars. Their originals
are not kept.
