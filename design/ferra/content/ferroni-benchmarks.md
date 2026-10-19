# Regex benchmarks

Check the output before measuring the time.

Measured October 15, 2026 · revision 1c8d45f
Blacksmith VMs: macOS ARM64 and Linux x86-64
21 tasks · 513 inputs
Compile · First use · Steady reuse

## Steady reuse

Ferroni throughput relative to each engine. Higher is faster.
Each row is a pairwise comparison on tasks both engines can run.

Comparator | macOS ARM64 | Linux x86-64 | Tasks
C Oniguruma | 3.44× | 2.75× | 21
Onigmo | 3.92× | 3.61× | 20
PCRE2 interpreter | 2.07× | 1.85× | 21
PCRE2 JIT | 0.70× | 0.63× | 21

## Where the tradeoff sits

C Oniguruma compiles patterns faster. Ferroni pays off when a prepared pattern runs many times.
PCRE2 JIT is faster in these steady-reuse aggregates.

## Same output first

An engine that rejects a pattern or returns a different result is excluded from that task before timing.
These are isolated regex steps, not full applications.

## How the result is assembled

Three processes per platform, separate VMs, 30 samples per phase. Ratios are geometric means within task families, then across families.
Rows cover different task sets and are not a universal ranking.

Raw measurements · Methodology · Reproduce the checks

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

---

Source documents:

- `../ferroni/docs/app/routes/perf/regex-workloads.mdx`
- `../ferroni/docs/app/data/production-summary.json`
