# Imagegen prompt set

Mode: built-in Imagegen, one complete page per call. The Ferromark material studies use the selected editorial concept as the edit target. Each Ferroni page uses its selected editorial concept as the edit target and its paired Ferromark page as a material and color reference.

All final images, exact prompts and provenance sidecars are saved here. Source copy in round four remains authoritative.

## 35 · Ferromark · Paper & pewter

[View concept](a-ferromark.html) · [PNG](35-paper-pewter-ferromark.png) · [Provenance](35-paper-pewter-ferromark.png.json)

Inputs:

- [../round-04-design-directions/29-editorial-folio-ferromark.png](../round-04-design-directions/29-editorial-folio-ferromark.png): selected editorial layout and identity edit target.

```text
Use case: style-transfer. Asset type: one complete high-fidelity homepage art direction, including material, color and tables.

Image 1 is the selected Ferromark editorial homepage concept and the EDIT TARGET. The user prefers this layout. Preserve its actual content, composition, generous spacing, grotesk typography, meaningful document-registration hero instrument, small logo, order of stories and data accuracy. Do not change it into another layout. The page is a refined precision-engineered Rust library, warm and premium, never brutal or dirty.

New design task: develop the complete color AND material system. The earlier flat-white-background restriction is superseded. This must be a considered whole-page material direction, not just layout changes or a few little texture patches. Keep light theme only. Materials should enrich reading and evidence without reducing clarity.

Direction: Paper & pewter
Palette roles: paper #F4F0E6, inlay #FBFAF6, pewter #DCDDD6, ink #29362F, muted #5C655B, accent #88492F.
Create a tangible warm uncoated ivory paper reading surface with a very fine, restrained fiber texture. The paper is an intentional designed material, visible but never dirty, distressed, mottled or vintage. Keep it warm but avoid a generic beige-and-serif theme: preserve the approved humanist grotesk typography and the engineering hero. Use graphite-green ink, satin pewter, and deep iron-oxide copper for actions and selected data. One broad evidence spread feels like finely finished pewter with a warm, directional grazing light across its material grain; gentle luminosity belongs to the material, not to a decorative gradient cloud. Put small text on clean ivory inset reading surfaces. Make two or three substantial material grounds across the complete page, with deliberate crisp boundaries. The result should have compositional depth across a whole story, not little patchy texture accents. Rework table typography and rules to suit the stock: generous rows, naturally aligned labels, decimal-aligned numbers, quiet engraved-like functional rules, a clear header and source note. The policy ledger stays open and readable; the full-width benchmark figure is the clearest material moment. Keep large reading areas calm. No woodgrain, grunge, fake screws framing the content, stickers, cards with decorative shadows, large illustrations below the hero, or thick section separators.

Preserve all meaningful object shapes. No extra objects below the hero. Do not add fake stats or testimonials. Keep all text in US English. The exact content below remains authoritative. Output the complete full-page desktop design, uncropped, no browser frame or presentation board. Subtle realistic light changes over the material surface are welcome; decorative color washes, glow blobs, dirt and dark theme are prohibited.

Exact content and data:
Header: Ferromark. Overview. Start with Rust. Rendering. Benchmarks. GitHub. The Ferramenta family.
Hero title: Ferromark.
Purpose headline: Markdown, ready for your pipeline.
Hero description: Turn Markdown into HTML and the metadata around it. A focused Rust engine for the documents that get complicated.
Primary action: Start with Rust. Secondary action: Node.js guide.

Working example title: See what a document becomes.
Markdown input is the heading "# Release notes", followed by the list "- Clear structure" and "- Useful metadata". The rendered output must show the heading Release notes and exactly those two list items.

Opening story: Correctness is a contract.
A Markdown engine has to earn trust on the awkward document: a nested list, a reference that moves, a table with real content, or a footnote added at the last minute. Ferromark starts with CommonMark and GFM, then makes the publishing features explicit.
Specification profiles turn off publishing extras so that conformance can be checked on its own terms. Optional heading IDs, front matter and footnotes belong to a documented output contract.
A small publishing ledger: Front matter — extracted as raw text; Heading IDs — configurable output; Footnotes — document references and notes; Rendering hooks — your application decides.

Measured figure title: Speed, with the conditions attached.
Fresh throughput relative to Ferromark v2, higher is faster.
Exact rows: Ferromark v2 1.00×; Ferromark v1 0.48×; pulldown-cmark 0.38×; md4c 0.29×; Bun native 0.17×.
Provenance: September 21, 2026. Apple M1 Pro. Revision 39b1f0b7. 50 documents with equivalent HTML across five engines, from a frozen 57-document corpus. Other cases remain diagnostics. Fresh and reuse are separate lifecycles. These recorded figures do not promise every workload.
Link: Read the measurements and exact flags.

Policy reference title: Recognition is not permission.
The engine can recognize raw HTML without granting permission to emit it.
Table columns: API | Default | For untrusted Markdown.
Exact rows: Rust | Raw HTML passthrough | Enable sanitize.
Node.js | Escaped HTML and filtered URL schemes | Keep renderPolicy: 'untrusted'.
Footnote: Custom hooks and highlighter HTML are written verbatim. They must escape untrusted values themselves.
Link: Choose your rendering policy.

Publishing note: The document, beyond paragraphs.
Extract front matter as raw text; the application interprets YAML or TOML. Configure heading IDs and footnotes. Keep templates, translation, routing and syntax highlighting outside the renderer.
Closing: Build the pipeline that fits.
Start with the Rust crate, or use the native engine through Node.js. Pair Ferromark with Ferriki for syntax highlighting; neither engine requires the other.
Install: cargo add ferromark.
Footer: Ferromark. Part of Ferramenta. GitHub. Imprint. Privacy.
```

## 36 · Ferroni · Paper & pewter

[View concept](a-ferroni.html) · [PNG](36-paper-pewter-ferroni.png) · [Provenance](36-paper-pewter-ferroni.png.json)

Inputs:

- [../round-04-design-directions/30-editorial-folio-ferroni.png](../round-04-design-directions/30-editorial-folio-ferroni.png): selected Ferroni layout and identity edit target.
- [35-paper-pewter-ferromark.png](35-paper-pewter-ferromark.png): paired material, palette and table-style reference.

```text
Use case: style-transfer. Asset type: complete Ferroni homepage material and color direction.
Image 1 is the selected Ferroni editorial homepage and EDIT TARGET. Image 2 is the newly developed Ferromark "Paper & pewter" page, a MATERIAL, COLOR AND TABLE-STYLE REFERENCE only. Make Ferroni clearly belong to the same family as Image 2. Do not copy its product content or document instrument.
Preserve the complete editorial layout, spacing, story order, actual text, measurements, logo and meaningful scanner/comparator hero from Image 1. Keep the existing humanist grotesk typography and airy magazine rhythm. Match the material system, surface scale, ink colors, oxide accent, light behavior, code styling and table language of Image 2.
Direction: Paper & pewter
Palette roles: paper #F4F0E6, inlay #FBFAF6, pewter #DCDDD6, ink #29362F, muted #5C655B, accent #88492F.
Create a tangible warm uncoated ivory paper reading surface with a very fine, restrained fiber texture. The paper is an intentional designed material, visible but never dirty, distressed, mottled or vintage. Keep it warm but avoid a generic beige-and-serif theme: preserve the approved humanist grotesk typography and the engineering hero. Use graphite-green ink, satin pewter, and deep iron-oxide copper for actions and selected data. One broad evidence spread feels like finely finished pewter with a warm, directional grazing light across its material grain; gentle luminosity belongs to the material, not to a decorative gradient cloud. Put small text on clean ivory inset reading surfaces. Make two or three substantial material grounds across the complete page, with deliberate crisp boundaries. The result should have compositional depth across a whole story, not little patchy texture accents. Rework table typography and rules to suit the stock: generous rows, naturally aligned labels, decimal-aligned numbers, quiet engraved-like functional rules, a clear header and source note. The policy ledger stays open and readable; the full-width benchmark figure is the clearest material moment. Keep large reading areas calm. No woodgrain, grunge, fake screws framing the content, stickers, cards with decorative shadows, large illustrations below the hero, or thick section separators.
For Ferroni the worked regex pair remains a clear light reading specimen; the capabilities ledger is open and readable; the source/pattern-index/next-match scanner passage is a carefully composed technical specimen. Apply the broad pewter evidence material to the lower story spread with the pairwise benchmark figure, not as isolated colored patches. Tables align labels and numbers; exact pattern indexes and byte ranges are critical. No extra large pictures below the hero. Keep light theme throughout.
This is a holistic material and color exploration. The earlier flat-white restriction is superseded. Subtle illumination changes within the material texture are welcome. No decorative color gradient clouds, dirty texture, heavy industrial framing or thick section rules. Output one full-page comp, uncropped, no browser frame or presentation board. All content is US English.
Exact authoritative content:
Header: Ferroni. Overview. Start with Rust. Scanner. Benchmarks. GitHub. The Ferramenta family.
Hero title: Ferroni.
Purpose headline: Oniguruma regex, in memory-safe Rust.
Hero description: Run familiar patterns, from lookbehind to recursion, and the scanner that syntax highlighters drive.
Primary action: Start with Rust. Secondary action: Explore the scanner.

Working example title: See what the pattern finds.
Pattern: (?<=item-)\d+
Text: item-104  item-208
Matches: 104, 208

Opening story: Patterns carry a contract.
Existing grammars and applications depend on how lookbehind, captured text, Unicode properties and recursive patterns behave. Rewriting the expression can change that behavior just as surely as changing the engine.
Ferroni continues Oniguruma's expressive syntax in Rust. Choose it when that compatibility matters: an editor grammar, a highlighter, or a search that depends on a feature the regex crate deliberately leaves out.
Selected syntax checks, not a blanket compatibility score.
Exact feature table columns: Feature | Ferroni | Rust regex.
Rows: Lookahead and lookbehind | Yes | No.
Backreferences | Yes | No.
Unicode character properties | Yes | Yes.

Worked scanner figure: One line. Several patterns. The next match.
A TextMate grammar asks which pattern matches next from a position in the line. The scanner returns the leftmost match, its pattern index and capture ranges. The tokenizer resumes at the previous match's end.
Source: const answer = 42 // note
Pattern indexes: 0 keywords, 1 strings, 2 comments, 3 numbers.
Exact ledger columns: Resume at byte | Next match | Pattern index | Byte range.
Rows: 0 | const | 0 | 0..5.
5 | 42 | 3 | 15..17.
17 | // note | 2 | 18..25.
Note: Regular scanner offsets are bytes; explicit UTF-16 methods support editor text models.
Link: Understand the scanner.

Continuation: Continued with care.
Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, with compatibility checks against the original. Rust's regex crate makes a different tradeoff: it leaves out lookaround and backreferences for predictable linear-time searching.

Evidence figure title: Reuse changes the picture.
Ferroni throughput relative to each comparator; higher is faster.
Exact table columns: Comparator | macOS ARM64 | Linux x86-64.
C Oniguruma | 3.44× | 2.75×.
PCRE2 JIT | 0.70× | 0.63×.
Provenance: Steady reuse. 21 tasks per pair. 513 corpus inputs. October 15, 2026. Revision 1c8d45f. Blacksmith VMs, macOS ARM64 and Linux x86-64.
Caveats: C Oniguruma compiles patterns faster. PCRE2 JIT remains faster in the steady-reuse aggregates shown here. Every task checks expected output before timing. These are isolated regex steps, not whole-application benchmarks.
Link: Read the complete benchmarks.

Closing story: Put a boundary around the work.
Memory safety does not make every pattern cheap. Choose retry budgets and supported time limits for untrusted input. Browser WebAssembly uses retry limits instead of timeouts. Reuse compiled patterns where the workload allows it.
Install: cargo add ferroni.
Footer: Ferroni. Part of Ferramenta. GitHub. Imprint. Privacy.
```

## 37 · Ferromark · Porcelain & titanium

[View concept](b-ferromark.html) · [PNG](37-porcelain-titanium-ferromark.png) · [Provenance](37-porcelain-titanium-ferromark.png.json)

Inputs:

- [../round-04-design-directions/29-editorial-folio-ferromark.png](../round-04-design-directions/29-editorial-folio-ferromark.png): selected editorial layout and identity edit target.

```text
Use case: style-transfer. Asset type: one complete high-fidelity homepage art direction, including material, color and tables.

Image 1 is the selected Ferromark editorial homepage concept and the EDIT TARGET. The user prefers this layout. Preserve its actual content, composition, generous spacing, grotesk typography, meaningful document-registration hero instrument, small logo, order of stories and data accuracy. Do not change it into another layout. The page is a refined precision-engineered Rust library, warm and premium, never brutal or dirty.

New design task: develop the complete color AND material system. The earlier flat-white-background restriction is superseded. This must be a considered whole-page material direction, not just layout changes or a few little texture patches. Keep light theme only. Materials should enrich reading and evidence without reducing clarity.

Direction: Porcelain & titanium
Palette roles: paper #F6F8F5, inlay #FFFFFF, titanium #DBE4E3, ink #26373B, muted #526467, accent #905234.
Create a distinctly cooler material direction: mineral-white porcelain reading grounds, pale blue-grey bead-blasted titanium, dark blue-graphite ink, and precise warm oxide accents. The visual reference is an immaculate precision calibration workshop in daylight, refined and light, with warmth from oxide and neutral metallic reflections. Preserve the approved humanist grotesk typography, existing composition and actual engineering hero. Make two or three broad, purposeful material grounds across the full page; let one substantial pale titanium evidence spread terminate in a very shallow, clean diagonal. The reading surfaces remain white or extremely light. Titanium has a fine physically plausible bead-blasted micrograin and a broad directional change of illumination over that grain, not a CSS-looking color gradient or blurred glow. The texture belongs to the entire material surface and is visible at normal viewing scale, yet understated. Small copy and data sit on calm porcelain-white inlays without losing the breadth of the composition. Treat the benchmark as an engraved calibration figure: plain clear units, airy numeric rows, aligned decimals, strong label-to-value relationship, very fine functional rules. The policy/capability ledgers have a quieter shared typography and clear comparisons, without generic filled header rows or rounded app cards. No dark sections, cool neon colors, gradients floating over flat backgrounds, wave decorations, industrial dirt, photo walls or decorative section rules.

Preserve all meaningful object shapes. No extra objects below the hero. Do not add fake stats or testimonials. Keep all text in US English. The exact content below remains authoritative. Output the complete full-page desktop design, uncropped, no browser frame or presentation board. Subtle realistic light changes over the material surface are welcome; decorative color washes, glow blobs, dirt and dark theme are prohibited.

Exact content and data:
Header: Ferromark. Overview. Start with Rust. Rendering. Benchmarks. GitHub. The Ferramenta family.
Hero title: Ferromark.
Purpose headline: Markdown, ready for your pipeline.
Hero description: Turn Markdown into HTML and the metadata around it. A focused Rust engine for the documents that get complicated.
Primary action: Start with Rust. Secondary action: Node.js guide.

Working example title: See what a document becomes.
Markdown input is the heading "# Release notes", followed by the list "- Clear structure" and "- Useful metadata". The rendered output must show the heading Release notes and exactly those two list items.

Opening story: Correctness is a contract.
A Markdown engine has to earn trust on the awkward document: a nested list, a reference that moves, a table with real content, or a footnote added at the last minute. Ferromark starts with CommonMark and GFM, then makes the publishing features explicit.
Specification profiles turn off publishing extras so that conformance can be checked on its own terms. Optional heading IDs, front matter and footnotes belong to a documented output contract.
A small publishing ledger: Front matter — extracted as raw text; Heading IDs — configurable output; Footnotes — document references and notes; Rendering hooks — your application decides.

Measured figure title: Speed, with the conditions attached.
Fresh throughput relative to Ferromark v2, higher is faster.
Exact rows: Ferromark v2 1.00×; Ferromark v1 0.48×; pulldown-cmark 0.38×; md4c 0.29×; Bun native 0.17×.
Provenance: September 21, 2026. Apple M1 Pro. Revision 39b1f0b7. 50 documents with equivalent HTML across five engines, from a frozen 57-document corpus. Other cases remain diagnostics. Fresh and reuse are separate lifecycles. These recorded figures do not promise every workload.
Link: Read the measurements and exact flags.

Policy reference title: Recognition is not permission.
The engine can recognize raw HTML without granting permission to emit it.
Table columns: API | Default | For untrusted Markdown.
Exact rows: Rust | Raw HTML passthrough | Enable sanitize.
Node.js | Escaped HTML and filtered URL schemes | Keep renderPolicy: 'untrusted'.
Footnote: Custom hooks and highlighter HTML are written verbatim. They must escape untrusted values themselves.
Link: Choose your rendering policy.

Publishing note: The document, beyond paragraphs.
Extract front matter as raw text; the application interprets YAML or TOML. Configure heading IDs and footnotes. Keep templates, translation, routing and syntax highlighting outside the renderer.
Closing: Build the pipeline that fits.
Start with the Rust crate, or use the native engine through Node.js. Pair Ferromark with Ferriki for syntax highlighting; neither engine requires the other.
Install: cargo add ferromark.
Footer: Ferromark. Part of Ferramenta. GitHub. Imprint. Privacy.
```

## 38 · Ferroni · Porcelain & titanium

[View concept](b-ferroni.html) · [PNG](38-porcelain-titanium-ferroni.png) · [Provenance](38-porcelain-titanium-ferroni.png.json)

Inputs:

- [../round-04-design-directions/30-editorial-folio-ferroni.png](../round-04-design-directions/30-editorial-folio-ferroni.png): selected Ferroni layout and identity edit target.
- [37-porcelain-titanium-ferromark.png](37-porcelain-titanium-ferromark.png): paired material, palette and table-style reference.

```text
Use case: style-transfer. Asset type: complete Ferroni homepage material and color direction.
Image 1 is the selected Ferroni editorial homepage and EDIT TARGET. Image 2 is the newly developed Ferromark "Porcelain & titanium" page, a MATERIAL, COLOR AND TABLE-STYLE REFERENCE only. Make Ferroni clearly belong to the same family as Image 2. Do not copy its product content or document instrument.
Preserve the complete editorial layout, spacing, story order, actual text, measurements, logo and meaningful scanner/comparator hero from Image 1. Keep the existing humanist grotesk typography and airy magazine rhythm. Match the material system, surface scale, ink colors, oxide accent, light behavior, code styling and table language of Image 2.
Direction: Porcelain & titanium
Palette roles: paper #F6F8F5, inlay #FFFFFF, titanium #DBE4E3, ink #26373B, muted #526467, accent #905234.
Create a distinctly cooler material direction: mineral-white porcelain reading grounds, pale blue-grey bead-blasted titanium, dark blue-graphite ink, and precise warm oxide accents. The visual reference is an immaculate precision calibration workshop in daylight, refined and light, with warmth from oxide and neutral metallic reflections. Preserve the approved humanist grotesk typography, existing composition and actual engineering hero. Make two or three broad, purposeful material grounds across the full page; let one substantial pale titanium evidence spread terminate in a very shallow, clean diagonal. The reading surfaces remain white or extremely light. Titanium has a fine physically plausible bead-blasted micrograin and a broad directional change of illumination over that grain, not a CSS-looking color gradient or blurred glow. The texture belongs to the entire material surface and is visible at normal viewing scale, yet understated. Small copy and data sit on calm porcelain-white inlays without losing the breadth of the composition. Treat the benchmark as an engraved calibration figure: plain clear units, airy numeric rows, aligned decimals, strong label-to-value relationship, very fine functional rules. The policy/capability ledgers have a quieter shared typography and clear comparisons, without generic filled header rows or rounded app cards. No dark sections, cool neon colors, gradients floating over flat backgrounds, wave decorations, industrial dirt, photo walls or decorative section rules.
For Ferroni the worked regex pair remains a clear porcelain reading specimen; the capabilities ledger is open and readable; the source/pattern-index/next-match scanner passage is a carefully composed technical specimen. Apply one broad pale titanium evidence material to the lower story spread with the pairwise benchmark figure, with the same shallow diagonal edges as the paired Ferromark reference. Preserve large clean-white prose areas. The tables must align labels and numbers; exact pattern indexes and byte ranges are critical. No extra large pictures below the hero. Keep light theme throughout.
This is a holistic material and color exploration. The earlier flat-white restriction is superseded. Subtle illumination changes within the material texture are welcome. No decorative color gradient clouds, dirty texture, heavy industrial framing, thick section rules, dark areas or bright neon colors. Output one full-page comp, uncropped, no browser frame or presentation board. All content is US English.
Exact authoritative content:
Header: Ferroni. Overview. Start with Rust. Scanner. Benchmarks. GitHub. The Ferramenta family.
Hero title: Ferroni.
Purpose headline: Oniguruma regex, in memory-safe Rust.
Hero description: Run familiar patterns, from lookbehind to recursion, and the scanner that syntax highlighters drive.
Primary action: Start with Rust. Secondary action: Explore the scanner.

Working example title: See what the pattern finds.
Pattern: (?<=item-)\d+
Text: item-104  item-208
Matches: 104, 208

Opening story: Patterns carry a contract.
Existing grammars and applications depend on how lookbehind, captured text, Unicode properties and recursive patterns behave. Rewriting the expression can change that behavior just as surely as changing the engine.
Ferroni continues Oniguruma's expressive syntax in Rust. Choose it when that compatibility matters: an editor grammar, a highlighter, or a search that depends on a feature the regex crate deliberately leaves out.
Selected syntax checks, not a blanket compatibility score.
Exact feature table columns: Feature | Ferroni | Rust regex.
Rows: Lookahead and lookbehind | Yes | No.
Backreferences | Yes | No.
Unicode character properties | Yes | Yes.

Worked scanner figure: One line. Several patterns. The next match.
A TextMate grammar asks which pattern matches next from a position in the line. The scanner returns the leftmost match, its pattern index and capture ranges. The tokenizer resumes at the previous match's end.
Source: const answer = 42 // note
Pattern indexes: 0 keywords, 1 strings, 2 comments, 3 numbers.
Exact ledger columns: Resume at byte | Next match | Pattern index | Byte range.
Rows: 0 | const | 0 | 0..5.
5 | 42 | 3 | 15..17.
17 | // note | 2 | 18..25.
Note: Regular scanner offsets are bytes; explicit UTF-16 methods support editor text models.
Link: Understand the scanner.

Continuation: Continued with care.
Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, with compatibility checks against the original. Rust's regex crate makes a different tradeoff: it leaves out lookaround and backreferences for predictable linear-time searching.

Evidence figure title: Reuse changes the picture.
Ferroni throughput relative to each comparator; higher is faster.
Exact table columns: Comparator | macOS ARM64 | Linux x86-64.
C Oniguruma | 3.44× | 2.75×.
PCRE2 JIT | 0.70× | 0.63×.
Provenance: Steady reuse. 21 tasks per pair. 513 corpus inputs. October 15, 2026. Revision 1c8d45f. Blacksmith VMs, macOS ARM64 and Linux x86-64.
Caveats: C Oniguruma compiles patterns faster. PCRE2 JIT remains faster in the steady-reuse aggregates shown here. Every task checks expected output before timing. These are isolated regex steps, not whole-application benchmarks.
Link: Read the complete benchmarks.

Closing story: Put a boundary around the work.
Memory safety does not make every pattern cheap. Choose retry budgets and supported time limits for untrusted input. Browser WebAssembly uses retry limits instead of timeouts. Reuse compiled patterns where the workload allows it.
Install: cargo add ferroni.
Footer: Ferroni. Part of Ferramenta. GitHub. Imprint. Privacy.
```
