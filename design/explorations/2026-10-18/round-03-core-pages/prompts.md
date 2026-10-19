# Core pages — generation prompts

Built-in Imagegen. Inputs 1 and 2 are the selected round-two style references; input 3 is the project's generated semantic instrument. Each page is a separate image request.

## Shared page brief

Use case: ui-mockup
Asset type: ONE fully designed core webpage for the Ferromark / Ferroni family, coherent design development of selected concepts 11 and 14.
Canvas: a TALL full-page DESKTOP screenshot, around 1440px width by 3000px height, from header to footer. This is a complete long webpage, not only a hero, not a phone screen, no browser or device chrome, no external concept-board labels. Maintain readable text and natural desktop proportions.
Input images: image 1 and image 2 are the selected STYLE REFERENCES (Micrometer bridge and Calibration sheet). Image 3 is the project's meaningful OBJECT REFERENCE. Reuse its identity and mechanical logic rather than replacing it with a generic sculpture.
Shared visual system: light theme ONLY everywhere, including code, header and footer. Warm white #FCFCF8, white #FFFFFF, fine silver #D4D8D6, pale neutral #ECEDE7, readable graphite #3D423E, controlled oxide #965332. Fine brushed satin steel, tiny countersunk screws, clean stabilized rust. Fine mechanisms and carefully made parts, generous white space, no thick frames or factory props. Small text always on flat surfaces. Minimal surface texture. Softer regular-width industrial humanist sans, mostly regular and medium weights; moderate headline size, no huge bold project word. Monospace only for code and numerical data. Sentence case throughout.
Family cohesion: same white 64px header, text project wordmark at left, navigation Overview / Start with Rust / core topic / Benchmarks / GitHub; a quiet Ferramenta family link at right. Restrained thin oxide active underline. Same pale rules, code panels, install line, comparison tables and compact white family footer across pages. Do not invent a brand logo or use the Rust logo as the project logo; use clean text wordmarks and a small text "Rust-native" marker where appropriate.
Content: render the supplied headings, essential sentences, code and numbers accurately in US English. Use short readable prose. Facts below are approved design content, never reproduce these design instructions as visible copy. No fabricated API methods, claims, quotes, customer logos, version numbers, tests, metrics or unlabeled invented chart values. Material objects are explanatory metaphors, not claims about literal software architecture. No family-wide pipeline diagram.
Avoid dark bands, dark editors, dirty rust, grunge, molten metal, anvils, huge gears, heavy bolts, steampunk pipework, shiny chrome glare, all-caps shouting, huge Rust cog branding, identical marketing card grids, illegible microtext and cropped-off footer.

## 21. Ferromark: Overview

File: 21-ferromark-home.png

Layout:
A complete rich homepage. First viewport is the selected 11's airy asymmetric introduction: headline and actions at left, meaningful document-register object at right, about 50/50. A short caption under the object connects source, HTML and metadata. Then a broad light Markdown/preview sample. BELOW it return to the first round's MAGAZINE-LIKE CONTENT: three generous alternating editorial rows with different image/text proportions, meaningful detail images derived from the same document register (source heading alignment, thin metadata index leaf, adjustable guide clamp), each with a heading, 2–3 sentences and a real-looking source link. Add a quiet benchmark narrative row without numbers. End with one restrained install/related-project section and a real light footer. Around six generous content bands; avoid compressing the page into a hero and three feature cards.

Content (US English):

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

## Conformance before speed

CommonMark and GFM give the core its contract. Publishing features add heading IDs, footnotes and tables your CSS can address.
Inspect the correctness checks

## The details publishing needs

Front matter, heading IDs and footnotes travel with the document. Front matter is extracted as raw text; your application interprets it.
Explore rendering and metadata

## Trust is a decision

Rust preserves raw HTML by default. For untrusted Markdown, enable sanitizing explicitly. Node.js has its own documented defaults.
Choose your rendering policy

## Fast, and measured before it is said

Same input, equivalent output, recorded source revisions. Read the measurements and the settings behind them.
Read the benchmarks

## Rust first. Your pipeline stays yours.

Translation, templates, routing and syntax highlighting connect through explicit hooks. Ferromark pairs with Ferriki for highlighting.
Start with Rust · Meet Ferriki

Part of Ferramenta · GitHub · Imprint · Privacy

## 22. Ferromark: Start with Rust

File: 22-ferromark-start.png

Layout:
A complete documentation landing page in the same identity. White family header, then a slim 190px left documentation index and wide readable content column, with a narrow right-side "On this page" anchor list. No large hero photo. A small cropped detail of the source document entering the register sits alongside the page introduction, taking less than 12% of the content area. Main body has numbered install/run steps only where sequence is real, a wide light Rust code panel and real output. Then a clear open API-choice table and pale oxide trust-policy callout. Bottom next-page links are flat and editorial. Preserve generous spacing and readable code; this should feel like a carefully set technical manual.

Content (US English):

# Start with Rust

Render your first document, then choose the API your pipeline needs.

## Install

cargo add ferromark

## Render your first document

fn main() -> Result<(), ferromark::ParseError> {
let html = ferromark::to_html("Hello, **world**!")?;
println!("{html}");
Ok(())
}
Output:
<p>Hello, <strong>world</strong>!</p>

## Choose your API

Task | API
Render one document | to_html()
Choose syntax and output policy | to_html_with_options()
Append to an existing string | to_html_into()
Inspect document structure | Allocator + Parser + HtmlRenderer
Customize output | HtmlRenderHooks

## Choose your trust policy

Rust preserves raw HTML by default. For untrusted Markdown, enable HtmlRendererOptions::sanitize.
The Node.js API has different defaults. Read the rendering policy before accepting untrusted input.

## Continue

Rendering and metadata
Benchmarks
API reference

Ferromark · Part of Ferramenta · GitHub · Imprint · Privacy

## 23. Ferromark: Rendering & metadata

File: 23-ferromark-rendering.png

Layout:
A complete explanatory core-function page. Same white header and modest left docs index as the getting-started page. Above the body, a wide editorial hero shows the document register in a more top-down explanatory view, with simple sparse leader labels Source / HTML / Metadata, all text outside the object on flat white. Below this, an input document and THREE differently sized clear output responsibilities, not an arbitrary flow of family engines. Continue with an editorial explanatory section, a large legible trust-default table, a carefully visible note about hooks, and a small profiles/limits section. The mechanism should teach why the metadata leaf is separate. A reading page with useful tables, not a marketing feature grid.

Content (US English):

# Rendering and metadata

A document becomes HTML, structure and the metadata around it.

## One document, distinct outputs

Markdown source:
---

title: Release notes
---

# Installation

A useful note.[^detail]

[^detail]: Details belong here.

Output responsibilities:
HTML: document markup and optional heading IDs
Metadata: raw front matter and document structure
Your application: YAML/TOML interpretation, routing and styling

## What the engine gives you

Front matter is extracted as text, not parsed as YAML or TOML.
Heading IDs and footnotes are publishing features you configure.
Rendering hooks connect your own output decisions.

## Recognition is not permission

API | Default | For untrusted input
Rust | Raw HTML passthrough | Enable sanitize
Node.js | Escaped raw HTML, filtered URL schemes | Keep renderPolicy: 'untrusted'

Custom renderer hooks and highlighter HTML are written verbatim. They must escape untrusted values themselves.

## Profiles and limits

Specification profiles disable publishing extras. Block nesting defaults to 100 levels; exceeding the limit returns a parse error.
Configuration · Correctness checks · API reference

Ferromark · Part of Ferramenta · GitHub · Imprint · Privacy

## 24. Ferromark: Benchmarks

File: 24-ferromark-benchmarks.png

Layout:
A serious complete benchmark reading page in the same shared docs shell. A quiet title and provenance row lead, with only a small precision-calibration detail of the register mechanism at the top right. A prominent well-set real table, oxide-highlighted own row and fully visible units. The exact provided values must appear; do not make up values or an arbitrary unlabeled plot. A small precise horizontal bar rendering may accompany the fresh column ONLY if numbers and baseline match the table. Follow with three open editorial method sections: scoring subset, timing scope and limitations. End with raw-data/reproduction links and footer. No giant speed claims or decorative material texture behind numbers.

Content (US English):

# Parser benchmarks

Same input. Equivalent HTML. The measured settings are part of the result.

Measured September 21, 2026
Apple M1 Pro · revision 39b1f0b7

## Native engine comparison

Relative throughput. Higher is faster; Ferromark v2 = 1.00×.
Fresh and reuse are separate lifecycles.
50 documents with equivalent HTML across five engines.

Engine | Fresh | Reuse
Ferromark v2 | 1.00× | 1.00×
Ferromark v1 | 0.48× | 0.52×
md4c | 0.29× | 0.27×
pulldown-cmark | 0.38× | 0.37×
Bun native | 0.17× | 0.15×

## What belongs in the score

The frozen corpus contains 57 documents. The score above uses the 50-document five-engine agreement subset. Differing outputs remain diagnostics.

## What the timing includes

Fresh includes setup, processing, owned output and destruction. Reuse retains public state where the API permits.
No file I/O, process startup or output normalization is timed.

## Read the conditions before the ranking

The extension lane enables tables, strikethrough and task lists. This is not full GFM. These explicit settings differ from library defaults.
One shared workstation does not establish a universal ranking or statistical significance.

Raw data · Exact flags · Output review · Reproduce the run

Ferromark · Part of Ferramenta · GitHub · Imprint · Privacy

## 25. Ferroni: Overview

File: 25-ferroni-home.png

Layout:
A complete product homepage matching Ferromark's header and editorial system. First viewport is the selected Calibration sheet's measured layout adapted to Ferroni: modest product introduction and Rust action at upper-left, a SHORT open syntax/capability ledger in the middle, and the meaningful pattern-comparator object spanning the right / lower hero area on white, clearly readable. Small external captions identify pattern cassettes, scanning carriage and match pointer. Beneath the hero a wide light regex specimen. Then the first round's richer MAGAZINE-LIKE alternating rows: a close-up of pattern cassettes beside syntax copy, a long scanner-carriage detail beside a highlighter explanation, and a quieter compatibility story. Final evidence and controlled-input rows include the real caveats and source links. At least six substantive sections through a genuine white footer, no generic three-card ending.

Content (US English):

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

## Run the patterns regex rejects

Lookbehind, backreferences and recursion keep the expressive syntax your tools already use. Choose Ferroni when the pattern needs that contract.
Explore syntax and compatibility

## The engine under your syntax highlighter

A TextMate grammar searches many patterns at once. Ferroni's scanner returns the leftmost next match and the pattern that found it. Ferriki runs on Ferroni.
Understand the scanner

## Continued with care

Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, with compatibility checks against the original.
Inspect compatibility

## Fast on reuse. Honest about the tradeoff.

Compile, first use and steady reuse are measured separately. C Oniguruma compiles faster; PCRE2 JIT remains faster in the reported steady-reuse aggregate.
Read the benchmarks

## Control searches on untrusted input

Choose retry or time limits for the input you accept. Memory safety does not make every pattern cheap to run.
Read the input guide

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

## 26. Ferroni: Start with Rust

File: 26-ferroni-start.png

Layout:
A complete Rust getting-started page using EXACTLY Ferromark's documentation shell: same white top navigation, narrow left index, readable center content, narrow right anchor list. The tiny introductory object detail is the pattern cassette beside a slim text ribbon, not a decorative full-page machine. Simple install step, generous light Rust snippet, adjacent clear match/result panel, then a capture explanation and a position note. Use a subtle ruler under the date match to give a visual meaning to byte offsets, but do not invent extra numeric tick values. End with clear flat next-topic links and white footer. No enormous marketing hero.

Content (US English):

# Start with Rust

From Cargo to a first match. No C toolchain is required.

## Install

cargo add ferroni

## Your first match

use ferroni::prelude::*;

let re = Regex::new(r"\d{4}-\d{2}-\d{2}").unwrap();
let m = re.find("Released on 2026-09-05.").unwrap();
assert_eq!(m.as_str(), "2026-09-05");

Match: 2026-09-05
Byte range: 12..22

## Capture what matters

Named groups resolve through Captures::name. Group 0 is the whole match.
Find the leftmost match with find, or walk successive matches with find_iter.

## Keep positions explicit

Regex offsets are bytes. Use the scanner's explicit UTF-16 methods when integrating with editor text models.

## Choose your next step

The scanner · Syntax and compatibility · Limits for untrusted input · Benchmarks

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

## 27. Ferroni: The scanner

File: 27-ferroni-scanner.png

Layout:
A complete explanatory scanner page in the shared docs shell. A broad diagrammatic object view at top shows the same comparator with three/four parallel pattern cartridges, the moving head and source ribbon; sparse external leaders label only Pattern set / Scan position / Next match. The object explains SOFTWARE behavior without pretending to be literal architecture. Below it a wide code/source line with correctly colored spans, a clear pattern-index / byte-range result, the supplied real scanner snippet, then a compact side-by-side byte/UTF-16 explanation. Meaningful calibration details echo selected 14. Keep imagery to the top and one small explanatory detail; reading and code remain flat light surfaces. Footer fully visible.

Content (US English):

# The scanner

Many patterns. The next leftmost match.

A TextMate tokenizer asks which pattern matches next at the current position. Ferroni returns the pattern index and capture ranges.

## One line, several patterns

Source: const answer = 42 // note
Pattern 0: keywords
Pattern 1: strings
Pattern 2: comments
Pattern 3: numbers

Next match: const
Pattern index: 0
Byte range: 0..5

## Use the scanner

use ferroni::prelude::*;

let mut scanner = Scanner::new(&[
r"\bconst\b",
r"\b\d+\b",
]).unwrap();

let m = scanner.find_next_match(
"const answer = 42", 0, ScannerFindOptions::NONE
).unwrap();

## Two coordinate systems

find_next_match returns byte offsets.
find_next_match_utf16 with OnigString returns UTF-16 code units.
In "hello 🌍 world", "world" starts at byte 11, UTF-16 position 9.

## Reuse work without losing correctness

A stable string ID lets repeated scans of the same line reuse cached results. Advance past zero-width matches at a character boundary.

Scanner API reference · Compatibility · Benchmarks

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

## 28. Ferroni: Benchmarks

File: 28-ferroni-benchmarks.png

Layout:
A complete benchmark page sharing the SAME evidence-table and provenance components as Ferromark. Quiet left doc index and right anchor list, moderate title. A tiny clean comparator calibration detail in the upper-right conveys measurement, not decoration. Clear phase tabs with Steady reuse active. Show the exact supplied table with all four rows, including the sub-1.00 PCRE2 JIT result; do not omit the losing row. A warm pale oxide method note explains pairwise task sets. Continue below with compile tradeoff, output correctness and measurement method in generous open editorial sections. No invented chart data, no giant generic speed metric, no dark panels. Real footer.

Content (US English):

# Regex benchmarks

Check the output before measuring the time.

Measured October 15, 2026 · revision 1c8d45f
Blacksmith VMs: macOS ARM64 and Linux x86-64
21 tasks · 513 inputs
Compile · First use · Steady reuse

## Steady reuse

Ferroni throughput relative to each engine. Higher is faster.
Each row is a pairwise comparison on tasks both engines can run.

Comparator | macOS ARM64 | Linux x86-64 | Tasks
C Oniguruma | 3.44× | 2.75× | 21
Onigmo | 3.92× | 3.61× | 20
PCRE2 interpreter | 2.07× | 1.85× | 21
PCRE2 JIT | 0.70× | 0.63× | 21

## Where the tradeoff sits

C Oniguruma compiles patterns faster. Ferroni pays off when a prepared pattern runs many times.
PCRE2 JIT is faster in these steady-reuse aggregates. Keep that row visible.

## Same output first

An engine that rejects a pattern or returns a different result is excluded from that task before timing.
These are isolated regex steps, not full applications.

## How the result is assembled

Three processes per platform, separate VMs, 30 samples per phase. Ratios are geometric means within task families, then across families.
Rows cover different task sets and are not a universal ranking.

Raw measurements · Methodology · Reproduce the checks

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

## Object assets

### Ferromark: document-register

Use case: product-mockup
Asset type: reusable transparent hero object for Ferromark, a Rust Markdown parser and renderer.
Primary request: design a meaningful, elegant fine-mechanical DOCUMENT REGISTRATION INSTRUMENT. A very thin satin stainless bridge on two tiny countersunk screw anchors straddles a narrow flat document bed. Three very thin metal document leaves are slightly offset through the guide: a source leaf has faint engraved heading and paragraph marks; a clean rendered leaf shows a visibly organized heading, short lines and a two-row table; a separate slim oxide-brown index leaf projects slightly to the side as the metadata output. The underlying concept is Markdown source becoming structured HTML and metadata, like careful typesetting and registration. This is one coherent small instrument, not random stacked material. The mechanics should feel legible: a guide aligns sheets, two tiny clamps fix alignment, one small rust-colored registration tab locates the heading.
Match the references' clean fine brushed silver, warm stabilized oxide and white daylight, very thin sections and fine chamfers, premium instrument making. Minimal fasteners. No gears, pipework, heavyweight machinery, wood, flames, dirty rust, grime or patina flakes. Genuine transparent alpha background, entire instrument visible with ample transparent margin, soft neutral studio lighting, no baked-in floor or large shadow. Three-quarter top-front view. No words or logos on the object, only restrained typographic line marks that suggest source and output. This is an independent hero asset, not a website screenshot.
Input references: images 1 and 2 are style references only; preserve their material language, not their arbitrary bridge silhouette.

### Ferroni: pattern-comparator

Use case: product-mockup
Asset type: reusable transparent hero object for Ferroni, an Oniguruma-compatible regex engine and multi-pattern scanner in Rust.
Primary request: design a meaningful fine-mechanical PATTERN COMPARATOR INSTRUMENT. An extremely slender horizontal stainless linear guide carries a miniature scanning head over a thin text ribbon. At the left, three very thin removable pattern cassettes stand PARALLEL in a small satin-metal holder; one cassette edge is warm stabilized oxide. The carriage has a fine rust-brown pointer that lines up with one highlighted slot in the ribbon, illustrating the next matching span selected across multiple patterns. At the right, two small oxide registration marks indicate separate matched spans. The functional metaphor must be visually inferable: stored patterns, a scanning head moving across source text, an indexed match position. One coherent small tabletop instrument, not a random sculpture.
Use the reference screenshots' premium clean brushed steel, controlled rust-brown inlay, tiny flush screw anchors and calm light reflections. Thin members, fine tolerances, mechanically plausible guide and carriage; a little of the first-round Ferroni engine's explanatory character without its bulky pipework. No large cogwheels, boiler pipes, thick housing, anvils, flames, dirt or grunge. Genuine transparent alpha background with whole device and ample margin, three-quarter top-front view, soft studio lighting, no baked-in floor. No text, labels, logo or numbers; source ribbon only has small engraved neutral letter-like marks and match slots. An independent hero asset, not a webpage.
Input references: images 1 and 2 are material and refinement references only.

## Final refinement passes

The exact refinement prompts are retained in [refinements.json](refinements.json) and each affected PNG sidecar. They correct homepage navigation and the Ferroni benchmark active state and copy. The generation briefs above record the initial requests.

## Editorial homepage revision

The default homepages now use the [editorial body revision](homepage-editorial-prompts.md). The earlier full-page PNGs and generation prompts remain available for comparison.
