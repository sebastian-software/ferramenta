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
