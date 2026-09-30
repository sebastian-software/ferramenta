import { type ReactNode, useId } from "react";

import { WORKSHOP } from "./family.js";
import { Icon } from "./Icon.js";
import { Mark } from "./Mark.js";
import { HangingTag, type PlateFact, PlateLight, Rivets } from "./Plate.js";

/*
 * The page patterns of a family home page, styled by `landing.css`. Each one
 * renders a full-bleed band with the chrome's `.wrap` inside, so a page is
 * these components stacked inside one `.fam-page` element.
 */

export type ProjectHeroProps = {
  /**
   * The page's `h1`: the project's name, or on the family site the headline.
   * An `<em>` inside turns rust.
   */
  title: ReactNode;
  /**
   * What the thing is, in one plain sentence, directly under the name: "A
   * regex engine in memory-safe Rust." A visitor has to understand that before
   * where it comes from, so this line outranks everything below it.
   */
  what?: ReactNode;
  /** The paragraph under it: what it does, then what it continues or builds on. */
  lede?: ReactNode;
  /** The calls to action, usually a `fam-btn-primary` and a `fam-btn-ghost` link. */
  actions?: ReactNode;
  /** The install command, in a `<code>`, set on a dark inlay beside the actions. */
  install?: ReactNode;
  /**
   * A family member whose rendered icon stands on the plate beside the copy,
   * e.g. "ferroni" (or "ferramenta"). Ignored when `aside` is set.
   */
  icon?: string;
  /** Replaces the icon. */
  aside?: ReactNode;
  /**
   * The measured facts, hung below the plate on a small tag: what it succeeds,
   * what it is checked against, its release. They come second, so
   * they are not on the plate.
   */
  facts?: PlateFact[];
};

/** The copy on the hero plate: the name, what it is, the lede, and the action row. */
function HeroCopy({
  actions,
  install,
  lede,
  title,
  titleId,
  what,
}: {
  titleId: string;
} & Pick<ProjectHeroProps, "actions" | "install" | "lede" | "title" | "what">) {
  const hasActions = actions !== undefined || install !== undefined;
  return (
    <div className="fam-hero-copy">
      <h1 className="fam-title" id={titleId}>
        {title}
      </h1>
      {what !== undefined && <p className="fam-what">{what}</p>}
      {lede !== undefined && <p className="fam-lede">{lede}</p>}
      {hasActions && (
        <div className="fam-actions">
          {actions}
          {install !== undefined && <p className="fam-install">{install}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * The first viewport: one steel plate on the oak bench. The plate carries the
 * name, what the thing is, and the action; the facts hang below it.
 */
export function ProjectHero({ aside, facts, icon, ...copy }: ProjectHeroProps) {
  const titleId = useId();
  let side = aside;
  if (side === undefined && icon !== undefined) side = <Icon name={icon} form="hero" />;

  return (
    <section className="fam-hero" aria-labelledby={titleId}>
      <PlateLight />
      <div className="wrap">
        <div className="fam-plate fam-hero-plate">
          <Rivets />
          <HeroCopy {...copy} titleId={titleId} />
          {side !== undefined && <div className="fam-hero-side">{side}</div>}
        </div>
        {facts !== undefined && facts.length > 0 && <HangingTag facts={facts} />}
      </div>
    </section>
  );
}

export type SectionProps = {
  /** The anchor a link can jump to, e.g. `engines` for `#engines`. */
  id?: string;
  /** The display `h2`. */
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
  /** `"dim"` sets the section on the darker of the two light grounds, to part it from its neighbors. */
  tone?: "dim" | "floor";
  /** Extra classes on the `<section>`. */
  className?: string;
  children?: ReactNode;
};

/** A section on the light ground: display heading, intro, content. */
export function Section({
  children,
  className,
  id,
  intro,
  layout = "stack",
  note,
  title,
  tone = "floor",
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
      data-tone={tone === "dim" ? "dim" : undefined}
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

export type Principle = { heading: string; text: ReactNode };

/** Principles side by side, each under a heavy rule: what a project stands on. */
export function Principles({ items }: { items: Principle[] }) {
  return (
    <ul className="fam-principles" data-count={items.length}>
      {items.map((item) => (
        <li key={item.heading}>
          <h3>{item.heading}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** The old name of `Principle`; an iron band's rows are principles on the dark ground. */
export type IronBandRow = Principle;

export type IronBandProps = {
  id?: string;
  /** The band's `h2`. */
  title: ReactNode;
  intro?: ReactNode;
  /** Principles side by side, each under a glowing rule. */
  rows?: IronBandRow[];
  children?: ReactNode;
};

/**
 * The full-bleed dark band between the light sections, in dark oak: a page's
 * one or two deliberately dark passages. Everything inside takes the on-iron
 * colors (`.on-iron`).
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
        {rows !== undefined && rows.length > 0 && <Principles items={rows} />}
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
  /** The calls to action, directly under the copy they belong to. */
  actions?: ReactNode;
  /**
   * A list beside the copy: an index, a set of entry points. Start-aligned and
   * hung from the heading, like the copy.
   */
  aside?: ReactNode;
  /** A mono link line under the actions: registry pages, API docs, the license. */
  links?: ReactNode;
};

/**
 * The flat return to the one action the page is for — no plate, no new
 * material. The copy, its action right under it, then the link line.
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
            {actions !== undefined && <div className="fam-actions">{actions}</div>}
            {links !== undefined && <p className="fam-links">{links}</p>}
          </div>
          {aside !== undefined && <div className="fam-closing-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_OFFERS = [
  "Integration into your toolchain",
  "Support with a named contact",
  "Long-term maintenance",
];

export type WorkWithUsProps = {
  id?: string;
  title?: ReactNode;
  /** The copy under the heading. Defaults to the workshop's one-sentence offer. */
  children?: ReactNode;
  /** What can be hired, as a short ruled list. */
  offers?: string[];
  /** The one action's text. It always leads to the workshop's consulting site. */
  action?: ReactNode;
};

/**
 * The rust band a family page closes on: the people who build the engines can
 * be hired. One action, to the workshop's consulting site; no form here.
 */
export function WorkWithUs({
  action = "Talk to Sebastian Consulting",
  children,
  id = "work",
  offers = DEFAULT_OFFERS,
  title = "Need one of these in your stack?",
}: WorkWithUsProps = {}) {
  const titleId = useId();

  return (
    <section className="fam-work" id={id} aria-labelledby={titleId}>
      <div className="wrap fam-work-grid">
        <div>
          <h2 className="fam-heading" id={titleId}>
            {title}
          </h2>
          {children ?? (
            <p>
              The people who build the engines also integrate them, support them, and maintain them
              for the long run.
            </p>
          )}
        </div>
        <div>
          <ul className="fam-offers">
            {offers.map((offer) => (
              <li key={offer}>{offer}</li>
            ))}
          </ul>
          <a className="fam-btn fam-btn-steel" href={WORKSHOP.consulting}>
            {action} <Mark name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
