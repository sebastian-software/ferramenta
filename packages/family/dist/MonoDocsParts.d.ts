import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { MeasuredProps } from "./comparison-types.js";
/** Links between variants of one page, such as runtimes; the current one carries `aria-current`. */
export declare function MonoTabs({ className, ...props }: ComponentPropsWithoutRef<"nav">): import("react").JSX.Element;
/** Related destinations on light sheets; each child is an `<article>` with a heading, a line and a link. */
export declare function MonoChoices({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
/** One picture, centered and never wider than the column. */
export declare function MonoMedia({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
/** Short headed paragraphs side by side, each under a hairline. */
export declare function MonoFeatureGrid({ items, }: {
    items: ReadonlyArray<{
        heading: string;
        text: ReactNode;
    }>;
}): import("react").JSX.Element;
/** Two columns that stack on narrow screens. */
export declare function MonoColumns({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export type MonoArticleProps = {
    title: ReactNode;
    introduction?: ReactNode;
    art?: ReactNode;
    /** A decorative line symbol beside the article's visible heading. */
    icon?: ReactNode;
    meta?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"article">, "title">;
/** A story on a light sheet, with an optional picture first and its evidence in the footer. */
export declare function MonoArticle({ title, introduction, art, icon, meta, children, className, ...props }: MonoArticleProps): import("react").JSX.Element;
type SelectProps = {
    label: string;
    options: ReadonlyArray<{
        value: string;
        label: string;
    }>;
} & Omit<ComponentPropsWithoutRef<"select">, "children">;
/** A labeled native select; callers own its value and the content it controls. */
export declare function MonoSelect({ label, options, ...props }: SelectProps): import("react").JSX.Element;
type ExampleProps = {
    title: ReactNode;
    introduction?: ReactNode;
    source: string;
    controls?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
};
/** A worked example on facing sheets, source beside result; callers own the state and the output. */
export declare function MonoExample({ title, introduction, source, controls, footer, children, }: ExampleProps): import("react").JSX.Element;
type ToggleProps = {
    pressed: boolean;
    label: string;
    description: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;
/** An option that is on or off, with one line on what it changes. */
export declare function MonoToggle({ pressed, label, description, ...props }: ToggleProps): import("react").JSX.Element;
/** A short ordered explanation; content and processing logic belong to the host. */
export declare function MonoSteps({ caption, items, }: {
    caption: ReactNode;
    items: ReadonlyArray<{
        heading: string;
        text: ReactNode;
    }>;
}): import("react").JSX.Element;
/** Measurement conditions, source revision and reproduction beside the result. */
export declare function MonoMeasured({ on, machine, revision, more, children }: MeasuredProps): import("react").JSX.Element;
export type MonoBar = {
    id: string;
    label: ReactNode;
    value: number;
    displayValue: string;
    /** The engine's own bar: it wears the rust accent. One per chart. */
    highlight?: boolean;
};
export type MonoBarsProps = {
    caption: string;
    items: readonly MonoBar[];
    children?: ReactNode;
};
/**
 * One measure as bars in the instrument's steel, scaled to the largest value;
 * the highlighted bar is the engine's own, in rust. For a chart with a 1× line
 * and a task switch, use `MonoBarChart`.
 */
export declare function MonoBars({ caption, items, children }: MonoBarsProps): import("react").JSX.Element;
export {};
