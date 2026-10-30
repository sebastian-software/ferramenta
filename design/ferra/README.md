# Ferra design sources

Ferra is the warm, light design system for Ferramenta and its engines.
This directory holds only the final design inputs: assets, typography, tokens,
page copy and the generators for the shared package and HTML previews.

## Build

Run from the repository root with ImageMagick available:

```sh
node design/ferra/build-assets.mjs
pnpm build:package
node design/ferra/build-previews.mjs
```

To export only newly added or revised products, pass their registry names:

```sh
node design/ferra/build-assets.mjs ferrolink ferrigura
```

Other products keep their existing raster bytes. Both package entries use the
new members' Ferra marks; `compatibilityIcon` in the manifest enables the
original chrome's three export sizes from the same master.

Open the [final pages](../../designs/README.md). The previews resolve styles and
assets directly from the shared package. They do not copy the package or depend
on earlier studies. `preview.css` contains document navigation and specimen
framing; `family-preview.css` preserves the family's authored composition.

## Sources

- `tokens.json` generates the scoped CSS contract and exported JSON. Components
  use semantic roles; palette, type and spacing scales remain available.
- `masters/` holds compact marks and functional hero instruments for every engine and
  two material textures. Adjacent sidecars preserve the generation brief or
  exact prompt, hashes, renderer, and original creation context. Historical
  reference filenames in those records are provenance, not build dependencies.
- `manifest.json` records the meaning of each instrument. Instruments explain
  the work of their engine; Ferramenta's register represents independent tools.
- `fonts/` holds IBM Plex Sans Semibold WOFF2 and its SIL Open Font License,
  copied unchanged from the official upstream revision pinned in the manifest.
  The exporter verifies both hashes. Body text uses system UI; code uses the
  system monospace stack. No network or font installation is required.
- `content/` and `pages.json` hold the final authored copy and page inventory.
  Engine names, roles, descriptions and destinations come from the shared
  registry. The two files in `evidence/` retain the benchmark snapshots cited by
  the product pages, with dates and conditions attached.

The exporter normalizes transparent mark padding, produces PNG and lossless
WebP marks, 32/48/64px ICOs and Apple touch icons, and optimizes instruments and
textures. `FerraLogo` uses a rendered mark beside live type. There is no retained
alternate typography or baked-in wordmark. Each exported raster records its
original brief or prompt and source/output hashes. Never edit a generated package asset.

The workshop SVGs are copied byte for byte from `app/assets/logos/`. Their
sidecars identify the originals; their colors and flat light ground are part of
the component contract. Update a master and its provenance together, rebuild,
and inspect the actual component at `/kit/ferra/`.

See [ADR-0010](../../docs/adr/0010-ferra-design-system.md) and the
[consumer guide](../../packages/family/FERRA.md).

## Editable Blender scenes

All ten compact family marks and all ten hero instruments are modeled in Blender.
Their native scenes use the shared `blender/studio.py` for
metallic materials, orthographic framing, directional softboxes, fine linear
brushing, and AgX color management. `blender/family_marks.py` reconstructs the
family motifs with polished faces, rounded rims, and restrained changes
of plane. Each has a small named entry script and its own editable `.blend` file.
A restrained metallic thin film uses Blender 5's
conductor support for the copper oxide; it introduces no rainbow accent.
Ferrolink's script checks closed meshes,
surface intersections, conservative bar clearance, and the Gauss linking
number before rendering. These checks distinguish a real chain from overlapping
or welded-looking loops.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background \
  --python design/ferra/blender/family_marks.py
/Applications/Blender.app/Contents/MacOS/Blender --background \
  --python design/ferra/blender/ferrolink.py
/Applications/Blender.app/Contents/MacOS/Blender --background \
  --python design/ferra/blender/ferrigura.py
/Applications/Blender.app/Contents/MacOS/Blender --background \
  --python design/ferra/blender/hero_instruments.py
node design/ferra/build-assets.mjs
```

The editable scenes are named `blender/<product>.blend`; their corresponding
Python files reproduce the construction. For example, run `blender/ferroni.py`
instead of the batch script to rebuild only Ferroni. Sidecars hash the entry
script, shared construction when used, and studio source, and retain geometric
checks for closed, nonempty bodies. Machined openings are also checked to remove
material. Add `-- --draft` to render quick mark previews into
`.impeccable/review/` without replacing the masters. The eight original raster
marks and their exact prompts remain in `concepts/<product>/pre-blender-mark.png`
as form references. Use the same materials and lighting when modeling
additional mechanical instruments. Judge compact marks at 32, 48, and 64px in
the kit: their visible mass should fill a roughly square or circular envelope.
Ferrolink uses rounded-square links for its mark and longer links only in its
separate continuity bench.

Ferrigura's hierarchy develops the supplied UML-style reference into one large
rectangular copper parent above two larger steel children: a square on the left
and a circle on the right, joined by one continuous orthogonal graphite bus.
Their outlines distinguish the children without letters or small markings.
The built-in Imagegen tool developed the initial material concept using
Ferrolink as a reference, then the design was rebuilt and simplified as closed
Blender meshes. The initial supplied reference, concept and exact generation
prompt are retained in `concepts/ferrigura/hierarchy-reference.jpg`,
`hierarchy.png` and their sidecars. Broad crowned faces, rolling bevels and
short exposed rails carry studio reflections without additional mechanical
detail. The shipped mark is the native Cycles render, not the concept bitmap.

Ferralk's compact mark uses a substantial file folder and a large six-armed
copper wildcard. This expresses glob-based file matching and separates its
silhouette from Ferrigura's connected diagram nodes. The Imagegen concept and
exact prompt live in `concepts/ferralk/wildcard-folder.png` and its sidecar.
Ferrigura's rectangular parent, square child and circular child occupy a roughly
square envelope. Their simple one-to-two topology and substantial shared bus
remain clear at small icon sizes.

## Homepage instrument reconstructions

`blender/hero_instruments.py` reconstructs the nine original Imagegen hero
concepts as detailed mechanical instruments. Each has a named entry and editable
scene in `blender/heroes/<product>.py` and `.blend`. Ferrolink retains its existing
two-scene construction in `blender/ferrolink.py`.

`hero_geometry.py` owns solid modeling, machining and materials;
`hero_forms.py` owns the nine instrument assemblies. The second Blender pass
uses deeper book-like cassettes, low machined mounting plates, large scanner
yokes and transverse theme heads, and recessed oxide letter inlays. Its procedural
dark red-brown finish separates granular rust islands from dull oxidized metal,
with burnt oxide rims, pitted normal relief, coarse and fine grain, and varying
roughness. This procedural material follows the supplied weathered-rust reference;
it does not use the reference photograph as a texture. Object-space coordinates
keep grain consistent across broad faces and narrow bands. Mounting plates have
rounded corners in plan, a narrow edge break, planar side walls and true recessed
socket fasteners. Ferramenta retains the original concept's front registration
slot and bent edge clamp. A small color lift
brightens the approved corrosion pattern without changing its relief or roughness.
Ferriki's output includes muted green and blue enamel. Ferrugo has deep ivory
document housings and a visibly turned source assembly. Ferrigura uses a slatted
conveyor with one incoming belt, a diamond-shaped sorting switch and two output
belts carrying square and round billets. Its low transport beds preserve the
approved roller and sorting planes, with the support shoes fitted underneath.
Ferromark and Ferralk retain their
approved construction with the adjusted oxide finish.

The first Blender images and sidecars are retained as
`concepts/<product>/first-blender-instrument.png` and `.webp`. Native first-pass
scenes and the original construction source are in `blender/revisions/`.
The approved plate constructions also retain their exact shared source in
`blender/revisions/hero-forms-approved-plates.py`; their master sidecars reference
that snapshot while Ferrigura's slimmer bed uses the current construction source.

The retained references are `concepts/<product>/pre-blender-instrument.png` and
`.webp`, with their prompts and source/output hashes. They are immutable visual
references for the original geometry and purpose, not textures on the new models.
The native reconstructions use separate parts, keyed seats, bored bearings,
engraved line work, actual hex sockets, knurled adjusters, and a helical preview
lead screw. These are large illustrations; their small functional details are
deliberate and independent of the simpler compact marks.

Each evaluated mesh is checked for a closed, nonempty solid. Boolean cuts must
remove material while leaving the body intact. Those checks do not claim that
every assembly contact is collision-free. Sidecars record the entry, shared
construction, crowned-face helper and studio hashes, plus the original concept.

Rebuild one instrument without touching its compact mark:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background \
  --python design/ferra/blender/heroes/ferroni.py
node design/ferra/build-assets.mjs ferroni
```

To update only a large instrument and preserve all mark and texture exports:

```sh
node design/ferra/build-assets.mjs --instruments-only ferrigura
```

For a draft, append `-- --draft`; previews go to
`.impeccable/review/blender-heroes/`. Final masters are 2400×1200px Cycles renders
with transparent backgrounds. The package exporter supplies the actual homepage
WebP assets. `/kit/ferra/instruments/` compares the retained references with those
current package assets. The desktop comparison has three columns: original,
Blender 1, and Blender 2. Narrow screens stack all three revisions per instrument.
