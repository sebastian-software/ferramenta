# Shared homepage layout

Current status, October 19, 2026: the decorative section backgrounds have been removed from both HTML pages. The whitespace and reading structure remain as a baseline. The selected visual layout is Working specimen, images 31 and 32, with narrow left introductory columns. [Round six](../round-06-warm-specimen/index.html) combines it with the preferred warm Paper & pewter material system. The material and boundary sections below record superseded HTML iterations.

Current review target: [Ferromark](ferromark.html) and [Ferroni](ferroni.html).

The image compositions remain in round 03 as history. These two local HTML compositions make the accepted identity and editorial content precise, consistent and responsive. They share one stylesheet and the header, footer, story, table and action templates in `build-pages.mjs`. Production code is outside this study.

## Visual plan

- White `#ffffff`, warm paper `#fafaf7`, graphite `#26312e`, secondary ink `#59635d`, silver `#d9ded9`, oxide `#8d482c`.
- Helvetica Neue / system sans for the regular-width industrial text; system monospace for code. Body 18px / 1.75, headings 30px / 1.25, notes 15px / 1.65.
- The instrument is the single large image. Left-aligned editorial stories, measured charts and readable tables carry the rest of the page.
- A centered 1200px reading frame, 128px desktop column gutters, 160px between every editorial story, 24px after headings and between paragraphs, 24px table-cell vertical padding (28px in the wide policy table), and 160px before the footer. No horizontal section dividers or vertical article dividers.
- On narrower screens, preserve readable measure by stacking the columns; reduce section rhythm to 96px and outer margins to 24px. Keep every paragraph, table row, caveat and next action.

```text
Header: mark + name / navigation / family
Hero: introduction          instrument
       actions             short semantic caption

Working example, with generous internal padding

160px
Story                      evidence / table
                           <128px column gutter>
160px
Next story                 worked example / evidence
...
160px
Closing story              installation
160px
Footer
```

## Review against the brief

The material vocabulary and single instrument remain specific to these libraries. The page is not rebuilt as a repeated card collection or newspaper grid. Whitespace replaces decorative rules. One shared story primitive owns horizontal spacing and one parent stack owns vertical spacing, including the final action. Tables and demo frames retain only functional lines. Each heading stays with its own text.

The earlier generated spacing revision remained uneven, especially around Ferromark's final action. It is retained as `*-home-v3.png`; the HTML pages are the current spacing authority.

## Sources and verification

Frontend Design and Effective Web's layout, typography and responsive guidance were re-read at the explicitly supplied Dalo paths on October 19, 2026. Impeccino's layout playbook and craft floor inform the scoped checks. The accepted copy and recorded measurements come from round 03's `content/*-home-v2.md` and `evidence/`.

Run `node designs/homepages/build-pages.mjs` from the repository root to rebuild. Open through a local static server rooted at `designs/` (or open the HTML files directly). Both pages have no runtime dependencies, analytics or remote fonts.

## Verified outcome

Browser checks at 320, 390, 768, 920, 1100 and 1440 CSS pixels confirmed identical story gaps across both products at each width, no document-level horizontal overflow, no broken images and no body object photography. Desktop screenshots and 390px mobile captures are saved beside the HTML; `layout-verification.json` contains the observed geometry. The narrow policy table supports keyboard scrolling with a visible focus outline. Logo previews were checked at their actual 32/48/64 CSS sizes, and ICO frames were verified.

The source detector reports only advisories. The palette, Helvetica Neue, small corner radii and type scale belong to this explicitly requested exploration, separately from production DESIGN.md. Its table-wrapper padding warning is structural: readable insets are owned by the padded table cells rather than an extra outer frame. No primary finding remains.

## Light surface and composition refinement

White reading passages now alternate with pale silver (`#f0f3f0`) for measured evidence and warm paper (`#f7f4ee`) for a worked scanner or API notebook. The surface extends into the existing whitespace, without adding divider rules or reducing the 160px story rhythm. All surfaces remain light.

The opening article gives more width to the main narrative, while scanner and notebook sections give more width to their worked examples. Ferroni’s continuation story uses a narrow title column and a broad reading column; its benchmark now has a dedicated evidence band. The same content roles share the same surfaces across both products. Gutters, paragraph spacing and responsive behavior remain shared.

## Material texture and light gradients

The silver evidence surface now reuses the original Imagegen brushed-steel master, fitted once without tile seams at 22% multiply opacity. A broad static light gradient gives it a restrained change in reflection. Paper examples combine a warm directional light gradient with an authored low-alpha SVG grain tile. Light gradients remain inside the material; crisp diagonal and wave-shaped boundaries separate each material from white. No divider rule, shadow, animation or dark theme is added. Textured regions use slightly deeper secondary ink for small labels. Content, hero objects, whitespace and column proportions are unchanged.

See [material assets and derivation](assets/README.md). Effective Web’s texture and CSS integration routes informed this refinement.

Material checks at 390px and 1440px confirmed that the two surfaces, white-space rhythm and responsive columns render on both pages without horizontal overflow. Desktop/mobile screenshots and the two material-detail crops were refreshed. A conservative contrast bound using independent minimum texture channels gives 4.77:1 for the 15px secondary text on silver; the scoped oxide link ink is deeper as well.

## Crisp material boundaries

The feathered edges were rejected and removed. Silver evidence sections now use a crisp shallow diagonal cut (48px on desktop, 20px on compact screens). Paper examples use one broad, quiet wave on their top and bottom edges, authored as opaque SVG masks. The 64px desktop and 40px compact wave caps retain their height independently of article length; a solid middle joins them. Both light and grain layers use the same outline. Nothing fades into the surrounding white.

The desktop material extends 88px above and below its content, leaving comfortable clearance after the 48px diagonal cut. Compact surfaces extend 64px with a 20px cut. Text and keyboard focus are outside the decorative masks. Browser checks at 320, 390, 768, 1100 and 1440px on both products confirmed unchanged story spacing and no horizontal overflow; results are in `section-edge-verification.json`. Updated desktop/mobile screenshots and `*-cut-detail.png` captures show the current direction. Earlier detail crops remain comparison images.
