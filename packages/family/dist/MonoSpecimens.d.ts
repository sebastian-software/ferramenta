import type { ComponentPropsWithoutRef, ReactNode } from "react";
/** Breaks out of the reading column to the wide measure. */
export declare function MonoWide({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
/** Two facing pages of real output, with a gutter between them. */
export declare function MonoFacing({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export type MonoSheetProps = {
    label: ReactNode;
    /** A file name or API call, set in the monospace face. */
    meta?: ReactNode;
} & ComponentPropsWithoutRef<"div">;
export declare function MonoSheet({ label, meta, className, children, ...props }: MonoSheetProps): import("react").JSX.Element;
export declare function MonoCaption({ className, ...props }: ComponentPropsWithoutRef<"p">): import("react").JSX.Element;
export declare function MonoCredit({ className, ...props }: ComponentPropsWithoutRef<"p">): import("react").JSX.Element;
export type MonoTerm = {
    term: ReactNode;
    description: ReactNode;
};
export type MonoTermsProps = {
    items: MonoTerm[];
    columns?: 2 | 3 | 4;
    /** Terms in the reading face instead of code names. */
    prose?: boolean;
    className?: string;
};
/** Short terms with a line each: modules, steps, scope. */
export declare function MonoTerms({ items, columns, prose, className }: MonoTermsProps): import("react").JSX.Element;
export type MonoProof = {
    label: ReactNode;
    value: ReactNode;
};
/** Passed checks, each with its count, joined by a dotted leader. */
export declare function MonoProofs({ items, className }: {
    items: MonoProof[];
    className?: string;
}): import("react").JSX.Element;
export type MonoCardsProps = {
    /** three: equal thirds; two: halves; pair: 5 to 6; lead: 7 to 4. */
    layout?: "lead" | "pair" | "three" | "two";
} & ComponentPropsWithoutRef<"div">;
export declare function MonoCards({ layout, className, ...props }: MonoCardsProps): import("react").JSX.Element;
export type MonoCardProps = {
    title: ReactNode;
    /** The API or file the card shows, set in the monospace face. */
    api?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "title">;
export declare function MonoCard({ title, api, className, children, ...props }: MonoCardProps): import("react").JSX.Element;
export declare function MonoVerdict({ className, ...props }: ComponentPropsWithoutRef<"p">): import("react").JSX.Element;
