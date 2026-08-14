# ADR-0005: Extend "Schmiede" with functional chassis and fasteners

- Status: accepted
- Date: 2026-08-14
- Deciders: Sebastian Werner
- Supersedes: ADR-0003

## Context

ADR-0003 established the "Schmiede" direction and deliberately limited physical material to the
body texture, project plates, and pegboard hooks. The first family-page implementation proved the
system readable, but the pipeline remained too diagrammatic for a persuasive marketing surface.
The mechanical inspiration works best when the assembly has a believable carrier and fastening,
not when metal is reduced to small icons alone.

## Decision

Keep the "Schmiede" direction and all of ADR-0003's typography, palette, geometry, dark-mode, and
mechanical-coherence rules. Expand its material boundary in two functional places:

1. Slotted steel fasteners may anchor a surface that is already physically modeled, such as the
   pegboard or a machine chassis.
2. A single chamfered metal chassis may group the content-pipeline assembly into one machine.

The chassis reuses the existing warm-steel token ramp and brush language. It is not a generic card
primitive. Buttons, ledger rows, copy sections, and unrelated containers remain flat. Decorative
screws without something credible to fasten remain a defect.

## Decision drivers

- The family overview is a Persuade surface; the hardware metaphor must carry enough visual force
  to be memorable.
- One chassis explains the three-stage dependency better than three separate material cards.
- Functional fasteners strengthen mechanical coherence without spreading gloss across the page.

## Consequences

- The pegboard receives four fasteners aligned to its existing 28px hole geometry.
- The pipeline assembly becomes the page's second material focal point after the hero pegboard.
- New material carriers still require another decision record; this is a bounded expansion, not a
  general permission for skeuomorphic panels.

## References

- [DESIGN.md](../../DESIGN.md) — implementation tokens and component rules
- [ADR-0003](0003-design-direction-schmiede.md) — original direction and rejected alternatives
