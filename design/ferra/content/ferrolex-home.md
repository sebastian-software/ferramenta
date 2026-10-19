# Ferrolex

A spell checker.

## Spelling, with a clear contract.

Check wordforms and get deterministic suggestions from a Rust engine that reads existing Hunspell dictionaries.

Actions: Start with Rust. Dictionary guide.
Navigation: Overview. Getting started. Dictionaries. Compatibility. GitHub. The Ferramenta family.

## A dictionary makes the decision

Margin introduction: Working example. The words are explicit.
Illustrative word-list example:
words.txt contains the two lines precision and durable.
Check: ferrolex check --dictionary words.txt precision
Show precision as recognized and precison as an unrecognized input. The example demonstrates exact word-list recognition; do not invent a suggestion score or performance figure.
Plain word lists use exact matching, including casing, by default. Hunspell imports apply their documented capitalization behavior.

## Wordforms, not just a bag of strings

Margin introduction: Dictionaries. Keep the useful language model.
Hunspell dictionaries describe more than a list of base words. Ferrolex loads existing dictionary and affix data without linking the native Hunspell library. Reviewed compatibility is recorded for exact pinned dictionaries and probes.
This is not a blanket claim of complete Hunspell compatibility. Check the locale matrix for the dictionary you intend to ship.

Table: Dictionary path | What it provides
Plain word list | Explicit words and exact matching
Hunspell dictionary and affixes | Dictionary-defined wordform behavior
Compiled dictionary | A prepared dictionary representation
Verified catalog and downloader | Caller-controlled local dictionary acquisition

## Suggestions that can be reviewed

Margin introduction: Suggestions. Deterministic decisions.
The same dictionary and input produce the same suggestion ordering. Keep suggestion behavior visible in tests and review it against real text rather than assuming a language model will repair the result.
Optional normalization is an explicit library policy. It is separate from future case-folding behavior.
Link: Compatibility evidence.

## Let the integration own the format

Margin introduction: Boundaries. Extract the right text first.
A Markdown tool extracts prose. A code-aware integration decides which identifiers or comments belong in the check. Ferrolex owns dictionary loading, word checks and suggestions; the caller owns document parsing and language context.
The Rust engine is the product core. The direct Node.js binding is release-gated but not yet published to npm in this source snapshot. C ABI, Python, LSP and editor integrations remain evaluation prototypes.

## Try the engine

Margin introduction: Get started. Bring a dictionary.
Install the command-line tool: cargo install ferrolex-cli
Then check a plain-text word list or an existing Hunspell dictionary. The project is pre-1.0; public APIs may change in minor releases.
Links: Rust API. Dictionary acquisition. Locale matrix.

Footer: Ferrolex. Part of Ferramenta. GitHub. Imprint. Privacy.
