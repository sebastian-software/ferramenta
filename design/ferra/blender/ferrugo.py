"""Build ferrugo's editable polished Ferra mark."""

import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))
from family_marks import render_member

render_member("ferrugo", __file__, draft="--draft" in sys.argv)
