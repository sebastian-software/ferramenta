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

## Patterns carry a contract

A regex engine is more than a way to find a word. Existing grammars and applications depend on how lookbehind, captured text, Unicode properties and recursive patterns behave. Rewriting the expression can change that behavior just as surely as changing the engine.

Ferroni continues Oniguruma's expressive syntax in Rust. Choose it when that compatibility matters: an editor grammar, a highlighter, or a search that depends on a feature the regex crate deliberately leaves out. The point is to run the pattern your tool already understands, with behavior you can inspect.

Selected executable syntax checks:

| Feature                      | Ferroni | Rust regex |
| ---------------------------- | ------- | ---------- |
| Lookahead and lookbehind     | Yes     | No         |
| Backreferences               | Yes     | No         |
| Unicode character properties | Yes     | Yes        |

These examples describe selected checks, not every possible pattern.
Explore syntax and compatibility

## One line. Several patterns. The next match.

A TextMate grammar compiles a set of patterns, then asks which one matches next from a position in the line. The scanner returns the leftmost match, the index of the pattern that found it, and capture ranges. The tokenizer resumes at the previous match's end.

Source: const answer = 42 // note
Patterns: 0 keywords, 1 strings, 2 comments, 3 numbers

| Resume at byte | Next match | Pattern index | Byte range |
| -------------- | ---------- | ------------- | ---------- |
| 0              | const      | 0             | 0..5       |
| 5              | 42         | 3             | 15..17     |
| 17             | // note    | 2             | 18..25     |

The regular scanner uses byte offsets. Explicit UTF-16 methods support editor text models. For a zero-width match, advance at a character boundary before asking again.
Understand the scanner · Ferriki runs on Ferroni

## Continued with care

Oniguruma's C project ended in April 2025. Ferroni continues the engine in Rust, preserving its syntax and pattern semantics for the supported encodings. Compatibility checks compare behavior against the original; the history stays visible with the implementation.

A smaller system is not automatically a better fit for every pattern. Rust's regex crate makes a different tradeoff: it leaves out constructs such as lookaround and backreferences to offer predictable linear-time searching. Ferroni keeps the expressive contract and gives callers controls for expensive searches.
Inspect compatibility · Compare the engine contracts

## Reuse changes the picture

Ferroni throughput relative to each comparator; higher is faster.

| Comparator  | macOS ARM64 | Linux x86-64 |
| ----------- | ----------- | ------------ |
| C Oniguruma | 3.44×       | 2.75×        |
| PCRE2 JIT   | 0.70×       | 0.63×        |

Steady reuse · 21 tasks per pair · 513 corpus inputs
Measured October 15, 2026 · revision 1c8d45f
Blacksmith VMs: macOS ARM64 and Linux x86-64.

Compile, first use and steady reuse answer different questions. C Oniguruma compiles patterns faster. Ferroni pays off when a prepared pattern runs many times. PCRE2 JIT remains faster in the steady-reuse aggregates shown here.

Every task checks expected output before timing. These are isolated regex steps, not complete application benchmarks, and each row describes a pairwise task set.
Read the complete benchmarks

## Put a boundary around the work

Memory safety does not make every pattern cheap. For untrusted patterns or text, choose retry budgets and supported time limits; the fallible search methods distinguish a reached limit from no match. Browser WebAssembly searches use retry limits instead of timeouts.

Keep those controls close to the place that accepts input, then reuse compiled patterns where the workload allows it.
Read the untrusted-input guide

Start with Rust
cargo add ferroni

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy
