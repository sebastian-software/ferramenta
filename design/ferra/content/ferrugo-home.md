# Ferrugo

A PDF preview renderer.

## Previews. With boundaries.

Render bounded previews of untrusted PDFs with a Rust-native engine. Keep the runtime path, resource policy and unsupported cases explicit.

Actions: Render a preview. Read the limits.
Navigation: Overview. Getting started. Rendering. Limits. GitHub. The Ferramenta family.

## A document becomes a preview

Margin introduction: Working example. The output has a defined boundary.
Input: report.pdf
Command: ferrugo render report.pdf --max-edge 256 --output preview.png
Output: preview.png, illustrated as a smaller first-page document thumbnail. Show the same neutral heading, body lines and simple chart marks in source and preview. The maximum edge is 256 pixels; do not invent an elapsed time, file size or guaranteed fidelity score.

## Keep the runtime focused

Margin introduction: Native rendering. A small explicit path.
The CLI, Rust library and Node.js package use the native backend. PDFium is not a runtime dependency and is not bundled. External renderers serve maintainer comparisons rather than silently becoming a runtime fallback.
The practical scope is server-side previews, document intake, thumbnails and automation workflows.

Table: Entry point | Package | Intended use
CLI | ferrugo | Scripts and one-off renders
Rust | ferrugo-thumbnail with ferrugo-native | Service-side rendering and typed errors
Node.js | ferrugo | Async render and inspect calls through Node-API

## Put limits around the document

Margin introduction: Resource policy. Make the budget part of the job.
Choose explicit memory and timeout budgets for bounded rendering. Use typed diagnostics and unsupported-feature boundaries when a document exceeds the engine's current scope.
Keep the file and resource policy close to the caller instead of presenting every PDF as a safe, inexpensive input.

## Be precise about fidelity

Margin introduction: Evidence. A useful preview subset, openly tested.
Generated and curated corpora, golden images and comparison oracles expose the documents the renderer handles and the gaps that remain. The project does not claim pixel-perfect parity across the full PDF format.
PDF editing, signing, dynamic XFA and a complete interactive viewer are outside the current product path. WASM is a secondary compatibility profile; the main runtime is Rust-native on the server or local machine.
Links: Supported scope. Diagnostics. Renderer evidence.

## Render the first preview

Margin introduction: Get started. Choose an explicit entry point.
cargo install ferrugo --locked
Use the CLI, the Rust facade or the Node.js package according to the application runtime. Read the limits alongside the rendering guide.

Footer: Ferrugo. Part of Ferramenta. GitHub. Imprint. Privacy.
