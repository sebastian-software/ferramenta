import { type ElementType, type ReactNode, useEffect } from "react";

/*
 * The plate: the family's one prop. A sheet of brushed steel, riveted at its
 * corners, that says what a thing is. Text on it is dark and solid; small
 * measured facts never sit on the steel itself but on a dark inlay or on a tag
 * hanging below it. Styled by `landing.css`.
 */

const corners = ["tl", "tr", "br", "bl"] as const;

/** Four rivets, one per corner of the plate they hold. */
export function Rivets() {
  return (
    <>
      {corners.map((corner) => (
        <i key={corner} className="fam-rivet" data-corner={corner} aria-hidden="true" />
      ))}
    </>
  );
}

export type PlateProps = {
  /** The element to render. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  /** Rivets at the corners. On by default; off for a plate too small to hold them. */
  rivets?: boolean;
  children?: ReactNode;
};

/** A riveted steel plate around its children. */
export function Plate({ as = "div", children, className, rivets = true }: PlateProps) {
  const Root: ElementType = as;
  return (
    <Root className={className === undefined ? "fam-plate" : `fam-plate ${className}`}>
      {rivets && <Rivets />}
      {children}
    </Root>
  );
}

export type PlateFact = {
  /** What the value is: "Succeeds", "Checked against", "Release". Also the key, so keep it unique. */
  label: string;
  value: ReactNode;
};

/**
 * The measured facts of whatever the plate above it names, on a small tag
 * hanging from that plate by two links. They come second: the plate says what
 * the thing is, the tag says what it is checked against.
 */
export function HangingTag({ facts }: { facts: PlateFact[] }) {
  return (
    <div className="fam-hanger">
      <i className="fam-link" data-side="left" aria-hidden="true" />
      <i className="fam-link" data-side="right" aria-hidden="true" />
      <dl className="fam-plate fam-tag">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

let lights = 0;

function followPointer(event: PointerEvent) {
  const across = event.clientX / globalThis.innerWidth;
  document.documentElement.style.setProperty("--fam-sheen", `${(120 - across * 140).toFixed(1)}%`);
}

/** Starts following the pointer for one more light; returns how to stop. */
function switchOn() {
  if (lights === 0) globalThis.addEventListener("pointermove", followPointer, { passive: true });
  lights += 1;
  return () => {
    lights -= 1;
    if (lights === 0) globalThis.removeEventListener("pointermove", followPointer);
  };
}

/** Nothing to stop: the light never moved. */
function stayStill() {
  // A visitor who asked for reduced motion keeps the reflection where it is.
}

/**
 * One light for every plate on the page: the reflection on the steel follows
 * the pointer. Render it once per page; the hero does. It draws nothing, and
 * does nothing for a visitor who asked for reduced motion.
 */
export function PlateLight() {
  useEffect(() => {
    const still = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return still ? stayStill : switchOn();
  }, []);
  return null;
}
