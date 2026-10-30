"""Shared Ferra studio: satin metals, controlled reflections, and icon framing."""

import hashlib
import json
import math
from pathlib import Path

import bpy
from mathutils import Matrix, Quaternion, Vector

ROOT = Path(__file__).resolve().parents[3]


def material(name, color, roughness=0.27, oxide=False, metallic=1):
    result = bpy.data.materials.new(name)
    result.diffuse_color = (*color, 1)
    nodes, links = result.node_tree.nodes, result.node_tree.links
    metal = nodes.get("Principled BSDF")
    metal.inputs["Base Color"].default_value = (*color, 1)
    metal.inputs["Metallic"].default_value = metallic
    metal.inputs["Roughness"].default_value = roughness
    metal.inputs["Anisotropic"].default_value = 0.3
    # Explicit brushing direction avoids the default UV pole on broad faces.
    tangent = nodes.new("ShaderNodeVectorTransform")
    tangent.vector_type = "VECTOR"
    tangent.convert_from = "OBJECT"
    tangent.convert_to = "WORLD"
    tangent.inputs["Vector"].default_value = (1, 0, 0)
    links.new(tangent.outputs["Vector"], metal.inputs["Tangent"])
    if oxide:
        # Blender 5 supports thin dielectric films over metallic conductors.
        # A very thin layer preserves the warm copper instead of rainbow colors.
        metal.inputs["Thin Film Thickness"].default_value = 8
        metal.inputs["Thin Film IOR"].default_value = 1.45
    coordinate = nodes.new("ShaderNodeTexCoord")
    stretch = nodes.new("ShaderNodeVectorMath")
    stretch.operation = "MULTIPLY"
    stretch.inputs[1].default_value = (3, 120, 3)
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 30
    noise.inputs["Detail"].default_value = 3
    rough = nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = roughness - 0.035
    rough.inputs["To Max"].default_value = roughness + 0.035
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.002
    links.new(coordinate.outputs["Generated"], stretch.inputs[0])
    links.new(stretch.outputs["Vector"], noise.inputs["Vector"])
    links.new(noise.outputs["Fac"], rough.inputs["Value"])
    links.new(rough.outputs["Result"], metal.inputs["Roughness"])
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], metal.inputs["Normal"])
    return result


def metals():
    return (
        material("Ferra brushed satin steel", (0.54, 0.52, 0.48), 0.32),
        material("Ferra restrained oxide copper", (0.32, 0.11, 0.045), 0.38, oxide=True),
        material("Ferra graphite recess", (0.075, 0.07, 0.06), 0.5, metallic=0.35),
    )


def scene(name, draft=False):
    result = bpy.data.scenes.new(name)
    bpy.context.window.scene = result
    result.render.engine = "CYCLES"
    result.cycles.samples = 32 if draft else 160
    result.cycles.use_denoising = True
    result.cycles.use_adaptive_sampling = True
    result.cycles.adaptive_threshold = 0.01
    result.cycles.glossy_bounces = 8
    result.cycles.seed = 37
    result.render.film_transparent = True
    result.render.image_settings.file_format = "PNG"
    result.render.image_settings.color_mode = "RGBA"
    result.render.image_settings.color_depth = "8"
    result.render.resolution_percentage = 100
    result.display_settings.display_device = "sRGB"
    result.view_settings.view_transform = "AgX"
    result.view_settings.look = "AgX - Medium High Contrast"
    result.world = bpy.data.worlds.new(f"{name} studio")
    background = result.world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value = (0.6, 0.58, 0.54, 1)
    background.inputs["Strength"].default_value = 0.16
    return result


def point_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def light(name, location, power, size, height, color, target):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "RECTANGLE"
    data.size = size
    data.size_y = height
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = location
    point_at(obj, target)


def studio(target, position, roll=0, up=(0, 0, 1)):
    light("Broad warm key", (-3, -4, 8), 1250, 5, 3, (1, 0.95, 0.89), target)
    light("Quiet front fill", (4, -2, 5), 400, 4, 4, (1, 0.98, 0.95), target)
    light("Narrow bevel reflection", (0, 4, 6), 1350, 4.5, 1.2, (1, 0.96, 0.91), target)
    data = bpy.data.cameras.new("Orthographic product camera")
    camera = bpy.data.objects.new("Orthographic product camera", data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = position
    backward = (camera.location - Vector(target)).normalized()
    right = Vector(up).cross(backward).normalized()
    vertical = backward.cross(right)
    rotation = Matrix((right, vertical, backward)).transposed().to_quaternion()
    camera.rotation_euler = (rotation @ Quaternion((0, 0, 1), math.radians(roll))).to_euler()
    data.type = "ORTHO"
    bpy.context.scene.camera = camera
    bpy.context.view_layer.update()
    # Use actual projected vertices; world-aligned boxes overpad tilted parts.
    inverse = camera.matrix_world.inverted()
    points = [inverse @ obj.matrix_world @ vertex.co for obj in bpy.context.scene.objects if obj.type == "MESH" for vertex in obj.data.vertices]
    left, right = min(p.x for p in points), max(p.x for p in points)
    bottom, top = min(p.y for p in points), max(p.y for p in points)
    aspect = bpy.context.scene.render.resolution_x / bpy.context.scene.render.resolution_y
    data.ortho_scale = max(right - left, (top - bottom) * aspect) / 0.875
    # Center the visible silhouette rather than the construction origin.
    offset = camera.rotation_euler.to_quaternion() @ Vector(((left + right) / 2, (bottom + top) / 2, 0))
    camera.location += offset
    return camera


def block(name, location, size, surface, bevel=0.055):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if surface:
        obj.data.materials.append(surface)
    if bevel:
        modifier = obj.modifiers.new("Machined corner radius", "BEVEL")
        modifier.width = bevel
        modifier.segments = 12
        # Keep broad machined faces planar; subdivide only their small bevels.
        modifier.harden_normals = False
    return obj


def render(result, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    result.render.filepath = str(path)
    bpy.ops.render.render(write_still=True, scene=result.name)


def provenance(path, product, role, brief, construction, checks=None):
    sources = [Path(construction).resolve(), Path(__file__).resolve()]
    record = {
        "createdAt": "2026-10-29",
        "generatedWith": f"Blender {bpy.app.version_string}, Cycles",
        "product": product,
        "role": role,
        "meaning": brief,
        "prompt": brief,
        "source": sources[0].relative_to(ROOT).as_posix(),
        "sourceSha256": hashlib.sha256(sources[0].read_bytes()).hexdigest(),
        "constructionSources": {source.relative_to(ROOT).as_posix(): hashlib.sha256(source.read_bytes()).hexdigest() for source in sources},
        "scene": sources[0].with_suffix(".blend").relative_to(ROOT).as_posix(),
        "transparentBackgroundRequested": True,
        "renderProfile": "Satin metals; directional softboxes; restrained metallic thin film; AgX Medium High Contrast; sRGB alpha.",
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "geometry": f"{bpy.context.scene.render.resolution_x}x{bpy.context.scene.render.resolution_y}",
    }
    if checks is not None:
        record["geometryVerification"] = checks
    path.with_suffix(".png.json").write_text(json.dumps(record, indent=2) + "\n")


def save(construction, scenes):
    bpy.context.window.scene = scenes[0]
    for unused in [item for item in bpy.data.scenes if item not in scenes]:
        bpy.data.scenes.remove(unused)
    for item in scenes:
        item.render.filepath = f"//../masters/{Path(construction).stem}/{'mark' if 'mark' in item.name.lower() else 'instrument'}.png"
    for area in bpy.context.screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.region_3d.view_perspective = "CAMERA"
            area.spaces.active.shading.color_type = "MATERIAL"
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(Path(construction).with_suffix(".blend")), compress=True)
