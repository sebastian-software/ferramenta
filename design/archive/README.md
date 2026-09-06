# Design archive

Decision residue: material that shaped the approved direction but no longer
describes the site. Kept because the reasoning behind ADR-0002 and ADR-0003 is
easier to re-read with the alternatives in hand, and not deleted so a later
icon or type decision does not start from zero.

Nothing here is built, imported, or shipped. The live design system is
[DESIGN.md](../../DESIGN.md); the approved comp is
[design/comp/entwurf-c.html](../comp/entwurf-c.html).

| Path               | What it is                                                    | Why it is here                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fonts/`           | Chakra Petch and Space Grotesk WOFF2 files                    | Display-face candidates from the direction drafts. The approved direction uses Big Shoulders, self-hosted at `app/assets/fonts/big-shoulders.woff2` (ADR-0003). |
| `icon-candidates/` | Streamline Duotone and Ultimate exports, one folder per motif | The shortlist the project marks were chosen from. The chosen marks live in `app/components/mark-defs.ts`.                                                       |

The icon candidates are Streamline property and are **not** MIT — the terms in
[THIRD-PARTY-NOTICES.md](../../THIRD-PARTY-NOTICES.md) apply to them here
exactly as they did under `design/comp/`, archived or not.
