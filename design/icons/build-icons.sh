#!/bin/sh
# Builds the icons the package ships from their masters: the transparent
# margin trimmed to the object, the object centered on a square with a little
# air, then three sizes: 640px for a hero plate, 256px for a catalog plate,
# and 96px for every small place (the header, a list; shown at 24 to 48px).
# Run from the repository root: sh design/icons/build-icons.sh
# ICON_MASTERS and ICON_OUT point it at another pair of directories, for an
# icon that is not a family member's (the kit's sample tool).
set -eu
masters=${ICON_MASTERS:-design/icons/masters}
out=${ICON_OUT:-packages/family/icons}
for src in "$masters"/*.webp; do
  name=$(basename "$src" .webp)
  magick "$src" -trim +repage -background none -gravity center \
    -extent "%[fx:max(w,h)*1.06]x%[fx:max(w,h)*1.06]" \
    -write mpr:object +delete \
    \( mpr:object -resize 640x640 -quality 86 -define webp:method=6 -define webp:alpha-quality=95 -write "$out/$name.webp" +delete \) \
    \( mpr:object -resize 256x256 -quality 86 -define webp:method=6 -define webp:alpha-quality=95 -write "$out/$name-256.webp" +delete \) \
    \( mpr:object -resize 96x96 -unsharp 0x0.6+0.6+0.02 -quality 90 -define webp:method=6 -define webp:alpha-quality=100 -write "$out/$name-96.webp" +delete \) \
    null:
done

# The family's toolbox is also the site's brand mark: the favicon source
# (vite.config.ts) and the image every README's family block loads from `main`.
# Both want an SVG at a path that is a contract with those READMEs, so the
# rendered toolbox is wrapped in one. It is a picture in an SVG frame, not a
# drawing: a favicon that scales cleanly is still open (ADR-0009).
if [ "$out" = packages/family/icons ] && [ -f "$masters/ferramenta.webp" ]; then
  tmp=$(mktemp -d)
  magick "$masters/ferramenta.webp" -trim +repage -background none -gravity center \
    -extent "%[fx:max(w,h)*1.06]x%[fx:max(w,h)*1.06]" -resize 144x144 \
    -define png:compression-level=9 "$tmp/toolbox.png"
  for scheme in light dark; do
    {
      printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144" width="144" height="144">'
      printf '<image width="144" height="144" href="data:image/png;base64,'
      base64 < "$tmp/toolbox.png" | tr -d '\n'
      printf '"/></svg>\n'
    } > "app/assets/brand/logo-$scheme.svg"
  done
  rm -r "$tmp"
fi
