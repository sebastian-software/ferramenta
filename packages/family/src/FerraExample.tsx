import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

import { Mark } from "./Mark.js";

type ExampleProps = {
  title: ReactNode;
  introduction?: ReactNode;
  source: string;
  controls: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

/** A controlled example; callers own the state and rendered result. */
export function FerraExample({
  title,
  introduction,
  source,
  controls,
  footer,
  children,
}: ExampleProps) {
  const id = useId();
  return (
    <section className="ferra-example" aria-labelledby={id}>
      <header>
        <h3 id={id}>{title}</h3>
        {introduction !== undefined && <p>{introduction}</p>}
      </header>
      <div className="ferra-example-grid">
        <div className="ferra-example-controls">{controls}</div>
        <div className="ferra-example-preview">
          <p className="ferra-example-label">Source</p>
          <pre>
            <code>{source}</code>
          </pre>
          <p className="ferra-example-label">Result</p>
          <div className="ferra-example-result">{children}</div>
        </div>
      </div>
      {footer !== undefined && <div className="ferra-example-footer">{footer}</div>}
    </section>
  );
}

type ToggleProps = { pressed: boolean; label: string; description: ReactNode } & Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
>;

export function FerraToggle({ pressed, label, description, ...props }: ToggleProps) {
  return (
    <button {...props} className="ferra-toggle" type="button" aria-pressed={pressed}>
      <span>
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <span className="ferra-toggle-state" aria-hidden="true">
        <Mark name="check" size={18} />
      </span>
    </button>
  );
}
