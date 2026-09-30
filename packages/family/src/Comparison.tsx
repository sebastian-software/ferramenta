import { type ReactNode, useId } from "react";

import type { CustomProperties } from "./Icon.js";

import { Mark } from "./Mark.js";

/*
 * What a project's page says against others, in three shared forms: a table of
 * contenders, bars for one measure, and the line that says where and when it
 * was measured. A member's own site shows them; the family site never repeats
 * a figure. They work on a landing page and inside documentation alike.
 * Styled by `landing.css`.
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

const MARKS = {
  yes: { icon: "check", text: "Yes" },
  partial: { icon: "half", text: "Partial" },
  no: { icon: "cross", text: "No" },
} as const;

function isMark(value: ComparisonCell): value is ComparisonMark {
  return typeof value === "object" && value !== null && "mark" in value;
}

function MarkCell({ mark, note }: ComparisonMark) {
  const { icon, text } = MARKS[mark];
  return (
    <span className="fam-compare-mark" data-mark={mark}>
      <Mark name={icon} size={18} />
      <span className="fam-sr-only">{note === undefined ? text : `${text}: `}</span>
      {note}
    </span>
  );
}

function Cell({ value }: { value: ComparisonCell }) {
  if (value === true) return <MarkCell mark="yes" />;
  if (value === false) return <MarkCell mark="no" />;
  if (isMark(value)) return <MarkCell {...value} />;
  if (value === undefined || value === null) {
    return (
      <span className="fam-compare-mark" data-mark="none">
        <span aria-hidden="true">–</span>
        <span className="fam-sr-only">No value</span>
      </span>
    );
  }
  return value;
}

function Row({
  contenders,
  row,
  verdict,
}: {
  row: ComparisonRow;
  verdict: boolean;
} & Pick<ComparisonTableProps, "contenders">) {
  return (
    <tr data-behind={row.behind === true ? "" : undefined}>
      <th scope="row">
        {row.label}
        {row.detail !== undefined && <small>{row.detail}</small>}
      </th>
      {contenders.map((contender) => (
        <td key={contender.id} data-own={contender.own === true ? "" : undefined}>
          <Cell value={row.values[contender.id]} />
        </td>
      ))}
      {verdict && <td className="fam-compare-verdict">{row.verdict}</td>}
    </tr>
  );
}

function Head({
  contenders,
  subject,
  verdictLabel,
}: Pick<ComparisonTableProps, "contenders" | "subject" | "verdictLabel">) {
  return (
    <thead>
      <tr>
        <th scope="col">{subject}</th>
        {contenders.map((contender) => (
          <th key={contender.id} scope="col" data-own={contender.own === true ? "" : undefined}>
            {contender.label}
          </th>
        ))}
        {verdictLabel !== undefined && <th scope="col">{verdictLabel}</th>}
      </tr>
    </thead>
  );
}

/**
 * A table of contenders: one row per workload or feature, one column per
 * contender, the project's own column set apart. It is a real table, so it
 * reads row by row in a screen reader, and it scrolls sideways in its own box,
 * never the page. Where the project is behind, mark the row `behind`: a table
 * that only shows leads is an advertisement.
 */
export function ComparisonTable({
  align = "start",
  caption,
  contenders,
  rows,
  subject,
  verdictLabel,
}: ComparisonTableProps) {
  const captionId = useId();
  // The stylesheet keeps room for every value column before the table scrolls.
  const columns: CustomProperties = {
    "--fam-compare-columns": String(contenders.length + (verdictLabel === undefined ? 0 : 1)),
  };
  return (
    <figure
      className="fam-compare"
      data-align={align === "end" ? "end" : undefined}
      style={columns}
    >
      <figcaption className="fam-compare-caption" id={captionId}>
        {caption}
      </figcaption>
      <div className="fam-compare-scroll" role="region" aria-labelledby={captionId} tabIndex={0}>
        <table className="fam-compare-table">
          <Head contenders={contenders} subject={subject} verdictLabel={verdictLabel} />
          <tbody>
            {rows.map((row) => (
              <Row
                key={row.label}
                contenders={contenders}
                row={row}
                verdict={verdictLabel !== undefined}
              />
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export type ComparisonBar = {
  /** Who the bar belongs to. Also its key, so keep it unique. */
  label: string;
  /** One line under the name: the runtime, the mode it ran in. */
  detail?: ReactNode;
  /** The measurement, as a number: it sets the bar's length. */
  value: number;
  /** The measurement as the page states it. Defaults to `value`. */
  text?: ReactNode;
  /** The project this page is about: its bar is rust. */
  own?: boolean;
};

export type ComparisonBarsProps = {
  /** The measure, its unit, and which way is better: "Parsing a catalog · MiB/s · higher is faster". */
  caption: ReactNode;
  bars: ComparisonBar[];
  /** The value a full-width bar stands for. Defaults to the largest value. */
  max?: number;
};

/** A bar's length as a share of the longest, as a custom property for the stylesheet. */
function barLength(value: number, top: number): CustomProperties {
  const share = top > 0 ? Math.min(1, Math.max(0, value / top)) : 0;
  return { "--fam-bar": `${(share * 100).toFixed(2)}%` };
}

/**
 * One measure across several contenders, as bars from a common baseline. Every
 * bar carries its figure as text; the bar itself is for the eye only. Use it
 * for one measure in one unit, and a table for anything wider.
 */
export function ComparisonBars({ bars, caption, max }: ComparisonBarsProps) {
  const top = max ?? Math.max(...bars.map((bar) => bar.value));
  return (
    <figure className="fam-bars">
      <figcaption className="fam-compare-caption">{caption}</figcaption>
      <ul className="fam-bars-list">
        {bars.map((bar) => (
          <li
            key={bar.label}
            className="fam-bar"
            data-own={bar.own === true ? "" : undefined}
            style={barLength(bar.value, top)}
          >
            <span className="fam-bar-label">
              <b>{bar.label}</b>
              {bar.detail !== undefined && <small>{bar.detail}</small>}
            </span>
            <span className="fam-bar-track" aria-hidden="true" />
            <span className="fam-bar-value">{bar.text ?? bar.value}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

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

/**
 * Where a figure comes from: when it was measured, on which machine, at which
 * revision, and where the full report is. It belongs under every table, bar
 * chart or set of figures that states a measurement.
 */
export function Measured({ children, machine, more, on, revision }: MeasuredProps) {
  const rows: MeasuredRow[] = [
    { label: "Measured", value: on },
    { label: "Machine", value: machine },
    ...(revision === undefined ? [] : [{ label: "Revision", value: revision }]),
    ...(more ?? []),
    ...(children === undefined ? [] : [{ label: "Reproduce", value: children }]),
  ];
  return (
    <dl className="fam-measured">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
