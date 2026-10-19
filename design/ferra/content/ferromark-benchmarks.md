# Parser benchmarks

Same input. Equivalent HTML. The measured settings are part of the result.

Measured September 21, 2026
Apple M1 Pro · revision 39b1f0b7

## Native engine comparison

Relative throughput. Higher is faster; Ferromark v2 = 1.00×.
Fresh and reuse are separate lifecycles.
50 documents with equivalent HTML across five engines.

Engine | Fresh | Reuse
Ferromark v2 | 1.00× | 1.00×
Ferromark v1 | 0.48× | 0.52×
md4c | 0.29× | 0.27×
pulldown-cmark | 0.38× | 0.37×
Bun native | 0.17× | 0.15×

## What belongs in the score

The frozen corpus contains 57 documents. The score above uses the 50-document five-engine agreement subset. Differing outputs remain diagnostics.

## What the timing includes

Fresh includes setup, processing, owned output and destruction. Reuse retains public state where the API permits.
No file I/O, process startup or output normalization is timed.

## Read the conditions before the ranking

The extension lane enables tables, strikethrough and task lists. This is not full GFM. These explicit settings differ from library defaults.
One shared workstation does not establish a universal ranking or statistical significance.

Raw data · Exact flags · Output review · Reproduce the run

Ferromark · Part of Ferramenta · GitHub · Imprint · Privacy

---

Source documents:

- `../ferromark/homepage/app/routes/guide/benchmarks.mdx`
- `../ferromark/homepage/app/data/native-benchmarks.json`
