import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type FerraDocsLayoutProps = {
  hero: ReactNode;
  /** Supply a named navigation landmark; the host owns destinations and current state. */
  navigation?: ReactNode;
  /** Supply a named outline landmark, for example ArdoTOC with source="dom". */
  outline?: ReactNode;
} & ComponentPropsWithoutRef<"article">;

/** Reading-page composition. The host retains the main landmark and routing state. */
export function FerraDocsLayout({
  hero,
  navigation,
  outline,
  children,
  className,
  ...props
}: FerraDocsLayoutProps) {
  return (
    <article {...props} className={["ferra-docs", className].filter(Boolean).join(" ")}>
      <div className="ferra-docs-header ferra-wrap">
        <div className="ferra-docs-navigation">{navigation}</div>
        <div className="ferra-docs-hero">{hero}</div>
        <div className="ferra-docs-outline">{outline}</div>
      </div>
      {children}
    </article>
  );
}
