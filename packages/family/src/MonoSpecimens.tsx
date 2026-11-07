import { type ComponentPropsWithoutRef, type CSSProperties, type ReactNode, useRef } from "react";

import { useScrollableCode } from "./ReadingSupport.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

/** Breaks out of the reading column to the wide measure. */
export function MonoWide({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("mono-wide", className)} />;
}

/** Two facing pages of real output, with a gutter between them. */
export function MonoFacing({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("mono-facing", className)} />;
}

export type MonoSheetProps = {
  label: ReactNode;
  /** A file name or API call, set in the monospace face. */
  meta?: ReactNode;
} & ComponentPropsWithoutRef<"div">;

export function MonoSheet({ label, meta, className, children, ...props }: MonoSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollableCode(ref, children);
  return (
    <div {...props} ref={ref} className={classes("mono-sheet", className)}>
      <div className="mono-sheet-head">
        <span>{label}</span>
        {meta !== undefined && <span>{meta}</span>}
      </div>
      {children}
    </div>
  );
}

export function MonoCaption({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={classes("mono-caption", className)} />;
}

export function MonoCredit({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={classes("mono-credit", className)} />;
}

export type MonoTerm = { term: ReactNode; description: ReactNode };

export type MonoTermsProps = {
  items: MonoTerm[];
  columns?: 2 | 3 | 4;
  /** Terms in the reading face instead of code names. */
  prose?: boolean;
  className?: string;
};

/** Short terms with a line each: modules, steps, scope. */
export function MonoTerms({ items, columns = 4, prose = false, className }: MonoTermsProps) {
  const style: CSSProperties & Record<`--${string}`, string> = {
    "--mono-terms-columns": String(columns),
  };
  return (
    <dl
      className={classes("mono-terms", className)}
      style={style}
      data-prose={prose ? "" : undefined}
    >
      {items.map((item, index) => (
        <div key={index}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

export type MonoProof = { label: ReactNode; value: ReactNode };

/** Passed checks, each with its count, joined by a dotted leader. */
export function MonoProofs({ items, className }: { items: MonoProof[]; className?: string }) {
  return (
    <ul className={classes("mono-proofs", className)}>
      {items.map((item, index) => (
        <li key={index}>
          <span>{item.label}</span>
          <span className="mono-dots" aria-hidden="true" />
          <b>{item.value}</b>
        </li>
      ))}
    </ul>
  );
}

export type MonoCardsProps = {
  /** three: equal thirds; two: halves; pair: 5 to 6; lead: 7 to 4. */
  layout?: "lead" | "pair" | "three" | "two";
} & ComponentPropsWithoutRef<"div">;

export function MonoCards({ layout = "three", className, ...props }: MonoCardsProps) {
  return (
    <div
      {...props}
      className={classes("mono-cards", className)}
      data-layout={layout === "three" ? undefined : layout}
    />
  );
}

export type MonoCardProps = {
  title: ReactNode;
  /** The API or file the card shows, set in the monospace face. */
  api?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "title">;

/** A short example under its title; code in it that scrolls sideways is reachable by keyboard. */
export function MonoCard({ title, api, className, children, ...props }: MonoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollableCode(ref, children);
  return (
    <div {...props} ref={ref} className={classes("mono-card", className)}>
      <h3>{title}</h3>
      {api !== undefined && <p className="mono-card-api">{api}</p>}
      {children}
    </div>
  );
}

export function MonoVerdict({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={classes("mono-card-verdict", className)} />;
}
