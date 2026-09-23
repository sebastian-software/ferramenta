import type { ReactNode } from "react";

export type CodePanelProps = {
  /** The file name or command the code belongs to, in a mono caption. */
  caption: ReactNode;
  /**
   * The code, whitespace preserved. Color it with spans of the classes `kw`
   * (keyword), `ty` (type, path), `fn` (function), `str` (string), `mc`
   * (macro) and `cm` (comment); the colors are the `--code-*` tokens.
   */
  children: ReactNode;
};

/**
 * A code example on iron under a rust top rule. Iron is dark in both themes,
 * so one set of syntax colors reads everywhere. It scrolls sideways in its own
 * box, never the page, and takes keyboard focus so that scroll is reachable.
 */
export function CodePanel({ caption, children }: CodePanelProps) {
  return (
    <figure className="fam-code">
      <figcaption>{caption}</figcaption>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
