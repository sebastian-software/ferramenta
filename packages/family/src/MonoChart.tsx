import { type ReactNode, type RefObject, useEffect, useId, useRef, useState } from "react";

export type MonoSegmentedOption = { value: string; label: ReactNode };

export type MonoSegmentedProps = {
  label: string;
  options: MonoSegmentedOption[];
  value: string;
  onChange: (value: string) => void;
};

/** A row of pressed/unpressed buttons; the caller owns the value. */
export function MonoSegmented({ label, options, value, onChange }: MonoSegmentedProps) {
  return (
    <div className="mono-seg" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export type MonoBarRow = {
  id: string;
  label: string;
  sub?: string;
  /** Time relative to the engine's own, which is 1. */
  value: number;
  /** The engine's own row wears the rust accent. */
  own?: boolean;
};

export type MonoBarChartProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Segmented controls above the bars; the caller owns their state. */
  toggles?: ReactNode;
  rows: MonoBarRow[];
  /** The value at the right edge; longer bars show a clean break. */
  scale: number;
  ticks: number[];
  /** The tooltip for a row on hover and focus. */
  describe: (row: MonoBarRow, cut: boolean) => ReactNode;
  /** Text and links under the scale. */
  after?: ReactNode;
  /** The measuring conditions beside the chart. */
  conditions?: ReactNode;
  /** An accessible name for the list of bars. */
  label: string;
};

const reduced = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Holds the bars at zero (`mono-armed`) until the chart first comes into view,
 * unless it starts in view or motion is reduced. Server markup keeps the full
 * widths, so the chart reads without scripts.
 */
function useGrowOnView(element: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const target = element.current;
    if (target === null || reduced() || typeof IntersectionObserver !== "function") return;
    const box = target.getBoundingClientRect();
    if (box.top < innerHeight && box.bottom > 0) return;
    target.classList.add("mono-armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        target.classList.remove("mono-armed");
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [element]);
}

type BarProps = {
  row: MonoBarRow;
  index: number;
  scale: number;
  tipId: string;
  onShow: (row: MonoBarRow, item: HTMLElement) => void;
  onHide: () => void;
};

function Bar({ row, index, scale, tipId, onShow, onHide }: BarProps) {
  const cut = row.value > scale;
  const width = (Math.min(row.value, scale) / scale) * 100;
  const own = row.own === true ? " mono-own" : "";
  const sub = row.sub === undefined ? "" : `, ${row.sub}`;
  return (
    <li
      tabIndex={0}
      aria-describedby={tipId}
      aria-label={`${row.label}${sub}: ${row.value.toFixed(2)}×`}
      onMouseEnter={(event) => {
        onShow(row, event.currentTarget);
      }}
      onFocus={(event) => {
        onShow(row, event.currentTarget);
      }}
      onMouseLeave={onHide}
      onBlur={onHide}
    >
      <span className="mono-bar-name" aria-hidden="true">
        {row.label}
        {row.sub !== undefined && <small>{row.sub}</small>}
      </span>
      <span className="mono-track" aria-hidden="true">
        <span
          className={`mono-bar${own}`}
          data-cut={cut ? "" : undefined}
          style={{
            width: `${width}%`,
            transitionDelay: `${60 + index * 90}ms`,
          }}
        />
        <span className="mono-ref" style={{ left: `${(1 / scale) * 100}%` }} />
      </span>
      <span className={`mono-bar-value${own}`} aria-hidden="true">
        {row.value.toFixed(2)}×
      </span>
    </li>
  );
}

function Scale({ scale, ticks }: { scale: number; ticks: number[] }) {
  return (
    <div className="mono-scale" aria-hidden="true">
      <span />
      <span className="mono-ticks">
        {ticks.map((tick) => (
          <span key={tick} style={{ left: `${(tick / scale) * 100}%` }}>
            {tick}×
          </span>
        ))}
      </span>
      <span />
    </div>
  );
}

type Tip = { row: MonoBarRow; left: number; top: number };

/** The bars with their shared tooltip. */
function Bars({
  label,
  rows,
  scale,
  describe,
}: Pick<MonoBarChartProps, "describe" | "label" | "rows" | "scale">) {
  const listRef = useRef<HTMLOListElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Tip>();
  useGrowOnView(listRef);
  const tipId = useId();
  const onShow = (row: MonoBarRow, item: HTMLElement) => {
    const box = listRef.current?.getBoundingClientRect();
    if (box === undefined) return;
    const width = tipRef.current?.offsetWidth ?? 300;
    setActive({
      row,
      left: Math.max(0, Math.min(210, box.width - width)),
      top: item.getBoundingClientRect().bottom - box.top - 2,
    });
  };
  const onHide = () => {
    setActive(undefined);
  };
  return (
    <div className="mono-bars-wrap">
      <ol className="mono-bars" ref={listRef} aria-label={label}>
        {rows.map((row, index) => (
          <Bar key={row.id} {...{ row, index, scale, tipId, onShow, onHide }} />
        ))}
      </ol>
      <div
        className="mono-tip"
        ref={tipRef}
        id={tipId}
        data-show={active === undefined ? undefined : ""}
        style={active === undefined ? undefined : { left: active.left, top: active.top }}
      >
        {active !== undefined && describe(active.row, active.row.value > scale)}
      </div>
    </div>
  );
}

/**
 * Horizontal comparison bars: the engine's own row in rust, the others in
 * steel, a hairline at 1×, the value at the end of every row, a tooltip on
 * hover and focus, and one growth when the chart first comes into view.
 */
export function MonoBarChart({
  title,
  description,
  toggles,
  rows,
  scale,
  ticks,
  describe,
  after,
  conditions,
  label,
}: MonoBarChartProps) {
  return (
    <figure className="mono-chart">
      <div>
        <div className="mono-chart-head">
          <h3>{title}</h3>
          {description !== undefined && <p>{description}</p>}
          {toggles !== undefined && <div className="mono-toggles">{toggles}</div>}
        </div>
        <Bars label={label} rows={rows} scale={scale} describe={describe} />
        <Scale scale={scale} ticks={ticks} />
        {after !== undefined && <div className="mono-chart-after">{after}</div>}
      </div>
      {conditions !== undefined && <aside className="mono-conditions">{conditions}</aside>}
    </figure>
  );
}

export type MonoTableViewProps = {
  summary?: ReactNode;
  children: ReactNode;
};

/** The same figures as a plain table, folded under the chart. */
export function MonoTableView({
  summary = "Show the figures as a table",
  children,
}: MonoTableViewProps) {
  return (
    <details className="mono-table-view">
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
