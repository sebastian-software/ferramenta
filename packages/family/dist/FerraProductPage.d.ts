import { type ComponentPropsWithoutRef, type ReactNode } from "react";
/** A product's continuous reading flow, without the family catalog's contents rail. */
export declare function FerraProductPage({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export type FerraProductLeadProps = {
    title: ReactNode;
    introduction: ReactNode;
    art: ReactNode;
    /** Use H2 when embedding a specimen inside a page with its own H1. */
    headingLevel?: 1 | 2;
    byline?: ReactNode;
    meta?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "title">;
/** An editorial cover: instrument, purpose, introduction, entry points and byline. */
export declare function FerraProductLead({ title, introduction, art, headingLevel, byline, meta, children, className, ...props }: FerraProductLeadProps): import("react").JSX.Element;
