# ADR-0003: Design direction "Schmiede" with a bounded material layer

- Status: superseded by ADR-0005
- Date: 2026-08-14
- Deciders: Sebastian Werner

## Context

The family needed one visual language for eight sites. Three intensity drafts
of the same brief (light ground, rust accent, angular forms) were built and
compared: A "Blankstahl" (quiet, hairlines), B "Werkbank" (middle), C
"Schmiede" (loud: iron bands, poster type). Flat color plates behind the marks
were judged "too flat for this Maschinenpark"; pure decoration without
function (loose peg dots) was rejected.

## Decision

The family speaks direction **C "Schmiede"**: a light brushed-steel shop floor
between two dark iron bands; rust as structural color; uppercase condensed
display (Big Shoulders); zero border-radius, chamfers instead of rounding;
full dark mode. Skeuomorphism is deliberate but **bounded**: material lives in
exactly three places — the body's subtle brushed texture, the octagon metal
plates under the project marks, and the pegboard hooks. Physical metaphors must
be mechanically coherent (hooks sit exactly on the 28px hole grid; a decorative
dot with no function is a defect). Everything else stays flat so type and
content lead.

Exact tokens, materials, and module rules live in DESIGN.md; the approved comp
is preserved in `design/comp/entwurf-c.html`.

## Decision drivers

- Distinctiveness: C was chosen as "am ehesten eigen".
- The hardware-store metaphor carries product truth (family = tools on one
  wall) instead of decorating it.
- Material with function (hooks on holes) survived review; material as noise
  (flat tint plates, loose dots) did not.

## Considered options

### Chosen: C with bounded material

### Rejected: A / B intensity levels

Legible but generic; the workshop voice stays too quiet.

### Rejected: unbounded skeuomorphism

Gloss, squircles, and material on every surface would tip into costume; the
"early iOS, but matte and angular" line is the agreed ceiling.

## Consequences

- Every new surface must decide: flat (default) or one of the three material
  carriers — no fourth material without superseding this ADR.
- Board geometry changes only in 28px-module steps (padding ≡ 14 mod 28).
- Docs-heavy pages on project sites must prove that the loud display scale and
  dark bands do not hurt long-form reading.

## Validation and review triggers

Reopen when the first docs-heavy site ships (readability check), or if the
material layer starts spreading beyond its three carriers.

## References

- [DESIGN.md](../../DESIGN.md) — the system this direction produced
- [design/comp/entwurf-c.html](../../design/comp/entwurf-c.html) — approved comp (A/B kept as reference)
