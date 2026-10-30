import { type ComponentPropsWithoutRef } from "react";
import type { FerraProduct } from "./FerraIdentity.js";
export type FerraContentsItem = {
    href: string;
    label: string;
    description: string;
    product?: FerraProduct;
};
export type FerraContentsProps = {
    items: readonly FerraContentsItem[];
    label?: string;
} & Omit<ComponentPropsWithoutRef<"nav">, "children">;
/** One ungrouped contents list, disclosed on small screens and scroll-aware on desktop. */
export declare function FerraContents({ items, label, className, ...props }: FerraContentsProps): import("react").JSX.Element;
