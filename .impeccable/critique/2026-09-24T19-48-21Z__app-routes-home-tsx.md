---
target: ferramenta.dev home (app/routes/home.tsx), round 5
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx"
target_fingerprint: "sha256:a3d50e35b70ca36458d3c6521c5b3198c34493570f287307d334c0aa49f6cd35"
target_path: /Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx
timestamp: 2026-09-24T19-48-21Z
slug: app-routes-home-tsx
---

# Critique round 5 — ferramenta.dev home (app/routes/home.tsx)

Method: dual-agent (A: design review · B: detector + browser), isolated and parallel. 7 and 10 n/a (A's opinion: 2 each).

## Design Health Score

| #     | Heuristic              | Score       | Key issue                                                                                   |
| ----- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| 1     | Visibility of status   | 3           | live figures without "as of"; sample rendered with ferromark 2.1.1 vs live 2.1.2, unlabeled |
| 2     | Match real world       | 3           | oracle, differential suites, zlob, "committed as it came out" unexplained                   |
| 3     | User control           | 3           | CTA to #pipeline fixed; ~11k px mobile page                                                 |
| 4     | Consistency            | 3           | Palamedes intro "runs on Ferrocat" vs row of three; code panels 14px vs 13px                |
| 5     | Error prevention       | 3           | stable Palamedes on early Ferralk contradicts the stamp key                                 |
| 6     | Recognition            | 4           | key before first stamp, GitHub mark fixed, aria-labels with pauses                          |
| 7     | Flexibility            | n/a         | persuade page                                                                               |
| 8     | Aesthetic & minimalist | 3           | #run intro and note repeat; roster 3x; empty column beside index                            |
| 9     | Error recovery         | 3           | metrics → registries → snapshot fallback silent and correct                                 |
| 10    | Help & docs            | n/a         | docs on tool sites                                                                          |
| Total |                        | 25/32 (78%) | Good                                                                                        |

## Design Specificity

Authored; "#run" (real committed Ferromark+Ferriki output beside its input) is the most product-specific addition since round 1. Detector: CLI 0; browser 22/8/21. Real: pegboard holes drawn at 0 mod 28 — radial-gradient centers in its tile, so the 14px offset puts holes at 28; every hook hangs between four holes (inherited from the comp, landing.css:755). Intentional: side-tab (full rust top rules incl. the two #run panels), pull quote, brush stripes, overflow clip. False: text-occlusion (closed flyout), heading-rhythm, layout-transition (Ardo), all overlay contrast fails (measured: light h1 16.5, soft text over hole 4.97; dark board 5.0). Ferriki tokens min 6.02 light / 7.17 dark on iron; GitHub mark filled at all 13 uses; index columns aligned; close link 50px; hero→band gap 0; one request to metrics service, none to crates.io/npm; no overflow; no console errors.

## Priority Issues

- [P2] Hooks between holes: background offset 14px on a centered radial gradient. Fix: 0 0 offset; precise DESIGN rule; test tile offset vs hook. polish.
- [P2] Proof far from claim: PipelineRun after Why (home.tsx:234), intro points "from the top of the page". Fix: place after pipeline ledger; "The chain above". layout.
- [P2] Run muted and provenance incomplete: output 13px vs input 14px, truncated on mobile, rendered versions not shown, intro/note repeat, filename caption uppercased. polish/clarify.
- [P2] Palamedes contradiction: intro "runs on Ferrocat" vs three engines; stable on early without explanation. clarify.
- [P3] Run pattern + Ardo .shiki override only in site.css; belongs in kit. extract.

## Persona Red Flags

- Jordan: jargon; "Rendered HTML" over a rendered view; literal **world** in output code; API name on overview (ADR-0004 exemption?).
- Riley: 2.1.1 vs 2.1.2 unlabeled; stable on early; intro vs row.
- Casey: truncated panels; ~11k px; 11px board glyph.
- Sibling maintainer: run pattern not in kit; sample not re-rendered on release.

## Minor Observations

Sample h3 enters the page outline; output sheet stretches to input height; hero lede and close copy near-verbatim; empty column beside index.

## Questions to Consider

Run inside the pipeline section? Rendered/HTML-source toggle? Do three full ledgers still earn their place?
