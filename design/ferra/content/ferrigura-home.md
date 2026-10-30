# Ferrigura

## Mermaid diagrams, rendered without a browser.

Render diagram text as SVG in Rust, on the command line or through a Node.js binding. Embedded fonts make text layout independent of the machine's installed fonts.

## Keep the familiar diagram text.

Mermaid made text-defined diagrams part of documentation. Ferrigura ports its parsers and drawing behavior to Rust, so a server or build can render diagrams without launching Chromium.

```sh
cargo add ferrigura
```

The repository explains each diagram type, layout engine and known gap. Read those boundaries against the diagrams your application needs.

## Check against the original.

Parser behavior is compared with Mermaid's parser. Rendered geometry is checked against Mermaid running in Chromium. The project's comparison notes keep measurement conditions and limitations with their evidence.

## Choose the interface you need.

The library and command-line tool are published on crates.io. The repository also contains the Node.js addon and its distribution setup; check the current release instructions before choosing that path.
