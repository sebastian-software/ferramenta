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

---

Source documents:

- `../ferromark/homepage/app/routes/home.tsx`
- `../ferromark/homepage/app/routes/guide/features.mdx`
