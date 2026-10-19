# The scanner

Many patterns. The next leftmost match.

A TextMate tokenizer asks which pattern matches next at the current position. Ferroni returns the pattern index and capture ranges.

## One line, several patterns

Source: const answer = 42 // note
Pattern 0: keywords
Pattern 1: strings
Pattern 2: comments
Pattern 3: numbers

Next match: const
Pattern index: 0
Byte range: 0..5

## Use the scanner

use ferroni::prelude::*;

let mut scanner = Scanner::new(&[
r"\bconst\b",
r"\b\d+\b",
]).unwrap();

let m = scanner.find_next_match(
"const answer = 42", 0, ScannerFindOptions::NONE
).unwrap();

## Two coordinate systems

find_next_match returns byte offsets.
find_next_match_utf16 with OnigString returns UTF-16 code units.
In "hello 🌍 world", "world" starts at byte 11, UTF-16 position 9.

## Reuse work without losing correctness

A stable string ID lets repeated scans of the same line reuse cached results. Advance past zero-width matches at a character boundary.

Scanner API reference · Compatibility · Benchmarks

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

---

Source documents:

- `../ferroni/docs/app/routes/guide/getting-started.mdx`
