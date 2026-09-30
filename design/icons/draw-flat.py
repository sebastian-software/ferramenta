"""Redraws the flat icon masters as the small SVGs the package ships.

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
then redrawn, not traced: a flat icon is a few shapes, and its file should be
a few kilobytes (BUDGET), small enough to be the one flat form everywhere,
from the header to a favicon.

- The colors are stacked, largest area first. Each layer is drawn as the
  union of its own areas and everything above it, so no seam can open between
  two neighbors and every outline is as simple as it can be.
- Each outline is reduced to the few points that carry it. A sharp point
  stays a corner; the others become the control points of one smooth curve
  (a quadratic B-spline, which costs a single point per vertex in SVG).
- Coordinates are whole numbers on a coarse grid, written relative to the
  point before.
- The mildest simplification that fits the budget is the one that is kept
  (LEVELS). A master too detailed to fit without losing its shape is a master
  to redraw simpler, not a reason to raise the budget.

The palette is a file on purpose: a new icon is mapped onto the colors the
family already has. `--derive N` measures a fresh palette of N colors from the
calm interior of every icon's areas (never from the edge bands) and rewrites
the file; do that only when the family's colors are meant to change.

The generator draws flat steel in a clean, cool grey. The rendered icons' steel
is warmer: blackened, slightly brown. So a derived palette keeps the lightness
of each grey it measured and takes the hue from the rendered icons' metal at
that lightness.

Run with a Python that has `opencv-python-headless` and `numpy`:
    python design/icons/draw-flat.py [--derive N] [name ...]

`ICON_MASTERS` and `ICON_OUT` point it at another pair of directories, for an
icon that is not a family member's (the kit's sample tool). The palette stays
the family's.
"""

import json
import math
import os
import pathlib
import sys

import cv2
import numpy as np

HERE = pathlib.Path(__file__).parent
FAMILY_ICONS = HERE.parent.parent / "packages" / "family" / "icons"
MASTERS = pathlib.Path(os.environ.get("ICON_MASTERS", HERE / "masters"))
ICONS = pathlib.Path(os.environ.get("ICON_OUT", FAMILY_ICONS))
PALETTE_FILE = FAMILY_ICONS / "palette.json"
# The most a flat icon's SVG may weigh, in bytes.
BUDGET = 5000
# How strongly an icon is simplified, mild to strong: the side of the grid its
# points snap to, how far an outline may stray from the cleaned image (pixels
# at WORK_SIDE), and the share of the icon below which an area is dropped.
LEVELS = [
    (256, 2.2, 0.0012),
    (192, 2.6, 0.0016),
    (160, 3.0, 0.0022),
    (128, 3.4, 0.0030),
    (128, 4.0, 0.0040),
    (112, 4.6, 0.0050),
    (96, 5.4, 0.0065),
]
# The reach of the vote that settles the areas before they are drawn, as a
# share of the icon's side.
DRAW_SIGMA = 0.0035
# A vertex whose two edges meet at less than this angle is a corner, not a bend.
CORNER = 118

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


def index_labels(image, hex_colors):
    """The cleaned image as a map of palette indexes (-1 outside the icon)."""
    inside = image[..., 3] > 0
    bgr = image[..., :3].astype(np.int32)
    key = (bgr[..., 2] << 16) | (bgr[..., 1] << 8) | bgr[..., 0]
    labels = np.full(key.shape, -1, np.int32)
    for index, color in enumerate(hex_colors):
        labels[(key == int(color[1:], 16)) & inside] = index
    return labels, inside


def angle_at(before, vertex, after):
    """The angle between a vertex's two edges, in degrees."""
    first, second = before - vertex, after - vertex
    length = np.linalg.norm(first) * np.linalg.norm(second)
    if length == 0:
        return 180.0
    return math.degrees(math.acos(max(-1.0, min(1.0, float(np.dot(first, second) / length)))))


def pair(dx, dy):
    """Two whole numbers, with a space only where they would run together."""
    first, second = str(int(dx)), str(int(dy))
    return first + (second if second.startswith("-") else " " + second)


def closed_path(points, scale):
    """One closed outline: lines into its corners, a smooth curve through the rest.

    The smooth stretches are a quadratic B-spline whose control points are the
    outline's own vertices. It passes through the middle of each edge, and in
    SVG every vertex after the first costs one point (`t`). Coordinates are
    doubled, so those midpoints are whole numbers too.
    """
    snapped = np.round(points.astype(np.float64) * scale).astype(np.int64)
    kept = [snapped[0]]
    for point in snapped[1:]:
        if (point != kept[-1]).any():
            kept.append(point)
    if len(kept) > 1 and (kept[0] == kept[-1]).all():
        kept.pop()
    count = len(kept)
    if count < 3:
        return ""
    vertices = np.array(kept)
    doubled = vertices * 2
    corner = [
        angle_at(vertices[index - 1], vertices[index], vertices[(index + 1) % count]) < CORNER
        for index in range(count)
    ]
    start = next((index for index in range(count) if corner[index]), 0)
    order = [(start + step) % count for step in range(count)]
    at = doubled[start] if corner[start] else (doubled[order[-1]] + doubled[start]) // 2
    commands = ["M" + pair(*at)]
    curving = False
    for index in order:
        following = (index + 1) % count
        if corner[index]:
            if (at != doubled[index]).any():
                commands.append("l" + pair(*(doubled[index] - at)))
                at = doubled[index]
            curving = False
            continue
        end = doubled[following] if corner[following] else (doubled[index] + doubled[following]) // 2
        if curving:
            commands.append("t" + pair(*(end - at)))
        else:
            commands.append("q" + pair(*(doubled[index] - at)) + " " + pair(*(end - at)))
        at = end
        curving = not corner[following]
    return "".join(commands) + "z"


def drawn(labels, inside, hex_colors, grid, epsilon, speck):
    """The icon as an SVG at one level of simplification."""
    side = labels.shape[0]
    count = len(hex_colors)
    sigma = side * DRAW_SIGMA
    labels = vote(labels, count, inside, sigma)
    labels = without_specks(labels, count, inside, side * side * speck, sigma)
    labels = vote(labels, count, inside, sigma * 0.6)
    areas = sorted(((int((labels == index).sum()), index) for index in range(count)), reverse=True)
    stack = [index for area, index in areas if area > 0]
    smallest = side * side * speck * 0.5
    paths = []
    for position, color in enumerate(stack):
        layer = np.isin(labels, stack[position:]).astype(np.uint8) * 255
        outlines, _ = cv2.findContours(layer, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        data = []
        for outline in outlines:
            if cv2.contourArea(outline) < smallest:
                continue
            reduced = cv2.approxPolyDP(outline, epsilon, True).reshape(-1, 2)
            if len(reduced) >= 3:
                data.append(closed_path(reduced, grid / side))
        if data:
            paths.append(f'<path fill="{hex_colors[color]}" d="{"".join(data)}"/>')
    box = grid * 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box} {box}" fill-rule="evenodd">'
        + "".join(paths)
        + "</svg>\n"
    )


def redraw(name, hex_colors):
    target = ICONS / f"{name}-flat.svg"
    image = cleaned(MASTERS / f"{name}-flat.webp", lab_of(hex_colors))
    labels, inside = index_labels(image, hex_colors)
    for level, (grid, epsilon, speck) in enumerate(LEVELS):
        svg = drawn(labels, inside, hex_colors, grid, epsilon, speck)
        if len(svg) <= BUDGET:
            break
    target.write_text(svg)
    used = svg.count("<path")
    over = "" if len(svg) <= BUDGET else "  OVER BUDGET: redraw the master simpler"
    print(f"{target.name}: {len(svg)} bytes at level {level}, {used} colors{over}")


arguments = sys.argv[1:]
everyone = sorted(path.stem.removesuffix("-flat") for path in MASTERS.glob("*-flat.webp"))
if arguments[:1] == ["--derive"]:
    family = derive_palette([MASTERS / f"{name}-flat.webp" for name in everyone], int(arguments[1]))
    arguments = arguments[2:]
    print(f"{PALETTE_FILE.name}: {len(family)} colors")
else:
    family = json.loads(PALETTE_FILE.read_text())
for name in arguments or everyone:
    redraw(name, family)
