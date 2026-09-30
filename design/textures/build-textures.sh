#!/bin/sh
# Builds the three textures the package ships from their masters.
# Run from the repository root: sh design/textures/build-textures.sh
set -eu
masters=design/textures/masters
out=packages/family/textures

# The plate. Desaturated to a neutral steel, its contrast flattened so dark
# text holds on every streak, and a light veil laid over it.
magick "$masters/steel-brushed.webp" -modulate 97,50,100 +sigmoidal-contrast 12x50% \
  -fill white -colorize 10 -resize 1400x \
  -quality 72 -define webp:method=6 "$out/steel.webp"

# Black steel. Mill scale, pulled most of the way to a near-black, so only its
# mottling is left and the band nets close to the chrome's own color (--iron):
# a band under the header must not read as a lighter strip.
magick "$masters/millscale.webp" -fill '#0c0e11' -colorize 82 -resize 1400x \
  -quality 80 -define webp:method=6 "$out/black-steel.webp"

# Rust. Darkened and desaturated, then mirrored into a tile that repeats
# without a seam.
magick "$masters/powdercoat.webp" -modulate 64,58,100 -resize 600x600 \
  \( +clone -flop \) +append \( +clone -flip \) -append \
  -quality 66 -define webp:method=6 "$out/rust.webp"
