# Ferramenta design explorations — October 18, 2026

Twenty-eight page designs generated with built-in Imagegen. All three rounds retain a light theme and use Ferromark and Ferroni as their content models.

Open [the overview](index.html) or a round's local gallery. The files are self-contained and do not depend on the image generator's output directory.

| Directory                                                        | Contents                                                                                                                            |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Round 01: Light mechanics](round-01-light-mechanics/index.html) | Ten final homepage PNGs, three earlier variants in `drafts/`, gallery, manifest and complete prompts                                |
| [Round 02: Precision Rust](round-02-precision-rust/index.html)   | Ten new homepage PNGs, gallery, manifest and complete prompts                                                                       |
| [Round 02 assets](round-02-precision-rust/assets/prompts.md)     | Fine brushed steel and sealed oxide texture masters; one transparent precision-flexure illustration                                 |
| [Round 03: Core pages](round-03-core-pages/index.html)           | Four complete pages per project, two meaningful transparent object assets, source copy, benchmark snapshots and linked page viewers |

Each raster has a `.png.json` provenance sidecar. Round 01's generated pixels were copied unchanged from the original local exploration; its gallery and manifest were adapted to the repository's US English language requirement.

## Scope

These files record alternatives for discussion. They do not replace the accepted production design, existing `DESIGN.md`, ADRs, shared components or family registry.

Round 01 explores warm wood, lightweight metal and different page structures. Round 02 emphasizes Rust as the primary runtime and visual identity: fine stainless steel, small fasteners, restrained stabilized oxide, clean surfaces and generous light space.

Round 03 develops the selected bridge and calibration-sheet direction into eight coordinated core pages: overview, Rust entry, core function and benchmarks for each project. Its document register and pattern comparator tie the imagery to what each library does.

## Assets and limits

The homepage PNGs are flat image concepts, not layered design files or implemented pages. Their visible copy, API snippets and generated logos are illustrative; implementation must use the actual repository contracts, registry and approved brand assets.

Round 02's separate material masters and transparent illustration were generated independently for reuse. They are not extracted layers of the homepage PNGs. Texture tile seams have not been processed or verified. The flexure PNG retains its generated alpha channel.

Canonical incumbent textures and icons remain in `design/textures/` and `design/icons/`; this exploration does not modify them.

## Local preview

From this directory:

```sh
python3 -m http.server 48622 --bind 127.0.0.1
```

Then open <http://127.0.0.1:48622/>.
