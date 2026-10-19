# Start with Rust

From Cargo to a first match. No C toolchain is required.

## Install

cargo add ferroni

## Your first match

use ferroni::prelude::*;

let re = Regex::new(r"\d{4}-\d{2}-\d{2}").unwrap();
let m = re.find("Released on 2026-09-05.").unwrap();
assert_eq!(m.as_str(), "2026-09-05");

Match: 2026-09-05
Byte range: 12..22

## Capture what matters

Named groups resolve through Captures::name. Group 0 is the whole match.
Find the leftmost match with find, or walk successive matches with find_iter.

## Keep positions explicit

Regex offsets are bytes. Use the scanner's explicit UTF-16 methods when integrating with editor text models.

## Choose your next step

The scanner · Syntax and compatibility · Limits for untrusted input · Benchmarks

Ferroni · Part of Ferramenta · GitHub · Imprint · Privacy

---

Source documents:

- `../ferroni/docs/app/routes/guide/getting-started.mdx`
