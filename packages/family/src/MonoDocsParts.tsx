import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

import type { MeasuredProps, MeasuredRow } from "./Comparison.js";

import { Mark } from "./Mark.js";

/*
 * The parts a Monografie documentation page sets in its reading column: code,
 * worked examples, controls, steps, measurements and related links. Each takes
 * the props of its Ferra counterpart; the code sheets are in MonoDocsCode.
 * Styled by `monografie-docs.css`.
 */

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

/** Links between variants of one page, such as runtimes; the current one carries `aria-current`. */
export function MonoTabs({ className, ...props }: ComponentPropsWithoutRef<"nav">) {
  return <nav {...props} className={classes("mono-tabs", className)} />;
}

/** Related destinations on light sheets; each child is an `<article>` with a heading, a line and a link. */
export function MonoChoices({ children }: { children: ReactNode }) {
  return <div className="mono-choices">{children}</div>;
}

/** One picture, centered and never wider than the column. */
export function MonoMedia({ children }: { children: ReactNode }) {
  return <figure className="mono-media">{children}</figure>;
}

/** Short headed paragraphs side by side, each under a hairline. */
export function MonoFeatureGrid({
  items,
}: {
  items: ReadonlyArray<{ heading: string; text: ReactNode }>;
}) {
  return (
    <div className="mono-feature-grid">
      {items.map((item) => (
        <section key={item.heading}>
          <h3>{item.heading}</h3>
          <div>{item.text}</div>
        </section>
      ))}
    </div>
  );
}

/** Two columns that stack on narrow screens. */
export function MonoColumns({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("mono-columns", className)} />;
}

export type MonoArticleProps = {
  title: ReactNode;
  introduction?: ReactNode;
  art?: ReactNode;
  /** A decorative line symbol beside the article's visible heading. */
  icon?: ReactNode;
  meta?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"article">, "title">;

/** A story on a light sheet, with an optional picture first and its evidence in the footer. */
export function MonoArticle({
  title,
  introduction,
  art,
  icon,
  meta,
  children,
  className,
  ...props
}: MonoArticleProps) {
  const generatedId = useId();
  const headingId = props.id === undefined ? generatedId : `${props.id}-title`;
  return (
    <article
      tabIndex={-1}
      {...props}
      className={classes("mono-article", className)}
      aria-labelledby={headingId}
    >
      <div className="mono-article-content">
        {art !== undefined && <div className="mono-article-art">{art}</div>}
        {icon !== undefined && (
          <div className="mono-article-icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <header className="mono-article-heading">
          <h2 id={headingId}>{title}</h2>
          {introduction !== undefined && <p>{introduction}</p>}
        </header>
        <div className="mono-article-copy">{children}</div>
      </div>
      {meta !== undefined && <footer className="mono-article-meta">{meta}</footer>}
    </article>
  );
}

type SelectProps = {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
} & Omit<ComponentPropsWithoutRef<"select">, "children">;

/** A labeled native select; callers own its value and the content it controls. */
export function MonoSelect({ label, options, ...props }: SelectProps) {
  return (
    <label className="mono-select">
      <span>{label}</span>
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type ExampleProps = {
  title: ReactNode;
  introduction?: ReactNode;
  source: string;
  controls?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

/** A worked example on facing sheets, source beside result; callers own the state and the output. */
export function MonoExample({
  title,
  introduction,
  source,
  controls,
  footer,
  children,
}: ExampleProps) {
  const id = useId();
  return (
    <section className="mono-example" aria-labelledby={id}>
      <header>
        <h3 id={id}>{title}</h3>
        {introduction !== undefined && <p>{introduction}</p>}
      </header>
      {controls != null && <div className="mono-example-controls">{controls}</div>}
      <div className="mono-example-grid">
        <div className="mono-example-source">
          <p className="mono-example-label">Source</p>
          <pre>
            <code>{source}</code>
          </pre>
        </div>
        <div className="mono-example-preview">
          <p className="mono-example-label">Result</p>
          <div className="mono-example-result">{children}</div>
        </div>
      </div>
      {footer !== undefined && <div className="mono-example-footer">{footer}</div>}
    </section>
  );
}

type ToggleProps = { pressed: boolean; label: string; description: ReactNode } & Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
>;

/** An option that is on or off, with one line on what it changes. */
export function MonoToggle({ pressed, label, description, ...props }: ToggleProps) {
  return (
    <button {...props} className="mono-toggle" type="button" aria-pressed={pressed}>
      <span>
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <span className="mono-toggle-state" aria-hidden="true">
        <Mark name="check" size={14} />
      </span>
    </button>
  );
}

/** A short ordered explanation; content and processing logic belong to the host. */
export function MonoSteps({
  caption,
  items,
}: {
  caption: ReactNode;
  items: ReadonlyArray<{ heading: string; text: ReactNode }>;
}) {
  return (
    <figure className="mono-steps">
      <figcaption>{caption}</figcaption>
      <ol>
        {items.map((item) => (
          <li key={item.heading}>
            <strong>{item.heading}</strong>
            <div>{item.text}</div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Measurement conditions, source revision and reproduction beside the result. */
export function MonoMeasured({ on, machine, revision, more, children }: MeasuredProps) {
  const rows: MeasuredRow[] = [
    { label: "Measured", value: on },
    { label: "Machine", value: machine },
    ...(revision === undefined ? [] : [{ label: "Revision", value: revision }]),
    ...(more ?? []),
    ...(children === undefined ? [] : [{ label: "Reproduce", value: children }]),
  ];
  return (
    <dl className="mono-measured">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export type MonoBar = {
  id: string;
  label: ReactNode;
  value: number;
  displayValue: string;
  /** The engine's own bar: it wears the rust accent. One per chart. */
  highlight?: boolean;
};

export type MonoBarsProps = {
  caption: string;
  items: readonly MonoBar[];
  children?: ReactNode;
};

/**
 * One measure as bars in the instrument's steel, scaled to the largest value;
 * the highlighted bar is the engine's own, in rust. For a chart with a 1× line
 * and a task switch, use `MonoBarChart`.
 */
export function MonoBars({ caption, items, children }: MonoBarsProps) {
  if (items.some((item) => !Number.isFinite(item.value) || item.value < 0))
    throw new RangeError("MonoBars requires finite, nonnegative values.");
  const max = Math.max(0, ...items.map((item) => item.value));
  return (
    <figure className="mono-bar-figure">
      <figcaption>{caption}</figcaption>
      <ul className="mono-bar-list">
        {items.map((item) => {
          const own = item.highlight === true;
          return (
            <li key={item.id} data-highlight={own ? true : undefined}>
              <span className="mono-bar-label">{item.label}</span>
              <span className={own ? "mono-bar-value mono-own" : "mono-bar-value"}>
                {item.displayValue}
              </span>
              <span className="mono-track" aria-hidden="true">
                <span
                  className={own ? "mono-bar mono-own" : "mono-bar"}
                  style={{ width: `${max === 0 ? 0 : (item.value / max) * 100}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
      {children !== undefined && children !== null ? (
        <div className="mono-measure-note">{children}</div>
      ) : null}
    </figure>
  );
}
