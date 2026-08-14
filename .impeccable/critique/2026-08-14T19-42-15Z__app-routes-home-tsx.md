---
target: critique
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-14T19-42-15Z
slug: app-routes-home-tsx
---
Method: dual-agent (A: critique_design · B: critique_detector)

# Ferramenta homepage critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 3/4 | Menu, hover, focus, and theme states give feedback; external link destinations are not signaled before navigation. |
| 2 | Match Between System and Real World | 4/4 | The hardware-store metaphor and developer-tool language fit the product exceptionally well. |
| 3 | User Control and Freedom | 3/4 | Navigation is simple, but the mobile Tools flyout puts part of the choice surface off-canvas. |
| 4 | Consistency and Standards | 4/4 | Marks, plates, typography, rust rules, status stamps, and grouping form a coherent system. |
| 5 | Error Prevention | 3/4 | Maturity and registry labels reduce adoption mistakes; identical-looking tool links can lead to different destination types. |
| 6 | Recognition Rather Than Recall | 3/4 | Detailed rows expose useful context, while the pegboard and flyout ask visitors to compare seven unfamiliar Ferr* names at once. |
| 7 | Flexibility and Efficiency of Use | n/a | This Persuade surface has no repeated workflow requiring accelerators or customization. |
| 8 | Aesthetic and Minimalist Design | 3/4 | The visual system is disciplined, but long proof paragraphs and an approximately 8,129px mobile journey dilute the opening. |
| 9 | Error Recognition and Recovery | 3/4 | Browser navigation provides recovery, but external destinations have no authored failure or destination cue. |
| 10 | Help and Documentation | n/a | The overview routes visitors to project sites; contextual task help is outside this landing page's job. |
| **Total** |  | **26/32** | **Good — an unusually strong foundation with one major responsive defect and proof-architecture gaps.** |

## Design Specificity Verdict

**LLM assessment:** Highly authored and product-specific. The hardware-store metaphor is structural rather than decorative: the pegboard is the family index, marks hang from hooks, ledger rows combine proof and maturity, iron bands carry principles, and rust behaves like a construction material. This visual language could not be transferred unchanged to an unrelated SaaS product.

The missed opportunity is evidentiary specificity. The page looks more credible than its proof architecture reads: compatibility targets and measured facts are buried in prose or absent, while universal claims sometimes exceed what every registry entry currently supports.

**Deterministic scan:** The Impeccable source detector ran once on `app/routes/home.tsx`, exited 0, and returned `[]`: zero rules, messages, or file locations. This clean result is useful, but it does not cover rendered geometry.

**Browser evidence:** Independent desktop (1440×900) and mobile (390×844) inspections confirmed that the page itself has no horizontal overflow and that light/dark materials hold together. The design pass found the open mobile `.flyout` at 336px wide and `x = -50`, clipping its left edge. The evidence pass measured header targets at roughly 20×20px for GitHub, 67×37px for Tools, and 40×40px for the theme toggle. Mutable script injection was blocked by the browser's URL security policy, so no reliable user-visible overlay exists; standard viewport screenshots and DOM geometry were used instead.

## Overall Impression

This is a memorable, unusually coherent family site. It already succeeds at making seven young infrastructure projects feel like one intentional body of work without inventing popularity. The biggest opportunity is to make the evidence as precise, scannable, and trustworthy as the visual world—while fixing the mobile family switcher that should be the easiest route through the portfolio.

## What's Working

1. **Exceptional own-world coherence.** Iron, brushed steel, rust, hooks, octagonal plates, ledger rows, and condensed type turn the product name into composition. Material is constrained to meaningful surfaces instead of becoming decorative noise.
2. **Equal-ranked family architecture.** The 3/2/2 content-pipeline, language, and workbench groups explain relationships without inventing a flagship. Jobs, versions, registries, maturity, and proofs remain attached to each tool.
3. **Ethical credibility signals.** Alpha/early/stable labels are explicit, claims avoid fabricated social proof, the maker is named, focus and reduced-motion states exist, and dark mode preserves the concept.

## Cognitive Load

Moderate: 3 of 8 checklist items fail.

- **One thing at a time:** the hero offers two CTAs, seven pegboard links, and four persistent header actions.
- **Minimal choices:** both `.board-grid` and `.flyout` expose seven equal-ranked tools at once.
- **Progressive disclosure:** all seven long proof narratives remain expanded; mobile visitors repeatedly process job, proof, version, registry, and status before reaching the next option.

Chunking and grouping are strong: the 3/2/2 structure keeps no content group above three. The footer exposes ten links at once on desktop, but its four labeled groups keep each local decision manageable.

## Emotional Journey

- **Entry peak:** “Heavy industry for the web” and the physical pegboard create an immediate, memorable encounter.
- **Trust plateau:** the ledger adds maturity and registry signals, but repeated proof paragraphs become the longest mobile valley.
- **Second peak:** “Held to the originals” makes the methodology feel foundational rather than promotional.
- **Human peak:** “Why this store exists” adds authorship and generosity without fabricated social proof.
- **End weakness:** partners and consulting become the final memory; the page ends on company navigation instead of renewed confidence and a decisive tool-selection action.

## Priority Issues

### [P1] The mobile family navigation is partly unusable

- **Evidence:** At 390px, the open `.flyout` measured 336px wide at `x = -50`; its first column was clipped. The menu aligns `right: 0` to a narrow `<details>` control while retaining `min-width: 21rem`. GitHub, Tools, and theme controls are also below 44px on at least one axis.
- **Why it matters:** This persistent switcher is the family-wide escape hatch and comparison route. It fails precisely where a compact navigation surface matters most.
- **Fix:** At the mobile breakpoint, anchor the flyout to safe viewport/header insets, remove the fixed minimum, choose one or two columns from available width, and give every header action a minimum 44×44px hit area.
- **Suggested command:** `$impeccable adapt`

### [P1] Proof is prose-heavy while the strongest evidence is not scannable

- **Evidence:** `ToolRow` renders `tool.proof` as one paragraph but never renders the existing `compat` field. The known test counts, parity results, and throughput evidence are not expressed as a consistent, quickly comparable layer.
- **Why it matters:** The primary visitor is deciding credibility, compatibility, maintenance, and adoption. Broad claims such as “faster in the hot path” ask for trust when a predecessor label and measured fact could earn it.
- **Fix:** Give every row a compact evidence grammar: predecessor or standard, one current verifiable proof, maturity/version, and a clearly labeled destination. Link to the underlying benchmark or test artifact where one exists.
- **Suggested command:** `$impeccable clarify`

### [P2] Family-wide copy overgeneralizes current compatibility

- **Evidence:** The hero says each tool is held to its original, and “Known APIs” promises “the same options, the same output.” `ferrugo` has no `compat` field and is positioned around bounded PDF rendering; several other tools are alpha or early.
- **Why it matters:** A skeptical maintainer can read an aspirational family principle as a present-tense guarantee. One unsupported universal weakens every valid proof around it.
- **Fix:** Separate demonstrated present state from admission criterion: qualify parity claims where they apply and distinguish “proven today” from “the standard each project is working toward.”
- **Suggested command:** `$impeccable clarify`

### [P2] Identical tool links conceal different destinations

- **Evidence:** Board and row links use `tool.docs ?? tool.repo`, so visually identical entries may open a dedicated site or GitHub repository.
- **Why it matters:** Visitors cannot predict whether they will reach docs, a product page, source, or an adoption guide. This creates avoidable tab-hopping during evaluation.
- **Fix:** Label the destination—“Docs,” “Project site,” or “Source”—or provide a consistent primary destination plus a visible secondary source action.
- **Suggested command:** `$impeccable clarify`

### [P2] The ending dissipates conversion energy

- **Evidence:** The final content section promotes the wider workshop and consulting, followed by company-heavy footer navigation. There is no closing route back to selecting or evaluating a Ferramenta tool.
- **Why it matters:** The page's final memory becomes the parent organizations rather than compatibility proof or a next tool to try.
- **Fix:** Add a compact closing action before partners or the footer: return to the family, compare maturity, or view all source repositories. Keep partners as provenance, not the endpoint.
- **Suggested command:** `$impeccable shape`

## Persona Red Flags

**Jordan — confused first-timer:** The pegboard presents seven unfamiliar Ferr* names without their jobs. Same-looking entries lead to different destinations, and the clipped mobile switcher damages the easiest discovery route. Domain terms such as Oniguruma, GFM, ICU MessageFormat, SIMD, and NEON are reasonable for the audience but lack a compact compatibility legend.

**Riley — deliberate stress tester:** Riley will compare “same options, same output” against alpha/early statuses and `ferrugo`'s missing predecessor contract. Performance language lacks inline numbers or evidence links, while `docs ?? repo` makes destination behavior inconsistent across tools.

**Casey — distracted mobile user:** The Tools flyout extends 50px beyond the left viewport; header targets miss the 44px guideline; the pegboard is about 676px tall; and the full page is roughly 8,129px. The primary CTA is strong at about 211×56px, but returning to a decision after interruption depends on the broken switcher or substantial scrolling.

**Morgan — tooling maintainer evaluating adoption:** `compat` exists but is not rendered, so Morgan must parse prose to identify the predecessor contract. Maturity and version are visible, but benchmark source, test artifact, maintenance signal, and destination type require opening several projects. The gap is trust verification, not missing social proof.

## Minor Observations

- At the mobile breakpoint, the final pegboard item returns to the first column, leaving the bottom-right position empty and making the last row feel left-heavy.
- “From the same workshop” wraps to three lines on mobile and briefly competes with the project story before it.
- The stable stamp communicates maturity with text and color, which is good accessibility practice.
- The anchored “Browse the tools” jump places the section heading safely below the sticky header.
- Body measure and line height remain comfortable in both themes; the condensed display face is strongest at headline scale and should stay out of small metadata.

## Questions to Consider

- What single piece of evidence should make a skeptical maintainer trust each tool without opening another tab?
- Is the pegboard primarily a brand exhibit or a decision interface—and which job wins on a 390px screen?
- Should “same options, same output” describe a proven present state, or the admission criterion every tool is working toward?
- Should the final emotion be “I understand Sebastian Software” or “I know which tool to try next”?
