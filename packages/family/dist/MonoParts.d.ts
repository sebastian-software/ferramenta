import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { Identity } from "./identity.js";
/** The info glyph of a folded note's toggle, from Ardo's icon set. */
export declare function MonoInfoIcon(): import("react").JSX.Element;
export declare function MonoEngraving({ seed }: {
    seed: number;
}): import("react").JSX.Element;
export type MonoActionProps = {
    href: string;
    /** The one primary action per group wears the rust accent. */
    primary?: boolean;
    /**
     * Another spelling of `primary`, kept for pages written against the former
     * Ferra entry. An action without either is secondary.
     */
    variant?: "primary" | "secondary";
    /** A short command or destination under the label. */
    detail?: ReactNode;
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "children" | "href">;
export declare function MonoAction({ href, primary, variant, detail, children, className, ...props }: MonoActionProps): import("react").JSX.Element;
export type MonoFact = {
    /** The figure; wrap the engine's own part in <em> to set it in oxide. */
    value: ReactNode;
    label: ReactNode;
};
export type MonoOpeningProps = {
    product: Identity;
    /** What the instrument shows, for readers who cannot see it. */
    instrumentLabel: string;
    kicker: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    standfirst: ReactNode;
    actions: ReactNode;
    facts?: MonoFact[];
};
/** The instrument as a centered plate, the name and the first actions. */
export declare function MonoOpening({ product, instrumentLabel, kicker, title, subtitle, standfirst, actions, facts, }: MonoOpeningProps): import("react").JSX.Element;
export type MonoSectionProps = {
    id?: string;
    title: ReactNode;
    standfirst?: ReactNode;
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "title">;
/** A chapter on the reading axis: heading, standfirst, then its passages. */
export declare function MonoSection({ id, title, standfirst, children, className, ...props }: MonoSectionProps): import("react").JSX.Element;
export type MonoNoteProps = {
    side?: "left" | "right";
    /** The term the note explains. */
    term?: ReactNode;
    /** A figure set large above the note. */
    figure?: ReactNode;
    children: ReactNode;
};
export type MonoPassageProps = {
    /** A margin note beside the passage; it moves into the text on narrow screens. */
    note?: MonoNoteProps;
    children: ReactNode;
};
/**
 * Reading text on the axis, with an optional note in the margin beside it.
 * Below 1181px there is no margin: a figure note becomes one quiet line under
 * the text, and a term note folds behind a small toggle so the reading text
 * stays together; the toggle shows an info icon and the term.
 */
export declare function MonoPassage({ note, children }: MonoPassageProps): import("react").JSX.Element;
/**
 * A lead-in once set the first words of a passage in bold small capitals. It
 * now renders them as plain text and stays only so older pages still build;
 * new pages write the sentence without it.
 */
export declare function MonoLeadIn({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function MonoColophon({ className, ...props }: ComponentPropsWithoutRef<"p">): import("react").JSX.Element;
export type MonoClosingProps = {
    /** An anchor for links into the closing. */
    id?: string;
    title: ReactNode;
    standfirst: ReactNode;
    actions: ReactNode;
    links?: ReactNode;
    /** Anything after the links, such as the workshop's logos. */
    children?: ReactNode;
};
export declare function MonoClosing({ id: anchor, title, standfirst, actions, links, children, }: MonoClosingProps): import("react").JSX.Element;
