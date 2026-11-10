"""Detailed, editable reconstructions of the nine original Ferra hero instruments.

Run the named entry in heroes/, or select members after -- in this batch entry.
The compact marks and Ferrolink's existing continuity bench are independent.
"""

import hashlib
import json
import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from studio import light, material, provenance, render, scene, studio
from family_marks import tile

ROOT = Path(__file__).resolve().parents[3]
MEMBERS = ("ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo", "ferrigura")
BRIEFS = {
    "ferramenta": "A seven-position precision register holds independent removable inserts: a pattern cassette, token comb, engraved document, letterform tile, catalog leaves, branch gate, and preview aperture. Keyed sockets, flush hex fasteners, small locating pins, replaceable feet, and a copper registration slide make the fixture mechanically explicit. The inserts are independent tools, not a processing chain.",
    "ferroni": "A pattern comparator holds three independent upright pattern cassettes beside a genuine linear guide. A bored scanning carriage rides the guide and carries a copper pointer over a recessed text ribbon. Fine graduations, short match inlays, cassette edge engravings, collars, washers, and socket screws explain storage, scanning, and the selected match position.",
    "ferriki": "A token-and-theme register carries repeated engraved token groups through a transverse registration comb. The output groups use copper, graphite, and steel inlays. A keyed theme cassette, knurled adjustment wheel, guide rods, comb teeth, engraved calibration marks, and retained feed spool form one detailed mechanical assembly.",
    "ferromark": "A document-registration bridge aligns three thin metal leaves: an engraved source sheet, a structured output sheet with a small ruled table, and a copper metadata index. Real engraved line work, a slotted bridge, two registration clamps, small thumbscrews, alignment pins, and a low open support frame preserve the original typesetting metaphor.",
    "ferrolex": "A wordform proofing gauge holds four replaceable engraved type blocks beneath a stepped dictionary-profile bridge. A copper sliding stop, a spare upright affix insert, keyed block seats, hex fasteners, a knurled adjuster, and engraved scales describe wordform and affix comparison. Individual built-in Blender letterforms are cut into the steel, not printed on it.",
    "ferrocat": "A catalog collator holds two banks of separately spaced, indexed metal leaves around one copper resolved leaf. Engraved message rows, varied index tabs, a central keyed alignment channel, registration comb, screw adjuster, and open bank cradles express matching catalog entries and preserving an authoritative correction.",
    "ferralk": "A branching file-path gate has three open machined rails, three tabbed file leaves, a copper pivoting selector aligned with the middle branch, and a graphite stop that closes the lower branch early. The pivot, knurled screw, bearing collars, graduated rails, and separate endpoint feet make selection and pruning physically legible.",
    "ferrugo": "A bounded-preview instrument pairs an upright engraved source document with a smaller matching layout inside a real machined aperture frame. Two open alignment rails, a copper dimension stop, a screw-driven preview carriage, calibration ticks, retained corner screws, and supporting shoes make the source-to-preview relationship explicit.",
    "ferrigura": "An open diagram-layout fixture connects three steel rectangular nodes through one copper decision diamond. Solid graphite orthogonal rails enter fitted node ports; sliding registration collars, real frame recesses, blank metal faces, small corner socket screws, and restrained changes of plane make the diagram a physically coherent three-dimensional object.",
}


def surfaces():
    result = (
        material("Hero brushed polished steel", (0.54, 0.52, 0.48), 0.24),
        material("Hero warm oxide copper", (0.32, 0.11, 0.045), 0.25, oxide=True),
        material("Hero graphite metal", (0.055, 0.050, 0.043), 0.34, metallic=0.75),
        material("Hero dark milled interiors", (0.025, 0.023, 0.020), 0.52, metallic=0.45),
    )
    for surface in result:
        for node in surface.node_tree.nodes:
            if node.type == "BUMP":
                node.inputs["Strength"].default_value = 0.055
                node.inputs["Distance"].default_value = 0.001
    return result


def group(name, location=(0, 0, 0), angles=(0, 0, 0), parent=None):
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = tuple(math.radians(value) for value in angles)
    obj.parent = parent
    return obj


def finish(obj, surface, bevel=0.025, parent=None):
    obj.parent = parent
    if surface:
        obj.data.materials.append(surface)
    if bevel:
        modifier = obj.modifiers.new("Machined edge radius", "BEVEL")
        modifier.width = bevel
        modifier.segments = 4
        modifier.harden_normals = True
        for face in obj.data.polygons:
            face.use_smooth = True
        normals = obj.modifiers.new("Weighted machined normals", "WEIGHTED_NORMAL")
        normals.keep_sharp = True
    return obj


def box(name, size, location, surface, bevel=0.025, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, surface, bevel, parent)


def profile(name, points, depth, location, surface, bevel=0.025, parent=None):
    count = len(points)
    vertices = [(x, y, z) for z in (-depth / 2, depth / 2) for x, y in points]
    faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
    faces.extend((j, (j + 1) % count, (j + 1) % count + count, j + count) for j in range(count))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    return finish(obj, surface, bevel, parent)


def cylinder(name, radius, depth, location, surface, parent=None, vertices=64, bevel=0.012):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    return finish(obj, surface, bevel, parent)


def ring(name, outer, inner, depth, location, surface, parent=None):
    count, vertices, faces = 64, [], []
    for z, radius in [(-depth / 2, outer), (depth / 2, outer), (-depth / 2, inner), (depth / 2, inner)]:
        vertices.extend((radius * math.cos(j * math.tau / count), radius * math.sin(j * math.tau / count), z) for j in range(count))
    for a, b in [(0, 1), (1, 3), (3, 2), (2, 0)]:
        for j in range(count):
            k = (j + 1) % count
            faces.append((a * count + j, a * count + k, b * count + k, b * count + j))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    return finish(obj, surface, 0.006, parent)


def apply(obj):
    bpy.context.view_layer.objects.active = obj
    for modifier in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=modifier.name)


def volume(obj):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    value = abs(bm.calc_volume(signed=True))
    bm.free()
    return value


def subtract(obj, cutters, label="Machined pocket"):
    """Subtract closed cutters together and verify that material was removed."""
    if not isinstance(cutters, list):
        cutters = [cutters]
    apply(obj)
    bpy.ops.object.select_all(action="DESELECT")
    for cutter in cutters:
        apply(cutter)
        cutter.select_set(True)
    bpy.context.view_layer.objects.active = cutters[0]
    if len(cutters) > 1:
        bpy.ops.object.join()
    cutter = bpy.context.object
    original = volume(obj)
    bpy.context.view_layer.update()
    modifier = obj.modifiers.new(label, "BOOLEAN")
    modifier.operation = "DIFFERENCE"
    modifier.solver = "EXACT"
    modifier.use_self = True
    modifier.object = cutter
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    remaining = volume(obj)
    removed = original - remaining
    assert removed > 0.00000001, f"Cutter missed {obj.name}: {label}"
    assert remaining > original * 0.01, f"Cutter consumed {obj.name}: {label}"
    # Boolean-cut planar caps must not interpolate the old bevel's split normals.
    for face in obj.data.polygons:
        if abs(face.normal.z) > 0.999 or len(face.vertices) > 4:
            face.use_smooth = False
    obj["machinedPockets"] = obj.get("machinedPockets", 0) + len(cutters)
    bpy.data.objects.remove(cutter, do_unlink=True)


def screw(name, location, steel, dark, radius=0.085, parent=None):
    """Retained washer, round head, and actual recessed hexagonal socket."""
    x, y, z = location
    ring(f"{name} washer", radius * 1.30, radius * 0.54, 0.022, (x, y, z + 0.011), steel, parent)
    head = cylinder(f"{name} socket head", radius, radius * 0.65, (x, y, z + radius * 0.37), steel, parent, bevel=radius * 0.12)
    cutter = cylinder(f"{name} hex cutter", radius * 0.48, radius, (x, y, z + radius * 0.65), None, parent, vertices=6, bevel=0)
    subtract(head, cutter, "Recessed hex drive")
    cylinder(f"{name} dark socket floor", radius * 0.44, 0.008, (x, y, z + radius * 0.18), dark, parent, vertices=6, bevel=0)


def knob(name, location, steel, copper, dark, radius=0.15, parent=None):
    x, y, z = location
    cylinder(f"{name} spindle", radius * 0.40, 0.20, (x, y, z - 0.06), steel, parent)
    ring(f"{name} thrust washer", radius * 0.91, radius * 0.43, 0.025, (x, y, z), dark, parent)
    cylinder(f"{name} knurled hub", radius, 0.13, (x, y, z + 0.075), copper, parent)
    for j in range(36):
        angle = j * math.tau / 36
        cylinder(f"{name} grip ridge {j + 1}", 0.007, 0.095, (x + radius * math.cos(angle), y + radius * math.sin(angle), z + 0.075), copper, parent, vertices=8, bevel=0.002)
    screw(f"{name} center", (x, y, z + 0.14), steel, dark, radius=0.035, parent=parent)


def rod(name, start, end, radius, surface, parent=None):
    a, b = Vector(start), Vector(end)
    obj = cylinder(name, radius, (b - a).length, (a + b) / 2, surface, parent, bevel=0.008)
    obj.rotation_euler = (b - a).to_track_quat("Z", "Y").to_euler()
    return obj


def lead_screw(name, start, turns, pitch, surface):
    """A continuous helical thread, wound around the screw's X-axis shaft."""
    radial, wire, sides, steps = 0.038, 0.007, 8, turns * 24
    vertices, faces = [], []
    origin = Vector(start)
    for j in range(steps + 1):
        angle = j * math.tau / 24
        center = origin + Vector((j * pitch / 24, radial * math.cos(angle), radial * math.sin(angle)))
        normal = Vector((0, math.cos(angle), math.sin(angle)))
        tangent = Vector((pitch / math.tau, -radial * math.sin(angle), radial * math.cos(angle))).normalized()
        side = tangent.cross(normal)
        for k in range(sides):
            phi = k * math.tau / sides
            vertices.append(tuple(center + wire * (normal * math.cos(phi) + side * math.sin(phi))))
    for j in range(steps):
        for k in range(sides):
            n = (k + 1) % sides
            faces.append((j * sides + k, j * sides + n, (j + 1) * sides + n, (j + 1) * sides + k))
    faces.extend([tuple(reversed(range(sides))), tuple(range(steps * sides, (steps + 1) * sides))])
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    finish(obj, surface, 0)
    for face in mesh.polygons:
        face.use_smooth = True
    return obj


def path_rail(name, points, width, depth, z, surface, parent=None):
    """One continuous solid rail with mitered bends and visible end faces."""
    route = [Vector(point) for point in points]
    left, right = [], []
    for j, point in enumerate(route):
        incoming = (route[j] - route[j - 1]).normalized() if j else (route[1] - point).normalized()
        outgoing = (route[j + 1] - point).normalized() if j < len(route) - 1 else incoming
        n1, n2 = Vector((-incoming.y, incoming.x)), Vector((-outgoing.y, outgoing.x))
        normal = (n1 + n2).normalized()
        offset = normal * (width / 2 / max(normal.dot(n1), 0.15))
        left.append(tuple(point + offset))
        right.append(tuple(point - offset))
    return profile(name, left + list(reversed(right)), depth, (0, 0, z), surface, min(width * 0.18, depth * 0.22), parent)


def engrave_lines(obj, lines, dark, parent=None, face_z=0.05):
    """Shallow rectangular pockets with separate, slightly recessed dark floors."""
    cutters = []
    for index, (x, y, width, height) in enumerate(lines):
        cutters.append(box(f"{obj.name} groove cutter {index}", (width, height, 0.06), (x, y, face_z + 0.005), None, 0, parent))
        box(f"{obj.name} groove floor {index}", (width * 0.99, height * 0.96, 0.006), (x, y, face_z - 0.021), dark, 0, parent)
    subtract(obj, cutters, "Engraved diagram and text marks")


def graduations(name, start, end, y, z, steel, dark, count=40, parent=None):
    strip = box(name, (end - start + 0.14, 0.26, 0.065), ((start + end) / 2, y, z - 0.025), steel, 0.012, parent)
    lines = []
    for j in range(count + 1):
        x = start + (end - start) * j / count
        length = 0.18 if j % 5 == 0 else 0.10
        lines.append((x, y, 0.013, length))
    engrave_lines(strip, lines, dark, parent, face_z=z + 0.0075)
    return strip


def panel(name, width, height, location, surface, angles=(90, 0, 0), parent=None, clip=0):
    carrier = group(name, location, angles, parent)
    x, y = width / 2, height / 2
    points = [(-x, -y), (x, -y), (x, y - clip), (x - clip, y), (-x, y)] if clip else [(-x, -y), (x, -y), (x, y), (-x, y)]
    body = profile(f"{name} leaf", points, 0.10, (0, 0, 0), surface, 0.025, carrier)
    return carrier, body


def document_marks(obj, width, height, dark, parent, table=False, sparse=False, face_z=0.05):
    lines = [(0, height * 0.32, width * 0.73, 0.075)]
    for j in range(3 if sparse else 6):
        yy = height * 0.19 - j * height * 0.060
        length = width * (0.72 if j % 3 != 2 else 0.53)
        lines.append((-width * 0.36 + length / 2, yy, length, 0.022))
    if table:
        yy = -height * 0.23
        row_step = height * 0.06
        for j in range(3):
            lines.append((0, yy - j * row_step, width * 0.73, 0.014))
        for xx in [-width * 0.365, -width * 0.04, width * 0.365]:
            lines.append((xx, yy - row_step, 0.014, row_step * 2))
    else:
        for j in range(3):
            lines.append((-width * 0.05, -height * (0.19 + j * 0.075), width * (0.62 if j != 2 else 0.40), 0.022))
    engrave_lines(obj, lines, dark, parent, face_z=face_z)


def letter_pocket(obj, letter, center, height, dark, parent=None, floor_z=0.04):
    curve = bpy.data.curves.new(f"{letter} letterform cutter", "FONT")
    curve.body, curve.extrude, curve.resolution_u = letter, 0.3, 16
    cutter = bpy.data.objects.new(f"{letter} letterform cutter", curve)
    bpy.context.scene.collection.objects.link(cutter)
    bpy.ops.object.select_all(action="DESELECT")
    cutter.select_set(True)
    bpy.context.view_layer.objects.active = cutter
    bpy.ops.object.convert(target="MESH")
    xs, ys, zs = ([getattr(vertex.co, axis) for vertex in cutter.data.vertices] for axis in ("x", "y", "z"))
    scale = height / (max(ys) - min(ys))
    for vertex in cutter.data.vertices:
        vertex.co.x = (vertex.co.x - (min(xs) + max(xs)) / 2) * scale + center[0]
        vertex.co.y = (vertex.co.y - (min(ys) + max(ys)) / 2) * scale + center[1]
        vertex.co.z = floor_z + (vertex.co.z - min(zs)) / (max(zs) - min(zs)) * 0.6
    cutter.parent = parent
    bm = bmesh.new()
    bm.from_mesh(cutter.data)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.000001)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(cutter.data)
    bm.free()
    subtract(obj, cutter, f"Engraved letterform {letter}")


def bench(name, length, width, steel, graphite, dark, z=0.18):
    box(f"{name} graphite lower edge", (length, width, 0.17), (0, 0, z - 0.06), graphite, 0.09)
    top = box(f"{name} steel bed", (length - 0.045, width - 0.045, 0.18), (0, 0, z + 0.055), steel, 0.08)
    for x in [-length / 2 + 0.23, length / 2 - 0.23]:
        for y in [-width / 2 + 0.20, width / 2 - 0.20]:
            cylinder(f"{name} isolated foot", 0.115, 0.12, (x, y, z - 0.185), graphite)
            screw(f"{name} bed anchor", (x, y, z + 0.15), steel, dark, radius=0.075)
    return top


def verify_geometry():
    checks = []
    bpy.context.view_layer.update()
    graph = bpy.context.evaluated_depsgraph_get()
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        evaluated = obj.evaluated_get(graph)
        mesh = evaluated.to_mesh()
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.0000001)
        assert all(edge.is_manifold for edge in bm.edges), f"Open final body: {obj.name}"
        size = abs(bm.calc_volume(signed=True))
        assert size > 0.0000000001, f"Empty final body: {obj.name}"
        checks.append({"body": obj.name, "closedManifold": True, "volume": round(size, 9), "machinedPockets": obj.get("machinedPockets", 0)})
        bm.free()
        evaluated.to_mesh_clear()
    return checks


def ferramenta(steel, copper, graphite, dark):
    bed = bench("Independent tool register", 7.65, 1.70, steel, graphite, dark)
    positions = [-3.0, -2.0, -1.0, 0, 1.0, 2.0, 3.0]
    cutters = [box(f"Keyed insert socket {j}", (0.72, 0.31, 0.22), (x, 0.14, 0.35), None, 0.025) for j, x in enumerate(positions)]
    subtract(bed, cutters, "Seven independent keyed sockets")
    for j, x in enumerate(positions):
        box(f"Insert {j + 1} graphite socket liner", (0.70, 0.29, 0.12), (x, 0.14, 0.28), dark, 0.02)
        box(f"Insert {j + 1} locating tongue", (0.58, 0.17, 0.25), (x, 0.14, 0.41), copper if j == 0 else steel, 0.02)
        if j == 0:
            g, plate = panel("Pattern reference cassette", 0.56, 1.43, (x, 0.14, 1.11), steel)
            box("Oxide cassette spine", (0.115, 1.37, 0.08), (-0.18, 0, 0.065), copper, 0.018, g)
            engrave_lines(plate, [(0.12, -0.55 + k * 0.12, 0.16, 0.016) for k in range(10)], dark, g)
        elif j == 1:
            g, plate = panel("Syntax registration comb", 0.60, 1.18, (x, 0.14, 0.99), steel)
            cuts = [box(f"Open token gap {k}", (0.40, 0.083, 0.40), (0.20, -0.41 + k * 0.20, 0), None, 0.018, g) for k in range(5)]
            subtract(plate, cuts, "Open syntax comb teeth")
            for k in range(5):
                box(f"Copper token inset {k}", (0.20, 0.045, 0.025), (-0.09, -0.40 + k * 0.20, 0.052), copper, 0.007, g)
        elif j == 2:
            g, plate = panel("Structured document insert", 0.69, 1.20, (x, 0.14, 1.00), steel)
            document_marks(plate, 0.69, 1.20, dark, g, sparse=True)
        elif j == 3:
            g, plate = panel("Wordform insert", 0.62, 0.92, (x, 0.14, 0.86), steel)
            letter_pocket(plate, "a", (0, 0), 0.60, dark, g, floor_z=0.005)
        elif j == 4:
            for side in [-1, 1]:
                g, plate = panel(f"Catalog leaf {side}", 0.34, 1.16, (x + side * 0.16, 0.14, 0.98), steel, angles=(90, 0, side * 11))
                engrave_lines(plate, [(0, 0.30 - k * 0.12, 0.23, 0.014) for k in range(6)], dark, g)
            rod("Copper catalog hinge", (x, 0.14, 0.42), (x, 0.14, 1.56), 0.045, copper)
        elif j == 5:
            g = group("Independent branch insert", (x, 0.14, 1.04), (90, 0, 0))
            p = [(-0.11, -0.64), (0.11, -0.64), (0.11, 0.04), (0.38, 0.34), (0.38, 0.57), (0.23, 0.57), (0, 0.30), (-0.23, 0.57), (-0.38, 0.57), (-0.38, 0.34), (-0.11, 0.04)]
            profile("Steel branching insert", p, 0.17, (0, 0, 0), steel, 0.027, g)
            path_rail("Copper branch selector", [(0, -0.48), (0, 0.18), (0.28, 0.49)], 0.065, 0.025, 0.095, copper, g)
        else:
            g, plate = panel("Bounded preview insert", 0.65, 0.95, (x, 0.14, 0.875), steel)
            cut = box("Preview insert aperture cutter", (0.41, 0.65, 0.40), (0, 0, 0), None, 0.025, g)
            subtract(plate, cut, "Real preview insert aperture")
            box("Copper preview insert", (0.36, 0.60, 0.045), (0, 0, -0.025), copper, 0.02, g)
    box("Front registration track", (2.05, 0.11, 0.15), (1.98, -0.82, 0.29), graphite, 0.018)
    box("Copper sliding registration tab", (0.46, 0.20, 0.24), (1.28, -0.83, 0.31), copper, 0.025)
    graduations("Register fine scale", -3.15, 0.75, -0.59, 0.35, steel, dark, count=39)


def ferroni(steel, copper, graphite, dark):
    bench("Pattern comparator", 7.35, 1.38, steel, graphite, dark)
    cassette_bed = box("Three-cassette holder", (1.18, 0.81, 0.28), (-2.91, 0.12, 0.45), steel, 0.06)
    cuts = [box(f"Cassette keyed slot {j}", (0.23, 0.30, 0.28), (-3.25 + j * 0.35, 0.12, 0.56), None, 0.015) for j in range(3)]
    subtract(cassette_bed, cuts, "Three separated pattern sockets")
    for j in range(3):
        x = -3.25 + j * 0.35
        g, plate = panel(f"Pattern cassette {j + 1}", 0.23, 1.20, (x, 0.12, 1.07), copper if j == 2 else steel)
        engrave_lines(plate, [(0, -0.34, 0.055, 0.49), (0, 0.14, 0.055, 0.25)], dark, g)
        screw(f"Cassette {j + 1} retaining screw", (0, 0.43, 0.052), steel, dark, radius=0.035, parent=g)
    for x in [-2.09, 3.13]:
        cylinder("Comparator guide standoff", 0.17, 0.43, (x, 0.30, 0.49), steel)
        screw("Guide standoff cap", (x, 0.30, 0.72), steel, dark, radius=0.078)
    rod("Continuous comparator guide", (-2.09, 0.30, 0.66), (3.13, 0.30, 0.66), 0.075, steel)
    ribbon = box("Engraved source ribbon", (5.08, 0.61, 0.085), (0.52, -0.17, 0.36), steel, 0.022)
    marks = [(x, -0.17, 0.024, 0.20 if j % 4 else 0.32) for j, x in enumerate([-1.91 + j * 0.095 for j in range(51)])]
    engrave_lines(ribbon, marks, dark, face_z=0.4025)
    for x, width in [(1.87, 0.18), (2.45, 0.09)]:
        box("Selected match inlay", (width, 0.28, 0.024), (x, -0.17, 0.406), copper, 0.006)
    carriage = ring("Bored scanner bearing", 0.205, 0.082, 0.40, (0.42, 0.30, 0.66), steel)
    carriage.rotation_euler.y = math.pi / 2
    cylinder("Scanner upper pivot", 0.145, 0.21, (0.42, 0.30, 0.86), steel)
    lever = profile("Copper scanning lever", [(-0.12, -0.15), (0.80, -0.48), (0.94, -0.37), (0.10, 0.11)], 0.085, (0.42, 0.30, 0.98), copper, 0.025)
    rod("Fine match pointer", (1.25, -0.11, 0.94), (1.25, -0.26, 0.43), 0.027, copper)
    screw("Scanner pivot screw", (0.42, 0.30, 1.03), steel, dark, radius=0.074)
    screw("Pointer joint screw", (1.25, -0.11, 1.02), steel, dark, radius=0.045)
    graduations("Comparator carriage scale", -2.02, 3.04, -0.53, 0.34, steel, dark, count=50)


def ferriki(steel, copper, graphite, dark):
    bench("Token theme register", 6.85, 1.42, steel, graphite, dark)
    ribbon = box("Continuous token ribbon", (5.64, 0.64, 0.10), (0.36, 0, 0.37), steel, 0.022)
    token_lines = []
    for group_index, x in enumerate([-1.84, -0.96, -0.08]):
        for k in range(5):
            token_lines.append((x + k * 0.095, (k % 2) * 0.035, 0.025, 0.30 if k < 3 else 0.19))
    engrave_lines(ribbon, token_lines, dark, face_z=0.42)
    for group_index, x in enumerate([1.02, 1.88, 2.69]):
        for k in range(5):
            obj = box(f"Mapped theme token {group_index + 1}.{k + 1}", (0.030, 0.30 if k < 3 else 0.19, 0.018), (x + (k - 2) * 0.090, (k % 2) * 0.035, 0.425), [copper, graphite, steel][group_index], 0.004)
            obj.rotation_euler.z = math.radians(-13)
    cylinder("Feed spool lower bearing", 0.40, 0.16, (-2.86, 0, 0.39), steel)
    cylinder("Feed spool retaining hub", 0.27, 0.36, (-2.86, 0, 0.63), steel)
    ring("Feed spool upper lip", 0.29, 0.10, 0.06, (-2.86, 0, 0.83), steel)
    screw("Feed spool anchor", (-2.86, 0, 0.86), steel, dark, radius=0.105)
    for y in [-0.49, 0.49]:
        rod("Theme carriage guide", (-2.35, y, 0.48), (3.09, y, 0.48), 0.040, steel)
        for x in [-2.35, 3.09]:
            cylinder("Theme guide locating pin", 0.06, 0.18, (x, y, 0.47), steel)
    comb = box("Transverse registration comb", (0.34, 1.18, 0.20), (0.47, 0, 0.62), steel, 0.055)
    teeth = [box(f"Comb tooth gap {j}", (0.10, 0.025, 0.20), (0.47, -0.43 + j * 0.085, 0.55), None, 0.004) for j in range(11)]
    subtract(comb, teeth, "Visible registration comb teeth")
    for y in [-0.49, 0.49]:
        screw("Registration comb guide screw", (0.47, y, 0.74), steel, dark, radius=0.067)
    knob("Theme cassette adjuster", (0.47, 0, 0.74), steel, copper, dark, radius=0.125)
    box("Copper keyed theme cassette", (0.22, 0.64, 0.13), (0.72, 0, 0.49), copper, 0.02)
    box("Theme cassette pull tab", (0.40, 0.11, 0.11), (0.78, 0.64, 0.43), copper, 0.015)
    graduations("Theme alignment scale", -2.19, 3.00, -0.59, 0.35, steel, dark, count=44)


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
    for x, letter in zip(xs, "afne"):
        box(f"{letter} type block lower key", (1.02, 0.84, 0.16), (x, -0.20, 0.30), graphite, 0.025)
        g = group(f"{letter} removable type block", (x, -0.20, 0.46))
        face = box(f"{letter} type block steel face", (1.03, 0.88, 0.20), (0, 0, 0), steel, 0.035, g)
        letter_pocket(face, letter, (0, 0), 0.59, dark, g, floor_z=0.025)
    for x in [-2.83, 2.71]:
        cylinder("Dictionary profile support", 0.18, 0.75, (x, 0.49, 0.68), steel)
        screw("Dictionary support cap", (x, 0.49, 1.07), steel, dark, radius=0.094)
    # The underside profile has a real stepped relief above each removable block.
    outline = [(-2.83, 1.01), (2.71, 1.01), (2.71, 0.67)]
    for x in reversed(xs):
        outline.extend([(x + 0.49, 0.67), (x + 0.49, 0.79), (x - 0.49, 0.79), (x - 0.49, 0.67)])
    outline.append((-2.83, 0.67))
    carrier = group("Stepped dictionary profile", (0, 0.49, 0), (90, 0, 0))
    profile("Machined stepped profile bar", outline, 0.28, (0, 0, 0), steel, 0.025, carrier)
    box("Copper profile stop rear", (0.19, 0.39, 0.52), (1.03, 0.49, 0.91), copper, 0.025)
    box("Copper profile stop front foot", (0.34, 0.27, 0.10), (1.03, 0.25, 0.68), copper, 0.022)
    knob("Profile stop screw", (1.03, 0.49, 1.21), steel, copper, dark, radius=0.105)
    spare_bed = box("Affix insert side holder", (0.48, 0.62, 0.22), (3.02, 0.34, 0.39), steel, 0.045)
    subtract(spare_bed, box("Affix insert socket cutter", (0.20, 0.23, 0.35), (3.02, 0.34, 0.48), None, 0.012), "Keyed spare-affix socket")
    g, plate = panel("Spare affix insert", 0.18, 0.75, (3.02, 0.34, 0.78), copper)
    engrave_lines(plate, [(0, -0.11 + k * 0.11, 0.09, 0.018) for k in range(4)], dark, g)
    graduations("Wordform reference scale", -2.38, 2.36, -0.68, 0.34, steel, dark, count=40)


def catalog_leaf(name, x, y, height, tab_x, surface, steel, dark):
    width = 1.44
    carrier = group(name, (x, y, 0.35 + height / 2), (90, 0, 0))
    left, right, bottom, top = -width / 2, width / 2, -height / 2, height / 2
    points = [(left, bottom), (right, bottom), (right, top - 0.12), (tab_x + 0.20, top - 0.12), (tab_x + 0.14, top), (tab_x - 0.16, top), (tab_x - 0.22, top - 0.12), (left, top - 0.12)]
    body = profile(f"{name} tabbed leaf", points, 0.06, (0, 0, 0), surface, 0.018, carrier)
    lines = [(0, top * 0.46 - j * 0.15, 0.91 if j != 2 else 0.70, 0.035) for j in range(3)]
    engrave_lines(body, lines, dark, carrier, face_z=0.030)
    return carrier


def ferrocat(steel, copper, graphite, dark):
    for side in [-1, 1]:
        x = side * 2.32
        bench_name = f"Catalog bank {side}"
        # The bank remains open above its low cradle, with separate page slots.
        box(f"{bench_name} base", (1.95, 1.58, 0.21), (x, 0.10, 0.20), steel, 0.09)
        for yy in [-0.66, 0.86]:
            box(f"{bench_name} retaining lip", (1.98, 0.10, 0.25), (x, yy, 0.32), steel, 0.035)
        for j in range(7):
            yy = -0.51 + j * 0.185
            height = 1.00 + j * 0.067
            catalog_leaf(f"{bench_name} leaf {j + 1}", x, yy, height, -0.38 + (j % 3) * 0.35, steel, steel, dark)
        for xx in [x - 0.81, x + 0.81]:
            screw(f"{bench_name} front anchor", (xx, -0.66, 0.46), steel, dark, radius=0.069)
    for y in [-0.38, 0.48]:
        rod("Catalog identity alignment rail", (-1.42, y, 0.30), (1.42, y, 0.30), 0.055, steel)
    box("Resolved leaf keyed shoe", (0.87, 0.62, 0.20), (0, 0.15, 0.31), graphite, 0.035)
    catalog_leaf("Authoritative copper catalog leaf", 0, 0.15, 1.35, 0.0, copper, steel, dark)
    comb = box("Identity registration comb", (2.76, 0.22, 0.18), (0, -0.48, 0.39), steel, 0.022)
    cuts = [box(f"Identity tooth cutter {j}", (0.04, 0.32, 0.14), (-1.25 + j * 0.125, -0.48, 0.46), None, 0.004) for j in range(21)]
    subtract(comb, cuts, "Individual identity comb teeth")
    knob("Catalog merge registration screw", (0.84, -0.48, 0.51), steel, copper, dark, radius=0.13)
    graduations("Catalog alignment scale", -1.21, 1.18, -0.73, 0.28, steel, dark, count=24)


def file_tab(name, location, steel, copper, dark, selected=False):
    x, y, z = location
    cylinder(f"{name} end bearing", 0.22, 0.20, (x, y, z), steel)
    g = group(name, (x, y, z + 0.35), (90, 0, 0))
    points = [(-0.37, -0.27), (0.37, -0.27), (0.37, 0.15), (0.04, 0.15), (-0.04, 0.27), (-0.28, 0.27), (-0.37, 0.18)]
    leaf = profile(f"{name} tabbed file", points, 0.11, (0, 0, 0), copper if selected else steel, 0.025, g)
    engrave_lines(leaf, [(-0.025, 0.015, 0.43, 0.022), (-0.075, -0.095, 0.33, 0.022)], dark, g, face_z=0.055)
    return g


def ferralk(steel, copper, graphite, dark):
    path_rail("Common file-tree root rail", [(-3.15, 0), (-0.88, 0)], 0.35, 0.19, 0.25, steel)
    for name, points in [
        ("Upper directory branch", [(-0.90, 0.09), (0.54, 1.12), (2.82, 1.12)]),
        ("Selected middle directory branch", [(-0.79, 0), (2.82, 0)]),
        ("Pruned lower directory branch", [(-0.90, -0.09), (0.54, -1.12), (2.82, -1.12)]),
    ]:
        path_rail(name, points, 0.26, 0.19, 0.25, steel)
    for x, y in [(-3.10, 0), (2.82, -1.12), (2.82, 0), (2.82, 1.12)]:
        cylinder("Branch endpoint foot", 0.29, 0.13, (x, y, 0.10), graphite)
        cylinder("Branch endpoint machined cap", 0.28, 0.14, (x, y, 0.22), steel)
    for j, y in enumerate([-1.12, 0, 1.12]):
        file_tab(f"Reachable file {j + 1}", (2.82, y, 0.35), steel, copper, dark, selected=j == 1)
    cylinder("Selector main pivot bearing", 0.24, 0.34, (-0.90, 0, 0.44), steel)
    selector = profile("Copper pattern-selection lever", [(-1.04, -0.14), (1.31, -0.14), (1.46, 0), (1.31, 0.14), (-1.04, 0.14)], 0.11, (0, 0, 0.66), copper, 0.03)
    slot = box("Selector adjustment slot cutter", (1.38, 0.055, 0.35), (0.25, 0, 0.66), None, 0.02)
    subtract(selector, slot, "Long pattern-selector adjustment slot")
    knob("Pattern gate pivot adjuster", (-0.90, 0, 0.75), steel, copper, dark, radius=0.16)
    cylinder("Selected path locating pin", 0.065, 0.40, (1.27, 0, 0.47), steel)
    screw("Selected path pin retainer", (1.27, 0, 0.72), steel, dark, radius=0.066)
    stop = box("Early traversal graphite stop", (0.34, 0.47, 0.32), (1.10, -1.12, 0.48), graphite, 0.035)
    engrave_lines(stop, [(1.10, -1.27 + j * 0.10, 0.22, 0.022) for j in range(4)], dark, face_z=0.64)
    graduations("Root path reference scale", -2.68, -1.36, -0.20, 0.25, steel, dark, count=15)
    screw("Root gate anchor", (-3.10, 0, 0.31), steel, dark, radius=0.105)


def ferrugo(steel, copper, graphite, dark):
    for y in [-0.48, 0.48]:
        rod("Open source-to-preview guide", (-2.92, y, 0.25), (3.20, y, 0.25), 0.06, steel)
    for x, width in [(-1.98, 2.36), (2.08, 2.28)]:
        box("Document carriage shoe", (width, 1.18, 0.24), (x, 0, 0.23), steel, 0.08)
        for xx in [x - width / 2 + 0.16, x + width / 2 - 0.16]:
            screw("Document carriage shoe anchor", (xx, -0.43, 0.36), steel, dark, radius=0.064)
    g, plate = panel("Upright source document", 1.86, 2.37, (-2.05, 0.18, 1.535), steel, clip=0.15)
    document_marks(plate, 1.86, 2.37, dark, g, table=True)
    for x in [-3.11, -0.99]:
        cylinder("Source holder upright", 0.085, 2.27, (x, 0.24, 1.46), steel)
        screw("Source holder upper anchor", (x, 0.24, 2.63), steel, dark, radius=0.068)
    g = group("Bounded preview carriage", (2.05, -0.08, 1.04), (90, 0, 0))
    frame = box("Real preview aperture frame", (2.10, 1.44, 0.21), (0, 0, 0), steel, 0.07, g)
    cut = box("Preview aperture cutter", (1.72, 1.06, 0.60), (0, 0, 0), None, 0.035, g)
    subtract(frame, cut, "Real bounded preview aperture")
    preview = box("Recessed rendered preview plate", (1.73, 1.07, 0.075), (0, 0, -0.025), steel, 0.02, g)
    # Repeat the source layout at a smaller scale inside the clear aperture.
    document_marks(preview, 1.65, 1.02, dark, g, table=True, face_z=0.0125)
    for x in [-0.92, 0.92]:
        for y in [-0.59, 0.59]:
            screw("Preview frame retained corner screw", (x, y, 0.11), steel, dark, radius=0.048, parent=g)
    box("Copper upper preview dimension stop", (0.39, 0.16, 0.26), (0.25, 0.72, 0.01), copper, 0.02, g)
    for j in range(19):
        box("Preview frame calibration tick", (0.013, 0.06 if j % 3 else 0.10, 0.014), (-0.73 + j * 0.081, 0.63, 0.11), graphite, 0, g)
    rod("Preview adjustment screw shaft", (0.05, -0.46, 0.38), (1.30, -0.46, 0.38), 0.033, steel)
    lead_screw("Continuous preview lead-screw thread", (0.10, -0.46, 0.38), 24, 0.044, steel)
    bearing = box("Preview lead-screw bearing stand", (0.18, 0.23, 0.27), (0.25, -0.46, 0.32), steel, 0.025)
    bore = rod("Preview bearing bore cutter", (0.10, -0.46, 0.38), (0.40, -0.46, 0.38), 0.047, None)
    subtract(bearing, bore, "Clear lead-screw bearing bore")
    wheel = group("Preview axial adjustment wheel", (0.05, -0.46, 0.38), (0, -90, 0))
    knob("Preview position adjuster", (0, 0, 0), steel, copper, dark, radius=0.125, parent=wheel)
    graduations("Preview track dimension scale", -0.36, 1.13, 0.53, 0.24, steel, dark, count=20)


def ferrigura(steel, copper, graphite, dark):
    def diagram_node(name, location, width, height, surface, diamond=False):
        carrier = group(name, location, (90, 0, 0))
        if diamond:
            face_group = group(f"{name} diamond plane", angles=(0, 0, 45), parent=carrier)
        else:
            face_group = carrier
        box(f"{name} graphite rear rim", (width + 0.07, height + 0.07, 0.19), (0, 0, -0.045), graphite, 0.09, face_group)
        tile(f"{name} broad crowned metal face", width, height, 0.12, 0.075, surface, face_group, (0, 0, 0.07), crown=0.040 if diamond else 0.022)
        for x in [-width / 2 + 0.13, width / 2 - 0.13]:
            for y in [-height / 2 + 0.13, height / 2 - 0.13]:
                screw(f"{name} corner socket", (x, y, 0.13), steel, dark, radius=0.040, parent=face_group)
        return carrier

    diagram_node("Source diagram node", (-2.73, 0, 1.46), 1.78, 0.99, steel)
    diagram_node("Copper decision node", (0, 0, 1.46), 0.99, 0.99, copper, diamond=True)
    diagram_node("Upper diagram node", (2.65, 0.04, 2.22), 1.76, 0.96, steel)
    diagram_node("Lower diagram node", (2.65, -0.04, 0.67), 1.76, 0.96, steel)
    rail_plane = group("Continuous orthogonal graph rails", (0, 0.06, 0), (90, 0, 0))
    for name, points in [
        ("Source to decision", [(-1.90, 1.46), (-0.61, 1.46)]),
        ("Shared decision stem", [(0.61, 1.46), (1.17, 1.46)]),
        ("Decision to upper node", [(1.17, 1.46), (1.17, 2.22), (1.82, 2.22)]),
        ("Decision to lower node", [(1.17, 1.46), (1.17, 0.67), (1.82, 0.67)]),
    ]:
        path_rail(name, points, 0.16, 0.16, 0, graphite, rail_plane)
    for x, z in [(-1.80, 1.46), (-0.66, 1.46), (0.66, 1.46), (1.80, 2.22), (1.80, 0.67)]:
        sleeve = ring("Node port registration collar", 0.155, 0.125, 0.21, (x, 0.06, z), steel)
        sleeve.rotation_euler.y = math.pi / 2
        # The screw enters the collar from its upper surface, perpendicular to the rail.
        screw("Node port collar clamp", (x, 0.06, z + 0.145), steel, dark, radius=0.035)
    for x, z in [(1.17, 2.22), (1.17, 0.67)]:
        collar = box("Elbow registration block", (0.25, 0.23, 0.25), (x, 0.06, z), graphite, 0.035)
        screw("Elbow registration screw", (x, 0.06, z + 0.13), steel, dark, radius=0.048)


def render_member(name, construction=None, draft=False):
    construction = Path(construction or Path(__file__).with_name("heroes") / f"{name}.py").resolve()
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    result = scene(f"{name.capitalize()} hero instrument", draft=draft)
    result.render.resolution_x = 1200 if draft else 2400
    result.render.resolution_y = 600 if draft else 1200
    result.cycles.samples = 32 if draft else 192
    globals()[name](*surfaces())
    checks = verify_geometry()
    if name == "ferrigura":
        studio((0, 0, 1.35), (3.6, -13, 7.0))
    else:
        studio((0, 0, 0.75), (4.8, -10, 8.3))
    light("Long front reflection", (-1, -6, 6), 220, 6, 1.4, (1, 0.97, 0.93), (0, 0, 0.7))
    light("Low upright-face reflection card", (-3, -5, -1.5), 140, 6, 3, (1, 0.97, 0.93), (0, 0, 1))
    path = ROOT / (f".impeccable/review/blender-heroes/{name}-draft.png" if draft else f"design/ferra/masters/{name}/instrument.png")
    render(result, path)
    print(f"RENDERED {name}: {len(checks)} closed solid parts", flush=True)
    if draft:
        return
    provenance(path, name.capitalize(), "Transparent native Blender homepage instrument master", BRIEFS[name] + " Detailed machined construction, actual recessed marks, separate fasteners, brushed polished steel, warm oxide copper, graphite interiors, directional softbox reflections, and genuine transparent negative space.", construction, checks)
    sidecar = path.with_suffix(".png.json")
    record = json.loads(sidecar.read_text())
    source = Path(__file__).resolve()
    record["createdAt"] = "2026-10-30"
    record["constructionSources"][source.relative_to(ROOT).as_posix()] = hashlib.sha256(source.read_bytes()).hexdigest()
    shared_shape = source.with_name("family_marks.py")
    record["constructionSources"][shared_shape.relative_to(ROOT).as_posix()] = hashlib.sha256(shared_shape.read_bytes()).hexdigest()
    reference = f"design/ferra/concepts/{name}/pre-blender-instrument.png"
    record["conceptReference"] = {"source": reference, "sourceSha256": hashlib.sha256((ROOT / reference).read_bytes()).hexdigest(), "promptSidecar": f"{reference}.json"}
    record["renderProfile"] = "Detailed brushed polished steel, oxide copper, graphite and milled recesses; directional area softboxes and a long front strip; orthographic three-quarter view; Cycles 192 samples; AgX Medium High Contrast; sRGB alpha."
    record["verificationScope"] = "Every evaluated mesh is closed and has positive volume; each boolean removes material. Assemblies include intended contacts and fitted parts; no general collision-free claim is made."
    if name in ["ferramenta", "ferrolex"]:
        record["letteringSource"] = "Blender bundled Bfont converted to recessed mesh geometry; no additional font file is shipped."
    sidecar.write_text(json.dumps(record, indent=2) + "\n")
    result.render.filepath = f"//../../masters/{name}/instrument.png"
    for unused in [item for item in bpy.data.scenes if item != result]:
        bpy.data.scenes.remove(unused)
    for area in bpy.context.screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.region_3d.view_perspective = "CAMERA"
            area.spaces.active.shading.color_type = "MATERIAL"
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(construction.with_suffix(".blend")), compress=True)


if __name__ == "__main__":
    selected = [name for name in MEMBERS if name in sys.argv] or MEMBERS
    for member in selected:
        render_member(member, draft="--draft" in sys.argv)
