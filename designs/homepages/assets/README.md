# Archived homepage surface materials

These surface assets are retained as iteration history. The current HTML baseline no longer references them; decorative section backgrounds were removed before the new Imagegen design round.

The shared homepage CSS combines quiet material texture with static light gradients. Texture is confined to decorative pseudo-elements; text, code and table content are not filtered. The spacious layout and story proportions are unchanged.

- **Silver evidence ground:** the original built-in Imagegen [fine brushed steel master](../../round-02-precision-rust/assets/fine-brushed-steel.png), fitted once across the surface with a 22% multiply overlay. Its [exact prompt and provenance](../../round-02-precision-rust/assets/fine-brushed-steel.png.json) remain beside the original asset. A broad light gradient provides the change in reflection across the surface. Using one fitted image avoids visible tile joins.
- **Paper example ground:** `paper-grain.svg`, a deterministic 240px SVG tile with three octaves of static fractal noise, seed 17 and a low-alpha warm monochrome matrix. It is composed at 50% opacity over a warm directional light gradient. This is authored vector/CSS texture, not an Imagegen output.
- **Section boundaries:** silver uses a shallow diagonal cut; paper uses the opaque `section-wave-top.svg` and `section-wave-bottom.svg` masks. Wave caps have a fixed height, so longer mobile content never stretches the wave vertically. The two-pixel overlap with the solid center avoids a hairline join. Both material layers share the same cut.
- The surfaces end at crisp boundaries. Light gradients stay inside the material; no surface fades into white. There are no animated filters, scratched edges, dirt, panel borders or dark surfaces.

This applies Effective Web's SVG texture and CSS integration guidance. Each product assigns the same material to the same content role: measured evidence uses silver, worked examples use paper.
