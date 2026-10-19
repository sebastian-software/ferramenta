# Round 04: whole-page design directions

This round returns to raster design exploration with built-in Imagegen after the local HTML refinements became too incremental. The two HTML baselines have their decorative section backgrounds removed. Production sites and the six approved subpage images are outside this round.

## Retained commitments

- Light theme only; warm, precise, refined mechanical identity.
- The meaningful document-register instrument for Ferromark and pattern-comparator instrument for Ferroni.
- One substantial object illustration in the hero; real editorial content below it.
- Generous whitespace and column gutters, with readable tables and prose.
- Existing product symbols, Rust entry points and source-backed evidence.

## Rejected treatments

No decorative section backgrounds, full-width material strips, gradients on reading grounds, wave/diagonal bands, blurred fade-outs or dark sections. This round must earn variety through the complete composition, hierarchy and content form. A different background color is not a design direction.

## Three coherent directions

### Editorial folio

A spacious technical magazine with an asymmetric editorial hierarchy and tables treated as publication typography.

Build the page like a carefully art-directed technical magazine, with ONE large mechanical hero at the upper right and an expressive but light regular-width grotesk product title on the left. After the hero, deliberately vary the composition: an opening feature taking about seven columns plus a narrow, lower-starting factual side note; a full-width measured figure; then a broad text story with a compact open policy ledger as its companion. Use different spans and vertical alignments; do not repeat rows of two equal columns.
Table design is editorial: left-aligned natural-language labels, numeric columns aligned on decimals, real units in headings, very generous row leading, a small caption and a plain provenance note below. No enclosing box, header fill, zebra stripes or vertical gridlines. Use only a few short functional column rules if needed. The Ferromark policy comparison should read like a publication's two clear policy cases. The Ferroni feature comparison should read like a quiet index of capabilities; its benchmark table is a separate measured figure. Prose and figure captions must have distinct hierarchy. The closing install action is part of the final story, not a big empty CTA band. One regular humanist grotesk family for navigation, article text, headlines and data; real monospaced code only. This should feel like a coherent premium journal about precision tools, with richer content and confident empty space.

### Working specimen

A precision handbook whose worked examples organize the page, with annotated technical data rather than generic dashboard tables.

Make the complete homepage feel like a beautifully typeset practical instrument handbook. The hero keeps the large product title and the reference metal object, but is shallower than the editorial folio, so the first working specimen appears early. After it, compose two or three large worked figures at DIFFERENT widths, separated by real reading paragraphs and compact margin annotations. A narrow left text rail carries meaningful section titles such as Rendering, Output policy, Measurements, or Compatibility, Scanner, Measurements; never decorative numbers. The specimen itself is the layout's anchor: source and output have a carefully aligned baseline, with a restrained mechanical annotation in oxide showing the meaningful transformation or next-match location. This is flat, readable typesetting on white, not a dashboard of cards.
Reinvent the tables as specimen ledgers: visually group a field label, its concrete example and the relevant constraint. For Ferroni's scanner, use an aligned three-step byte-position ledger alongside the source line, clearly preserving all pattern indexes and byte ranges; for the feature matrix, give the feature names ample space and align compact Yes/No columns. For Ferromark, let the Rust and Node.js output policies form two readable three-column cases. The benchmark presentation must still preserve its denominator, dates and caveats. No spreadsheet grid, shaded header, zebra stripes, many outline boxes or chip cloud. A very clear regular-width engineering sans, slightly narrower low-weight headings, and compact mono only in executable specimens create the character. The precision comes from alignment and useful annotation, not texture, grids over the page or decorative fine rules. Use a wide closing note and a modest installation line.

### Measured narrative

A warmer, type-led editorial page with broad reading passages and evidence presented as a designed spread.

Develop a striking but restrained long-form editorial homepage with a different center of gravity: a generous product title/one-line purpose across the upper page, the reference instrument composed in a quieter asymmetric upper-right position, then a substantial reading lead, not a sequence of feature rows. Use a low-contrast, robust text serif similar to Charter ONLY for the long-form prose; use a light industrial grotesk for project names, navigation, headings and all tables/data; keep code monospaced. Avoid a high-contrast display serif or a beige lifestyle brand.
The primary compositional moment below the hero is a broad EVIDENCE SPREAD: a compact title column, a spacious data figure taking the wider part, and a provenance footnote below, with plenty of white around it. Ferromark's throughput data can use a sparse horizontal scale integrated into the numeric table; Ferroni's comparator/platform table should give each platform a clear group and keep the two pairwise rows distinct. Keep the values moderate in size, never a giant speed-up badge. A following short essay and a worked example use a new alignment and unequal widths. Let the final output-policy or compatibility reference become an elegant open table with wide semantic columns, clearly linked to the nearby prose. No repeated 50/50 article/table blocks. Tables and captions should look authored for the page: hierarchy through weight, alignment, row spacing and units, no default gray table kit. The page should be warm, light, technical and durable, with an editorial voice and purposeful contrast between reading and measuring.

## Paired execution

First generate one Ferromark homepage for each direction, using the existing instrument and product symbol as references. Then generate the matching Ferroni page using the Ferromark comp as that direction's sibling style/composition reference plus Ferroni's own instrument and symbol. There are six complete page comps; each family is considered together.

These are whole-page visual concepts, not implementations of the painted interfaces. The exact prompts and references are recorded beside each output; readable source content is in `content/`. Generated small glyphs are not an API or numerical authority.

## Content accuracy

The full round-three source copy is retained in this folder. The image prompts use a shorter representative selection while preserving important defaults and caveats. Frozen measurements are copied from round 03; no new benchmark was run.

Ferromark: the fresh throughput agreement subset has 50 documents from 57; v2 baseline 1.00, v1 0.48, pulldown-cmark 0.38, md4c 0.29 and Bun native 0.17. Rust raw-HTML passthrough differs from the Node.js untrusted defaults. Front matter is raw text; hooks must escape untrusted values.

Ferroni: scanner results retain the actual pattern indexes and byte ranges; UTF-16 is an explicit method family. The steady-reuse comparator rows remain pairwise: C Oniguruma 3.44×/2.75× and PCRE2 JIT 0.70×/0.63× on macOS ARM64/Linux x86-64. C compilation and PCRE2 JIT tradeoffs remain visible.

## Scope and review

All files are local in `ferramenta/designs/round-04-design-directions`, uncommitted. The gallery lets the two products be compared within each direction. Choose a whole direction before implementation resumes. Imagegen, Frontend Design and Effective Web's design-planning guidance informed the brief.
