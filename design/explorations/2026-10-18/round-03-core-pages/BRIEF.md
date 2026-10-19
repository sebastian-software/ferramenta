# Core-page design brief

## Confirmed direction

The visual basis is round 02's Micrometer bridge (11) and Calibration sheet (14). Preserve their light surfaces, satin steel, restrained oxide and small precise fasteners. Combine these with round 01's richer editorial lower sections and explanatory Ferroni engine.

Eight pages: homepage, Rust getting started, core function and benchmarks for each project. This is a coherent visual design study, stored locally without a commit.

## Shared system

- Warm white #FCFCF8, soft white #FFFFFF, fine silver #D4D8D6, pale neutral #ECEDE7, graphite #3D423E and oxide #965332.
- Regular-width industrial humanist sans; restrained heading weights, readable prose, monospace reserved for code and measurements.
- A white family header with a project wordmark and identical navigation: Overview, Start with Rust, core topic, Benchmarks, GitHub.
- Homepage: Persuade mode, then a varied technical-magazine body of substantial prose, examples, charts and tables. The illustrated hero is the only object photography on each homepage. Reading and evidence pages: Read mode with a modest left section index and ample content width.
- Shared components: FamilyHeader, ProjectIntro, InstallLine, InputOutputExample, EditorialRow, DocContents, CodeExample, PolicyTable, BenchmarkTable, MeasurementProvenance, RelatedProjects and FamilyFooter.
- Material is a meaningful illustration, not a background for reading. Code, tables, header and footer remain light.
- Rust is the primary entry; Node.js remains a secondary path for Ferromark.
- No fake generated logo. Use text wordmarks in these concepts.

## Objects and meaning

Ferromark's document registration bridge aligns a source leaf and a rendered sheet; a separate index leaf represents extracted document metadata. It connects the bridge's precise alignment to parsing structure and publishing output.

Ferroni's pattern comparator holds parallel pattern cassettes and moves one scanning carriage over a text ribbon. A pointer marks the leftmost matching span. This expresses multi-pattern matching and position offsets, rather than an arbitrary gear or ring.

These are explanatory brand metaphors, not assertions about the literal software architecture. Each page must give the relevant software behavior in plain language alongside the object.

## Product content and evidence

Use the current local source documents. Do not invent API signatures, safety defaults, compatibility figures or benchmark numbers. Ferromark Rust preserves raw HTML by default; its Node API has different defaults. Front matter is extracted as raw text, not parsed YAML/TOML. Ferroni has regex byte offsets and explicit UTF-16 scanner methods.

Benchmark pages retain date, source revision, machine/platform, phase, denominator and scope. They must state the compile-time and JIT tradeoffs for Ferroni and the output-agreement subset for Ferromark. The supplied evidence snapshots are data for the design, not fresh measurements.

## Files and status

Keep all new images, provenance sidecars, prompts, reading copy and the review gallery in this exploration directory. Existing production design records and runtime components are outside this study.
