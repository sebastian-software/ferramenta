import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

/** A product's continuous reading flow, without the family catalog's contents rail. */
export function FerraProductPage({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={["ferra-product-page ferra-wrap", className].filter(Boolean).join(" ")}
    />
  );
}

export type FerraProductLeadProps = {
  title: ReactNode;
  introduction: ReactNode;
  art: ReactNode;
  /** Use H2 when embedding a specimen inside a page with its own H1. */
  headingLevel?: 1 | 2;
  byline?: ReactNode;
  meta?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "title">;

/** An editorial cover: instrument, purpose, introduction, entry points and byline. */
export function FerraProductLead({
  title,
  introduction,
  art,
  headingLevel = 1,
  byline,
  meta,
  children,
  className,
  ...props
}: FerraProductLeadProps) {
  const generatedId = useId();
  const headingId = props.id === undefined ? generatedId : `${props.id}-title`;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section
      {...props}
      className={["ferra-product-lead", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div className="ferra-product-lead-body">
        <div className="ferra-product-lead-art">{art}</div>
        <header className="ferra-product-lead-heading">
          <Heading id={headingId}>{title}</Heading>
          <p>{introduction}</p>
        </header>
        <div className="ferra-product-lead-copy">
          {children}
          {byline !== undefined && <p className="ferra-product-byline">{byline}</p>}
        </div>
      </div>
      {meta !== undefined && <footer className="ferra-engine-meta">{meta}</footer>}
    </section>
  );
}
