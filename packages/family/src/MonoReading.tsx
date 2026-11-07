import { type ComponentPropsWithoutRef, type ReactNode, useId, useRef } from "react";

import type { ComparisonTableProps } from "./comparison-types.js";

import {
  ComparisonWords,
  useDerivedRegionLabel,
  useHorizontalOverflow,
  useScrollableCode,
} from "./ReadingSupport.js";

/*
 * Monografie's documentation pages (ADR-0012): the reading layout between the
 * host's navigation and the page outline, and the tables that stand in it.
 * Styled by `monografie-docs.css`.
 */

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

export type MonoReadingLayoutProps = {
  /** The host's navigation: a `MonoSectionRail` and a `MonoGuideNavigation`. */
  navigation?: ReactNode;
  /** The page outline, for example `<ArdoTOC source="dom" scope="#…" />`. */
  outline?: ReactNode;
} & ComponentPropsWithoutRef<"article">;

/**
 * One reading column between host-owned navigation and the page outline. Both
 * panels stay in view under the sticky header; the outline steps aside below
 * 1181px and the navigation below 961px, where the host's menu carries it.
 * Code in the column that scrolls sideways is reachable by keyboard.
 */
export function MonoReadingLayout({
  navigation,
  outline,
  children,
  className,
  ...props
}: MonoReadingLayoutProps) {
  const proseRef = useRef<HTMLDivElement>(null);
  useScrollableCode(proseRef, children);
  return (
    <article {...props} className={classes("mono-reading", className)}>
      <div className="mono-reading-navigation">{navigation}</div>
      <div className="mono-reading-surface">
        <div className="mono-prose" ref={proseRef}>
          {children}
        </div>
      </div>
      <div className="mono-reading-outline">{outline}</div>
    </article>
  );
}

/**
 * The pages of the current section. The host supplies the links, marks the
 * current one with `aria-current="page"` or `data-active="true"`, groups them
 * under `<p>` labels and names the landmark.
 */
export function MonoGuideNavigation({ className, ...props }: ComponentPropsWithoutRef<"nav">) {
  return <nav {...props} className={classes("mono-guide-navigation", className)} />;
}

export type MonoSectionRailProps = ComponentPropsWithoutRef<"nav">;

/**
 * Documentation sections, placed directly before `MonoGuideNavigation`. In the
 * reading layout they stand as a short list above the pages, divided from them
 * by a hairline; anywhere else, such as the host's mobile panel, they lie flat
 * as a row of tabs. The host supplies one link per section, marks the current
 * one with `data-active="true"` or `aria-current`, and names the landmark. The
 * tabs are links, not an ARIA tablist: switching a section navigates.
 */
export function MonoSectionRail({ className, ...props }: MonoSectionRailProps) {
  return <nav {...props} className={classes("mono-section-rail", className)} />;
}

/** Keeps native table geometry and scrolls a wide table inside its own box, never the page. */
export function MonoTableViewport({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const regionRef = useRef<HTMLDivElement>(null);
  const overflows = useHorizontalOverflow(regionRef);
  // A region without a name of its own takes one from its caption or heading.
  const unnamed = props["aria-label"] === undefined && props["aria-labelledby"] === undefined;
  const derived = useDerivedRegionLabel(regionRef, unnamed);
  // A derived name replaces "Table" in the browser; React leaves it, as this never changes.
  return (
    <div className={classes("mono-table-frame", className)}>
      <p className="mono-table-hint" hidden={!overflows}>
        Scroll sideways for more columns.
      </p>
      <div
        {...props}
        {...derived}
        aria-label={unnamed ? "Table" : props["aria-label"]}
        className="mono-table-region"
        role="region"
        tabIndex={0}
        ref={regionRef}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * The MDX `table` slot: prose may wrap, but comparison columns keep readable
 * words. A table without an `aria-label` is named after its caption or the
 * heading it stands under, numbered where two share one, so several tables on
 * a page stay distinct landmarks.
 */
export function MonoReadingTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <MonoTableViewport className="mono-reading-table" aria-label={props["aria-label"]}>
      <table {...props} />
    </MonoTableViewport>
  );
}

export type MonoTableProps = {
  caption: ReactNode;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"table">, "children">;

/** A captioned hairline table; native children keep the consumer's header relationships. */
export function MonoTable({ caption, children, className, ...props }: MonoTableProps) {
  const id = useId();
  return (
    <MonoTableViewport aria-labelledby={id}>
      <table {...props} className={classes("mono-data-table", className)}>
        <caption id={id}>{caption}</caption>
        {children}
      </table>
    </MonoTableViewport>
  );
}

/**
 * Measurements in a table; callers keep units, platform groups, sources and
 * missing values. The cells may use `mono-benchmark-name`, `-detail`,
 * `-source`, `-conformance` and `-reference`.
 */
export function MonoBenchmarkTable({ className, ...props }: MonoTableProps) {
  return <MonoTable {...props} className={classes("mono-benchmark-table", className)} />;
}

function ComparisonRow({
  row,
  contenders,
  verdict,
}: {
  row: ComparisonTableProps["rows"][number];
  contenders: ComparisonTableProps["contenders"];
  verdict: boolean;
}) {
  return (
    <tr data-behind={row.behind ?? undefined}>
      <th scope="row">
        {row.label}
        {row.detail !== undefined && <span className="mono-comparison-detail">{row.detail}</span>}
      </th>
      {contenders.map((entry) => (
        <td key={entry.id} data-own={entry.own ?? undefined}>
          <ComparisonWords value={row.values[entry.id]} />
        </td>
      ))}
      {verdict && (
        <td>
          <ComparisonWords value={row.verdict} />
        </td>
      )}
    </tr>
  );
}

/** The shared comparison data contract as a hairline table; the own column is set apart. */
export function MonoComparisonTable({
  caption,
  subject,
  contenders,
  rows,
  verdictLabel,
  align = "start",
}: ComparisonTableProps) {
  return (
    <MonoTable caption={caption} className="mono-comparison-table" data-align={align}>
      <thead>
        <tr>
          <th scope="col">{subject}</th>
          {contenders.map((entry) => (
            <th key={entry.id} scope="col" data-own={entry.own ?? undefined}>
              {entry.label}
            </th>
          ))}
          {verdictLabel !== undefined && <th scope="col">{verdictLabel}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <ComparisonRow
            key={row.label}
            row={row}
            contenders={contenders}
            verdict={verdictLabel !== undefined}
          />
        ))}
      </tbody>
    </MonoTable>
  );
}
