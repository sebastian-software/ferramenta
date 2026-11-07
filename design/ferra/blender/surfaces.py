"""Flat surfaces in the hero instruments' own materials, for page chrome.

Renders a brushed polished steel plate with the exact material of the hero
instruments (`hero_geometry.surfaces`) under a soft overhead studio, so a
navigation bar or an inlay can share the instrument's finish instead of a
coarser photographic texture.

    blender --background --python design/ferra/blender/surfaces.py -- OUT_DIR [--draft]

The masters live in design/ferra/masters/surfaces/; design/ferra/build-monografie.mjs
exports them to the package.
"""

import sys
from pathlib import Path

import bpy

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_geometry import surfaces
from studio import light, point_at, scene

args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
OUT = Path(args[0] if args else ".").resolve()
DRAFT = "--draft" in args


def plate(width, depth, steel):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    obj = bpy.context.object
    obj.scale = (width, depth, 1)
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(steel)
    return obj


def render_surface(name, width, depth, px_w, px_h, finish=0):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    result = scene(f"Comp surface {name}", draft=DRAFT)
    result.render.film_transparent = False
    result.render.resolution_x = px_w // (2 if DRAFT else 1)
    result.render.resolution_y = px_h // (2 if DRAFT else 1)
    result.cycles.samples = 24 if DRAFT else 256
    steel = surfaces()[finish]
    result.world.node_tree.nodes.get("Background").inputs["Strength"].default_value = 0.9
    plate(width * 1.4, depth * 1.4, steel)
    # Lights keep the panel's studio so a strip is a band of the same sheen.
    depth = 2.5
    # A long softbox over the far edge and a broad fill give the soft,
    # directional sheen of the hero renders without a hard specular spot.
    light("Long overhead strip", (0, depth * 0.9, 3.2), 2600, width * 1.6, depth * 0.45, (1, 0.97, 0.93), (0, 0, 0))
    light("Broad warm key", (-width * 0.3, -depth * 1.4, 4), 1500, width, depth, (1, 0.95, 0.89), (0, 0, 0))
    data = bpy.data.cameras.new("Top camera")
    camera = bpy.data.objects.new("Top camera", data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (0, -0.02, 5)
    point_at(camera, (0, 0, 0))
    data.type = "ORTHO"
    data.ortho_scale = width
    result.camera = camera
    path = OUT / f"{name}.png"
    result.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED {path}", flush=True)


OUT.mkdir(parents=True, exist_ok=True)
# Physical size in scene units sets the grain scale relative to the pixels.
render_surface("steel-fine-strip", 4.0, 0.17, 2880, 120)
# The instruments' weathered iron-oxide patina, for small rust accents
# (the primary action, the engine's own bar): a band of the same studio.
render_surface("rust-fine-strip", 2.0, 0.25, 1200, 150, finish=1)
