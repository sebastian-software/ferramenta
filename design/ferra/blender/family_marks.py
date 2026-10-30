"""Editable Ferra family marks, preserving each existing motif in polished metal.

Run one sibling script, or render all eight:
  Blender --background --python design/ferra/blender/family_marks.py -- --draft
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
from studio import light, material, provenance, render, save, scene, studio

ROOT = Path(__file__).resolve().parents[3]
MEMBERS = ("ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo")
BRIEFS = {
    "ferramenta": "A single polished steel F-shaped precision register, with two open keyed bays, a warm copper removable insert on its upper arm, and an open graphite backing. Continuous machined geometry, rounded rims, a compact square envelope, and real shallow depth.",
    "ferroni": "Three separated polished steel pattern rails on a graphite spine. A single raised copper scanning carriage crosses them diagonally and ends in one broad pointer. Clear air between the rails, a compact silhouette, and real layered construction.",
    "ferriki": "Four substantial syntax-token tiles in a staggered two-row cassette: three polished steel tokens and one chamfered copper token. Open gaps, subtle offsets of plane, and one graphite registration corner preserve a compact palette silhouette.",
    "ferromark": "Two offset document leaves with clipped upper corners: polished steel in front and warm copper behind, held by one graphite registration corner. The leaves occupy slightly different planes and show broad face reflections and real edge thickness.",
    "ferrolex": "A polished steel type tile with a large lowercase a cut through its face into a dark graphite registration backing. A short copper alignment tab sits at its right. The broad letterform remains legible in a compact, slightly turned solid tile.",
    "ferrocat": "Two independent polished steel catalog leaves with broad recessed message slots and distinct index tabs, aligned by one copper bridge in an open graphite cradle. Small differences of plane reveal both leaves without obscuring their slots.",
    "ferralk": "One substantial polished steel file folder, with an index tab in its upper silhouette and a large six-armed copper asterisk mounted on its face. The broad blunt-ended wildcard expresses glob-pattern matching. A narrow graphite rear edge shows solid depth without an external frame. Compact filled mass, generous visible copper arms, and no branching diagram.",
    "ferrugo": "A polished steel document with a clipped upper corner and two broad recessed document strokes, held within a graphite preview aperture. A copper lower corner stop bounds the preview. Solid machined depth and a shallow three-quarter view preserve the familiar document silhouette.",
}


def group(name, location=(0, 0, 0), angles=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = tuple(math.radians(value) for value in angles)
    return obj


def materials():
    surfaces = [
        material("Ferra polished steel", (0.54, 0.52, 0.48), 0.18),
        material("Ferra polished oxide copper", (0.32, 0.11, 0.045), 0.22, oxide=True),
        material("Ferra graphite registration metal", (0.033, 0.030, 0.026), 0.38, metallic=0.55),
    ]
    for surface, roughness in zip(surfaces, (0.18, 0.22, 0.38)):
        for shader in surface.node_tree.nodes:
            if shader.type == "BUMP":
                shader.inputs["Strength"].default_value = 0.035
                shader.inputs["Distance"].default_value = 0.001
            elif shader.type == "MAP_RANGE":
                shader.inputs["To Min"].default_value = roughness - 0.015
                shader.inputs["To Max"].default_value = roughness + 0.015
    return surfaces


def polygon(name, points, depth, surface, parent=None, location=(0, 0, 0), bevel=0.055):
    """A closed extruded profile with deliberate, smoothly machined bevels."""
    count = len(points)
    vertices = [(x, y, z) for z in (-depth / 2, depth / 2) for x, y in points]
    faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
    faces.extend((i, (i + 1) % count, (i + 1) % count + count, i + count) for i in range(count))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    assert all(edge.is_manifold for edge in bm.edges), f"Open profile: {name}"
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(surface)
    obj.parent = parent
    obj.location = location
    if bevel:
        modifier = obj.modifiers.new("Polished perimeter radius", "BEVEL")
        modifier.width, modifier.segments = bevel, 10
        modifier.harden_normals = True
        for face in mesh.polygons:
            face.use_smooth = True
        normals = obj.modifiers.new("Planar machined face normals", "WEIGHTED_NORMAL")
        normals.keep_sharp = True
        normals.weight = 50
    return obj


def rounded_outline(width, height, radius):
    points = []
    corners = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
    for quadrant, (sx, sy) in enumerate(corners):
        cx, cy = sx * (width / 2 - radius), sy * (height / 2 - radius)
        for j in range(20):
            angle = math.pi / 2 * (quadrant + j / 20)
            points.append(Vector((cx + radius * math.cos(angle), cy + radius * math.sin(angle))))
        angle = math.pi / 2 * (quadrant + 1)
        start = Vector((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
        nx, ny = corners[(quadrant + 1) % 4]
        end = Vector((nx * (width / 2 - radius) + radius * math.cos(angle), ny * (height / 2 - radius) + radius * math.sin(angle)))
        for j in range(16):
            points.append(start.lerp(end, j / 16))
    return points


def tile(name, width, height, depth, radius, surface, parent=None, location=(0, 0, 0), crown=0.018):
    """A closed rounded tile with the same Cartesian crown as Ferrigura."""
    bevel = min(0.065, depth * 0.34, radius * 0.65)
    vertices, rings, faces = [], [], []

    def ring(inset, z, scale=1):
        indices = []
        for point in rounded_outline(width - inset * 2, height - inset * 2, max(radius - inset, 0.001)):
            x, y = point.x * scale, point.y * scale
            indices.append(len(vertices))
            vertices.append((x, y, z + crown * (1 - (2 * x / width) ** 2 - (2 * y / height) ** 2)))
        rings.append(indices)

    for j in range(11):
        angle = math.pi / 2 * (1 - j / 10)
        ring(bevel * (1 - math.cos(angle)), -depth / 2 + bevel - bevel * math.sin(angle))
    for j in range(11):
        angle = math.pi / 2 * j / 10
        ring(bevel * (1 - math.cos(angle)), depth / 2 - bevel + bevel * math.sin(angle))
    for j in range(1, 20):
        ring(bevel, depth / 2, 1 - j / 21)
    count = len(rings[0])
    faces.append(tuple(reversed(rings[0])))
    for lower, upper in zip(rings, rings[1:]):
        faces.extend((lower[j], lower[(j + 1) % count], upper[(j + 1) % count], upper[j]) for j in range(count))
    faces.append(tuple(rings[-1]))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.000001)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    assert all(edge.is_manifold for edge in bm.edges), f"Open tile: {name}"
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(surface)
    obj.parent = parent
    obj.location = location
    for face in mesh.polygons:
        face.use_smooth = True
    return obj


def rectangle(name, width, height, depth, surface, parent=None, location=(0, 0, 0), bevel=0.055):
    return polygon(name, [(-width / 2, -height / 2), (width / 2, -height / 2), (width / 2, height / 2), (-width / 2, height / 2)], depth, surface, parent, location, bevel)


def corner(name, width, height, bar, surface, parent=None, location=(0, 0, -0.15), cradle=False):
    x, y = width / 2, height / 2
    points = [(-x, -y), (x, -y)]
    if cradle:
        points += [(x, -y + 0.60), (x - bar, -y + 0.60), (x - bar, -y + bar)]
    else:
        points += [(x, -y + bar)]
    points += [(-x + bar, -y + bar), (-x + bar, y), (-x, y)]
    return polygon(name, points, 0.25, surface, parent, location, 0.065)


def document(name, width, height, depth, surface, parent=None, location=(0, 0, 0), clip=0.40):
    x, y = width / 2, height / 2
    return polygon(name, [(-x, -y), (x, -y), (x, y - clip), (x - clip, y), (-x, y)], depth, surface, parent, location, 0.06)


def apply_modifiers(obj):
    bpy.context.view_layer.objects.active = obj
    for modifier in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=modifier.name)


def cut(obj, cutter):
    apply_modifiers(obj)
    def volume():
        body = bmesh.new()
        body.from_mesh(obj.data)
        value = abs(body.calc_volume(signed=True))
        body.free()
        return value
    original_volume = volume()
    bpy.context.view_layer.update()
    modifier = obj.modifiers.new("Machined through opening", "BOOLEAN")
    modifier.operation = "DIFFERENCE"
    modifier.solver = "EXACT"
    modifier.object = cutter
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    assert volume() < original_volume - 0.000001, f"Cutter missed its body: {obj.name}"
    obj["machinedOpenings"] = obj.get("machinedOpenings", 0) + 1
    bpy.data.objects.remove(cutter, do_unlink=True)


def slots(obj, widths, y_positions, parent, graphite, z=0.12):
    """Wide through-slots reveal a separate recessed graphite bed."""
    well = material("Ferra dark message recess", (0.013, 0.012, 0.010), 0.62, metallic=0.15)
    for i, (width, y) in enumerate(zip(widths, y_positions)):
        points = rounded_outline(width, 0.115, 0.055)
        cutter = polygon(f"Temporary message slot {i}", points, 0.9, graphite, parent, (obj.location.x, y, obj.location.z), bevel=0)
        cut(obj, cutter)
        tile(f"Recessed message well {i}", width + 0.07, 0.18, 0.08, 0.045, well, parent, (obj.location.x, y, z - 0.10), crown=0)


def ferramenta(steel, copper, graphite):
    carrier = group("F-shaped family register", angles=(5, -9, -4))
    profile = [(-0.91, -1.04), (-0.37, -1.04), (-0.37, -0.12), (0.81, -0.12), (0.81, 0.34), (-0.37, 0.34), (-0.37, 0.62), (0.76, 0.62), (0.76, 1.07), (-0.91, 1.07)]
    polygon("Open graphite F backing", [(x * 1.045, y * 1.045) for x, y in profile], 0.20, graphite, carrier, (-0.055, -0.035, -0.19), 0.055)
    polygon("Continuous polished steel F", profile, 0.29, steel, carrier, bevel=0.065)
    tile("Removable copper insert", 0.42, 0.45, 0.30, 0.085, copper, carrier, (0.97, 0.845, 0.012), crown=0.014)


def ferroni(steel, copper, graphite):
    carrier = group("Pattern-track register", angles=(6, -9, -4))
    rectangle("Graphite pattern spine", 0.29, 2.18, 0.25, graphite, carrier, (-1.01, 0, -0.15), 0.07)
    for i, y in enumerate((-0.73, 0, 0.73)):
        tile(f"Polished pattern rail {i + 1}", 2.04, 0.43, 0.24, 0.12, steel, carrier, (0.04, y, 0.02), crown=0.012)
    scanner = group("Raised scanning carriage", (0.20, 0, 0.36), (-5, 4, 23))
    scanner.parent = carrier
    points = [(-0.18, 1.15), (0.18, 1.15), (0.18, -0.70), (0.32, -0.70), (0, -1.15), (-0.32, -0.70), (-0.18, -0.70)]
    polygon("Copper scanner and match pointer", points, 0.20, copper, scanner, bevel=0.045)


def ferriki(steel, copper, graphite):
    carrier = group("Token and theme cassette", angles=(5, -9, -3))
    corner("Graphite token registration corner", 2.15, 1.85, 0.23, graphite, carrier, (-0.02, -0.04, -0.18))
    long_token = group("Long upper token plane", (-0.35, 0.47, 0.10), (3, -6, -2))
    long_token.parent = carrier
    tile("Long steel syntax token", 1.14, 0.59, 0.24, 0.10, steel, long_token)
    oxide_token = group("Copper upper token plane", (0.65, 0.47, 0.17), (-5, 6, 2))
    oxide_token.parent = carrier
    polygon("Copper syntax token", [(-0.33, -0.295), (0.36, -0.295), (0.36, 0.015), (0.08, 0.295), (-0.33, 0.295)], 0.24, copper, oxide_token, bevel=0.055)
    tile("Short lower steel token", 0.77, 0.58, 0.24, 0.10, steel, carrier, (-0.54, -0.30, 0.07))
    tile("Long lower steel token", 1.04, 0.58, 0.24, 0.10, steel, carrier, (0.46, -0.30, 0.13))


def ferromark(steel, copper, graphite):
    carrier = group("Document registration corner", angles=(4, -8, -3))
    corner("Open graphite registration bracket", 2.04, 2.14, 0.25, graphite, carrier, (0, -0.08, -0.20))
    source = group("Source document plane", (-0.27, 0.17, 0), (5, 5, 3))
    source.parent = carrier
    document("Copper source leaf", 1.43, 1.88, 0.21, copper, source)
    output = group("Rendered document plane", (0.23, -0.07, 0.30), (-5, -7, -3))
    output.parent = carrier
    document("Polished steel output leaf", 1.43, 1.88, 0.23, steel, output)


def ferrolex(steel, copper, graphite):
    carrier = group("Wordform proofing tile", angles=(5, -9, -3))
    corner("Graphite type registration corner", 2.10, 2.15, 0.26, graphite, carrier, (-0.06, -0.10, -0.23))
    letter_bed = material("Ferra dark letter recess", (0.013, 0.012, 0.010), 0.62, metallic=0.15)
    tile("Separate graphite letter bed", 1.70, 1.84, 0.10, 0.12, letter_bed, carrier, (0, 0.05, -0.12), crown=0)
    face = polygon("Polished steel type face", rounded_outline(1.70, 1.84, 0.12), 0.25, steel, carrier, (0, 0.05, 0.05), bevel=0.04)
    curve = bpy.data.curves.new("Lowercase a letterpress outline", "FONT")
    curve.body = "a"
    curve.resolution_u = 24
    curve.extrude = 0.5
    obj = bpy.data.objects.new("Through-cut lowercase a", curve)
    bpy.context.scene.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target="MESH")
    obj = bpy.context.object
    xs, ys, zs = ([getattr(v.co, axis) for v in obj.data.vertices] for axis in ("x", "y", "z"))
    width, height = max(xs) - min(xs), max(ys) - min(ys)
    scale = min(1.12 / width, 1.35 / height)
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    for vertex in obj.data.vertices:
        vertex.co.x = (vertex.co.x - cx) * scale
        vertex.co.y = (vertex.co.y - cy) * scale + 0.07
        vertex.co.z = (vertex.co.z - (min(zs) + max(zs)) / 2) / (max(zs) - min(zs))
    obj.parent = carrier
    obj.location.z = 0.05
    cut(face, obj)
    # The boolean must not interpolate the original perimeter's split normals
    # across new letter edges. Rebuild the mesh, keeping the cut face planar.
    mesh = bpy.data.meshes.new("Clean letterpress face")
    mesh.from_pydata([tuple(vertex.co) for vertex in face.data.vertices], [], [tuple(p.vertices) for p in face.data.polygons])
    mesh.update()
    mesh.materials.append(steel)
    face.data = mesh
    for part in mesh.polygons:
        part.use_smooth = abs(part.normal.z) < 0.999
    bevel = face.modifiers.new("Fine letterpress cut radius", "BEVEL")
    bevel.width, bevel.segments = 0.012, 4
    bevel.harden_normals = True
    tile("Copper dictionary alignment tab", 0.35, 0.91, 0.28, 0.065, copper, carrier, (0.94, -0.04, 0.12), crown=0.012)


def catalog_leaf(name, width, height, parent, steel, graphite):
    x, y = width / 2, height / 2
    profile = [(-x, -y), (x, -y), (x, y - 0.24), (x - 0.17, y - 0.24), (x - 0.29, y), (-x + 0.10, y), (-x, y - 0.10)]
    leaf = polygon(name, profile, 0.24, steel, parent, bevel=0.045)
    slots(leaf, [width * 0.67] * 3, [0.30, 0, -0.30], parent, graphite, z=0)
    return leaf


def ferrocat(steel, copper, graphite):
    carrier = group("Paired catalog collator", angles=(5, -9, -3))
    corner("Open graphite catalog cradle", 2.20, 1.96, 0.24, graphite, carrier, (0, -0.10, -0.21), cradle=True)
    left = group("Left indexed catalog", (-0.49, 0.16, 0.05), (3, -5, 3))
    left.parent = carrier
    catalog_leaf("Left polished catalog leaf", 0.91, 1.61, left, steel, graphite)
    right = group("Right indexed catalog", (0.49, 0.02, 0.15), (-4, 4, -3))
    right.parent = carrier
    catalog_leaf("Right polished catalog leaf", 0.91, 1.61, right, steel, graphite)
    bridge = tile("Copper message-identity bridge", 0.48, 0.30, 0.18, 0.055, copper, carrier, (0, 0.06, 0.35), crown=0.012)
    bridge.rotation_euler.z = math.radians(-4)


def ferralk(steel, copper, graphite):
    carrier = group("Glob-pattern file folder", angles=(-4, -13, -4))
    profile = [(-1.05, -0.98), (1.05, -0.98), (1.05, 0.66), (-0.15, 0.66), (-0.40, 0.98), (-0.89, 0.98), (-1.05, 0.75)]
    polygon("Graphite folder rear edge", [(x * 1.015, y * 1.015) for x, y in profile], 0.12, graphite, carrier, (0.015, 0.015, -0.17), 0.075)
    polygon("Polished steel file folder", profile, 0.27, steel, carrier, bevel=0.075)
    # Six broad rectangular arms make a glob wildcard, not a favorite star.
    points = []
    radius, half_width = 0.68, 0.13
    for i in range(6):
        angle = math.pi / 2 + i * math.pi / 3
        direction = Vector((math.cos(angle), math.sin(angle)))
        tangent = Vector((-direction.y, direction.x))
        notch_angle = angle - math.pi / 6
        points.append((2 * half_width * math.cos(notch_angle), 2 * half_width * math.sin(notch_angle)))
        points.append(tuple(direction * radius - tangent * half_width))
        points.append(tuple(direction * radius + tangent * half_width))
    polygon("Solid copper glob wildcard", points, 0.18, copper, carrier, (0, -0.15, 0.21), 0.035)


def ferrugo(steel, copper, graphite):
    carrier = group("Bounded document preview", angles=(5, -9, -3))
    corner("Graphite preview aperture", 2.10, 2.21, 0.26, graphite, carrier, (-0.06, -0.075, -0.22))
    page = document("Polished preview document", 1.67, 1.98, 0.26, steel, carrier, (0.07, 0.10, 0.02), clip=0.48)
    slots(page, [1.03, 0.77], [0.20, -0.16], carrier, graphite, z=-0.025)
    polygon("Copper preview corner stop", [(-0.36, -0.30), (0.36, -0.30), (0.36, 0.42)], 0.24, copper, carrier, (0.71, -0.79, 0.24), 0.055)


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
        manifold = all(edge.is_manifold for edge in bm.edges)
        assert manifold, f"Nonmanifold final body: {obj.name}"
        volume = abs(bm.calc_volume(signed=True))
        assert volume > 0.000001, f"Empty body: {obj.name}"
        checks.append({"body": obj.name, "closedManifold": manifold, "volume": round(volume, 6), "machinedOpenings": obj.get("machinedOpenings", 0)})
        bm.free()
        evaluated.to_mesh_clear()
    return checks


def render_member(name, construction, draft=False):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    result = scene(f"{name.capitalize()} mark", draft=draft)
    result.render.resolution_x = result.render.resolution_y = 768 if draft else 1600
    globals()[name](*materials())
    checks = verify_geometry()
    studio((0, 0, 0), (3.1, -4.1, 12), up=(0, 1, 0))
    light("Rolling face reflection", (-5.5, 2.5, 8), 160, 1, 6, (1, 0.97, 0.93), (0, 0, 0))
    target = ROOT / (f".impeccable/review/blender-family/{name}-draft.png" if draft else f"design/ferra/masters/{name}/mark.png")
    render(result, target)
    if draft:
        return
    brief = BRIEFS[name] + " Polished steel, warm oxide copper, graphite depth, directional softbox reflections, gently offset planes, transparent negative space, and no microscopic mechanical detail."
    provenance(target, name.capitalize(), "Transparent native Blender product mark master", brief, construction, checks)
    sidecar = target.with_suffix(".png.json")
    record = json.loads(sidecar.read_text())
    source = Path(__file__).resolve()
    record["constructionSources"][source.relative_to(ROOT).as_posix()] = hashlib.sha256(source.read_bytes()).hexdigest()
    record["createdAt"] = "2026-10-30"
    reference = f"design/ferra/concepts/{name}/pre-blender-mark.png"
    if name == "ferralk":
        reference = "design/ferra/concepts/ferralk/wildcard-folder.png"
    record["conceptReference"] = {"source": reference, "sourceSha256": hashlib.sha256((ROOT / reference).read_bytes()).hexdigest(), "promptSidecar": f"{reference}.json"}
    record["renderProfile"] = "Polished steel and oxide copper; graphite registrations; real bevels; directional softboxes and a narrow face-reflection strip; AgX Medium High Contrast; sRGB alpha."
    if name == "ferrolex":
        record["letteringSource"] = "Blender bundled Bfont, converted to a through-cut mesh; no additional font file is shipped."
    sidecar.write_text(json.dumps(record, indent=2) + "\n")
    save(construction, [result])


if __name__ == "__main__":
    selected = [name for name in MEMBERS if name in sys.argv] or MEMBERS
    for member in selected:
        render_member(member, Path(__file__).with_name(f"{member}.py"), draft="--draft" in sys.argv)
