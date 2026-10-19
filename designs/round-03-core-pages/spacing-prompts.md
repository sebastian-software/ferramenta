# Generated spacing-revision prompts

These built-in Imagegen edits are retained as visual history. The current, deterministic spacing authority is [the shared HTML study](../homepages/DESIGN-NOTES.md).

## Ferromark

Use case: ui-mockup. Edit the existing complete homepage design in image 1. Image 1 is the edit target; image 2 is the exact new product logo symbol to insert ONLY beside the existing project wordmark in the page header and in the footer. Keep the actual metal hero illustration, its meaning, its approximate scale, the type family, the warm white light theme, restrained oxide accent, heading style and all substantive content. This is a focused spacing revision of an approved design, not a redesign.

The page body is visibly too cramped. Make it about 35 to 45 percent taller at the same relative desktop width. Use the additional height for genuine empty space and improved leading; DO NOT enlarge the text and graphics to fill the new space. Major editorial sections should have approximately 112 to 144 CSS pixels of clear separation at a 1440px desktop width. Give prose a comfortable 1.6-1.7 line height with 24px paragraph spacing, headings 24-32px from the following text, tables generous row height and 24px notes below. Maintain readable bounded columns, left alignment, quiet and asymmetric editorial hierarchy. Content must remain complete, including caveats and provenance. Do not add photos or illustrations in the body. Do not hide content or reduce density by deleting copy.

REMOVE the full-width horizontal divider rules BETWEEN ALL major body sections. Delineate these sections through white space only. Preserve functional cell lines within tables and the fine frames of code/demo tools. Remove gratuitous vertical rules between two editorial columns too; use a generous 72px gutter instead. Header navigation active underline and links may remain. Footer must breathe: at least 96px space before it, comfortable internal padding.

Integrate image 2's exact symbol at 40px beside the existing text wordmark in the header with a 12px gap. This is a small logo, never a second hero or illustration. The symbol has its exact supplied silhouette, metal and oxide colors and no added background. Footer may repeat at 32px. Retain the existing large product title in the hero. No favicon size demo or logo board inside this page.

Output one tall desktop full-page website visual comp, approximately 1200 by 3200 pixels; allow more vertical canvas rather than compressing any prose. Reproduce the following US English content and numbers accurately. Source copy below is authoritative; keep the established visual editorial blocks rather than showing markdown syntax.

Product-specific direction:
Ferromark needs the same airiness as Ferroni. Give the demo, correctness article, throughput chart, trust-policy table, document/API notebook and Rust/Node action their own whitespace intervals. In the throughput chart retain Ferromark v2 1.00, v1 0.48, pulldown-cmark 0.38, md4c 0.29, Bun native 0.17. Preserve provenance, Rust vs Node trust defaults and front-matter caveats. No section dividers or additional material imagery. Keep API notebook and chart as deliberate narrower companions to the articles.

Authoritative content:

# Ferromark

## Markdown, ready for your pipeline.

Turn Markdown into HTML and the metadata around it. A focused Rust engine for the documents that get complicated.

Start with Rust · Node.js guide
cargo add ferromark

One source. HTML and document metadata.

## See what a document becomes

Markdown input:

```markdown
# Release notes

- Clear structure
- Useful metadata
```

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

| API     | Default                               | For untrusted Markdown         |
| ------- | ------------------------------------- | ------------------------------ |
| Rust    | Raw HTML passthrough                  | Enable sanitize                |
| Node.js | Escaped HTML and filtered URL schemes | Keep renderPolicy: 'untrusted' |

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

Use case: ui-mockup. Edit the existing complete homepage design in image 1. Image 1 is the edit target; image 2 is the exact new product logo symbol to insert ONLY beside the existing project wordmark in the page header and in the footer. Keep the actual metal hero illustration, its meaning, its approximate scale, the type family, the warm white light theme, restrained oxide accent, heading style and all substantive content. This is a focused spacing revision of an approved design, not a redesign.

The page body is visibly too cramped. Make it about 35 to 45 percent taller at the same relative desktop width. Use the additional height for genuine empty space and improved leading; DO NOT enlarge the text and graphics to fill the new space. Major editorial sections should have approximately 112 to 144 CSS pixels of clear separation at a 1440px desktop width. Give prose a comfortable 1.6-1.7 line height with 24px paragraph spacing, headings 24-32px from the following text, tables generous row height and 24px notes below. Maintain readable bounded columns, left alignment, quiet and asymmetric editorial hierarchy. Content must remain complete, including caveats and provenance. Do not add photos or illustrations in the body. Do not hide content or reduce density by deleting copy.

REMOVE the full-width horizontal divider rules BETWEEN ALL major body sections. Delineate these sections through white space only. Preserve functional cell lines within tables and the fine frames of code/demo tools. Remove gratuitous vertical rules between two editorial columns too; use a generous 72px gutter instead. Header navigation active underline and links may remain. Footer must breathe: at least 96px space before it, comfortable internal padding.

Integrate image 2's exact symbol at 40px beside the existing text wordmark in the header with a 12px gap. This is a small logo, never a second hero or illustration. The symbol has its exact supplied silhouette, metal and oxide colors and no added background. Footer may repeat at 32px. Retain the existing large product title in the hero. No favicon size demo or logo board inside this page.

Output one tall desktop full-page website visual comp, approximately 1200 by 3200 pixels; allow more vertical canvas rather than compressing any prose. Reproduce the following US English content and numbers accurately. Source copy below is authoritative; keep the established visual editorial blocks rather than showing markdown syntax.

Product-specific direction:
Ferroni is the clearest case of crowding. Separate the first regex demo from the compatibility essay with a large blank interval. Then establish four distinct airy reading scenes: compatibility essay + feature matrix; scanner walkthrough + match table; continuation story + benchmark evidence; work-limit article + Rust install action. No rule connecting their boundaries. Avoid turning every block into a card. Keep all original paragraphs, scanner rows and benchmark caveats. In the existing regex demo the pattern is (?<=item-)\\d+ as regex syntax, not doubled by JSON escaping; show a single backslash before d.

Authoritative content:

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

| Feature                      | Ferroni | Rust regex |
| ---------------------------- | ------- | ---------- |
| Lookahead and lookbehind     | Yes     | No         |
| Backreferences               | Yes     | No         |
| Unicode character properties | Yes     | Yes        |

These examples describe selected checks, not every possible pattern.
Explore syntax and compatibility

## One line. Several patterns. The next match.

A TextMate grammar compiles a set of patterns, then asks which one matches next from a position in the line. The scanner returns the leftmost match, the index of the pattern that found it, and capture ranges. The tokenizer resumes at the previous match's end.

Source: const answer = 42 // note
Patterns: 0 keywords, 1 strings, 2 comments, 3 numbers

| Resume at byte | Next match | Pattern index | Byte range |
| -------------- | ---------- | ------------- | ---------- |
| 0              | const      | 0             | 0..5       |
| 5              | 42         | 3             | 15..17     |
| 17             | // note    | 2             | 18..25     |

The regular scanner uses byte offsets. Explicit UTF-16 methods support editor text models. For a zero-width match, advance at a character boundary before asking again.
Understand the scanner · Ferriki runs on Ferroni

## Continued with care

Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, preserving its syntax and pattern semantics for the supported encodings. Compatibility checks compare behavior against the original; the history stays visible with the implementation.

A smaller system is not automatically a better fit for every pattern. Rust's regex crate makes a different tradeoff: it leaves out constructs such as lookaround and backreferences to offer predictable linear-time searching. Ferroni keeps the expressive contract and gives callers controls for expensive searches.
Inspect compatibility · Compare the engine contracts

## Reuse changes the picture

Ferroni throughput relative to each comparator; higher is faster.

| Comparator  | macOS ARM64 | Linux x86-64 |
| ----------- | ----------- | ------------ |
| C Oniguruma | 3.44×       | 2.75×        |
| PCRE2 JIT   | 0.70×       | 0.63×        |

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
