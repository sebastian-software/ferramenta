"""Detailed, editable reconstructions of the nine original Ferra hero instruments.

Run the named entry in heroes/, or select members after -- in this batch entry.
The compact marks and Ferrolink's existing continuity bench are independent.
"""

import hashlib
import json
import sys
from pathlib import Path

import bpy

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from studio import light, provenance, render, scene, studio
from hero_geometry import surfaces, verify_geometry
from hero_forms import BUILDERS

ROOT = Path(__file__).resolve().parents[3]
MEMBERS = ("ferramenta", "ferroni", "ferriki", "ferromark", "ferrolex", "ferrocat", "ferralk", "ferrugo", "ferrigura")
BRIEFS = {
    "ferramenta": "A seven-position precision register holds independent removable inserts: a deep book cassette, thick token comb, engraved document block, oxide-inlaid letterpress block, hinged catalog books, deep branch gate, and preview housing. Every upright insert has an oxide accent and a distinct three-dimensional section. Keyed sockets, flush hex fasteners, small locating pins, replaceable feet, and a copper registration slide make the fixture mechanically explicit. The inserts are independent tools, not a processing chain.",
    "ferroni": "A pattern comparator holds three deep, independent book-like pattern cassettes beside a genuine linear guide on a low machined mounting plate with rounded plan corners and flush fasteners. A large bored carriage and thick angled yoke carry a broad oxide contact tool over a recessed text ribbon. Fine graduations, short match inlays, cassette edge engravings, collars, washers, and socket screws explain storage, scanning, and the selected match position.",
    "ferriki": "A token-and-theme register on a low machined mounting plate with rounded plan corners and flush fasteners carries repeated engraved token groups through a large transverse registration tool with a thick slotted roof and broad end pedestals. The broad output groups use oxide-brown, sage-green, and blue enamel inlays beneath a massive registration head. A keyed theme cassette, knurled adjustment wheel, guide rods, comb teeth, engraved calibration marks, and retained feed spool form one detailed mechanical assembly.",
    "ferromark": "A document-registration bridge aligns three thin metal leaves: an engraved source sheet, a structured output sheet with a small ruled table, and a copper metadata index. Real engraved line work, a slotted bridge, two registration clamps, small thumbscrews, alignment pins, and a low open support frame preserve the original typesetting metaphor.",
    "ferrolex": "A wordform proofing gauge holds four replaceable engraved type blocks beneath a stepped dictionary-profile bridge. A copper sliding stop, a spare upright affix insert, keyed block seats, hex fasteners, a knurled adjuster, and engraved scales describe wordform and affix comparison. Large uppercase Blender letterforms are recessed into substantial steel blocks and filled with textured rust-brown oxide inlays.",
    "ferrocat": "A catalog collator holds two banks of separately spaced, indexed metal leaves around one copper resolved leaf. Engraved message rows, varied index tabs, a central keyed alignment channel, registration comb, screw adjuster, and open bank cradles express matching catalog entries and preserving an authoritative correction.",
    "ferralk": "A branching file-path gate has three open machined rails, three tabbed file leaves, a copper pivoting selector aligned with the middle branch, and a graphite stop that closes the lower branch early. The pivot, knurled screw, bearing collars, graduated rails, and separate endpoint feet make selection and pruning physically legible.",
    "ferrugo": "A bounded-preview instrument pairs a visibly turned, deep ivory-faced source-document assembly with a smaller matching ivory layout inside a thick machined aperture housing. Each stands on a low mounting plate with rounded plan corners, crisp edge breaks and recessed screws; the entire left assembly, including its columns and base, is rotated relative to the right assembly. Two open alignment rails, a copper dimension stop, a screw-driven preview carriage, calibration ticks, retained corner screws, and supporting shoes make the source-to-preview relationship explicit.",
    "ferrigura": "A compact roller-and-slat conveyor diagram sorts document billets through a central diamond-shaped transfer deck and a substantial pivoting switch blade. One straight incoming belt branches into two deliberately aligned output belts: a square process billet and a round storage billet make the diagram roles visibly different. Thick chamfered beds, straight side rails, retained end rollers, oxide drive caps, etched document marks and separate support shoes form one coherent mechanical sorter. The illustration represents branching and layout within Ferrigura, not a pipeline between family members.",
}



def render_member(name, construction=None, draft=False):
    construction = Path(construction or Path(__file__).with_name("heroes") / f"{name}.py").resolve()
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    result = scene(f"{name.capitalize()} hero instrument", draft=draft)
    result.render.resolution_x = 1200 if draft else 2400
    result.render.resolution_y = 600 if draft else 1200
    result.cycles.samples = 32 if draft else 192
    BUILDERS[name](*surfaces())
    checks = verify_geometry()
    if name == "ferrigura":
        studio((0, 0, 1.35), (4.5, -12, 7.8))
    else:
        studio((0, 0, 0.75), (4.8, -10, 8.3))
    light("Long front reflection", (-1, -6, 6), 220, 6, 1.4, (1, 0.97, 0.93), (0, 0, 0.7))
    light("Low upright-face reflection card", (-3, -5, -1.5), 140, 6, 3, (1, 0.97, 0.93), (0, 0, 1))
    path = ROOT / (f".impeccable/review/blender-heroes/{name}-draft.png" if draft else f"design/ferra/masters/{name}/instrument.png")
    render(result, path)
    print(f"RENDERED {name}: {len(checks)} closed solid parts", flush=True)
    if draft:
        return
    provenance(path, name.capitalize(), "Transparent native Blender homepage instrument master", BRIEFS[name] + " Detailed machined construction, actual recessed marks, separate fasteners, brushed polished steel, dark red-brown granular corrosion islands with broken oxide rims, pitted normal relief and dull oxidized metal between crusts, graphite interiors, directional softbox reflections, and genuine transparent negative space.", construction, checks)
    sidecar = path.with_suffix(".png.json")
    record = json.loads(sidecar.read_text())
    source = Path(__file__).resolve()
    record["createdAt"] = "2026-10-30"
    record["revision"] = "Second Blender pass refined: low machined plates with rounded plan corners, narrow edge breaks and recessed fasteners, large tool heads, a turned source assembly, a conveyor sorter, and slightly brighter granular rust."
    record["constructionSources"][source.relative_to(ROOT).as_posix()] = hashlib.sha256(source.read_bytes()).hexdigest()
    for helper_name in ["hero_geometry.py", "hero_forms.py"]:
        helper = source.with_name(helper_name)
        record["constructionSources"][helper.relative_to(ROOT).as_posix()] = hashlib.sha256(helper.read_bytes()).hexdigest()
    shared_shape = source.with_name("family_marks.py")
    record["constructionSources"][shared_shape.relative_to(ROOT).as_posix()] = hashlib.sha256(shared_shape.read_bytes()).hexdigest()
    reference = f"design/ferra/concepts/{name}/pre-blender-instrument.png"
    record["conceptReference"] = {"source": reference, "sourceSha256": hashlib.sha256((ROOT / reference).read_bytes()).hexdigest(), "promptSidecar": f"{reference}.json"}
    first = f"design/ferra/concepts/{name}/first-blender-instrument.png"
    record["previousRevision"] = {"source": first, "sourceSha256": hashlib.sha256((ROOT / first).read_bytes()).hexdigest()}
    record["renderProfile"] = "Low brushed polished steel mounting plates with separately rounded plan corners, narrow edge breaks and true counterbores, slightly brighter red-brown granular corrosion islands over dull oxidized metal with burnt oxide rims, three normal layers for broken crust edges, pits and dry grain, varying roughness and metallic response; directional area softboxes and a long front strip; orthographic three-quarter view; Cycles 192 samples; AgX Medium High Contrast; sRGB alpha."
    record["materialReference"] = "Procedural corrosion follows the supplied weathered-rust photograph as visual inspiration. No photographic texture is used."
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
