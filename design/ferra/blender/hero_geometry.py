"""Solid modeling helpers and materials for the large Ferra instruments."""

import math
import bmesh
import bpy
from mathutils import Vector
from studio import material

def surfaces():
    result = (
        material("Hero brushed polished steel", (0.54, 0.52, 0.48), 0.24),
        material("Hero dark matte iron-oxide patina", (0.10, 0.013, 0.002), 0.87, metallic=0.04),
        material("Hero graphite metal", (0.055, 0.050, 0.043), 0.34, metallic=0.75),
        material("Hero dark milled interiors", (0.025, 0.023, 0.020), 0.52, metallic=0.45),
    )
    for surface in result:
        for node in surface.node_tree.nodes:
            if node.type == "BUMP":
                node.inputs["Strength"].default_value = 0.055
                node.inputs["Distance"].default_value = 0.001
    oxide = result[1]
    nodes, links = oxide.node_tree.nodes, oxide.node_tree.links
    shader = nodes.get("Principled BSDF")
    shader.inputs["Anisotropic"].default_value = 0
    shader.inputs["Specular IOR Level"].default_value = 0.28
    coordinates = nodes.new("ShaderNodeTexCoord")

    def noise(name, scale, detail, roughness=0.75):
        node = nodes.new("ShaderNodeTexNoise")
        node.label = name
        node.inputs["Scale"].default_value = scale
        node.inputs["Detail"].default_value = detail
        node.inputs["Roughness"].default_value = roughness
        # Object coordinates avoid stretched grain on narrow bands.
        links.new(coordinates.outputs["Object"], node.inputs["Vector"])
        return node.outputs["Fac"]

    def ramp(name, signal, stops):
        node = nodes.new("ShaderNodeValToRGB")
        node.label = name
        ends = tuple(node.color_ramp.elements)
        for index, (position, color) in enumerate(stops):
            stop = ends[0] if index == 0 else ends[1] if index == len(stops) - 1 else node.color_ramp.elements.new(position)
            stop.position, stop.color = position, (*color, 1)
        links.new(signal, node.inputs["Fac"])
        return node.outputs["Color"]

    def math_node(operation, first, second):
        node = nodes.new("ShaderNodeMath")
        node.operation = operation
        for index, value in enumerate([first, second]):
            if isinstance(value, (float, int)):
                node.inputs[index].default_value = value
            else:
                links.new(value, node.inputs[index])
        return node.outputs[0]

    def mix(name, factor, first, second):
        node = nodes.new("ShaderNodeMixRGB")
        node.label = name
        links.new(factor, node.inputs[0])
        for index, value in enumerate([first, second], 1):
            if isinstance(value, tuple):
                node.inputs[index].default_value = (*value, 1)
            else:
                links.new(value, node.inputs[index])
        return node.outputs[0]

    patches = noise("Fractured corrosion islands", 5.5, 6, 0.82)
    crust = ramp("Raised crust with broken edges", patches, [
        (0.465, (0, 0, 0)),
        (0.515, (1, 1, 1)),
    ])
    pocks = noise("Uneven granular corrosion", 55, 3, 0.8)
    grain = noise("Dry fine oxide grain", 190, 2, 0.8)
    bare_color = ramp("Dull oxidized metal between islands", patches, [
        (0.25, (0.052, 0.027, 0.021)),
        (0.65, (0.15, 0.075, 0.050)),
    ])
    crust_color = ramp("Dark red-brown granular crust", pocks, [
        (0.25, (0.012, 0.0025, 0.001)),
        (0.45, (0.033, 0.006, 0.002)),
        (0.62, (0.095, 0.019, 0.005)),
        (0.80, (0.17, 0.040, 0.010)),
    ])
    colors = mix("Separate oxidized metal and rust crust", crust, bare_color, crust_color)
    # A narrow warm rim outlines the transition into raised corrosion.
    edge = math_node("MULTIPLY", math_node("MULTIPLY", crust, math_node("SUBTRACT", 1, crust)), 3.2)
    colors = mix("Burnt oxide lips around crust islands", edge, colors, (0.18, 0.036, 0.008))
    lift = nodes.new("ShaderNodeVectorMath")
    lift.operation = "SCALE"
    lift.label = "Slightly brighter oxide with the same corrosion structure"
    lift.inputs["Scale"].default_value = 1.45
    links.new(colors, lift.inputs[0])
    links.new(lift.outputs["Vector"], shader.inputs["Base Color"])
    links.new(math_node("ADD", 0.67, math_node("MULTIPLY", crust, 0.28)), shader.inputs["Roughness"])
    links.new(math_node("MULTIPLY", math_node("SUBTRACT", 1, crust), 0.38), shader.inputs["Metallic"])

    # Three normal layers give the crust a stepped edge, pits and dry granules.
    height = math_node("ADD", math_node("MULTIPLY", crust, 0.70), math_node("MULTIPLY", math_node("MULTIPLY", pocks, crust), 0.30))
    relief = nodes.new("ShaderNodeBump")
    relief.label = "Raised corrosion islands and broken edges"
    relief.inputs["Strength"].default_value = 0.95
    relief.inputs["Distance"].default_value = 0.060
    links.new(height, relief.inputs["Height"])
    pits = nodes.new("ShaderNodeBump")
    pits.label = "Pitted crust surface"
    pits.inputs["Strength"].default_value = 0.8
    pits.inputs["Distance"].default_value = 0.020
    links.new(pocks, pits.inputs["Height"])
    links.new(relief.outputs["Normal"], pits.inputs["Normal"])
    fine = nodes.new("ShaderNodeBump")
    fine.label = "Dry granular oxide finish"
    fine.inputs["Strength"].default_value = 0.6
    fine.inputs["Distance"].default_value = 0.008
    links.new(grain, fine.inputs["Height"])
    links.new(pits.outputs["Normal"], fine.inputs["Normal"])
    links.new(fine.outputs["Normal"], shader.inputs["Normal"])
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


def panel(name, width, height, location, surface, angles=(90, 0, 0), parent=None, clip=0, depth=0.10):
    carrier = group(name, location, angles, parent)
    x, y = width / 2, height / 2
    points = [(-x, -y), (x, -y), (x, y - clip), (x - clip, y), (-x, y)] if clip else [(-x, -y), (x, -y), (x, y), (-x, y)]
    body = profile(f"{name} leaf", points, depth, (0, 0, 0), surface, min(0.04, depth * 0.25), carrier)
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


def letter_pocket(obj, letter, center, height, dark, parent=None, floor_z=0.04, inlay=None):
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
    if inlay:
        insert = cutter.copy()
        insert.data = cutter.data.copy()
        insert.name = f"{letter} recessed oxide inlay"
        bpy.context.scene.collection.objects.link(insert)
        for vertex in insert.data.vertices:
            vertex.co.x = center[0] + (vertex.co.x - center[0]) * 0.985
            vertex.co.y = center[1] + (vertex.co.y - center[1]) * 0.985
            vertex.co.z = floor_z + 0.002 + (vertex.co.z - floor_z) / 0.6 * 0.017
        insert.data.materials.clear()
        insert.data.materials.append(inlay)
        for face in insert.data.polygons:
            face.use_smooth = False
    subtract(obj, cutter, f"Engraved letterform {letter}")


def rounded_plate(name, length, width, thickness, top, steel, location=(0, 0), corner=0.24, parent=None):
    """Round the plan outline independently from the narrow machined edge break."""
    half_x, half_y = length / 2, width / 2
    corner = min(corner, half_x * 0.95, half_y * 0.95)
    points = []
    for x, y, angle in [(half_x-corner, half_y-corner, 0), (-half_x+corner, half_y-corner, 90), (-half_x+corner, -half_y+corner, 180), (half_x-corner, -half_y+corner, 270)]:
        points.extend((x + corner * math.cos(math.radians(angle + k * 90 / 16)), y + corner * math.sin(math.radians(angle + k * 90 / 16))) for k in range(17))
    return profile(name, points, thickness, (*location, top-thickness/2), steel, 0.012, parent)


def flush_screw(plate, name, x, y, top, steel, dark, radius=0.16, parent=None):
    """A true counterbore with a washer and socket head below the mounting plane."""
    bore = radius * 1.25
    subtract(plate, cylinder(f"{name} counterbore cutter", bore, 0.19, (x, y, top-0.055), None, parent, bevel=0), "Recessed mounting counterbore")
    cylinder(f"{name} counterbore floor", bore*0.98, 0.008, (x, y, top-0.145), dark, parent, bevel=0)
    ring(f"{name} recessed sleeve washer", radius*1.22, radius*1.04, 0.13, (x, y, top-0.08), steel, parent)
    head = cylinder(f"{name} flush socket head", radius, 0.105, (x, y, top-0.0665), steel, parent, bevel=0.006)
    cutter = cylinder(f"{name} hex drive cutter", radius*0.48, 0.10, (x, y, top-0.02), None, parent, vertices=6, bevel=0)
    subtract(head, cutter, "Recessed hex drive")
    cylinder(f"{name} dark hex floor", radius*0.46, 0.006, (x, y, top-0.068), dark, parent, vertices=6, bevel=0)


def bench(name, length, width, steel, graphite, dark, z=0.18):
    top_z = z + 0.145
    top = rounded_plate(f"{name} machined mounting plate", length+0.06, width+0.06, 0.46, top_z, steel)
    for x in [-length/2+0.22, length/2-0.22]:
        for y in [-width/2+0.22, width/2-0.22]:
            flush_screw(top, f"{name} flush bed anchor", x, y, top_z, steel, dark)
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

