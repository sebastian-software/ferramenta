import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

import type { Identity } from "./identity.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

/* Five engraved hairlines between sections, one of them in oxide. The seed
   varies the lengths so neighboring rules never repeat. */
const LENGTHS = [128, 96, 120, 82, 112, 104, 130, 88, 118, 100, 124, 92, 110, 86, 116];

export function MonoEngraving({ seed }: { seed: number }) {
  return (
    <svg className="mono-engraving" viewBox="0 0 132 34" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((line) => (
        <line
          key={line}
          x1={2}
          x2={LENGTHS[(seed * 7 + line * 4) % LENGTHS.length]}
          y1={2 + line * 7}
          y2={2 + line * 7}
          className={line === seed % 5 ? "mono-oxide" : undefined}
        />
      ))}
    </svg>
  );
}

export type MonoActionProps = {
  href: string;
  /** The one primary action per group wears the rust accent. */
  primary?: boolean;
  /**
   * Another spelling of `primary`, kept for pages written against the former
   * Ferra entry. An action without either is secondary.
   */
  variant?: "primary" | "secondary";
  /** A short command or destination under the label. */
  detail?: ReactNode;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "children" | "href">;

export function MonoAction({
  href,
  primary = false,
  variant,
  detail,
  children,
  className,
  ...props
}: MonoActionProps) {
  const rust = variant === undefined ? primary : variant === "primary";
  return (
    <a
      {...props}
      className={classes("mono-action", className)}
      href={href}
      data-primary={rust ? "" : undefined}
    >
      {children}
      {detail !== undefined && <small>{detail}</small>}
    </a>
  );
}

export type MonoFact = {
  /** The figure; wrap the engine's own part in <em> to set it in oxide. */
  value: ReactNode;
  label: ReactNode;
};

export type MonoOpeningProps = {
  product: Identity;
  /** What the instrument shows, for readers who cannot see it. */
  instrumentLabel: string;
  caption?: ReactNode;
  kicker: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  standfirst: ReactNode;
  actions: ReactNode;
  facts?: MonoFact[];
};

/** The instrument as a centered plate, the name and the first actions. */
export function MonoOpening({
  product,
  instrumentLabel,
  caption,
  kicker,
  title,
  subtitle,
  standfirst,
  actions,
  facts,
}: MonoOpeningProps) {
  const id = useId();
  return (
    <section className="mono-opening" aria-labelledby={id}>
      <figure className="mono-plate">
        <span
          className="ferra-instrument"
          data-product={product}
          role="img"
          aria-label={instrumentLabel}
        />
        {caption !== undefined && <figcaption>{caption}</figcaption>}
      </figure>
      <p className="mono-kicker">{kicker}</p>
      <h1 id={id}>
        {title}
        {subtitle !== undefined && <span className="mono-second">{subtitle}</span>}
      </h1>
      <p className="mono-standfirst">{standfirst}</p>
      <div className="mono-actions">{actions}</div>
      {facts !== undefined && facts.length > 0 && (
        <ul className="mono-facts">
          {facts.map((fact, index) => (
            <li key={index}>
              <strong>{fact.value}</strong>
              {fact.label}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type MonoSectionProps = {
  id?: string;
  title: ReactNode;
  standfirst?: ReactNode;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "title">;

/** A chapter on the reading axis: heading, standfirst, then its passages. */
export function MonoSection({
  id,
  title,
  standfirst,
  children,
  className,
  ...props
}: MonoSectionProps) {
  const headingId = useId();
  return (
    <section {...props} id={id} className={className} aria-labelledby={headingId}>
      <div className="mono-axis">
        <h2 id={headingId}>{title}</h2>
        {standfirst !== undefined && <p className="mono-standfirst">{standfirst}</p>}
        {children}
      </div>
    </section>
  );
}

export type MonoNoteProps = {
  side?: "left" | "right";
  /** The term the note explains. */
  term?: ReactNode;
  /** A figure set large above the note. */
  figure?: ReactNode;
  children: ReactNode;
};

export type MonoPassageProps = {
  /** A margin note beside the passage; it moves into the text on narrow screens. */
  note?: MonoNoteProps;
  children: ReactNode;
};

/** Reading text on the axis, with an optional note in the margin beside it. */
export function MonoPassage({ note, children }: MonoPassageProps) {
  if (note === undefined) return <>{children}</>;
  return (
    <div className="mono-row">
      <aside className="mono-note" data-side={note.side ?? "left"}>
        {note.figure !== undefined && <span className="mono-note-figure">{note.figure}</span>}
        {note.term !== undefined && <b>{note.term}</b>}
        {note.children}
      </aside>
      <div className="mono-row-text">{children}</div>
    </div>
  );
}

/** A lead-in: the first words of a passage in small capitals. */
export function MonoLeadIn({ children }: { children: ReactNode }) {
  return <span className="mono-lead-in">{children}</span>;
}

export function MonoColophon({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={classes("mono-colophon", className)} />;
}

export type MonoClosingProps = {
  /** An anchor for links into the closing. */
  id?: string;
  title: ReactNode;
  standfirst: ReactNode;
  actions: ReactNode;
  links?: ReactNode;
  /** Anything after the links, such as the workshop's logos. */
  children?: ReactNode;
};

export function MonoClosing({
  id: anchor,
  title,
  standfirst,
  actions,
  links,
  children,
}: MonoClosingProps) {
  const id = useId();
  return (
    <section className="mono-closing" id={anchor} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <p className="mono-standfirst">{standfirst}</p>
      <div className="mono-actions">{actions}</div>
      {links !== undefined && <p className="mono-closing-links">{links}</p>}
      {children}
    </section>
  );
}
