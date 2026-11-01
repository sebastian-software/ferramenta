import type { ReactNode } from "react";

/** A short ordered explanation; content and processing logic belong to the host. */
export function FerraSteps({
  caption,
  items,
}: {
  caption: ReactNode;
  items: ReadonlyArray<{ heading: string; text: ReactNode }>;
}) {
  return (
    <figure className="ferra-steps">
      <figcaption>{caption}</figcaption>
      <ol>
        {items.map((item) => (
          <li key={item.heading}>
            <strong>{item.heading}</strong>
            <div>{item.text}</div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
