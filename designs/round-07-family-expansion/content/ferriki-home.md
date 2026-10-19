# Ferriki

A syntax highlighter.

## Code, in its own colors.

Run the grammars and themes your editor uses in a native Rust engine. Highlight in Rust, Node.js or a Vite build.

Actions: Start with Rust. Node.js guide.
Navigation: Overview. Getting started. Highlighting. Evidence. GitHub. The Ferramenta family.

## See what the grammar sees

Margin introduction: Working example. One source, meaningful token colors.
Source: const answer = 42;
Output: show exactly the same source on a light ground, with distinct keyword, identifier and number colors. Do not change the source or add a dark code panel.
A grammar identifies scopes; a theme decides how those scopes look. Keep that relationship visible without making the code harder to read.

## Keep the editor contract

Margin introduction: Grammars and themes. Familiar inputs, a native engine.
TextMate grammars started in TextMate and power highlighting in VS Code and Shiki. Ferriki runs a Rust port of VS Code's TextMate tokenizer and uses Ferroni for the original pattern language.
Shiki-compatible HTML calls keep familiar shapes. Compatibility is checked against pinned upstream tests, with supported, deferred and out-of-scope cases recorded explicitly.

Table: Input or contract | Ferriki's role
TextMate grammar | Identify nested syntax scopes
TextMate theme | Map those scopes to presentation
HTML output | Emit markup with escaped source
Transformers | Apply the supported highlighting hooks

## Render once. Choose how it is styled

Margin introduction: Output. Tokens, HTML and CSS with distinct jobs.
Use inline styles for a self-contained code block, or class-based output with nested scopes for stylesheet themes. codeToHtmlWithCss returns HTML and CSS. A theme map can switch presentation without highlighting the source again.
Rust callers can work with tokens and rendering APIs. Node.js callers use the native addon. Keep a loaded highlighter for repeated work instead of rebuilding it for every block.

## Move highlighting into the build

Margin introduction: Delivery. Send the result to the browser.
With the Vite integration, code() and the Code component become highlighted HTML and CSS during the build. The browser receives the result; grammar and engine loading stay in the build step.
Languages and themes load on demand from a release-pinned asset service, are verified by SHA-256 and are cached. A mirror or warm cache supports offline builds.
Links: Asset loading. Vite guide. Recorded benchmarks.

## Start with the surface you need

Margin introduction: Get started. One engine, explicit entry points.
Rust: cargo add ferriki --features remote
Node.js: npm install @ferriki/core
Ferriki is in beta; minor releases can change the API before 1.0. Read the compatibility and migration notes when adopting an existing Shiki workflow.

Footer: Ferriki. Part of Ferramenta. GitHub. Imprint. Privacy.
