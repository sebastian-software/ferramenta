---
target: ferramenta.dev home (app/routes/home.tsx)
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx"
target_fingerprint: "sha256:d987e3b025715edc21ab7e8c2dceb8944c36b82f957200cc7ae0097adb9f4e6c"
target_path: /Users/sebastian/Workspace/ferramenta/.claude/worktrees/ferramenta-issue-55-3070d3/app/routes/home.tsx
timestamp: 2026-09-23T21-20-56Z
slug: app-routes-home-tsx
---

# Critique — ferramenta.dev home (app/routes/home.tsx)

Method: dual-agent (A: design review · B: detector + browser), isolated and parallel.

## Design Health Score (Persuade; 7 and 10 n/a)

| #     | Heuristic               | Score       | Key issue                                                                                                  |
| ----- | ----------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| 1     | Visibility of status    | 3           | Stamps and live versions good; the download tally carries no date                                          |
| 2     | Match real world        | 3           | Strong metaphor; "Contract", "Evidence", "Foundation → Application", early vs alpha are insider terms      |
| 3     | User control            | 3           | Skip link and anchors work; no section jump on an 11.8k px mobile page                                     |
| 4     | Consistency             | 2           | ferromark job is a sentence; shortJob lowercases acronyms; two primary CTAs, different labels, same target |
| 5     | Error prevention        | 3           | `q=ferr` source link drops palamedes; rows lead to a site or a repo without a cue                          |
| 6     | Recognition over recall | 2           | Four status levels without a legend                                                                        |
| 7     | Flexibility             | n/a         | single static persuasion page                                                                              |
| 8     | Aesthetic & minimalist  | 3           | disciplined world, but every tool linked 4–5 times                                                         |
| 9     | Error recovery          | 3           | only dead end is the source filter                                                                         |
| 10    | Help & docs             | n/a         | docs live on each tool's site                                                                              |
| Total |                         | 22/32 (69%) | Acceptable, just below Good                                                                                |

## Design Specificity

Authored for this product: poster headline, pegboard hero, "What earns the stamp", signed note. Generic in the middle: three stacked ledger sections read as a dense spec table; the metaphor stops after the hero.
Detector: CLI clean (0) over home.tsx and packages/family/src. Browser overlay 20 desktop / 9 mobile. False positives: 9 text-occlusion + thin-border-wide-shadow on the closed flyout. Intentional per DESIGN.md: side-tab (3px rust rules), tight-leading h1, all-caps pull quote, overflow-x clip. Real: low-contrast on the assembly terminal labels (3.5:1, 12px on the plate's dark end); heading-rhythm on the iron-band h3s (judgment call).

## Priority Issues

- [P1] Closing action loops back to #pipeline instead of forward to a tool (home.tsx closing). Fix: forward choice — one entry per subgroup (most mature member); move the signed note right before the close. Command: clarify.
- [P1] Pipeline figure contradicts its prose ("Markdown with code goes in…" vs "Foundation: Regex behavior → Application"); "Application" collides with role "application"; terminal labels 3.5:1. Fix: data-flow terminals (Input: Markdown + code → Output: highlighted HTML); labels in --rust-deep/--ink ≥4.5:1. Command: clarify + polish.
- [P1] Ledger rows are one giant link; the accessible name is ~350 chars run together; 5/9 rows go to GitHub without a cue. Fix: tool name is the link, stretched over the row via ::after; separated facts; repo cue icon. Command: harden.
- [P2] Status has no legend; registry facts hardcoded in copy ("ferroni, ferrocat and palamedes are stable today"); q=ferr drops palamedes. Fix: derive from registry, one-line stamp key, curated source link. Command: clarify.
- [P2] Hero at tablet/phone: 900px squeezes copy to 303px (4-line h1, CTAs wrap); 375px hero 1,710px tall, board splits groups 2+1. Fix: single column below ~60rem; compact phone board 3×84px (28-grid), ~56px plates. Command: adapt.

## Persona Red Flags

- Jordan: early vs alpha, "Contract" undefined; Foundation/Application opaque; two CTAs same target.
- Riley: ragged row heights from uneven job length and missing downloads; lowercase acronyms; undated tally.
- Casey: footer links 18px tall (13 targets <44px); header lockup 31px; no section jump.
- Sibling maintainer: PipelineAssembly current="ferrocat" renders silently with no stage; a registry ledger (ToolRow + stats) must be copied from home.tsx.

## Minor Observations

Header/footer render inside Ardo's <main> (no banner/contentinfo landmark); skip target div without tabindex; board aria-label on a role-less div; iron-band h3 spacing uneven; hardcoded "Sixteen … projects"; comment "not per-tool bragging" vs per-row downloads.

## Questions to Consider

1. If the pegboard lists all nine tools in the first viewport, is the ledger its detail view rather than three full sections?
2. Which tool should a skeptical Rust developer try first — and why does the page never say?
3. Could "What earns the stamp" become the interactive legend (filter by stable / beta / early)?
4. Does ferramenta.dev need a full registry footer when flyout, board and ledger list everything?
