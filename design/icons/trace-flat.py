"""Traces the flat icon masters into the SVG and small raster the package ships.

A generated "flat" image is not flat: its areas carry faint mottling and every
edge is a band of in-between colors. Traced as it is, that becomes blotches,
slivers along the edges and curves that jump. So each image is cleaned first:

1. trimmed to its object and centered on a square, exactly as
   build-icons.sh does for the rendered icons, so an icon and its flat twin
   sit in the same place;
2. reduced to its own few colors, read from the calm interior of its areas
   and never from the edge bands;
3. smoothed by majority vote, which pulls each edge band to one side and
   straightens the boundary, and cleared of leftover specks;
4. moved onto the family palette (packages/family/icons/palette.json), one
   set of colors shared by every icon. A whole area moves at once: mapping pixel by pixel
   would split an area whose color lies between two palette colors into
   blotches of both.

The result has a handful of exact colors and hard, smooth boundaries. It is
traced into `<name>-flat.svg`, the vector a favicon or a README uses, and
scaled into `<name>-flat.webp`, the few kilobytes the site chrome loads.

The palette is a file on purpose: a new icon is mapped onto the colors the
family already has. `--derive N` measures a fresh palette of N colors from the
calm interior of every icon's areas (never from the edge bands) and rewrites
the file; do that only when the family's colors are meant to change.

The generator draws flat steel in a clean, cool grey. The rendered icons' steel
is warmer: blackened, slightly brown. So a derived palette keeps the lightness
of each grey it measured and takes the hue from the rendered icons' metal at
that lightness.

Run with a Python that has `opencv-python-headless`, `numpy` and `vtracer`:
    python design/icons/trace-flat.py [--derive N] [name ...]

`ICON_MASTERS` and `ICON_OUT` point it at another pair of directories, for an
icon that is not a family member's (the kit's sample tool). The palette stays
the family's.
"""

import json
import os
import pathlib
import re
import sys
import tempfile

import cv2
import numpy as np
import vtracer

HERE = pathlib.Path(__file__).parent
FAMILY_ICONS = HERE.parent.parent / "packages" / "family" / "icons"
MASTERS = pathlib.Path(os.environ.get("ICON_MASTERS", HERE / "masters"))
ICONS = pathlib.Path(os.environ.get("ICON_OUT", FAMILY_ICONS))
PALETTE_FILE = FAMILY_ICONS / "palette.json"
# The side of the small raster: twice the largest size the chrome shows it at.
SMALL_SIDE = 96

# How much of the rendered steel's warmth the lightest grey gives up (the
# darkest keeps all of it).
HIGHLIGHT_COOLING = 0.5
# How many colors an icon is first reduced to, before near-identical ones merge.
OWN_COLORS = 14
# Two of an icon's colors closer than this (CIE76 in OpenCV's 8-bit Lab) are one.
MERGE_DISTANCE = 9.0
# The majority vote's reach, as a share of the icon's side.
VOTE_SIGMA = 0.0014
# A leftover area smaller than this share of the icon is a speck, not a shape.
SPECK_AREA = 0.00022
# The side the icon is cleaned and traced at. Coordinates are whole numbers at
# this size, which keeps the files small without a visible step.
WORK_SIDE = 1000


def squared(image):
    """The object trimmed to its alpha and centered on a transparent square."""
    ys, xs = np.where(image[..., 3] > 16)
    crop = image[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
    height, width = crop.shape[:2]
    side = round(max(height, width) * 1.06)
    canvas = np.zeros((side, side, 4), np.uint8)
    top, left = (side - height) // 2, (side - width) // 2
    canvas[top : top + height, left : left + width] = crop
    # Premultiplied while scaling, so the transparent surround does not bleed in.
    scaled = canvas.astype(np.float32)
    scaled[..., :3] *= scaled[..., 3:] / 255
    scaled = cv2.resize(scaled, (WORK_SIDE, WORK_SIDE), interpolation=cv2.INTER_AREA)
    visible = scaled[..., 3:] > 0
    scaled[..., :3] = np.where(visible, scaled[..., :3] * 255 / np.maximum(scaled[..., 3:], 1), 0)
    return np.clip(scaled, 0, 255).astype(np.uint8)


def lab_and_calm(image, inside):
    """The image in Lab, and where its areas are calm enough to read a color from."""
    calmed = cv2.medianBlur(image[..., :3], 5)
    lab = cv2.cvtColor(calmed, cv2.COLOR_BGR2LAB).astype(np.float32)
    slope = sum(
        np.hypot(
            cv2.Sobel(lab[..., channel], cv2.CV_32F, 1, 0, ksize=3),
            cv2.Sobel(lab[..., channel], cv2.CV_32F, 0, 1, ksize=3),
        )
        for channel in (0, 1, 2)
    )
    calm = inside & (slope < 14)
    calm = cv2.erode(calm.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    return lab, calm


def own_colors(lab, calm):
    """The icon's own colors, measured where an area is calm, merged where two are alike."""
    samples = lab[calm]
    if len(samples) > 80_000:
        picks = np.random.default_rng(7).choice(len(samples), 80_000, replace=False)
        samples = samples[picks]
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 60, 0.2)
    cv2.setRNGSeed(7)
    _, labels, centers = cv2.kmeans(samples, OWN_COLORS, None, criteria, 6, cv2.KMEANS_PP_CENTERS)
    weights = np.bincount(labels.ravel(), minlength=OWN_COLORS).astype(np.float64)
    centers = centers.astype(np.float64)
    merged = True
    while merged and len(centers) > 2:
        merged = False
        distances = np.linalg.norm(centers[:, None] - centers[None], axis=2)
        np.fill_diagonal(distances, np.inf)
        a, b = np.unravel_index(np.argmin(distances), distances.shape)
        if distances[a, b] < MERGE_DISTANCE:
            total = weights[a] + weights[b]
            centers[a] = (centers[a] * weights[a] + centers[b] * weights[b]) / total
            weights[a] = total
            centers = np.delete(centers, b, axis=0)
            weights = np.delete(weights, b)
            merged = True
    return centers.astype(np.float32)


def silhouette(image, sigma):
    alpha = cv2.GaussianBlur(image[..., 3].astype(np.float32), (0, 0), sigma * 0.6)
    return alpha > 150


def hex_of(lab_colors):
    bgr = cv2.cvtColor(np.asarray(lab_colors, np.float32).reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_LAB2BGR)[0]
    return [f"#{red:02x}{green:02x}{blue:02x}" for blue, green, red in bgr.tolist()]


def lab_of(hex_colors):
    bgr = np.array(
        [[int(color[5:7], 16), int(color[3:5], 16), int(color[1:3], 16)] for color in hex_colors], np.uint8
    )
    return cv2.cvtColor(bgr.reshape(1, -1, 3), cv2.COLOR_BGR2LAB)[0].astype(np.float32)


def metal_hue(lightness):
    """The a/b of the rendered icons' steel around a given lightness."""
    tones = []
    for source in sorted(MASTERS.glob("*.webp")):
        if source.stem.endswith("-flat"):
            continue
        image = cv2.imread(str(source), cv2.IMREAD_UNCHANGED)
        lab = cv2.cvtColor(image[..., :3], cv2.COLOR_BGR2LAB).astype(np.float32)
        chroma = np.hypot(lab[..., 1] - 128, lab[..., 2] - 128)
        # Steel, not paint, glow or wood: opaque and only faintly colored.
        tones.append(lab[(image[..., 3] > 200) & (chroma < 20)])
    tones = np.concatenate(tones)
    near = tones[np.abs(tones[:, 0] - lightness) < 14]
    return near[:, 1].mean(), near[:, 2].mean()


def derive_palette(sources, size):
    """One palette for the family: every icon gives the same number of samples."""
    rng = np.random.default_rng(7)
    samples = []
    for source in sources:
        image = squared(cv2.imread(str(source), cv2.IMREAD_UNCHANGED))
        inside = silhouette(image, max(1.0, image.shape[0] * VOTE_SIGMA))
        lab, calm = lab_and_calm(image, inside)
        own = lab[calm]
        samples.append(own[rng.choice(len(own), min(len(own), 30_000), replace=False)])
    samples = np.concatenate(samples)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 80, 0.1)
    cv2.setRNGSeed(7)
    _, _, centers = cv2.kmeans(samples, size, None, criteria, 10, cv2.KMEANS_PP_CENTERS)
    # Greys first, dark to light; then the colors, dark to light.
    chroma = np.hypot(centers[:, 1] - 128, centers[:, 2] - 128)
    order = sorted(range(size), key=lambda index: (chroma[index] >= 14, centers[index, 0]))
    centers = centers[order]
    greys = [index for index in range(size) if np.hypot(*(centers[index, 1:] - 128)) < 14]
    darkest, lightest = centers[greys[0], 0], centers[greys[-1], 0]
    for index in greys:
        # Full warmth in the dark steel, less toward the bright worn edges:
        # a highlight that is as brown as the shadow reads as putty, not metal.
        keep = 1 - HIGHLIGHT_COOLING * (centers[index, 0] - darkest) / (lightest - darkest)
        tone = np.array(metal_hue(centers[index, 0]))
        centers[index, 1:] = 128 + (tone - 128) * keep
    colors = hex_of(centers)
    PALETTE_FILE.write_text(json.dumps(colors, indent=2) + "\n")
    return colors


def vote(labels, count, inside, sigma):
    """Each pixel takes the label most common around it."""
    best = np.full(labels.shape, -1.0, np.float32)
    winner = labels.copy()
    for label in range(count):
        share = cv2.GaussianBlur((labels == label).astype(np.float32), (0, 0), sigma)
        better = share > best
        best[better] = share[better]
        winner[better] = label
    winner[~inside] = -1
    return winner


def without_specks(labels, count, inside, minimum, sigma):
    """Areas too small to be a shape are given to whatever surrounds them."""
    open_pixels = np.zeros(labels.shape, bool)
    for label in range(count):
        parts, numbered, stats, _ = cv2.connectedComponentsWithStats(
            (labels == label).astype(np.uint8), connectivity=4
        )
        for part in range(1, parts):
            if stats[part, cv2.CC_STAT_AREA] < minimum:
                open_pixels |= numbered == part
    if not open_pixels.any():
        return labels
    known = labels.copy()
    known[open_pixels] = -1
    filled = vote(known, count, inside, sigma * 2.5)
    labels = labels.copy()
    labels[open_pixels] = filled[open_pixels]
    return labels


def family_color(color, palette):
    """The palette color an icon's own color becomes.

    A grey goes to the palette grey of its lightness, whatever its tint: the
    family's greys are warmer than the generator's. Every other color goes to
    the nearest palette color that is not a grey.
    """
    chroma = np.hypot(palette[:, 1] - 128, palette[:, 2] - 128)
    greys = chroma < 14
    if np.hypot(color[1] - 128, color[2] - 128) < 14:
        distance = np.where(greys, np.abs(palette[:, 0] - color[0]), np.inf)
    else:
        distance = np.where(greys, np.inf, np.linalg.norm(palette - color, axis=1))
    return int(np.argmin(distance))


def cleaned(source, palette):
    """The icon in the family palette with hard, smooth boundaries (BGRA)."""
    image = squared(cv2.imread(str(source), cv2.IMREAD_UNCHANGED))
    side = image.shape[0]
    sigma = max(1.0, side * VOTE_SIGMA)
    inside = silhouette(image, sigma)
    lab, calm = lab_and_calm(image, inside)

    own = own_colors(lab, calm)
    count = len(own)
    flat = lab.reshape(-1, 3)
    nearest = np.empty(len(flat), np.int32)
    for start in range(0, len(flat), 200_000):
        chunk = flat[start : start + 200_000]
        nearest[start : start + 200_000] = np.argmin(
            np.linalg.norm(chunk[:, None] - own[None], axis=2), axis=1
        )
    labels = nearest.reshape(lab.shape[:2])
    labels[~inside] = -1

    labels = vote(labels, count, inside, sigma)
    labels = without_specks(labels, count, inside, side * side * SPECK_AREA, sigma)
    labels = vote(labels, count, inside, sigma * 0.7)

    colors = cv2.cvtColor(palette.reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_LAB2BGR)[0]
    family = np.array([family_color(color, palette) for color in own])
    result = np.zeros((side, side, 4), np.uint8)
    for label in range(count):
        result[labels == label, :3] = colors[family[label]]
    result[inside, 3] = 255
    return result


def snapped(svg, hex_colors, palette):
    """Every fill set to the palette color it is nearest to, so the file holds no other color."""

    def snap(match):
        nearest = np.argmin(np.linalg.norm(palette - lab_of([match.group(1).lower()])[0], axis=1))
        return f'fill="{hex_colors[nearest]}"'

    return re.sub(r'fill="(#[0-9A-Fa-f]{6})"', snap, svg)


def trace(name, hex_colors):
    source = MASTERS / f"{name}-flat.webp"
    target = ICONS / f"{name}-flat.svg"
    palette = lab_of(hex_colors)
    image = cleaned(source, palette)
    side = image.shape[0]
    small = cv2.resize(image, (SMALL_SIDE, SMALL_SIDE), interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(ICONS / f"{name}-flat.webp"), small, [cv2.IMWRITE_WEBP_QUALITY, 92])
    with tempfile.TemporaryDirectory() as scratch:
        clean_file = pathlib.Path(scratch) / "clean.png"
        cv2.imwrite(str(clean_file), image)
        vtracer.convert_image_to_svg_py(
            str(clean_file),
            str(target),
            colormode="color",
            hierarchical="stacked",
            mode="spline",
            filter_speckle=8,
            color_precision=8,
            layer_difference=2,
            corner_threshold=70,
            length_threshold=5.0,
            splice_threshold=45,
            max_iterations=10,
            path_precision=0,
        )
    svg = target.read_text()
    svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg)
    svg = re.sub(r"<!--.*?-->\s*", "", svg, flags=re.S)
    svg = re.sub(
        r"<svg[^>]*>",
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}">',
        svg,
        count=1,
    )
    svg = snapped(svg, hex_colors, palette)
    target.write_text(svg.strip() + "\n")
    used = len(set(re.findall(r'fill="(#[0-9a-f]{6})"', svg)))
    print(
        f"{target.name}: {target.stat().st_size // 1024} KB, "
        f"{svg.count('<path')} paths, {used} of {len(hex_colors)} colors"
    )


arguments = sys.argv[1:]
everyone = sorted(path.stem.removesuffix("-flat") for path in MASTERS.glob("*-flat.webp"))
if arguments[:1] == ["--derive"]:
    family = derive_palette([MASTERS / f"{name}-flat.webp" for name in everyone], int(arguments[1]))
    arguments = arguments[2:]
    print(f"{PALETTE_FILE.name}: {len(family)} colors")
else:
    family = json.loads(PALETTE_FILE.read_text())
for name in arguments or everyone:
    trace(name, family)
