import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { useId } from "react";

import { protectRenderedHtml } from "./ReadingSupport.js";

/*
 * Code on a Monografie documentation page: source, highlighter output and
 * diagrams on light sheets.
 * Styled by `monografie-docs.css`.
 */

const classes = (base: string, extra?: string) =>
  extra === undefined || extra.length === 0 ? base : `${base} ${extra}`;

export type MonoCodeProps = {
  caption: string;
  file?: string;
  children: ReactNode;
};

/** Source on a light sheet, its caption and file name in the sheet's head. */
export function MonoCode({ caption, file, children }: MonoCodeProps) {
  return (
    <figure className="mono-code">
      <figcaption>
        <span>{caption}</span>
        {file !== undefined && file.length > 0 && <span className="mono-code-file">{file}</span>}
      </figcaption>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

type RenderedContent = { html: string; children?: never } | { html?: never; children: ReactNode };
export type MonoRenderedCodeProps = { caption: ReactNode } & Omit<
  ComponentPropsWithoutRef<"figure">,
  "children"
> &
  RenderedContent;

/** Trusted build-time highlighter output in its own colors. Never pass visitor-supplied HTML. */
export function MonoRenderedCode({
  caption,
  html,
  children,
  className,
  ...props
}: MonoRenderedCodeProps) {
  const output = html === undefined ? undefined : protectRenderedHtml(html);
  return (
    <figure {...props} className={classes("mono-rendered-code", className)}>
      <figcaption>{caption}</figcaption>
      {output === undefined ? (
        <div className="mono-rendered-code-content">{children}</div>
      ) : (
        // oxlint-disable-next-line react/no-danger -- The caller supplies verified build-time renderer output.
        <div className="mono-rendered-code-content" dangerouslySetInnerHTML={{ __html: output }} />
      )}
    </figure>
  );
}

/** Two code sheets side by side, such as input and output; they stack on narrow screens. */
export function MonoCodePair({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("mono-code-pair", className)} />;
}

type DiagramProps = {
  caption: ReactNode;
  label: string;
  /** Trusted SVG from a build-time renderer. Never pass visitor-supplied markup. */
  svg: string;
} & Omit<ComponentPropsWithoutRef<"figure">, "children">;

/** A responsive, selectable SVG on a light sheet, in a named keyboard-scrollable viewport. */
export function MonoDiagram({ caption, label, svg, className, ...props }: DiagramProps) {
  const id = useId();
  return (
    <figure {...props} className={classes("mono-diagram", className)}>
      <figcaption id={id}>{caption}</figcaption>
      <div className="mono-diagram-viewport" role="region" aria-labelledby={id} tabIndex={0}>
        {/* oxlint-disable-next-line react/no-danger -- The caller supplies trusted build-time SVG. */}
        <div
          className="mono-diagram-output"
          role="img"
          aria-label={label}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </figure>
  );
}
