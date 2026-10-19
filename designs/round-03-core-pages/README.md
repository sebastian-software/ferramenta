# Core-page designs for Ferromark and Ferroni

Eight complete visual page designs generated with built-in Imagegen, developed from the selected round-two Micrometer bridge (11) and Calibration sheet (14). Both projects share a light visual system and use richer editorial content from round one.

Open [the design overview](index.html), then use each project's page navigation or the corresponding-page comparison link.

| Project   | Overview                  | Rust entry                 | Core function                                          | Evidence                                           |
| --------- | ------------------------- | -------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| Ferromark | [21](ferromark-home.html) | [22](ferromark-start.html) | [23: Rendering and metadata](ferromark-rendering.html) | [24: Parser benchmarks](ferromark-benchmarks.html) |
| Ferroni   | [25](ferroni-home.html)   | [26](ferroni-start.html)   | [27: The scanner](ferroni-scanner.html)                | [28: Regex benchmarks](ferroni-benchmarks.html)    |

## Files

- Eight full-page PNG designs, each with an exact prompt and provenance sidecar.
- Two transparent project-object assets in `assets/`, with their prompts and semantic explanation.
- Eight source-backed copy documents in `content/`.
- Frozen measurement snapshots in `evidence/`; these are copied published data, not fresh measurements.
- [Design direction and shared component plan](BRIEF.md), [generation prompt set](prompts.md), and [machine-readable manifest](manifest.json).
- Static overview and page viewers. These link the designs for review; they do not implement the interfaces painted inside the images.

## Meaning of the objects

**Ferromark:** the registration bridge aligns document leaves. Source notation becomes a rendered sheet, while a separate oxide index leaf represents metadata. This connects the selected bridge to document structure and publishing.

**Ferroni:** parallel pattern cassettes feed a scanning carriage. A pointer locates the next matching span on a source ribbon. This connects the first-round engine idea to multi-pattern search and explicit match positions.

The objects are explanatory metaphors, not literal architecture diagrams.

## Evidence and accuracy

The content uses the local project documentation and source files listed per page in `manifest.json`. Ferromark's benchmark copy describes the frozen 50-document five-engine output-agreement subset, dated September 21, 2026. Ferroni's copy describes pairwise steady-reuse results from October 15, 2026 and keeps C compilation and PCRE2 JIT tradeoffs visible.

The readable content files and original repositories are the text/API authority. Image generation may alter individual glyphs, navigation details or small code text; the PNGs are visual design references.

The shared production package, accepted design records, existing product sites and their code are outside this local exploration. No commit is required to review it.

## Design knowledge used

The work uses the existing Ferramenta product and design context, Effective Web's Design Planning route, Frontend Design, Impeccino's new-work guidance and Imagegen's UI-mockup workflow. The scoped [brief](BRIEF.md) records the visual direction and component roles.

## Current homepage revision

The overview and page viewers now use `21-ferromark-home-v2.png` and `25-ferroni-home-v2.png`. They retain the illustrated hero and first example, replacing the lower object-photo rows with substantive prose, technical examples, a measured chart and reference tables. The original homepages remain under their initial filenames and are linked from the viewers.

The six subpage designs, their source copy and viewers, and both object masters are unchanged. [Editorial prompts and copy](homepage-editorial-prompts.md) document this focused revision.

## Current spacing and logo refinement

The current homepages are [Ferromark](../homepages/ferromark.html) and [Ferroni](../homepages/ferroni.html). They use shared HTML/CSS for exact spacing and responsive behavior; the generated v3 spacing studies remain visual history. The six subpage PNGs and all source copy are preserved. [Logos and favicons](../logos/index.html) include transparent masters, PNG sizes, horizontal lockups and 32/48/64px ICO files.
