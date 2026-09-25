---
target: ferramenta.dev home (app/routes/home.tsx), round 6
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx"
target_fingerprint: "sha256:57e12384409a0ed73e499b93726696b05b6119edacca0e61f0af531778ee9550"
target_path: /Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx
timestamp: 2026-09-24T20-43-32Z
slug: app-routes-home-tsx
---

# Critique round 6 — ferramenta.dev home (app/routes/home.tsx, main with #61)

Method: dual-agent (A: design review · B: detector + browser), isolated and parallel. 7 and 10 n/a (A's opinion: 2 each).

## Design Health Score

| #     | Heuristic              | Score       | Key issue                                                       |
| ----- | ---------------------- | ----------- | --------------------------------------------------------------- |
| 1     | Visibility of status   | 3           | no sign the figures are live or when fetched                    |
| 2     | Match real world       | 3           | oracle, differential suites, zlob, C ABI, ISO 32000 unexplained |
| 3     | User control           | 3           | 10,851px mobile; #pipeline 2,775px                              |
| 4     | Consistency            | 3           | short-job casing contradicts family.ts:60; uneven fact rows     |
| 5     | Error prevention       | 4           | repo cues, install from Git, stamps before ledgers              |
| 6     | Recognition            | 4           | key before first stamp, aria pauses, consistent GitHub glyph    |
| 7     | Flexibility            | n/a         | persuade page                                                   |
| 8     | Aesthetic & minimalist | 3           | chain 3x in one section; roster 3x; independence line 5x        |
| 9     | Error recovery         | 3           | silent correct fallback                                         |
| 10    | Help & docs            | n/a         | docs on tool sites                                              |
| Total |                        | 26/32 (81%) | Good                                                            |

## Design Specificity

Authored; 8-member board reads intentional (grid continues through ferrovia's empty cell). Detector: CLI 0; browser 19/8/19, none real (side-tab = full rust top rules; pull quote; brush stripes; overflow clip; text-occlusion closed flyout; heading-rhythm; Ardo layout-transition; overlay dark-glow self; gradient contrast artifacts — measured h1 16.5/14.8, soft text over hole 4.63/5.04). All 8 hooks on holes (4x pixel check, 0.13px). #pipeline order correct, inert, no side scroll, tokens ≥6.02/7.17. No ferrovia/nine in page. One request to metrics service. Real small: output code 12.6px vs input 14px (kit `code` 0.9em inside .fam-run-doc).

## Priority Issues

- [P2] #pipeline shows the chain 3x (assembly 01-03, run, ledger 01-03), 2,775px mobile. Fix: drop ledger `steps`; collapse input CodePanel into details below 54rem. distill/layout.
- [P2] Run caption omits Ferroni. Fix: record resolved ferroni version from ferriki lockfile in the artifact. clarify.
- [P3] Output code 12.6px vs 14px. Fix: .fam-run-doc pre code { font-size: 1em }. polish.
- [P3] Short-job casing vs documented sentence case. polish.
- [P3] Independence stated 5x; fact rows wrap unevenly (flex) — grid one fact per line. distill/polish.

## Persona Red Flags

- Jordan: jargon; literal **world** reads like a render bug.
- Riley: Ferroni missing in caption; BETA in key with no member; inert blocks selection and find-in-page.
- Casey: 10,851px; ledger numbers vanish while assembly keeps them.
- Sibling maintainer: Pegboard current= on ferralk/ferrugo sites leaves one plate + two empty cells; render script app-only; outputCaption free-form.

## Minor Observations

Empty column beside index; uneven assembly end labels; "evidence" twice in one goal; COUNT_WORDS stops at Six.

## Questions to Consider

Assembly and ledger as one element? Empty workbench cell: bare or an empty hook? A small real run for Language/Workbench?
