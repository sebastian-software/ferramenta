import { type ComponentPropsWithoutRef, type CSSProperties, useId } from "react";

import type {
  EditorialActionProps,
  EditorialBarsProps,
  EditorialCodeProps,
  EditorialEngineCatalogProps,
  EditorialFooterProps,
  EditorialHeaderProps,
  EditorialHeroProps,
  EditorialInstrumentProps,
  EditorialLogoProps,
  EditorialMarkProps,
  EditorialSectionProps,
  EditorialTableProps,
} from "./EditorialTypes.js";

import { type EditorialProduct, isEditorialProduct } from "./EditorialIdentity.js";
import {
  displayName,
  family,
  isEngine,
  toolHref,
  WORKSHOP,
  WORKSHOP_REFERENCES,
} from "./family.js";

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;
type Properties = CSSProperties & Record<`--${string}`, string>;

/** One authored light scheme; the stylesheet has no global reset. */
export function EditorialPage({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("fe-page", className)} />;
}

export function EditorialMark({ product, label, size = 48, className }: EditorialMarkProps) {
  const style: Properties = { "--fe-mark-size": `${size}px` };
  return (
    <span
      className={classes("fe-mark", className)}
      data-product={product}
      style={style}
      role={label !== undefined && label.length > 0 ? "img" : undefined}
      aria-label={label}
      aria-hidden={label !== undefined && label.length > 0 ? undefined : true}
    />
  );
}

export function EditorialLogo({ product = "ferramenta", className, ...props }: EditorialLogoProps) {
  return (
    <a {...props} className={classes("fe-brand", className)}>
      <EditorialMark product={product} />
      <span>{displayName(product)}</span>
    </a>
  );
}

export function EditorialInstrument({ product, label, className }: EditorialInstrumentProps) {
  return (
    <span
      className={classes("fe-instrument", className)}
      data-product={product}
      role={label !== undefined && label.length > 0 ? "img" : undefined}
      aria-label={label}
      aria-hidden={label !== undefined && label.length > 0 ? undefined : true}
    />
  );
}

export function EditorialHeader({
  product = "ferramenta",
  home,
  nav,
  navLabel = "Main",
}: EditorialHeaderProps) {
  return (
    <header className="fe-header fe-wrap">
      <EditorialLogo product={product} href={home} />
      {nav !== undefined && nav !== null ? (
        <nav className="fe-nav" aria-label={navLabel}>
          {nav}
        </nav>
      ) : null}
    </header>
  );
}

export function EditorialFooter({ product = "ferramenta", home, children }: EditorialFooterProps) {
  return (
    <footer className="fe-footer fe-wrap">
      <div className="fe-footer-brand">
        <EditorialLogo product={product} href={home} />
        <p>
          {product === "ferramenta" ? "Rust engines from one workshop." : "Part of Ferramenta."}
        </p>
      </div>
      <nav className="fe-nav" aria-label="Footer">
        <a href={WORKSHOP.source}>GitHub</a>
        <a href={WORKSHOP.imprint}>Imprint</a>
        <a href={WORKSHOP.privacy}>Privacy</a>
        {children}
      </nav>
    </footer>
  );
}

/** Place before the footer; original outside brands belong on a flat, light ground. */
export function EditorialWorkshop({
  id,
  className,
}: Pick<ComponentPropsWithoutRef<"section">, "className" | "id"> = {}) {
  return (
    <EditorialSection
      id={id}
      className={classes("fe-workshop", className)}
      surface="plain"
      label="Beyond the engines"
      intro="The people and projects behind Ferramenta."
      title="From the same workshop."
    >
      <ul className="fe-workshop-links">
        {WORKSHOP_REFERENCES.map((reference) => (
          <li key={reference.id}>
            <a href={reference.href}>
              <span
                className="fe-workshop-logo"
                data-brand={reference.id}
                role="img"
                aria-label={reference.name}
              />
              <p>{reference.description}</p>
              <span className="fe-workshop-action">{reference.action}</span>
            </a>
          </li>
        ))}
      </ul>
    </EditorialSection>
  );
}

export function EditorialHero({
  product,
  title,
  what,
  children,
  actions,
  art,
}: EditorialHeroProps) {
  const id = useId();
  const tool = family.find((member) => member.name === product);
  return (
    <section className="fe-hero fe-wrap" aria-labelledby={id}>
      <div className="fe-hero-copy">
        <h1 id={id}>{title ?? `${displayName(product)}.`}</h1>
        <p className="fe-subtitle">{what ?? tool?.what ?? "A family of Rust engines."}</p>
        {children !== undefined && children !== null ? (
          <div className="fe-lede">{children}</div>
        ) : null}
        {actions !== undefined && actions !== null ? (
          <div className="fe-actions">{actions}</div>
        ) : null}
      </div>
      <div className="fe-hero-art">{art ?? <EditorialInstrument product={product} />}</div>
    </section>
  );
}

export function EditorialSection({
  title,
  label,
  intro,
  surface = "paper",
  children,
  className,
  id,
  ...props
}: EditorialSectionProps) {
  const generatedId = useId();
  const titleId = `${id ?? generatedId}-title`;
  return (
    <section
      {...props}
      id={id}
      className={classes("fe-section", className)}
      data-surface={surface}
      aria-labelledby={titleId}
    >
      <div className="fe-editorial fe-wrap">
        <aside className="fe-margin">
          <p className="fe-label">{label}</p>
          <div>{intro}</div>
        </aside>
        <div className="fe-story">
          <h2 id={titleId}>{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export function EditorialColumns({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("fe-columns", className)} />;
}

export function EditorialAction({
  variant = "primary",
  className,
  children,
  ...props
}: EditorialActionProps) {
  return (
    <a {...props} className={classes("fe-action", className)} data-variant={variant}>
      {children}
    </a>
  );
}

/** Registry facts remain authoritative even when a preview overrides the destinations. */
export function EditorialEngineCatalog({ hrefFor = toolHref }: EditorialEngineCatalogProps) {
  return (
    <div className="fe-engine-grid">
      {family
        .filter((tool) => isEngine(tool))
        .map((tool) => {
          if (!isEditorialProduct(tool.name))
            throw new Error(`Missing editorial identity: ${tool.name}`);
          const product: EditorialProduct = tool.name;
          const name = displayName(tool);
          return (
            <article className="fe-engine" key={tool.name}>
              <div className="fe-engine-heading">
                <EditorialMark product={product} size={64} />
                <div>
                  <h3>{name}</h3>
                  <p className="fe-engine-role">{tool.what}</p>
                </div>
              </div>
              <p>{tool.does}</p>
              <p className="fe-engine-audience">{tool.audience}</p>
              <a href={hrefFor(tool)}>
                Explore {name}
                {tool.docs === undefined && <span className="fe-repo-hint"> on GitHub</span>}
              </a>
            </article>
          );
        })}
    </div>
  );
}

/** Native children preserve the consumer's column and row header relationships. */
export function EditorialTable({ caption, children }: EditorialTableProps) {
  const id = useId();
  return (
    <div className="fe-table-region" role="region" aria-labelledby={id} tabIndex={0}>
      <table className="fe-table">
        <caption id={id}>{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function EditorialCode({ caption, file, children }: EditorialCodeProps) {
  return (
    <figure className="fe-code">
      <figcaption>
        <span>{caption}</span>
        {file !== undefined && file.length > 0 && <span className="fe-code-file">{file}</span>}
      </figcaption>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

/** A reading surface for the actual output of a worked example. */
export function EditorialSpecimen({ caption, children }: EditorialTableProps) {
  return (
    <figure className="fe-specimen">
      <figcaption>{caption}</figcaption>
      <div className="fe-specimen-output">{children}</div>
    </figure>
  );
}

export function EditorialBars({ caption, items, children }: EditorialBarsProps) {
  if (items.some((item) => !Number.isFinite(item.value) || item.value < 0))
    throw new RangeError("EditorialBars requires finite, nonnegative values.");
  const max = Math.max(0, ...items.map((item) => item.value));
  return (
    <figure className="fe-bars">
      <figcaption>{caption}</figcaption>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-highlight={item.highlight === true ? true : undefined}>
            <span className="fe-bar-label">{item.label}</span>
            <span className="fe-bar-value">{item.displayValue}</span>
            <span className="fe-bar-track" aria-hidden="true">
              <span style={{ width: `${max === 0 ? 0 : (item.value / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      {children !== undefined && children !== null ? (
        <div className="fe-measure-note">{children}</div>
      ) : null}
    </figure>
  );
}
