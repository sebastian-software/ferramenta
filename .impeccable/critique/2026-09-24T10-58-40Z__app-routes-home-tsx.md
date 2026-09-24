---
target: ferramenta.dev home (app/routes/home.tsx), round 3
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx"
target_fingerprint: "sha256:177a924ee5830486025e8b9d571c9a958788e0d3c6a0c409c8078086da058339"
target_path: /Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx
timestamp: 2026-09-24T10-58-40Z
slug: app-routes-home-tsx
---

# Critique round 3 — ferramenta.dev home (app/routes/home.tsx)

Method: dual-agent (A: design review · B: detector + browser), isolated and parallel. 7 and 10 n/a as in prior rounds (A's opinion: 2 each).

## Design Health Score

| #     | Heuristic              | Score       | Key issue                                                                                         |
| ----- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| 1     | Visibility of status   | 3           | stamps everywhere, figures live; git-only rows show hand-set versions indistinguishable from live |
| 2     | Match real world       | 3           | assembly Input "TextMate grammars" vs prose "Markdown with code goes in"                          |
| 3     | User control           | 3           | flyout Esc/outside-click; 11,441px mobile page, only the header leads back up                     |
| 4     | Consistency            | 3           | name casing in prose (ferroni vs Palamedes), ferromark job is a sentence                          |
| 5     | Error prevention       | 3           | repo cues everywhere; "git only" gives no way to try                                              |
| 6     | Recognition            | 3           | key after hero fixed; board GitHub glyph unlabeled visually                                       |
| 7     | Flexibility            | n/a         | persuade page                                                                                     |
| 8     | Aesthetic & minimalist | 3           | roster 4x (board, ledger, flyout, footer); lede 8 lines on mobile                                 |
| 9     | Error recovery         | 3           | live fetch falls back silently                                                                    |
| 10    | Help & docs            | n/a         | docs live on the tool sites; oracle/differential/zlob unexplained                                 |
| Total |                        | 24/32 (75%) | Good                                                                                              |

## Design Specificity

Authored: pegboard on the 28px grid, stamps riveted to plates, four-screw chassis, iron bands, honest maturity. Generic: the three H2+intro+ledger sections, Why, Partners. Missed: CodePanel unused — a real Markdown sample rendered by the chain would prove without a figure.
Detector: CLI 0 (home.tsx, root.tsx, packages/family/src). Browser 19 desktop light / 7 mobile / 19 desktop dark. Real: em-dash overuse (19), flyout wide shadow (borderline, chrome.css:271). Intentional: side-tab (rust rules), tight-leading/all-caps (pull quote), stripes, overflow clip. False positives: text-occlusion (closed flyout), heading-rhythm (two-column band), layout-transition (Ardo CSS not in DOM). Overlay-only low-contrast marks all measured passing (worst light 4.63:1 over a pegboard dot, dark 5.3:1). No overflow at 375, min font 12px, no tap target <24px, no console errors.

## Priority Issues

- [P2] Start here recommends plumbing: leadTool ties by registry order → ferroni over ferromark, ferrocat over palamedes. Fix: registry `entry` flag. clarify.
- [P2] PIPELINE.input "TextMate grammars" contradicts intro "Markdown with code goes in". Fix: Input Markdown with code, Output Highlighted HTML; grammars as ferroni side-feed. clarify.
- [P2] Mobile first viewport shows no board: 3-sentence lede = 8 lines at 375, board at y≈720/812. Fix: one-sentence lede. clarify/adapt.
- [P2] Length/repetition, weak end: 6,786 / 11,441px; close ~11 screens down on mobile; 699/1,242px footer re-lists roster; page ends on "Nothing to adopt yet". Fix: family footer without tool columns, collapse proof facts on mobile, trim Why, close in the wall's language. distill.
- [P2] Registry content inconsistency: prose casing, Evidence mixes features/dependencies, stable palamedes on early ferralk, ferromark job 3 lines. polish.

## Persona Red Flags

- Jordan: jargon (differentially, oracle, zlob); Input contradiction; "Browse the tools" skips board and key; theme toggle label ambiguous.
- Riley: hand-set versions look live; liveRequest.npm makes 3 requests never shown; social.png has 8 marks and contradicts ADR-0004 amendment (regression).
- Casey: no tool in first viewport; footer 1.5 screens; footer links 34px.
- Sibling maintainer: ToolRow, ProofFacts, ToolMeta, StartHere, Pegboard, ownership filter and live merge still in app/routes/home.tsx.

## Minor Observations

Dark --bg vs --iron nearly equal; --paper partner plates glare in dark; empty .num column indents non-pipeline rows; footer h3 nesting; root.tsx:55 "seven marks"; tally counts crates only; ferralk "ahead of globset" unreferenced.

## Questions to Consider

Ledgers as the wall's detail view? Start here as editorial registry decision? A real rendered sample in CodePanel?
