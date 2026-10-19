# Exact Imagegen prompts

All three original masters were generated with the built-in Imagegen tool. No CLI or API fallback was used. Input images and output hashes are recorded in adjacent sidecars. Existing engine identities and material textures are reused unchanged.

+## Hero register

```text
Use case: stylized-concept.
Asset type: original reusable transparent homepage hero for Ferramenta, the family of seven independent Rust engines.
Input Image 1 (Ferromark document-register instrument) and Image 2 (Ferroni pattern comparator) are MATERIAL, CAMERA, LIGHTING and CRAFT references only. Create a distinct new object. Their black-looking image-viewer backdrop is not a requested background.

Subject: an open seven-position precision tool register. A shallow, lightweight machined satin-steel register holds exactly SEVEN individually removable inserts in seven separated parallel keyed sockets. Every insert has its own simple recognizable profile: 1) a pattern rail, 2) a token comb, 3) a document plate with broad slots, 4) a letterform type tile, 5) two paired catalog leaves as one insert, 6) a branching Y-path, 7) a small rectangular preview aperture. They stand in a slightly fanned but orderly independent collection with clear gaps. One restrained warm rust-brown oxide registration latch at the near corner unifies the assembly. Two quiet flush fasteners maximum. One insert may be lifted a little to show removability, but the set remains one complete composed object. This means shared workmanship and mounting standards, NOT a processing pipeline: no arrows, cables between inserts, conveyor, mandatory sequence or assembly line.

Style: believable refined fine-mechanical studio render, satin brushed steel, warm graphite underside, tiny warm oxide accent. Careful bevels, real machining, clean and durable, light rather than heavy. No grunge, dirt, rust flakes, weapons, gear cliches, dark industrial drama, chrome mirror reflections or golden luxury.
Camera: three-quarter orthographic-like view from slightly above, matching the references. Center the whole object in a moderately wide landscape composition. Keep 10% transparent margin on all edges; no clipping. Whole object in focus, soft studio daylight from upper left. No readable text, labels, caption, wordmark or watermark.
Background: genuine alpha transparency including every open space and socket gap. A restrained local contact shadow may be semitransparent. No opaque floor, matte, background gradient or presentation board. Output only the single reusable instrument graphic.
```

## Rendered family mark

```text
Use case: logo-brand.
Asset type: original transparent rendered family logo mark for Ferramenta, legible at 32–64px.
Input Image 1 is the Ferromark mark and Image 2 the Ferroni mark. They are references for MATERIAL, render craft, warm graphite backing, controlled steel highlights and restrained oxide accents. Create a DIFFERENT mark for the family itself; do not reuse either engine's silhouette. The dark-looking viewer background is not requested.

Primary request: a compact F-shaped precision registration fixture. A bold upright satin-steel spine with two broad horizontal arms opens to the right, forming an unmistakable capital-F silhouette. The two open keyed bays have large clear negative space. A short warm rust-brown oxide removable insert is docked on the end of the upper arm. A thin graphite backing echoes the F shape with controlled depth; it must not fill the bays. The common registration fixture represents one workshop and independently selectable tools.
Only three or four major shapes. Entire mark compact and approximately square, strongly readable at 32px. Simple broad surfaces with subtle brushed steel grain and carefully finished bevels. No diagonal pointer, parallel scanner tracks, page-leaf shape, individual engine symbols, gears, wrench, shield or tiny screw detail. This is a refined render, not a flat vector or text glyph on a square.
Camera: nearly frontal, very slight three-quarter depth, whole object in focus. Warm studio light from upper left. Neutral steel, warm graphite, one muted oxide insert. No orange glow or copper shine. Centered complete object with 10% clear margin. No wordmark, caption, text, watermark, app tile background, opaque floor or background color.
Genuine transparent alpha background including spaces between arms; preserve soft object edges. Output only the original family mark.
```

## Complete homepage

```text
Use case: ui-mockup.
Asset type: complete high-fidelity Ferramenta FAMILY homepage design, full long page from navigation through footer, light theme only.

Input images:
1. Approved Ferromark warm editorial homepage: authority for typography, palette, material character, spacious narrow-left-introduction editorial layout. It is NOT a request to reuse product text.
2. New Ferramenta seven-position register: exact hero instrument to use once in the top hero.
3. New Ferramenta rendered F fixture: exact family logo mark for header and footer.
4. Labeled strip of all seven existing engine icons: use each corresponding recognizable mark in the seven-engine index. Labels are reference data, not a strip to paste as page decoration.

Create one intentional complete family landing page that belongs to the exact same warm precision-engineering family. Beige fine-fiber paper #F4F0E6, calm reading inlays #FBFAF6, light matte pewter #DCDDD6, dark warm ink #29362F, muted ink #5C655B and restrained rust-brown oxide #88492F. Subtle texture in the paper and a hard-edged light pewter MATERIAL section for the reference table. No dark bands, gradient washes, wave backgrounds, colorful blocks or ornamental page-divider lines. Clear Helvetica-Neue-like grotesk, generously spaced. A light, carefully finished and durable instrument quality. One hero only; body content carried by real prose, compact actual icons and a useful table, not repeated object pictures.

Layout: desktop full-page screenshot with generous gutters and a reading width around 1240 CSS px. Upper navigation left F mark and Ferramenta wordmark, right links "Engines", "Choosing an engine", "The workshop", "GitHub". Top hero is a balanced split: product-name-first left, exact seven-position instrument right. After hero, EVERY body section must retain a narrow left introductory margin, around 150–180px wide, separated from the broad main content by around 60px empty gutter. This distinctive margin is essential, don't switch to full-width headings or a centered SaaS grid. Allow generous 100–140px vertical intervals between stories and around 70px between the two main reading columns. Small text is readable dark ink on quiet light material.

Verbatim hero:
"Ferramenta."
"A family of Rust engines."
"Focused tools for text, code and documents. Choose the engine your work needs, with a shared standard of care and a contract of its own."
Buttons: "Explore the engines" and "Source on GitHub".

First story left margin: "The engines" and "Seven independent engines. One workshop."
Broad content heading: "Seven engines, each with a job."
Intro: "Each engine has its own scope, documentation and repository. Start with the task in front of you."
Create an airy TWO-COLUMN editorial index of seven entries, unboxed, with real matching small rendered icons from input4, product name and plain-language role. The seventh can share its row with a short typographic note that the tools are adopted independently. Do not remove or duplicate any engine. Each entry has a concise explanation and a useful small text link:
"Ferroni" / "A regex engine" / "Oniguruma regular expressions and a multi-pattern scanner in Rust." / "Explore Ferroni"
"Ferriki" / "A syntax highlighter" / "Highlight code with the grammars and themes your editor uses." / "Explore Ferriki"
"Ferromark" / "A Markdown renderer" / "Turn Markdown into HTML, with CommonMark and GFM as the reference." / "Explore Ferromark"
"Ferrolex" / "A spell checker" / "Check prose and code with Hunspell dictionaries and deterministic suggestions." / "Ferrolex repository"
"Ferrocat" / "A translation catalog engine" / "Read, merge and compile translation catalogs." / "Explore Ferrocat"
"Ferralk" / "A glob matcher and file walker" / "Match glob patterns and walk file trees in parallel." / "Ferralk repository"
"Ferrugo" / "A PDF preview renderer" / "Render PDF previews under explicit resource limits." / "Ferrugo repository"
Do not add version numbers, maturity badges, download counts, benchmark bars or spurious metrics.

Second story on very light brushed-pewter texture, with hard section edges: left margin "Familiar contracts" and "Know what you are choosing."
Broad heading "Familiar inputs. Explicit boundaries."
One short intro then a calm refined THREE-COLUMN table: "Engine", "Familiar foundation", "Evidence to look for".
Seven rows:
"Ferroni" | "Oniguruma regular expressions" | "Compatibility oracle"
"Ferriki" | "TextMate grammars and editor themes" | "Mirrored Shiki tests"
"Ferromark" | "CommonMark and GFM" | "Conformance cases"
"Ferrolex" | "Hunspell dictionaries" | "Deterministic suggestion scoring"
"Ferrocat" | "PO and ICU MessageFormat" | "Upstream conformance cases"
"Ferralk" | "Glob syntax and .gitignore rules" | "Frozen zlob reference"
"Ferrugo" | "PDF" | "Explicit memory and time limits"
Table is evidence orientation, not a cross-product performance comparison. Flat fine row rules only inside table, generous row padding, left-aligned text, useful hierarchy. Below: "Read each project's evidence and limits before adopting it."

Third story back on warm paper: narrow left margin "The workshop" and "Built with care. Adopted independently."
Main heading "Shared workmanship. Independent tools."
Two unboxed prose columns with headings "Take the tool you need." and "Keep the evidence close."
Copy first: "The family is a way to find related work, not a required stack. Each engine keeps a focused purpose. Where two fit together, their documentation explains the relationship."
Copy second: "Read the reference tests, compatibility notes and measurements in each repository. That is where the conditions stay attached to the claim."
Small workshop line: "Built by Sebastian Software in Mainz, Germany." Link "Talk to the workshop".
Footer F mark plus "Ferramenta", "Rust engines from one workshop.", "GitHub", "Imprint", "Privacy". Include a quiet "Design review" link.

Constraints: show the COMPLETE page including all SEVEN entries, seven reference-table rows, workshop and footer. Full portrait long-page comp with sufficient height to preserve the generous spacing, roughly 1400 by 3600 proportions. Do not squeeze content. No browser chrome, developer annotations, poster frame or watermark. Match the approved family look instead of inventing a new layout. Engines are independent: absolutely no inter-engine arrows, conveyor, numbered steps or compulsory chain. Only one large illustration: the supplied hero register.
```
