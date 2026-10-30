import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

import { FerraSoftCard } from "./FerraEditorial.js";

type ArticleProps = {
  title: ReactNode;
  introduction?: ReactNode;
  art?: ReactNode;
  meta?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"article">, "title">;

/** An image-first story with an attached evidence footer; the host owns its content. */
export function FerraArticle({
  title,
  introduction,
  art,
  meta,
  children,
  className,
  ...props
}: ArticleProps) {
  const headingId = useId();
  return (
    <FerraSoftCard
      tabIndex={-1}
      {...props}
      as="article"
      className={["ferra-article", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div className="ferra-article-content">
        {art !== undefined && <div className="ferra-article-art">{art}</div>}
        <header className="ferra-article-heading">
          <h2 id={headingId}>{title}</h2>
          {introduction !== undefined && <p>{introduction}</p>}
        </header>
        <div className="ferra-article-copy">{children}</div>
      </div>
      {meta !== undefined && <footer className="ferra-engine-meta">{meta}</footer>}
    </FerraSoftCard>
  );
}

export function FerraFeatureGrid({
  items,
}: {
  items: ReadonlyArray<{ heading: string; text: ReactNode }>;
}) {
  return (
    <div className="ferra-feature-grid">
      {items.map((item) => (
        <section key={item.heading}>
          <h3>{item.heading}</h3>
          <div>{item.text}</div>
        </section>
      ))}
    </div>
  );
}

export function FerraTabs({ className, ...props }: ComponentPropsWithoutRef<"nav">) {
  return <nav {...props} className={["ferra-tabs", className].filter(Boolean).join(" ")} />;
}

/** Related destinations, with the title and action supplied by the host. */
export function FerraChoices({ children }: { children: ReactNode }) {
  return <div className="ferra-choices">{children}</div>;
}

export function FerraMedia({ children }: { children: ReactNode }) {
  return <figure className="ferra-media">{children}</figure>;
}

export function FerraGuideNavigation({ className, ...props }: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav {...props} className={["ferra-guide-navigation", className].filter(Boolean).join(" ")} />
  );
}
