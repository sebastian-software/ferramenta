"""Build Ferrigura's hierarchy with a rectangular parent, square child, and round child."""

import hashlib
import json
import math
import sys
from pathlib import Path

import bmesh
import bpy

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from studio import light, material, provenance, render, save, scene, studio

ROOT = Path(__file__).resolve().parents[3]
MASTER = ROOT / "design/ferra/masters/ferrigura/mark.png"
DRAFT = "--draft" in sys.argv
CONCEPT = "design/ferra/concepts/ferrigura/hierarchy.png"
REFERENCE = "design/ferra/concepts/ferrigura/hierarchy-reference.jpg"

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
steel = material("Ferra polished steel", (0.54, 0.52, 0.48), 0.16)
copper = material("Ferra polished oxide copper", (0.32, 0.11, 0.045), 0.20, oxide=True)
graphite = material("Ferra polished graphite rail", (0.075, 0.07, 0.06), 0.24, metallic=0.8)
for surface, roughness in [(steel, 0.16), (copper, 0.20), (graphite, 0.24)]:
    for shader in surface.node_tree.nodes:
        if shader.type == "BUMP":
            shader.inputs["Strength"].default_value = 0.035
            shader.inputs["Distance"].default_value = 0.001
        elif shader.type == "MAP_RANGE":
            shader.inputs["To Min"].default_value = roughness - 0.015
            shader.inputs["To Max"].default_value = roughness + 0.015
mark = scene("Ferrigura mark", draft=DRAFT)
mark.render.resolution_x = mark.render.resolution_y = 1024 if DRAFT else 1600
checks = []


def solid(name, vertices, faces, surface):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    assert all(edge.is_manifold for edge in bm.edges), f"Open diagram body: {name}"
    volume = bm.calc_volume(signed=True)
    assert volume > 0, f"Empty or inverted diagram body: {name}"
    checks.append({"body": name, "closedManifold": True, "positiveVolume": round(volume, 6)})
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    mark.collection.objects.link(obj)
    obj.data.materials.append(surface)
    for face in mesh.polygons:
        face.use_smooth = True
    return obj


def node(name, radius, location, surface):
    """A broad blank medallion with a smooth crown and a continuous rolling rim."""
    depth, bevel, crown = 0.29, 0.085, 0.035
    vertices, rings, faces = [], [], []
    count = 128

    def ring(r, z):
        indices = []
        for j in range(count):
            angle = 2 * math.pi * j / count
            indices.append(len(vertices))
            vertices.append((r * math.cos(angle), r * math.sin(angle), z))
        rings.append(indices)

    for j in range(13):
        angle = math.pi / 2 * (1 - j / 12)
        ring(radius - bevel * (1 - math.cos(angle)), -depth / 2 + bevel - bevel * math.sin(angle))
    for j in range(13):
        angle = math.pi / 2 * j / 12
        ring(radius - bevel * (1 - math.cos(angle)), depth / 2 - bevel + bevel * math.sin(angle))
    for j in range(1, 25):
        scale = 1 - j / 25
        ring((radius - bevel) * scale, depth / 2 + crown * (1 - scale ** 2))
    faces.append(tuple(reversed(rings[0])))
    for lower, upper in zip(rings, rings[1:]):
        faces.extend((lower[j], lower[(j + 1) % count], upper[(j + 1) % count], upper[j]) for j in range(count))
    faces.append(tuple(rings[-1]))
    obj = solid(name, vertices, faces, surface)
    obj.location = location
    return obj


def rectangular_node(name, width, height, location, surface, radius=0.16):
    """A broad rectangular node with the family's gently crowned face."""
    depth, bevel, crown = 0.29, 0.085, 0.025
    vertices, rings, faces = [], [], []

    def outline(inset):
        w, h, r = width - 2 * inset, height - 2 * inset, radius - inset
        corners = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
        points = []
        for quadrant, (sx, sy) in enumerate(corners):
            cx, cy = sx * (w / 2 - r), sy * (h / 2 - r)
            for j in range(16):
                angle = math.pi / 2 * (quadrant + j / 16)
                points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
            angle = math.pi / 2 * (quadrant + 1)
            nx, ny = corners[(quadrant + 1) % 4]
            start = (cx + r * math.cos(angle), cy + r * math.sin(angle))
            end = (nx * (w / 2 - r) + r * math.cos(angle), ny * (h / 2 - r) + r * math.sin(angle))
            for j in range(16):
                t = j / 16
                points.append((start[0] * (1 - t) + end[0] * t, start[1] * (1 - t) + end[1] * t))
        return points

    def ring(inset, z, scale=1):
        indices = []
        for px, py in outline(inset):
            x, y = px * scale, py * scale
            indices.append(len(vertices))
            vertices.append((x, y, z + crown * (1 - (2 * x / width) ** 2 - (2 * y / height) ** 2)))
        rings.append(indices)

    for j in range(13):
        angle = math.pi / 2 * (1 - j / 12)
        ring(bevel * (1 - math.cos(angle)), -depth / 2 + bevel - bevel * math.sin(angle))
    for j in range(13):
        angle = math.pi / 2 * j / 12
        ring(bevel * (1 - math.cos(angle)), depth / 2 - bevel + bevel * math.sin(angle))
    for j in range(1, 25):
        ring(bevel, depth / 2, 1 - j / 26)
    count = len(rings[0])
    faces.append(tuple(reversed(rings[0])))
    for lower, upper in zip(rings, rings[1:]):
        faces.extend((lower[j], lower[(j + 1) % count], upper[(j + 1) % count], upper[j]) for j in range(count))
    faces.append(tuple(rings[-1]))
    obj = solid(name, vertices, faces, surface)
    obj.location = location
    return obj


def hierarchy_rail():
    """One connected extruded profile, with no overlapping rail segments."""
    a, span, bus_y, parent_end, child_end = 0.09, 0.91, -0.10, 0.47, -0.53
    outline = [
        (-a, parent_end), (a, parent_end),
        (a, bus_y + a), (span + a, bus_y + a),
        (span + a, child_end), (span - a, child_end),
        (span - a, bus_y - a), (-span + a, bus_y - a),
        (-span + a, child_end), (-span - a, child_end),
        (-span - a, bus_y + a), (-a, bus_y + a),
    ]
    count = len(outline)
    vertices = [(x, y, z) for z in (-0.10, 0.08) for x, y in outline]
    faces = [tuple(reversed(range(count))), tuple(range(count, count * 2))]
    faces.extend((j, (j + 1) % count, (j + 1) % count + count, j + count) for j in range(count))
    obj = solid("Continuous graphite hierarchy bus", vertices, faces, graphite)
    bevel = obj.modifiers.new("Rounded machined rail edges", "BEVEL")
    bevel.width = 0.042
    bevel.segments = 10
    normals = obj.modifiers.new("Broad planar rail normals", "WEIGHTED_NORMAL")
    normals.keep_sharp = True
    return obj


rectangular_node("Large rectangular copper parent", 1.90, 1.27, (0, 1.0, 0.07), copper)
rectangular_node("Square steel child", 1.20, 1.20, (-0.91, -1.01, 0.07), steel, radius=0.13)
node("Circular steel child", 0.66, (0.91, -1.01, 0.07), steel)
hierarchy_rail()
checks.append({"topology": "one rectangular parent, one shared bus, one square child, one circular child", "nodeCount": 3, "railBodyCount": 1})

studio((0, 0, 0), (1.7, -3, 13), up=(0, 1, 0))
light("Rolling face reflection", (-5.5, 2.5, 8), 180, 1, 6, (1, 0.97, 0.93), (0, 0, 0))
path = ROOT / ".impeccable/review/ferrigura-hierarchy-draft.png" if DRAFT else MASTER
render(mark, path)
if not DRAFT:
    provenance(MASTER, "Ferrigura", "Transparent rendered product mark master", "A substantial one-to-two hierarchy diagram evolved from the supplied UML-style reference and retained Imagegen material concept: one large polished oxide-copper rectangular parent above two polished steel children, a square on the left and a circle on the right. Their different silhouettes identify the nodes without letters or small markings. One chunky graphite-metal orthogonal bus and two exposed drops physically enter the node bodies. Broad crowned faces, rolling bevels, real solid thickness, restrained three-quarter depth, directional softbox reflections, and transparent negative space. A roughly square envelope and three large nodes preserve visual weight at small icon sizes.", __file__, checks)
    sidecar = MASTER.with_suffix(".png.json")
    record = json.loads(sidecar.read_text())
    record["createdAt"] = "2026-10-30"
    record["conceptReference"] = {
        "source": CONCEPT,
        "sourceSha256": hashlib.sha256((ROOT / CONCEPT).read_bytes()).hexdigest(),
        "promptSidecar": f"{CONCEPT}.json",
    }
    record["designRefinements"] = [
        "Replace the concept's circular parent with a substantial rectangular copper node.",
        "Reduce the hierarchy to two larger steel children, one square and one circular, with no letters.",
    ]
    record["diagramReference"] = {
        "source": REFERENCE,
        "sourceSha256": hashlib.sha256((ROOT / REFERENCE).read_bytes()).hexdigest(),
    }
    record["renderProfile"] = "Polished steel, warm oxide copper, and graphite rails; gently crowned faces; rolling bevels; directional softboxes and a narrow face-reflection strip; AgX Medium High Contrast; sRGB alpha."
    sidecar.write_text(json.dumps(record, indent=2) + "\n")
    save(__file__, [mark])
