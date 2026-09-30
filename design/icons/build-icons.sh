#!/bin/sh
# Builds the rendered icons the package ships from their masters: the
# transparent margin trimmed to the object, the object centered on a square
# with a little air, then two sizes (640px for a hero plate, 256px for a
# catalog plate). The flat twins come from trace-flat.py.
# Run from the repository root: sh design/icons/build-icons.sh
# ICON_MASTERS and ICON_OUT point it at another pair of directories, for an
# icon that is not a family member's (the kit's sample tool).
set -eu
masters=${ICON_MASTERS:-design/icons/masters}
out=${ICON_OUT:-packages/family/icons}
for src in "$masters"/*.webp; do
  name=$(basename "$src" .webp)
  case "$name" in *-flat) continue ;; esac
  magick "$src" -trim +repage -background none -gravity center \
    -extent "%[fx:max(w,h)*1.06]x%[fx:max(w,h)*1.06]" \
    -write mpr:object +delete \
    \( mpr:object -resize 640x640 -quality 86 -define webp:method=6 -define webp:alpha-quality=95 -write "$out/$name.webp" +delete \) \
    \( mpr:object -resize 256x256 -quality 86 -define webp:method=6 -define webp:alpha-quality=95 -write "$out/$name-256.webp" +delete \) \
    null:
done

# The family's own flat icon is also the site's brand mark: the favicon source
# (vite.config.ts) and the image every README's family block loads from `main`.
# The path is a contract with those READMEs, so the file is copied, not moved.
if [ "$out" = packages/family/icons ] && [ -f "$out/ferramenta-flat.svg" ]; then
  cp "$out/ferramenta-flat.svg" app/assets/brand/logo-light.svg
  cp "$out/ferramenta-flat.svg" app/assets/brand/logo-dark.svg
fi
