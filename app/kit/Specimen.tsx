import type { ReactNode } from "react";

/** A chapter of the kit: a display heading on the ground, its specimens below. */
export function Chapter({
  children,
  id,
  intro,
  title,
}: {
  children: ReactNode;
  id: string;
  intro: ReactNode;
  title: string;
}) {
  return (
    <section className="kit-chapter" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{intro}</p>
      </div>
      {children}
    </section>
  );
}

/** The caption above a specimen: the component's name as code, and its one rule. */
export function Caption({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="wrap">
      <div className="kit-caption">
        <h3>{name}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

/**
 * A specimen that sits in the page's column. A full-bleed component (a band, a
 * section) follows its `Caption` directly instead.
 */
export function Specimen({
  children,
  name,
  rule,
}: {
  children: ReactNode;
  name: string;
  rule: ReactNode;
}) {
  return (
    <>
      <Caption name={name}>{rule}</Caption>
      <div className="wrap">
        <div className="kit-stage">{children}</div>
      </div>
    </>
  );
}
