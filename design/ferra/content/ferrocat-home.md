# Ferrocat

A translation catalog engine.

## Translations that stay in order.

Read, update, review and compile translation catalogs in Rust. Keep message identity, translator context and human edits visible.

Actions: Start with Rust. Catalog guide.
Navigation: Overview. Getting started. Catalogs. Evidence. GitHub. The Ferramenta family.

## Same message. Context intact

Margin introduction: Working example. Identity survives translation.
Illustrative PO entry:
msgctxt "button"
msgid "Open"
msgstr "Ouvrir"
Show the source, translator context and translated value as separate, aligned fields. A second context, status, may use the same source text with a different translation. Do not imply that text alone always identifies a message.

## Give the catalog a reliable core

Margin introduction: Catalogs. Storage and message semantics are explicit.
Ferrocat handles Gettext PO, ICU MessageFormat v1 and FCL catalogs. Keep source text, contexts, translations, origins, plural forms and obsolete entries in a model the application can inspect.
FCL uses one canonical entry per line for Git review and automation. PO remains useful where translator tools read the file directly. Format conversion is a distinct operation with explicit source and target modes.

Table: Operation | Explicit inputs | Result
Update | New source messages and an existing catalog | Predictable identity-based update
Three-way merge | Ancestor, ours and theirs | Deletion-aware merge and structured conflicts
Audit | Source and target catalog sets | Missing-message and ICU diagnostics
Compile | Requested locale and fallback policy | Runtime artifact with resolution reporting

## Keep edits authoritative

Margin introduction: Collaboration. Automation has a visible boundary.
Merge updates without fuzzy guessing or hidden identity changes. A three-way merge preserves deletions and reports modify/delete conflicts instead of silently choosing a winner.
Machine-managed value metadata can detect later hand edits. High-level writers clear machine metadata when a person edits the value. Human corrections remain reviewable catalog data.

## Check the message before it ships

Margin introduction: Release checks. Structure matters as much as wording.
Analyze placeholders, formatters, plural/select branches and rich-text tags. Audit missing locales, empty or stale translations, obsolete entries and metadata conflicts. Coverage and review reports support translator handoffs and release gates.
ICU scope is MessageFormat v1. Host frameworks own extraction, runtime adapters and UI integration; Ferrocat supplies the catalog semantics underneath them.
Links: ICU compatibility. Audit guide. Recorded benchmarks.

## Start with the catalog

Margin introduction: Get started. One Rust entry point.
cargo add ferrocat
Use the umbrella crate for application code. For a non-Rust release gate, install ferrocat-cli and run ferrocat audit with explicit source and target catalogs.

Footer: Ferrocat. Part of Ferramenta. GitHub. Imprint. Privacy.
