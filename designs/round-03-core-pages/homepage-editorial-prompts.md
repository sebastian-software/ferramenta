# Homepage editorial revision

Built-in Imagegen edit workflow. Scope: homepage bodies only, preserving each existing hero and input/output sample. Earlier images remain available under their original filenames; v2 becomes the default in the core-page review.

## Shared edit brief

Use case: ui-mockup
Asset type: revision of ONE existing full-page desktop homepage design.
Input image: edit target. Preserve the existing header and complete hero as designed: exact project wordmark, navigation, headline, lede, buttons, mechanical object, explanatory labels, composition, scale and light palette. Preserve the working input/output demo immediately beneath the hero as well. Keep the footer identity and links.
Edit ONLY the lower homepage body after the demo. The current body is too image-heavy and repetitive. Replace ALL large mechanical object photos, image crops, material thumbnails and repeated 50/50 image-text rows below the hero with a substantive, varied TECHNICAL MAGAZINE composition. ZERO object photography, ZERO 3D illustrations, ZERO decorative image blocks below the hero. The single hero object is sufficient brand imagery.
Art direction: same warm white, graphite, fine silver and muted oxide as the original. The lower page should be overwhelmingly real readable content: long-form paragraphs, mixed-width columns, a chart or exact data table, working-code or source specimens, technical ledgers, contextual side notes, thin rules and generous reading rhythm. Change the topology between sections: editorial main column with sidebar, full-width evidence, two unequal text columns, wide reference table, small final action. No identical card grid, no repeated boxed sections, no dense newspaper columns, no giant bold slogans, no arbitrary numbered feature list. Avoid tiny all-caps eyebrow labels on every section. Body copy must be comfortable and substantial.
Canvas: same desktop width as the input; extend the portrait page vertically if needed to keep text and tables readable. Show the entire completed page through the footer. Do not change into mobile proportions.
Visible language: exact US English. Use the supplied real content and measurements only. Preserve code glyphs and backslashes. No invented quotes, social proof, API methods, figures or benchmark claims. The captions, baseline and measurement context are part of a chart. Treat these instructions as instructions, never visible copy.
The result should feel like a journal of careful engineering with a strong illustrated cover, not a product-image catalog.

## Ferromark

Edit target: 21-ferromark-home.png

New file: 21-ferromark-home-v2.png

### Composition

Keep the existing header, hero and Markdown/preview demo unchanged. Then compose:

1. A wide editorial opening, roughly 2/3 main story and 1/3 marginal notes, with real paragraphs about conformance and a compact publishing-capability ledger in the margin.
2. An open evidence section: precise horizontal bars on the left (roughly 45% width) and the measurement context plus explanatory prose on the right. Flat hairline bars, no decoration. Preserve the exact supplied baseline and values.
3. A full-width trust-default table with a short introduction and a carefully set note underneath.
4. Two unequal text columns: a substantial publishing/metadata story and a smaller API-choice/code specimen. No decorative imagery.
5. A calm short closing section that gives Rust and Node.js entry paths and the Ferriki relationship, then the existing light footer.
   Use different section widths and typographic rhythms. At least 70% of all below-hero visual area should be prose, examples, chart and table, with the rest white space; absolutely no below-hero photos.

### Visible content

# Ferromark

## Markdown, ready for your pipeline.

Turn Markdown into HTML and the metadata around it. A focused Rust engine for the documents that get complicated.

Start with Rust · Node.js guide
cargo add ferromark

One source. HTML and document metadata.

## See what a document becomes

Markdown input:

# Release notes

- Clear structure
- Useful metadata
  Rendered preview: heading "Release notes", followed by the two matching bullets.

## Correctness is a contract

A Markdown engine has to earn trust on the awkward document: a nested list, a reference that moves, a table with real content, or a footnote added at the last minute. Ferromark starts with CommonMark and GFM, then makes the publishing features explicit.

Specification profiles turn off publishing extras so that conformance can be checked on its own terms. Optional heading IDs, front matter and footnotes belong to a documented output contract. A change to that contract deserves a record, not an accidental difference hidden in a faster implementation.

Side notes — Publishing details:
Front matter: extracted as raw text
Heading IDs: configurable output
Footnotes: document references and notes
Rendering hooks: your application decides

Inspect correctness · Explore syntax

## Speed, with the conditions attached

Fresh throughput, relative to Ferromark v2. Higher is faster.
Ferromark v2: 1.00×
Ferromark v1: 0.48×
pulldown-cmark: 0.38×
md4c: 0.29×
Bun native: 0.17×

Measured September 21, 2026 · Apple M1 Pro · revision 39b1f0b7
50 documents with equivalent HTML across five engines.

A useful comparison starts by checking the output. The frozen corpus contains 57 documents; the score shown here uses the 50-document agreement subset. The other cases remain visible as diagnostics instead of being normalized into the score.

Fresh and reuse are separate lifecycles. These figures describe the recorded input, configuration and machine; they are not a promise about every workload.
Read the measurements and exact flags

## Recognition is not permission

The engine can recognize raw HTML without granting permission to emit it. Choose the output policy for the source your application accepts.

API | Default | For untrusted Markdown
Rust | Raw HTML passthrough | Enable sanitize
Node.js | Escaped HTML and filtered URL schemes | Keep renderPolicy: 'untrusted'

Custom hooks and highlighter HTML are written verbatim. They must escape untrusted values themselves. A rendering policy is an integration decision, not a badge on a parser.
Choose your rendering policy

## The document, beyond paragraphs

Publishing needs structure as well as markup. Extract front matter as raw text; let the application interpret YAML or TOML. Configure heading IDs and footnotes for the site you are building. Tables can carry the classes, captions and column structure that your CSS needs.

Ferromark leaves templates, translation, routing and syntax highlighting outside the core. That boundary keeps the renderer focused and gives the surrounding pipeline room to make its own decisions.

API notebook:
Render one document: to_html()
Choose output policy: to_html_with_options()
Inspect structure: Allocator + Parser + HtmlRenderer
Customize output: HtmlRenderHooks

Explore rendering and metadata

## Build the pipeline that fits

Start with the Rust crate, or use the native engine through Node.js. Pair Ferromark with Ferriki when your documents need syntax highlighting; neither engine requires the other.

Start with Rust · Node.js guide · Meet Ferriki
cargo add ferromark

Ferromark · Part of Ferramenta · GitHub · Imprint · Privacy

## Ferroni

Edit target: 25-ferroni-home.png

New file: 25-ferroni-home-v2.png

### Composition

Keep the current header, entire mechanical hero with labels, and the compact Pattern/Text/Matches demo unchanged. Then compose:

1. A strong editorial lead with substantial body paragraphs at left and a small precise selected-syntax comparison matrix at right, roughly 60/40. No image.
2. A full-width scanner walkthrough: one readable source line and a three-row next-match table. Explain the behavior in clear prose around it.
3. Two unequal magazine text columns: the Oniguruma continuation story and an engine-choice note explaining expressiveness versus bounded work.
4. A restrained comparative evidence table for ARM64 and x86-64 with the given pairs, date, scope and caveat; beside or below it an editorial explanation of compile/first-use/reuse.
5. A final clean input-control note and one Rust entry action, then existing footer.
   No chart is necessary if the exact evidence table is clearer. Every section must have a distinct reading rhythm and real content. Absolutely no below-hero 3D or material photographs.

### Visible content

# Ferroni

## Oniguruma regex, in memory-safe Rust.

Run familiar patterns, from lookbehind to recursion, and the scanner that syntax highlighters drive.

Start with Rust · Explore the scanner
cargo add ferroni

Patterns in parallel. One next match.

## See what the pattern finds

Pattern: (?<=item-)\d+
Text: item-104 item-208
Matches: 104, 208

## Patterns carry a contract

A regex engine is more than a way to find a word. Existing grammars and applications depend on how lookbehind, captured text, Unicode properties and recursive patterns behave. Rewriting the expression can change that behavior just as surely as changing the engine.

Ferroni continues Oniguruma's expressive syntax in Rust. Choose it when that compatibility matters: an editor grammar, a highlighter, or a search that depends on a feature the regex crate deliberately leaves out. The point is to run the pattern your tool already understands, with behavior you can inspect.

Selected executable syntax checks:
Feature | Ferroni | Rust regex
Lookahead and lookbehind | Yes | No
Backreferences | Yes | No
Unicode character properties | Yes | Yes

These examples describe selected checks, not every possible pattern.
Explore syntax and compatibility

## One line. Several patterns. The next match.

A TextMate grammar compiles a set of patterns, then asks which one matches next from a position in the line. The scanner returns the leftmost match, the index of the pattern that found it, and capture ranges. The tokenizer resumes at the previous match's end.

Source: const answer = 42 // note
Patterns: 0 keywords, 1 strings, 2 comments, 3 numbers

Resume at byte | Next match | Pattern index | Byte range
0 | const | 0 | 0..5
5 | 42 | 3 | 15..17
17 | // note | 2 | 18..25

The regular scanner uses byte offsets. Explicit UTF-16 methods support editor text models. For a zero-width match, advance at a character boundary before asking again.
Understand the scanner · Ferriki runs on Ferroni

## Continued with care

Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, preserving its syntax and pattern semantics for the supported encodings. Compatibility checks compare behavior against the original; the history stays visible with the implementation.

A smaller system is not automatically a better fit for every pattern. Rust's regex crate makes a different tradeoff: it leaves out constructs such as lookaround and backreferences to offer predictable linear-time searching. Ferroni keeps the expressive contract and gives callers controls for expensive searches.
Inspect compatibility · Compare the engine contracts

## Reuse changes the picture

Ferroni throughput relative to each comparator; higher is faster.
Comparator | macOS ARM64 | Linux x86-64
C Oniguruma | 3.44× | 2.75×
PCRE2 JIT | 0.70× | 0.63×

Steady reuse · 21 tasks per pair · 513 corpus inputs
Measured October 15, 2026 · revision 1c8d45f
Blacksmith VMs: macOS ARM64 and Linux x86-64.

Compile, first use and steady reuse answer different questions. C Oniguruma compiles patterns faster. Ferroni pays off when a prepared pattern runs many times. PCRE2 JIT remains faster in the steady-reuse aggregates shown here.

Every task checks expected output before timing. These are isolated regex steps, not complete application benchmarks, and each row describes a pairwise task set.
Read the complete benchmarks

## Put a boundary around the work

Memory safety does not make every pattern cheap. For untrusted patterns or text, choose retry budgets and supported time limits; the fallible search methods distinguish a reached limit from no match. Browser WebAssembly searches use retry limits instead of timeouts.

Keep those controls close to the place that accepts input, then reuse compiled patterns where the workload allows it.
Read the untrusted-input guide

Start with Rust
cargo add ferroni

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy
