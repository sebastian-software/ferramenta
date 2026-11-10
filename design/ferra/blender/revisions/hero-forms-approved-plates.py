"""Substantial Ferra instruments with varied depth and restrained oxide patina."""

import math
import bpy
from mathutils import Vector
from studio import material
from family_marks import tile
from hero_geometry import (
    apply, bench, box, cylinder, document_marks, engrave_lines, graduations,
    flush_screw, group, knob, lead_screw, letter_pocket, panel, path_rail,
    profile, ring, rod, rounded_plate, screw, subtract,
)


def cartridge(name, width, height, depth, location, steel, oxide, dark, angles=(90, 0, 0)):
    """A solid book-like cassette with separate covers, spine, and page-edge grooves."""
    g = group(name, location, angles)
    box(f"{name} deep core", (width - 0.06, height - 0.06, depth - 0.06), (0, 0, 0), steel, 0.025, g)
    front = box(f"{name} front cover", (width, height, 0.05), (0, 0, depth / 2 - 0.025), steel, 0.018, g)
    box(f"{name} rear cover", (width, height, 0.05), (0, 0, -depth / 2 + 0.025), steel, 0.018, g)
    box(f"{name} oxide spine", (0.105, height + 0.012, depth), (-width / 2 + 0.045, 0, 0), oxide, 0.025, g)
    for k in range(5):
        z = -(depth - 0.12) / 2 + k * (depth - 0.12) / 4
        box(f"{name} fore-edge page seam {k}", (0.010, height - 0.17, 0.008), (width / 2 - 0.025, 0, z), dark, 0, g)
    return g, front


def ferramenta(steel, oxide, graphite, dark):
    bed = bench("Independent tool register", 7.65, 1.85, steel, graphite, dark)
    positions = [-3.0, -2.0, -1.0, 0, 1.0, 2.0, 3.0]
    subtract(bed, [box(f"Deep insert socket {j}", (0.81, 0.65, 0.24), (x, 0.12, 0.33), None, 0.035) for j, x in enumerate(positions)], "Seven deep independent insert sockets")
    for j, x in enumerate(positions):
        box(f"Insert {j} socket lining", (0.78, 0.61, 0.12), (x, 0.12, 0.245), graphite, 0.03)
        box(f"Insert {j} locating foot", (0.60, 0.39, 0.21), (x, 0.12, 0.34), steel, 0.03)
    g, face = cartridge("Deep pattern book", 0.58, 1.50, 0.47, (-3, 0.12, 1.14), steel, oxide, dark)
    engrave_lines(face, [(0.10, -0.52 + j * 0.115, 0.20, 0.019) for j in range(10)], dark, g, face_z=0.235)
    g, face = panel("Thick syntax comb", 0.64, 1.22, (-2, 0.12, 1.00), steel, depth=0.34)
    subtract(face, [box(f"Syntax open gap {j}", (0.45, 0.09, 0.55), (0.18, -0.40 + j * 0.20, 0), None, 0.018, g) for j in range(5)], "Five substantial comb openings")
    for j in range(5):
        box(f"Oxide token face {j}", (0.29, 0.066, 0.04), (-0.035, -0.40 + j * 0.20, 0.18), oxide, 0.008, g)
    g, face = panel("Document register block", 0.73, 1.16, (-1, 0.12, 0.97), steel, clip=0.10, depth=0.25)
    document_marks(face, 0.73, 1.16, dark, g, sparse=True, face_z=0.125)
    box("Document oxide heading inlay", (0.50, 0.064, 0.022), (0, 0.37, 0.132), oxide, 0.008, g)
    g, face = panel("Solid letterpress block", 0.71, 0.97, (0, 0.12, 0.875), steel, depth=0.43)
    letter_pocket(face, "A", (0, 0), 0.65, dark, g, floor_z=0.135, inlay=oxide)
    for side in [-1, 1]:
        g, face = cartridge(f"Hinged catalog book {side}", 0.32, 1.27, 0.25, (1 + side * 0.17, 0.14, 1.025), steel, oxide, dark, angles=(90, 0, side * 10))
        engrave_lines(face, [(0.025, 0.36 - j * 0.13, 0.20, 0.017) for j in range(6)], dark, g, face_z=0.125)
    rod("Oxide catalog hinge", (1, 0.12, 0.40), (1, 0.12, 1.65), 0.065, oxide)
    g = group("Deep branching insert", (2, 0.12, 1.04), (90, 0, 0))
    p = [(-0.13, -0.64), (0.13, -0.64), (0.13, 0.04), (0.38, 0.34), (0.38, 0.57), (0.23, 0.57), (0, 0.30), (-0.23, 0.57), (-0.38, 0.57), (-0.38, 0.34), (-0.13, 0.04)]
    profile("Deep steel branching body", p, 0.34, (0, 0, 0), steel, 0.035, g)
    path_rail("Oxide selected branch", [(0, -0.49), (0, 0.18), (0.28, 0.49)], 0.09, 0.035, 0.18, oxide, g)
    g, face = panel("Deep preview housing", 0.71, 1.02, (3, 0.12, 0.90), steel, depth=0.37)
    subtract(face, box("Preview housing aperture cutter", (0.45, 0.73, 0.70), (0, 0, 0), None, 0.025, g), "Deep preview opening")
    box("Recessed oxide preview", (0.42, 0.70, 0.055), (0, 0, -0.10), oxide, 0.02, g)
    slot = rounded_plate("Long registration-slot cutter", 2.34, 0.18, 0.38, 0.39, None, location=(2.0, -0.66), corner=0.085)
    subtract(bed, slot, "Recessed front registration slot")
    clip = group("Bent oxide edge-registration clamp", (1.40, -0.96, 0), (90, 0, 0))
    outline = [(0, -0.13), (0.20, -0.13), (0.20, 0.27), (1.75, 0.27), (1.75, 0.37), (0, 0.37)]
    subtract(bed, profile("Registration-clamp fitted key cutter", outline, 0.206, (0, 0, 0), None, 0.020, clip), "Fitted edge clamp seat")
    profile("Continuous bent oxide registration clamp", outline, 0.20, (0, 0, 0), oxide, 0.018, clip)
    graduations("Register fine scale", -3.16, 0.66, -0.67, 0.335, steel, dark, count=39)


def ferroni(steel, oxide, graphite, dark):
    bench("Substantial pattern comparator", 7.40, 1.60, steel, graphite, dark)
    holder = box("Deep pattern book holder", (1.22, 0.94, 0.32), (-2.91, 0.12, 0.47), steel, 0.09)
    subtract(holder, [box(f"Book socket {j}", (0.28, 0.58, 0.32), (-3.27 + j * 0.36, 0.12, 0.61), None, 0.02) for j in range(3)], "Three deep book sockets")
    for j in range(3):
        g, face = cartridge(f"Standing pattern book {j + 1}", 0.27, 1.30, 0.51, (-3.27 + j * 0.36, 0.12, 1.10), steel, oxide, dark)
        engrave_lines(face, [(0.025, -0.22, 0.062, 0.45), (0.025, 0.25, 0.062, 0.25)], dark, g, face_z=0.255)
        screw(f"Pattern book cap {j}", (0.025, 0.49, 0.255), steel, dark, radius=0.035, parent=g)
    for x in [-2.09, 3.13]:
        cylinder("Heavy guide bearing pedestal", 0.23, 0.49, (x, 0.30, 0.555), steel)
        screw("Guide pedestal cap", (x, 0.30, 0.81), steel, dark, radius=0.10)
    rod("Main comparator linear guide", (-2.09, 0.30, 0.75), (3.13, 0.30, 0.75), 0.10, steel)
    ribbon = box("Recessed text ribbon", (5.08, 0.69, 0.10), (0.52, -0.19, 0.37), steel, 0.03)
    engrave_lines(ribbon, [(-1.91 + j * 0.095, -0.19, 0.027, 0.23 if j % 4 else 0.37) for j in range(51)], dark, face_z=0.42)
    for x, w in [(1.87, 0.19), (2.45, 0.10)]:
        box("Oxide match span", (w, 0.32, 0.022), (x, -0.19, 0.425), oxide, 0.006)
    carriage = box("Deep scanner carriage block", (1.00, 0.80, 0.58), (0.42, 0.30, 0.84), steel, 0.055)
    subtract(carriage, rod("Scanner guide bore cutter", (-0.2, 0.30, 0.75), (1.05, 0.30, 0.75), 0.108, None), "Fitted scanner guide bore")
    cylinder("Broad scanner pivot drum", 0.31, 0.26, (0.42, 0.30, 1.15), steel)
    outline = [(-0.34, -0.27), (0.15, -0.27), (0.95, -0.88), (1.36, -0.88), (1.48, -0.52), (0.22, 0.27), (-0.34, 0.27)]
    profile("Heavy angled scanner yoke", outline, 0.30, (0.42, 0.30, 1.24), steel, 0.045)
    profile("Broad oxide scanning-arm inlay", [(-0.13, -0.10), (1.12, -0.72), (1.27, -0.65), (0.04, 0.10)], 0.035, (0.42, 0.30, 1.405), oxide, 0.015)
    box("Deep oxide contact tool", (0.18, 0.23, 0.75), (1.72, -0.38, 0.88), oxide, 0.025)
    box("Broad retained scanning shoe", (0.22, 0.31, 0.08), (1.72, -0.38, 0.48), steel, 0.018)
    screw("Large scanner pivot anchor", (0.42, 0.30, 1.42), steel, dark, radius=0.13)
    screw("Tool retained end", (1.72, -0.38, 1.42), steel, dark, radius=0.095)
    graduations("Comparator front scale", -2.02, 3.04, -0.65, 0.335, steel, dark, count=50)


def ferriki(steel, oxide, graphite, dark):
    green = material("Muted sage theme enamel", (0.17, 0.25, 0.09), 0.31, metallic=0.25)
    blue = material("Muted blue theme enamel", (0.065, 0.15, 0.23), 0.30, metallic=0.3)
    bench("Substantial token theme register", 6.90, 1.93, steel, graphite, dark)
    ribbon = box("Broad token ribbon", (5.64, 0.76, 0.11), (0.36, 0, 0.375), steel, 0.025)
    engrave_lines(ribbon, [(x + k * 0.105, (k % 2) * 0.035, 0.042, 0.38 if k < 3 else 0.24) for x in [-1.84, -0.96, -0.08] for k in range(5)], dark, face_z=0.43)
    for index, x in enumerate([1.50, 2.18, 2.85]):
        for k in range(5):
            token = box(f"Colored theme token {index}.{k}", (0.055, 0.38 if k < 3 else 0.24, 0.024), (x + (k - 2) * 0.10, (k % 2) * 0.035, 0.438), [oxide, green, blue][index], 0.006)
            token.rotation_euler.z = math.radians(-12)
    cylinder("Feed spool broad bearing", 0.45, 0.18, (-2.87, 0, 0.42), steel)
    cylinder("Feed spool solid hub", 0.31, 0.41, (-2.87, 0, 0.70), steel)
    ring("Feed spool retaining rim", 0.33, 0.10, 0.08, (-2.87, 0, 0.94), steel)
    screw("Feed spool cap", (-2.87, 0, 0.99), steel, dark, radius=0.12)
    for y in [-0.57, 0.57]:
        rod("Heavy theme carriage guide", (-2.35, y, 0.49), (3.10, y, 0.49), 0.065, steel)
        for x in [-2.35, 3.10]:
            cylinder("Theme guide anchor", 0.09, 0.23, (x, y, 0.47), steel)
    bridge = box("Deep transverse theme-registration tool", (0.96, 1.94, 0.72), (0.47, 0, 0.85), steel, 0.065)
    subtract(bridge, box("Token passage cutter", (1.30, 0.96, 0.35), (0.47, 0, 0.56), None, 0.035), "Clear ribbon passage under the massive theme head")
    subtract(bridge, box("Theme top adjustment slot cutter", (0.13, 1.27, 0.23), (0.47, 0, 1.24), None, 0.025), "Recessed transverse adjustment slot")
    for y in [-0.81, 0.81]:
        cylinder("Theme head broad end pedestal", 0.23, 0.50, (0.47, y, 0.57), steel)
        screw("Registration head retained anchor", (0.47, y, 1.23), steel, dark, radius=0.11)
    box("Large oxide theme cassette", (0.52, 1.06, 0.36), (1.06, 0, 0.70), oxide, 0.045)
    box("Theme cassette oxide pull", (0.60, 0.18, 0.18), (0.87, 0.87, 0.49), oxide, 0.025)
    knob("Large theme adjustment wheel", (0.47, 0, 1.23), steel, oxide, dark, radius=0.24)
    box("Oxide output end cap", (0.20, 0.94, 0.12), (3.15, 0, 0.39), oxide, 0.035)
    graduations("Theme front calibration", -2.17, 2.98, -0.71, 0.335, steel, dark, count=44)


def ferromark(steel, copper, graphite, dark):
    for y in [-0.93, 0.71]:
        box("Open document support rail", (6.20, 0.15, 0.16), (0, y, 0.14), graphite, 0.035)
    for x in [-2.89, 2.89]:
        cylinder("Registration bridge foot", 0.24, 0.22, (x, 0.71, 0.19), steel)
        cylinder("Registration bridge pillar", 0.13, 0.49, (x, 0.71, 0.51), steel)
        screw("Bridge pillar anchor", (x, 0.71, 0.77), steel, dark, radius=0.105)
    bridge = box("Slotted document registration bridge", (5.83, 0.37, 0.20), (0, 0.71, 0.71), steel, 0.055)
    slot = box("Bridge sliding-slot cutter", (4.62, 0.075, 0.5), (0, 0.71, 0.71), None, 0.025)
    subtract(bridge, slot, "Open clamp adjustment slot")
    for name, x, y, z, angle, width, height, surface, table in [
        ("Source sheet", -1.62, -0.19, 0.34, -6, 1.93, 2.31, steel, False),
        ("Structured output sheet", 0.38, -0.26, 0.40, 1, 1.92, 2.40, steel, True),
        ("Metadata index leaf", 1.83, -0.15, 0.31, 7, 0.85, 2.29, copper, False),
    ]:
        g, plate = panel(name, width, height, (x, y, z), surface, angles=(0, 0, angle), clip=0.13)
        document_marks(plate, width, height, dark, g, table=table)
    for x in [-1.32, 1.75]:
        g = group("Copper registration clamp", (x, 0.71, 0.63), (90, 0, 0))
        profile("Continuous stepped clamp", [(-0.13, -0.27), (0.13, -0.27), (0.13, -0.07), (0.24, -0.07), (0.24, 0.21), (-0.13, 0.21)], 0.23, (0, 0, 0), copper, 0.025, g)
        knob("Registration clamp adjuster", (x, 0.71, 0.85), steel, copper, dark, radius=0.095)
    for x in [-2.74, 2.74]:
        for y in [-0.93, 0.71]:
            cylinder("Document bed locating pin", 0.045, 0.16, (x, y, 0.27), steel)
    graduations("Bridge registration scale", -2.28, 2.28, 0.97, 0.69, steel, dark, count=46)


def ferrolex(steel, copper, graphite, dark):
    bed = bench("Wordform proofing gauge", 6.80, 1.65, steel, graphite, dark)
    xs = [-1.89, -0.64, 0.61, 1.86]
    cutters = [box(f"Type block keyed socket {j}", (1.12, 0.94, 0.16), (x, -0.20, 0.33), None, 0.025) for j, x in enumerate(xs)]
    subtract(bed, cutters, "Replaceable keyed type-block seats")
    for x, letter in zip(xs, "AFNE"):
        box(f"{letter} type block lower key", (1.02, 0.84, 0.16), (x, -0.20, 0.30), graphite, 0.025)
        g = group(f"{letter} removable type block", (x, -0.20, 0.53))
        face = box(f"{letter} type block steel face", (1.06, 0.91, 0.40), (0, 0, 0), steel, 0.035, g)
        letter_pocket(face, letter, (0, 0), 0.64, dark, g, floor_z=0.12, inlay=copper)
    for x in [-2.83, 2.71]:
        cylinder("Dictionary profile support", 0.23, 0.75, (x, 0.49, 0.68), steel)
        screw("Dictionary support cap", (x, 0.49, 1.07), steel, dark, radius=0.094)
    # The underside profile has a real stepped relief above each removable block.
    outline = [(-2.83, 1.01), (2.71, 1.01), (2.71, 0.67)]
    for x in reversed(xs):
        outline.extend([(x + 0.49, 0.67), (x + 0.49, 0.79), (x - 0.49, 0.79), (x - 0.49, 0.67)])
    outline.append((-2.83, 0.67))
    carrier = group("Stepped dictionary profile", (0, 0.49, 0), (90, 0, 0))
    profile("Machined stepped profile bar", outline, 0.43, (0, 0, 0), steel, 0.025, carrier)
    box("Copper profile stop rear", (0.28, 0.47, 0.60), (1.03, 0.49, 0.91), copper, 0.025)
    box("Copper profile stop front foot", (0.34, 0.27, 0.10), (1.03, 0.25, 0.68), copper, 0.022)
    knob("Profile stop screw", (1.03, 0.49, 1.21), steel, copper, dark, radius=0.105)
    spare_bed = box("Affix insert side holder", (0.48, 0.62, 0.22), (3.02, 0.34, 0.39), steel, 0.045)
    subtract(spare_bed, box("Affix insert socket cutter", (0.30, 0.38, 0.35), (3.02, 0.34, 0.48), None, 0.012), "Keyed spare-affix socket")
    g, plate = panel("Spare affix insert", 0.27, 0.75, (3.02, 0.34, 0.78), copper, depth=0.30)
    engrave_lines(plate, [(0, -0.11 + k * 0.11, 0.09, 0.018) for k in range(4)], dark, g, face_z=0.15)
    graduations("Wordform reference scale", -2.38, 2.36, -0.68, 0.34, steel, dark, count=40)


def catalog_leaf(name, x, y, height, tab_x, surface, steel, dark, depth=0.14):
    width = 1.44
    carrier = group(name, (x, y, 0.35 + height / 2), (90, 0, 0))
    left, right, bottom, top = -width / 2, width / 2, -height / 2, height / 2
    points = [(left, bottom), (right, bottom), (right, top - 0.12), (tab_x + 0.20, top - 0.12), (tab_x + 0.14, top), (tab_x - 0.16, top), (tab_x - 0.22, top - 0.12), (left, top - 0.12)]
    body = profile(f"{name} tabbed leaf", points, depth, (0, 0, 0), surface, 0.018, carrier)
    lines = [(0, top * 0.46 - j * 0.15, 0.91 if j != 2 else 0.70, 0.050) for j in range(3)]
    engrave_lines(body, lines, dark, carrier, face_z=depth / 2)
    return carrier


def ferrocat(steel, copper, graphite, dark):
    for side in [-1, 1]:
        x = side * 2.32
        bench_name = f"Catalog bank {side}"
        # The bank remains open above its low cradle, with separate page slots.
        rounded_plate(f"{bench_name} machined base", 2.06, 1.66, 0.36, 0.305, steel, location=(x, 0.10), corner=0.20)
        for yy in [-0.66, 0.86]:
            box(f"{bench_name} retaining lip", (2.10, 0.16, 0.31), (x, yy, 0.32), steel, 0.012)
        for j in range(7):
            yy = -0.51 + j * 0.185
            height = 1.00 + j * 0.067
            catalog_leaf(f"{bench_name} leaf {j + 1}", x, yy, height, -0.38 + (j % 3) * 0.35, steel, steel, dark)
        for edge_x in [x - 0.96, x + 0.96]:
            box(f"{bench_name} substantial side cheek", (0.17, 1.62, 0.40), (edge_x, 0.10, 0.36), steel, 0.018)
            cylinder(f"{bench_name} rounded cheek boss", 0.14, 0.16, (edge_x, -0.65, 0.56), steel)
            screw(f"{bench_name} cheek fastener", (edge_x, -0.65, 0.65), steel, dark, radius=0.069)
        for xx in [x - 0.81, x + 0.81]:
            screw(f"{bench_name} front anchor", (xx, -0.66, 0.46), steel, dark, radius=0.069)
    for y in [-0.38, 0.48]:
        rod("Catalog identity alignment rail", (-1.42, y, 0.30), (1.42, y, 0.30), 0.085, steel)
    box("Resolved leaf keyed shoe", (1.15, 0.76, 0.25), (0, 0.15, 0.31), graphite, 0.035)
    catalog_leaf("Authoritative copper catalog leaf", 0, 0.15, 1.35, 0.0, copper, steel, dark, depth=0.25)
    comb = box("Identity registration comb", (2.76, 0.22, 0.18), (0, -0.48, 0.39), steel, 0.022)
    cuts = [box(f"Identity tooth cutter {j}", (0.04, 0.32, 0.14), (-1.25 + j * 0.125, -0.48, 0.46), None, 0.004) for j in range(21)]
    subtract(comb, cuts, "Individual identity comb teeth")
    knob("Catalog merge registration screw", (0.84, -0.48, 0.51), steel, copper, dark, radius=0.13)
    graduations("Catalog alignment scale", -1.21, 1.18, -0.73, 0.28, steel, dark, count=24)


def file_tab(name, location, steel, copper, dark, selected=False):
    x, y, z = location
    cylinder(f"{name} end bearing", 0.22, 0.20, (x, y, z), steel)
    g = group(name, (x, y, z + 0.43), (90, 0, 0))
    points = [(-0.43, -0.34), (0.43, -0.34), (0.43, 0.20), (0.04, 0.20), (-0.04, 0.34), (-0.28, 0.34), (-0.43, 0.18)]
    leaf = profile(f"{name} tabbed file", points, 0.23, (0, 0, 0), copper if selected else steel, 0.025, g)
    engrave_lines(leaf, [(-0.025, 0.015, 0.43, 0.022), (-0.075, -0.095, 0.33, 0.022)], dark, g, face_z=0.115)
    return g


def ferralk(steel, copper, graphite, dark):
    path_rail("Common file-tree root rail", [(-3.15, 0), (-0.88, 0)], 0.45, 0.30, 0.25, steel)
    for name, points in [
        ("Upper directory branch", [(-0.90, 0.09), (0.54, 1.12), (2.82, 1.12)]),
        ("Selected middle directory branch", [(-0.79, 0), (2.82, 0)]),
        ("Pruned lower directory branch", [(-0.90, -0.09), (0.54, -1.12), (2.82, -1.12)]),
    ]:
        path_rail(name, points, 0.38, 0.30, 0.25, steel)
    for x, y in [(-3.10, 0), (2.82, -1.12), (2.82, 0), (2.82, 1.12)]:
        cylinder("Branch endpoint foot", 0.36, 0.18, (x, y, 0.10), graphite)
        cylinder("Branch endpoint machined cap", 0.35, 0.20, (x, y, 0.22), steel)
    for j, y in enumerate([-1.12, 0, 1.12]):
        file_tab(f"Reachable file {j + 1}", (2.82, y, 0.35), steel, copper, dark, selected=j == 1)
    cylinder("Selector main pivot bearing", 0.24, 0.34, (-0.90, 0, 0.44), steel)
    selector = profile("Copper pattern-selection lever", [(-1.04, -0.20), (1.31, -0.20), (1.46, 0), (1.31, 0.20), (-1.04, 0.20)], 0.18, (0, 0, 0.66), copper, 0.03)
    slot = box("Selector adjustment slot cutter", (1.38, 0.055, 0.35), (0.25, 0, 0.66), None, 0.02)
    subtract(selector, slot, "Long pattern-selector adjustment slot")
    knob("Pattern gate pivot adjuster", (-0.90, 0, 0.75), steel, copper, dark, radius=0.19)
    cylinder("Selected path locating pin", 0.065, 0.40, (1.27, 0, 0.47), steel)
    screw("Selected path pin retainer", (1.27, 0, 0.72), steel, dark, radius=0.066)
    stop = box("Early traversal graphite stop", (0.43, 0.60, 0.40), (1.10, -1.12, 0.53), graphite, 0.035)
    engrave_lines(stop, [(1.10, -1.27 + j * 0.10, 0.22, 0.022) for j in range(4)], dark, face_z=0.73)
    graduations("Root path reference scale", -2.68, -1.36, -0.20, 0.25, steel, dark, count=15)
    screw("Root gate anchor", (-3.10, 0, 0.31), steel, dark, radius=0.105)



def ferrugo(steel, oxide, graphite, dark):
    ivory = material("Warm ivory document ceramic", (0.78, 0.75, 0.66), 0.40, metallic=0.18)
    for y in [-0.48, 0.48]:
        box("Solid preview alignment bar", (6.25, 0.20, 0.23), (0.125, y, 0.15), steel, 0.025)
    left = group("Turned source-document assembly", (-2.05, 0.12, 0), (0, 0, 24))
    base = rounded_plate("Turned machined source plate", 2.60, 1.63, 0.44, 0.325, steel, corner=0.26, parent=left)
    for x in [-1.0, 1.0]:
        flush_screw(base, "Recessed source-plate anchor", x, -0.50, 0.325, steel, dark, radius=0.145, parent=left)
    source = group("Turned deep source-document holder", (0, 0.12, 1.66), (83, 0, 0), parent=left)
    box("Massive source-document backing", (2.02, 2.50, 0.40), (0, 0, -0.025), steel, 0.055, source)
    box("Source oxide spine", (0.13, 2.30, 0.42), (-0.93, 0, -0.025), oxide, 0.025, source)
    sheet = box("Ivory source document face", (1.82, 2.32, 0.10), (0.025, 0.025, 0.225), ivory, 0.025, source)
    document_marks(sheet, 1.77, 2.24, dark, source, table=True, face_z=0.275)
    for x in [-1.15, 1.15]:
        cylinder("Source-column broad foot", 0.27, 0.18, (x, 0.18, 0.41), steel, parent=left)
        cylinder("Heavy source-holder column", 0.19, 2.35, (x, 0.18, 1.50), steel, parent=left)
        screw("Source column retained cap", (x, 0.18, 2.69), steel, dark, radius=0.11, parent=left)
    base = rounded_plate("Machined preview plate", 2.60, 1.64, 0.44, 0.325, steel, location=(2.05, 0), corner=0.26)
    for x in [1.05, 3.05]:
        flush_screw(base, "Recessed preview-plate anchor", x, -0.50, 0.325, steel, dark, radius=0.145)
    preview = group("Deep bounded preview housing", (2.05, -0.06, 1.15), (87, 0, 2))
    frame = box("Massive machined preview frame", (2.28, 1.66, 0.58), (0, 0, 0), steel, 0.075, preview)
    subtract(frame, box("Deep preview-aperture cutter", (1.68, 1.02, 1.05), (0, 0, 0), None, 0.04, preview), "Substantial bounded preview aperture")
    sheet = box("Ivory preview document", (1.70, 1.04, 0.12), (0, 0, 0.11), ivory, 0.025, preview)
    document_marks(sheet, 1.61, 0.99, dark, preview, table=True, face_z=0.17)
    for x in [-0.98, 0.98]:
        for y in [-0.68, 0.68]:
            screw("Preview housing corner screw", (x, y, 0.30), steel, dark, radius=0.075, parent=preview)
    box("Patinated preview dimension stop", (0.56, 0.22, 0.48), (0.25, 0.82, 0.06), oxide, 0.035, preview)
    for j in range(19):
        box("Preview dimension graduation", (0.017, 0.07 if j % 3 else 0.11, 0.018), (-0.72 + j * 0.080, 0.70, 0.30), graphite, 0, preview)
    rod("Preview lead screw shaft", (0, -0.50, 0.40), (1.25, -0.50, 0.40), 0.038, steel)
    lead_screw("Helical preview adjustment thread", (0.08, -0.50, 0.40), 24, 0.044, steel)
    bearing = box("Substantial lead-screw bearing", (0.29, 0.34, 0.32), (0.25, -0.50, 0.32), steel, 0.05)
    subtract(bearing, rod("Bearing screw-bore cutter", (0, -0.50, 0.40), (0.5, -0.50, 0.40), 0.051, None), "Lead-screw bearing bore")
    wheel = group("Axial preview handwheel", (0.01, -0.50, 0.40), (0, -90, 0))
    knob("Oxide preview adjuster", (0, 0, 0), steel, oxide, dark, radius=0.17, parent=wheel)
    graduations("Preview track scale", -0.42, 1.11, 0.55, 0.275, steel, dark, count=22)


def conveyor(name, start, end, width, steel, oxide, graphite, dark):
    start, end = Vector((*start, 0)), Vector((*end, 0))
    direction = end - start
    length = direction.length
    center = (start + end) / 2
    carrier = group(name, center, (0, 0, math.degrees(math.atan2(direction.y, direction.x))))
    box(f"{name} deep machined bed", (length, width + 0.26, 0.62), (0, 0, 0.19), steel, 0.045, carrier)
    box(f"{name} graphite transport belt", (length - 0.16, width, 0.08), (0, 0, 0.54), graphite, 0.025, carrier)
    count = max(5, int((length - 0.34) / 0.18))
    for j in range(count + 1):
        x = -length / 2 + 0.17 + j * (length - 0.34) / count
        box(f"{name} raised steel belt slat {j}", (0.067, width - 0.07, 0.05), (x, 0, 0.595), steel, 0.012, carrier)
    for x in [-length / 2 + 0.12, length / 2 - 0.12]:
        roller = cylinder(f"{name} end roller", 0.14, width + 0.10, (x, 0, 0.49), steel, parent=carrier)
        roller.rotation_euler.x = math.pi / 2
        for y in [-width / 2 - 0.11, width / 2 + 0.11]:
            box(f"{name} retained roller shoe", (0.33, 0.20, 0.20), (x, y, -0.18), steel, 0.025, carrier)
            screw(f"{name} frame anchor", (x, y, 0.675), steel, dark, radius=0.055, parent=carrier)
    for y in [-width / 2 - 0.11, width / 2 + 0.11]:
        box(f"{name} straight side rail", (length - 0.04, 0.09, 0.18), (0, y, 0.58), steel, 0.018, carrier)
    drive = group(f"{name} front roller bearing", (length / 2 - 0.12, -width / 2 - 0.19, 0.49), (90, 0, 0), parent=carrier)
    cylinder(f"{name} drive bearing", 0.18, 0.10, (0, 0, 0), steel, parent=drive)
    cylinder(f"{name} oxide drive cap", 0.11, 0.06, (0, 0, 0.07), oxide, parent=drive)
    screw(f"{name} roller axle retainer", (0, 0, 0.11), steel, dark, radius=0.045, parent=drive)
    return carrier


def ferrigura(steel, oxide, graphite, dark):
    incoming = conveyor("Incoming document conveyor", (-3.75, 0), (-0.78, 0), 0.98, steel, oxide, graphite, dark)
    upper = conveyor("Square-node output conveyor", (0.57, 0.57), (3.20, 1.80), 0.98, steel, oxide, graphite, dark)
    lower = conveyor("Round-node output conveyor", (0.57, -0.57), (3.20, -1.80), 0.98, steel, oxide, graphite, dark)
    outline = [(-0.88, -0.62), (-0.20, -0.90), (0.56, -1.04), (1.01, -0.12), (1.01, 0.12), (0.56, 1.04), (-0.20, 0.90), (-0.88, 0.62)]
    profile("Solid sorting junction bed", outline, 0.60, (0, 0, 0.20), steel, 0.045)
    profile("Junction graphite transfer deck", [(x * 0.96, y * 0.96) for x, y in outline], 0.08, (0, 0, 0.54), graphite, 0.025)
    box("Central sorter support shoe", (0.85, 0.82, 0.18), (0, 0, -0.19), steel, 0.035)
    decision = group("Diamond-shaped sorting turntable", (-0.12, 0, 0.64), (0, 0, 45))
    box("Steel diamond turntable rim", (0.98, 0.98, 0.14), (0, 0, 0), steel, 0.045, decision)
    tile("Patinated decision diamond", 0.83, 0.83, 0.06, 0.045, oxide, decision, (0, 0, 0.085), crown=0.008)
    cylinder("Sort-switch pivot bearing", 0.21, 0.17, (-0.22, 0, 0.78), steel)
    blade = [(-0.43, -0.12), (0.92, 0.25), (0.98, 0.43), (0.83, 0.49), (-0.43, 0.12)]
    profile("Raised directional sorting blade", blade, 0.26, (0, 0, 0.83), steel, 0.035)
    profile("Sort-switch oxide center inlay", [(-0.18, -0.04), (0.78, 0.29), (0.79, 0.37), (-0.18, 0.04)], 0.028, (0, 0, 0.975), oxide, 0.012)
    knob("Broad sorter pivot adjuster", (-0.22, 0, 0.98), steel, oxide, dark, radius=0.16)
    for y in [-0.77, 0.77]:
        screw("Junction retained anchor", (-0.10, y, 0.59), steel, dark, radius=0.06)
    for j, x in enumerate([-0.72, 0.39]):
        face = box(f"Incoming document billet {j}", (0.65, 0.70, 0.24), (x, 0, 0.74), oxide if j == 0 else steel, 0.035, incoming)
        engrave_lines(face, [(x - 0.035, 0.18 - k * 0.14, 0.43 if k == 0 else 0.32, 0.035) for k in range(3)], dark, incoming, face_z=0.86)
    face = box("Sorted square process billet", (0.70, 0.70, 0.30), (0.50, 0, 0.77), steel, 0.045, upper)
    engrave_lines(face, [(0.50, 0.16, 0.42, 0.035), (0.44, -0.03, 0.30, 0.035)], dark, upper, face_z=0.92)
    box("Square process oxide edge key", (0.10, 0.52, 0.025), (0.20, 0, 0.932), oxide, 0.010, upper)
    cylinder("Sorted round storage billet", 0.37, 0.30, (0.58, 0, 0.77), steel, parent=lower, bevel=0.035)
    ring("Round billet oxide band", 0.378, 0.35, 0.085, (0.58, 0, 0.79), oxide, parent=lower)
    cylinder("Round storage top face", 0.32, 0.035, (0.58, 0, 0.9375), steel, parent=lower, bevel=0.012)
    for x in [0.47, 0.69]:
        box("Storage top recessed mark", (0.045, 0.26, 0.008), (x, 0, 0.957), graphite, 0.004, lower)


BUILDERS = {name: globals()[name] for name in ["ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo", "ferrigura"]}
