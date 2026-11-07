import { type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";
import type { FerraProduct } from "./FerraIdentity.js";
/** The page ground: one authored light scheme, scoped to its wrapper. */
export declare function MonoPage({ className, ...props }: ComponentPropsWithoutRef<"div">): import("react").JSX.Element;
export type MonoHeaderProps = {
    product: FerraProduct;
    /** Where the product name leads, usually the homepage. */
    home: string;
    /** The page's main links, each a keyed element; they fold into a menu on narrow screens. */
    links: ReactElement[];
    navLabel?: string;
    /** The current release, shown as an inset tag. */
    release?: string;
    /** Controls that stay visible at every width, such as search. */
    actions?: ReactNode;
    /** Where the family link leads; ferramenta.dev by default. */
    familyHref?: string;
};
/** The steel navigation bar. Its links fold into a menu below 961px. */
export declare function MonoHeader({ product, home, links, navLabel, release, actions, familyHref, }: MonoHeaderProps): import("react").JSX.Element;
export type MonoFooterProps = {
    product: FerraProduct;
    home: string;
    /** Further links after GitHub, such as crates.io or npm. */
    children?: ReactNode;
};
export declare function MonoFooter({ product, home, children }: MonoFooterProps): import("react").JSX.Element;
