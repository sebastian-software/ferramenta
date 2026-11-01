import type { ComponentPropsWithoutRef, ReactNode } from "react";
type Content = {
    html: string;
    children?: never;
} | {
    html?: never;
    children: ReactNode;
};
export type FerraRenderedCodeProps = {
    caption: ReactNode;
} & Content & Omit<ComponentPropsWithoutRef<"figure">, "children">;
/** Trusted build-time highlighter output. Never pass visitor-supplied HTML. */
export declare function FerraRenderedCode({ caption, html, children, className, ...props }: FerraRenderedCodeProps): import("react").JSX.Element;
export declare function FerraCodePair({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export {};
