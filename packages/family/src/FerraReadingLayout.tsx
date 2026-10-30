import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type FerraReadingLayoutProps = {
  navigation?: ReactNode;
  outline?: ReactNode;
} & ComponentPropsWithoutRef<"article">;

/** A bounded reading surface between host-owned navigation and the page outline. */
export function FerraReadingLayout({
  navigation,
  outline,
  children,
  className,
  ...props
}: FerraReadingLayoutProps) {
  return (
    <article
      {...props}
      className={["ferra-reading ferra-wrap", className].filter(Boolean).join(" ")}
    >
      <div className="ferra-reading-navigation">{navigation}</div>
      <div className="ferra-reading-surface">
        <div className="ferra-prose">{children}</div>
      </div>
      <div className="ferra-reading-outline">{outline}</div>
    </article>
  );
}
