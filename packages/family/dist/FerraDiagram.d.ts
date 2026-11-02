import { type ComponentPropsWithoutRef, type ReactNode } from "react";
type DiagramProps = {
    caption: ReactNode;
    label: string;
    /** Trusted SVG from a build-time renderer. Never pass visitor-supplied markup. */
    svg: string;
} & Omit<ComponentPropsWithoutRef<"figure">, "children">;
/** A responsive, selectable SVG preview with a named keyboard-scrollable viewport. */
export declare function FerraDiagram({ caption, label, svg, className, ...props }: DiagramProps): import("react").JSX.Element;
export {};
