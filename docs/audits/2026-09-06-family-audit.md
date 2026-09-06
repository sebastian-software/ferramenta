# Family audit, 2026-09-06

Cross-repository consistency audit of the ten Sebastian Software repositories
around the Ferramenta family: ferroni, ferriki, ferromark, ferrolex, ferrocat,
ferralk, palamedes, dalo, agent-bridge, and this repository. The coordination
epic is [ferramenta#6](https://github.com/sebastian-software/ferramenta/issues/6);
family-wide work is tracked in ferramenta#7–#19, and every repository carries
its own alignment epic (ferroni#94, ferralk#366, ferriki#93, ferromark#262,
ferrocat#303, ferrolex#255, palamedes#1150, dalo#716, agent-bridge#118).

This document is the evidence snapshot behind those issues. It records what
each repository looked like on the audit date; it is not maintained afterwards.
Read the issues for the current state.

## Identity / README

| Repo         | H1             | Tagline                                                          | Badges                          | Family block                 | Company footer       | Case in prose |
| ------------ | -------------- | ---------------------------------------------------------------- | ------------------------------- | ---------------------------- | -------------------- | ------------- |
| ferroni      | none (HTML)    | "Pure-Rust Oniguruma-compatible engine. Faster in the hot path…" | 7 (incl. 3 static claim badges) | yes (hand-copied)            | yes (logo)           | Ferroni       |
| ferralk      | # Ferralk      | "Ferralk finds files."                                           | 5                               | **no**                       | no                   | Ferralk       |
| ferriki      | # Ferriki      | "…Shiki-compatible highlighter with a leaner Rust core."         | **0**                           | yes                          | no                   | Ferriki       |
| ferromark    | # ferromark    | "Markdown to HTML with a secure default…"                        | 7 (1 static)                    | yes                          | yes                  | ferromark     |
| ferrocat     | # ferrocat     | none                                                             | 4                               | yes (+Palamedes line)        | no                   | Ferrocat      |
| ferrolex     | # ferrolex     | "Native spell-checking for Rust and Node.js."                    | **0**                           | **no**                       | no                   | ferrolex      |
| palamedes    | # Palamedes    | none                                                             | 9 + table                       | **no** (ferrocat only)       | yes ("Sponsored by") | mixed         |
| dalo         | # Dalo         | "One source of truth for the skills your AI agents run."         | 4                               | **no**                       | no                   | mixed         |
| agent-bridge | # agent-bridge | none                                                             | **0**                           | **no**                       | **none at all**      | agent-bridge  |
| ferramenta   | # Ferramenta   | family site line                                                 | 3                               | own tables (grouping ≠ site) | yes                  | Ferramenta    |

Family block: identical hand-copied 7-row table in ferroni/ferriki/ferromark/ferrocat; omits ferralk; job strings diverge from family.ts (ferrolex "Spell, dictionary, and brand validation" vs "Spell checking for text and code"). No generator exists.

## Hygiene files (✓ present · ✗ missing · ~ stale)

| Repo         | SECURITY               | CoC      | CONTRIB | SUPPORT | CODEOWNERS | Issue forms | PR tmpl | Agent file          | ADR loc                   | toolchain            | deny | rustfmt |
| ------------ | ---------------------- | -------- | ------- | ------- | ---------- | ----------- | ------- | ------------------- | ------------------------- | -------------------- | ---- | ------- |
| ferroni      | ✗                      | ✗        | ✓       | ✗       | ✗          | ✗           | ✗       | CLAUDE.md           | docs/app/routes/adr (MDX) | ✗                    | ✗    | ✗       |
| ferralk      | ~ (0.9.x)              | ✗        | ✓       | ✗       | ✗          | yml         | ✓       | CLAUDE.md           | docs/adr                  | ✗                    | ✗    | ✗       |
| ferriki      | ✗                      | ✗        | ✓       | ✗       | ✗          | ✗           | ✗       | CLAUDE.md           | adr/                      | ✗                    | ✗    | ✗       |
| ferromark    | ✓ (email)              | ✗        | ✓       | ✗       | ✓          | yml         | ✓       | ✗                   | docs/arch                 | ✗ (sub-harness only) | ✗    | ✗       |
| ferrocat     | ~ ("pre-1.0" at 3.4.2) | ✓ custom | ✓       | ✗       | ✗          | md          | ✓       | AGENTS.md           | docs site MDX             | ✗                    | ✓    | ✗       |
| ferrolex     | ✓                      | ✓ custom | ✓       | ✓       | ✗          | yml ×4      | ✓       | ✗                   | docs/adr                  | ✗                    | ✓    | ✓       |
| palamedes    | ✓ (security@)          | ✗        | ✓       | ✗       | ✗          | yml         | ✓       | AGENTS.md (1 line)  | adr/ (NNN)                | ✓                    | ✗    | ✗       |
| dalo         | ✓                      | ✗        | ✓       | ✗       | ✗          | yml         | ✓       | ✗                   | docs/adr (1) + rfcs       | ✓                    | ✓    | ✗       |
| agent-bridge | ✗                      | ✗        | ✗       | ✗       | ✗          | ✗           | ✗       | CONTEXT.md          | docs/adr                  | n/a                  | n/a  | biome   |
| ferramenta   | ✗                      | ✗        | ✗       | ✗       | ✗          | ✗           | ✗       | AGENTS.md+CLAUDE.md | docs/adr                  | n/a                  | n/a  | n/a     |

SECURITY channel: GH advisories (ferralk, ferrocat, ferrolex, dalo) · email info@ (ferromark) · security@ + PVR (palamedes).

## Cargo metadata

| Repo                                                                                                                                           | edition | MSRV                 | license           | authors | homepage                | documentation | docs.rs meta | [lints]                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------- | ----------------- | ------- | ----------------------- | ------------- | ------------ | ------------------------- |
| ferroni                                                                                                                                        | 2021    | 1.81                 | BSD-2-Clause      | ✓       | Pages                   | ✓             | ✗            | inline only               |
| ferralk                                                                                                                                        | 2024    | 1.96 (stable−2, ADR) | MIT               | ✗       | repo                    | ✗             | ✗            | workspace ✓               |
| ferriki                                                                                                                                        | 2021    | **none**             | MIT               | ✗       | ✗                       | ✗             | ✗            | ✗ (no workspace.package)  |
| ferromark                                                                                                                                      | 2024    | 1.88                 | MIT               | ✗       | repo                    | ✗             | ✓            | ✗                         |
| ferrocat                                                                                                                                       | 2024    | 1.93                 | MIT               | ✗       | repo (not ferrocat.dev) | ✓             | partial      | workspace ✓               |
| ferrolex                                                                                                                                       | 2021    | 1.88                 | MIT OR Apache-2.0 | ✗       | repo                    | ✗             | ✓            | workspace ✓               |
| palamedes                                                                                                                                      | 2021    | 1.95                 | MIT               | ✗       | ✗                       | ✗             | ✗            | defined but NOT inherited |
| dalo                                                                                                                                           | 2024    | 1.93                 | MIT               | ✗       | dalo.sh                 | ✗             | ✗            | ✓                         |
| LICENSE holder: GmbH (most) · "Sebastian Werner" (ferrolex) · "Sebastian Werner and ferrocat contributors" (ferrocat) · year 2025 (palamedes). |

## CI / release

| Repo                                                                                                                                                                                 | actions pinned         | clippy -D warnings          | MSRV job   | deny/audit                | coverage               | fuzz                 | semver/public-api | release-please type                   | crates.io auth       | GH release bins         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | --------------------------- | ---------- | ------------------------- | ---------------------- | -------------------- | ----------------- | ------------------------------------- | -------------------- | ----------------------- |
| ferroni                                                                                                                                                                              | float                  | only correctness+suspicious | ✓          | ✗                         | codecov 87%            | ✗                    | ✗                 | rust (via ferramenta reusable, rp v4) | token                | ✗                       |
| ferralk                                                                                                                                                                              | SHA                    | ✓                           | ✓ + policy | audit                     | codecov (non-blocking) | ✓ 7 + ASan/Miri/loom | ✓ both            | simple + 15 extra-files               | OIDC                 | ✗                       |
| ferriki                                                                                                                                                                              | ci float / publish SHA | ✓                           | ✗          | ✗                         | ✗                      | ✗                    | ✗                 | node                                  | n/a                  | ✗                       |
| ferromark                                                                                                                                                                            | SHA (enforced)         | ✓                           | ✓          | rustsec                   | measured, not reported | ✓ weekly             | ✗                 | rust + many extra-files               | OIDC                 | ✗                       |
| ferrocat                                                                                                                                                                             | float                  | ✓                           | ✓          | deny weekly               | codecov + gates        | ✓ weekly             | ✓ both            | rust, root only                       | OIDC                 | musl tar                |
| ferrolex                                                                                                                                                                             | SHA                    | ✓                           | ✓          | deny                      | ✗                      | ✓ 8                  | public_api tests  | rust + cargo-workspace                | token                | ✗                       |
| palamedes                                                                                                                                                                            | float                  | ✓                           | ✓          | audit weekly              | llvm-cov artifact      | ✗                    | ✗                 | simple + 44 extra-files               | none (not published) | ✗                       |
| dalo                                                                                                                                                                                 | float                  | ✓                           | ✓          | deny                      | gate 86.9              | ✗                    | ✗                 | rust (draft)                          | token                | 6 targets, cosign, brew |
| agent-bridge                                                                                                                                                                         | float                  | biome                       | n/a        | pnpm audit (non-blocking) | 75% lines              | n/a                  | n/a               | none (manual)                         | npm token            | ✗                       |
| Renovate extends: github>org preset (ferroni, ferriki, ferrocat, ferromark, palamedes, ferramenta) · local>org preset (ferrolex, dalo) · config:recommended (ferralk, agent-bridge). |

## npm / native

| Repo      | napi                                 | platform packages                                   | naming                                       |
| --------- | ------------------------------------ | --------------------------------------------------- | -------------------------------------------- |
| ferriki   | napi 2 (napi8), hand-written scripts | 5                                                   | @sebastian-software/ferriki-<platform>       |
| ferromark | napi 3.11, own scripts               | 8                                                   | ferromark-<platform> (unscoped)              |
| ferrolex  | napi-rs 3 via @napi-rs/cli           | 3 (unpublished)                                     | @ferrolex/node-<platform>                    |
| palamedes | napi 3.12, own scripts               | 6+6                                                 | @palamedes/cli-<p>, @palamedes/core-node-<p> |
| dalo      | n/a                                  | universal launcher `getdalo` downloading GH release | —                                            |

## Docs sites

| Repo                                        | site      | framework                             | URL                                    | family chrome                                                                         |
| ------------------------------------------- | --------- | ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| ferroni                                     | docs/     | Ardo ^4.2                             | sebastian-software.github.io/ferroni   | FamilyLinks footer (git-pinned ardo-config); getting-started is an Ardo template stub |
| ferromark                                   | homepage/ | Ardo ^4.2                             | sebastian-software.github.io/ferromark | FamilyLinks footer (git-pinned); benchmark numbers stale                              |
| ferrocat                                    | docs/     | Ardo ^3.6.1                           | ferrocat.dev                           | none ("ferramenta" absent); #235                                                      |
| palamedes                                   | site/     | Ardo 4.2 + Tailwind + private site-ui | palamedes.dev                          | none                                                                                  |
| dalo                                        | site/     | static HTML                           | dalo.sh                                | none; docs not on site                                                                |
| ferralk / ferriki / ferrolex / agent-bridge | none      | —                                     | —                                      | ferriki #18                                                                           |
| ferramenta                                  | app/      | Ardo ^4.1                             | ferramenta.dev                         | reference; header/footer not extracted; no PR CI; no CNAME file                       |

## Sibling dependencies

ferriki→ferroni 1.3.2 · palamedes→ferrocat/-po/-icu =3.4.2, ferromark =0.7.0 (0.8.0 released), ferralk 0.5.3 (crates.io 0.12.0, repo 1.0.0-rc.1) · nobody→ferrolex.

## Duplications

1. CLDR root collation: ferrocat-po/src/api/collation{,_table}.rs (1,273 L, private) copied to palamedes translation_candidates/fcl_collation{,_table}.rs (608 L).
2. Update check: dalo/src/update.rs (611 L, GitHub Releases API) vs palamedes-cli/src/update_check.rs (762 L, version-service).
3. Glob/walk: ferrolex-cli main.rs hand-rolled glob+read_dir; dalo inventory.rs custom scan; palamedes globset next to ferralk.
4. napi platform scaffolding: 4 implementations (see table).
5. Contract/hygiene scripts: Ruby (ferromark) / Node (ferrocat, palamedes, ferriki) / Python+sh (ferrolex).
6. Benchmark harnesses: ferrocat-bench, ferralk tools/bench, ferromark benchmarks/, palamedes e2e, ferroni codspeed.
7. ferralk tools/doc-tests (compiles md Rust fences) usable family-wide.
8. Publish helpers: ferrolex publish-crates.py, ferrocat publish_with_retry, ferralk retry loop, ferramenta reusable.
9. HTML escaping: ferromark escape.rs (SIMD) vs ferriki render.rs.
10. ferrocat diagnostic_codes duplicated po/icu (sync test).
11. palamedes mdx.rs (2,687 L) over ferromark mdx feature.
12. CLI scaffolding: hand-rolled args (ferrocat 799 L, ferrolex ~580 L) vs clap (dalo, palamedes); term/colors, did-you-mean, completions/manpage only in dalo.
    Not recommended: regex→ferroni swaps; merging Unicode tables.

## Stale facts (quick wins)

ferroni: 2,083 tests badge vs ~2,178; bench snapshot 2026-03; "59x" on site; vscode-oniguruma org; Phase-2 stub comment; getting-started stub.
ferralk: SECURITY 0.9.x; 32 vs 31 checks; zlob 1.6.3/1.6.5; British spellings; dead fuzz.yml.
ferriki: sidecars 0.2.1 vs 0.3.0; Shiki 4.3.1 vs 4.4.3; Node floor ×3; changelog order; 39-char SHA; package name collision.
ferromark: homepage 280 vs README 267 MiB/s; md4c flip; bug_report 0.7.0; Node 22.12 vs 22.13; homepage/SECURITY.md misnamed.
ferrocat: 11 github.io links vs ferrocat.dev; SECURITY pre-1.0; conformance counts; coverage thresholds docs vs CI; setup.sh zsh; home.tsx family array 6.
ferrolex: pyproject 0.1.0; boundaries vs LSP/ffi/python; compatibility.md orphan; duplicate changelog lines; British ×3.
palamedes: 25 vs 26 examples; docs 1.17.3; latest.md vs dated; LICENSE 2025; Node floor ×4; TS 6/7; .gitignore vs committed results.
dalo: docs/releases to 0.6.0; milestones date; coverage gate ×2; matrix comment; site placeholders; #694.
agent-bridge: CHANGELOG stale; no tags; Node 24 untested; spike weight.
ferramenta: family.ts versions (ferroni 1.3.0, ferralk 0.5.2); ADR-0001 "seven tools"; docs/templates links broken; npm "ferrocat" 0.2.0 shown as adapter (ownership unverified); registry field unused.
