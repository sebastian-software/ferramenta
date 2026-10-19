# Ferroni

## Oniguruma regex, in memory-safe Rust.

Run familiar patterns, from lookbehind to recursion, and the scanner that syntax highlighters drive.

Start with Rust · Explore the scanner
cargo add ferroni

Patterns in parallel. One next match.

## See what the pattern finds

Pattern: (?<=item-)\d+
Text: item-104 item-208
Matches: 104, 208

## Run the patterns regex rejects

Lookbehind, backreferences and recursion keep the expressive syntax your tools already use. Choose Ferroni when the pattern needs that contract.
Explore syntax and compatibility

## The engine under your syntax highlighter

A TextMate grammar searches many patterns at once. Ferroni's scanner returns the leftmost next match and the pattern that found it. Ferriki runs on Ferroni.
Understand the scanner

## Continued with care

Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, with compatibility checks against the original.
Inspect compatibility

## Fast on reuse. Honest about the tradeoff.

Compile, first use and steady reuse are measured separately. C Oniguruma compiles faster; PCRE2 JIT remains faster in the reported steady-reuse aggregate.
Read the benchmarks

## Control searches on untrusted input

Choose retry or time limits for the input you accept. Memory safety does not make every pattern cheap to run.
Read the input guide

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

---

Source documents:

- `../ferroni/docs/app/routes/home.tsx`
- `../ferroni/docs/app/routes/home-bottom-sections.tsx`
