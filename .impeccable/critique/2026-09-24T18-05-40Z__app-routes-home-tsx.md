---
target: ferramenta.dev home (app/routes/home.tsx), round 4
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx"
target_fingerprint: "sha256:dd6dce4414954796cc3a697250f7aaf679a4f0881e05cef2fb26f1525f63ac23"
target_path: /Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx
timestamp: 2026-09-24T18-05-40Z
slug: app-routes-home-tsx
---

# Critique round 4 — ferramenta.dev home (app/routes/home.tsx)

Method: dual-agent (A: design review · B: detector + browser), isolated and parallel. 7 and 10 n/a (A's opinion: 2 each).

## Design Health Score

| #     | Heuristic              | Score       | Key issue                                                                                       |
| ----- | ---------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| 1     | Visibility of status   | 3           | git-only rows show hand-set fallback versions like live ones                                    |
| 2     | Match real world       | 3           | Input/Output fixed; jargon (oracle, differential suites, zlob) unexplained; "I18N" reads "II8N" |
| 3     | User control           | 3           | 10,363px mobile page, only the header leads back up                                             |
| 4     | Consistency            | 3           | "RUNS ON ferrocat · Ferromark · Ferralk" casing; ferralk/ferrugo lack a lead fact               |
| 5     | Error prevention       | 3           | "git only" offers no way to try                                                                 |
| 6     | Recognition            | 3           | key placed well; board GitHub glyph unexplained visually                                        |
| 7     | Flexibility            | n/a         | persuade page                                                                                   |
| 8     | Aesthetic & minimalist | 3           | roster 3x in body (board, ledgers, index); ~250px empty column beside index                     |
| 9     | Error recovery         | 3           | silent fallback to snapshot, correct here                                                       |
| 10    | Help & docs            | n/a         | docs live on tool sites                                                                         |
| Total |                        | 24/32 (75%) | Good                                                                                            |

## Design Specificity

Authored (pegboard, stamps, chassis, iron bands, aisle-directory index). The job index restates the hero board sorted A-Z. Detector: CLI 0. Browser 19/6/19, none real: side-tab (full rust top rules), pull quote caps/leading, brush stripes, overflow clip intentional; text-occlusion (closed flyout), heading-rhythm (two-column band), layout-transition (Ardo CSS not in DOM) false; overlay-only contrast fails caused by the vignette's transparent stop read as black, measured worst cases pass (light lede 7.1, rust em 5.3; dark board soft text 5.5, footer 6.9). Leader not flagged. Em dashes 0 (was 19). No overflow, min font 12px, no targets <24px, board top 587/812 at 375, all hooks on grid, index columns aligned.

## Priority Issues

- [P2] Primary CTA "Find a tool by job" jumps 5,100px (8,500 mobile) past all proof to a reprise of the board. Fix: CTA to #pipeline and close on a real rendered sample (CodePanel), or index under the iron band. distill/layout.
- [P2] Regression: text-transform capitalize fails on first runsOn name (dt/dd without whitespace). Fix: displayName(tool) helper in JS; validate runsOn names. polish.
- [P2] ferralk and ferrugo lack buildsOn; type should require exactly one of succeeds/buildsOn/runsOn. clarify.
- [P2] Siblings cannot build the snapshot RegistryFacts needs; ship refresh script as package bin or source from oss-metrics. harden.
- [P3] JobIndex in ClosingAction's actions slot; alignment fix and tally mono styling live in site.css, not the kit. layout.

## Persona Red Flags

- Jordan: CTA lands far down; jargon; "git only" dead end; "II8N".
- Riley: casing bug; fallback versions look live; tally crates-only (palamedes, ferromark npm missing); two rows missing lead fact.
- Casey: CTA jumps ~8,000px; github link 28px; 10,363px page.
- Sibling maintainer: current vs tools selection models; snapshot gap; index in actions slot.

## Minor Observations

Hero ember glow hard-clipped at hero bottom plus 32px unlit strip; .fam-job-name weight 700 vs --disp-weight; leaders ~4 dots at 1440; index link accessible name runs together; hero GitHub goes to the whole org.

## Questions to Consider

What is the close for if the board is the directory? Do three group sections still earn their place if members are independent? Ledgers as the board's detail view?
