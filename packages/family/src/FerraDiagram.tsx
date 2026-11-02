import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

type DiagramProps = {
  caption: ReactNode;
  label: string;
  /** Trusted SVG from a build-time renderer. Never pass visitor-supplied markup. */
  svg: string;
} & Omit<ComponentPropsWithoutRef<"figure">, "children">;

/** A responsive, selectable SVG preview with a named keyboard-scrollable viewport. */
export function FerraDiagram({ caption, label, svg, className, ...props }: DiagramProps) {
  const id = useId();
  return (
    <figure {...props} className={["ferra-diagram", className].filter(Boolean).join(" ")}>
      <figcaption id={id}>{caption}</figcaption>
      <div className="ferra-diagram-viewport" role="region" aria-labelledby={id} tabIndex={0}>
        {/* oxlint-disable-next-line react/no-danger -- The caller supplies trusted build-time SVG. */}
        <div
          className="ferra-diagram-output"
          role="img"
          aria-label={label}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </figure>
  );
}
