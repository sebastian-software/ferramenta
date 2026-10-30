"""Build and render Ferrolink's editable, physically linked metal parts.

Run with Blender, from any directory:
  Blender --background --python design/ferra/blender/ferrolink.py
Add `-- --draft` or `-- --hero-draft` for quick previews in .impeccable/review/.
"""

import json
import math
import sys
from pathlib import Path

import bmesh
import bpy
import numpy as np
from mathutils import Quaternion, Vector
from mathutils.bvhtree import BVHTree

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from studio import block, metals, provenance, render, save, scene, studio

ROOT = Path(__file__).resolve().parents[3]
MASTER = ROOT / "design/ferra/masters/ferrolink"
HERO_DRAFT = "--hero-draft" in sys.argv
DRAFT = "--draft" in sys.argv or HERO_DRAFT
BAR_RADIAL = 0.23
BAR_NORMAL = 0.17
LINK_PITCH = 1.9


def stadium():
    """A closed capsule centerline in XY, with analytic outward normals."""
    points = []
    for center, start in [(0.6, -math.pi / 2), (-0.6, math.pi / 2)]:
        for i in range(96):
            angle = start + math.pi * i / 96
            radial = Vector((math.cos(angle), math.sin(angle), 0))
            points.append((Vector((center, 0, 0)) + 0.7 * radial, radial))
        # Continue around the capsule along its straight rail.
        for i in range(48):
            t = i / 48
            if center > 0:
                points.append((Vector((0.6 - 1.2 * t, 0.7, 0)), Vector((0, 1, 0))))
            else:
                points.append((Vector((-0.6 + 1.2 * t, -0.7, 0)), Vector((0, -1, 0))))
    return points


def compact_outline():
    """Nearly square links have useful visual mass inside a small icon cell."""
    radius = 0.38
    centers = [(0.44, 0.44), (-0.44, 0.44), (-0.44, -0.44), (0.44, -0.44)]
    points = []
    for quadrant, (x, y) in enumerate(centers):
        for j in range(24):
            angle = math.pi / 2 * (quadrant + j / 24)
            radial = Vector((math.cos(angle), math.sin(angle), 0))
            points.append((Vector((x, y, 0)) + radius * radial, radial))
        angle = math.pi / 2 * (quadrant + 1)
        radial = Vector((math.cos(angle), math.sin(angle), 0))
        start = Vector((x, y, 0)) + radius * radial
        nx, ny = centers[(quadrant + 1) % 4]
        end = Vector((nx, ny, 0)) + radius * radial
        for j in range(24):
            points.append((start.lerp(end, j / 24), radial))
    return points


def link(name, center, perpendicular, surface, compact=False):
    """Sweep a rounded rectangular bar; no boolean or shared vertices."""
    rotation = Quaternion((1, 0, 0), math.pi / 2 if perpendicular else 0)
    origin = Vector(center)
    vertices, faces, centerline = [], [], []
    profile = []
    radius = 0.065
    for quadrant, (sx, sy) in enumerate([(1, 1), (-1, 1), (-1, -1), (1, -1)]):
        for j in range(13):
            angle = math.pi / 2 * (quadrant + j / 12)
            profile.append((sx * (BAR_RADIAL - radius) + radius * math.cos(angle), sy * (BAR_NORMAL - radius) + radius * math.sin(angle)))
    profile_steps = len(profile)
    for point, radial in (compact_outline() if compact else stadium()):
        centerline.append(tuple(rotation @ point + origin))
        for outward, depth in profile:
            position = point + radial * outward + Vector((0, 0, depth))
            vertices.append(tuple(rotation @ position + origin))
    count = len(centerline)
    for i in range(count):
        for j in range(profile_steps):
            faces.append((
                i * profile_steps + j,
                ((i + 1) % count) * profile_steps + j,
                ((i + 1) % count) * profile_steps + (j + 1) % profile_steps,
                i * profile_steps + (j + 1) % profile_steps,
            ))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    assert all(edge.is_manifold for edge in bm.edges), f"Open link: {name}"
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(surface)
    for face in mesh.polygons:
        face.use_smooth = True
    return obj, np.array(centerline)


def linking_number(a, b):
    """Midpoint quadrature of the Gauss integral for two closed curves."""
    da, db = np.roll(a, -1, axis=0) - a, np.roll(b, -1, axis=0) - b
    ma, mb = a + da / 2, b + db / 2
    difference = ma[:, None, :] - mb[None, :, :]
    numerator = np.sum(difference * np.cross(da[:, None, :], db[None, :, :]), axis=2)
    return float(np.sum(numerator / np.linalg.norm(difference, axis=2) ** 3) / (4 * math.pi))


def verify_pair(a, b, expected_linked):
    obj_a, curve_a = a
    obj_b, curve_b = b
    minimum = float(np.min(np.linalg.norm(curve_a[:, None, :] - curve_b[None, :, :], axis=2)))
    # Each rounded rectangular bar is contained in this bounding circle.
    # The mesh lies in bounding tubes around the polygonal centerlines.
    # Subtract half of each maximum edge to bound distances between samples.
    slack = sum(float(np.max(np.linalg.norm(np.roll(curve, -1, axis=0) - curve, axis=1))) / 2 for curve in [curve_a, curve_b])
    centerline_bound = minimum - slack
    clearance = centerline_bound - 2 * math.hypot(BAR_RADIAL, BAR_NORMAL)
    assert clearance > 0.05, f"Insufficient clearance: {obj_a.name}, {obj_b.name}"
    trees = [BVHTree.FromPolygons([v.co for v in obj.data.vertices], [list(p.vertices) for p in obj.data.polygons]) for obj in [obj_a, obj_b]]
    assert not trees[0].overlap(trees[1]), "Intersecting link surfaces"
    winding = linking_number(curve_a, curve_b)
    assert abs(abs(winding) - int(expected_linked)) < 0.002, f"Incorrect topology: {winding}"
    return {
        "bodies": [obj_a.name, obj_b.name],
        "linkingNumber": round(winding, 6),
        "sampledMinimumCenterlineDistance": round(minimum, 6),
        "minimumCenterlineDistanceBound": round(centerline_bound, 6),
        "conservativeSurfaceClearance": round(clearance, 6),
        "intersectingTriangles": 0,
    }


def evaluated_tree(obj):
    evaluated = obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh = evaluated.to_mesh()
    tree = BVHTree.FromPolygons([obj.matrix_world @ v.co for v in mesh.vertices], [list(p.vertices) for p in mesh.polygons])
    evaluated.to_mesh_clear()
    return tree


def verify_aperture(part, tab, x):
    obj, curve = part
    bpy.context.view_layer.update()
    assert not evaluated_tree(obj).overlap(evaluated_tree(tab)), "A chain link intersects its document tab"
    boundary = []
    corners = [(-0.6, -0.6), (0.6, -0.6), (0.6, 0.6), (-0.6, 0.6)]
    for i, a in enumerate(corners):
        b = corners[(i + 1) % len(corners)]
        for j in range(64):
            t = j / 64
            boundary.append((x + a[0] * (1 - t) + b[0] * t, 0, 1.25 + a[1] * (1 - t) + b[1] * t))
    winding = linking_number(curve, np.array(boundary))
    assert abs(abs(winding) - 1) < 0.002, "Link does not thread the document aperture"
    return {"bodies": [obj.name, tab.name], "linkingNumber": round(winding, 6), "intersectingTriangles": 0}


def document(name, x, steel, graphite):
    tab = block(name, (x, 0, 1.42), (1.65, 0.22, 2.25), steel, bevel=0)
    cutter = block("Aperture cutter", (x, 0, 1.25), (0.92, 0.8, 0.82), None, bevel=0)
    boolean = tab.modifiers.new("Through aperture", "BOOLEAN")
    boolean.object = cutter
    boolean.operation = "DIFFERENCE"
    bpy.context.view_layer.objects.active = tab
    bpy.ops.object.modifier_apply(modifier=boolean.name)
    bpy.data.objects.remove(cutter, do_unlink=True)
    modifier = tab.modifiers.new("Machined aperture and edges", "BEVEL")
    modifier.width = 0.055
    modifier.segments = 5
    tab.modifiers.new("Weighted face normals", "WEIGHTED_NORMAL")
    # A folded document corner, constructed as a separate triangular inset.
    vertices = [(x + 0.7, -0.125, 2.42), (x + 0.24, -0.125, 2.42), (x + 0.7, -0.125, 1.96)]
    mesh = bpy.data.meshes.new(f"{name} folded corner")
    mesh.from_pydata(vertices, [], [(0, 1, 2)])
    fold = bpy.data.objects.new(f"{name} folded corner", mesh)
    bpy.context.scene.collection.objects.link(fold)
    fold.data.materials.append(graphite)
    return tab


# Remove the startup cube and create two independently editable scenes.
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
steel, copper, graphite = metals()

mark = scene("Ferrolink mark", draft=DRAFT)
mark.render.resolution_x = mark.render.resolution_y = 1024 if DRAFT else 1600
first = link("Closed steel link", (-0.45, 0, 0), False, steel, compact=True)
second = link("Closed copper link", (0.45, 0, 0), True, copper, compact=True)
mark_checks = [verify_pair(first, second, True)]
studio((0, 0, 0), (6, -7, 9), roll=12)
if DRAFT and not HERO_DRAFT:
    render(mark, ROOT / ".impeccable/review/ferrolink-blender-draft.png")
elif not DRAFT:
    render(mark, MASTER / "mark.png")
    provenance(MASTER / "mark.png", "Ferrolink", "Transparent rendered product mark master", "Two compact rounded-square satin-steel and oxide-copper links, threaded through one another in perpendicular planes. Separate watertight bodies, broad rounded rectangular bars, visible clearance, balanced icon mass, directional softbox reflections, and transparent apertures.", __file__, mark_checks)

if not DRAFT or HERO_DRAFT:
    instrument = scene("Ferrolink continuity bench", draft=DRAFT)
    instrument.render.resolution_x = 1100 if DRAFT else 2200
    instrument.render.resolution_y = 550 if DRAFT else 1100
    chain = [
        link("Left closed steel link", (-LINK_PITCH, 0, 1.25), False, steel),
        link("Center closed copper link", (0, 0, 1.25), True, copper),
        link("Right closed steel link", (LINK_PITCH, 0, 1.25), False, steel),
    ]
    hero_checks = [verify_pair(chain[0], chain[1], True), verify_pair(chain[1], chain[2], True), verify_pair(chain[0], chain[2], False)]
    for side, x, part in [("Source", -3.2, chain[0]), ("Destination", 3.2, chain[2])]:
        tab = document(f"{side} document tab", x, steel, graphite)
        hero_checks.append(verify_aperture(part, tab, x))
        block(f"{side} rail shoe", (x, 0, 0.2), (1.9, 1.65, 0.36), graphite)
        block(f"{side} shoe cap", (x, 0, 0.36), (1.75, 1.5, 0.12), steel)
    for y in [-0.6, 0.6]:
        block("Open parallel rail", (0, y, 0.14), (7.4, 0.13, 0.18), steel, 0.025)
    # The gauge is fastened only to the central link, above its upper rail.
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=0.13, depth=0.27, location=(0, 0, 2.22))
    bpy.context.object.name = "Separate gauge pin"
    bpy.context.object.data.materials.append(steel)
    block("Continuity gauge", (0, 0, 2.38), (0.85, 0.7, 0.12), copper, 0.035)
    studio((0, 0, 1.22), (5, -11, 7))
    if DRAFT:
        render(instrument, ROOT / ".impeccable/review/ferrolink-bench-draft.png")
    else:
        render(instrument, MASTER / "instrument.png")
        provenance(MASTER / "instrument.png", "Ferrolink", "Transparent rendered hero instrument master", "Two document tabs on open precision rails, joined by three closed links in alternating perpendicular planes. Each outer link threads a document aperture, the separate continuity gauge fastens to the central copper link, and every neighboring chain body has verified clearance.", __file__, hero_checks)
        save(__file__, [mark, instrument])

print(json.dumps({"mark": mark_checks}, indent=2))
