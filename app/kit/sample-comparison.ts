import type { ComparisonBar, ComparisonRow, Contender } from "ferramenta-family";

/*
 * The sample tool beside two alternatives. All three columns are invented, and
 * so is every figure: the kit shows how a comparison is laid out, and a real
 * member's measurements belong on its own site, next to how they were taken.
 */

export const SAMPLE_CONTENDERS: Contender[] = [
  { id: "ferrometro", label: "Ferrometro", own: true },
  { id: "a", label: "Library A" },
  { id: "b", label: "Library B" },
];

/** Measurements: one row per workload, the factor last. One row is behind, and says so. */
export const SAMPLE_TIMINGS: ComparisonRow[] = [
  {
    label: "Parse a quantity",
    detail: "A corpus of unit expressions",
    values: { ferrometro: "1.0 µs", a: "2.4 µs", b: "3.1 µs" },
    verdict: "2.4×",
  },
  {
    label: "Convert between exact units",
    detail: "Rational arithmetic, no rounding",
    values: { ferrometro: "0.2 µs", a: "0.5 µs", b: "0.9 µs" },
    verdict: "2.5×",
  },
  {
    label: "Convert a temperature",
    detail: "Offset scales",
    values: { ferrometro: "0.5 µs", a: "0.4 µs" },
    verdict: "0.8×",
    behind: true,
  },
];

/** Features: a mark per cell, with the words that qualify it where a plain yes or no would mislead. */
export const SAMPLE_FEATURES: ComparisonRow[] = [
  { label: "SI prefixes", values: { ferrometro: true, a: true, b: true } },
  {
    label: "UCUM unit codes",
    values: { ferrometro: true, a: { mark: "partial", note: "Common units" }, b: false },
  },
  {
    label: "Dimension checks",
    detail: "When the expression is parsed",
    values: { ferrometro: true, a: false, b: { mark: "partial", note: "At runtime" } },
  },
  {
    label: "Offset temperature scales",
    values: { ferrometro: { mark: "partial", note: "Explicit call" }, a: true, b: true },
  },
  { label: "Currency", values: { ferrometro: false, a: false, b: true } },
];

/** One measure across the field, as bars. */
export const SAMPLE_BARS: ComparisonBar[] = [
  { label: "Ferrometro", detail: "Rust", value: 840, own: true },
  { label: "Library A", detail: "Rust", value: 350 },
  { label: "Library B", detail: "C++", value: 270 },
  { label: "Library C", detail: "Python", value: 90 },
];

/** Where the sample figures come from: nowhere, and the page says so. */
export const SAMPLE_MEASURED = {
  on: "Not measured: sample figures",
  machine: "A real page names the machine and its system",
  revision: "and the commit or the versions compared",
} as const;
