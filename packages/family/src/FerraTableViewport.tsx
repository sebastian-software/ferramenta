import { type ComponentPropsWithoutRef, useRef } from "react";

import { useHorizontalOverflow } from "./ReadingSupport.js";

/** Keep native table geometry and expose overflow without stretching the page. */
export function FerraTableViewport({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  const regionRef = useRef<HTMLDivElement>(null);
  const overflows = useHorizontalOverflow(regionRef);
  return (
    <div className={["ferra-table-frame", className].filter(Boolean).join(" ")}>
      <p className="ferra-table-hint" hidden={!overflows}>
        Scroll sideways for more columns.
      </p>
      <div {...props} className="ferra-table-region" role="region" tabIndex={0} ref={regionRef}>
        {children}
      </div>
    </div>
  );
}

/** MDX table slot: prose may wrap, but comparison columns must retain readable words. */
export function FerraReadingTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <FerraTableViewport
      className="ferra-reading-table"
      aria-label={props["aria-label"] ?? "Data table"}
    >
      <table {...props} />
    </FerraTableViewport>
  );
}
