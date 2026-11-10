"""Rebuild Ferromark's detailed homepage instrument in Blender."""

import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from hero_instruments import render_member

render_member("ferromark", __file__, draft="--draft" in sys.argv)
