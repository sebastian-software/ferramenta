import { type ReactNode } from "react";
export type ProjectHeroProps = {
    /** The poster headline, rendered as the page's `h1`. An `<em>` inside turns rust. */
    title: ReactNode;
    /** The paragraph under the headline: what the project is and what it succeeds. */
    lede?: ReactNode;
    /** The calls to action, usually a `fam-btn-primary` and a `fam-btn-ghost` link. */
    actions?: ReactNode;
    /** A mono line under the actions — the install command in a `<code>`, the live version. */
    install?: ReactNode;
    /**
     * A family member whose mark hangs large beside the headline, on a plate.
     * Ignored when `aside` is set.
     */
    mark?: string;
    /** Replaces the plate — the family site puts its pegboard here. */
    aside?: ReactNode;
};
/** The first viewport: poster headline left, the project's plate right, ember glow on the floor. */
export declare function ProjectHero({ actions, aside, install, lede, mark, title }: ProjectHeroProps): import("react").JSX.Element;
export type SectionProps = {
    /** The anchor a link can jump to, e.g. `pipeline` for `#pipeline`. */
    id?: string;
    /** The ruled `h2`. */
    title: ReactNode;
    /** The paragraph under the heading. */
    intro?: ReactNode;
    /** A smaller paragraph after the intro: provenance, how and when a figure was measured. */
    note?: ReactNode;
    /**
     * `"split"` puts heading, intro and note in a column beside the content —
     * the evidence layout. Stacks below 64rem.
     */
    layout?: "split" | "stack";
    /** Extra classes on the `<section>`. */
    className?: string;
    children?: ReactNode;
};
/** An open-ledger section on the shop floor: ruled display heading, intro, content. */
export declare function Section({ children, className, id, intro, layout, note, title, }: SectionProps): import("react").JSX.Element;
export type IronBandRow = {
    heading: string;
    text: ReactNode;
};
export type IronBandProps = {
    id?: string;
    /** The band's `h2`, unruled: the rust top edge is its rule. */
    title: ReactNode;
    intro?: ReactNode;
    /** Principles as hairline rows: ember heading left, prose right. */
    rows?: IronBandRow[];
    children?: ReactNode;
};
/**
 * The full-bleed dark band between the shop-floor sections, for what the
 * project stands on. Marks inside it take the iron duotone set (`.on-iron`).
 */
export declare function IronBand({ children, id, intro, rows, title }: IronBandProps): import("react").JSX.Element;
export type ClosingActionProps = {
    id?: string;
    title: ReactNode;
    /** The copy beside the actions: one or two paragraphs, as elements. */
    children?: ReactNode;
    /** The calls to action, right-aligned beside the copy. */
    actions?: ReactNode;
    /**
     * A list beside the copy instead of (or after) the actions: an index, a set
     * of entry points. Start-aligned and hung from the heading, like the copy.
     */
    aside?: ReactNode;
    /** A mono link line under the copy: registry pages, API docs, the license. */
    links?: ReactNode;
};
/**
 * The flat, ruled return to the one action the page is for — no card, no new
 * material. Copy left, actions right; stacked below 54rem.
 */
export declare function ClosingAction({ actions, aside, children, id, links, title }: ClosingActionProps): import("react").JSX.Element;
