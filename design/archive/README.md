# Design archive

Decision residue: material that shaped the approved direction but no longer
describes the site. Kept because the reasoning behind ADR-0002 is easier to
re-read with the alternatives in hand, and not deleted so a later icon decision
does not start from zero.

Nothing here is built, imported, or shipped. The live design system is
[DESIGN.md](../../DESIGN.md); the approved comps are in
[design/comp/2026-10/](../comp/2026-10/README.md).

| Path               | What it is                                                    | Why it is here                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon-candidates/` | Streamline Duotone and Ultimate exports, one folder per motif | The shortlist the project marks of 2026-08 were chosen from. Those marks were replaced by generated icons in 2026-09 (ADR-0009) and remain only in `design/comp/entwurf-*.html`. |

The icon candidates are Streamline property and are **not** MIT — the terms in
[THIRD-PARTY-NOTICES.md](../../THIRD-PARTY-NOTICES.md) apply to them here
exactly as they did under `design/comp/`, archived or not.

## What deliberately stays out

`design/comp/fonts/` is not archived. The three comps load those WOFF2 files
through relative `url("fonts/…")` declarations, so the fonts are part of the
comps, not leftovers beside them — move them and those comps stop rendering in
their intended faces. Chakra Petch, Space Grotesk and Big Shoulders are only
used by the comps; the site itself ships Barlow Condensed from
`packages/family/fonts/` (ADR-0008).
