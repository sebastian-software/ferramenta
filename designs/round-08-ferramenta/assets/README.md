# Ferramenta asset kit

The original transparent family [mark](ferramenta/mark-master.png) and [seven-position register](ferramenta/hero.png) were created with built-in Imagegen. Their exact prompts, input roles, dimensions and hashes are recorded in sidecars. The masters are preserved unchanged.

Use [logo-lockup.png](ferramenta/logo-lockup.png) for the horizontal Ferramenta logo, or the standalone mark with real text. The wordmark uses Helvetica Neue Regular rather than generated lettering.

The mark kit contains 32, 48, 64, 128, 256 and 512px transparent PNGs, a favicon.ico with 32/48/64px frames, and an opaque 180px Apple touch icon. There is no 16px export. The icon comparison renders the PNGs at their actual CSS sizes.

Exporting measures the visible content bounds using a temporary alpha mask, removes only transparent master padding, centers the original pixels at 87.5% square and resizes with Lanczos. The measuring threshold is never applied to the exported color pixels. There is no redraw or material edit. Rebuild with ../build-assets.mjs.

The engines/ folder contains unchanged copies of all seven existing engine icon exports at 32, 48, 64 and 128px. Their sidecars retain original prompts and hashes and record where each copy came from. The labeled engine-icon-reference.png is a contact sheet assembled from the originals for the homepage prompt, not a new set of identities.

paper-master.png and pewter-master.png are unchanged copies of the approved round-06 warm material textures. They provide calm reading surfaces; small text is not baked into an image.

`shared/` is a generated snapshot of the shared editorial package's styles and
assets. The HTML closing section uses the actual `EditorialWorkshop` component,
including the unchanged Sebastian Software and Sebastian Consulting SVG logos.
Those two original marks retain their ownership and colors on a flat light
surface. Rebuild with `../build-review.mjs` after building the shared package.

`type-study/` contains unmodified IBM Plex Sans and Instrument Sans webfonts for
the optional local typography comparison, along with both SIL Open Font License
texts. `manifest.json` records the exact upstream revisions, URLs and hashes.
IBM Plex Sans Semibold is now selected and bundled in the shared package;
Instrument Sans remains only a comparison asset. The original raster wordmark
lettering above is retained as identity artwork.
