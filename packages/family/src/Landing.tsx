import { type ReactNode, useId } from "react";

import { Mark } from "./Mark.js";

/*
 * The page patterns of a family home page, styled by `landing.css`. Each one
 * renders a full-bleed band with the chrome's `.wrap` inside, so a page is
 * these components stacked inside one `.fam-page` element.
 */

export type ProjectHeroProps = {
  /** The poster headline, rendered as the page's `h1`. An `<em>` inside turns rust. */
  title: ReactNode;
  /** The paragraph under the headline: what the project is and what it succeeds. */
  lede?: ReactNode;
  /** The calls to action, usually a `fam-btn-primary` and a `fam-btn-ghost` link. */
  actions?: ReactNode;
  /** A mono line under the actions — the install command in a `<code>`, the live version. */
  install?: ReactNode;
  /**
   * A family member whose mark hangs large beside the headline, on a plate.
   * Ignored when `aside` is set.
   */
  mark?: string;
  /** Replaces the plate — the family site puts its pegboard here. */
  aside?: ReactNode;
};

/** The first viewport: poster headline left, the project's plate right, ember glow on the floor. */
export function ProjectHero({ actions, aside, install, lede, mark, title }: ProjectHeroProps) {
  const titleId = useId();
  let side = aside;
  if (side === undefined && mark !== undefined) {
    side = (
      <span className="markplate fam-hero-plate" aria-hidden="true">
        <Mark name={mark} />
      </span>
    );
  }

  return (
    <section className="fam-hero" aria-labelledby={titleId}>
      <div className="wrap">
        <div>
          <h1 className="fam-title" id={titleId}>
            {title}
          </h1>
          {lede !== undefined && <p className="fam-lede">{lede}</p>}
          {actions !== undefined && <div className="fam-actions">{actions}</div>}
          {install !== undefined && <p className="fam-install">{install}</p>}
        </div>
        {side}
      </div>
    </section>
  );
}

export type SectionProps = {
  /** The anchor a link can jump to, e.g. `pipeline` for `#pipeline`. */
  id?: string;
  /** The ruled `h2`. */
  title: ReactNode;
  /** The paragraph under the heading. */
  intro?: ReactNode;
  /** A smaller paragraph after the intro: provenance, how and when a figure was measured. */
  note?: ReactNode;
  /**
   * `"split"` puts heading, intro and note in a column beside the content —
   * the evidence layout. Stacks below 64rem.
   */
  layout?: "split" | "stack";
  /** Extra classes on the `<section>`. */
  className?: string;
  children?: ReactNode;
};

/** An open-ledger section on the shop floor: ruled display heading, intro, content. */
export function Section({
  children,
  className,
  id,
  intro,
  layout = "stack",
  note,
  title,
}: SectionProps) {
  const titleId = useId();
  const head = (
    <>
      <h2 className="fam-heading" id={titleId}>
        {title}
      </h2>
      {intro !== undefined && <p className="fam-intro">{intro}</p>}
      {note !== undefined && <p className="fam-note">{note}</p>}
    </>
  );

  return (
    <section
      className={["fam-section", className].filter(Boolean).join(" ")}
      id={id}
      aria-labelledby={titleId}
    >
      {layout === "split" ? (
        <div className="wrap fam-split">
          <div>{head}</div>
          <div>{children}</div>
        </div>
      ) : (
        <div className="wrap">
          {head}
          {children}
        </div>
      )}
    </section>
  );
}

export type IronBandRow = { heading: string; text: ReactNode };

export type IronBandProps = {
  id?: string;
  /** The band's `h2`, unruled: the rust top edge is its rule. */
  title: ReactNode;
  intro?: ReactNode;
  /** Principles as hairline rows: ember heading left, prose right. */
  rows?: IronBandRow[];
  children?: ReactNode;
};

/**
 * The full-bleed dark band between the shop-floor sections, for what the
 * project stands on. Marks inside it take the iron duotone set (`.on-iron`).
 */
export function IronBand({ children, id, intro, rows, title }: IronBandProps) {
  const titleId = useId();

  return (
    <section className="fam-band on-iron" id={id} aria-labelledby={titleId}>
      <div className="wrap">
        <h2 className="fam-heading" id={titleId}>
          {title}
        </h2>
        {intro !== undefined && <p className="fam-intro">{intro}</p>}
        {rows !== undefined && rows.length > 0 && (
          <div className="fam-rows">
            {rows.map((row) => (
              <div key={row.heading}>
                <h3>{row.heading}</h3>
                <p>{row.text}</p>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export type ClosingActionProps = {
  id?: string;
  title: ReactNode;
  /** The copy beside the actions: one or two paragraphs, as elements. */
  children?: ReactNode;
  /** The calls to action, right-aligned beside the copy. */
  actions?: ReactNode;
  /**
   * A list beside the copy instead of (or after) the actions: an index, a set
   * of entry points. Start-aligned and hung from the heading, like the copy.
   */
  aside?: ReactNode;
  /** A mono link line under the copy: registry pages, API docs, the license. */
  links?: ReactNode;
};

/**
 * The flat, ruled return to the one action the page is for — no card, no new
 * material. Copy left, actions right; stacked below 54rem.
 */
export function ClosingAction({ actions, aside, children, id, links, title }: ClosingActionProps) {
  const titleId = useId();

  return (
    <section className="fam-section fam-closing" id={id} aria-labelledby={titleId}>
      <div className="wrap">
        <h2 className="fam-heading" id={titleId}>
          {title}
        </h2>
        <div className="fam-closing-grid">
          <div className="fam-closing-copy">
            {children}
            {links !== undefined && <p className="fam-links">{links}</p>}
          </div>
          {actions !== undefined && <div className="fam-actions">{actions}</div>}
          {aside !== undefined && <div className="fam-closing-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
