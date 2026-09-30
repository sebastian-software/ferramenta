import { type ReactNode } from "react";
import { type PlateFact } from "./Plate.js";
export type ProjectHeroProps = {
    /**
     * The page's `h1`: the project's name, or on the family site the headline.
     * An `<em>` inside turns rust.
     */
    title: ReactNode;
    /**
     * What the thing is, in one plain sentence, directly under the name: "A
     * regex engine in memory-safe Rust." A visitor has to understand that before
     * where it comes from, so this line outranks everything below it.
     */
    what?: ReactNode;
    /** The paragraph under it: what it does, then what it continues or builds on. */
    lede?: ReactNode;
    /** The calls to action, usually a `fam-btn-primary` and a `fam-btn-ghost` link. */
    actions?: ReactNode;
    /** The install command, in a `<code>`, set on a dark inlay beside the actions. */
    install?: ReactNode;
    /**
     * A family member whose rendered icon stands on the plate beside the copy,
     * e.g. "ferroni" (or "ferramenta"). Ignored when `aside` is set.
     */
    icon?: string;
    /** Replaces the icon. */
    aside?: ReactNode;
    /**
     * The measured facts, hung below the plate on a small tag: what it succeeds,
     * what it is checked against, its rating, its release. They come second, so
     * they are not on the plate.
     */
    facts?: PlateFact[];
};
/**
 * The first viewport: one steel plate on black steel. The plate carries the
 * name, what the thing is, and the action; the facts hang below it.
 */
export declare function ProjectHero({ aside, facts, icon, ...copy }: ProjectHeroProps): import("react").JSX.Element;
export type SectionProps = {
    /** The anchor a link can jump to, e.g. `engines` for `#engines`. */
    id?: string;
    /** The display `h2`. */
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
    /** `"dim"` sets the section on the darker of the two light grounds, to part it from its neighbors. */
    tone?: "dim" | "floor";
    /** Extra classes on the `<section>`. */
    className?: string;
    children?: ReactNode;
};
/** A section on the light ground: display heading, intro, content. */
export declare function Section({ children, className, id, intro, layout, note, title, tone, }: SectionProps): import("react").JSX.Element;
export type Principle = {
    heading: string;
    text: ReactNode;
};
/** Principles side by side, each under a heavy rule: what a project stands on. */
export declare function Principles({ items }: {
    items: Principle[];
}): import("react").JSX.Element;
/** The old name of `Principle`; an iron band's rows are principles on black steel. */
export type IronBandRow = Principle;
export type IronBandProps = {
    id?: string;
    /** The band's `h2`. */
    title: ReactNode;
    intro?: ReactNode;
    /** Principles side by side, each under a glowing rule. */
    rows?: IronBandRow[];
    children?: ReactNode;
};
/**
 * The full-bleed black-steel band between the light sections: a page's one or
 * two deliberately dark passages. Everything inside takes the on-iron colors
 * (`.on-iron`).
 */
export declare function IronBand({ children, id, intro, rows, title }: IronBandProps): import("react").JSX.Element;
export type ClosingActionProps = {
    id?: string;
    title: ReactNode;
    /** The copy beside the actions: one or two paragraphs, as elements. */
    children?: ReactNode;
    /** The calls to action, directly under the copy they belong to. */
    actions?: ReactNode;
    /**
     * A list beside the copy: an index, a set of entry points. Start-aligned and
     * hung from the heading, like the copy.
     */
    aside?: ReactNode;
    /** A mono link line under the actions: registry pages, API docs, the license. */
    links?: ReactNode;
};
/**
 * The flat return to the one action the page is for — no plate, no new
 * material. The copy, its action right under it, then the link line.
 */
export declare function ClosingAction({ actions, aside, children, id, links, title }: ClosingActionProps): import("react").JSX.Element;
export type WorkWithUsProps = {
    id?: string;
    title?: ReactNode;
    /** The copy under the heading. Defaults to the workshop's one-sentence offer. */
    children?: ReactNode;
    /** What can be hired, as a short ruled list. */
    offers?: string[];
    /** The one action's text. It always leads to the workshop's consulting site. */
    action?: ReactNode;
};
/**
 * The rust band a family page closes on: the people who build the engines can
 * be hired. One action, to the workshop's consulting site; no form here.
 */
export declare function WorkWithUs({ action, children, id, offers, title, }?: WorkWithUsProps): import("react").JSX.Element;
