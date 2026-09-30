#!/bin/sh
# Builds the three textures the package ships from their masters.
# Run from the repository root: sh design/textures/build-textures.sh
set -eu
masters=design/textures/masters
out=packages/family/textures

# The plate. Desaturated to a neutral steel, its contrast flattened so dark
# text holds on every streak, a light veil laid over it, and a little warmth:
# the family's greys are those of blackened steel, not of a cool blue-grey.
magick "$masters/steel-brushed.webp" -modulate 97,50,100 +sigmoidal-contrast 12x50% \
  -fill white -colorize 10 -fill '#9a8567' -colorize 20 -resize 1400x \
  -quality 72 -define webp:method=6 "$out/steel.webp"

# Oak. The bench the plates lie on: dark smoked oak, pulled almost halfway to
# a near-black brown, so its grain is there at a second look and light text
# holds on it.
magick "$masters/oak-dark.webp" -fill '#1a130f' -colorize 45 -resize 1600x \
  -quality 78 -define webp:method=6 "$out/oak.webp"

# Rust. Darkened and desaturated, then mirrored into a tile that repeats
# without a seam.
magick "$masters/powdercoat.webp" -modulate 64,58,100 -resize 600x600 \
  \( +clone -flop \) +append \( +clone -flip \) -append \
  -quality 66 -define webp:method=6 "$out/rust.webp"
