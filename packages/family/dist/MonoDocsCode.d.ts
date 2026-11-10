import type { ComponentPropsWithoutRef, ReactNode } from "react";
export type MonoCodeProps = {
    caption: string;
    file?: string;
    children: ReactNode;
};
/** Source on a light sheet, its caption and file name in the sheet's head. */
export declare function MonoCode({ caption, file, children }: MonoCodeProps): import("react").JSX.Element;
type RenderedContent = {
    html: string;
    children?: never;
} | {
    html?: never;
    children: ReactNode;
};
export type MonoRenderedCodeProps = {
    caption: ReactNode;
} & Omit<ComponentPropsWithoutRef<"figure">, "children"> & RenderedContent;
/** Trusted build-time highlighter output in its own colors. Never pass visitor-supplied HTML. */
export declare function MonoRenderedCode({ caption, html, children, className, ...props }: MonoRenderedCodeProps): import("react").JSX.Element;
/** Two code sheets side by side, such as input and output; they stack on narrow screens. */
export declare function MonoCodePair({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
type DiagramProps = {
    caption: ReactNode;
    label: string;
    /** Trusted SVG from a build-time renderer. Never pass visitor-supplied markup. */
    svg: string;
} & Omit<ComponentPropsWithoutRef<"figure">, "children">;
/** A responsive, selectable SVG on a light sheet, in a named keyboard-scrollable viewport. */
export declare function MonoDiagram({ caption, label, svg, className, ...props }: DiagramProps): import("react").JSX.Element;
export {};
