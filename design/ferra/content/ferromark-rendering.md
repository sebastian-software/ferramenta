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

---

Source documents:

- `../ferromark/homepage/app/routes/guide/rendering.mdx`
- `../ferromark/homepage/app/routes/guide/features.mdx`
