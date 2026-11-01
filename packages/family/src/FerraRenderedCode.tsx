import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Content = { html: string; children?: never } | { html?: never; children: ReactNode };
export type FerraRenderedCodeProps = { caption: ReactNode } & Content &
  Omit<ComponentPropsWithoutRef<"figure">, "children">;

function protectBackground(declaration: string) {
  return declaration.includes("!important") ? declaration : `${declaration} !important`;
}
function protectStyle(_: string, style: string) {
  return `style="${style.replaceAll(/background(?:-color)?:[^;]+/g, protectBackground)}"`;
}

/** Trusted build-time highlighter output. Never pass visitor-supplied HTML. */
export function FerraRenderedCode({
  caption,
  html,
  children,
  className,
  ...props
}: FerraRenderedCodeProps) {
  const output = html?.replaceAll(/<pre\b[^>]*>/g, (tag) => {
    const focusable = /\btabindex=/i.test(tag) ? tag : tag.replace("<pre", '<pre tabindex="0"');
    // Ardo resets renderer backgrounds with !important. Keep the renderer's own
    // background and its matching foreground palette, including CSS variables.
    return focusable.replace(/style="([^"]*)"/, protectStyle);
  });
  return (
    <figure {...props} className={["ferra-rendered-code", className].filter(Boolean).join(" ")}>
      <figcaption>{caption}</figcaption>
      {output === undefined ? (
        <div className="ferra-rendered-code-content">{children}</div>
      ) : (
        // oxlint-disable-next-line react/no-danger -- The caller supplies verified build-time renderer output.
        <div className="ferra-rendered-code-content" dangerouslySetInnerHTML={{ __html: output }} />
      )}
    </figure>
  );
}

export function FerraCodePair({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={["ferra-code-pair", className].filter(Boolean).join(" ")} />;
}
