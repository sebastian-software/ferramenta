/** The markdown shown beside its generated Ferromark output on the home page. */
export const PIPELINE_SAMPLE_MARKDOWN = `### Render Markdown in Rust

Ferromark turns **Markdown** into HTML:

\`\`\`rust
let html = ferromark::to_html("Hello, **world**!").unwrap();
assert_eq!(html, "<p>Hello, <strong>world</strong>!</p>\\n");
\`\`\`
`;

export const PIPELINE_SAMPLE_THEME = "gruvbox-dark-hard";
