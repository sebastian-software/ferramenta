# Ferralk

A glob matcher and file walker.

## Find the files. Skip the rest.

Match glob patterns and walk filesystem trees in parallel. Let the include pattern rule out work before directories are opened.

Actions: Start with Rust. Glob guide.
Navigation: Overview. Getting started. Walking. Evidence. GitHub. The Ferramenta family.

## Read the tree through the pattern

Margin introduction: Working example. Selection starts before the file list.
Illustrative file tree:
src/lib.rs
src/generated/cache.rs
tests/spec.rs
Include: src/**/*.rs
Exclude: **/generated/**
Result: src/lib.rs
Show the reachable branch, the excluded generated branch and the unrelated tests branch in a clear small tree diagram. These are example files, not measured benchmark counts.

## Prune from the include pattern

Margin introduction: Traversal. Do less filesystem work.
A scoped include pattern identifies the roots that can match. Ferralk uses that information while walking, rather than treating selection only as a filter on an already visited tree.
Filenames remain raw bytes and native Path values from directory reads to matches. Consumers do not lose filenames to a forced UTF-8 conversion.

Table: Surface | Use it for
ferralk-glob | Compile a pattern once and match paths or bytes
ferralk | Walk and select filesystem entries in parallel
Git-ignore support | Explicit ignore behavior checked against Git
Walk options | Explicit hidden-file, symlink, metadata, sorting and error policies

## Choose the pattern contract

Margin introduction: Glob semantics. Keep switches visible.
A single star stays inside one path component in the shell-style contract. PatternOptions::walker() enables recursive stars, braces and extglobs for standalone matching, just as the walker does.
Default standalone pattern options intentionally keep those syntax extensions off. Choose options when moving an existing matcher rather than assuming every library reads the same pattern alike.

## Measure the work you actually do

Margin introduction: Evidence. Conditions belong beside results.
The matcher and walker are checked against a frozen zlob reference. Ignore verdicts are replayed against Git itself. Recorded benchmarks describe concrete tree shapes, cache conditions, hosts and worker budgets; they are not a promise of one universal ranking.
The matcher crate forbids unsafe. The broader workspace records its named, limited exceptions explicitly.
Links: Compatibility guide. Benchmark evidence. Error policy.

## Start at the right layer

Margin introduction: Get started. Matching and walking are separate.
cargo add ferralk
Depend on ferralk-glob alone when the application already has the paths and needs matching without traversal dependencies.

Footer: Ferralk. Part of Ferramenta. GitHub. Imprint. Privacy.
