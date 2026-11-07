import type { ReactNode } from "react";

/*
 * The data a member's page compares itself with: contenders, rows and the
 * conditions of a measurement. `MonoComparisonTable` and `MonoMeasured` render
 * them; sites type their own data with them.
 */

export type Contender = {
  /** The key of this column in every row's `values`. */
  id: string;
  /** Its name as readers know it: "Oniguruma", "Library A". */
  label: ReactNode;
  /** The project this page is about: its column is set apart. One per table. */
  own?: boolean;
};

/** A feature held, held in part, or not held, with the words that qualify it. */
export type ComparisonMark = {
  mark: "no" | "partial" | "yes";
  /** Shown beside the mark: "UTF-8 only", "through a plugin". */
  note?: ReactNode;
};

/**
 * One cell: a measurement or a word as it is, `true` and `false` for a plain
 * yes and no, or a `ComparisonMark`. A missing cell is a dash.
 */
export type ComparisonCell = ComparisonMark | Exclude<ReactNode, Promise<unknown>>;

export type ComparisonRow = {
  /** What is compared: a workload, a document, a feature. Also the row's key, so keep it unique. */
  label: string;
  /** One line on the input or the conditions. */
  detail?: ReactNode;
  /** One cell per contender, by its `id`. */
  values: Record<string, ComparisonCell>;
  /** The row's result, in the last column: a factor, "equal". */
  verdict?: ReactNode;
  /** The project is behind in this row. Say so as plainly as a lead. */
  behind?: boolean;
};

export type ComparisonTableProps = {
  /** What is compared and how to read it: "Median time per document; lower is faster." */
  caption: ReactNode;
  /** The heading of the first column: "Workload", "Feature". */
  subject: ReactNode;
  contenders: Contender[];
  rows: ComparisonRow[];
  /** The heading of the verdict column: "Factor". Without it the table has no such column. */
  verdictLabel?: ReactNode;
  /** `"end"` sets the cells flush right, for measurements. */
  align?: "end" | "start";
};

/** One further row of a measurement's provenance. */
export type MeasuredRow = { label: string; value: ReactNode };

export type MeasuredProps = {
  /** When it was measured, as the report states it: "2026-09-23". */
  on: ReactNode;
  /** The machine and its system: "Apple M1 Pro, 32 GB, macOS 27.0". */
  machine: ReactNode;
  /** What was measured: a commit, or the versions compared. */
  revision?: ReactNode;
  /** Further rows: the corpus, the theme, how many runs. Labels are unique. */
  more?: MeasuredRow[];
  /** The way to the full report and the command that reproduces it: a link. */
  children?: ReactNode;
};
