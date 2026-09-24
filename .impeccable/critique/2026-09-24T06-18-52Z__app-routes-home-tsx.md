---
target: ferramenta.dev home (app/routes/home.tsx), round 2
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx"
target_fingerprint: "sha256:758f42aa7fc7edb23428a8388c1606e0581cb3c935f6714e33d512ccc8a61027"
target_path: /Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx
timestamp: 2026-09-24T06-18-52Z
slug: app-routes-home-tsx
---

# Critique round 2 — ferramenta.dev home (app/routes/home.tsx)

Method: dual-agent (A: design review · B: detector + browser), isolated and parallel. Scored like round 1 (7 and 10 n/a); assessment A's raw total with 10 scored was 22/36.

## Design Health Score

| #     | Heuristic              | Score       | Key issue                                                                                           |
| ----- | ---------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| 1     | Visibility of status   | 3           | versions, stamps and a dated tally; 15-day-old stats carry no staleness signal                      |
| 2     | Match real world       | 3           | metaphor carries; "What earns the stamp" titles general principles, not stamp criteria              |
| 3     | User control           | 3           | skip link, sticky header, anchors; no way up on an 11.9k px mobile page but the header              |
| 4     | Consistency            | 2           | repo cue only in the ledger; "01" in the assembly vs "1" in the ledger; ferromark job is a sentence |
| 5     | Error prevention       | 2           | 5/9 tools lead to GitHub from board, assembly and start list without a cue                          |
| 6     | Recognition            | 2           | stamps from the first row, legend only after all three ledgers                                      |
| 7     | Flexibility            | n/a         | persuade page                                                                                       |
| 8     | Aesthetic & minimalist | 2           | each tool shown 4–6 times; the differential-proof thesis about 6 times; 741px footer                |
| 9     | Error recovery         | 3           | graceful fallbacks, but fallback versions render silently                                           |
| 10    | Help & docs            | n/a         | docs live on the tool sites                                                                         |
| Total |                        | 20/32 (63%) | Acceptable                                                                                          |

Round-1 P1s verified resolved (forward close, pipeline terminals, row-link names, landmarks, tablet hero, phone board at 14,14). The drop reflects a stricter pass on 5 and 8 and new findings, two introduced by round-1 fixes (leadTool tie-break, dark plate contrast fixed only mid-plate).

## Design Specificity

Authored for the product: pegboard on the 28px grid, octagon plates, iron bands, successor-register proofs, signed note. Missed: the pegboard shows no maturity.
Detector: CLI 0 over home.tsx, root.tsx, packages/family/src. Browser 19 desktop light / 11 mobile / 21 desktop dark. False positives: text-occlusion (closed flyout). Intentional: side-tab, tight-leading, all-caps, stripes (plate brush), overflow clip. Real: dark low-contrast — Input/Output labels 3.67:1 at the plate's light end, assembly short jobs 3.3:1, Ardo skip link 2.6:1. Open: em-dash overuse (19), iron-band heading rhythm.

## Priority Issues

- [P1] "Most proven" picks the least proven Workbench tool: leadTool breaks the early-tie by registry order → ferrovia (v0.1.0, git only) over published ferralk/ferrugo. Fix: tie-break by publication, or state "nothing to adopt yet" for a group without stable/beta. clarify.
- [P1] Maturity invisible in the first viewport; legend after all ledgers. Fix: a small equal maturity mark on every board plate; compact legend before the first ledger. clarify.
- [P2] Link destination cue only in the ledger (board, assembly stages, start list lack it). Fix: shared toolHref + destination glyph in kit and site. harden.
- [P2] Dark plate contrast: Input/Output 3.67:1 vs --plate-face-hi, stage short jobs 3.3:1. Fix: lighter dark --rust-on-plate (≥4.5 against face-hi), new --ink-soft-on-plate. polish.
- [P2] Redundancy/length: 11.9k px mobile, tools 4–6×, thesis ~6×. Fix: lean footer on the family site (short jobs, no "More from Ferramenta" without current), single-line meta ≤64rem, merge overlapping beliefs/goals. distill.

## Persona Red Flags

- Jordan: no maturity on the board; "Browse the tools" scrolls past the board; start list recommends ferrovia.
- Riley: silent fallback versions (ferroni live 1.3.3 vs registry 1.4.2), 15-day-old stats, glaring --paper plates in dark, 84px phone cells not hardened for longer names.
- Casey: closing puts copy, tally and link before the start list (action below the fold); footer links 34px, closing link 28px (≥24, <44).
- Sibling maintainer: Ardo shell fixes only in site.css; ledger row and start list not in the kit; ClosingAction.actions contract ambiguous.

## Minor Observations

Footer h3s nest under "The wider workshop"; three-state theme toggle label ambiguous; partners section unlabelled; ferralk evidence "ahead of globset and fast-glob" unreferenced on the overview; "01/02/03" vs "1/2/3" doubled.

## Questions to Consider

1. Why is the strongest proof (the maturity stamp) missing from the most-viewed object?
2. Should the close recommend anything in a group with no stable tool?
3. Does the family site need the header flyout and full footer when the page is the registry?
4. Does the tool ledger belong in the kit — and why do siblings still write the Ardo overrides themselves?
