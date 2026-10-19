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

---

Source documents:

- `../ferromark/homepage/app/routes/rust/getting-started.mdx`
