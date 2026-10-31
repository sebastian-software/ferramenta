import { type ComponentPropsWithoutRef, type CSSProperties, useId } from "react";

import type {
  FerraActionProps,
  FerraBarsProps,
  FerraCodeProps,
  FerraFooterProps,
  FerraHeaderProps,
  FerraHeroProps,
  FerraInstrumentProps,
  FerraLogoProps,
  FerraMarkProps,
  FerraSectionProps,
  FerraTableProps,
} from "./FerraTypes.js";

import { displayName, family, WORKSHOP, WORKSHOP_REFERENCES } from "./family.js";
import { FerraTableViewport } from "./FerraTableViewport.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
type Properties = CSSProperties & Record<`--${string}`, string>;

/** One authored light scheme; the stylesheet has no global reset. */
export function FerraPage({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("ferra-page", className)} />;
}

export function FerraMark({ product, label, size = 48, className }: FerraMarkProps) {
  const style: Properties = { "--ferra-mark-size": `${size}px` };
  return (
    <span
      className={classes("ferra-mark", className)}
      data-product={product}
      style={style}
      role={label !== undefined && label.length > 0 ? "img" : undefined}
      aria-label={label}
      aria-hidden={label !== undefined && label.length > 0 ? undefined : true}
    />
  );
}

export function FerraLogo({
  product = "ferramenta",
  mark = true,
  className,
  ...props
}: FerraLogoProps) {
  return (
    <a {...props} className={classes("ferra-brand", className)}>
      {mark && <FerraMark product={product} />}
      <span>{displayName(product)}</span>
    </a>
  );
}

export function FerraInstrument({ product, label, className }: FerraInstrumentProps) {
  return (
    <span
      className={classes("ferra-instrument", className)}
      data-product={product}
      role={label !== undefined && label.length > 0 ? "img" : undefined}
      aria-label={label}
      aria-hidden={label !== undefined && label.length > 0 ? undefined : true}
    />
  );
}

export function FerraHeader({
  product = "ferramenta",
  mark,
  home,
  nav,
  navLabel = "Main",
  actions,
}: FerraHeaderProps) {
  return (
    <header className="ferra-header ferra-wrap">
      <FerraLogo product={product} href={home} mark={mark} />
      {nav !== undefined && nav !== null ? (
        <nav className="ferra-nav" aria-label={navLabel}>
          {nav}
        </nav>
      ) : null}
      {actions !== undefined && actions !== null ? (
        <div className="ferra-header-actions">{actions}</div>
      ) : null}
    </header>
  );
}

export function FerraFooter({ product = "ferramenta", home, children }: FerraFooterProps) {
  return (
    <footer className="ferra-footer ferra-wrap">
      <div className="ferra-footer-brand">
        <FerraLogo product={product} href={home} />
        <p>
          {product === "ferramenta" ? "Rust engines from one workshop." : "Part of Ferramenta."}
        </p>
      </div>
      <nav className="ferra-nav" aria-label="Footer">
        <a href={WORKSHOP.source}>GitHub</a>
        <a href={WORKSHOP.imprint}>Imprint</a>
        <a href={WORKSHOP.privacy}>Privacy</a>
        {children}
      </nav>
    </footer>
  );
}

/** Place before the footer; original outside brands belong on a flat, light ground. */
export function FerraWorkshop({
  id,
  className,
}: Pick<ComponentPropsWithoutRef<"section">, "className" | "id"> = {}) {
  return (
    <FerraSection
      id={id}
      className={classes("ferra-workshop", className)}
      surface="plain"
      label="Beyond the engines"
      intro="The people and projects behind Ferramenta."
      title="From the same workshop."
    >
      <ul className="ferra-workshop-links">
        {WORKSHOP_REFERENCES.map((reference) => (
          <li key={reference.id}>
            <a href={reference.href}>
              <span
                className="ferra-workshop-logo"
                data-brand={reference.id}
                role="img"
                aria-label={reference.name}
              />
              <p>{reference.description}</p>
              <span className="ferra-workshop-action">{reference.action}</span>
            </a>
          </li>
        ))}
      </ul>
    </FerraSection>
  );
}

export function FerraHero({ product, title, what, children, actions, art }: FerraHeroProps) {
  const id = useId();
  const tool = family.find((member) => member.name === product);
  return (
    <section className="ferra-hero ferra-wrap" aria-labelledby={id}>
      <div className="ferra-hero-copy">
        <h1 id={id}>{title ?? `${displayName(product)}.`}</h1>
        <p className="ferra-subtitle">{what ?? tool?.what ?? "A family of Rust engines."}</p>
        {children !== undefined && children !== null ? (
          <div className="ferra-lede">{children}</div>
        ) : null}
        {actions !== undefined && actions !== null ? (
          <div className="ferra-actions">{actions}</div>
        ) : null}
      </div>
      <div className="ferra-hero-art">{art ?? <FerraInstrument product={product} />}</div>
    </section>
  );
}

export function FerraSection({
  title,
  label,
  intro,
  surface = "paper",
  children,
  className,
  id,
  ...props
}: FerraSectionProps) {
  const generatedId = useId();
  const titleId = `${id ?? generatedId}-title`;
  return (
    <section
      {...props}
      id={id}
      className={classes("ferra-section", className)}
      data-surface={surface}
      aria-labelledby={titleId}
    >
      <div className="ferra-section-layout ferra-wrap">
        <aside className="ferra-margin">
          <p className="ferra-label">{label}</p>
          <div>{intro}</div>
        </aside>
        <div className="ferra-story">
          <h2 id={titleId}>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export function FerraColumns({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("ferra-columns", className)} />;
}

export function FerraAction({
  variant = "primary",
  className,
  children,
  ...props
}: FerraActionProps) {
  return (
    <a {...props} className={classes("ferra-action", className)} data-variant={variant}>
      {children}
    </a>
  );
}

/** Native children preserve the consumer's column and row header relationships. */
export function FerraTable({ caption, children, className, ...props }: FerraTableProps) {
  const id = useId();
  return (
    <FerraTableViewport aria-labelledby={id}>
      <table {...props} className={classes("ferra-table", className)}>
        <caption id={id}>{caption}</caption>
        {children}
      </table>
    </FerraTableViewport>
  );
}

export function FerraCode({ caption, file, children }: FerraCodeProps) {
  return (
    <figure className="ferra-code">
      <figcaption>
        <span>{caption}</span>
        {file !== undefined && file.length > 0 && <span className="ferra-code-file">{file}</span>}
      </figcaption>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

/** A reading surface for the actual output of a worked example. */
export function FerraSpecimen({ caption, children }: FerraTableProps) {
  return (
    <figure className="ferra-specimen">
      <figcaption>{caption}</figcaption>
      <div className="ferra-specimen-output">{children}</div>
    </figure>
  );
}

export function FerraBars({ caption, items, children }: FerraBarsProps) {
  if (items.some((item) => !Number.isFinite(item.value) || item.value < 0))
    throw new RangeError("FerraBars requires finite, nonnegative values.");
  const max = Math.max(0, ...items.map((item) => item.value));
  return (
    <figure className="ferra-bars">
      <figcaption>{caption}</figcaption>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-highlight={item.highlight === true ? true : undefined}>
            <span className="ferra-bar-label">{item.label}</span>
            <span className="ferra-bar-value">{item.displayValue}</span>
            <span className="ferra-bar-track" aria-hidden="true">
              <span style={{ width: `${max === 0 ? 0 : (item.value / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      {children !== undefined && children !== null ? (
        <div className="ferra-measure-note">{children}</div>
      ) : null}
    </figure>
  );
}
